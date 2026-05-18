"""
Generate portrait images for each character in personas.py.

Two built-in styles selectable via --style:
  cartoon    (default) flat vector illustration, bold cartoon style
  newspaper  era-aware: woodcut engraving for pre-1845, press photo for post-1845

Characters in WIKIPEDIA_SOURCES get their Wikipedia photo instead of a
generated image — useful for figures the model refuses (Hitler, Stalin, etc.).

Run:
    python generate_portraits.py                        # all, cartoon style
    python generate_portraits.py Newton Einstein        # specific names (partial match OK)
    python generate_portraits.py --style newspaper      # newspaper style, all
    python generate_portraits.py Newton --style newspaper
    python generate_portraits.py --overwrite            # regenerate existing
"""

import base64
import re
import json
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

OUTPUT_DIR    = "portraits"
IMAGE_SIZE    = "1024x1024"
IMAGE_QUALITY = "medium"        # "low" | "medium" | "high" | "auto"
MODEL         = "gpt-image-1"

DELAY_BETWEEN = 2               # seconds between API calls to avoid rate limits

# Characters who died after this year were photographed in their lifetime.
PHOTO_ERA_CUTOFF = 1845

# ── Style definitions ──────────────────────────────────────────────────────────

STYLES: dict[str, dict] = {
    "cartoon": {
        "template": (
            "Portrait of {name} ({era}), {known_for}. "
            "{style}. "
            "Bust-length portrait, facing slightly left, confident expression."
        ),
        "style": (
            "flat vector illustration, bold cartoon style, warm limited colour palette, "
            "clean thick outlines, expressive face, no background clutter, "
            "slightly caricatured but recognisable"
        ),
    },
    "newspaper": {
        "template": (
            "Portrait of {name} ({era}), {known_for}. "
            "{style}. "
            "Head and shoulders, facing three-quarters, composed expression. "
            "No text, no border, no frame."
        ),
        # style is era-dependent — resolved in _build_prompt()
        "style_photo": (
            "authentic period press photograph, sepia-toned, slightly grainy, "
            "high contrast, newsprint reproduction quality, "
            "formal posed portrait, no colour"
        ),
        "style_engraving": (
            "Victorian newspaper woodcut engraving, fine cross-hatching, "
            "black ink on white, period illustration style, "
            "formal bust portrait, no colour"
        ),
    },
}

# ── Wikipedia sources ──────────────────────────────────────────────────────────
# Characters here get their Wikipedia photo instead of a generated image.
# Add any name here if the model refuses or the result is poor.

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
    "Bill O'Reilly": "Bill_O'Reilly_(political_commentator)",
}

# ── Helpers ────────────────────────────────────────────────────────────────────

def _safe_filename(name: str) -> str:
    return name.replace(" ", "_").replace("/", "-") + ".png"


def _death_year(era: str) -> int:
    """Extract death year from an era string like '1643-1727, England'."""
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


def _build_prompt(name: str, char: dict, style_name: str) -> str:
    s = STYLES[style_name]
    if style_name == "newspaper":
        death = _death_year(char["era"])
        style_str = s["style_photo"] if death > PHOTO_ERA_CUTOFF else s["style_engraving"]
    else:
        style_str = s["style"]
    return s["template"].format(
        name=name,
        era=char["era"],
        known_for=char["known_for"][:200],
        style=style_str,
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

def generate_portraits(
    names: list[str] | None = None,
    overwrite: bool = False,
    force_wiki: bool = False,
    style: str = "cartoon",
) -> None:
    if style not in STYLES:
        sys.exit(f"Unknown style '{style}'. Choose from: {', '.join(STYLES)}")

    load_dotenv()
    client = None   # lazy-init — only created if a generation is needed

    out = Path(OUTPUT_DIR)
    out.mkdir(exist_ok=True)

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
                    print(f"saved -> {dest}")
                    if i < total:
                        time.sleep(DELAY_BETWEEN)
                    continue
                except Exception as exc:
                    print(f"download failed ({exc}), falling back to {MODEL} … ", end="", flush=True)
            else:
                print(f"no image found, falling back to {MODEL} … ", end="", flush=True)

        # ── Generation path ─────────────────────────────────────────────────
        if style == "newspaper":
            death = _death_year(char["era"])
            mode  = "photo" if death > PHOTO_ERA_CUTOFF else "engraving"
            print(f"[{i}/{total}] {name} ({MODEL}/{mode}) … ", end="", flush=True)
        else:
            print(f"[{i}/{total}] {name} ({MODEL}) … ", end="", flush=True)

        if client is None:
            client = OpenAI()

        try:
            response = client.images.generate(
                model=MODEL,
                prompt=_build_prompt(name, char, style),
                size=IMAGE_SIZE,
                quality=IMAGE_QUALITY,
                n=1,
            )
            img_bytes = base64.b64decode(response.data[0].b64_json)
            dest.write_bytes(img_bytes)
            print(f"saved -> {dest}")
        except Exception as exc:
            print(f"FAILED — {exc}")

        if i < total:
            time.sleep(DELAY_BETWEEN)

    print(f"\nDone. Images in ./{OUTPUT_DIR}/")


# ── CLI entry point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args      = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite  = "--overwrite" in sys.argv
    force_wiki = "--wiki"      in sys.argv
    style      = "cartoon"
    for arg in sys.argv[1:]:
        if arg.startswith("--style="):
            style = arg.split("=", 1)[1]
        elif arg == "--style" and sys.argv.index(arg) + 1 < len(sys.argv):
            style = sys.argv[sys.argv.index(arg) + 1]
            args  = [a for a in args if a != style]

    generate_portraits(
        names=args or None,
        overwrite=overwrite or force_wiki,
        force_wiki=force_wiki,
        style=style,
    )
