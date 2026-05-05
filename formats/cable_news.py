"""Cable news debate format — nodes and helpers."""
from __future__ import annotations

import json
import random
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from personas import CHARACTERS
from state import RoomState
import debug as dbg

_BREAKING_NEWS_FILE = Path(__file__).parent.parent / "breaking_news.json"

RATINGS_FLOOR   = 0.2
RATINGS_CEILING = 4.0

PRODUCER_DIRECTIVES = [
    ("get_them_fighting",  "Get them fighting — I want sparks"),
    ("force_soundbite",    "Force a soundbite, something quotable"),
    ("push_narrative",     "Push the narrative — stay on message"),
    ("wrap_it_up",         "Wrap it up, we're bleeding viewers"),
    ("go_soft",            "Go soft — the sponsor is nervous"),
]

_PRODUCER_STRESS_LINES = [
    "reminder: ratings are everything",
    "we need more energy out there",
    "I'm watching the numbers, make something happen",
    "WHAT IS HAPPENING OUT THERE, cut them off",
    "I WILL PULL THIS SEGMENT. DO SOMETHING NOW",
    "my career is OVER. BREAK TO COMMERCIAL. BREAK TO COMMERCIAL.",
]

_CONCESSION_WORDS = (
    "i concede", "you make a fair point", "i grant you",
    "you're right", "i admit", "fair enough", "touché",
)


def _chat_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.85)


# --------------------------------------------------------------------------- #
# Catchphrase generation                                                        #
# --------------------------------------------------------------------------- #

def generate_catchphrases(state: RoomState) -> dict[str, str]:
    """Generate one catchphrase per guest in parallel. Call before first batch."""
    participants = state.get("participants") or []
    topic = state.get("topic") or ""

    def _gen(name: str) -> tuple[str, str]:
        char = CHARACTERS.get(name, {})
        prompt = (
            f"You are a TV booker creating a catchphrase for {name} to use on cable news.\n"
            f"Known for: {char.get('known_for', '')}\n"
            f"Core beliefs: {char.get('core_beliefs', '')}\n"
            f"Debate topic: {topic}\n\n"
            f"Generate ONE short catchphrase (max 12 words) that is topic-aware, in character, "
            f"and ideally contains a rhyme, a pun, or mild innuendo. "
            f"Output ONLY the catchphrase — no quotes, no explanation."
        )
        try:
            r = _chat_llm().invoke([HumanMessage(content=prompt)])
            return name, r.content.strip().strip('"').strip("'")
        except Exception:
            return name, ""

    with ThreadPoolExecutor(max_workers=max(1, len(participants))) as pool:
        results = list(pool.map(_gen, participants))

    phrases = {name: phrase for name, phrase in results if phrase}
    for name, phrase in phrases.items():
        dbg.dlog("CABLE", f"catchphrase [{name}]: {phrase!r}")
    return phrases


# --------------------------------------------------------------------------- #
# Graph nodes                                                                   #
# --------------------------------------------------------------------------- #

def ratings_node(state: RoomState) -> dict:
    """Rule-based ratings update after every philosopher turn."""
    messages = state.get("messages") or []
    last_msg = next(
        (m for m in reversed(messages)
         if isinstance(m, AIMessage) and not (m.name or "").endswith("_bc")),
        None,
    )
    if not last_msg:
        return {}

    content     = last_msg.content or ""
    speaker_key = last_msg.name or ""
    catchphrases = state.get("catchphrases") or {}

    delta = 0.0

    if len(content) < 50:
        delta += 0.1
    elif len(content) > 300:
        delta -= 0.2

    if "!" in content:
        delta += 0.05

    for word in ("however", "furthermore", "nevertheless"):
        if word in content.lower():
            delta -= 0.05

    for phrase in catchphrases.values():
        if phrase and len(phrase) > 4 and phrase.lower() in content.lower():
            delta += 0.1
            break

    if any(isinstance(m, AIMessage) and (m.name or "").endswith("_bc") for m in messages[-4:]):
        delta += 0.05

    if any(w in content.lower() for w in _CONCESSION_WORDS):
        delta -= 0.1

    current     = state.get("ratings") or 0.8
    new_ratings = round(max(RATINGS_FLOOR, min(RATINGS_CEILING, current + delta)), 2)
    history     = list(state.get("ratings_history") or [])
    history.append(new_ratings)
    peak = max(state.get("peak_ratings") or 0.8, new_ratings)

    guest_stats = {k: dict(v) for k, v in (state.get("guest_stats") or {}).items()}
    gs = guest_stats.setdefault(speaker_key, {
        "catchphrase_count": 0,
        "total_response_length": 0,
        "response_count": 0,
        "ratings_delta": 0.0,
    })
    gs["total_response_length"] = gs.get("total_response_length", 0) + len(content)
    gs["response_count"]        = gs.get("response_count", 0) + 1
    gs["ratings_delta"]         = round(gs.get("ratings_delta", 0.0) + delta, 2)
    if catchphrases.get(speaker_key.replace("_", " "), ""):
        phrase = catchphrases[speaker_key.replace("_", " ")]
        if len(phrase) > 4 and phrase.lower() in content.lower():
            gs["catchphrase_count"] = gs.get("catchphrase_count", 0) + 1

    dbg.dlog("CABLE", f"ratings {current} → {new_ratings} (Δ{delta:+.2f})")

    return {
        "ratings":         new_ratings,
        "ratings_history": history,
        "peak_ratings":    peak,
        "guest_stats":     guest_stats,
    }


def chyron_node(state: RoomState) -> dict:
    """50% chance: generate a sensationalist chyron misrepresenting the last turn."""
    if random.random() > 0.5:
        return {"chyron_this_turn": "", "chyron_subject": ""}

    messages = state.get("messages") or []
    last_msg = next(
        (m for m in reversed(messages)
         if isinstance(m, AIMessage) and not (m.name or "").endswith("_bc")),
        None,
    )
    if not last_msg:
        return {"chyron_this_turn": "", "chyron_subject": ""}

    speaker = (last_msg.name or "Unknown").replace("_", " ")
    content = last_msg.content[:400]

    try:
        r = _chat_llm().invoke([
            SystemMessage(content=(
                "You write cable news chyrons — the text bar at the bottom of the screen. "
                "Write a sensationalist chyron that MISREPRESENTS what was just said, "
                "exaggerating it into the most alarming, provocative, or absurd interpretation possible. "
                "Max 10 words. ALL CAPS. No quotes, no punctuation at the end."
            )),
            HumanMessage(content=f'{speaker} said: "{content}"'),
        ])
        chyron = r.content.strip().upper().strip('"')
        dbg.dlog("CABLE", f"chyron: {chyron!r} (subject: {speaker})")
        return {"chyron_this_turn": chyron, "chyron_subject": speaker}
    except Exception:
        return {"chyron_this_turn": "", "chyron_subject": ""}


def producer_node(state: RoomState) -> dict:
    """Check stress triggers, update producer note, maybe fire BREAKING NEWS."""
    ratings_history = state.get("ratings_history") or []
    producer_stress = state.get("producer_stress") or 0
    messages        = state.get("messages") or []

    triggers = 0

    if len(ratings_history) >= 3 and ratings_history[-1] < ratings_history[-2] < ratings_history[-3]:
        triggers += 1

    last_msg = next(
        (m for m in reversed(messages)
         if isinstance(m, AIMessage) and not (m.name or "").endswith("_bc")),
        None,
    )
    if last_msg and len(last_msg.content) > 450:
        triggers += 1

    if len(ratings_history) >= 5:
        last_5 = ratings_history[-5:]
        if max(last_5) - min(last_5) < 0.04:
            triggers += 1

    if triggers >= 2:
        producer_stress = min(5, producer_stress + 1)
    elif triggers <= 1 and producer_stress > 0:
        producer_stress = max(0, producer_stress - 1)

    producer_note = _PRODUCER_STRESS_LINES[min(producer_stress, 5)]

    breaking_news = ""
    if random.random() < 0.2:
        breaking_news = _pick_breaking_news()

    updates: dict = {
        "producer_stress": producer_stress,
        "producer_note":   producer_note,
    }
    if breaking_news:
        updates["breaking_news_this_turn"] = breaking_news
        updates["breaking_news_count"]     = (state.get("breaking_news_count") or 0) + 1
        dbg.dlog("CABLE", f"BREAKING NEWS: {breaking_news!r}")
    else:
        updates["breaking_news_this_turn"] = ""

    dbg.dlog("CABLE", f"producer stress={producer_stress}")
    return updates


def _pick_breaking_news() -> str:
    if not _BREAKING_NEWS_FILE.exists():
        return ""
    try:
        pool = json.loads(_BREAKING_NEWS_FILE.read_text(encoding="utf-8"))
        return random.choice(pool) if pool else ""
    except Exception:
        return ""


# --------------------------------------------------------------------------- #
# Host message generation                                                       #
# --------------------------------------------------------------------------- #

def generate_host_message(state: RoomState, call_in: str = "") -> str:
    """Generate The Host's between-segment message."""
    catchphrases     = state.get("catchphrases") or {}
    producer_note    = state.get("producer_note") or ""
    ratings          = state.get("ratings") or 0.8
    topic            = state.get("topic") or ""
    directive        = state.get("producer_directive") or ""
    breaking_news    = state.get("breaking_news_this_turn") or ""

    directive_label = {d[0]: d[1] for d in PRODUCER_DIRECTIVES}.get(directive, "")
    catchphrase_list = "\n".join(f'- {n}: "{p}"' for n, p in catchphrases.items() if p)

    system = (
        "You are The Host of a cable news debate program. "
        "You are not a neutral facilitator — you compete for ratings alongside your guests. "
        "You ask gotcha questions, use provocative language, ignore nuance, "
        "and react to your producer's whisper. You know all guest catchphrases and throw them back. "
        "Keep it SHORT: one to three punchy sentences. Stay on-brand: performative, combative, shallow."
    )

    lines = [f"Ratings: {ratings}M viewers. Topic: {topic}."]
    if call_in:
        lines.append(
            f'VIEWER CALL-IN: "{call_in}"\n'
            f"You MUST open your response by reading this question on air and directing it at a specific guest by name. "
            f"Do not paraphrase — use their words."
        )
    if breaking_news:
        lines.append(f"After the call-in, ANNOUNCE BREAKING NEWS: \"{breaking_news}\"" if call_in else f"ANNOUNCE BREAKING NEWS first: \"{breaking_news}\"")
    if producer_note:
        lines.append(f"[PRODUCER whispers: {producer_note}]")
    if directive_label:
        lines.append(f"[DIRECTIVE: {directive_label}]")
    if catchphrase_list:
        lines.append(f"Guest catchphrases to weaponise:\n{catchphrase_list}")
    if not call_in:
        lines.append("No call-in — fire your own question based on the producer note.")

    try:
        r = _chat_llm().invoke([
            SystemMessage(content=system),
            HumanMessage(content="\n".join(lines)),
        ])
        msg = r.content.strip()
        dbg.dlog("CABLE", f"host: {msg!r}")
        return msg
    except Exception:
        return "We're back! Let's keep the energy up, folks."


# --------------------------------------------------------------------------- #
# End-of-debate report                                                          #
# --------------------------------------------------------------------------- #

def cable_news_end_report(state: RoomState) -> dict:
    """Score guests and assign network offers. Returns a serialisable dict."""
    participants        = state.get("participants") or []
    guest_stats         = state.get("guest_stats") or {}
    ratings             = state.get("ratings") or 0.8
    peak                = state.get("peak_ratings") or 0.8
    end_reason          = state.get("cable_news_end") or "cancelled"
    turn_count          = state.get("turn_count") or 0
    breaking_news_count = state.get("breaking_news_count") or 0

    stats_list = []
    for name in participants:
        key = name.replace(" ", "_")
        gs  = guest_stats.get(key) or {}
        rc  = gs.get("response_count") or 1
        stats_list.append({
            "name":             name,
            "catchphrase_count":    gs.get("catchphrase_count", 0),
            "avg_response_length":  gs.get("total_response_length", 0) / rc,
            "ratings_delta":        gs.get("ratings_delta", 0.0),
        })

    offers = {}
    if stats_list:
        most_combative  = max(stats_list, key=lambda x: x["ratings_delta"])
        most_boring     = max(stats_list, key=lambda x: x["avg_response_length"])
        most_catchphrase = max(stats_list, key=lambda x: x["catchphrase_count"])

        assigned = set()
        for s in stats_list:
            name = s["name"]
            if name == most_boring["name"] and s["avg_response_length"] > 200 and name not in assigned:
                offers[name] = "3am C-SPAN slot"
                assigned.add(name)
            elif name == most_catchphrase["name"] and s["catchphrase_count"] > 0 and name not in assigned:
                offers[name] = "Podcast deal (Rogan / Lex Fridman)"
                assigned.add(name)
            elif name == most_combative["name"] and name not in assigned:
                offers[name] = "Fox News / Newsmax permanent seat"
                assigned.add(name)
            else:
                offers[name] = "CNN contributor ($400/appearance)"

    return {
        "end_reason":          end_reason,
        "final_ratings":       ratings,
        "peak_ratings":        peak,
        "turn_count":          turn_count,
        "breaking_news_count": breaking_news_count,
        "network_offers":      offers,
        "catchphrases":        state.get("catchphrases") or {},
        "guest_stats":         {
            name: {
                "catchphrase_count":   (guest_stats.get(name.replace(" ", "_")) or {}).get("catchphrase_count", 0),
                "avg_response_length": round(
                    (guest_stats.get(name.replace(" ", "_")) or {}).get("total_response_length", 0) /
                    max(1, (guest_stats.get(name.replace(" ", "_")) or {}).get("response_count", 1)), 1
                ),
                "ratings_delta": (guest_stats.get(name.replace(" ", "_")) or {}).get("ratings_delta", 0.0),
            }
            for name in participants
        },
    }
