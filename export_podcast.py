"""
Export a Philosopher's Bar debate transcript as a podcast MP3 via ElevenLabs.

Pipeline:
  1. Filter messages — keep philosopher turns and backchannel reactions;
     skip system messages, evidence blocks, and HumanMessages.
  2. LLM preprocessing pass (gpt-4o-mini) — translates *[stage direction]*
     markers into ElevenLabs v3 audio tags and inserts natural [pause] cues
     at turn boundaries where the conversation shifts sharply.
  3. Call ElevenLabs Text-to-Dialogue API with the cleaned turn array.
  4. Save the returned audio to OUTPUT_DIR / <filename>.mp3.

Usage:
    from export_podcast import export_podcast
    export_podcast(messages, participants, topic, session_id)

Requires ELEVENLABS_API_KEY in .env.
Characters without a voice_id in personas.py are skipped with a warning.
"""
from __future__ import annotations

import re
import time
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, BaseMessage
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from personas import CHARACTERS

OUTPUT_DIR = Path("podcasts")

# ── Helpers ────────────────────────────────────────────────────────────────────

def _speaker_name(msg: AIMessage) -> str:
    """Return display name from a message's name field (First_Last → First Last)."""
    raw = getattr(msg, "name", "") or ""
    return raw.replace("_bc", "").replace("_", " ").strip()


def _is_backchannel(msg: AIMessage) -> bool:
    raw = getattr(msg, "name", "") or ""
    return raw.endswith("_bc")


def _safe_filename(topic: str, session_id: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", topic.lower()).strip()
    slug = re.sub(r"[\s_]+", "_", slug)[:40]
    return f"{slug}_{session_id[:8]}.mp3"


# ── Stage-direction preprocessing ─────────────────────────────────────────────

_PREPROCESS_SYSTEM = """\
You are preparing a debate transcript for text-to-speech synthesis using ElevenLabs v3.

Your job is to clean each turn's text so it sounds natural when spoken aloud:

1. Find any stage directions written as *[some action]* and replace them with an
   appropriate ElevenLabs v3 audio tag immediately before the sentence they belong to.
   Supported tags: [laughs] [sighs] [clears throat] [pause] [long pause] [short pause]
   [excited] [angry] [whispers] [sad] [surprised] [nervous]
   If no tag fits, remove the stage direction entirely — never leave *[...]* in the output.

2. At the very start of the turn, if the speaker is responding sharply or changing
   direction, add [short pause] before their first word.

3. Remove any markdown formatting (bold, italic markers that aren't stage directions).

4. Do not change the actual words spoken — only add/replace stage direction markers.

Return only the cleaned text with no explanation.
"""

def _preprocess_turn(llm: ChatOpenAI, text: str) -> str:
    """Run a single turn through the LLM stage-direction translator."""
    response = llm.invoke([
        SystemMessage(content=_PREPROCESS_SYSTEM),
        HumanMessage(content=text),
    ])
    return response.content.strip()


# ── Main export ────────────────────────────────────────────────────────────────

def export_podcast(
    messages: list[BaseMessage],
    participants: list[str],
    topic: str,
    session_id: str = "debate",
    output_path: Optional[Path] = None,
) -> Path:
    load_dotenv()

    import os
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise RuntimeError("ELEVENLABS_API_KEY not set in .env")

    # ── 1. Filter to speakable turns ───────────────────────────────────────────
    turns: list[tuple[str, str]] = []   # [(voice_id, text)]
    missing_voices: set[str] = set()

    for msg in messages:
        if not isinstance(msg, AIMessage):
            continue
        name = _speaker_name(msg)
        if not name or name not in CHARACTERS:
            continue
        char = CHARACTERS[name]
        voice_id = char.get("voice_id", "")
        if not voice_id:
            if name in participants:   # only warn for active participants
                missing_voices.add(name)
            continue
        text = (msg.content or "").strip()
        if not text:
            continue
        turns.append((voice_id, text, name))

    if missing_voices:
        print(f"  Warning: no voice_id for: {', '.join(sorted(missing_voices))} — skipped")

    if not turns:
        raise RuntimeError("No speakable turns found. Assign voice_id values in personas.py.")

    # ── 2. LLM preprocessing pass ──────────────────────────────────────────────
    print(f"  Preprocessing {len(turns)} turns … ", end="", flush=True)
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    cleaned: list[dict] = []
    for voice_id, text, name in turns:
        clean_text = _preprocess_turn(llm, text)
        cleaned.append({"voice_id": voice_id, "text": clean_text})
    print("done")

    # ── 3. Call ElevenLabs Text-to-Dialogue API ────────────────────────────────
    from elevenlabs import ElevenLabs
    from elevenlabs.types import DialogueInput
    client = ElevenLabs(api_key=api_key)

    print(f"  Generating audio ({len(cleaned)} turns) … ", end="", flush=True)
    dialogue_inputs = [
        DialogueInput(voice_id=t["voice_id"], text=t["text"])
        for t in cleaned
    ]
    audio_response = client.text_to_dialogue.convert(
        inputs=dialogue_inputs,
        model_id="eleven_v3",
    )

    # ── 4. Save ────────────────────────────────────────────────────────────────
    OUTPUT_DIR.mkdir(exist_ok=True)
    dest = output_path or OUTPUT_DIR / _safe_filename(topic, session_id)

    audio_bytes = b"".join(audio_response)
    dest.write_bytes(audio_bytes)
    print(f"saved → {dest}")
    return dest
