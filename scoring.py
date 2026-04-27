import time
import random

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from personas import CHARACTERS
from state import RoomState
import debug as dbg


def _selector_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.2)


def _relevance_score(name: str, last_content: str) -> int:
    """Score how likely this character is to react strongly to the last message."""
    hot = CHARACTERS[name].get("hot_topics", "").lower()
    last = last_content.lower()
    return len(set(hot.split()) & set(last.split()))


def _top_candidates(names: list[str], last_content: str) -> list[str]:
    """Return candidates to generate — 1 unless the top two scores are tied."""
    if len(names) <= 1:
        return names
    scored = sorted(
        [(name, _relevance_score(name, last_content)) for name in names],
        key=lambda x: x[1],
        reverse=True,
    )
    # Only generate a second candidate when scores are genuinely tied
    if len(scored) >= 2 and scored[0][1] == scored[1][1]:
        return [scored[0][0], scored[1][0]]
    return [scored[0][0]]


class _SelectorDecision(BaseModel):
    chosen_speaker: str
    reason: str


def _select_winner(candidates: list[dict], state: RoomState) -> dict:
    """Use a fast LLM to pick the most dramatically compelling response."""
    if len(candidates) == 1:
        dbg.dlog("MODERATOR", f"Only one candidate — auto-selecting {candidates[0]['name']}")
        return candidates[0]

    messages        = state.get("messages") or []
    recent_speakers = state.get("recent_speakers") or []
    last_msg        = messages[-1] if messages else None
    last_speaker    = ""
    last_said       = ""
    if last_msg and hasattr(last_msg, "content"):
        last_speaker = (last_msg.name or "").replace("_", " ")
        last_said    = last_msg.content[:400]

    # Detect if two people have been dominating — tell the selector to break it up
    recent_unique = list(dict.fromkeys(recent_speakers[-6:]))  # order-preserving dedupe
    ping_pong_warning = ""
    if len(set(recent_speakers[-6:])) <= 2 and len(recent_speakers) >= 4:
        locked = list(set(recent_speakers[-4:]))
        fresh  = [c["name"] for c in candidates if c["name"] not in locked]
        if fresh:
            ping_pong_warning = (
                f"\n\nIMPORTANT: {' and '.join(locked)} have been dominating the last several turns. "
                f"Strongly prefer a response from {' or '.join(fresh)} to bring fresh perspective into the debate.\n"
            )

    candidates_text = "\n\n".join(
        f'[{c["name"]}]: "{c["content"]}"'
        for c in candidates
    )

    prompt = (
        f'Debate topic: "{state["topic"]}"\n\n'
        f'Last said by {last_speaker}: "{last_said}"\n\n'
        f"Recent speaker order: {recent_unique}\n"
        f"Candidate responses:\n{candidates_text}\n"
        f"{ping_pong_warning}\n"
        "Choose the response that best advances the debate. Prefer the one that:\n"
        "1. Brings a genuinely new angle — not just a continuation of the same back-and-forth\n"
        "2. Most sharply engages with what was just said\n"
        "3. Feels most dramatically alive and true to that thinker's voice\n\n"
        f"Return the speaker name exactly as it appears. Valid names: "
        f"{[c['name'] for c in candidates]}"
    )

    selector_messages = [
        SystemMessage(content=(
            "You are a dramatic editor selecting the most compelling contribution "
            "to a philosophical debate. Always return a name from the provided list."
        )),
        HumanMessage(content=prompt),
    ]
    for attempt in range(4):
        try:
            decision: _SelectorDecision = _selector_llm().with_structured_output(
                _SelectorDecision
            ).invoke(selector_messages)
            break
        except Exception as e:
            if "429" in str(e) and "insufficient_quota" not in str(e):
                wait = (attempt + 1) * 8 + random.uniform(0, 3)
                dbg.dlog("MODERATOR", f"Selector rate limit, retrying in {wait:.1f}s (attempt {attempt + 1})")
                time.sleep(wait)
            else:
                raise
    else:
        raise RuntimeError("Selector failed after 4 attempts due to rate limiting")

    chosen = next(
        (c for c in candidates if c["name"] == decision.chosen_speaker),
        candidates[0],
    )

    dbg.dlog("MODERATOR", f"Selector chose {chosen['name']}", {
        "reason":     decision.reason,
        "candidates": [c["name"] for c in candidates],
        "rejected":   [c["name"] for c in candidates if c["name"] != chosen["name"]],
    })

    return chosen
