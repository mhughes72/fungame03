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

import server.events as evt
from graph import build_graph
from nodes import (
    generate_character_summaries,
    generate_moderator_steer,
    summarize_history,
)
from state import RoomState


_BAR_BEATS = [
    "*[someone orders another round]*",
    "*[the candle gutters]*",
    "*[a glass is set down too hard]*",
    "*[laughter drifts in from the next table]*",
    "*[the barkeep wipes the counter without looking up]*",
    "*[rain streaks the windows]*",
    "*[a chair scrapes back]*",
    "*[the fire settles with a soft crack]*",
    "*[someone lights a cigarette and doesn't offer one]*",
    "*[a long silence from the street outside]*",
    "*[the clock above the bar ticks once]*",
    "*[a cork is pulled somewhere in the back]*",
    "*[the door swings open — cold draft — then closes]*",
    "*[ice melts in an untouched glass]*",
    "*[the lights flicker, then hold]*",
]

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

                final_state = snapshot

        except Exception as exc:
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
    ) -> None:
        """Inject user input or a moderator steer into state, then start next batch."""
        if new_style and new_style != self.state.get("moderator_style"):
            self.state = {**self.state, "moderator_style": new_style}
            self._put(evt.system(f"Moderator approach → {new_style}"))

        if text:
            forced = _detect_forced_speaker(text, participants)
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
            self.state = {
                **self.state,
                "messages": list(self.state["messages"]) + [
                    HumanMessage(content=steer, name="Moderator")
                ],
            }
            self._put(evt.message("Moderator", steer, role="moderator"))

    def new_topic(self, topic: str) -> None:
        """Reset state for a new topic, keeping the same participants and graph."""
        self.state = {
            **self.state,
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
            "character_summaries": {},
            "forced_speaker": "",
            "heat": 0,
            "drift_topic": "",
        }
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
        state: RoomState = {
            "messages": [],
            "topic": topic,
            "participants": participants,
            "current_speaker": "",
            "recent_speakers": [],
            "turn_count": 0,
            "consensus": False,
            "consensus_summary": "",
            "partial_agreements": [],
            "points_of_agreement": [],
            "remaining_disagreements": [],
            "argument_log": {},
            "concession_counts": {},
            "character_summaries": {},
            "moderator_style": "socratic",
            "forced_speaker": "",
            "heat": 0,
            "drift_topic": "",
        }
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


# --------------------------------------------------------------------------- #
# Helpers                                                                       #
# --------------------------------------------------------------------------- #

def _detect_forced_speaker(text: str, participants: list[str]) -> Optional[str]:
    text_lower = text.lower()
    for name in participants:
        for part in name.lower().split():
            if len(part) > 3 and part in text_lower:
                return name
    return None
