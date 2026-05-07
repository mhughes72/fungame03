"""Automated debate runner — multi-run with cross-run analysis.

Usage:
    python debate_runner.py                          # 1 run, random 4 personas, defaults
    python debate_runner.py --runs 5                 # 5 runs, random 4 personas each
    python debate_runner.py --runs 3 --count 3       # 3 runs, 3 personas each
    python debate_runner.py --personas "Newton,Musk" # fix some personas, random fills rest
    python debate_runner.py --topic "X" --level grade5 --style combative
    python debate_runner.py --runs 5 --random-topic  # random topic each run from debate_topics.json

All transcripts saved as transcript_TIMESTAMP_runN.json
Cross-run analysis saved as analysis_TIMESTAMP.txt
"""
import json
import random
import sys
import time
import argparse
import textwrap
from datetime import datetime
from pathlib import Path

import requests
import sseclient
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

sys.stdout.reconfigure(encoding="utf-8")

BASE = "http://localhost:8000"


# ── single debate run ────────────────────────────────────────────────────── #

def run_debate(characters, topic, audience_level="university", moderator_style="combative",
               run_label="") -> dict:
    label = f" [{run_label}]" if run_label else ""
    print(f"\n{'='*60}")
    print(f"Starting debate{label}")
    print(f"  Characters : {', '.join(characters)}")
    print(f"  Topic      : {topic}")
    print(f"  Audience   : {audience_level}")
    print(f"  Style      : {moderator_style}")
    print(f"{'='*60}\n")

    transcript = []

    def record(speaker, content, role):
        transcript.append({"speaker": speaker, "role": role, "content": content})

    # Create session
    r = requests.post(f"{BASE}/api/sessions", json={
        "characters": characters,
        "topic": topic,
        "audience_level": audience_level,
        "debate_format": "",
        "commentator_enabled": True,
        "moderator_enabled": True,
        "moderator_style": moderator_style,
    })
    r.raise_for_status()
    session_id = r.json()["session_id"]
    print(f"Session: {session_id}\n")

    # SSE stream
    response = requests.get(
        f"{BASE}/api/sessions/{session_id}/stream",
        headers={"Accept": "text/event-stream"},
        stream=True,
    )
    client = sseclient.SSEClient(response)

    steer_count = 0
    turn_count = 0
    heat_history = []
    speaker_turns: dict[str, int] = {c: 0 for c in characters}

    for event in client.events():
        if not event.data or not event.data.strip():
            continue
        try:
            data = json.loads(event.data)
        except json.JSONDecodeError:
            continue

        etype = data.get("type", "")
        d = data.get("data", {})

        if etype == "message":
            speaker = d.get("name", "?")
            content = d.get("content", "")
            role = d.get("role", "philosopher")
            bc = d.get("backchannel", False)
            tag = "(aside)" if bc else ""
            record(f"{speaker}{' ' + tag if tag else ''}", content, role if not bc else "backchannel")
            prefix = f"  [{speaker}{' ' + tag if tag else ''}]"
            snippet = content[:100] + ("..." if len(content) > 100 else "")
            print(f"{prefix} {snippet}")
            if not bc and role == "philosopher" and speaker in speaker_turns:
                speaker_turns[speaker] += 1

        elif etype == "commentator":
            record("Commentator", d.get("text", ""), "commentator")

        elif etype == "system":
            msg = d.get("text", "")
            if msg and "Stream closed" not in msg:
                record("*system*", msg, "system")

        elif etype == "bar_beat":
            record("*bar*", d.get("text", ""), "system")

        elif etype == "state":
            turn_count = d.get("turn", turn_count)
            heat = d.get("heat", 0)
            heat_history.append(heat)
            print(f"  [turn {turn_count} | heat {heat}]")

        elif etype == "steer_needed":
            steer_count += 1
            print(f"\n  -- Steer break #{steer_count} (style: {moderator_style}) --\n")
            sr = requests.post(f"{BASE}/api/sessions/{session_id}/steer", json={
                "text": "",
                "style": moderator_style,
                "evidence": "",
                "drinks": {},
            })
            sr.raise_for_status()

        elif etype == "consensus":
            summary = d.get("summary", "")
            record("*consensus*", f"CONSENSUS REACHED: {summary}", "system")
            print(f"\n  CONSENSUS: {summary}")
            break

        elif etype == "game_over":
            turn_count = d.get("turn", turn_count)
            record("*game_over*", f"Debate ended after {turn_count} turns.", "system")
            print(f"\n  Game over after {turn_count} turns.")
            break

        elif etype == "error":
            print(f"  ERROR: {d.get('text', '')}")
            break

    avg_heat = round(sum(heat_history) / len(heat_history), 2) if heat_history else 0
    peak_heat = max(heat_history) if heat_history else 0

    result = {
        "characters": characters,
        "topic": topic,
        "audience_level": audience_level,
        "moderator_style": moderator_style,
        "transcript": transcript,
        "stats": {
            "turn_count": turn_count,
            "steer_count": steer_count,
            "avg_heat": avg_heat,
            "peak_heat": peak_heat,
            "speaker_turns": speaker_turns,
        },
    }

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    slug = run_label.replace(" ", "_") if run_label else timestamp
    outfile = f"transcript_{slug}.json"
    Path(outfile).write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n  Saved → {outfile}")
    return result


# ── cross-run analysis via GPT-4o ────────────────────────────────────────── #

def analyze_runs(runs: list[dict]) -> str:
    """Send all transcripts to GPT-4o for a cross-run analysis report."""
    print(f"\n{'='*60}")
    print(f"Running cross-run analysis across {len(runs)} debate(s)...")
    print(f"{'='*60}\n")

    # Build compact transcript summaries (speaker + first 300 chars of content)
    run_summaries = []
    for i, run in enumerate(runs, 1):
        chars = ", ".join(run["characters"])
        topic = run["topic"]
        stats = run["stats"]
        lines = []
        for entry in run["transcript"]:
            if entry["role"] in ("philosopher", "moderator"):
                snippet = entry["content"][:300].replace("\n", " ")
                lines.append(f"  [{entry['speaker']}]: {snippet}")
        body = "\n".join(lines[:80])  # cap at 80 lines per run to stay within token budget
        run_summaries.append(
            f"--- RUN {i}: {chars} | Topic: {topic} ---\n"
            f"Turns: {stats['turn_count']} | Avg heat: {stats['avg_heat']} | "
            f"Peak heat: {stats['peak_heat']}\n"
            f"Speaker turns: {stats['speaker_turns']}\n\n"
            f"{body}"
        )

    full_text = "\n\n".join(run_summaries)

    prompt = textwrap.dedent(f"""
        You are analyzing AI-generated philosophical debates from a game called "The Philosopher's Bar."
        The game pits historical figures against each other in debates. Each run used random personas.

        Below are {len(runs)} debate transcript(s). For each, you have the characters, topic, stats,
        and the first 80 lines of dialogue.

        Your job is to produce a structured analysis report covering:

        1. CROSS-RUN PATTERNS
           - Issues that appear consistently across multiple runs (these are systemic)
           - Issues that appear in only one run (may be persona-specific or random)

        2. CHARACTER BALANCE
           - Which characters dominated (high turn counts)?
           - Which were silent or nearly absent?
           - Was silence consistent for a character across runs, or run-specific?

        3. AUDIENCE LEVEL ADHERENCE
           - Did the language and examples match the intended audience level?
           - Specific failures: abstract vocabulary used when simple was requested, etc.

        4. ARGUMENT QUALITY & PROGRESSION
           - Did debates make progress, or did they get stuck in loops?
           - Were characters actually engaging each other's arguments?
           - Did anyone change their position?

        5. HEAT & COMBATIVENESS
           - Did the combative moderator style actually produce combative debate?
           - Heat levels and whether they reflect the actual tone of the dialogue

        6. PRIORITIZED RECOMMENDATIONS
           - List the top 5 concrete improvements, ranked by impact
           - Be specific: name the file/prompt/setting that should change and what to change it to

        Be direct and critical. Identify real problems, not surface-level observations.

        === TRANSCRIPTS ===
        {full_text}
    """).strip()

    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()


# ── topic loader ─────────────────────────────────────────────────────────── #

def load_random_topic(audience_level: str) -> str:
    topics_file = Path("debate_topics.json")
    if topics_file.exists():
        topics = json.loads(topics_file.read_text(encoding="utf-8"))
        filtered = [t for t in topics if t.get("audience_level") == audience_level]
        if filtered:
            return random.choice(filtered)["topic"]
    return "What is the nature of justice"


# ── entry point ──────────────────────────────────────────────────────────── #

def main():
    parser = argparse.ArgumentParser(description="Run automated debates and analyze them.")
    parser.add_argument("--runs", type=int, default=1, help="Number of debate runs")
    parser.add_argument("--count", type=int, default=4, help="Personas per run (2–4)")
    parser.add_argument("--personas", type=str, default="",
                        help="Comma-separated fixed personas (rest filled randomly)")
    parser.add_argument("--topic", type=str, default="What is the nature of justice")
    parser.add_argument("--random-topic", action="store_true",
                        help="Pick a random topic each run from debate_topics.json")
    parser.add_argument("--level", type=str, default="university",
                        help="Audience level (e.g. grade5, university)")
    parser.add_argument("--style", type=str, default="combative",
                        help="Moderator style, or 'random' to pick a different one each run")
    parser.add_argument("--no-analysis", action="store_true",
                        help="Skip the GPT-4o cross-run analysis")
    args = parser.parse_args()

    # Load character pool
    r = requests.get(f"{BASE}/api/characters")
    r.raise_for_status()
    all_chars = [c["name"] for c in r.json()]

    # Load available styles
    r2 = requests.get(f"{BASE}/api/styles")
    r2.raise_for_status()
    all_styles = [s["style"] for s in r2.json()]

    # Parse fixed personas
    fixed = [p.strip() for p in args.personas.split(",") if p.strip()] if args.personas else []
    unknown = [p for p in fixed if p not in all_chars]
    if unknown:
        print(f"ERROR: Unknown personas: {unknown}")
        print(f"Available: {', '.join(all_chars)}")
        sys.exit(1)

    count = max(2, min(4, args.count))

    all_runs = []
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    for i in range(1, args.runs + 1):
        # Pick personas for this run
        pool = [c for c in all_chars if c not in fixed]
        needed = count - len(fixed)
        chosen = fixed + random.sample(pool, needed)

        # Pick topic
        topic = load_random_topic(args.level) if args.random_topic else args.topic

        # Pick style
        style = random.choice(all_styles) if args.style == "random" else args.style

        result = run_debate(
            characters=chosen,
            topic=topic,
            audience_level=args.level,
            moderator_style=style,
            run_label=f"{timestamp}_run{i}",
        )
        all_runs.append(result)

        if i < args.runs:
            print("\nPausing 3s before next run...")
            time.sleep(3)

    # Cross-run analysis
    if not args.no_analysis:
        analysis = analyze_runs(all_runs)
        analysis_file = f"analysis_{timestamp}.txt"
        Path(analysis_file).write_text(analysis, encoding="utf-8")
        print(f"\n{'='*60}")
        print(analysis)
        print(f"\nAnalysis saved → {analysis_file}")
    else:
        print(f"\nDone. {len(all_runs)} run(s) complete.")


if __name__ == "__main__":
    main()
