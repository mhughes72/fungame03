# CLAUDE.md — The Philosopher's Bar

## What this project is

A terminal game where 2–4 historical figures debate a topic using LangGraph + OpenAI. Each turn, candidates are scored by hot-topic keyword overlap with the last message; the top scorer speaks (or top 2 if tied, then a selector LLM picks). A consensus checker runs periodically to detect full and partial agreements.

## How to run

```bash
python main.py           # CLI
python main.py --ui      # Textual bar UI (recommended)
python main.py --debug   # with debug output to stderr
```

Requires `OPENAI_API_KEY` in `.env`.

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

## Graph shape

```
START → moderator ─┬─ consensus_checker → END
                   ├─ __steer__ ────────→ END
                   └─ parallel_turn ───→ moderator → (loop)
```

- The `moderator` node only routes — no LLM call.
- Steer exit fires every `N×2` turns; consensus check fires every `N×6` turns (N = participant count).
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
| `argument_log` | `dict` | `{name: [claim1, …]}` — last 3 responses per character, used for no-repeat guard |
| `concession_counts` | `dict` | `{name: int}` — times each character has granted a point |
| `character_summaries` | `dict` | `{name: str}` — first-person debate arc, generated at history compression |
| `moderator_style` | `str` | One of 7 styles: `socratic`, `combative`, `devil's advocate`, `koan`, `journalist`, `straw man`, `steel man` |

## Models used

| Node | Model |
|---|---|
| Philosopher (candidate generation) | `gpt-4o-mini` |
| Selector (when scores tie) | `gpt-4o-mini` |
| Moderator steer | `gpt-4o-mini` |
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

## Moderator styles

7 styles switchable at every steer break (number input in CLI or UI):

| Style | Approach |
|---|---|
| `socratic` | Builds bridges, seeks common ground |
| `combative` | Exposes contradictions, demands concessions |
| `devil's advocate` | Attacks whatever position is gaining momentum |
| `koan` | Oblique, unanswerable question to the most confident participant |
| `journalist` | Demands one concrete sentence — no abstraction |
| `straw man` | Misrepresents a position to force clarification |
| `steel man` | Forces a participant to argue their opponent's case at its strongest |

## Textual UI (`ui.py`)

- `SetupScreen` — character picker (`SelectionList`), topic `Input`, "Open the bar" `Button`. Defaults: Lincoln (index 5) + Tesla (index 8).
- Uses `self.dismiss((chosen, topic))` to return result; parent uses `push_screen(SetupScreen(), callback=self._start_debate)`. **Do not use the `post_message`/`Message` pattern for pushed screens in Textual — it doesn't work.**
- `PhilosopherBar` runs `graph.stream()` in a `@work(thread=True)` worker; all UI updates go through `call_from_thread()`.
- Right pane shows topic, turn count, full agreements, partial alignments, open tensions (with participant attribution), and the style selector.

## Adding a character

Add an entry to `CHARACTERS` in `personas.py`. All fields are required:

```python
"Name": {
    "era":             "dates and location",
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

Current characters: Socrates, Nietzsche, Marx, Simone de Beauvoir, Sun Tzu, Abraham Lincoln, Marie Curie, Cleopatra VII, Nikola Tesla, Frederick Douglass, John Lennon, Wolfgang Amadeus Mozart.

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
- **Degenerate output guard** — `_generate_candidate` retries if response is < 30 chars or equals the sanitized speaker name.
