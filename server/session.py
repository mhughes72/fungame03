"""Session management for the Philosopher's Bar web server.

Each browser session gets a ``Session`` object that holds:
- the live ``RoomState`` dict
- a compiled LangGraph
- an asyncio Queue for SSE events
- a threading.Event to signal the graph thread to stop

The graph runs in a thread-pool worker (``graph.stream()`` is synchronous).
Events are pushed into the queue via ``loop.call_soon_threadsafe`` so the
async SSE endpoint can drain them without blocking the event loop.

One batch = one ``graph.stream()`` call, which exits at ``__steer__`` or
``consensus_checker``.  The thread exits after each batch; the next batch
starts when the client POSTs to ``/steer``.
"""
from __future__ import annotations

import asyncio
import random
import sys
import threading
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# Ensure the project root is on sys.path so game modules are importable.
_ROOT = str(Path(__file__).parent.parent)
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from langchain_core.messages import AIMessage, HumanMessage

import debug as dbg
import server.events as evt
from graph import build_graph
from nodes import (
    generate_character_summaries,
    generate_moderator_steer,
    summarize_history,
    detect_forced_speaker,
    BAR_BEATS as _BAR_BEATS,
)
from state import RoomState, new_room_state, reset_for_new_topic



_SENTINEL = object()  # signals the SSE generator that the stream is done


@dataclass
class Session:
    id: str
    state: RoomState
    graph: object                        # CompiledGraph — no type stub needed
    queue: asyncio.Queue = field(default_factory=asyncio.Queue)
    stop_event: threading.Event = field(default_factory=threading.Event)
    loop: Optional[asyncio.AbstractEventLoop] = None
    _batch_count: int = 0
    _started: bool = False

    # ------------------------------------------------------------------ #
    # Thread-safe queue helpers                                            #
    # ------------------------------------------------------------------ #

    def _put(self, event: dict) -> None:
        """Enqueue from either the graph thread or the event loop."""
        if self.loop and not self.loop.is_closed():
            self.loop.call_soon_threadsafe(self.queue.put_nowait, event)

    def _put_sentinel(self) -> None:
        if self.loop and not self.loop.is_closed():
            self.loop.call_soon_threadsafe(self.queue.put_nowait, _SENTINEL)

    # ------------------------------------------------------------------ #
    # Graph batch runner — called in a thread pool executor               #
    # ------------------------------------------------------------------ #

    def run_batch(self) -> None:
        """Stream one graph batch, pushing SSE events into the queue.

        Exits when the graph reaches ``__steer__`` or ``consensus_checker``.
        The method is designed to be called via ``loop.run_in_executor``.
        """
        dbg.set_sink(lambda ch, label, data: self._put(evt.debug(ch, label, data)))
        try:
            self._run_batch_inner()
        finally:
            dbg.clear_sink()

    def _run_batch_inner(self) -> None:
        displayed_count = len(self.state.get("messages") or [])
        final_state = self.state

        try:
            for snapshot in self.graph.stream(self.state, stream_mode="values"):
                if self.stop_event.is_set():
                    break

                new_msgs = snapshot["messages"][displayed_count:]
                for msg in new_msgs:
                    self._emit_message(msg)
                displayed_count = len(snapshot["messages"])

                speaker = snapshot.get("current_speaker", "")
                clean_speaker = (
                    speaker.replace("_", " ")
                    if speaker not in ("__turn__", "__steer__", "consensus_check", "")
                    else ""
                )
                if clean_speaker:
                    self._put(evt.speaker(clean_speaker))

                if new_msgs:
                    concession_total = sum((snapshot.get("concession_counts") or {}).values())
                    self._put(evt.bars(snapshot.get("heat", 0), concession_total))

                final_state = snapshot

        except Exception as exc:
            err_str = str(exc).lower()
            is_billing = any(k in err_str for k in (
                "insufficient_quota", "exceeded your current quota",
                "billing", "out of credits", "quota exceeded",
            ))
            if is_billing:
                self._put(evt.system(
                    "*[the barkeep sets down a glass and kills the lights]* "
                    "The bar is closed for the evening. The developer — and we use that term loosely — "
                    "appears to have forgotten to top up the OpenAI account. "
                    "The philosophers will resume their quarrel once someone finds their wallet."
                ))
                s = final_state
                self._put(evt.game_over(
                    turn=s.get("turn_count", 0),
                    heat=s.get("heat", 0),
                    partial_agreements=s.get("partial_agreements") or [],
                    remaining_disagreements=s.get("remaining_disagreements") or [],
                ))
            else:
                self._put(evt.error(str(exc)))
            self._put_sentinel()
            return

        self.state = final_state
        self._after_batch()

    def _emit_message(self, msg) -> None:
        if isinstance(msg, AIMessage) and msg.name:
            if msg.name.endswith("_bc"):
                name = msg.name[:-3].replace("_", " ")
                self._put(evt.message(name, msg.content.strip(), role="philosopher", backchannel=True))
            else:
                name = msg.name.replace("_", " ")
                role = "moderator" if msg.name == "Moderator" else "philosopher"
                self._put(evt.message(name, msg.content.strip(), role=role))
        elif isinstance(msg, HumanMessage):
            name = getattr(msg, "name", None) or "You"
            role = "moderator" if name == "Moderator" else "user"
            self._put(evt.message(name, msg.content.strip(), role=role))

    def _after_batch(self) -> None:
        # Clear one-turn evidence flag
        if self.state.get("evidence_this_turn"):
            self.state = {**self.state, "evidence_this_turn": ""}

        # History compression
        condensed = summarize_history(self.state["messages"], self.state["topic"])
        if len(condensed) < len(self.state["messages"]):
            self._put(evt.system(f"Earlier conversation summarized — {len(condensed)} messages kept"))
            char_summaries = generate_character_summaries(self.state)
            self.state = {**self.state, "messages": condensed, "character_summaries": char_summaries}

        # Right-pane stats
        self._put(evt.state_update(
            turn=self.state.get("turn_count", 0),
            heat=self.state.get("heat", 0),
            concession_total=sum((self.state.get("concession_counts") or {}).values()),
            moderator_style=self.state.get("moderator_style", "socratic"),
            partial_agreements=self.state.get("partial_agreements") or [],
            points_of_agreement=self.state.get("points_of_agreement") or [],
            remaining_disagreements=self.state.get("remaining_disagreements") or [],
            drift_topic=self.state.get("drift_topic", ""),
        ))

        # Atmosphere beat (every completed batch after the first)
        self._batch_count += 1
        if self._batch_count > 1:
            beat = _BAR_BEATS[(self._batch_count - 2) % len(_BAR_BEATS)]
            self._put(evt.bar_beat(beat))

        if self.state.get("consensus"):
            self._put(evt.consensus(
                summary=self.state.get("consensus_summary", ""),
                points=self.state.get("points_of_agreement") or [],
            ))
            self._put_sentinel()
        elif self.state.get("current_speaker") == "__max_turns__":
            # Max turns reached — show end-of-game report
            self._put(evt.game_over(
                turn=self.state.get("turn_count", 0),
                heat=self.state.get("heat", 0),
                partial_agreements=self.state.get("partial_agreements") or [],
                remaining_disagreements=self.state.get("remaining_disagreements") or [],
            ))
            self._put_sentinel()
        else:
            self._put(evt.steer_needed(
                current_style=self.state.get("moderator_style", "socratic"),
                drift_topic=self.state.get("drift_topic", ""),
            ))
            # Steer_needed doesn't close the stream — it pauses it.
            # The SSE generator keeps the connection open waiting for more events.

    # ------------------------------------------------------------------ #
    # Steer handling                                                        #
    # ------------------------------------------------------------------ #

    def apply_steer(
        self,
        text: str,
        new_style: str,
        participants: list[str],
        evidence: str = "",
        drinks: dict = None,
    ) -> None:
        """Inject user input or a moderator steer into state, then start next batch."""
        if new_style and new_style != self.state.get("moderator_style"):
            self.state = {**self.state, "moderator_style": new_style}
            self._put(evt.system(f"Moderator approach → {new_style}"))

        if text:
            forced = detect_forced_speaker(text, participants)
            if forced:
                self._put(evt.system(f"Calling out {forced}"))
            self.state = {
                **self.state,
                "forced_speaker": forced or "",
                "messages": list(self.state["messages"]) + [
                    HumanMessage(content=text, name="User")
                ],
            }
            self._put(evt.message("User", text, role="user"))
        else:
            steer = generate_moderator_steer(self.state)
            forced = detect_forced_speaker(steer, participants)
            self.state = {
                **self.state,
                "forced_speaker": forced or "",
                "messages": list(self.state["messages"]) + [
                    HumanMessage(content=steer, name="Moderator")
                ],
            }
            self._put(evt.message("Moderator", steer, role="moderator"))

        if evidence:
            from langchain_core.messages import SystemMessage as _SysMsg
            self.state = {
                **self.state,
                "evidence_this_turn": evidence,
                "messages": list(self.state["messages"]) + [
                    _SysMsg(content=f"[EVIDENCE] {evidence}")
                ],
            }
            self._put(evt.evidence(evidence, ""))

        if drinks:
            participants = self.state.get("participants", [])
            current = dict(self.state.get("drunk_levels") or {})
            for name, count in drinks.items():
                if count > 0 and name in participants:
                    current[name] = current.get(name, 0) + count
                    total = current[name]
                    _labels = {1: "one drink", 2: "two drinks", 3: "three drinks"}
                    label = _labels.get(total, f"{total} drinks")
                    self._put(evt.system(f"{name} has had {label} tonight."))
            self.state = {**self.state, "drunk_levels": current}

    def apply_cheat(self, heat: int | None = None, drinks: dict = None) -> None:
        """Directly mutate heat and/or drunk_levels without starting a new batch."""
        updates = {}
        if heat is not None:
            updates["heat"] = max(0, min(10, heat))
        if drinks:
            participants = self.state.get("participants", [])
            current = dict(self.state.get("drunk_levels") or {})
            for name, count in drinks.items():
                if count > 0 and name in participants:
                    current[name] = current.get(name, 0) + count
                    total = current[name]
                    _labels = {1: "one drink", 2: "two drinks", 3: "three drinks"}
                    label = _labels.get(total, f"{total} drinks")
                    self._put(evt.system(f"{name} has had {label} tonight."))
            updates["drunk_levels"] = current
        if updates:
            self.state = {**self.state, **updates}
            concession_total = sum((self.state.get("concession_counts") or {}).values())
            self._put(evt.bars(self.state.get("heat", 0), concession_total))

    def new_topic(self, topic: str) -> None:
        """Reset state for a new topic, keeping the same participants and graph."""
        self.state = reset_for_new_topic(self.state, topic)
        self._batch_count = 0


# --------------------------------------------------------------------------- #
# Session store                                                                 #
# --------------------------------------------------------------------------- #

class SessionStore:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}
        self._lock = threading.Lock()

    def create(self, participants: list[str], topic: str) -> Session:
        session_id = uuid.uuid4().hex
        graph = build_graph(participants)
        state = new_room_state(participants, topic, max_turns=24)
        session = Session(id=session_id, state=state, graph=graph)
        with self._lock:
            self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> Optional[Session]:
        with self._lock:
            return self._sessions.get(session_id)

    def delete(self, session_id: str) -> None:
        with self._lock:
            session = self._sessions.pop(session_id, None)
        if session:
            session.stop_event.set()

