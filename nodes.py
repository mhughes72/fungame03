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


# --------------------------------------------------------------------------- #
# Moderator                                                                     #
# --------------------------------------------------------------------------- #

def moderator_node(state: RoomState) -> dict:
    participants = state["participants"]
    speakers_this_round = state.get("speakers_this_round") or []
    round_count = state.get("round_count") or 0

    remaining = [p for p in participants if p not in speakers_this_round]

    dbg.dlog("MODERATOR", f"Round {round_count} — deciding next speaker", {
        "participants":        participants,
        "spoke_this_round":    speakers_this_round or "(none yet)",
        "remaining":           remaining or "(all spoke)",
        "total_messages":      len(state.get("messages") or []),
    })

    if not remaining:
        dbg.dlog("MODERATOR", "All spoke → triggering consensus check")
        return {
            "current_speaker": "consensus_check",
            "speakers_this_round": [],
            "round_count": round_count + 1,
        }

    dbg.dlog("MODERATOR", f"Next speaker → {remaining[0]}")
    return {"current_speaker": remaining[0]}


# --------------------------------------------------------------------------- #
# Philosopher node factory                                                      #
# --------------------------------------------------------------------------- #

def make_philosopher_node(name: str):
    char = CHARACTERS[name]

    system_prompt = f"""You are {name} ({char['era']}).

Known for: {char['known_for']}
Speaking style: {char['style']}
Core beliefs: {char['core_beliefs']}

You are seated in a room with other great minds, engaging in open discussion.
Rules:
- Stay completely in character at all times.
- Keep your response to 3–5 sentences.
- React directly to what others have just said, addressing them by name when relevant.
- You may agree, disagree, build on, or challenge — but make it feel like genuine dialogue.
- Do not break the fourth wall or reference being an AI."""

    def node(state: RoomState) -> dict:
        history = state["messages"]
        topic = state["topic"]
        speakers_this_round = state.get("speakers_this_round") or []

        user_prompt = (
            f'The topic under discussion is: "{topic}"\n\n'
            f"It is your turn to speak. Respond as {name}."
        )

        messages = (
            [SystemMessage(content=system_prompt)]
            + list(history)
            + [HumanMessage(content=user_prompt)]
        )

        dbg.dlog("PHILOSOPHER", f"{name} — invoking LLM", {
            "topic":            topic,
            "history_length":   len(history),
            "total_messages":   len(messages),
            "system_prompt":    system_prompt[:120] + "…",
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

class _ConsensusResult(BaseModel):
    reached: bool
    summary: str
    points_of_agreement: list[str]
    remaining_disagreements: list[str]


def consensus_checker_node(state: RoomState) -> dict:
    messages = state["messages"]
    topic = state["topic"]
    round_count = state.get("round_count") or 1

    # Only look at the last ~12 messages for recency
    recent = messages[-12:]
    transcript = "\n\n".join(
        f"{m.name or 'User'}: {m.content}"
        for m in recent
        if hasattr(m, "content")
    )

    prompt = (
        f'Topic: "{topic}"\nRound: {round_count}\n\n'
        f"Transcript:\n{transcript}\n\n"
        "Have the participants reached meaningful consensus or meaningful convergence on any key points? "
        "Be strict: consensus means genuine agreement, not just everyone having spoken."
    )

    dbg.dlog("CONSENSUS", f"Checking after round {round_count}", {
        "total_messages":   len(messages),
        "messages_sampled": len(recent),
        "transcript_chars": len(transcript),
    })
    dbg.dlog("CONSENSUS", "Transcript sent to checker", transcript)

    result: _ConsensusResult = _structured_llm().with_structured_output(
        _ConsensusResult
    ).invoke(
        [
            SystemMessage(
                content="You analyze philosophical conversations for intellectual consensus."
            ),
            HumanMessage(content=prompt),
        ]
    )

    dbg.dlog("CONSENSUS", f"Result — reached={result.reached}", {
        "summary":                  result.summary,
        "points_of_agreement":      result.points_of_agreement or "(none)",
        "remaining_disagreements":  result.remaining_disagreements or "(none)",
    })

    return {
        "consensus": result.reached,
        "consensus_summary": result.summary,
        "points_of_agreement": result.points_of_agreement,
        "remaining_disagreements": result.remaining_disagreements,
    }
