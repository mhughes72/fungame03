import os
import sys
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage

from personas import CHARACTERS
from graph import build_graph, save_graph_image
from state import RoomState
import debug as dbg

load_dotenv()

# --debug / -d flag enables debug mode before anything else runs
if "--debug" in sys.argv or "-d" in sys.argv:
    dbg.enable()

# --------------------------------------------------------------------------- #
# Display helpers                                                               #
# --------------------------------------------------------------------------- #

WIDTH = 72

def _hr(char="─"):
    print(char * WIDTH)

def _header(text: str):
    _hr("═")
    print(f"  {text}")
    _hr("═")

def _section(text: str):
    print()
    _hr()
    print(f"  {text}")
    _hr()

def _display_message(msg):
    if isinstance(msg, AIMessage) and msg.name:
        display_name = msg.name.replace("_", " ")
        print(f"\n  [{display_name}]")
        for line in msg.content.strip().split("\n"):
            print(f"    {line}")
    elif isinstance(msg, HumanMessage):
        print(f"\n  [You]")
        for line in msg.content.strip().split("\n"):
            print(f"    {line}")

def _display_consensus(state: RoomState):
    _section("CONSENSUS REACHED")
    print(f"\n  {state['consensus_summary']}")
    if state.get("points_of_agreement"):
        print("\n  Points of agreement:")
        for pt in state["points_of_agreement"]:
            print(f"    • {pt}")
    if state.get("remaining_disagreements"):
        print("\n  Still unresolved:")
        for pt in state["remaining_disagreements"]:
            print(f"    • {pt}")

def _display_no_consensus(state: RoomState):
    _section(f"AFTER {state['turn_count']} TURNS — NO CONSENSUS YET")
    if state.get("remaining_disagreements"):
        print("\n  Open tensions:")
        for pt in state["remaining_disagreements"]:
            print(f"    • {pt}")
    if state.get("points_of_agreement"):
        print("\n  Emerging agreement:")
        for pt in state["points_of_agreement"]:
            print(f"    • {pt}")


# --------------------------------------------------------------------------- #
# Character selection                                                           #
# --------------------------------------------------------------------------- #

def _pick_participants() -> list[str]:
    names = list(CHARACTERS.keys())
    print("\n  Available thinkers:\n")
    for i, name in enumerate(names, 1):
        char = CHARACTERS[name]
        print(f"  {i:>2}.  {name:<22}  {char['era']}")
    print()

    while True:
        raw = input("  Pick 2–4 thinkers by number (e.g. 1,3,5): ").strip()
        try:
            indices = [int(x.strip()) - 1 for x in raw.split(",")]
            if not all(0 <= i < len(names) for i in indices):
                raise ValueError
            if not 2 <= len(indices) <= 4:
                raise ValueError
            selected = [names[i] for i in indices]
            return selected
        except (ValueError, IndexError):
            print("  Please enter 2–4 valid numbers separated by commas.\n")


# --------------------------------------------------------------------------- #
# Debug command handler                                                         #
# --------------------------------------------------------------------------- #

_DEBUG_HELP = """
  Commands (prefix with !):
    !quit               exit the game
    !debug              toggle all debug output on/off
    !debug <channel>    toggle a single channel  (e.g. !debug state)
    !debug status       show current on/off state of all channels
    !help               show this message

  Channels: moderator  philosopher  consensus  routing  state
"""

class _Quit(Exception):
    pass

def _handle_debug_command(raw: str) -> None:
    parts = raw.lstrip("!").strip().lower().split()
    cmd = parts[0] if parts else ""

    if cmd == "quit" or cmd == "exit":
        raise _Quit
    elif cmd == "help":
        print(_DEBUG_HELP)
    elif cmd == "debug":
        if len(parts) == 1:
            on = dbg.toggle()
            print(f"  Debug {'enabled' if on else 'disabled'}.\n")
        elif parts[1] == "status":
            dbg.status()
        else:
            dbg.toggle(parts[1].upper())
    else:
        print(f"  Unknown command: {raw!r}  (type !help for options)\n")


# --------------------------------------------------------------------------- #
# Main game loop                                                                #
# --------------------------------------------------------------------------- #

def run_game():
    _header("THE PHILOSOPHER'S ROOM")
    debug_hint = "  [debug ON — type !debug to toggle, !help for options]" if dbg.is_enabled() else "  [tip: run with --debug or type !debug mid-game to inspect internals]"
    print(f"""
  Gather great minds from history and watch them debate.
  You may join the conversation at any time.

{debug_hint}
""")

    participants = _pick_participants()
    _section("YOUR ROOM")
    for name in participants:
        char = CHARACTERS[name]
        print(f"\n  {name}  ({char['era']})")
        print(f"    {char['known_for']}")

    print()
    topic = input("  What should they discuss? > ").strip()
    if not topic:
        topic = "What is the nature of justice?"

    graph = build_graph(participants)

    try:
        img_path = save_graph_image(graph)
        print(f"  Graph saved → {img_path}\n")
    except Exception as e:
        print(f"  (Graph image unavailable: {e})\n")

    state: RoomState = {
        "messages": [],
        "topic": topic,
        "participants": participants,
        "current_speaker": "",
        "recent_speakers": [],
        "turn_count": 0,
        "consensus": False,
        "consensus_summary": "",
        "points_of_agreement": [],
        "remaining_disagreements": [],
    }

    _header(f'TOPIC: "{topic}"')

    while True:
        # Stream the graph so each philosopher's response prints as it arrives
        displayed_count = len(state.get("messages") or [])
        final_state = state

        for snapshot in graph.stream(state, stream_mode="values"):
            new_msgs = snapshot["messages"][displayed_count:]
            for msg in new_msgs:
                _display_message(msg)
            displayed_count = len(snapshot["messages"])
            final_state = snapshot

            dbg.dlog("STATE", "Snapshot after node", {
                "current_speaker":  snapshot.get("current_speaker"),
                "recent_speakers":  snapshot.get("recent_speakers"),
                "turn_count":       snapshot.get("turn_count"),
                "total_messages":   len(snapshot.get("messages") or []),
                "consensus":        snapshot.get("consensus"),
            })

        state = final_state

        # Show consensus analysis
        if state.get("consensus"):
            _display_consensus(state)
            print()
            again = input("  Start a new topic? (y/n): ").strip().lower()
            if again == "y":
                topic = input("  New topic > ").strip()
                state = {
                    **state,
                    "topic": topic,
                    "messages": [],
                    "recent_speakers": [],
                    "turn_count": 0,
                    "consensus": False,
                    "consensus_summary": "",
                    "points_of_agreement": [],
                    "remaining_disagreements": [],
                }
                _header(f'NEW TOPIC: "{topic}"')
            else:
                break
        else:
            _display_no_consensus(state)
            print()
            user_input = input(
                "  Your turn (press Enter to let them continue, or type to join): "
            ).strip()

            # Debug commands — prefix with !
            if user_input.startswith("!"):
                _handle_debug_command(user_input)
                continue

            # Inject user message if provided; state otherwise carries forward as-is
            state = {**state}

            if user_input:
                dbg.dlog("STATE", "User message injected", {"content": user_input})
                state = {
                    **state,
                    "messages": list(state["messages"]) + [
                        HumanMessage(content=user_input, name="User")
                    ],
                }

        # Guard against runaway debates
        if state.get("turn_count", 0) >= 40:
            _section("THE DEBATE CONTINUES...")
            print("  After many turns, no full consensus has emerged.")
            print("  Some questions resist easy resolution.\n")
            break


if __name__ == "__main__":
    try:
        run_game()
    except (KeyboardInterrupt, _Quit):
        print("\n\n  The room falls silent. Farewell.\n")
