#!/usr/bin/env python3
"""Pre-generate and manage debate topics in debate_topics.json.

Usage:
    python generate_debate_topics.py --count 50
    python generate_debate_topics.py --count 10 --level university
    python generate_debate_topics.py --list
    python generate_debate_topics.py --list --level grade5
    python generate_debate_topics.py --clear
    python generate_debate_topics.py --levels
    python generate_debate_topics.py --verbose --count 5
"""
from __future__ import annotations

import argparse
import json
import sys
import uuid
from datetime import date
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel

from personas import CHARACTERS
from prompts import AUDIENCE_LEVELS, AUDIENCE_LEVEL_NAMES

TOPICS_FILE = Path(__file__).parent / "debate_topics.json"

# Audience level descriptions passed to the generation prompt so the LLM
# understands what topic complexity and vocabulary to target.
_LEVEL_CONTEXT: dict[str, str] = {
    "grade5":     (
        "10-year-old children — topics should be as intellectually ambitious as any other level; "
        "children are capable moral thinkers. The ONLY constraint is how characters speak: plain language, "
        "short sentences, everyday analogies. Great topics: fairness, justice, honesty, space and the future, "
        "what makes a good life, power and freedom, right vs. wrong, nature and humanity. Do NOT limit topic ambition."
    ),
    "highschool": "teenagers aged 14–18 — intellectually stretching but grounded in the real world",
    "university": "educated adults — full academic vocabulary; abstract and systemic topics welcome",
    "expert":     "domain specialists — highly technical, narrow, or discipline-specific topics encouraged",
}


class _TopicSchema(BaseModel):
    topic: str           # the debate question or proposition
    tagline: str         # ≤15 words, punchy hook that makes someone want to watch
    characters: list[str]  # 2–4 names drawn from the roster
    rationale: str       # one sentence: why this cast works for this topic (dev/curator only)
    category: str        # heated | historic | philosophical | scientific | cultural | political
    theme: str           # short snake_case label for the core theme, e.g. free_will, animal_rights, wealth_inequality


def _load() -> list[dict]:
    if TOPICS_FILE.exists():
        return json.loads(TOPICS_FILE.read_text(encoding="utf-8"))
    return []


def _save(topics: list[dict]) -> None:
    TOPICS_FILE.write_text(
        json.dumps(topics, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def _generate_one(level: str, existing: list[dict]) -> _TopicSchema:
    roster = "\n".join(
        f"- {name}: {data['known_for'][:90]}"
        for name, data in CHARACTERS.items()
    )

    existing_for_level = [t for t in existing if t.get("audience_level") == level]

    # Build overuse warnings so the LLM avoids the same characters and categories repeatedly
    from collections import Counter
    char_counts: Counter = Counter()
    cat_counts:  Counter = Counter()
    for t in existing_for_level:
        for c in t.get("characters", []):
            char_counts[c] += 1
        if t.get("category"):
            cat_counts[t["category"]] += 1

    overused_chars  = [name  for name,  n in char_counts.most_common() if n >= 2]
    overused_cats   = [cat   for cat,   n in cat_counts.most_common()  if n >= 3]
    used_themes     = sorted({t["theme"] for t in existing_for_level if t.get("theme")})

    avoid_parts = []
    if existing_for_level:
        avoid_parts.append(
            "Already in the list for this level — do NOT repeat these combinations or similar topics:\n"
            + "\n".join(
                f"- {', '.join(t['characters'])}: {t['topic']}"
                for t in existing_for_level
            )
        )
    if used_themes:
        avoid_parts.append(
            "These themes are ALREADY COVERED — you MUST pick a genuinely different theme: "
            + ", ".join(used_themes)
        )
    if overused_chars:
        avoid_parts.append(
            "These characters are OVERUSED — avoid them unless the topic genuinely requires them: "
            + ", ".join(overused_chars)
        )
    if overused_cats:
        avoid_parts.append(
            "These categories are OVERREPRESENTED — strongly prefer a different category: "
            + ", ".join(overused_cats)
        )

    avoid = ("\n\n" + "\n\n".join(avoid_parts)) if avoid_parts else ""

    level_name = AUDIENCE_LEVEL_NAMES[level]
    level_ctx  = _LEVEL_CONTEXT.get(level, level_name)

    grade5_note = (
        "\n\nFor grade 5: the topic ambition should match university level — do NOT water it down. "
        "Avoid topics that are purely about school rules or children's daily schedules (bedtime, homework, "
        "snacks, uniforms). Instead pick genuinely interesting moral or philosophical questions: "
        "fairness, animal rights, honesty, inequality, justice, space, creativity, what makes a good life. "
        "Choose characters based on how engaging and accessible their speaking style is for children — "
        "artists, musicians, politicians, and writers are often better than scientists for non-science topics. "
        "The cast should feel fun and surprising."
    ) if level == "grade5" else ""

    expert_note = (
        "\n\nFor expert: go beyond physics. The roster includes political philosophers, "
        "psychologists, economists, military strategists, writers, and artists. "
        "Vary the domain: history, ethics, psychology, political theory, art, economics."
    ) if level == "expert" else ""

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.95)
    result: _TopicSchema = llm.with_structured_output(_TopicSchema).invoke([
        SystemMessage(content=(
            f"You are curating a featured debate for: {level_name} ({level_ctx}).\n\n"
            "From the roster below, choose 2–4 participants and a debate topic "
            "perfectly calibrated for that audience.\n"
            "2 or 3 participants is usually better than 4 — only use 4 when each "
            "person adds something the others genuinely cannot.\n\n"
            "Requirements:\n"
            "- Topic difficulty, framing, and vocabulary must match the audience level exactly\n"
            "- Characters must have genuine ideological or philosophical opposition on this "
            "  specific topic — not just surface-level subject-matter relevance\n"
            "- Topic must be specific enough to generate real disagreement, not a vague big question\n"
            "- Cast must be drawn from a WIDE range of the roster — do not default to the famous scientists\n"
            "- tagline: ≤15 words, punchy, makes someone want to watch\n"
            "- rationale: one sentence explaining why this cast is compelling for this topic "
            "  (shown to curators only, never to end users)\n"
            "- category: exactly one of: heated, historic, philosophical, scientific, cultural, political\n"
            "- theme: a short snake_case label for the core theme of this debate "
            "(e.g. free_will, animal_rights, wealth_inequality, power_vs_freedom, "
            "science_vs_religion, nature_of_consciousness, ethics_of_war, technology_ethics, "
            "art_and_society, identity_and_justice). Must be distinct from already-covered themes."
            f"{grade5_note}{expert_note}"
        )),
        HumanMessage(content=f"Available participants:\n{roster}{avoid}"),
    ])

    valid_names = set(CHARACTERS.keys())
    result.characters = [c for c in result.characters if c in valid_names]
    if len(result.characters) < 2:
        raise ValueError(f"Too few valid characters returned: {result.characters}")
    return result


# --------------------------------------------------------------------------- #
# Commands                                                                      #
# --------------------------------------------------------------------------- #

def cmd_generate(count: int, level: str | None, verbose: bool) -> None:
    topics = _load()
    valid_levels = list(AUDIENCE_LEVELS.keys())

    # Distribute evenly across all levels when none specified
    if level is None:
        levels_queue = [valid_levels[i % len(valid_levels)] for i in range(count)]
    else:
        levels_queue = [level] * count

    print(f"Generating {count} topic(s)…")
    if level:
        print(f"  Level: {AUDIENCE_LEVEL_NAMES[level]}")
    else:
        print(f"  Distributing across: {', '.join(AUDIENCE_LEVEL_NAMES[l] for l in valid_levels)}")
    print()

    ok = 0
    for i, lvl in enumerate(levels_queue, 1):
        try:
            r = _generate_one(lvl, topics)
            entry = {
                "id":             uuid.uuid4().hex[:8],
                "topic":          r.topic,
                "tagline":        r.tagline,
                "characters":     r.characters,
                "category":       r.category,
                "theme":          r.theme,
                "audience_level": lvl,
                "rationale":      r.rationale,
                "source":         "generated",
                "generated_at":   date.today().isoformat(),
            }
            topics.append(entry)
            _save(topics)
            ok += 1
            if verbose:
                print(f"[{i}/{count}] [{lvl}] {r.topic}")
                print(f"  Theme:     {r.theme}")
                print(f"  Cast:      {', '.join(r.characters)}")
                print(f"  Tagline:   {r.tagline}")
                print(f"  Rationale: {r.rationale}")
                print()
            else:
                print(f"[{i}/{count}] [{lvl}] {r.topic[:65]}")
        except Exception as exc:
            print(f"[{i}/{count}] ERROR: {exc}", file=sys.stderr)

    print(f"\n{ok}/{count} saved → {TOPICS_FILE}  (total in file: {len(topics)})")


def cmd_list(level: str | None) -> None:
    topics = _load()
    if level:
        topics = [t for t in topics if t.get("audience_level") == level]
    if not topics:
        print("No topics found.")
        return
    for t in topics:
        src = "★ curated  " if t.get("source") == "curated" else "· generated"
        lvl = t.get("audience_level", "?")
        print(f"{src}  [{lvl:<14}]  {t['topic']}")
        print(f"               {', '.join(t.get('characters', []))}")
    print(f"\nTotal: {len(topics)}")


def cmd_clear() -> None:
    topics = _load()
    kept    = [t for t in topics if t.get("source") == "curated"]
    removed = len(topics) - len(kept)
    _save(kept)
    print(f"Removed {removed} generated entries. {len(kept)} curated entries kept.")


def cmd_levels() -> None:
    print("Available audience levels:")
    for key, name in AUDIENCE_LEVEL_NAMES.items():
        ctx = _LEVEL_CONTEXT.get(key, "")
        print(f"  {key:<14}  {name}  —  {ctx}")


# --------------------------------------------------------------------------- #
# Entry point                                                                   #
# --------------------------------------------------------------------------- #

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate or manage pre-generated debate topics.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "examples:\n"
            "  python generate_debate_topics.py --count 50\n"
            "  python generate_debate_topics.py --count 10 --level university\n"
            "  python generate_debate_topics.py --list --level grade5\n"
            "  python generate_debate_topics.py --clear\n"
            "  python generate_debate_topics.py --levels\n"
        ),
    )
    parser.add_argument("--count",   type=int,           metavar="N",    help="Number of topics to generate")
    parser.add_argument("--level",   metavar="LEVEL",                    help="Target a specific audience level (see --levels)")
    parser.add_argument("--list",    action="store_true",                 help="List all topics in debate_topics.json")
    parser.add_argument("--clear",   action="store_true",                 help="Remove all generated topics (curated entries are kept)")
    parser.add_argument("--levels",  action="store_true",                 help="List valid audience level keys")
    parser.add_argument("--verbose", action="store_true",                 help="Print full details during generation")
    args = parser.parse_args()

    if args.level and args.level not in AUDIENCE_LEVELS:
        valid = ", ".join(AUDIENCE_LEVELS.keys())
        print(f"Unknown level '{args.level}'. Valid levels: {valid}", file=sys.stderr)
        sys.exit(1)

    if args.levels:
        cmd_levels()
    elif args.list:
        cmd_list(args.level)
    elif args.clear:
        cmd_clear()
    elif args.count:
        cmd_generate(args.count, args.level, args.verbose)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
