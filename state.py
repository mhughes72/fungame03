from typing import Annotated
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class RoomState(TypedDict):
    messages: Annotated[list, add_messages]
    topic: str
    participants: list[str]
    current_speaker: str
    speakers_this_round: list[str]
    round_count: int
    consensus: bool
    consensus_summary: str
    points_of_agreement: list[str]
    remaining_disagreements: list[str]
