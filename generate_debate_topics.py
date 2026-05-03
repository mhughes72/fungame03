#!/usr/bin/env python3
"""Pre-generate and manage debate topics in debate_topics.json.

Usage:
    python generate_debate_topics.py --count 10
    python generate_debate_topics.py --count 10 --format oxford
    python generate_debate_topics.py --count 10 --format freeform --level university
    python generate_debate_topics.py --list
    python generate_debate_topics.py --list --format oxford
    python generate_debate_topics.py --clear
    python generate_debate_topics.py --clear --format oxford
    python generate_debate_topics.py --levels
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
    topic: str
    tagline: str
    characters: list[str]
    rationale: str
    category: str
    theme: str


class _OxfordTopicSchema(BaseModel):
    topic: str           # stated as a proposition: "This house believes that…"
    tagline: str         # ≤15 words
    proposition: list[str]   # exactly 2 characters arguing FOR the motion
    opposition: list[str]    # exactly 2 characters arguing AGAINST the motion
    rationale: str       # why each side genuinely holds their assigned position
    category: str
    theme: str


def _load() -> list[dict]:
    if TOPICS_FILE.exists():
        return json.loads(TOPICS_FILE.read_text(encoding="utf-8"))
    return []


def _save(topics: list[dict]) -> None:
    TOPICS_FILE.write_text(
        json.dumps(topics, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def _avoid_block(existing_for_level: list[dict]) -> str:
    from collections import Counter
    char_counts: Counter = Counter()
    cat_counts:  Counter = Counter()
    for t in existing_for_level:
        for c in t.get("characters", []):
            char_counts[c] += 1
        if t.get("category"):
            cat_counts[t["category"]] += 1

    overused_chars = [n for n, k in char_counts.most_common() if k >= 2]
    overused_cats  = [c for c, k in cat_counts.most_common()  if k >= 3]
    used_themes    = sorted({t["theme"] for t in existing_for_level if t.get("theme")})

    parts = []
    if existing_for_level:
        parts.append(
            "Already in the list — do NOT repeat these combinations or similar topics:\n"
            + "\n".join(f"- {', '.join(t['characters'])}: {t['topic']}" for t in existing_for_level)
        )
    if used_themes:
        parts.append("These themes are ALREADY COVERED — pick a genuinely different theme: " + ", ".join(used_themes))
    if overused_chars:
        parts.append("These characters are OVERUSED — avoid unless the topic genuinely requires them: " + ", ".join(overused_chars))
    if overused_cats:
        parts.append("These categories are OVERREPRESENTED — strongly prefer a different category: " + ", ".join(overused_cats))
    return ("\n\n" + "\n\n".join(parts)) if parts else ""


def _roster_text() -> str:
    return "\n".join(f"- {name}: {data['known_for'][:90]}" for name, data in CHARACTERS.items())


def _generate_one_freeform(level: str, existing: list[dict]) -> _TopicSchema:
    existing_ff = [t for t in existing if t.get("audience_level") == level and t.get("format") != "oxford"]
    avoid = _avoid_block(existing_ff)

    level_name = AUDIENCE_LEVEL_NAMES[level]
    level_ctx  = _LEVEL_CONTEXT.get(level, level_name)

    grade5_note = (
        "\n\nFor grade 5: the topic ambition should match university level — do NOT water it down. "
        "Avoid topics that are purely about school rules or children's daily schedules. "
        "Instead pick genuinely interesting moral or philosophical questions. "
        "Choose characters based on how engaging and accessible their speaking style is for children."
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
            "perfectly calibrated for that audience.\n\n"
            "CAST SIZE — distribute evenly: aim for roughly equal numbers of 2-person, "
            "3-person, and 4-person debates across the collection. Do not default to 2. "
            "Use 4 when four genuinely distinct viewpoints enrich the debate. "
            "Use 3 when an odd-one-out creates useful tension. Use 2 for sharp head-to-head clashes.\n\n"
            "Requirements:\n"
            "- Topic difficulty, framing, and vocabulary must match the audience level exactly\n"
            "- Characters must have genuine ideological or philosophical opposition on this specific topic\n"
            "- Topic must be specific enough to generate real disagreement\n"
            "- Cast must be drawn from a WIDE range of the roster\n"
            "- tagline: ≤15 words, punchy, makes someone want to watch\n"
            "- rationale: one sentence explaining why this cast is compelling (curator only)\n"
            "- category: exactly one of: heated, historic, philosophical, scientific, cultural, political\n"
            "- theme: short snake_case label for the core theme"
            f"{grade5_note}{expert_note}"
        )),
        HumanMessage(content=f"Available participants:\n{_roster_text()}{avoid}"),
    ])

    valid = set(CHARACTERS.keys())
    result.characters = [c for c in result.characters if c in valid]
    if len(result.characters) < 2:
        raise ValueError(f"Too few valid characters: {result.characters}")
    return result


def _generate_one_oxford(existing: list[dict]) -> _OxfordTopicSchema:
    existing_ox = [t for t in existing if t.get("format") == "oxford"]
    # Build avoid block using combined characters list for oxford entries
    for t in existing_ox:
        if "characters" not in t and "roles" in t:
            r = t["roles"]
            t = {**t, "characters": r.get("proposition", []) + r.get("opposition", [])}
    avoid = _avoid_block(existing_ox)

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.95)
    result: _OxfordTopicSchema = llm.with_structured_output(_OxfordTopicSchema).invoke([
        SystemMessage(content=(
            "You are curating an Oxford-style structured debate.\n\n"
            "Rules:\n"
            "- Choose EXACTLY 4 characters — 2 for the Proposition, 2 for the Opposition\n"
            "- The motion must be stated as a proposition (e.g. 'State ownership is the only "
            "path to economic justice')\n"
            "- Each side must AUTHENTICALLY hold their assigned position based on their actual "
            "historical views, writings, or ideology — this is critical. Do not assign a character "
            "to a side that contradicts their real beliefs\n"
            "- The two sides must be in genuine, deep opposition — not just surface disagreement\n"
            "- Avoid casts where one side is obviously correct or where the debate would be one-sided\n"
            "- Draw from across the full roster — not just the famous scientists or philosophers\n"
            "- tagline: ≤15 words, punchy\n"
            "- rationale: explain in one sentence why each side genuinely holds their position "
            "(curator only)\n"
            "- category: exactly one of: heated, historic, philosophical, scientific, cultural, political\n"
            "- theme: short snake_case label for the core theme"
        )),
        HumanMessage(content=f"Available participants:\n{_roster_text()}{avoid}"),
    ])

    valid = set(CHARACTERS.keys())
    result.proposition = [c for c in result.proposition if c in valid]
    result.opposition  = [c for c in result.opposition  if c in valid]
    if len(result.proposition) != 2 or len(result.opposition) != 2:
        raise ValueError(f"Oxford requires exactly 2v2. Got prop={result.proposition} opp={result.opposition}")
    return result


# --------------------------------------------------------------------------- #
# Commands                                                                      #
# --------------------------------------------------------------------------- #

def cmd_generate(count: int, level: str | None, fmt: str | None, verbose: bool) -> None:
    topics = _load()
    valid_levels = list(AUDIENCE_LEVELS.keys())

    # Build the work queue: list of (level, format)
    queue: list[tuple[str, str]] = []
    if fmt == "oxford":
        queue = [("university", "oxford")] * count
    elif fmt == "freeform":
        if level is None:
            queue = [(valid_levels[i % len(valid_levels)], "freeform") for i in range(count)]
        else:
            queue = [(level, "freeform")] * count
    else:
        # Mixed: 1 oxford per 4 freeform
        for i in range(count):
            if (i + 1) % 5 == 0:
                queue.append(("university", "oxford"))
            else:
                lvl = valid_levels[i % len(valid_levels)] if level is None else level
                queue.append((lvl, "freeform"))

    print(f"Generating {count} topic(s)…")
    if fmt:
        print(f"  Format: {fmt}")
    else:
        print(f"  Format: mixed (1 oxford per 4 freeform)")
    if level and fmt != "oxford":
        print(f"  Level: {AUDIENCE_LEVEL_NAMES[level]}")
    print()

    ok = 0
    for i, (lvl, entry_fmt) in enumerate(queue, 1):
        try:
            if entry_fmt == "oxford":
                r = _generate_one_oxford(topics)
                all_chars = r.proposition + r.opposition
                entry = {
                    "id":             uuid.uuid4().hex[:8],
                    "topic":          r.topic,
                    "tagline":        r.tagline,
                    "characters":     all_chars,
                    "roles":          {"proposition": r.proposition, "opposition": r.opposition},
                    "category":       r.category,
                    "theme":          r.theme,
                    "audience_level": "university",
                    "rationale":      r.rationale,
                    "format":         "oxford",
                    "source":         "generated",
                    "generated_at":   date.today().isoformat(),
                }
                label = f"[oxford] {r.topic[:55]}"
                if verbose:
                    print(f"[{i}/{count}] {label}")
                    print(f"  Proposition: {', '.join(r.proposition)}")
                    print(f"  Opposition:  {', '.join(r.opposition)}")
                    print(f"  Tagline:     {r.tagline}")
                    print(f"  Rationale:   {r.rationale}")
                    print()
            else:
                r = _generate_one_freeform(lvl, topics)
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
                label = f"[{lvl}] {r.topic[:60]}"
                if verbose:
                    print(f"[{i}/{count}] {label}")
                    print(f"  Cast:      {', '.join(r.characters)}")
                    print(f"  Tagline:   {r.tagline}")
                    print(f"  Rationale: {r.rationale}")
                    print()

            topics.append(entry)
            _save(topics)
            ok += 1
            if not verbose:
                print(f"[{i}/{count}] {label}")
        except Exception as exc:
            print(f"[{i}/{count}] ERROR: {exc}", file=sys.stderr)

    print(f"\n{ok}/{count} saved to {TOPICS_FILE}  (total in file: {len(topics)})")


def cmd_list(level: str | None, fmt: str | None) -> None:
    topics = _load()
    if level:
        topics = [t for t in topics if t.get("audience_level") == level]
    if fmt == "oxford":
        topics = [t for t in topics if t.get("format") == "oxford"]
    elif fmt == "freeform":
        topics = [t for t in topics if t.get("format") != "oxford"]
    if not topics:
        print("No topics found.")
        return
    for t in topics:
        src    = "★ curated  " if t.get("source") == "curated" else "· generated"
        lvl    = t.get("audience_level", "?")
        oxflag = " [oxford]" if t.get("format") == "oxford" else ""
        chars  = t.get("characters") or []
        print(f"{src}  [{lvl:<14}]{oxflag}  {t['topic']}")
        print(f"               {', '.join(chars)}")
    print(f"\nTotal: {len(topics)}")


def cmd_clear(fmt: str | None) -> None:
    topics = _load()
    if fmt == "oxford":
        kept    = [t for t in topics if t.get("source") == "curated" or t.get("format") != "oxford"]
        removed = len(topics) - len(kept)
        _save(kept)
        print(f"Removed {removed} generated Oxford entries. {len(kept)} entries kept.")
    elif fmt == "freeform":
        kept    = [t for t in topics if t.get("source") == "curated" or t.get("format") == "oxford"]
        removed = len(topics) - len(kept)
        _save(kept)
        print(f"Removed {removed} generated freeform entries. {len(kept)} entries kept.")
    else:
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
            "  python generate_debate_topics.py --count 10\n"
            "  python generate_debate_topics.py --count 5 --format oxford\n"
            "  python generate_debate_topics.py --count 10 --format freeform --level university\n"
            "  python generate_debate_topics.py --list --format oxford\n"
            "  python generate_debate_topics.py --clear --format oxford\n"
            "  python generate_debate_topics.py --levels\n"
        ),
    )
    parser.add_argument("--count",   type=int,  metavar="N",      help="Number of topics to generate")
    parser.add_argument("--format",  metavar="FORMAT",            help="freeform | oxford (default: mixed)")
    parser.add_argument("--level",   metavar="LEVEL",             help="Target audience level for freeform (see --levels)")
    parser.add_argument("--list",    action="store_true",          help="List topics in debate_topics.json")
    parser.add_argument("--clear",   action="store_true",          help="Remove generated topics (curated entries always kept)")
    parser.add_argument("--levels",  action="store_true",          help="List valid audience level keys")
    parser.add_argument("--verbose", action="store_true",          help="Print full details during generation")
    args = parser.parse_args()

    if args.format and args.format not in ("freeform", "oxford"):
        print(f"Unknown format '{args.format}'. Use: freeform, oxford", file=sys.stderr)
        sys.exit(1)
    if args.level and args.level not in AUDIENCE_LEVELS:
        print(f"Unknown level '{args.level}'. Valid: {', '.join(AUDIENCE_LEVELS)}", file=sys.stderr)
        sys.exit(1)
    if args.format == "oxford" and args.level:
        print("--level is ignored for oxford format (always university)", file=sys.stderr)

    if args.levels:
        cmd_levels()
    elif args.list:
        cmd_list(args.level, args.format)
    elif args.clear:
        cmd_clear(args.format)
    elif args.count:
        cmd_generate(args.count, args.level, args.format, args.verbose)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
