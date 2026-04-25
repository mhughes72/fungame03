from langgraph.graph import StateGraph, END

from state import RoomState
from nodes import make_philosopher_node, moderator_node, consensus_checker_node
import debug as dbg


def build_graph(participants: list[str]):
    """Build and compile the room graph for the given participant list."""
    builder = StateGraph(RoomState)

    builder.add_node("moderator", moderator_node)
    builder.add_node("consensus_checker", consensus_checker_node)

    # One node per philosopher; each loops back to the moderator
    philosopher_node_ids: dict[str, str] = {}
    for name in participants:
        node_id = f"philosopher_{name.lower().replace(' ', '_')}"
        philosopher_node_ids[name] = node_id
        builder.add_node(node_id, make_philosopher_node(name))
        builder.add_edge(node_id, "moderator")

    dbg.dlog("ROUTING", "Graph built", {
        "participants":       participants,
        "philosopher_nodes":  list(philosopher_node_ids.values()),
        "edges":              [f"{nid} → moderator" for nid in philosopher_node_ids.values()],
    })

    builder.set_entry_point("moderator")

    def route_from_moderator(state: RoomState) -> str:
        speaker = state["current_speaker"]
        if speaker == "consensus_check":
            destination = "consensus_checker"
        else:
            destination = philosopher_node_ids[speaker]
        dbg.dlog("ROUTING", f"moderator → {destination}")
        return destination

    builder.add_conditional_edges("moderator", route_from_moderator)
    builder.add_edge("consensus_checker", END)

    return builder.compile()
