"""
Generate newspaper-style portrait images for each character in personas.py.

Source priority:
  1. Wikipedia real photo  — for characters in WIKIPEDIA_SOURCES (figures DALL-E
                             refuses to generate, plus anyone with a better real photo)
  2. DALL-E 3 generation   — vintage press-photo style for photography-era figures,
                             woodcut engraving style for pre-photography figures

Run:
    python generate_newspaper_portraits.py            # all characters
    python generate_newspaper_portraits.py Newton     # partial name match
    python generate_newspaper_portraits.py --overwrite  # regenerate existing

Images are saved to OUTPUT_DIR as <First_Last>.png.
"""

import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from personas import CHARACTERS

# ── Configurable parameters ────────────────────────────────────────────────────

OUTPUT_DIR    = "newspaper_portraits"
IMAGE_SIZE    = "1024x1024"
IMAGE_QUALITY = "standard"
MODEL         = "dall-e-3"

# Characters who died after this year were photographed in their lifetime.
PHOTO_ERA_CUTOFF = 1845

DELAY_BETWEEN = 2   # seconds between DALL-E calls to stay under rate limits

# ── Wikipedia sources ──────────────────────────────────────────────────────────
# Maps character name → Wikipedia article title.
# These characters get their main Wikipedia photo instead of a DALL-E generation.
# Add any character here if DALL-E refuses or the result is poor.

WIKIPEDIA_SOURCES: dict[str, str] = {
    "Adolf Hitler":            "Adolf_Hitler",
    "Joseph Stalin":           "Joseph_Stalin",
    "Mao Zedong":              "Mao_Zedong",
    "Pol Pot":                 "Pol_Pot",
    "Vladimir Lenin":          "Vladimir_Lenin",
    "Vladimir Putin":          "Vladimir_Putin",
    "Xi Jinping":              "Xi_Jinping",
    # Living tech figures DALL-E sometimes refuses
    "Elon Musk":               "Elon_Musk",
    "Bill Gates":              "Bill_Gates",
    "Steve Jobs":              "Steve_Jobs",
}

# ── Era-aware DALL-E style definitions ────────────────────────────────────────

STYLE_PHOTO = (
    "authentic period press photograph, sepia-toned, slightly grainy, "
    "high contrast, newsprint reproduction quality, "
    "formal posed portrait, no colour"
)

STYLE_ENGRAVING = (
    "Victorian newspaper woodcut engraving, fine cross-hatching, "
    "black ink on white, period illustration style, "
    "formal bust portrait, no colour"
)

PROMPT_TEMPLATE = (
    "Portrait of {name} ({era}), {known_for}. "
    "{style}. "
    "Head and shoulders, facing three-quarters, composed expression. "
    "No text, no border, no frame."
)

# ── Helpers ────────────────────────────────────────────────────────────────────

def _safe_filename(name: str) -> str:
    return name.replace(" ", "_").replace("/", "-") + ".png"


def _death_year(era: str) -> int:
    if "present" in era.lower():
        return 9999
    bc = "bc" in era.lower()
    m = re.search(r'\d{3,4}\s*[–\-]\s*(\d{3,4})', era)
    if m:
        y = int(m.group(1))
        return -y if bc else y
    m = re.search(r'(\d{3,4})', era)
    if m:
        y = int(m.group(1))
        return -y if bc else y
    return 0


def _build_dalle_prompt(name: str, char: dict) -> str:
    death = _death_year(char["era"])
    style = STYLE_PHOTO if death > PHOTO_ERA_CUTOFF else STYLE_ENGRAVING
    return PROMPT_TEMPLATE.format(
        name=name,
        era=char["era"],
        known_for=char["known_for"][:200],
        style=style,
    )


def _fetch_wikipedia_image(article_title: str) -> str | None:
    """Return the original image URL from Wikipedia's summary API, or None."""
    encoded = urllib.parse.quote(article_title, safe="")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}"
    req = urllib.request.Request(url, headers={"User-Agent": "PhilosophersBar/1.0 (newspaper portrait generator)"})
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
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                dest.write_bytes(resp.read())
            return
        except urllib.error.HTTPError as exc:
            if exc.code == 429 and attempt < 2:
                wait = 10 * (attempt + 1)
                print(f"rate limited, waiting {wait}s … ", end="", flush=True)
                time.sleep(wait)
            else:
                raise


# ── Main generation ────────────────────────────────────────────────────────────

def generate_newspaper_portraits(names: list[str] | None = None, overwrite: bool = False, force_wiki: bool = False) -> None:
    load_dotenv()

    out = Path(OUTPUT_DIR)
    out.mkdir(exist_ok=True)

    # Resolve target characters
    targets: dict[str, dict] = {}
    if names:
        for query in names:
            matches = [k for k in CHARACTERS if query.lower() in k.lower()]
            if not matches:
                print(f"  No match for '{query}' — skipping")
            for m in matches:
                targets[m] = CHARACTERS[m]
    else:
        targets = dict(CHARACTERS)

    dalle_client = None   # lazy-init only if needed
    total = len(targets)

    for i, (name, char) in enumerate(targets.items(), 1):
        dest = out / _safe_filename(name)
        is_wiki = name in WIKIPEDIA_SOURCES or force_wiki
        if dest.exists() and not overwrite and not is_wiki:
            print(f"[{i}/{total}] {name} — already exists, skipping")
            continue

        # ── Wikipedia path ──────────────────────────────────────────────────
        if is_wiki:
            article = WIKIPEDIA_SOURCES.get(name, name.replace(" ", "_"))
            print(f"[{i}/{total}] {name} (wikipedia) … ", end="", flush=True)
            img_url = _fetch_wikipedia_image(article)
            if img_url:
                try:
                    _download(img_url, dest)
                    print(f"saved → {dest}")
                    if i < total:
                        time.sleep(DELAY_BETWEEN)
                    continue
                except Exception as exc:
                    print(f"download failed ({exc}), falling back to DALL-E … ", end="", flush=True)
            else:
                print("no image found, falling back to DALL-E … ", end="", flush=True)

        # ── DALL-E path ─────────────────────────────────────────────────────
        death = _death_year(char["era"])
        mode  = "photo" if death > PHOTO_ERA_CUTOFF else "engraving"
        print(f"[{i}/{total}] {name} (dalle/{mode}) … ", end="", flush=True)

        if dalle_client is None:
            dalle_client = OpenAI()

        try:
            response = dalle_client.images.generate(
                model=MODEL,
                prompt=_build_dalle_prompt(name, char),
                size=IMAGE_SIZE,
                quality=IMAGE_QUALITY,
                n=1,
            )
            img_url = response.data[0].url
            _download(img_url, dest)
            print(f"saved → {dest}")
        except Exception as exc:
            print(f"FAILED — {exc}")

        if i < total:
            time.sleep(DELAY_BETWEEN)

    print(f"\nDone. Images in ./{OUTPUT_DIR}/")


# ── CLI entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite  = "--overwrite" in sys.argv
    force_wiki = "--wiki"      in sys.argv
    generate_newspaper_portraits(names=args or None, overwrite=overwrite or force_wiki, force_wiki=force_wiki)
