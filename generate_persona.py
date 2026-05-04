"""
Generate a new character persona entry for personas.py.

Usage:
    python generate_persona.py "Hannah Arendt"
    python generate_persona.py "Voltaire" --portrait    # also generate portrait after
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

_SCHEMA_EXAMPLE = '''\
"Hannah Arendt": {
    "category": "Philosophy",
    "era": "1906–1975, Germany / United States",
    "voice_id": "",
    "known_for": "...",
    "aliases": ["Arendt"],
    "core_beliefs": "...",
    "rhetorical_moves": "...",
    "cite_these": "...",
    "hot_topics": "...",
    "openness": 7,
    "what_would_change_mind": "...",
    "dynamics": {
        "Adolf Hitler": "...",
    },
    "cable_news": {
        "tv_persona": "...",
        "agenda": "...",
        "rhetorical_style": "...",
        "never_concedes": "...",
    },
},'''

_CATEGORIES = [
    "Science", "Philosophy", "Politics", "Art", "Music",
    "Literature", "Religion", "Military", "Economics", "Media",
]

_EXISTING_NAMES = None

def _get_existing_names() -> list[str]:
    global _EXISTING_NAMES
    if _EXISTING_NAMES is None:
        try:
            from personas import CHARACTERS
            _EXISTING_NAMES = list(CHARACTERS.keys())
        except Exception:
            _EXISTING_NAMES = []
    return _EXISTING_NAMES


def generate(name: str) -> str:
    existing = _get_existing_names()
    existing_sample = ", ".join(existing[:20]) + (f" (and {len(existing) - 20} more)" if len(existing) > 20 else "")

    system = (
        "You are generating a character entry for a historical debate game. "
        "You produce richly detailed, historically accurate persona data. "
        "Output ONLY valid Python dict syntax — no markdown fences, no variable assignment, "
        "just the dict literal starting with the character name key."
    )

    prompt = (
        f"Generate a complete personas.py entry for: {name}\n\n"
        f"Existing characters for dynamics reference: {existing_sample}\n\n"
        f"Follow this exact schema (all fields required):\n{_SCHEMA_EXAMPLE}\n\n"
        f"Guidelines:\n"
        f"- category: one of {_CATEGORIES}\n"
        f"- era: birth–death years and country/countries\n"
        f"- voice_id: always empty string\n"
        f"- aliases: short name(s) people would use to refer to them mid-debate\n"
        f"- core_beliefs: 4-6 sentences capturing their actual philosophical/intellectual positions\n"
        f"- rhetorical_moves: how they characteristically argue — sentence structures, habits, signature moves\n"
        f"- cite_these: specific works, quotes, experiments, moments they'd naturally draw from\n"
        f"- hot_topics: what makes them animated, combative, or deeply engaged\n"
        f"- openness: integer 1-10 (1=dogmatic, 10=endlessly revisable)\n"
        f"- what_would_change_mind: the specific kind of evidence or argument that could shift them\n"
        f"- dynamics: relationships with 3-6 of the existing characters — specific, historically grounded\n"
        f"- cable_news.tv_persona: their distorted, simplified TV character — worst habits amplified\n"
        f"- cable_news.agenda: the one talking point they push no matter what is asked\n"
        f"- cable_news.rhetorical_style: TV-specific arguing style, opener phrases, deflection tactics\n"
        f"- cable_news.never_concedes: the one thing they won't back down from on air\n\n"
        f"Make the cable_news block satirically different from their real self — "
        f"the gap between who they were and who they'd be on TV is part of the joke."
    )

    llm = ChatOpenAI(model="gpt-4o", temperature=0.85)
    r = llm.invoke([SystemMessage(content=system), HumanMessage(content=prompt)])
    return r.content.strip()


def main():
    parser = argparse.ArgumentParser(description="Generate a new character persona for personas.py")
    parser.add_argument("name", help="Character name, e.g. 'Hannah Arendt'")
    parser.add_argument("--portrait", action="store_true", help="Also generate a portrait via DALL-E after")
    args = parser.parse_args()

    print(f"Generating persona for: {args.name}")
    print("(using gpt-4o — this takes a few seconds)\n")

    try:
        result = generate(args.name)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    print("─" * 60)
    print(result)
    print("─" * 60)
    print(f"\nCopy the block above into personas.py inside the CHARACTERS dict.")

    if args.portrait:
        print(f"\nGenerating portrait for {args.name}…")
        subprocess.run([sys.executable, "generate_portraits.py", args.name])


if __name__ == "__main__":
    main()
