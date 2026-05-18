#!/usr/bin/env python3
"""Generate 128×128 WebP thumbnails from portrait PNGs.

Reads from  portraits/
Writes to   portrait_thumbs/   (created if missing)
Overwrites any existing thumbnail.

Usage:
    python generate_thumbs.py              # process all portraits
    python generate_thumbs.py Newton       # one character (partial name ok)
    python generate_thumbs.py Newton Tesla # multiple characters
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required — run: pip install Pillow")

PORTRAITS_DIR = Path(__file__).parent / "portraits"
THUMBS_DIR    = Path(__file__).parent / "portrait_thumbs"
THUMB_PX      = 128
WEBP_QUALITY  = 85


def make_thumb(src: Path) -> None:
    dest = THUMBS_DIR / src.with_suffix(".webp").name
    with Image.open(src) as img:
        img = img.convert("RGBA")
        img.thumbnail((THUMB_PX, THUMB_PX), Image.LANCZOS)
        img.save(dest, "WEBP", quality=WEBP_QUALITY)
    before = src.stat().st_size // 1024
    after  = dest.stat().st_size // 1024
    print(f"  {src.name:40s}  {before:>5}KB  ->  {after:>3}KB  ({dest.name})")


def resolve_sources(args: list[str]) -> list[Path]:
    sources = []
    for name in args:
        stem = name.replace(" ", "_")
        matches = list(PORTRAITS_DIR.glob(f"*{stem}*.png"))
        if matches:
            sources.extend(matches)
        else:
            print(f"  ✗ No portrait found matching '{name}'")
    return sorted(set(sources))


def main() -> None:
    if not PORTRAITS_DIR.exists():
        sys.exit(f"portraits/ directory not found at {PORTRAITS_DIR}")

    THUMBS_DIR.mkdir(exist_ok=True)

    sources = resolve_sources(sys.argv[1:]) if len(sys.argv) > 1 \
              else sorted(PORTRAITS_DIR.glob("*.png"))

    if not sources:
        print("No portraits to process.")
        return

    print(f"Generating {len(sources)} thumbnail(s) -> {THUMBS_DIR}\n")
    for src in sources:
        make_thumb(src)
    print("\nDone.")


if __name__ == "__main__":
    main()
