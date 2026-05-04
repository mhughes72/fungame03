from langgraph.graph import StateGraph, END

from state import RoomState
from nodes import moderator_node, parallel_turn_node, consensus_checker_node
import debug as dbg


def build_graph(participants: list[str], debate_format: str = ""):
    """Build and compile the room graph for the given participant list."""
    if debate_format == "cable_news":
        return _build_cable_news_graph(participants)

    builder = StateGraph(RoomState)

    builder.add_node("moderator", moderator_node)
    builder.add_node("parallel_turn", parallel_turn_node)
    builder.add_node("consensus_checker", consensus_checker_node)

    builder.set_entry_point("moderator")

    def route_from_moderator(state: RoomState) -> str:
        speaker = state["current_speaker"]
        if speaker == "consensus_check":
            destination = "consensus_checker"
        elif speaker == "__steer__" or speaker == "__max_turns__":
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


def _build_cable_news_graph(participants: list[str]):
    """Cable news graph: philosopher turn → ratings → chyron → producer → back to moderator."""
    from formats.cable_news import ratings_node, chyron_node, producer_node

    builder = StateGraph(RoomState)

    builder.add_node("moderator",     moderator_node)
    builder.add_node("parallel_turn", parallel_turn_node)
    builder.add_node("ratings",       ratings_node)
    builder.add_node("chyron",        chyron_node)
    builder.add_node("producer",      producer_node)

    builder.set_entry_point("moderator")

    def route_from_moderator(state: RoomState) -> str:
        speaker = state["current_speaker"]
        if speaker in ("__steer__", "__max_turns__"):
            destination = END
        else:
            destination = "parallel_turn"
        dbg.dlog("ROUTING", f"moderator (cable) → {destination}")
        return destination

    def route_after_producer(state: RoomState) -> str:
        if state.get("cable_news_end") in ("viral", "cancelled"):
            dbg.dlog("ROUTING", f"cable news END: {state['cable_news_end']}")
            return END
        return "moderator"

    builder.add_conditional_edges("moderator", route_from_moderator)
    builder.add_edge("parallel_turn", "ratings")
    builder.add_edge("ratings",       "chyron")
    builder.add_edge("chyron",        "producer")
    builder.add_conditional_edges("producer", route_after_producer)

    dbg.dlog("ROUTING", "Cable news graph built", {"participants": participants})

    return builder.compile()


def save_graph_image(compiled_graph, path: str = "room_graph.png") -> str:
    """Render the graph to a PNG and save it. Returns the output path."""
    png_bytes = compiled_graph.get_graph().draw_mermaid_png()
    with open(path, "wb") as f:
        f.write(png_bytes)
    return path
