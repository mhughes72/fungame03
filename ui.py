"""Textual bar UI for The Philosopher's Room."""
from __future__ import annotations

import re
from langchain_core.messages import AIMessage, HumanMessage

from textual.app import App, ComposeResult, on
from textual.containers import Horizontal, Vertical, ScrollableContainer
from textual.reactive import reactive
from textual.screen import ModalScreen, Screen
from textual.widgets import Button, Footer, Input, Label, RadioButton, RadioSet, RichLog, SelectionList, Static
from textual.widgets.selection_list import Selection
from textual import work


from graph import build_graph
from nodes import (
    summarize_history,
    generate_character_summaries,
    generate_commentator_recap,
    generate_moderator_steer,
    detect_forced_speaker,
    MODERATOR_STYLES as _MODERATOR_STYLES,
    BAR_BEATS as _BAR_BEATS,
)
from personas import CHARACTERS
from state import RoomState, new_room_state, reset_for_new_topic
import debug as dbg


# --------------------------------------------------------------------------- #
# CSS                                                                           #
# --------------------------------------------------------------------------- #

CSS = """
Screen {
    background: #1a0f00;
}

#header-bar {
    height: 3;
    background: #2d1a00;
    border-bottom: solid #5c3a00;
    padding: 0 2;
    align: left middle;
}

#header-title {
    width: 1fr;
    content-align: left middle;
    color: #f5c842;
    text-style: bold;
}

#quit-btn {
    width: auto;
    height: 1;
    background: #2d1a00;
    color: #6b3030;
    border: none;
    margin: 0 0 0 2;
}

#quit-btn:hover {
    color: #f07070;
    background: #4a1a1a;
}

#turn-counter {
    dock: right;
    width: auto;
    padding: 0 2;
    content-align: right middle;
    color: #8a7040;
}

#seats-bar {
    height: 3;
    background: #120a00;
    border-bottom: solid #3a2400;
    padding: 0 2;
    content-align: left middle;
}

#left-pane {
    width: 2fr;
    border-right: solid #3a2400;
}

#conversation {
    background: #0d0700;
    padding: 1 2;
    scrollbar-color: #5c3a00 #1a0f00;
}

#right-pane {
    width: 1fr;
    padding: 1 2;
    background: #100900;
    overflow-y: auto;
}

#debate-state {
    color: #c8a86b;
}

#input-bar {
    height: 3;
    background: #2d1a00;
    border-top: solid #5c3a00;
    padding: 0 1;
}

Input {
    background: #1a0f00;
    border: none;
    color: #f5e6c0;
    width: 1fr;
}

Input:focus {
    border: none;
    background: #1a0f00;
}

.seat {
    width: auto;
    padding: 0 2;
    color: #6b5030;
    text-style: bold;
}

.seat-active {
    color: #f5c842;
    text-style: bold;
}

.speaker-name {
    color: #f5c842;
    text-style: bold;
}

.moderator-name {
    color: #7ab8f5;
    text-style: bold;
}

.user-name {
    color: #a8d8a8;
    text-style: bold;
}

.system-note {
    color: #5c3a00;
    text-style: italic;
}
"""


SETUP_CSS = """
SetupScreen {
    background: #1a0f00;
    align: center middle;
}
#setup-box {
    width: 74;
    height: auto;
    max-height: 90vh;
    background: #2d1a00;
    border: solid #5c3a00;
    padding: 2 3;
}
#setup-title {
    text-align: center;
    color: #f5c842;
    text-style: bold;
    margin-bottom: 1;
}
#setup-subtitle {
    text-align: center;
    color: #5c3a00;
    margin-bottom: 1;
}
SelectionList {
    height: 16;
    border: solid #3a2400;
    background: #0d0700;
    margin-bottom: 1;
}
#topic-label { color: #8a7040; margin-top: 1; }
#topic-input {
    background: #1a0f00;
    border: solid #3a2400;
    color: #f5e6c0;
    margin-bottom: 1;
}
#start-btn {
    width: 100%;
    background: #3a2400;
    color: #f5c842;
    border: solid #5c3a00;
    text-style: bold;
}
#start-btn:hover { background: #5c3a00; }
#setup-error { color: #c06040; text-align: center; margin-top: 1; }
"""


STEER_CSS = """
SteerModal {
    align: center middle;
    background: #000000 20%;
}

SteerModal.-mouse-over {
    background: #000000 60%;
}

#steer-box {
    width: 72;
    height: auto;
    max-height: 90vh;
    background: #2d1a00;
    border: solid #5c3a00;
    padding: 2 3;
}

#steer-title {
    text-align: center;
    color: #f5c842;
    text-style: bold;
    margin-bottom: 1;
}

#steer-input-label {
    color: #8a7040;
    margin-bottom: 0;
}

#steer-input {
    background: #1a0f00;
    border: solid #3a2400;
    color: #f5e6c0;
    margin-bottom: 1;
}

#steer-or {
    text-align: center;
    color: #5c3a00;
    margin: 1 0;
}

#style-radio {
    height: 12;
    border: solid #3a2400;
    background: #0d0700;
    padding: 0 1;
    margin-bottom: 1;
    overflow-y: auto;
}

RadioButton {
    color: #c8a86b;
    background: #0d0700;
}

RadioButton:focus {
    background: #1a0f00;
}

RadioButton.-on {
    color: #f5c842;
}

#steer-buttons {
    height: auto;
    margin-top: 1;
}

#steer-btn {
    width: 1fr;
    background: #3a2400;
    color: #f5c842;
    border: solid #5c3a00;
    text-style: bold;
}

#steer-btn:hover { background: #5c3a00; }

#steer-quit-btn {
    width: auto;
    background: #2d1a00;
    color: #6b3030;
    border: solid #3a2400;
    margin-right: 1;
}

#steer-quit-btn:hover { color: #f07070; background: #4a1a1a; }
"""


# --------------------------------------------------------------------------- #
# Setup screen                                                                  #
# --------------------------------------------------------------------------- #

class SetupScreen(Screen):
    CSS = SETUP_CSS

    def compose(self) -> ComposeResult:
        names = list(CHARACTERS.keys())
        # Default selections: indices 5 (Lincoln) and 8 (Tesla)
        defaults = {5, 8}
        selections = [
            Selection(f"{name}  —  {CHARACTERS[name]['era']}", name, i in defaults)
            for i, name in enumerate(names)
        ]
        with Vertical(id="setup-box"):
            yield Static("THE PHILOSOPHER'S BAR", id="setup-title")
            yield Static("Select 2–4 thinkers for tonight's debate", id="setup-subtitle")
            yield SelectionList(*selections, id="character-list")
            yield Label("What should they discuss?", id="topic-label")
            yield Input(
                placeholder="What is the nature of justice?",
                id="topic-input",
            )
            yield Label("Maximum turns before debate ends?", id="max-turns-label")
            yield Input(
                placeholder="20",
                id="max-turns-input",
            )
            yield Button("Open the bar  ▶", id="start-btn", variant="default")
            yield Static("", id="setup-error")

    def on_mount(self) -> None:
        self.query_one("#character-list").focus()

    @on(Button.Pressed, "#start-btn")
    def start(self) -> None:
        sel = self.query_one("#character-list", SelectionList)
        chosen = list(sel.selected)
        if len(chosen) < 2 or len(chosen) > 4:
            self.query_one("#setup-error", Static).update(
                "Please select 2–4 thinkers."
            )
            return
        topic = self.query_one("#topic-input", Input).value.strip()
        if not topic:
            topic = "What is the nature of justice?"
        max_turns_str = self.query_one("#max-turns-input", Input).value.strip()
        try:
            max_turns = int(max_turns_str) if max_turns_str else 20
            if max_turns < 1:
                max_turns = 20
        except ValueError:
            max_turns = 20
        self.dismiss((chosen, topic, max_turns))

    def on_key(self, event) -> None:
        if event.key == "enter":
            focused = self.focused
            if isinstance(focused, (Button, Input)):
                self.start()


# --------------------------------------------------------------------------- #
# Steer modal                                                                   #
# --------------------------------------------------------------------------- #

class SteerModal(ModalScreen):
    CSS = STEER_CSS
    mouse_over: reactive[bool] = reactive(False)

    def __init__(self, current_style: str, styles: list[tuple[str, str]]) -> None:
        super().__init__()
        self._current_style = current_style
        self._styles = styles

    def compose(self) -> ComposeResult:
        with Vertical(id="steer-box"):
            yield Static("── STEER THE DEBATE ──", id="steer-title")
            yield Label("Speak directly into the debate:", id="steer-input-label")
            yield Input(placeholder="Leave blank to let the moderator intervene…", id="steer-input")
            yield Static("── or choose a moderator approach ──", id="steer-or")
            with RadioSet(id="style-radio"):
                for style, desc in self._styles:
                    label = f"[b]{style}[/b]  {desc}"
                    yield RadioButton(label, value=(style == self._current_style))
            with Horizontal(id="steer-buttons"):
                yield Button("Quit game", id="steer-quit-btn")
                yield Button("Steer  ▶", id="steer-btn", variant="default")

    def on_mount(self) -> None:
        self.query_one("#steer-input", Input).focus()

    def _submit(self) -> None:
        text = self.query_one("#steer-input", Input).value.strip()
        radio = self.query_one("#style-radio", RadioSet)
        idx = radio.pressed_index
        style = self._styles[idx][0] if idx is not None and idx >= 0 else self._current_style
        self.dismiss((text, style))

    @on(Button.Pressed, "#steer-btn")
    def on_steer(self) -> None:
        self._submit()

    @on(Button.Pressed, "#steer-quit-btn")
    def on_quit(self) -> None:
        self.app.exit()

    def on_key(self, event) -> None:
        if event.key == "enter" and isinstance(self.focused, (Button, Input)):
            self._submit()

    def on_enter(self) -> None:
        self.mouse_over = True

    def on_leave(self) -> None:
        self.mouse_over = False


# --------------------------------------------------------------------------- #
# Seat bar widget                                                                #
# --------------------------------------------------------------------------- #

class SeatsBar(Static):
    active_speaker: reactive[str] = reactive("")

    def __init__(self, participants: list[str]) -> None:
        super().__init__("")
        self.participants = participants

    def render_seats(self) -> str:
        parts = []
        for name in self.participants:
            short = name.split()[-1]  # last name only
            if name == self.active_speaker:
                parts.append(f"[bold yellow]● {short}[/]")
            else:
                parts.append(f"[#4a3020]○ {short}[/]")
        return "   ".join(parts)

    def watch_active_speaker(self, _: str) -> None:
        self.update(self.render_seats())

    def on_mount(self) -> None:
        self.update(self.render_seats())


# --------------------------------------------------------------------------- #
# Main app                                                                      #
# --------------------------------------------------------------------------- #

class PhilosopherBar(App):
    CSS = CSS
    BINDINGS = [("ctrl+c", "quit", "Quit"), ("ctrl+d", "toggle_debug", "Debug")]

    def __init__(self) -> None:
        super().__init__()
        self.participants: list[str] = []
        self.topic: str = ""
        self.graph = None
        self.state: RoomState = {}  # type: ignore
        self._displayed_count = 0
        self._prev_partial: list = []
        self._waiting_for_input = False
        self._pending_commentator: str = ""
        self._new_topic_mode = False

    # ---------------------------------------------------------------------- #
    # Layout                                                                   #
    # ---------------------------------------------------------------------- #

    def compose(self) -> ComposeResult:
        with Horizontal(id="header-bar"):
            yield Static("[bold yellow]THE PHILOSOPHER'S BAR[/]", id="header-title")
            yield Button("Quit", id="quit-btn")
        yield Static("", id="seats-bar")
        with Horizontal():
            with Vertical(id="left-pane"):
                yield RichLog(id="conversation", highlight=False, markup=True, wrap=True)
            yield Static("", id="right-pane")
        with Horizontal(id="input-bar"):
            yield Label("[#5c3a00]>[/] ", id="input-prompt")
            yield Input(placeholder="", id="user-input")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#user-input", Input).disabled = True
        self.push_screen(SetupScreen(), callback=self._start_debate)

    def _start_debate(self, result: tuple | None) -> None:
        if not result:
            self.exit()
            return
        participants, topic, max_turns = result
        self.participants = participants
        self.topic = topic
        self.graph = build_graph(self.participants)
        self.state = new_room_state(self.participants, self.topic, max_turns)
        self.query_one("#header-title", Static).update(
            f"[bold yellow]THE PHILOSOPHER'S BAR[/]   [#5c3a00]{self.topic}[/]"
        )
        self._update_seats_bar()
        self._update_debate_state()
        self.run_batch()

    # ---------------------------------------------------------------------- #
    # Graph batch runner (background thread)                                   #
    # ---------------------------------------------------------------------- #

    @work(thread=True)
    def run_batch(self) -> None:
        self._displayed_count = len(self.state.get("messages") or [])
        self._prev_partial = list(self.state.get("partial_agreements") or [])
        final_state = self.state

        for snapshot in self.graph.stream(self.state, stream_mode="values"):
            new_msgs = snapshot["messages"][self._displayed_count:]
            for msg in new_msgs:
                self.call_from_thread(self._display_message, msg)
            self._displayed_count = len(snapshot["messages"])

            new_partial = snapshot.get("partial_agreements") or []
            if new_partial != self._prev_partial:
                self._prev_partial = new_partial

            speaker = snapshot.get("current_speaker", "")
            self.call_from_thread(self._set_active_speaker, speaker)

            final_state = snapshot

        self.state = final_state

        # Generate commentator recap in thread (LLM call) — every steer break
        self._pending_commentator = generate_commentator_recap(self.state)

        self.call_from_thread(self._after_batch)

    def _after_batch(self) -> None:
        # History compression
        condensed = summarize_history(self.state["messages"], self.state["topic"])
        if len(condensed) < len(self.state["messages"]):
            self._log_system(f"[Earlier conversation summarized — {len(condensed)} messages kept]")
            char_summaries = generate_character_summaries(self.state)
            if dbg.is_enabled():
                for name, arc in char_summaries.items():
                    dbg.dlog("PHILOSOPHER", f"Debate arc — {name}", arc)
            self.state = {**self.state, "messages": condensed, "character_summaries": char_summaries}

        self._update_debate_state()
        self._set_active_speaker("")

        turn = self.state.get("turn_count", 0)
        n = len(self.participants)
        if turn > 0 and n > 0:
            batch_num = turn // (n * 2)
            if batch_num > 0:
                self._log_bar_beat(_BAR_BEATS[(batch_num - 1) % len(_BAR_BEATS)])

        if self._pending_commentator:
            self._log_commentator(self._pending_commentator)
            self._pending_commentator = ""

        if self.state.get("consensus"):
            self._log_system("━━━ CONSENSUS REACHED ━━━")
            self._log_system(self.state.get("consensus_summary", ""))
            for pt in self.state.get("points_of_agreement") or []:
                self._log_system(f"  ✓ {pt}")
            self._prompt_new_topic()
        elif self.state.get("current_speaker") == "__max_turns__":
            self._log_system(f"━━━ MAX TURNS REACHED ({self.state.get('turn_count')} turns) ━━━")
            if self.state.get("partial_agreements"):
                self._log_system("Partial agreements:")
                for a in self.state.get("partial_agreements", []):
                    names = " + ".join(a["participants"])
                    self._log_system(f"  • {names}: {a['on']}")
            self._prompt_new_topic()
        else:
            drift = self.state.get("drift_topic", "")
            if drift:
                self._log_system(f"── DRIFT ── the conversation has shifted to: {drift}")
                self._log_system(f"  original topic: {self.state['topic']}")
            self._open_steer_modal()

    # ---------------------------------------------------------------------- #
    # Steer modal                                                              #
    # ---------------------------------------------------------------------- #

    def _open_steer_modal(self) -> None:
        current_style = self.state.get("moderator_style", "socratic")
        self.push_screen(
            SteerModal(current_style, _MODERATOR_STYLES),
            callback=self._on_steer_result,
        )

    def _on_steer_result(self, result: tuple | None) -> None:
        if result is None:
            self._inject_moderator_steer()
            self.run_batch()
            return

        text, new_style = result

        if new_style != self.state.get("moderator_style"):
            self.state = {**self.state, "moderator_style": new_style}
            self._log_system(f"Moderator approach → {new_style}")
            self._update_debate_state()

        if text:
            dbg.dlog("STATE", "User message injected", {"content": text})
            forced = detect_forced_speaker(text, self.participants)
            if forced:
                dbg.dlog("STATE", f"Calling out {forced}")
            self.state = {
                **self.state,
                "forced_speaker": forced or "",
                "messages": list(self.state["messages"]) + [
                    HumanMessage(content=text, name="User")
                ],
            }
            self._display_message(HumanMessage(content=text, name="User"))
        else:
            self._inject_moderator_steer()

        self.run_batch()

    def _inject_moderator_steer(self) -> None:
        steer = generate_moderator_steer(self.state)
        self._log_moderator(steer)
        self.state = {
            **self.state,
            "messages": list(self.state["messages"]) + [
                HumanMessage(content=steer, name="Moderator")
            ],
        }

    # ---------------------------------------------------------------------- #
    # New topic input (bottom bar)                                             #
    # ---------------------------------------------------------------------- #

    def _prompt_new_topic(self) -> None:
        inp = self.query_one("#user-input", Input)
        inp.placeholder = "Type a new topic and press Enter, or leave blank to quit…"
        inp.disabled = False
        inp.focus()
        self._waiting_for_input = True
        self._new_topic_mode = True

    def on_input_submitted(self, event: Input.Submitted) -> None:
        if not self._waiting_for_input:
            return
        self._waiting_for_input = False
        user_text = event.value.strip()
        event.input.clear()
        event.input.disabled = True

        if not self._new_topic_mode:
            return

        self._new_topic_mode = False
        if user_text:
            self._reset_for_new_topic(user_text)
        else:
            self.exit()

    def _reset_for_new_topic(self, topic: str) -> None:
        self.topic = topic
        self.state = reset_for_new_topic(self.state, topic)
        self.query_one("#header-title", Static).update(
            f"[bold yellow]THE PHILOSOPHER'S BAR[/]   [#5c3a00]{topic}[/]"
        )
        self._update_debate_state()
        self.run_batch()

    # ---------------------------------------------------------------------- #
    # Display helpers                                                          #
    # ---------------------------------------------------------------------- #

    @staticmethod
    def _render_content(text: str) -> str:
        """Convert *[stage directions]* to dim italic Rich markup."""
        return re.sub(
            r"\*\[([^\]]+)\]\*",
            r"[#6b5030 italic][\1][/]",
            text,
        )

    def _display_message(self, msg) -> None:
        log = self.query_one("#conversation", RichLog)
        if isinstance(msg, AIMessage) and msg.name:
            if msg.name.endswith("_bc"):
                display_name = msg.name[:-3].replace("_", " ")
                log.write(f"[#5c4020 italic]  {display_name}: {msg.content.strip()}[/]")
            else:
                display_name = msg.name.replace("_", " ")
                log.write(f"\n[bold yellow]{display_name}[/]")
                log.write(self._render_content(msg.content.strip()))
        elif isinstance(msg, HumanMessage):
            name = getattr(msg, "name", None) or "You"
            if name == "Moderator":
                self._log_moderator(msg.content)
            else:
                log.write(f"\n[bold green]{name}[/]")
                log.write(msg.content.strip())

    def _log_moderator(self, text: str) -> None:
        log = self.query_one("#conversation", RichLog)
        log.write(f"\n[bold #7ab8f5]― Moderator ―[/]")
        log.write(f"[#7ab8f5]{text.strip()}[/]")
        log.write("")

    def _log_system(self, text: str) -> None:
        log = self.query_one("#conversation", RichLog)
        log.write(f"[#5c3a00]{text}[/]")

    def _log_commentator(self, text: str) -> None:
        log = self.query_one("#conversation", RichLog)
        log.write(f"\n[#7ab8f5]📢 {text.strip()}[/]\n")

    def _log_bar_beat(self, text: str) -> None:
        log = self.query_one("#conversation", RichLog)
        rendered = self._render_content(text)
        log.write(f"\n[#3a2000]{rendered}[/]\n")

    def _set_active_speaker(self, name: str) -> None:
        clean = name.replace("_", " ") if name not in ("__turn__", "__steer__", "consensus_check", "") else ""
        seats = self.query_one("#seats-bar", Static)
        parts = []
        for p in self.participants:
            short = p.split()[-1]
            if p == clean:
                parts.append(f"[bold yellow]● {short}[/]")
            else:
                parts.append(f"[#4a3020]○ {short}[/]")
        seats.update("   ".join(parts))

    def _update_debate_state(self) -> None:
        panel = self.query_one("#right-pane", Static)
        lines = [f"[bold #f5c842]TONIGHT'S QUESTION[/]\n[#8a7040]{self.state['topic']}[/]\n"]

        turn = self.state.get("turn_count", 0)
        lines.append(f"[#5c3a00]Turn {turn}[/]\n")

        full = self.state.get("points_of_agreement") or []
        if full:
            lines.append("[bold #a8d8a8]Full agreements[/]")
            for pt in full:
                lines.append(f"[#a8d8a8]✓ {pt}[/]")
            lines.append("")

        partial = self.state.get("partial_agreements") or []
        if partial:
            lines.append("[bold #c8a86b]Emerging alignments[/]")
            for a in partial:
                names = " + ".join(a["participants"])
                lines.append(f"[#c8a86b]{names}[/]\n  [#8a7040]{a['on']}[/]")
            lines.append("")

        tensions = self.state.get("remaining_disagreements") or []
        if tensions:
            lines.append("[bold #c06040]Open tensions[/]")
            for t in tensions:
                if isinstance(t, dict):
                    lines.append(f"[#c06040]• {t['topic']}[/]")
                    lines.append(f"  [#8a5040]{t['participant_a']}:[/] [#7a4030]{t['stance_a']}[/]")
                    lines.append(f"  [#8a5040]{t['participant_b']}:[/] [#7a4030]{t['stance_b']}[/]")
                else:
                    lines.append(f"[#c06040]• {t}[/]")
            lines.append("")

        heat = self.state.get("heat", 0)
        if heat <= 2:
            heat_color, heat_label = "#4a7ab5", "cool"
        elif heat <= 4:
            heat_color, heat_label = "#8a9040", "warm"
        elif heat <= 6:
            heat_color, heat_label = "#c8a030", "charged"
        elif heat <= 8:
            heat_color, heat_label = "#c86030", "heated"
        else:
            heat_color, heat_label = "#c83030", "flashpoint"
        bar = f"[{heat_color}]{'█' * heat}[/][#2a1800]{'░' * (10 - heat)}[/]"
        lines.append(f"[bold #5c3a00]── HEAT ──[/]")
        lines.append(f"{bar}  [{heat_color}]{heat_label}[/]\n")

        current = self.state.get("moderator_style", "socratic")
        lines.append(f"[bold #5c3a00]── APPROACH: {current.upper()} ──[/]")

        panel.update("\n".join(lines))

    def _update_seats_bar(self) -> None:
        seats = self.query_one("#seats-bar", Static)
        parts = [f"[#4a3020]○ {p.split()[-1]}[/]" for p in self.participants]
        seats.update("   ".join(parts))

    # ---------------------------------------------------------------------- #
    # Commands + actions                                                       #
    # ---------------------------------------------------------------------- #

    def _handle_command(self, raw: str) -> None:
        parts = raw.lstrip("!").strip().lower().split()
        cmd = parts[0] if parts else ""
        if cmd in ("quit", "exit"):
            self.exit()
        elif cmd == "debug":
            if len(parts) == 1:
                on = dbg.toggle()
                self._log_system(f"Debug {'enabled' if on else 'disabled'}")
            elif parts[1] == "status":
                dbg.status()
            else:
                dbg.toggle(parts[1].upper())

    @on(Button.Pressed, "#quit-btn")
    def on_quit_btn(self) -> None:
        self.exit()

    def action_toggle_debug(self) -> None:
        on = dbg.toggle()
        self._log_system(f"Debug {'enabled' if on else 'disabled'}")

    def action_quit(self) -> None:
        self.exit()
