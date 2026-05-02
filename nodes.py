import re
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

from prompts import (
    _CONCESSION_THRESHOLD,
    _BACKCHANNEL_CHANCE,
    _heat_description,
    _philosopher_system_prompt,
    _philosopher_user_prompt,
)
from scoring import _top_candidates, _select_winner
from summarization import summarize_history, generate_character_summaries


def _chat_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.85)

def _structured_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.1)

def _moderator_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.7)


class _HeatScore(BaseModel):
    delta: int       # +1 combative, -1 concession/agreement, 0 neutral
    conceded: bool   # true when the speaker grants a point to an opponent


def _score_heat(speaker: str, content: str) -> _HeatScore:
    """Ask gpt-4o-mini to classify a philosopher's response for heat tracking."""
    try:
        result = ChatOpenAI(model="gpt-4o-mini", temperature=0).with_structured_output(
            _HeatScore
        ).invoke([
            SystemMessage(content=(
                "You are scoring a single debate response for emotional tone.\n"
                "Return delta=1 if the speaker is combative: attacking, dismissing, mocking, "
                "or aggressively challenging an opponent's position.\n"
                "Return delta=-1 if the speaker concedes or genuinely agrees with an opponent: "
                "grants a point, acknowledges merit, softens their stance.\n"
                "Return delta=0 if the tone is neutral, expository, or neither.\n"
                "Return conceded=true only when delta=-1.\n"
                "Be strict — mild disagreement is 0, not +1."
            )),
            HumanMessage(content=f"{speaker} said:\n\n{content[:600]}"),
        ])
        return result
    except Exception:
        return _HeatScore(delta=0, conceded=False)


def turns_per_batch(participant_count: int) -> int:
    """Philosopher turns per graph batch — triggers a steer exit."""
    return participant_count * 2

def turns_per_consensus(participant_count: int) -> int:
    return participant_count * 2


# --------------------------------------------------------------------------- #
# Candidate generation                                                          #
# --------------------------------------------------------------------------- #

def _generate_backchannel(reactor: str, winner_content: str) -> str | None:
    """Generate a short aside from a non-speaking participant. Returns None to skip."""
    system = (
        f"You are {reactor}. Someone else is speaking in a debate and you are listening. "
        f"React to what they just said with a brief aside — scorn, amusement, surprise, or a sharp one-liner. "
        f"Maximum 8 words. Can be just a word or two. Stay completely in character. No full paragraphs."
    )
    try:
        response = _chat_llm().invoke([
            SystemMessage(content=system),
            HumanMessage(content=f'They just said: "{winner_content[:300]}"'),
        ])
        content = response.content.strip().strip('"')
        if len(content.split()) > 12:
            return None
        return content
    except Exception:
        return None


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
    concession_log      = state.get("concession_log") or {}
    challenge_counts    = state.get("challenge_counts") or {}
    character_summaries = state.get("character_summaries") or {}
    turn_count          = state.get("turn_count") or 0
    own_summary         = character_summaries.get(name, "")
    heat                = state.get("heat") or 0
    evidence_this_turn  = state.get("evidence_this_turn") or ""
    drunk_levels        = state.get("drunk_levels") or {}
    drunk_level         = drunk_levels.get(name, 0)
    if drunk_level:
        dbg.dlog("PHILOSOPHER", f"{name} — drunk level {drunk_level}")
    system_prompt = _philosopher_system_prompt(name, participants, partial_agreements, own_summary, heat, evidence_this_turn)
    user_prompt   = _philosopher_user_prompt(
        name, state["messages"], topic, argument_log, turn_count, concession_counts,
        concession_log, challenge_counts, drunk_level, drunk_levels,
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
            if len(content) < 8 or content.replace(" ", "_") == safe_name:
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


def detect_forced_speaker(text: str, participants: list[str]) -> str | None:
    """Return the participant named in text (by name part or alias), or None."""
    text_lower = text.lower()
    for name in participants:
        for part in name.lower().split():
            if len(part) >= 3 and part in text_lower:
                return name
        for alias in CHARACTERS.get(name, {}).get("aliases", []):
            if alias.lower() in text_lower:
                return name
    return None


# --------------------------------------------------------------------------- #
# Graph nodes                                                                   #
# --------------------------------------------------------------------------- #

def moderator_node(state: RoomState) -> dict:
    """Decide whether to continue, steer-exit, or trigger a consensus check."""
    participants = state["participants"]
    turn_count   = state.get("turn_count") or 0
    max_turns    = state.get("max_turns") or 20
    n            = len(participants)

    # Check if max turns reached — end the debate
    if turn_count >= max_turns:
        dbg.dlog("MODERATOR", f"Turn {turn_count} — max turns reached, ending debate")
        return {"current_speaker": "__max_turns__", "turn_count": turn_count + 1}

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

    messages_list = state.get("messages") or []
    forced = state.get("forced_speaker", "")

    # Skip backchannel messages when scoring relevance
    last_content = ""
    for m in reversed(messages_list):
        if hasattr(m, "name") and (m.name or "").endswith("_bc"):
            continue
        if hasattr(m, "content"):
            last_content = m.content
            break

    if forced and forced in participants:
        candidates_names = [forced]
        dbg.dlog("MODERATOR", f"Forced speaker: {forced}")
    else:
        # Everyone except the last speaker is eligible
        eligible = [p for p in participants if p != last_speaker]
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
    concession_log    = dict(state.get("concession_log") or {})
    challenge_counts  = dict(state.get("challenge_counts") or {})
    heat = state.get("heat") or 0
    prev_speaker = recent_speakers[-1] if recent_speakers else ""

    # Run heat scoring and backchannel generation in parallel
    reactor = None
    do_backchannel = turn_count > 0
    if do_backchannel:
        reactors = [p for p in participants if p != winner["name"]]
        do_backchannel = bool(reactors) and random.random() < _BACKCHANNEL_CHANCE
        if do_backchannel:
            reactor = random.choice(reactors)

    with ThreadPoolExecutor(max_workers=2) as ex:
        heat_fut = ex.submit(_score_heat, winner["name"], winner["content"])
        bc_fut   = ex.submit(_generate_backchannel, reactor, winner["content"]) if reactor else None
        score    = heat_fut.result()
        bc       = bc_fut.result() if bc_fut else None

    dbg.dlog("PHILOSOPHER", f"heat score for {winner['name']}", {
        "delta": score.delta,
        "conceded": score.conceded,
        "heat_before": heat,
        "snippet": winner["content"][:120],
    })

    if score.conceded:
        concession_counts[winner["name"]] = concession_counts.get(winner["name"], 0) + 1
        dbg.dlog("PHILOSOPHER", f"{winner['name']} conceded — total {concession_counts[winner['name']]}")
        heat = max(0, heat - 1)
        prev = list(concession_log.get(winner["name"], []))
        concession_log[winner["name"]] = (prev + [winner["content"][:160]])[-3:]
        challenge_counts[winner["name"]] = 0
    elif score.delta == 1:
        heat = min(10, heat + 1)
        if prev_speaker and prev_speaker != winner["name"]:
            challenge_counts[prev_speaker] = challenge_counts.get(prev_speaker, 0) + 1
            dbg.dlog("PHILOSOPHER", f"{prev_speaker} challenged — pressure count {challenge_counts[prev_speaker]}")

    dbg.dlog("MODERATOR", f"Heat: {heat}")

    out_msgs = [AIMessage(content=winner["content"], name=winner["safe_name"])]
    if bc:
        out_msgs.append(AIMessage(content=bc, name=reactor.replace(" ", "_") + "_bc"))
        dbg.dlog("PHILOSOPHER", f"{reactor} [aside]: {bc}")

    return {
        "messages":          out_msgs,
        "current_speaker":    winner["name"],
        "recent_speakers":    new_recent,
        "turn_count":         turn_count + 1,
        "argument_log":       argument_log,
        "concession_counts":  concession_counts,
        "concession_log":     concession_log,
        "challenge_counts":   challenge_counts,
        "forced_speaker":     "",
        "heat":               heat,
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
    drifted_topic: str    # empty if on-topic; short phrase describing actual subject if drifted
    suggested_bridge: str # one concrete sentence of latent common ground to force a yes/no commitment


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
        "If only a subset agrees, it belongs in `partial_agreements` only — not both.\n"
        f"5. Has the conversation significantly drifted from the original topic (\"{topic}\")? "
        "If the last several exchanges are primarily about a clearly different subject, set `drifted_topic` to a short phrase "
        "describing what the conversation has actually been about. If it is still on-topic, leave `drifted_topic` empty.\n"
        f"6. Identify one minimal, concrete sliver of common ground that ALL {len(participants)} participants plausibly share "
        "but have not yet explicitly committed to — even if they are still in sharp disagreement overall. "
        "Write it as a single declarative sentence naming the participants and the claim "
        "(e.g. 'Newton and Einstein both accept that mathematics correctly predicts observable phenomena, even if they disagree about what that implies.'). "
        "This will be used to force a yes/no commitment. Set `suggested_bridge` to this sentence. "
        "If no such common ground exists, leave it empty."
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
        "drifted_topic":           result.drifted_topic or "(none)",
        "suggested_bridge":        result.suggested_bridge or "(none)",
    })

    return {
        "consensus":               result.full_consensus,
        "consensus_summary":       result.full_summary,
        "partial_agreements":      partial,
        "points_of_agreement":     result.points_of_agreement,
        "remaining_disagreements": tensions,
        "drift_topic":             result.drifted_topic,
        "bridge":                  result.suggested_bridge,
    }


# --------------------------------------------------------------------------- #
# Moderator steer                                                               #
# --------------------------------------------------------------------------- #

MODERATOR_STYLES: list[tuple[str, str]] = [
    ("socratic",         "Builds bridges, seeks common ground"),
    ("combative",        "Exposes contradictions, demands concessions"),
    ("devil's advocate", "Attacks whatever position is gaining momentum"),
    ("koan",             "Oblique, unanswerable questions to disrupt overconfidence"),
    ("journalist",       "Demands one concrete sentence — no abstraction"),
    ("straw man",        "Misrepresents a position to force the speaker to clarify it"),
    ("steel man",        "Forces a participant to argue their opponent's case at its strongest"),
    ("last call",        "All-out push for consensus — finds every sliver of agreement and forces commitment"),
]

BAR_BEATS: list[str] = [
    "*[someone orders another round]*",
    "*[the candle gutters]*",
    "*[a glass is set down too hard]*",
    "*[laughter drifts in from the next table]*",
    "*[the barkeep wipes the counter without looking up]*",
    "*[rain streaks the windows]*",
    "*[a chair scrapes back]*",
    "*[the fire settles with a soft crack]*",
    "*[someone lights a cigarette and doesn't offer one]*",
    "*[a long silence from the street outside]*",
    "*[the clock above the bar ticks once]*",
    "*[a cork is pulled somewhere in the back]*",
    "*[the door swings open — cold draft — then closes]*",
    "*[ice melts in an untouched glass]*",
    "*[the lights flicker, then hold]*",
]

_STYLE_CONFIGS: dict[str, tuple[str, str]] = {
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
    "last call": (
        "You are a consensus moderator making one final, all-out push to close the debate.",
        "This is the last chance to find agreement. Identify every point — however small — where the participants "
        "have moved toward each other, even if they haven't admitted it. "
        "Name those slivers of common ground explicitly and force each participant to either commit to them or explain precisely why they cannot. "
        "Do not ask open questions — issue a direct challenge: 'You both agree on X. Say so, or explain what stops you.' "
        "Name names. Be urgent. 2–3 sentences."
    ),
}


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

    # Pick a single target to address — priority order:
    #   1. Most challenged without resolving (highest challenge_counts)
    #   2. Most entrenched (fewest concessions, past threshold)
    #   3. The most recent speaker (press immediately on what was just said)
    challenge_counts = state.get("challenge_counts") or {}
    recent_speakers  = state.get("recent_speakers") or []

    target = None
    reason = ""

    if challenge_counts:
        top = max(challenge_counts, key=lambda p: challenge_counts.get(p, 0))
        if challenge_counts.get(top, 0) >= 2:
            target = top
            reason = f"has been challenged {challenge_counts[top]} times without resolving the pressure"

    if not target and turn_count >= _CONCESSION_THRESHOLD:
        target = min(participants, key=lambda p: concession_counts.get(p, 0))
        reason = f"has made {concession_counts.get(target, 0)} concessions — the most entrenched voice in the room"

    if not target:
        # Fall back to whoever spoke most recently
        for name in reversed(recent_speakers):
            if name in participants:
                target = name
                reason = "spoke most recently"
                break

    if not target and participants:
        target = participants[0]
        reason = "participant"

    targeting = (
        f"\nYour target for this steer is: {target} ({reason}).\n"
        f"Address {target} by name — and ONLY {target}. "
        f"Do not pose questions to multiple participants. "
        f"Ask {target} one sharp, direct question they cannot dodge.\n"
    )

    heat = state.get("heat") or 0
    heat_context = f"Room atmosphere: {_heat_description(heat)}\n\n"

    bridge = state.get("bridge") or ""
    bridge_context = (
        f"\nSuggested common ground (from debate analysis): {bridge}\n"
        if bridge else ""
    )

    style = state.get("moderator_style") or "socratic"
    system_msg, style_instruction = _STYLE_CONFIGS.get(style, _STYLE_CONFIGS["socratic"])

    binary_close = (
        f"\n\nRegardless of style: your steer must end with a single direct question aimed at {target}. "
        f"State one concrete claim they must affirm or deny — no wriggle room. "
        f"Format: '{target} — [sharp, specific claim]? Yes or no, and why.' "
        "Use the suggested common ground above if it fits."
    )

    prompt = (
        f'Debate topic: "{topic}"\n'
        f"Participants: {', '.join(participants)}\n"
        f"Turn: {turn_count}\n\n"
        f"{heat_context}"
        f"{agreement_context}"
        f"{bridge_context}"
        f"Recent exchange:\n{recent_text}\n"
        f"{targeting}\n"
        f"{style_instruction}"
        f"{binary_close}"
    )

    dbg.dlog("MODERATOR", f"Generating steer at turn {turn_count} (style: {style})")

    response = _moderator_llm().invoke([
        SystemMessage(content=system_msg),
        HumanMessage(content=prompt),
    ])

    dbg.dlog("MODERATOR", "Steer generated", response.content[:200])
    return response.content.strip()


# --------------------------------------------------------------------------- #
# Commentator recap                                                             #
# --------------------------------------------------------------------------- #

_DRUNK_LABELS = {1: "one drink in", 2: "visibly tipsy", 3: "clearly drunk", 4: "absolutely hammered"}


def generate_commentator_recap(state: RoomState) -> str:
    """Generate a wry sports-style play-by-play recap of the last round."""
    topic             = state["topic"]
    participants      = state["participants"]
    messages          = state.get("messages") or []
    heat              = state.get("heat") or 0
    concession_counts = state.get("concession_counts") or {}
    partial_agreements = state.get("partial_agreements") or []
    turn_count        = state.get("turn_count") or 0
    drunk_levels      = state.get("drunk_levels") or {}

    recent_text = "\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content[:200]}"
        for m in messages[-8:]
        if hasattr(m, "content") and not (getattr(m, "name", "") or "").endswith("_bc")
    )

    concession_lines = ", ".join(
        f"{n.replace('_', ' ')} ({c} concession{'s' if c != 1 else ''})"
        for n, c in concession_counts.items() if c > 0
    ) or "none"

    agreement_lines = "; ".join(
        f"{' & '.join(a['participants'])} on {a['on']}" for a in partial_agreements
    ) or "none"

    drunk_lines = ", ".join(
        f"{n.replace('_', ' ')} ({_DRUNK_LABELS.get(lvl, 'wrecked')})"
        for n, lvl in drunk_levels.items()
        if lvl > 0 and n in participants
    )

    drunk_instruction = ""
    if drunk_lines:
        drunk_instruction = (
            f"\nIMPORTANT: The following participants have been drinking: {drunk_lines}. "
            "You MUST make at least one snide, amused remark about their condition — "
            "how it's affecting their arguments, their composure, or their credibility. "
            "Be entertainingly cruel about it. Name them specifically."
        )

    prompt = (
        f'Topic: "{topic}"\n'
        f"Participants: {', '.join(participants)}\n"
        f"Turn: {turn_count} | Heat: {heat}/10\n"
        f"Concessions this debate: {concession_lines}\n"
        f"Alignments so far: {agreement_lines}\n\n"
        f"Recent exchange:\n{recent_text}\n"
        f"{drunk_instruction}\n\n"
        "Give a punchy 2–3 sentence play-by-play on what just happened. "
        "Use sports metaphors. Name the participants specifically. "
        "End with one line teasing what to watch for next round."
    )

    try:
        response = ChatOpenAI(model="gpt-4o-mini", temperature=0.9).invoke([
            SystemMessage(content=(
                "You are a wry sports commentator calling a live philosophical debate "
                "like it's a boxing match or football game. Be punchy, colorful, and specific. "
                "Use sports metaphors freely. Never be dry or academic — you're broadcasting to an audience."
            )),
            HumanMessage(content=prompt),
        ])
        return response.content.strip()
    except Exception:
        return ""


# --------------------------------------------------------------------------- #
# Post-debate newspaper                                                         #
# --------------------------------------------------------------------------- #

class _NewspaperContent(BaseModel):
    newspaper_name: str    # e.g. "THE EVENING GAZETTE"
    city: str              # e.g. "London"
    date_str: str          # e.g. "Thursday, 17 April, 1929"
    headline: str          # big sensational headline
    subheadline: str       # secondary headline
    lede: str              # opening paragraph (~70 words)
    body: str              # second/third paragraphs (~100 words), quotes incidents
    scandal_head: str      # sidebar headline e.g. "SCANDALOUS CONDUCT AT THE BAR!"
    scandal_body: str      # sidebar ~60 words, most lurid moment
    pull_quote: str        # short verbatim-style quote from the debate
    pull_quote_attr: str   # speaker name + brief title


def _era_death_year(era: str) -> int:
    bc = "bc" in era.lower()
    if "present" in era.lower():
        return 2025
    m = re.search(r'\d{3,4}\s*[–\-]\s*(\d{3,4})', era)
    if m:
        y = int(m.group(1))
        return -y if bc else y
    m = re.search(r'(\d{3,4})', era)
    return (-int(m.group(1)) if bc else int(m.group(1))) if m else 0


def _era_birth_year(era: str) -> int:
    bc = "bc" in era.lower()
    m = re.search(r'(\d{3,4})\s*[–\-]', era)
    if m:
        y = int(m.group(1))
        return -y if bc else y
    m = re.search(r'(\d{3,4})', era)
    return (-int(m.group(1)) if bc else int(m.group(1))) if m else 0


def generate_newspaper(
    participants: list[str],
    topic: str,
    messages: list,
    heat: int,
    concession_counts: dict,
    partial_agreements: list,
    remaining_disagreements: list,
) -> _NewspaperContent:
    """Generate a sensational newspaper front page summarising the debate."""

    # Determine the era of the "latest" participant so the newspaper has a date
    eras = {p: CHARACTERS[p]["era"] for p in participants if p in CHARACTERS}
    latest_death = max((_era_death_year(e) for e in eras.values()), default=1900)
    latest_birth = max((_era_birth_year(e) for e in eras.values()), default=1850)
    era_lines = "\n".join(f"  {name}: {era}" for name, era in eras.items())

    # Build transcript (skip system/evidence/backchannel)
    transcript_parts = []
    for m in messages:
        if isinstance(m, SystemMessage):
            continue
        name = getattr(m, "name", None) or ""
        if name.endswith("_bc"):
            continue
        display = name.replace("_", " ") if name else ("You" if isinstance(m, HumanMessage) else "?")
        transcript_parts.append(f'{display}: "{m.content[:300]}"')
    transcript = "\n".join(transcript_parts[-25:])  # last 25 lines

    concession_lines = ", ".join(
        f"{n.replace('_', ' ')} ({c})" for n, c in concession_counts.items() if c > 0
    ) or "none"

    agreement_lines = "; ".join(
        f"{' & '.join(a['participants'])} agreed on: {a['on']}" for a in partial_agreements
    ) or "none"

    tension_lines = "; ".join(
        f"{t['participant_a']} vs {t['participant_b']} over {t['topic']}"
        if isinstance(t, dict) else str(t)
        for t in remaining_disagreements
    ) or "none"

    prompt = f"""You are a sensationalist newspaper reporter in the tradition of Victorian-era yellow journalism.
A group of historical figures just had a live debate at a bar. Write the front page.

DEBATE FACTS
Topic: {topic}
Participants: {', '.join(p.replace('_', ' ') for p in participants)}
Final heat level: {heat}/10
Concessions made: {concession_lines}
Alignments formed: {agreement_lines}
Unresolved tensions: {tension_lines}

PARTICIPANT ERAS (for dating the newspaper)
{era_lines}

TRANSCRIPT (last exchanges):
{transcript}

INSTRUCTIONS
- The newspaper date must fall within the lifetime of the most recently-lived participant.
  Their death year is approximately {latest_death}. Their birth year is approximately {latest_birth}.
  Pick a plausible, specific calendar date (day, month, year) within that range.
- Invent a newspaper name appropriate to the era and city.
- The headline must be ALL CAPS, punchy, and scandalous. Use em-dashes freely.
- The lede must name at least two participants and invoke the debate topic dramatically.
- The body must reference at least one specific exchange or moment from the transcript.
- If any character was drunk (slurred speech, erratic arguments, ordered many drinks, became belligerent),
  the scandal sidebar MUST feature it by name with theatrical outrage.
- If no one was drunk, the scandal sidebar should cover the most heated exchange.
- The pull quote must be something a participant actually said (or plausibly said) — keep it under 20 words.
- Write as a breathless, opinionated reporter who finds all of this DEEPLY shocking yet irresistible.
"""

    result = ChatOpenAI(model="gpt-4o", temperature=0.9).with_structured_output(
        _NewspaperContent
    ).invoke([
        SystemMessage(content="You write sensationalist newspaper front pages from a user-supplied debate transcript."),
        HumanMessage(content=prompt),
    ])
    return result
