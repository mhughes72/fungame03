# CLAUDE.md — The Philosopher's Bar

## What this project is

A terminal game where 2–4 historical figures debate a topic using LangGraph + OpenAI. Each turn, candidates are scored by hot-topic keyword overlap with the last message; the top scorer speaks (or top 2 if tied, then a selector LLM picks). A consensus checker runs at every steer break to detect full and partial agreements.

## How to run

```bash
python main.py           # CLI
python main.py --ui      # Textual bar UI (recommended)
python main.py --debug   # with debug output to stderr
python run_server.py     # web server → http://localhost:8000
python generate_portraits.py            # generate all character portraits via DALL-E 3
python generate_portraits.py Newton     # generate specific character(s)
```

Requires `OPENAI_API_KEY` in `.env`.

After editing any file in `client/src/`, rebuild before testing via the web server:
```bash
cd client && npm run build && cd ..
```

## File map

| File | Role |
|---|---|
| `main.py` | CLI game loop, display, user input, `!` commands |
| `ui.py` | Textual bar UI — `SetupScreen` + `PhilosopherBar` |
| `graph.py` | `build_graph(participants)` — assembles the LangGraph `StateGraph` |
| `nodes.py` | All node functions, prompt builders, steer generator |
| `state.py` | `RoomState` TypedDict — single source of truth for graph state |
| `personas.py` | Character definitions — the only file to edit when adding characters |
| `debug.py` | Per-channel debug logging (`dlog`, `toggle`, `status`) |
| `generate_portraits.py` | Standalone CLI — generates DALL-E 3 portrait PNGs into `portraits/` |
| `run_server.py` | Web server entry point — reads `PORT` env var, disables reload in production |
| `server/app.py` | FastAPI routes, SSE stream, static file serving |
| `server/session.py` | `SessionStore`, per-session state, `run_batch()` thread runner |
| `server/events.py` | SSE event constructors and serialiser |
| `client/src/` | Vanilla JS frontend (Vite) — `main.js`, `setup.js`, `debate.js`, `seating.js`, `steer.js` |
| `client/dist/` | Pre-built frontend — committed to git, served by FastAPI in production |

## Graph shape

```
START → moderator ─┬─ consensus_checker → END
                   ├─ __steer__ ────────→ END
                   └─ parallel_turn ───→ moderator → (loop)
```

- The `moderator` node only routes — no LLM call.
- Both steer exit and consensus check fire every `N×2` turns (N = participant count).
- The graph runs one full batch (until `__steer__` or `consensus_checker` → END) per `graph.stream()` call. `main.py`/`ui.py` handles user input between batches.
- Moderator steer is generated *outside* the graph (in `main.py` or `ui.py`) and injected as a `HumanMessage` before the next batch.

## State fields

| Field | Type | Purpose |
|---|---|---|
| `messages` | `Annotated[list, add_messages]` | Full conversation history (reducer appends) |
| `topic` | `str` | Current discussion topic |
| `participants` | `list[str]` | Names of active characters |
| `current_speaker` | `str` | Set by moderator; read by graph router |
| `recent_speakers` | `list[str]` | Last 6 speakers — used for ping-pong detection |
| `turn_count` | `int` | Increments each philosopher turn |
| `consensus` | `bool` | Full group consensus reached |
| `consensus_summary` | `str` | Human-readable summary if consensus reached |
| `partial_agreements` | `list[dict]` | `{participants, on}` — subgroup alignments |
| `points_of_agreement` | `list[str]` | Bullet points of what everyone agrees on |
| `remaining_disagreements` | `list[dict]` | `{topic, participant_a, stance_a, participant_b, stance_b}` — open tensions with attribution |
| `argument_log` | `dict` | `{name: [claim1, …]}` — last 3 responses per character, used for no-repeat guard and callbacks |
| `concession_counts` | `dict` | `{name: int}` — times each character has granted a point |
| `character_summaries` | `dict` | `{name: str}` — first-person debate arc, generated at history compression |
| `moderator_style` | `str` | One of 8 styles: `socratic`, `combative`, `devil's advocate`, `koan`, `journalist`, `straw man`, `steel man`, `last call` |
| `forced_speaker` | `str` | If set, bypasses keyword scorer and forces this character next; cleared after use |
| `heat` | `int` | 0–10 mood meter — rises on combative signals/exclamation marks, falls on concessions |
| `drift_topic` | `str` | Non-empty when the consensus checker detects the conversation has wandered from the original topic |

## Models used

| Node | Model |
|---|---|
| Philosopher (candidate generation) | `gpt-4o-mini` |
| Selector (when scores tie) | `gpt-4o-mini` |
| Moderator steer | `gpt-4o-mini` |
| Backchannel reactions | `gpt-4o-mini` |
| Character arc summaries | `gpt-4o-mini` |
| Consensus checker | `gpt-4o` |
| History summarizer | `gpt-4o` |

## Context management

- Each LLM candidate call receives a trimmed history: leading summary block (if present) + last 6 messages (`_CANDIDATE_HISTORY = 6`). Full history is passed to the no-repeat guard only.
- Once `messages` exceeds 14 entries (`_SUMMARIZE_AFTER`), older messages are compressed into a `SystemMessage` summary by `gpt-4o`. The 6 most recent are always kept intact (`_KEEP_RECENT = 6`).
- At compression time, `generate_character_summaries()` runs in parallel (`gpt-4o-mini`) to produce a first-person debate arc for each participant. The arc replaces `cite_these`/`hot_topics` in the system prompt for the remainder of the debate.

## Concession tracking

`parallel_turn_node` scans each winning response for concession phrases (`perhaps`, `i grant`, `i concede`, etc.). Hits increment `concession_counts[name]`. Two effects:
1. Zero concessions past turn 8 → nudge in user prompt to find merit in opponent's argument.
2. Moderator steer targets the most entrenched participant by name.

## Heat / mood state

`heat` (0–10) is tracked in state and updated by `parallel_turn_node`:
- +1 for combative keyword hits (`_COMBATIVE_SIGNALS`) or exclamation marks in the response
- -1 for concession phrases
- Clamped to [0, 10]

Effects:
- `_philosopher_system_prompt` receives `heat` and injects a heat description line
- At heat ≥ 6, a jab instruction is added: characters are told to land a pointed personal shot
- `generate_moderator_steer` prepends a heat context line to the prompt
- UI right pane shows a `█`/`░` bar color-coded by intensity

## Backchannel reactions

After each main turn, `_generate_backchannel(reactor, winner_content)` has a 50% chance (`_BACKCHANNEL_CHANCE`) of firing. It produces a single short interjection from a non-speaking participant. These messages use the `_bc` name suffix (e.g. `Newton_bc`) and are rendered dim/italic in the UI. They are skipped when scoring the next speaker's keyword relevance.

## Variable response length

`_philosopher_user_prompt` detects context to set cadence:
- **rapid-fire** — last message was very short (≤ 30 chars) → one punchy sentence
- **normal** — default
- **verbosity** — each persona has a `verbosity` field (`"terse"` / `"normal"` / `"expansive"`) that biases length

## Callbacks

`argument_log` stores the last 3 responses per character. The oldest entry (`claims[0]`) is fed back into a character's own prompt as a "your earlier words" callback — lets characters self-reference or be pinned by opponents on prior statements.

## Stage directions

Characters are instructed (in the system prompt) to occasionally include a brief italicised stage direction in `*[asterisks]*`. The UI renders these as dim brown italic text. The bar itself emits atmosphere beats (from `_BAR_BEATS`) in dark amber every completed batch.

## Topic drift

The consensus checker's structured output includes a `drifted_topic` field. If the LLM detects the conversation has wandered, `drift_topic` is set in state. The UI surfaces a notice before the steer modal; the CLI shows it at the steer prompt. Players can pursue the new thread or steer back.

## Direct calling-out

`_detect_forced_speaker(text)` scans user input for participant name parts (> 3 chars). If found, `forced_speaker` is set in state and `parallel_turn_node` bypasses the keyword scorer for that turn.

## Moderator styles

8 styles switchable at every steer break:

| Style | Approach |
|---|---|
| `socratic` | Builds bridges, seeks common ground |
| `combative` | Exposes contradictions, demands concessions |
| `devil's advocate` | Attacks whatever position is gaining momentum |
| `koan` | Oblique, unanswerable question to the most confident participant |
| `journalist` | Demands one concrete sentence — no abstraction |
| `straw man` | Misrepresents a position to force clarification |
| `steel man` | Forces a participant to argue their opponent's case at its strongest |
| `last call` | All-out push for consensus — names slivers of agreement and forces commitment or explanation |

> **Cheat code idea:** hidden/unlockable styles triggered by a specific word or number at the style prompt — e.g. a style that forces immediate consensus or does something absurd.

## Persona manipulation (TODO)

Mid-debate overrides for persona data — to be designed. Ideas:
- Temporarily override a character's `core_beliefs`, `rhetorical_moves`, or `hot_topics` for one or more turns (e.g. "make Feynman combative", "make Stalin concede more")
- Inject a one-off instruction into a specific character's next system prompt without permanently changing their persona
- Player-facing command (e.g. `!nudge Feynman aggressive`) or a hidden moderator trigger
- State field would hold `persona_overrides: dict` — `{name: {field: value}}` — cleared after N turns or on demand

## Textual UI (`ui.py`)

- `SetupScreen` — character picker (`SelectionList`), topic `Input`, "Open the bar" `Button`. Defaults: Lincoln (index 5) + Tesla (index 8).
- Uses `self.dismiss((chosen, topic))` to return result; parent uses `push_screen(SetupScreen(), callback=self._start_debate)`. **Do not use the `post_message`/`Message` pattern for pushed screens in Textual — it doesn't work.**
- `PhilosopherBar` runs `graph.stream()` in a `@work(thread=True)` worker; all UI updates go through `call_from_thread()`.
- `SteerModal` opens at every steer break — contains a text input, a `RadioSet` of all 8 styles, and Quit + Steer buttons. Returns `(text, style)` tuple via `dismiss()`. Background is 60% transparent black (`background: #000000 60%`).
- Header bar contains a Quit button alongside the title.
- Right pane shows topic, turn count, heat bar (`█`/`░`, color-coded), full agreements, partial alignments, open tensions (with participant attribution), and the style selector.
- `_render_content(text)` converts `*[action]*` patterns to dim brown italic Rich markup for stage directions and bar beats.
- Backchannel messages (`_bc` suffix) render as a single dim italic line without a speaker header.

## Adding a character

Add an entry to `CHARACTERS` in `personas.py`. All fields are required:

```python
"Name": {
    "era":             "dates and location",
    "verbosity":       "terse" | "normal" | "expansive",
    "known_for":       "what they are famous for",
    "core_beliefs":    "their key philosophical positions",
    "rhetorical_moves":"how they argue and speak",
    "cite_these":      "specific works and quotes to draw from",
    "hot_topics":      "what makes them animated or combative",
    "dynamics": {
        "Other Character": "how they specifically relate to that person",
    },
},
```

`dynamics` is defined but not currently injected into prompts — characters react based on what is actually said.

Current characters: Socrates, Nietzsche, Marx, Sun Tzu, Abraham Lincoln, Nikola Tesla, Frederick Douglass, John Lennon, Wolfgang Amadeus Mozart, Elon Musk, Bill Gates, Steve Jobs, Vladimir Lenin, Adolf Hitler, Joseph Stalin, Mao Zedong, Pol Pot, Isaac Newton, Albert Einstein, Niels Bohr, Werner Heisenberg, Richard Feynman, Roger Penrose.

Good candidates to add: Hannah Arendt (essential with the authoritarian cast), Machiavelli, Thomas Jefferson, Dostoevsky, Oscar Wilde, Voltaire, Napoleon, Confucius, Ibn Khaldun.

## Runtime `!` commands

| Command | Effect |
|---|---|
| `!quit` / `!exit` | Exit the game |
| `!debug` | Toggle all debug output |
| `!debug <channel>` | Toggle one channel: `moderator` `philosopher` `consensus` `routing` `state` |
| `!debug status` | Show all channel states |
| `!help` | List commands (CLI only) |

Debug output goes to **stderr**: `python main.py --debug 2>debug.log`

> **Windows note:** open `debug.log` in VS Code — PowerShell's `2>` writes UTF-16 which some editors misread.

## Key design decisions

- **Lazy LLM clients** — `_chat_llm()` / `_selector_llm()` / `_structured_llm()` are called at invocation time so `load_dotenv()` in `main.py` always runs first.
- **`name` field sanitization** — OpenAI rejects spaces in `name` fields. Names are stored as `First_Last` in messages and converted back for display.
- **1 candidate by default, 2 on tie** — `_top_candidates()` returns 1 name unless the top two keyword scores are equal; only then are both generated and the selector called. This halves typical API cost.
- **Partial consensus** — Partial agreements are fed back into each philosopher's system prompt so characters are aware of forming coalitions and who to challenge.
- **Graph reruns per batch** — No LangGraph checkpointer. `main.py`/`ui.py` holds the full state dict and passes it to `graph.stream()` each batch. Intentional simplicity.
- **`STATE` debug channel** is off by default — very verbose (fires after every node).
- **Degenerate output guard** — `_generate_candidate` retries if response is < 8 chars or equals the sanitized speaker name.
- **`_bc` suffix** — backchannel AIMessages use `Name_bc` in the `name` field so they can be identified and skipped by the scorer without a separate state field.
- **LangSmith disabled by default** — `os.environ.setdefault("LANGCHAIN_TRACING_V2", "false")` is set at the very top of `main.py`, before any langchain imports, so LangSmith never spins up its background thread (which caused a shutdown crash).
