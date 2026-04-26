"""
Generate portrait images for each philosopher in personas.py using DALL-E 3.

Run:
    python generate_portraits.py            # all characters
    python generate_portraits.py Newton Einstein  # specific names (partial match OK)

Images are saved to OUTPUT_DIR. Already-generated portraits are skipped unless
you pass --overwrite.

Edit the block below to change style, size, quality, or the prompt template.
"""

import os
import sys
import time
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from personas import CHARACTERS

# ── Configurable parameters ────────────────────────────────────────────────────

OUTPUT_DIR   = "portraits"          # folder to save images
IMAGE_SIZE   = "1024x1024"          # "1024x1024" | "1792x1024" | "1024x1792"
IMAGE_QUALITY = "standard"          # "standard" | "hd"
MODEL        = "dall-e-3"

# The style clause injected into every prompt.  Edit this to change the look.
STYLE = (
    "flat vector illustration, bold cartoon style, warm limited colour palette, "
    "clean thick outlines, expressive face, no background clutter, "
    "slightly caricatured but recognisable"
)

# Prompt template.  Available variables: {name}, {era}, {known_for}, {style}
PROMPT_TEMPLATE = (
    "Portrait of {name} ({era}), {known_for}. "
    "{style}. "
    "Bust-length portrait, facing slightly left, confident expression."
)

DELAY_BETWEEN = 2   # seconds between API calls to avoid rate limits

# ── Image generation ───────────────────────────────────────────────────────────

def _safe_filename(name: str) -> str:
    return name.replace(" ", "_").replace("/", "-") + ".png"


def _build_prompt(name: str, char: dict) -> str:
    return PROMPT_TEMPLATE.format(
        name=name,
        era=char["era"],
        known_for=char["known_for"][:200],
        style=STYLE,
    )


def generate_portraits(names: list[str] | None = None, overwrite: bool = False) -> None:
    load_dotenv()
    client = OpenAI()
    out = Path(OUTPUT_DIR)
    out.mkdir(exist_ok=True)

    targets = {}
    if names:
        for query in names:
            matches = [k for k in CHARACTERS if query.lower() in k.lower()]
            if not matches:
                print(f"  No match for '{query}' — skipping")
            for m in matches:
                targets[m] = CHARACTERS[m]
    else:
        targets = CHARACTERS

    total = len(targets)
    for i, (name, char) in enumerate(targets.items(), 1):
        dest = out / _safe_filename(name)
        if dest.exists() and not overwrite:
            print(f"[{i}/{total}] {name} — already exists, skipping")
            continue

        prompt = _build_prompt(name, char)
        print(f"[{i}/{total}] {name} … ", end="", flush=True)

        try:
            response = client.images.generate(
                model=MODEL,
                prompt=prompt,
                size=IMAGE_SIZE,
                quality=IMAGE_QUALITY,
                n=1,
            )
            url = response.data[0].url
            urllib.request.urlretrieve(url, dest)
            print(f"saved → {dest}")
        except Exception as e:
            print(f"FAILED — {e}")

        if i < total:
            time.sleep(DELAY_BETWEEN)

    print(f"\nDone. Images in ./{OUTPUT_DIR}/")


# ── CLI entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite = "--overwrite" in sys.argv
    generate_portraits(names=args or None, overwrite=overwrite)
