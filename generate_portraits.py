"""
Generate portrait images for each philosopher in personas.py using DALL-E 3.

Characters in WIKIPEDIA_SOURCES are fetched as real Wikipedia photos instead
of being generated — useful for figures DALL-E refuses (Hitler, Stalin, etc.).

Run:
    python generate_portraits.py            # all characters
    python generate_portraits.py Newton Einstein  # specific names (partial match OK)

Images are saved to OUTPUT_DIR. Already-generated portraits are skipped unless
you pass --overwrite.

Edit the block below to change style, size, quality, or the prompt template.
"""

import json
import sys
import time
import urllib.parse
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

# ── Wikipedia sources ──────────────────────────────────────────────────────────
# Characters here get their main Wikipedia photo instead of a DALL-E generation.
# Add any name here if DALL-E refuses or the result is poor.

WIKIPEDIA_SOURCES: dict[str, str] = {
    "Adolf Hitler":  "Adolf_Hitler",
    "Joseph Stalin": "Joseph_Stalin",
    "Mao Zedong":    "Mao_Zedong",
    "Pol Pot":       "Pol_Pot",
    "Vladimir Lenin":"Vladimir_Lenin",
    "Vladimir Putin":"Vladimir_Putin",
    "Xi Jinping":    "Xi_Jinping",
    "Elon Musk":     "Elon_Musk",
    "Bill Gates":    "Bill_Gates",
    "Steve Jobs":    "Steve_Jobs",
}

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


def _fetch_wikipedia_image(article_title: str) -> str | None:
    """Return the original image URL from Wikipedia's summary API, or None."""
    encoded = urllib.parse.quote(article_title, safe="")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
    req = urllib.request.Request(url, headers={"User-Agent": "PhilosophersBar/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        img = data.get("originalimage") or data.get("thumbnail")
        return img["source"] if img else None
    except Exception as exc:
        print(f"Wikipedia fetch failed ({exc})", end=" ")
        return None


def _download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "PhilosophersBar/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        dest.write_bytes(resp.read())


def generate_portraits(names: list[str] | None = None, overwrite: bool = False, force_wiki: bool = False) -> None:
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

        # ── Wikipedia path ──────────────────────────────────────────────────
        if name in WIKIPEDIA_SOURCES or force_wiki:
            print(f"[{i}/{total}] {name} (wikipedia) … ", end="", flush=True)
            img_url = _fetch_wikipedia_image(WIKIPEDIA_SOURCES.get(name, name.replace(" ", "_")))
            if img_url:
                try:
                    _download(img_url, dest)
                    print(f"saved → {dest}")
                    continue
                except Exception as exc:
                    print(f"download failed ({exc}), falling back to DALL-E … ", end="", flush=True)
            else:
                print("no image found, falling back to DALL-E … ", end="", flush=True)

        # ── DALL-E path ─────────────────────────────────────────────────────
        print(f"[{i}/{total}] {name} (dalle) … ", end="", flush=True)
        try:
            response = client.images.generate(
                model=MODEL,
                prompt=_build_prompt(name, char),
                size=IMAGE_SIZE,
                quality=IMAGE_QUALITY,
                n=1,
            )
            img_url = response.data[0].url
            _download(img_url, dest)
            print(f"saved → {dest}")
        except Exception as e:
            print(f"FAILED — {e}")

        if i < total:
            time.sleep(DELAY_BETWEEN)

    print(f"\nDone. Images in ./{OUTPUT_DIR}/")


# ── CLI entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite    = "--overwrite" in sys.argv
    force_wiki   = "--wiki"      in sys.argv
    generate_portraits(names=args or None, overwrite=overwrite, force_wiki=force_wiki)
