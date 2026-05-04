"""
Generate cable_news persona blocks for all characters in personas.py.

Usage:
    python generate_cable_news_personas.py               # generate and save to cable_news_blocks.json
    python generate_cable_news_personas.py --apply       # generate and patch personas.py directly
    python generate_cable_news_personas.py --apply --name "Isaac Newton"  # single character
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

from personas import CHARACTERS

_PERSONAS_PATH = Path(__file__).parent / "personas.py"
_OUTPUT_PATH   = Path(__file__).parent / "cable_news_blocks.json"

_SCHEMA = """{
  "tv_persona":       "One sentence: their on-screen character — the distorted, simplified TV version of who they really are",
  "agenda":           "The one talking point they push this segment no matter what is asked (one sentence)",
  "rhetorical_style": "How they argue on TV: signature opener phrases, interruption patterns, deflection tactics (2-3 sentences)",
  "never_concedes":   "The one position they will never back down from on air, no matter what (one sentence)"
}"""


def _llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.9)


def generate_block(name: str) -> tuple[str, dict]:
    char = CHARACTERS[name]
    prompt = (
        f"You are writing satirical cable news personality profiles for a debate game.\n\n"
        f"Character: {name}\n"
        f"Era: {char.get('era', '')}\n"
        f"Known for: {char.get('known_for', '')}\n"
        f"Core beliefs: {str(char.get('core_beliefs', ''))[:300]}\n"
        f"Rhetorical style: {str(char.get('rhetorical_moves', ''))[:200]}\n\n"
        f"Generate a cable_news block — how does this person appear as a cable news guest? "
        f"Lean into the satirical gap between their actual ideas and their TV persona. "
        f"The TV persona should be a distorted, combative, soundbite version of the real person — "
        f"their worst intellectual habits amplified, their ideas reduced to slogans. "
        f"The agenda should feel like something they'd say no matter what question is asked. "
        f"Output ONLY valid JSON — no markdown fences, no explanation — matching this schema:\n{_SCHEMA}"
    )
    try:
        r = _llm().invoke([HumanMessage(content=prompt)])
        content = r.content.strip()
        if content.startswith("```"):
            lines = content.splitlines()
            content = "\n".join(
                l for l in lines
                if not l.strip().startswith("```")
            )
        return name, json.loads(content.strip())
    except Exception as e:
        print(f"  ERROR [{name}]: {e}", file=sys.stderr)
        return name, {}


def generate_all(names: list[str]) -> dict[str, dict]:
    results = {}
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(generate_block, n): n for n in names}
        for fut in as_completed(futures):
            name, block = fut.result()
            if block:
                results[name] = block
                print(f"  OK {name}")
            else:
                print(f"  FAIL {name}")
    return results


def _format_block(block: dict, indent: int = 8) -> str:
    pad = " " * indent
    inner_pad = " " * (indent + 4)
    lines = [f'{pad}"cable_news": {{']
    for key, val in block.items():
        escaped = val.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{inner_pad}"{key}": "{escaped}",')
    lines.append(f"{pad}}},")
    return "\n".join(lines)


def apply_to_personas(blocks: dict[str, dict]) -> None:
    text = _PERSONAS_PATH.read_text(encoding="utf-8")
    changed = 0

    for name, block in blocks.items():
        if not block:
            continue

        # Skip if already present
        # Find the character's entry start
        entry_start = text.find(f'    "{name}": {{')
        if entry_start == -1:
            print(f"  SKIP [{name}]: not found in personas.py", file=sys.stderr)
            continue

        # Check if cable_news already exists in this entry
        # Find the next top-level character entry after this one
        next_entry = re.search(r'\n    "[^"]+": \{', text[entry_start + 1:])
        entry_end = (entry_start + 1 + next_entry.start()) if next_entry else len(text)
        entry_text = text[entry_start:entry_end]

        if '"cable_news"' in entry_text:
            print(f"  SKIP [{name}]: cable_news already present")
            continue

        # Insert before the closing     }, of the character entry
        # That's the last     }, in entry_text
        close_match = None
        for m in re.finditer(r'\n    \},', entry_text):
            close_match = m
        if not close_match:
            print(f"  SKIP [{name}]: couldn't find closing brace", file=sys.stderr)
            continue

        insert_pos = entry_start + close_match.start()
        formatted = "\n" + _format_block(block)
        text = text[:insert_pos] + formatted + text[insert_pos:]
        changed += 1

    _PERSONAS_PATH.write_text(text, encoding="utf-8")
    print(f"\nPatched {changed} characters in personas.py")


def main():
    parser = argparse.ArgumentParser(description="Generate cable_news persona blocks")
    parser.add_argument("--apply", action="store_true", help="Patch personas.py directly")
    parser.add_argument("--name", type=str, default="", help="Single character name")
    parser.add_argument("--from-file", type=str, default="", help="Apply blocks from existing JSON file")
    args = parser.parse_args()

    if args.from_file:
        blocks = json.loads(Path(args.from_file).read_text(encoding="utf-8"))
        print(f"Loaded {len(blocks)} blocks from {args.from_file}")
        if args.apply:
            apply_to_personas(blocks)
        return

    if args.name:
        names = [args.name]
    else:
        names = [n for n in CHARACTERS if not CHARACTERS[n].get("cable_news")]

    if not names:
        print("All characters already have cable_news blocks.")
        return

    print(f"Generating cable_news blocks for {len(names)} character(s)…")
    blocks = generate_all(names)

    _OUTPUT_PATH.write_text(json.dumps(blocks, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSaved to {_OUTPUT_PATH}")

    if args.apply:
        apply_to_personas(blocks)


if __name__ == "__main__":
    main()
