from langgraph.graph import StateGraph, END

from state import RoomState
from nodes import moderator_node, parallel_turn_node, consensus_checker_node
import debug as dbg


def build_graph(participants: list[str]):
    """Build and compile the room graph for the given participant list."""
    builder = StateGraph(RoomState)

    builder.add_node("moderator", moderator_node)
    builder.add_node("parallel_turn", parallel_turn_node)
    builder.add_node("consensus_checker", consensus_checker_node)

    builder.set_entry_point("moderator")

    def route_from_moderator(state: RoomState) -> str:
        speaker = state["current_speaker"]
        if speaker == "consensus_check":
            destination = "consensus_checker"
        elif speaker == "__steer__":
            destination = END
        else:
            destination = "parallel_turn"
        dbg.dlog("ROUTING", f"moderator → {destination}")
        return destination

    builder.add_conditional_edges("moderator", route_from_moderator)
    builder.add_edge("parallel_turn", "moderator")
    builder.add_edge("consensus_checker", END)

    dbg.dlog("ROUTING", "Graph built", {"participants": participants})

    return builder.compile()


def save_graph_image(compiled_graph, path: str = "room_graph.png") -> str:
    """Render the graph to a PNG and save it. Returns the output path."""
    png_bytes = compiled_graph.get_graph().draw_mermaid_png()
    with open(path, "wb") as f:
        f.write(png_bytes)
    return path
