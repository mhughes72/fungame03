"""FastAPI server for The Philosopher's Bar.

Run from the project root with:
    python run_server.py

Or manually (must be run from the project root directory):
    uvicorn server.app:app --reload --port 8000

The frontend dev server (Vite on :5173) is proxied through CORS during
development.  In production, serve the built client/ dist from a static
mount or a CDN and tighten ``allow_origins``.
"""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import date as _date
from pathlib import Path
from typing import Optional

# Ensure the project root is on sys.path so game modules are importable
# regardless of which directory uvicorn is launched from.
_ROOT = str(Path(__file__).parent.parent)
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

os.environ.setdefault("LANGCHAIN_TRACING_V2", "false")

from dotenv import load_dotenv
load_dotenv()

from tavily import TavilyClient
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import server.events as evt
from server.session import SessionStore, _SENTINEL
from personas import CHARACTERS
from nodes import MODERATOR_STYLES as _MODERATOR_STYLES, generate_newspaper as _generate_newspaper


# --------------------------------------------------------------------------- #
# App + middleware                                                               #
# --------------------------------------------------------------------------- #

_DIST = Path(__file__).parent.parent / "client" / "dist"

app = FastAPI(title="The Philosopher's Bar")

# CORS only needed in local dev (Vite runs on a different port).
# In production the frontend is served by FastAPI itself so no CORS needed.
_DEV_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_DEV_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = SessionStore()

# --------------------------------------------------------------------------- #
# Debate of the Day — list cached per calendar day, grows on demand            #
# --------------------------------------------------------------------------- #

# debates: list of _DotDSchema generated today; resets at midnight.
# Clients pass ?index=N; server returns debates[N] from cache or generates
# and appends until the list is long enough.
_dotd_cache: dict = {"date": None, "debates": []}


class _DotDSchema(BaseModel):
    characters: list[str]   # 2–4 names from CHARACTERS
    topic: str
    tagline: str            # one punchy sentence, ≤15 words
    category: str           # heated | historic | philosophical | scientific | cultural | political


def _generate_dotd(existing: list) -> _DotDSchema:
    roster = "\n".join(
        f"- {name}: {data['known_for'][:90]}"
        for name, data in CHARACTERS.items()
    )
    already = (
        "\n\nAlready suggested today (do not repeat these combinations):\n" +
        "\n".join(
            f"- {', '.join(d.characters)}: {d.topic}"
            for d in existing
        )
    ) if existing else ""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.9)
    result: _DotDSchema = llm.with_structured_output(_DotDSchema).invoke([
        SystemMessage(content=(
            "You are curating a featured debate between historical and contemporary figures. "
            "From the roster provided, pick 2–4 participants and a debate topic. "
            "Aim for combinations that are genuinely compelling: ideologically opposed, historically charged, "
            "philosophically explosive, or scientifically fascinating. "
            "The topic must be specific enough to generate real, substantive disagreement. "
            "Write a punchy tagline of no more than 15 words that would make someone want to watch. "
            "For category choose exactly one of: heated, historic, philosophical, scientific, cultural, political."
        )),
        HumanMessage(content=f"Available participants:\n{roster}{already}"),
    ])
    valid = set(CHARACTERS.keys())
    result.characters = [c for c in result.characters if c in valid]
    if len(result.characters) < 2:
        raise ValueError("Too few valid characters in generated debate")
    return result


def _get_dotd(index: int) -> _DotDSchema:
    today = _date.today().isoformat()
    if _dotd_cache["date"] != today:
        _dotd_cache["date"] = today
        _dotd_cache["debates"] = []
    debates = _dotd_cache["debates"]
    while len(debates) <= index:
        debates.append(_generate_dotd(debates))
    return debates[index]


# --------------------------------------------------------------------------- #
# Static frontend — mounted AFTER all API routes so /api/* routes win          #
# --------------------------------------------------------------------------- #

_PORTRAITS           = Path(__file__).parent.parent / "portraits"
_NEWSPAPER_PORTRAITS = Path(__file__).parent.parent / "newspaper_portraits"

def _mount_static() -> None:
    if _DIST.exists():
        app.mount("/assets", StaticFiles(directory=str(_DIST / "assets")), name="assets")
    if _PORTRAITS.exists():
        app.mount("/portraits", StaticFiles(directory=str(_PORTRAITS)), name="portraits")
    if _NEWSPAPER_PORTRAITS.exists():
        app.mount("/newspaper_portraits", StaticFiles(directory=str(_NEWSPAPER_PORTRAITS)), name="newspaper_portraits")

_mount_static()


# --------------------------------------------------------------------------- #
# Request / response models                                                     #
# --------------------------------------------------------------------------- #

class StartRequest(BaseModel):
    characters: list[str] = Field(..., min_length=2, max_length=4)
    topic: str = Field(..., min_length=1, max_length=500)


class SteerRequest(BaseModel):
    text: str = ""
    style: str = "socratic"
    evidence: str = ""    # pre-summarised finding from /api/search; empty if not injecting
    drinks: dict[str, int] = {}   # {name: count} — drinks to add this round per character


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=300)


class CheatRequest(BaseModel):
    heat: Optional[int] = None   # 0–10; if set, overrides current heat directly
    drinks: dict[str, int] = {}  # {name: count} — drinks to add per character


class NewTopicRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)


# --------------------------------------------------------------------------- #
# Routes                                                                        #
# --------------------------------------------------------------------------- #

@app.get("/api/characters")
def list_characters():
    """Return all available characters with their metadata."""
    return [
        {
            "name": name,
            "era": data["era"],
            "known_for": data["known_for"],
        }
        for name, data in CHARACTERS.items()
    ]


@app.get("/api/styles")
def list_styles():
    """Return all moderator styles."""
    return [{"style": s, "description": d} for s, d in _MODERATOR_STYLES]


@app.post("/api/sessions", status_code=201)
def create_session(req: StartRequest):
    """Create a new debate session. Returns the session_id."""
    unknown = [c for c in req.characters if c not in CHARACTERS]
    if unknown:
        raise HTTPException(status_code=400, detail=f"Unknown characters: {unknown}")

    session = store.create(participants=req.characters, topic=req.topic)
    return {
        "session_id": session.id,
        "participants": req.characters,
        "topic": req.topic,
    }


@app.get("/api/sessions/{session_id}/stream")
async def stream_session(session_id: str):
    """SSE stream — connect once per session and keep it open.

    Events flow continuously.  The stream pauses at each steer break
    (a ``steer_needed`` event arrives) and resumes after the client
    POSTs to ``/steer``.  The stream closes on ``consensus`` or error.
    """
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Capture the running event loop so the graph thread can push events
    loop = asyncio.get_event_loop()
    session.loop = loop

    async def generate():
        # Only kick off the first batch once — EventSource auto-reconnects on
        # network hiccups and would otherwise fire duplicate batches, burning
        # OpenAI credits and stacking steer modals on return.
        if not session._started:
            session._started = True
            loop.run_in_executor(None, session.run_batch)

        while True:
            item = await session.queue.get()

            if item is _SENTINEL:
                # Consensus reached or fatal error — close the stream
                yield evt.to_sse(evt.system("Stream closed."))
                break

            yield evt.to_sse(item)

            # After a steer_needed event the stream stays open but idle.
            # The next run_in_executor call (from POST /steer) will push
            # more events into the same queue.

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable nginx buffering
            "Connection": "keep-alive",
        },
    )


@app.post("/api/search")
async def search_evidence(req: SearchRequest):
    """Search the web and return a summarised empirical finding for evidence injection."""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="TAVILY_API_KEY not configured")

    try:
        client = TavilyClient(api_key=api_key)
        results = client.search(req.query, max_results=3)
        snippets = "\n\n".join(
            f"[{r.get('title', '')}] {r.get('content', '')}"
            for r in results.get("results", [])[:3]
        )
        source_urls = [r.get("url", "") for r in results.get("results", [])[:1]]
        source = source_urls[0] if source_urls else ""
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Search failed: {exc}")

    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
        response = llm.invoke([
            SystemMessage(content=(
                "Distil the following search results into a single factual finding of 1–2 sentences. "
                "Be specific — cite numbers, dates, or study details if present. "
                "Write it as a standalone statement of fact, not a summary of the search. "
                "Do not editorialize or express opinion."
            )),
            HumanMessage(content=f'Search query: "{req.query}"\n\nResults:\n{snippets}'),
        ])
        finding = response.content.strip()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Summarisation failed: {exc}")

    return {"finding": finding, "source": source}


@app.post("/api/sessions/{session_id}/steer")
async def steer_session(session_id: str, req: SteerRequest):
    """Inject a steer (user text or moderator prompt) and start the next batch."""
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    valid_styles = {s for s, _ in _MODERATOR_STYLES}
    if req.style not in valid_styles:
        raise HTTPException(status_code=400, detail=f"Unknown style: {req.style!r}")

    loop = asyncio.get_event_loop()
    session.apply_steer(
        text=req.text,
        new_style=req.style,
        participants=session.state["participants"],
        evidence=req.evidence,
        drinks=req.drinks,
    )
    loop.run_in_executor(None, session.run_batch)
    return {"ok": True}


@app.post("/api/sessions/{session_id}/cheat")
async def cheat_session(session_id: str, req: CheatRequest):
    """Directly override heat and/or drunk_levels without triggering a new batch."""
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if req.heat is not None and not (0 <= req.heat <= 10):
        raise HTTPException(status_code=400, detail="heat must be 0–10")
    session.apply_cheat(heat=req.heat, drinks=req.drinks)
    return {"ok": True}


@app.post("/api/sessions/{session_id}/new-topic")
async def new_topic(session_id: str, req: NewTopicRequest):
    """Reset state for a new topic, keeping the same participants."""
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    loop = asyncio.get_event_loop()
    session.new_topic(req.topic)
    loop.run_in_executor(None, session.run_batch)
    return {"ok": True, "topic": req.topic}


@app.post("/api/sessions/{session_id}/newspaper")
async def newspaper(session_id: str):
    """Generate a post-debate newspaper front page for the session."""
    session = store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    state = session.state
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(None, lambda: _generate_newspaper(
            participants=state.get("participants", []),
            topic=state.get("topic", ""),
            messages=state.get("messages", []),
            heat=state.get("heat", 0),
            concession_counts=state.get("concession_counts", {}),
            partial_agreements=state.get("partial_agreements", []),
            remaining_disagreements=state.get("remaining_disagreements", []),
        ))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Newspaper generation failed: {exc}")

    return result.dict()


@app.delete("/api/sessions/{session_id}", status_code=204)
def delete_session(session_id: str):
    """Clean up a session (client closing tab / quitting)."""
    store.delete(session_id)
    return Response(status_code=204)


@app.get("/api/debate-of-the-day")
async def debate_of_the_day(index: int = 0):
    """Return the debate at position `index` in today's list, generating if needed."""
    if index < 0:
        raise HTTPException(status_code=400, detail="index must be >= 0")
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(None, lambda: _get_dotd(index))
        return {**result.dict(), "index": index, "total": len(_dotd_cache["debates"])}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Debate of the day failed: {exc}")


# --------------------------------------------------------------------------- #
# Health                                                                        #
# --------------------------------------------------------------------------- #

@app.get("/health")
def health():
    return {"status": "ok", "sessions": len(store._sessions)}


# --------------------------------------------------------------------------- #
# SPA catch-all — must be last                                                  #
# --------------------------------------------------------------------------- #

@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    index = _DIST / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return Response("Frontend not built. Run: cd client && npm run build", status_code=503)
