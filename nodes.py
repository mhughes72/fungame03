from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from pydantic import BaseModel

from state import RoomState
from personas import CHARACTERS
import debug as dbg

def _chat_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.85)

def _structured_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.1)

def _moderator_llm():
    # Fast/cheap model — routing decisions don't need gpt-4o quality
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.3)


# How many turns between consensus checks — 3 full "rounds" worth per participant count
def turns_per_check(participant_count: int) -> int:
    return participant_count * 3


class _ModeratorDecision(BaseModel):
    next_speaker: str
    reason: str


# --------------------------------------------------------------------------- #
# Moderator                                                                     #
# --------------------------------------------------------------------------- #

def moderator_node(state: RoomState) -> dict:
    participants = state["participants"]
    recent_speakers = state.get("recent_speakers") or []
    turn_count = state.get("turn_count") or 0

    # Trigger consensus check every N turns, scaled to participant count
    if turn_count > 0 and turn_count % turns_per_check(len(participants)) == 0:
        dbg.dlog("MODERATOR", f"Turn {turn_count} — triggering consensus check")
        return {"current_speaker": "consensus_check"}

    messages = state.get("messages") or []
    last_messages = messages[-4:]
    transcript = "\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content[:300]}"
        for m in last_messages
        if hasattr(m, "content")
    ) or "(the debate is just beginning)"

    persona_hints = "\n".join(
        f"  {name}: {CHARACTERS[name]['hot_topics'][:120]}"
        for name in participants
    )

    recency = recent_speakers[-3:] if recent_speakers else []

    # Surface any known partial agreements so the moderator can route dissenters at coalitions
    partial_agreements = state.get("partial_agreements") or []
    coalitions_section = ""
    if partial_agreements:
        lines = "\n".join(
            f"  {' + '.join(p['participants'])} agree on: {p['on']}"
            for p in partial_agreements
        )
        coalitions_section = (
            f"\nEmerging coalitions (consider routing a dissenter to challenge these):\n{lines}\n"
        )

    prompt = (
        f"Participants: {', '.join(participants)}\n\n"
        f"Recent exchange:\n{transcript}\n\n"
        f"Spoke recently — give them a break unless directly challenged: {recency or 'no one yet'}\n\n"
        f"What fires each participant up:\n{persona_hints}\n"
        f"{coalitions_section}\n"
        f"Who should speak next? Prioritize:\n"
        f"1. Someone who was directly challenged, named, or had their beliefs attacked\n"
        f"2. A dissenter who should push back on an emerging coalition\n"
        f"3. Someone whose hot topics were just touched\n"
        f"4. Someone who hasn't spoken recently\n\n"
        f"You MUST pick one name exactly from this list: {participants}"
    )

    decision: _ModeratorDecision = _moderator_llm().with_structured_output(
        _ModeratorDecision
    ).invoke([
        SystemMessage(content=(
            "You are a debate moderator. Keep the conversation reactive and dynamic. "
            "Always return a name that appears exactly in the participants list."
        )),
        HumanMessage(content=prompt),
    ])

    next_speaker = decision.next_speaker
    # Validate — fallback to least-recently-spoken if the LLM drifts
    if next_speaker not in participants:
        dbg.dlog("MODERATOR", f"Invalid speaker '{next_speaker}' — falling back")
        next_speaker = next(
            (p for p in participants if p not in recent_speakers[-2:]),
            participants[0],
        )

    new_recent = (recent_speakers + [next_speaker])[-6:]

    dbg.dlog("MODERATOR", f"Turn {turn_count} → {next_speaker}", {
        "reason":          decision.reason,
        "recent_speakers": recency,
        "turn_count":      turn_count,
    })

    return {
        "current_speaker": next_speaker,
        "recent_speakers": new_recent,
        "turn_count": turn_count + 1,
    }


# --------------------------------------------------------------------------- #
# Philosopher node factory                                                      #
# --------------------------------------------------------------------------- #

def make_philosopher_node(name: str):
    char = CHARACTERS[name]

    # Build inter-character dynamics section only for participants in this room
    def _build_system_prompt(participants: list[str]) -> str:
        dynamics = char.get("dynamics", {})
        relevant = {k: v for k, v in dynamics.items() if k in participants}
        dynamics_section = ""
        if relevant:
            lines = "\n".join(f"  - {k}: {v}" for k, v in relevant.items())
            dynamics_section = f"\nYour relationships with others in this room:\n{lines}\n"

        return f"""You are {name} ({char['era']}).

Known for: {char['known_for']}

Core beliefs:
{char['core_beliefs']}

How you speak and argue:
{char['rhetorical_moves']}

Works and ideas you may draw from:
{char['cite_these']}

What fires you up:
{char['hot_topics']}
{dynamics_section}
You are seated in a room with these specific thinkers, engaging in open discussion.
Rules:
- Stay completely in character. Do not break the fourth wall or mention being an AI.
- Keep your response to 3–5 sentences.
- React directly to what others have just said — use their names.
- Deploy your signature rhetorical style every response, not just occasionally.
- When someone touches your hot topics, let your conviction show.
- Use your cited works naturally, as a thinker would — not as a list."""

    def node(state: RoomState) -> dict:
        history = state["messages"]
        topic = state["topic"]
        participants = state.get("participants") or []

        prompt = _build_system_prompt(participants)

        user_prompt = (
            f'The topic under discussion is: "{topic}"\n\n'
            f"It is your turn to speak. Respond as {name}."
        )

        messages = (
            [SystemMessage(content=prompt)]
            + list(history)
            + [HumanMessage(content=user_prompt)]
        )

        dbg.dlog("PHILOSOPHER", f"{name} — invoking LLM", {
            "topic":            topic,
            "history_length":   len(history),
            "total_messages":   len(messages),
            "system_prompt":    prompt[:120] + "…",
            "user_prompt":      user_prompt,
        })

        response = _chat_llm().invoke(messages)

        usage = getattr(response, "usage_metadata", None)
        dbg.dlog("PHILOSOPHER", f"{name} — response received", {
            "response_length":  len(response.content),
            "tokens_in":        getattr(usage, "input_tokens", "n/a"),
            "tokens_out":       getattr(usage, "output_tokens", "n/a"),
            "preview":          response.content[:120] + ("…" if len(response.content) > 120 else ""),
        })

        safe_name = name.replace(" ", "_")
        return {
            "messages": [AIMessage(content=response.content, name=safe_name)],
            "speakers_this_round": speakers_this_round + [name],
        }

    node.__name__ = f"philosopher_{name.lower().replace(' ', '_')}"
    return node


# --------------------------------------------------------------------------- #
# Consensus checker                                                             #
# --------------------------------------------------------------------------- #

class _PartialAgreement(BaseModel):
    participants: list[str]   # e.g. ["Socrates", "Marx"]
    on: str                   # what they agree on


class _ConsensusResult(BaseModel):
    full_consensus: bool
    full_summary: str
    partial_agreements: list[_PartialAgreement]
    dissenters: list[str]            # participants not yet in any agreement
    points_of_agreement: list[str]
    remaining_disagreements: list[str]


def consensus_checker_node(state: RoomState) -> dict:
    messages = state["messages"]
    topic = state["topic"]
    turn_count = state.get("turn_count") or 0
    participants = state["participants"]

    recent = messages[-12:]
    transcript = "\n\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in recent
        if hasattr(m, "content")
    )

    prompt = (
        f'Topic: "{topic}"\n'
        f"Participants: {', '.join(participants)}\n"
        f"Turn: {turn_count}\n\n"
        f"Transcript:\n{transcript}\n\n"
        "Analyze this conversation carefully:\n"
        "1. Has the FULL group reached meaningful consensus? Be strict — everyone must genuinely agree.\n"
        "2. Are there PARTIAL agreements — subsets of 2+ participants converging on something "
        "while others disagree or haven't engaged? List each subset and what they agree on.\n"
        "3. Who are the dissenters — participants not part of any emerging agreement?\n"
        "4. What are the remaining points of contention?"
    )

    dbg.dlog("CONSENSUS", f"Checking at turn {turn_count}", {
        "total_messages":   len(messages),
        "messages_sampled": len(recent),
        "transcript_chars": len(transcript),
    })
    dbg.dlog("CONSENSUS", "Transcript sent to checker", transcript)

    result: _ConsensusResult = _structured_llm().with_structured_output(
        _ConsensusResult
    ).invoke([
        SystemMessage(content=(
            "You are an expert analyst of philosophical debates. "
            "Detect both full group consensus and partial agreements between subsets of participants."
        )),
        HumanMessage(content=prompt),
    ])

    partial = [{"participants": p.participants, "on": p.on} for p in result.partial_agreements]

    dbg.dlog("CONSENSUS", f"Result — full={result.full_consensus}, partial={len(partial)}", {
        "full_summary":             result.full_summary,
        "partial_agreements":       partial or "(none)",
        "dissenters":               result.dissenters or "(none)",
        "remaining_disagreements":  result.remaining_disagreements or "(none)",
    })

    return {
        "consensus":                result.full_consensus,
        "consensus_summary":        result.full_summary,
        "partial_agreements":       partial,
        "points_of_agreement":      result.points_of_agreement,
        "remaining_disagreements":  result.remaining_disagreements,
    }
