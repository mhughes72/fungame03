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


def new_room_state(
    participants: list[str],
    topic: str,
    max_turns: int = 20,
    moderator_style: str = "socratic",
    diagrams_enabled: bool = False,
) -> RoomState:
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
    }


def reset_for_new_topic(state: RoomState, topic: str) -> RoomState:
    """Reset per-topic fields while keeping participants, max_turns, and moderator_style."""
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
    }
