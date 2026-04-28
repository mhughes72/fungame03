"""
Debug logging for the Philosopher's Room.

Toggle at startup:  DEBUG=1 python main.py   or   python main.py --debug
Toggle at runtime:  type  !debug             in the conversation prompt
Per-channel:        type  !debug moderator   to flip a single channel

Channels
--------
  MODERATOR   - who speaks next, round transitions
  PHILOSOPHER - prompt sent, message history length, token counts
  CONSENSUS   - transcript sent to checker, raw structured result
  ROUTING     - graph edge decisions
  STATE       - full state snapshot after each stream step
"""

import os
import sys
import threading
from datetime import datetime

# Individual channels — all on when debug is enabled; toggle selectively
CHANNELS: dict[str, bool] = {
    "MODERATOR":    True,
    "PHILOSOPHER":  True,
    "CONSENSUS":    True,
    "ROUTING":      True,
    "STATE":        False,   # off by default — very verbose
}

_enabled: bool = os.getenv("DEBUG", "").lower() in ("1", "true", "yes")

# Thread-local sink — set per-session so web sessions can capture dlog output
# without cross-session pollution. Each thread sees its own .fn value.
_thread_sink: threading.local = threading.local()


def set_sink(fn) -> None:
    """Register a callable(channel, label, data) for the current thread."""
    _thread_sink.fn = fn


def clear_sink() -> None:
    """Remove the sink for the current thread."""
    _thread_sink.fn = None

# ANSI helpers (gracefully degrade on terminals without color support)
_RESET  = "\033[0m"
_DIM    = "\033[2m"
_YELLOW = "\033[33m"
_CYAN   = "\033[36m"
_GREEN  = "\033[32m"
_RED    = "\033[31m"

_CHANNEL_COLORS = {
    "MODERATOR":   "\033[35m",   # magenta
    "PHILOSOPHER": "\033[36m",   # cyan
    "CONSENSUS":   "\033[32m",   # green
    "ROUTING":     "\033[33m",   # yellow
    "STATE":       "\033[34m",   # blue
}


# --------------------------------------------------------------------------- #
# Public API                                                                    #
# --------------------------------------------------------------------------- #

def is_enabled(channel: str | None = None) -> bool:
    if not _enabled:
        return False
    if channel and not CHANNELS.get(channel.upper(), True):
        return False
    return True


def enable() -> None:
    global _enabled
    _enabled = True


def disable() -> None:
    global _enabled
    _enabled = False


def toggle(channel: str | None = None) -> bool:
    """Toggle global debug or a named channel. Returns new state."""
    global _enabled
    if channel:
        key = channel.upper()
        if key in CHANNELS:
            CHANNELS[key] = not CHANNELS[key]
            _print_status()
            return CHANNELS[key]
        else:
            print(f"  Unknown debug channel: {key!r}. Valid: {list(CHANNELS)}")
            return False
    else:
        _enabled = not _enabled
        _print_status()
        return _enabled


def status() -> None:
    """Print current debug state — called by !debug status."""
    _print_status()


def dlog(channel: str, label: str, data=None) -> None:
    """Emit a debug line to stderr.

    channel  - one of MODERATOR / PHILOSOPHER / CONSENSUS / ROUTING / STATE
    label    - short description of what's being logged
    data     - dict, list, or string of supporting detail (optional)
    """
    fn = getattr(_thread_sink, "fn", None)
    if fn:
        fn(channel, label, data)

    if not is_enabled(channel):
        return

    ts = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    color = _CHANNEL_COLORS.get(channel.upper(), _YELLOW)
    header = f"{_DIM}[{channel} {ts}]{_RESET} {color}{label}{_RESET}"
    print(f"\n  {header}", file=sys.stderr)

    if data is None:
        return

    if isinstance(data, dict):
        for k, v in data.items():
            print(f"    {_DIM}{k}:{_RESET} {v}", file=sys.stderr)
    elif isinstance(data, list):
        for item in data:
            print(f"    • {item}", file=sys.stderr)
    elif isinstance(data, str):
        for line in data.strip().split("\n"):
            print(f"    {line}", file=sys.stderr)
    else:
        print(f"    {data}", file=sys.stderr)


# --------------------------------------------------------------------------- #
# Internal                                                                      #
# --------------------------------------------------------------------------- #

def _print_status() -> None:
    state_str = f"{_GREEN}ON{_RESET}" if _enabled else f"{_RED}OFF{_RESET}"
    print(f"\n  Debug: {state_str}")
    for ch, active in CHANNELS.items():
        mark = f"{_GREEN}on {_RESET}" if active else f"{_DIM}off{_RESET}"
        print(f"    {ch:<14} {mark}")
    print()
