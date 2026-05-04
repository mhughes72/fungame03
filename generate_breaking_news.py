"""Generate a pool of absurdist BREAKING NEWS headlines and save to breaking_news.json.

Usage:
    python generate_breaking_news.py          # generate 40 headlines
    python generate_breaking_news.py --count 80
    python generate_breaking_news.py --append  # add to existing pool instead of replacing
"""
import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

os.environ.setdefault("LANGCHAIN_TRACING_V2", "false")

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

_OUTPUT_FILE = Path(__file__).parent / "breaking_news.json"
_DEFAULT_COUNT = 40


def generate_headlines(count: int) -> list[str]:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=1.1)

    system = (
        "You write absurdist BREAKING NEWS headlines for a satirical cable news game. "
        "Headlines should be completely unrelated to any debate topic. "
        "They should feel like genuine cable news overreactions to trivial non-events. "
        "Mix styles: bureaucratic, apocalyptic, baffling, mundane-made-dramatic. "
        "No politics, no real people, no slurs. Max 12 words each. ALL CAPS. "
        "Output ONLY the headlines, one per line, no numbers, no punctuation at end."
    )

    batch_size = 20
    headlines = []
    batches = (count + batch_size - 1) // batch_size

    for i in range(batches):
        n = min(batch_size, count - len(headlines))
        try:
            r = llm.invoke([
                SystemMessage(content=system),
                HumanMessage(content=f"Generate {n} unique BREAKING NEWS headlines now."),
            ])
            batch = [line.strip() for line in r.content.strip().splitlines() if line.strip()]
            headlines.extend(batch[:n])
            print(f"  batch {i+1}/{batches}: {len(batch)} headlines")
        except Exception as exc:
            print(f"  batch {i+1} failed: {exc}", file=sys.stderr)

    return headlines


def main():
    parser = argparse.ArgumentParser(description="Generate cable news BREAKING NEWS pool")
    parser.add_argument("--count", type=int, default=_DEFAULT_COUNT, help="Headlines to generate")
    parser.add_argument("--append", action="store_true", help="Append to existing pool")
    args = parser.parse_args()

    existing = []
    if args.append and _OUTPUT_FILE.exists():
        try:
            existing = json.loads(_OUTPUT_FILE.read_text(encoding="utf-8"))
            print(f"Existing pool: {len(existing)} headlines")
        except Exception:
            pass

    print(f"Generating {args.count} headlines…")
    new_headlines = generate_headlines(args.count)
    pool = existing + new_headlines

    _OUTPUT_FILE.write_text(json.dumps(pool, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved {len(pool)} headlines to {_OUTPUT_FILE}")


if __name__ == "__main__":
    main()
