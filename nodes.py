import time
import random
import warnings
from concurrent.futures import ThreadPoolExecutor, as_completed

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from pydantic import BaseModel

from state import RoomState
from personas import CHARACTERS
import debug as dbg


def _chat_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.85)

def _structured_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.1)

def _selector_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

def _moderator_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.7)


def turns_per_batch(participant_count: int) -> int:
    """Philosopher turns per graph batch — triggers a steer exit."""
    return participant_count * 2

def turns_per_consensus(participant_count: int) -> int:
    """Philosopher turns between full consensus checks (every 3 batches)."""
    return participant_count * 6


# --------------------------------------------------------------------------- #
# Philosopher prompt builders                                                   #
# --------------------------------------------------------------------------- #

def _philosopher_system_prompt(
    name: str,
    participants: list[str],
    partial_agreements: list[dict],
    own_summary: str = "",
) -> str:
    char = CHARACTERS[name]

    coalition_section = ""
    if partial_agreements:
        allied, opposing = [], []
        for a in partial_agreements:
            if name in a["participants"]:
                others = [p for p in a["participants"] if p != name]
                allied.append(f"  - You and {', '.join(others)} are converging on: {a['on']}")
            else:
                allied_names = " and ".join(a["participants"])
                opposing.append(f"  - {allied_names} are converging on: {a['on']}")
        if allied:
            coalition_section += (
                f"\n\nYou are part of an emerging alignment:\n" + "\n".join(allied) + "\n"
                "When relevant, deepen this common ground and try to bring others around to it."
            )
        if opposing:
            coalition_section += (
                f"\n\nOther participants are forming a coalition you are NOT part of:\n"
                + "\n".join(opposing) + "\n"
                "Challenge this alliance — find the flaw in their shared position or drive a wedge."
            )

    # Once a character has an established debate arc, drop the verbose reference
    # sections — voice and obsessions are already evident in what they've said.
    if own_summary:
        reference_sections = (
            f"Core beliefs:\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"\nYour debate arc so far (first person):\n{own_summary}\n"
        )
    else:
        reference_sections = (
            f"Core beliefs:\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"Works and ideas you may draw from:\n{char['cite_these']}\n\n"
            f"What fires you up:\n{char['hot_topics']}\n"
        )

    return (
        f"You are {name} ({char['era']}).\n\n"
        f"Known for: {char['known_for']}\n\n"
        f"{reference_sections}"
        f"{coalition_section}\n\n"
        "You are seated in a room with these specific thinkers, engaging in open discussion.\n"
        "Rules:\n"
        "- Stay completely in character. Do not break the fourth wall or mention being an AI.\n"
        "- Keep your response to 2–3 sentences. Be sharp, not exhaustive.\n"
        "- Address ONE person or ONE idea per turn — do not survey the whole room.\n"
        "- NEVER restate a point you have already made. The conversation must move forward.\n"
        "- Engage with the specific argument just made — not the topic in general.\n"
        "- Stay anchored to the central question. Sub-arguments must serve as evidence toward it — not replace it.\n"
        "- Do not assume the answer to the question. If the topic is a question, treat it as genuinely open.\n"
        "- Deploy your signature rhetorical style every response, not just occasionally.\n"
        "- When someone touches your hot topics, let your conviction show.\n"
        "- Use your cited works naturally, as a thinker would — not as a list."
    )


_CONCESSION_SIGNALS = {
    "perhaps", "i grant", "you raise", "i admit", "that is fair", "fair point",
    "i concede", "you are right", "granted", "i acknowledge", "true enough",
    "well said", "you make a point", "i'll grant", "i cannot deny",
}

_CONCESSION_THRESHOLD = 8  # turns before no-concession pressure kicks in


def _philosopher_user_prompt(
    name: str,
    history: list,
    topic: str,
    argument_log: dict | None = None,
    turn_count: int = 0,
    concession_counts: dict | None = None,
) -> str:
    safe_name = name.replace(" ", "_")

    last_msg = history[-1] if history else None
    if last_msg and hasattr(last_msg, "content") and last_msg.name != safe_name:
        last_speaker = (last_msg.name or "Someone").replace("_", " ")
        last_said = last_msg.content[:300]
        respond_to = (
            f'{last_speaker} just said: "{last_said}"\n\n'
            f"Respond directly to THIS argument. Do not restate your own position — "
            f"engage with what {last_speaker} specifically argued."
        )
        # Calibrate response length to the nature of the last message
        last_content = last_msg.content.strip()
        is_question = last_content.endswith("?") or last_content.count("?") >= 2
        is_short = len(last_content.split()) < 30
        is_long = len(last_content.split()) > 120
        if is_question and is_short:
            length_instruction = "LENGTH: Pointed question — answer in 1 short sentence. Blunt and direct. No qualifications."
        elif is_short:
            length_instruction = "LENGTH: Short provocation — match the energy. 1 to 2 short sentences maximum."
        elif is_long:
            length_instruction = "LENGTH: A substantial argument was made. Respond fully — 3 to 4 sentences."
        else:
            length_instruction = "LENGTH: 2 to 3 sentences."
    else:
        respond_to = "It is your turn to open or advance the debate."
        length_instruction = "LENGTH: Open with a clear position — 2 to 3 sentences."

    past_claims = (argument_log or {}).get(name, [])
    if past_claims:
        formatted = "\n".join(
            f'  - "{c[:150]}{"…" if len(c) > 150 else ""}"' for c in past_claims
        )
        no_repeat = f"\nArguments you have already made — do NOT repeat these, build further or shift ground:\n{formatted}\n"
    else:
        no_repeat = ""

    concession_pressure = ""
    if turn_count >= _CONCESSION_THRESHOLD and (concession_counts or {}).get(name, 0) == 0:
        concession_pressure = (
            "\nYou have not acknowledged any merit in your opponents' arguments. "
            "A confident thinker can grant a point without losing the debate — "
            "find something true in what was just said.\n"
        )

    return (
        f'Central question being debated: "{topic}"\n\n'
        f"{no_repeat}"
        f"{concession_pressure}"
        f"{respond_to}\n\n"
        f'Ensure your response connects back to the central question: "{topic}". '
        f"Do not assume the answer — engage with whether it is true.\n\n"
        f"IMPORTANT — {length_instruction}"
    )


# --------------------------------------------------------------------------- #
# Parallel generation + selection                                               #
# --------------------------------------------------------------------------- #

class _SelectorDecision(BaseModel):
    chosen_speaker: str
    reason: str


def _relevance_score(name: str, last_content: str) -> int:
    """Score how likely this character is to react strongly to the last message."""
    hot = CHARACTERS[name].get("hot_topics", "").lower()
    last = last_content.lower()
    hot_words = set(hot.split())
    last_words = set(last.split())
    return len(hot_words & last_words)


def _top_candidates(names: list[str], last_content: str) -> list[str]:
    """Return candidates to generate — 1 unless the top two scores are tied."""
    if len(names) <= 1:
        return names
    scored = sorted(
        [(name, _relevance_score(name, last_content)) for name in names],
        key=lambda x: x[1],
        reverse=True,
    )
    # Only generate a second candidate when scores are genuinely tied
    if len(scored) >= 2 and scored[0][1] == scored[1][1]:
        return [scored[0][0], scored[1][0]]
    return [scored[0][0]]


_CANDIDATE_HISTORY = 6  # max messages passed to each candidate call


def _trim_history(history: list) -> list:
    """Keep any leading summary block + the most recent N messages."""
    if not history:
        return history
    # Preserve a leading SystemMessage summary if present
    if isinstance(history[0], SystemMessage) and history[0].content.startswith("[DEBATE SUMMARY"):
        return [history[0]] + history[1:][-_CANDIDATE_HISTORY:]
    return history[-_CANDIDATE_HISTORY:]


def _generate_candidate(name: str, state: RoomState) -> dict:
    """Generate one philosopher's response. Designed to run in a thread."""
    participants       = state.get("participants") or []
    partial_agreements = state.get("partial_agreements") or []
    history            = _trim_history(state["messages"])
    topic              = state["topic"]

    argument_log        = state.get("argument_log") or {}
    concession_counts   = state.get("concession_counts") or {}
    character_summaries = state.get("character_summaries") or {}
    turn_count          = state.get("turn_count") or 0
    own_summary         = character_summaries.get(name, "")
    system_prompt = _philosopher_system_prompt(name, participants, partial_agreements, own_summary)
    user_prompt   = _philosopher_user_prompt(
        name, state["messages"], topic, argument_log, turn_count, concession_counts
    )

    messages = (
        [SystemMessage(content=system_prompt)]
        + list(history)
        + [HumanMessage(content=user_prompt)]
    )

    dbg.dlog("PHILOSOPHER", f"{name} — generating candidate")

    safe_name = name.replace(" ", "_")
    for attempt in range(4):
        try:
            response = _chat_llm().invoke(messages)
            content = response.content.strip()
            # Reject degenerate outputs: too short or just echoing the character's name
            if len(content) < 30 or content.replace(" ", "_") == safe_name:
                dbg.dlog("PHILOSOPHER", f"{name} — degenerate output, retrying (attempt {attempt + 1}): {content!r}")
                continue
            break
        except Exception as e:
            if "429" in str(e) or "rate_limit" in str(e).lower():
                wait = (attempt + 1) * 8 + random.uniform(0, 3)
                dbg.dlog("PHILOSOPHER", f"{name} — rate limit, retrying in {wait:.1f}s (attempt {attempt + 1})")
                time.sleep(wait)
            else:
                raise
    else:
        raise RuntimeError(f"{name}: failed after 4 attempts")

    usage = getattr(response, "usage_metadata", None)
    dbg.dlog("PHILOSOPHER", f"{name} — done", {
        "tokens_in":  getattr(usage, "input_tokens", "n/a"),
        "tokens_out": getattr(usage, "output_tokens", "n/a"),
        "preview":    content[:100] + ("…" if len(content) > 100 else ""),
    })

    return {
        "name":      name,
        "safe_name": safe_name,
        "content":   content,
    }


def _select_winner(candidates: list[dict], state: RoomState) -> dict:
    """Use a fast LLM to pick the most dramatically compelling response."""
    if len(candidates) == 1:
        dbg.dlog("MODERATOR", f"Only one candidate — auto-selecting {candidates[0]['name']}")
        return candidates[0]

    messages        = state.get("messages") or []
    recent_speakers = state.get("recent_speakers") or []
    last_msg        = messages[-1] if messages else None
    last_speaker    = ""
    last_said       = ""
    if last_msg and hasattr(last_msg, "content"):
        last_speaker = (last_msg.name or "").replace("_", " ")
        last_said    = last_msg.content[:400]

    # Detect if two people have been dominating — tell the selector to break it up
    recent_unique = list(dict.fromkeys(recent_speakers[-6:]))  # order-preserving dedupe
    ping_pong_warning = ""
    if len(set(recent_speakers[-6:])) <= 2 and len(recent_speakers) >= 4:
        locked = list(set(recent_speakers[-4:]))
        fresh  = [c["name"] for c in candidates if c["name"] not in locked]
        if fresh:
            ping_pong_warning = (
                f"\n\nIMPORTANT: {' and '.join(locked)} have been dominating the last several turns. "
                f"Strongly prefer a response from {' or '.join(fresh)} to bring fresh perspective into the debate.\n"
            )

    candidates_text = "\n\n".join(
        f'[{c["name"]}]: "{c["content"]}"'
        for c in candidates
    )

    prompt = (
        f'Debate topic: "{state["topic"]}"\n\n'
        f'Last said by {last_speaker}: "{last_said}"\n\n'
        f"Recent speaker order: {recent_unique}\n"
        f"Candidate responses:\n{candidates_text}\n"
        f"{ping_pong_warning}\n"
        "Choose the response that best advances the debate. Prefer the one that:\n"
        "1. Brings a genuinely new angle — not just a continuation of the same back-and-forth\n"
        "2. Most sharply engages with what was just said\n"
        "3. Feels most dramatically alive and true to that thinker's voice\n\n"
        f"Return the speaker name exactly as it appears. Valid names: "
        f"{[c['name'] for c in candidates]}"
    )

    selector_messages = [
        SystemMessage(content=(
            "You are a dramatic editor selecting the most compelling contribution "
            "to a philosophical debate. Always return a name from the provided list."
        )),
        HumanMessage(content=prompt),
    ]
    for attempt in range(4):
        try:
            decision: _SelectorDecision = _selector_llm().with_structured_output(
                _SelectorDecision
            ).invoke(selector_messages)
            break
        except Exception as e:
            if "429" in str(e) and "insufficient_quota" not in str(e):
                wait = (attempt + 1) * 8 + random.uniform(0, 3)
                dbg.dlog("MODERATOR", f"Selector rate limit, retrying in {wait:.1f}s (attempt {attempt + 1})")
                time.sleep(wait)
            else:
                raise
    else:
        raise RuntimeError("Selector failed after 4 attempts due to rate limiting")

    chosen = next(
        (c for c in candidates if c["name"] == decision.chosen_speaker),
        candidates[0],
    )

    dbg.dlog("MODERATOR", f"Selector chose {chosen['name']}", {
        "reason":     decision.reason,
        "candidates": [c["name"] for c in candidates],
        "rejected":   [c["name"] for c in candidates if c["name"] != chosen["name"]],
    })

    return chosen


# --------------------------------------------------------------------------- #
# Graph nodes                                                                   #
# --------------------------------------------------------------------------- #

def moderator_node(state: RoomState) -> dict:
    """Decide whether to continue, steer-exit, or trigger a consensus check."""
    participants = state["participants"]
    turn_count   = state.get("turn_count") or 0
    n            = len(participants)

    if turn_count > 0 and turn_count % turns_per_consensus(n) == 0:
        dbg.dlog("MODERATOR", f"Turn {turn_count} — triggering consensus check")
        return {"current_speaker": "consensus_check", "turn_count": turn_count + 1}

    if turn_count > 0 and turn_count % turns_per_batch(n) == 0:
        dbg.dlog("MODERATOR", f"Turn {turn_count} — steer exit")
        return {"current_speaker": "__steer__", "turn_count": turn_count + 1}

    dbg.dlog("MODERATOR", f"Turn {turn_count} — starting parallel generation")
    return {"current_speaker": "__turn__"}


def parallel_turn_node(state: RoomState) -> dict:
    """Generate responses from all eligible participants in parallel, select the best."""
    participants    = state["participants"]
    recent_speakers = state.get("recent_speakers") or []
    turn_count      = state.get("turn_count") or 0
    last_speaker    = recent_speakers[-1] if recent_speakers else ""

    # Everyone except the last speaker is eligible
    eligible = [p for p in participants if p != last_speaker]

    # Narrow to top-2 by hot-topic relevance to keep token usage manageable
    messages_list  = state.get("messages") or []
    last_content   = messages_list[-1].content if messages_list else ""
    candidates_names = _top_candidates(eligible, last_content)

    dbg.dlog("MODERATOR", "Parallel generation", {
        "eligible":   eligible,
        "candidates": candidates_names,
        "excluded":   last_speaker or "(none)",
    })

    # Generate all responses in parallel
    with ThreadPoolExecutor(max_workers=len(candidates_names)) as executor:
        futures = {
            executor.submit(_generate_candidate, name, state): name
            for name in candidates_names
        }
        responses = [f.result() for f in as_completed(futures)]

    winner = _select_winner(responses, state)

    new_recent = (recent_speakers + [winner["name"]])[-6:]

    argument_log = dict(state.get("argument_log") or {})
    prev = list(argument_log.get(winner["name"], []))
    argument_log[winner["name"]] = (prev + [winner["content"]])[-3:]

    concession_counts = dict(state.get("concession_counts") or {})
    if any(signal in winner["content"].lower() for signal in _CONCESSION_SIGNALS):
        concession_counts[winner["name"]] = concession_counts.get(winner["name"], 0) + 1
        dbg.dlog("PHILOSOPHER", f"{winner['name']} conceded — total {concession_counts[winner['name']]}")

    return {
        "messages":          [AIMessage(content=winner["content"], name=winner["safe_name"])],
        "current_speaker":    winner["name"],
        "recent_speakers":    new_recent,
        "turn_count":         turn_count + 1,
        "argument_log":       argument_log,
        "concession_counts":  concession_counts,
    }


# --------------------------------------------------------------------------- #
# Consensus checker                                                             #
# --------------------------------------------------------------------------- #

class _PartialAgreement(BaseModel):
    participants: list[str]
    on: str


class _Tension(BaseModel):
    topic: str           # what they disagree on
    participant_a: str   # first participant's name
    stance_a: str        # their position in one short phrase
    participant_b: str   # second participant's name
    stance_b: str        # their position in one short phrase


class _ConsensusResult(BaseModel):
    full_consensus: bool
    full_summary: str
    partial_agreements: list[_PartialAgreement]
    dissenters: list[str]
    points_of_agreement: list[str]
    remaining_disagreements: list[_Tension]


def consensus_checker_node(state: RoomState) -> dict:
    messages     = state["messages"]
    topic        = state["topic"]
    turn_count   = state.get("turn_count") or 0
    participants = state["participants"]

    recent     = messages[-12:]
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
        "Analyze this conversation carefully. Focus ONLY on the main topic — ignore tangents.\n"
        "1. Has the FULL group reached meaningful consensus on the main topic? Be strict — everyone must genuinely agree.\n"
        "2. Are there PARTIAL agreements — subsets of 2+ participants (but NOT all participants) converging on something "
        "directly related to the main topic?\n"
        "3. Who are the dissenters — participants not part of any emerging agreement?\n"
        "4. What are the remaining points of contention ABOUT THE MAIN TOPIC specifically? "
        "For each tension, name the two participants on opposing sides and capture each person's actual stance in a short phrase.\n\n"
        f"IMPORTANT: `points_of_agreement` must only contain things ALL {len(participants)} participants agree on. "
        "If only a subset agrees, it belongs in `partial_agreements` only — not both."
    )

    dbg.dlog("CONSENSUS", f"Checking at turn {turn_count}", {
        "total_messages":   len(messages),
        "messages_sampled": len(recent),
        "transcript_chars": len(transcript),
    })

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
    tensions = [
        {
            "topic": t.topic,
            "participant_a": t.participant_a, "stance_a": t.stance_a,
            "participant_b": t.participant_b, "stance_b": t.stance_b,
        }
        for t in result.remaining_disagreements
    ]

    dbg.dlog("CONSENSUS", f"Result — full={result.full_consensus}, partial={len(partial)}", {
        "full_summary":            result.full_summary,
        "partial_agreements":      partial or "(none)",
        "dissenters":              result.dissenters or "(none)",
        "remaining_disagreements": tensions or "(none)",
    })

    return {
        "consensus":               result.full_consensus,
        "consensus_summary":       result.full_summary,
        "partial_agreements":      partial,
        "points_of_agreement":     result.points_of_agreement,
        "remaining_disagreements": tensions,
    }


# --------------------------------------------------------------------------- #
# History summarizer                                                            #
# --------------------------------------------------------------------------- #

_SUMMARIZE_AFTER = 14   # summarize sooner to keep context lean
_KEEP_RECENT     = 6


def summarize_history(messages: list, topic: str) -> list:
    """Compress old messages into a summary, keeping the most recent ones intact."""
    if len(messages) <= _SUMMARIZE_AFTER:
        return messages

    to_summarize = messages[:-_KEEP_RECENT]
    to_keep      = messages[-_KEEP_RECENT:]

    transcript = "\n\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in to_summarize
        if hasattr(m, "content")
    )

    dbg.dlog("STATE", f"Summarizing {len(to_summarize)} messages → 1 summary block")

    response = _structured_llm().invoke([
        SystemMessage(content="You summarize philosophical debates concisely and accurately."),
        HumanMessage(content=(
            f'Topic: "{topic}"\n\n'
            f"Summarize the debate below. Preserve:\n"
            f"- Each participant's key arguments and how they evolved\n"
            f"- Important moments of agreement, conflict, or shift\n"
            f"- Any notable formulations or turning points\n"
            f"Write in third person, 150–250 words.\n\n"
            f"Transcript:\n{transcript}"
        )),
    ])

    summary_msg = SystemMessage(
        content=(
            f"[DEBATE SUMMARY — {len(to_summarize)} earlier messages]\n\n"
            f"{response.content}"
        )
    )

    dbg.dlog("STATE", "Summary produced", response.content[:200])

    return [summary_msg] + list(to_keep)


def generate_character_summaries(state: RoomState) -> dict:
    """Generate a first-person debate arc summary for each participant, in parallel."""
    participants = state["participants"]
    topic        = state["topic"]
    messages     = state["messages"]

    transcript = "\n\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in messages
        if hasattr(m, "content") and not m.content.startswith("[DEBATE SUMMARY")
    )

    def _summarize_for(name: str) -> tuple[str, str]:
        prompt = (
            f'Topic: "{topic}"\n\n'
            f"Transcript:\n{transcript}\n\n"
            f"Write a concise first-person summary for {name} covering:\n"
            f"- The main arguments you have made and how they evolved\n"
            f"- Any positions you have shifted or conceded\n"
            f"- What you are currently defending\n"
            f"- Key tensions you face from other participants\n\n"
            f"Write as {name} reflecting on their own participation. 60–80 words."
        )
        response = _chat_llm().invoke([
            SystemMessage(content=f"You write concise first-person debate summaries in the voice of historical figures."),
            HumanMessage(content=prompt),
        ])
        return name, response.content.strip()

    dbg.dlog("STATE", f"Generating per-character summaries for {participants}")

    with ThreadPoolExecutor(max_workers=len(participants)) as executor:
        futures = [executor.submit(_summarize_for, name) for name in participants]
        results = dict(f.result() for f in as_completed(futures))

    dbg.dlog("STATE", "Character summaries generated", {k: v[:80] for k, v in results.items()})
    return results


# --------------------------------------------------------------------------- #
# Moderator steer                                                               #
# --------------------------------------------------------------------------- #

def generate_moderator_steer(state: RoomState) -> str:
    """Generate a Socratic steering question to nudge the debate toward consensus."""
    topic                   = state["topic"]
    participants            = state["participants"]
    partial_agreements      = state.get("partial_agreements") or []
    points_of_agreement     = state.get("points_of_agreement") or []
    remaining_disagreements = state.get("remaining_disagreements") or []
    turn_count              = state.get("turn_count") or 0
    messages                = state.get("messages") or []
    concession_counts       = state.get("concession_counts") or {}

    recent_text = "\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in messages[-4:]
        if hasattr(m, "content")
    )

    agreement_lines = []
    if points_of_agreement:
        agreement_lines.append("Points everyone agrees on:\n" + "\n".join(f"  - {p}" for p in points_of_agreement))
    if partial_agreements:
        agreement_lines.append("Emerging alignments:\n" + "\n".join(
            f"  - {' and '.join(a['participants'])}: {a['on']}" for a in partial_agreements
        ))
    if remaining_disagreements:
        formatted = "\n".join(
            f"  - {t['topic']}: {t['participant_a']} ({t['stance_a']}) vs {t['participant_b']} ({t['stance_b']})"
            if isinstance(t, dict) else f"  - {t}"
            for t in remaining_disagreements
        )
        agreement_lines.append(f"Still contested:\n{formatted}")

    agreement_context = "\n\n".join(agreement_lines) + "\n\n" if agreement_lines else ""

    # Identify the most entrenched participant to target
    targeting = ""
    if turn_count >= _CONCESSION_THRESHOLD:
        entrenched = min(participants, key=lambda p: concession_counts.get(p, 0))
        others = [p for p in participants if p != entrenched]
        targeting = (
            f"\nThe most entrenched participant so far is {entrenched} "
            f"({concession_counts.get(entrenched, 0)} concessions). "
            f"Address them by name and build a specific bridge from {others[0] if others else 'another participant'}'s "
            f"argument to a position {entrenched} might be able to accept — without asking them to abandon their core view.\n"
        )

    style = state.get("moderator_style") or "socratic"

    _style_configs = {
        "socratic": (
            "You are a sharp Socratic moderator guiding a philosophical debate toward resolution.",
            "You are a Socratic moderator. Generate ONE short, sharp question or reframing "
            "that could help these thinkers find common ground. "
            "If partial agreements exist, try to extend them or test whether they hold more broadly. "
            "If no agreements exist, find the most promising tension and reframe it as a question both sides must answer. "
            "Be direct and specific — name names, reference actual arguments just made. "
            "1–2 sentences only."
        ),
        "combative": (
            "You are a hard-hitting debate moderator who forces participants to confront the weakest parts of their arguments.",
            "You are a combative moderator who exposes contradictions and forces hard choices. "
            "Name the sharpest contradiction in what was just said, call out the participant who is being evasive "
            "or repetitive by name, and demand they either defend their position or concede the point. "
            "Ask what it would cost them to admit they are wrong. "
            "Be blunt, pointed, and uncomfortable. 1–2 sentences only."
        ),
        "devil's advocate": (
            "You are a devil's advocate moderator who stress-tests every emerging agreement.",
            "Identify whatever position or agreement is currently gaining the most momentum, "
            "then argue forcefully against it — regardless of its merits. "
            "Your goal is to make the room defend ground they think is already won. "
            "Name the position, then attack it directly. 1–2 sentences only."
        ),
        "koan": (
            "You are a Zen moderator who disrupts overconfidence with unanswerable questions.",
            "Identify the most verbose or confident participant and throw an oblique, disorienting question at them — "
            "one that doesn't resolve neatly into their framework. "
            "The question should create productive confusion, not invite more argument. Paradox is welcome. "
            "Address them by name. 1–2 sentences only."
        ),
        "journalist": (
            "You are a hard-nosed journalist moderator who cuts through abstraction.",
            "Pick the participant who has been most vague or evasive and demand they state their actual position "
            "in one concrete, specific sentence — no analogies, no qualifications, no appeals to history or tradition. "
            "Hold them to what they actually believe right now. Address them by name. 1–2 sentences only."
        ),
        "straw man": (
            "You are a provocateur moderator who uses misrepresentation to force clarity.",
            "Deliberately present a slightly weakened, oversimplified version of one participant's argument — "
            "make it sound a little absurd or reductive. This forces them to correct you and articulate their real position more precisely. "
            "Be plausible enough that it stings. Address them by name. 1–2 sentences only."
        ),
        "steel man": (
            "You are a steel man moderator who forces genuine engagement with opposing views.",
            "Demand that one participant — preferably the one most opposed to the last speaker — "
            "state the strongest possible version of their opponent's argument, in their opponent's own terms, "
            "before they are allowed to respond with their own view. "
            "Address them by name. 1–2 sentences only."
        ),
    }

    system_msg, style_instruction = _style_configs.get(style, _style_configs["socratic"])

    prompt = (
        f'Debate topic: "{topic}"\n'
        f"Participants: {', '.join(participants)}\n"
        f"Turn: {turn_count}\n\n"
        f"{agreement_context}"
        f"Recent exchange:\n{recent_text}\n"
        f"{targeting}\n"
        f"{style_instruction}"
    )

    dbg.dlog("MODERATOR", f"Generating steer at turn {turn_count} (style: {style})")

    response = _moderator_llm().invoke([
        SystemMessage(content=system_msg),
        HumanMessage(content=prompt),
    ])

    dbg.dlog("MODERATOR", "Steer generated", response.content[:200])
    return response.content.strip()
