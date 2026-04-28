"""SSE event constructors.

Every event is a dict with a ``type`` key. The SSE endpoint serialises these
to JSON and sends them as ``data:`` lines.  The JS frontend switches on
``event.type``.
"""
from __future__ import annotations

import json
from typing import Any


def _evt(type_: str, data: dict[str, Any]) -> dict:
    return {"type": type_, "data": data}


# ── outbound events ────────────────────────────────────────────────────────── #

def message(name: str, content: str, role: str = "philosopher", backchannel: bool = False) -> dict:
    """A philosopher or moderator line."""
    return _evt("message", {
        "role": role,
        "name": name,
        "content": content,
        "backchannel": backchannel,
    })


def speaker(name: str) -> dict:
    """Currently generating — used to show a typing indicator."""
    return _evt("speaker", {"name": name})


def state_update(
    turn: int,
    heat: int,
    concession_total: int,
    moderator_style: str,
    partial_agreements: list[dict],
    points_of_agreement: list[str],
    remaining_disagreements: list,
    drift_topic: str,
) -> dict:
    """Right-pane stats — sent after every batch."""
    return _evt("state", {
        "turn": turn,
        "heat": heat,
        "concession_total": concession_total,
        "moderator_style": moderator_style,
        "partial_agreements": partial_agreements,
        "points_of_agreement": points_of_agreement,
        "remaining_disagreements": remaining_disagreements,
        "drift_topic": drift_topic,
    })


def steer_needed(current_style: str, drift_topic: str) -> dict:
    """Batch ended at steer break — frontend should open the steer modal."""
    return _evt("steer_needed", {
        "current_style": current_style,
        "drift_topic": drift_topic,
    })


def consensus(summary: str, points: list[str]) -> dict:
    """Full consensus reached — debate over."""
    return _evt("consensus", {"summary": summary, "points": points})


def game_over(turn: int, heat: int, partial_agreements: list, remaining_disagreements: list) -> dict:
    """Max turns reached — show end-of-game report."""
    return _evt("game_over", {
        "turn": turn,
        "heat": heat,
        "partial_agreements": partial_agreements,
        "remaining_disagreements": remaining_disagreements,
    })


def bar_beat(text: str) -> dict:
    """Atmosphere stage direction between batches."""
    return _evt("bar_beat", {"text": text})


def system(text: str) -> dict:
    """System notice (history compression, style change, etc.)."""
    return _evt("system", {"text": text})


def error(text: str) -> dict:
    return _evt("error", {"text": text})


def evidence(finding: str, source: str) -> dict:
    """Empirical evidence injected by the player — rendered distinctly in the convo pane."""
    return _evt("evidence", {"finding": finding, "source": source})


def bars(heat: int, concession_total: int) -> dict:
    """Lightweight per-turn update for just the heat and concession bars."""
    return _evt("bars", {"heat": heat, "concession_total": concession_total})


def debug(channel: str, label: str, data=None) -> dict:
    """Debug log line — forwarded to the browser console."""
    return _evt("debug", {"channel": channel, "label": label, "data": data})


# ── serialisation ──────────────────────────────────────────────────────────── #

def to_sse(event: dict) -> str:
    """Format a dict as a single SSE ``data:`` line with a trailing blank line."""
    return f"data: {json.dumps(event)}\n\n"
