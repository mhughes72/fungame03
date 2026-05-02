"""
Export a Philosopher's Bar debate transcript as a podcast MP3 via ElevenLabs.

Pipeline:
  1. Filter messages — split into main turns and backchannel reactions.
  2. LLM preprocessing pass (gpt-4o-mini) — translates *[stage direction]*
     markers into ElevenLabs v3 audio tags.
  3. Render each segment individually via ElevenLabs TTS.
     Backchannels are rendered at reduced gain (-8 dB) to sound off-mic.
  4. Assemble with pydub: backchannels are overlaid on the tail of the
     preceding main turn (BACKCHANNEL_OVERLAP_MS before it ends).
  5. Save the assembled audio as an MP3.

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

BACKCHANNEL_GAIN_DB    = -8    # how much quieter backchannels are vs main turns
BACKCHANNEL_OVERLAP_MS = 1200  # how many ms before the main turn ends that the bc starts
PLAYBACK_SPEED         = 1.2   # >1.0 speeds up all voices (1.2 = 20% faster)

# ── Test voice IDs (hard-coded for now; per-character voice_id in personas.py
#    is still read but not used until these are removed) ───────────────────────
_TEST_NPC_VOICES = [
    "auq43ws1oslv0tO4BDa7",   # participant 1
    "dPah2VEoifKnZT37774q",   # participant 2
    "SSfU0eLfP3qeuR4j2bwD",   # participant 3
    "ljX1ZrXuDIIRVcmiVSyR",   # participant 4
]
_TEST_MODERATOR_VOICE    = "uIZsnBL0YK1S5j69bAih"
_TEST_COMMENTATOR_VOICE  = "rPMkKgdwgIwqv4fXgR6N"  # reserved for future use


def _resolve_voice(name: str, participants: list[str]) -> str:
    """Return a voice ID for the given speaker name.

    Currently uses hard-coded test voices by participant position.
    Falls back to CHARACTERS[name]['voice_id'] if position is out of range.
    """
    if name == "Moderator":
        return _TEST_MODERATOR_VOICE
    if name in participants:
        idx = participants.index(name)
        if idx < len(_TEST_NPC_VOICES):
            return _TEST_NPC_VOICES[idx]
    return CHARACTERS.get(name, {}).get("voice_id", "")


# ── Helpers ────────────────────────────────────────────────────────────────────

def _speaker_name(msg: AIMessage) -> str:
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
    response = llm.invoke([
        SystemMessage(content=_PREPROCESS_SYSTEM),
        HumanMessage(content=text),
    ])
    return response.content.strip()


# ── Individual TTS render ──────────────────────────────────────────────────────

_CHEAP_ASS_MSG = (
    "The podcast ran out of ElevenLabs credits mid-production. "
    "The developer is a cheap ass."
)

def _render_clip(client, voice_id: str, text: str) -> bytes:
    """Render a single text segment to MP3 bytes via ElevenLabs TTS."""
    try:
        chunks = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_turbo_v2_5",
            output_format="mp3_44100_128",
        )
        return b"".join(chunks)
    except Exception as exc:
        err = str(exc).lower()
        if any(k in err for k in ("quota", "credit", "402", "payment", "insufficient")):
            raise RuntimeError(_CHEAP_ASS_MSG) from exc
        raise


# ── Main export ────────────────────────────────────────────────────────────────

def export_podcast(
    messages: list[BaseMessage],
    participants: list[str],
    topic: str,
    session_id: str = "debate",
    output_path: Optional[Path] = None,
    commentator_log: list[str] = None,
) -> Path:
    load_dotenv()

    import os
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        raise RuntimeError("ELEVENLABS_API_KEY not set in .env")

    commentator_log = list(commentator_log or [])

    # ── 1. Filter to speakable segments ───────────────────────────────────────
    # Each segment: { voice_id, text, name, is_bc, main_index }
    # main_index: index into the main-turn list that this bc follows
    segments: list[dict] = []
    missing_voices: set[str] = set()
    last_main_idx = -1
    commentator_idx = 0   # cycles through commentator_log entries

    for msg in messages:
        if not isinstance(msg, AIMessage) and not isinstance(msg, HumanMessage):
            continue
        raw_name = getattr(msg, "name", "") or ""
        is_moderator = isinstance(msg, HumanMessage) and raw_name == "Moderator"
        is_user      = isinstance(msg, HumanMessage) and raw_name == "User"
        if is_user:
            continue   # skip player injections
        if isinstance(msg, HumanMessage) and not is_moderator:
            continue

        # Insert the next commentator recap just before each moderator steer
        if is_moderator and commentator_idx < len(commentator_log):
            recap = commentator_log[commentator_idx]
            commentator_idx += 1
            if recap:
                last_main_idx += 1
                segments.append({
                    "voice_id": _TEST_COMMENTATOR_VOICE,
                    "text": recap,
                    "name": "Commentator",
                    "is_bc": False,
                    "main_index": last_main_idx,
                })

        name = "Moderator" if is_moderator else _speaker_name(msg)
        if not name:
            continue
        if not is_moderator and name not in CHARACTERS:
            continue

        voice_id = _resolve_voice(name, participants)
        if not voice_id:
            if name in participants:
                missing_voices.add(name)
            continue

        text = (msg.content or "").strip()
        if not text:
            continue

        is_bc = _is_backchannel(msg)
        if is_bc:
            segments.append({
                "voice_id": voice_id,
                "text": text,
                "name": name,
                "is_bc": True,
                "main_index": last_main_idx,
            })
        else:
            last_main_idx += 1
            segments.append({
                "voice_id": voice_id,
                "text": text,
                "name": name,
                "is_bc": False,
                "main_index": last_main_idx,
            })

    if missing_voices:
        print(f"  Warning: no voice_id for: {', '.join(sorted(missing_voices))} — skipped")

    if not any(not s["is_bc"] for s in segments):
        raise RuntimeError("No speakable turns found. Assign voice_id values in personas.py.")

    # ── 2. LLM preprocessing pass ─────────────────────────────────────────────
    print(f"  Preprocessing {len(segments)} segments … ", end="", flush=True)
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    for seg in segments:
        cleaned = _preprocess_turn(llm, seg["text"])
        # Strip ElevenLabs v3 audio tags — eleven_turbo_v2_5 speaks them literally
        seg["clean_text"] = re.sub(r'\[[^\]]+\]', '', cleaned).strip()
    print("done")

    # ── 3. Render each segment individually ───────────────────────────────────
    from elevenlabs import ElevenLabs
    client = ElevenLabs(api_key=api_key)

    print(f"  Rendering {len(segments)} clips … ", end="", flush=True)
    for i, seg in enumerate(segments):
        seg["audio_bytes"] = _render_clip(client, seg["voice_id"], seg["clean_text"])
        print(f"{i + 1}", end=" ", flush=True)
    print("done")

    # ── 4. Assemble with pydub ─────────────────────────────────────────────────
    from pydub import AudioSegment
    from pydub.effects import speedup
    from io import BytesIO

    def _load(audio_bytes: bytes) -> AudioSegment:
        return AudioSegment.from_file(BytesIO(audio_bytes), format="mp3")

    # Load and speed up every clip
    for seg in segments:
        clip = _load(seg["audio_bytes"])
        if PLAYBACK_SPEED != 1.0:
            clip = speedup(clip, playback_speed=PLAYBACK_SPEED)
        if seg["is_bc"]:
            clip = clip.apply_gain(BACKCHANNEL_GAIN_DB)
        seg["clip"] = clip

    main_segs = [s for s in segments if not s["is_bc"]]
    bc_segs   = [s for s in segments if s["is_bc"]]

    if not main_segs:
        raise RuntimeError("No renderable main turns")

    # Compute how much each bc overhangs past the end of its main turn.
    # The next main turn must wait until that overhang is done.
    bc_overhang: dict[int, int] = {}   # {main_idx: ms past main turn end}
    for seg in bc_segs:
        mi = seg["main_index"]
        if mi < 0:
            continue
        overhang = max(0, len(seg["clip"]) - BACKCHANNEL_OVERLAP_MS)
        bc_overhang[mi] = max(bc_overhang.get(mi, 0), overhang)

    # Lay down main turns, inserting a gap after each one that has a bc overhang
    cursor = 0
    main_starts: list[int] = []
    timeline = AudioSegment.empty()
    for i, seg in enumerate(main_segs):
        main_starts.append(cursor)
        timeline = timeline + seg["clip"]
        cursor += len(seg["clip"])
        overhang = bc_overhang.get(i, 0)
        if overhang > 0:
            timeline = timeline + AudioSegment.silent(duration=overhang)
            cursor += overhang

    # Overlay each backchannel on the tail of its main turn
    for seg in bc_segs:
        mi = seg["main_index"]
        if mi < 0 or mi >= len(main_starts):
            continue
        main_end     = main_starts[mi] + len(main_segs[mi]["clip"])
        overlay_start = max(0, main_end - BACKCHANNEL_OVERLAP_MS)
        needed = overlay_start + len(seg["clip"])
        if needed > len(timeline):
            timeline = timeline + AudioSegment.silent(duration=needed - len(timeline))
        timeline = timeline.overlay(seg["clip"], position=overlay_start)

    # ── 5. Save ────────────────────────────────────────────────────────────────
    OUTPUT_DIR.mkdir(exist_ok=True)
    dest = output_path or OUTPUT_DIR / _safe_filename(topic, session_id)
    timeline.export(str(dest), format="mp3")
    print(f"saved → {dest}")
    return dest
