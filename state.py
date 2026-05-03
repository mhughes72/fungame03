from typing import Annotated
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class RoomState(TypedDict):
    messages: Annotated[list, add_messages]
    topic: str
    participants: list[str]
    current_speaker: str
    recent_speakers: list[str]   # last N speakers — used for recency penalty
    turn_count: int
    max_turns: int             # debate ends when turn_count reaches this
    consensus: bool
    consensus_summary: str
    partial_agreements: list[dict]   # [{participants, on}] — updated each check
    points_of_agreement: list[str]
    remaining_disagreements: list[str]
    argument_log: dict         # {name: [claim1, claim2, ...]} — last 3 claims per character
    concession_counts: dict    # {name: int} — times each character has granted a point
    concession_log: dict       # {name: [snippet, ...]} — last 3 things each character has conceded
    challenge_counts: dict     # {name: int} — times challenged without conceding since last concession
    character_summaries: dict  # {name: str} — first-person debate arc, generated at compression
    bridge: str                # suggested common ground from last consensus check, injected into next steer
    moderator_style: str       # "socratic" or "combative"
    forced_speaker: str        # if set, bypass scorer and force this character next
    heat: int                  # 0–10, rises with disagreement, falls with concession
    drift_topic: str           # non-empty when conversation has wandered from original topic
    evidence_this_turn: str    # non-empty for one batch after evidence is injected; cleared after
    drunk_levels: dict         # {name: int} — cumulative drinks served per character
    commentator_log: list      # [str] — commentator recaps in order, one per steer break
    diagrams_enabled: bool     # whether diagram generation is active for this session
    diagram_this_turn: dict    # {speaker, article, url, thumb_url, title, page_url} or {} — cleared each batch
    shown_diagram_urls: list   # URLs already displayed this session — prevents repeats
    audience_level: str        # "grade5" | "highschool" | "university" | "expert"
    philosopher_length: str    # "punchy" | "normal" | "conversational" | "expansive"
    commentator_length: str    # "off" | "normal" | "verbose"
    moderator_length: str      # "brief" | "normal" | "elaborate"
    # Structured debate format (local-only)
    debate_format:    str      # "" = freeform; "oxford" = Oxford-style
    format_roles:     dict     # {"proposition": [...], "opposition": [...]}
    format_seq:       list     # compiled turn sequence: [{speaker, phase, instruction}]
    format_seq_idx:   int      # current position in format_seq
    debate_phase:     str      # current phase name, e.g. "opening" | "floor" | "rebuttal"
    phase_instruction: str     # injected into philosopher prompt for structured phases
    oxford_opening_vote: dict  # {proposition_pct, persona_leanings, rationale} or {}
    oxford_verdict: dict       # {winner, proposition_open, proposition_final, margin, persona_verdicts, verdict} or {}


def _assign_oxford_roles(participants: list[str]) -> dict:
    mid = max(1, len(participants) // 2)
    return {"proposition": participants[:mid], "opposition": participants[mid:]}


def _compile_oxford_seq(roles: dict, participants: list[str]) -> list:
    prop = roles["proposition"]
    opp  = roles["opposition"]
    seq  = []
    for name in prop:
        seq.append({"speaker": name, "phase": "opening",
                    "instruction": "This is your opening statement. Present 2–3 of your strongest arguments for the proposition. Be clear, direct, and structured."})
    for name in opp:
        seq.append({"speaker": name, "phase": "opening",
                    "instruction": "This is your opening statement. Present 2–3 of your strongest arguments against the proposition. Be clear, direct, and structured."})
    seq.append({"speaker": "__steer__", "phase": None, "instruction": None})
    for _ in range(max(4, len(participants) * 2)):
        seq.append({"speaker": "__floor__", "phase": "floor", "instruction": None})
    seq.append({"speaker": "__steer__", "phase": None, "instruction": None})
    for name in reversed(opp):
        seq.append({"speaker": name, "phase": "rebuttal",
                    "instruction": "This is your rebuttal. Identify the single strongest argument made by the proposition side and dismantle it. Be specific — name the claim and show exactly why it fails."})
    for name in reversed(prop):
        seq.append({"speaker": name, "phase": "rebuttal",
                    "instruction": "This is your rebuttal. Identify the single strongest argument made by the opposition side and dismantle it. Be specific — name the claim and show exactly why it fails."})
    seq.append({"speaker": "__end__", "phase": None, "instruction": None})
    return seq


def new_room_state(
    participants: list[str],
    topic: str,
    max_turns: int = 20,
    moderator_style: str = "socratic",
    diagrams_enabled: bool = False,
    audience_level: str = "university",
    philosopher_length: str = "normal",
    commentator_length: str = "normal",
    moderator_length: str = "normal",
    debate_format: str = "",
    format_roles: dict | None = None,
) -> RoomState:
    if debate_format == "oxford":
        resolved_roles = format_roles if format_roles else _assign_oxford_roles(participants)
        format_seq = _compile_oxford_seq(resolved_roles, participants)
    else:
        resolved_roles = {}
        format_seq = []
    return {
        "messages": [],
        "topic": topic,
        "participants": participants,
        "current_speaker": "",
        "recent_speakers": [],
        "turn_count": 0,
        "max_turns": max_turns,
        "consensus": False,
        "consensus_summary": "",
        "partial_agreements": [],
        "points_of_agreement": [],
        "remaining_disagreements": [],
        "argument_log": {},
        "concession_counts": {},
        "concession_log": {},
        "challenge_counts": {},
        "character_summaries": {},
        "bridge": "",
        "moderator_style": moderator_style,
        "forced_speaker": "",
        "heat": 0,
        "drift_topic": "",
        "evidence_this_turn": "",
        "drunk_levels": {},
        "commentator_log": [],
        "diagrams_enabled": diagrams_enabled,
        "diagram_this_turn": {},
        "shown_diagram_urls": [],
        "audience_level": audience_level,
        "philosopher_length": philosopher_length,
        "commentator_length": commentator_length,
        "moderator_length": moderator_length,
        "debate_format":    debate_format,
        "format_roles":     resolved_roles,
        "format_seq":       format_seq,
        "format_seq_idx":   0,
        "debate_phase":     "",
        "phase_instruction": "",
        "oxford_opening_vote": {},
        "oxford_verdict":      {},
    }


def reset_for_new_topic(state: RoomState, topic: str) -> RoomState:
    """Reset per-topic fields while keeping participants, max_turns, and moderator_style."""
    debate_format = state.get("debate_format") or ""
    format_roles  = state.get("format_roles") or {}
    format_seq    = _compile_oxford_seq(format_roles, state["participants"]) if debate_format == "oxford" and format_roles else []
    return {
        **state,
        "topic": topic,
        "messages": [],
        "recent_speakers": [],
        "turn_count": 0,
        "consensus": False,
        "consensus_summary": "",
        "partial_agreements": [],
        "points_of_agreement": [],
        "remaining_disagreements": [],
        "argument_log": {},
        "concession_counts": {},
        "concession_log": {},
        "challenge_counts": {},
        "character_summaries": {},
        "bridge": "",
        "forced_speaker": "",
        "heat": 0,
        "drift_topic": "",
        "evidence_this_turn": "",
        "drunk_levels": {},
        "commentator_log": [],
        "diagram_this_turn": {},
        "shown_diagram_urls": [],
        "format_seq":        format_seq,
        "format_seq_idx":    0,
        "debate_phase":      "",
        "phase_instruction": "",
        "oxford_opening_vote": {},
        "oxford_verdict":      {},
    }
