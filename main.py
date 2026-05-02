import os
import sys

os.environ.setdefault("LANGCHAIN_TRACING_V2", "false")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage

from personas import CHARACTERS
from graph import build_graph, save_graph_image
from nodes import summarize_history, generate_character_summaries, generate_commentator_recap, generate_moderator_steer, detect_forced_speaker, MODERATOR_STYLES as _MODERATOR_STYLES
from state import RoomState, new_room_state, reset_for_new_topic
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

def _display_partial_agreements(agreements: list[dict]) -> None:
    if not agreements:
        return
    print()
    _hr("·")
    print("  Emerging alignments:")
    for a in agreements:
        names = " + ".join(a["participants"])
        print(f"    {names}  →  {a['on']}")
    _hr("·")

def _display_style_bar(current: str):
    print("  Moderator approach (type a number to switch):")
    for i, (style, desc) in enumerate(_MODERATOR_STYLES, 1):
        marker = "●" if style == current else " "
        print(f"    {marker} {i}. {style:<20}  {desc}")

def _display_moderator(msg: str):
    print()
    _hr("·")
    print("  [Moderator]")
    for line in msg.strip().split("\n"):
        print(f"    {line}")
    _hr("·")

def _display_no_consensus(state: RoomState):
    _section(f"AFTER {state['turn_count']} TURNS — NO CONSENSUS YET")
    if state.get("points_of_agreement"):
        print("\n  Full agreements:")
        for pt in state["points_of_agreement"]:
            print(f"    • {pt}")
    if state.get("partial_agreements"):
        print("\n  Partial agreements:")
        for a in state["partial_agreements"]:
            names = " + ".join(a["participants"])
            print(f"    {names}  →  {a['on']}")
    if state.get("remaining_disagreements"):
        print("\n  Open tensions:")
        for t in state["remaining_disagreements"]:
            if isinstance(t, dict):
                print(f"    • {t['topic']}")
                print(f"        {t['participant_a']}: {t['stance_a']}")
                print(f"        {t['participant_b']}: {t['stance_b']}")
            else:
                print(f"    • {t}")


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
        raw = input("  Pick 2-4 thinkers by number (default: 6,9): ").strip() or "6,9"
        try:
            indices = [int(x.strip()) - 1 for x in raw.split(",")]
            if not all(0 <= i < len(names) for i in indices):
                raise ValueError
            if not 2 <= len(indices) <= 4:
                raise ValueError
            selected = [names[i] for i in indices]
            return selected
        except (ValueError, IndexError):
            print("  Please enter 2-4 valid numbers separated by commas.\n")


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
# Moderator style picker                                                        #
# --------------------------------------------------------------------------- #

def _pick_moderator_style() -> str:
    print("\n  Moderator style:\n")
    for i, (style, desc) in enumerate(_MODERATOR_STYLES, 1):
        print(f"  {i}.  {style:<20}  {desc}")
    print()
    while True:
        raw = input("  Choose [1]: ").strip()
        if not raw:
            style = _MODERATOR_STYLES[0][0]
            print(f"  → {style}\n")
            return style
        try:
            idx = int(raw) - 1
            if 0 <= idx < len(_MODERATOR_STYLES):
                style = _MODERATOR_STYLES[idx][0]
                print(f"  → {style}\n")
                return style
        except ValueError:
            pass
        print("  Please enter a number from the list.\n")


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

    max_turns_input = input("  Maximum turns before debate ends? [20] > ").strip()
    try:
        max_turns = int(max_turns_input) if max_turns_input else 20
        if max_turns < 1:
            max_turns = 20
    except ValueError:
        max_turns = 20

    graph = build_graph(participants)

    try:
        img_path = save_graph_image(graph)
        print(f"  Graph saved → {img_path}\n")
    except Exception as e:
        print(f"  (Graph image unavailable: {e})\n")

    state: RoomState = new_room_state(participants, topic, max_turns)

    _header(f'TOPIC: "{topic}"')

    while True:
        # Stream the graph so each philosopher's response prints as it arrives
        displayed_count = len(state.get("messages") or [])
        prev_partial = state.get("partial_agreements") or []
        final_state = state

        for snapshot in graph.stream(state, stream_mode="values"):
            new_msgs = snapshot["messages"][displayed_count:]
            for msg in new_msgs:
                _display_message(msg)
            displayed_count = len(snapshot["messages"])

            # Surface newly formed partial agreements the moment the consensus checker fires
            new_partial = snapshot.get("partial_agreements") or []
            if new_partial != prev_partial:
                _display_partial_agreements(new_partial)
                prev_partial = new_partial

            final_state = snapshot

            dbg.dlog("STATE", "Snapshot after node", {
                "current_speaker":   snapshot.get("current_speaker"),
                "recent_speakers":   snapshot.get("recent_speakers"),
                "turn_count":        snapshot.get("turn_count"),
                "total_messages":    len(snapshot.get("messages") or []),
                "consensus":         snapshot.get("consensus"),
                "partial_agreements": snapshot.get("partial_agreements"),
            })

        state = final_state

        # Compress old messages into a rolling summary once history grows long
        condensed = summarize_history(state["messages"], state["topic"])
        if len(condensed) < len(state["messages"]):
            print(f"\n  [Earlier conversation summarized — history condensed to {len(condensed)} messages]\n")
            char_summaries = generate_character_summaries(state)
            for char_name, arc in char_summaries.items():
                dbg.dlog("PHILOSOPHER", f"Debate arc — {char_name}", arc)
            state = {**state, "messages": condensed, "character_summaries": char_summaries}

        is_steer_exit = state.get("current_speaker") == "__steer__"
        is_max_turns = state.get("current_speaker") == "__max_turns__"

        # Show consensus analysis
        if state.get("consensus"):
            _display_consensus(state)
            print()
            again = input("  Start a new topic? (y/n): ").strip().lower()
            if again == "y":
                topic = input("  New topic > ").strip()
                state = reset_for_new_topic(state, topic)
                _header(f'NEW TOPIC: "{topic}"')
            else:
                break
        elif is_max_turns:
            _display_no_consensus(state)
            print()
            print(f"  [Debate ended after reaching {state['turn_count']} turns]")
            print()
            again = input("  Start a new topic? (y/n): ").strip().lower()
            if again == "y":
                topic = input("  New topic > ").strip()
                state = reset_for_new_topic(state, topic)
                _header(f'NEW TOPIC: "{topic}"')
            else:
                break
        else:
            _display_no_consensus(state)
            print()
            # Commentator recap — every steer break
            recap = generate_commentator_recap(state)
            if recap:
                print(f"  📢 {recap}\n")
            current_style = state.get("moderator_style", "socratic")
            _display_style_bar(current_style)
            print()
            user_input = input(
                "  Your turn (Enter to steer, 1-7 to switch style, or type to join): "
            ).strip()

            if user_input.startswith("!"):
                result = _handle_debug_command(user_input)
                continue

            # Number input — change style then fire moderator
            if user_input.isdigit():
                idx = int(user_input) - 1
                if 0 <= idx < len(_MODERATOR_STYLES):
                    current_style = _MODERATOR_STYLES[idx][0]
                    state = {**state, "moderator_style": current_style}
                    print(f"  → {current_style}\n")
                user_input = ""  # fall through to moderator steer

            state = {**state}

            if user_input:
                dbg.dlog("STATE", "User message injected", {"content": user_input})
                forced = detect_forced_speaker(user_input, participants)
                if forced:
                    dbg.dlog("STATE", f"Calling out {forced}")
                state = {
                    **state,
                    "forced_speaker": forced or "",
                    "messages": list(state["messages"]) + [
                        HumanMessage(content=user_input, name="User")
                    ],
                }
            else:
                steer = generate_moderator_steer(state)
                _display_moderator(steer)
                dbg.dlog("STATE", "Moderator steer injected", {"content": steer})
                state = {
                    **state,
                    "messages": list(state["messages"]) + [
                        HumanMessage(content=steer, name="Moderator")
                    ],
                }

        # Guard against runaway debates
        if state.get("turn_count", 0) >= 24:
            _section("THE DEBATE CONTINUES...")
            print("  After many turns, no full consensus has emerged.")
            print("  Some questions resist easy resolution.\n")
            break


if __name__ == "__main__":
    if "--ui" in sys.argv:
        from ui import PhilosopherBar
        PhilosopherBar().run()
    else:
        try:
            run_game()
        except (KeyboardInterrupt, _Quit):
            print("\n\n  The room falls silent. Farewell.\n")
