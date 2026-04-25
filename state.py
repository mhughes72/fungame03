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
    consensus: bool
    consensus_summary: str
    partial_agreements: list[dict]   # [{participants, on}] — updated each check
    points_of_agreement: list[str]
    remaining_disagreements: list[str]
