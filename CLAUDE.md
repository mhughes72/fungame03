# CLAUDE.md — The Philosopher's Room

## What this project is

A terminal game where 2–4 historical figures (philosophers, leaders, scientists) debate a topic using LangGraph + OpenAI. Each turn, the two candidates most likely to react (scored by hot-topic keyword overlap with the last message) generate responses in parallel; a selector LLM picks the most dramatically compelling one. A consensus checker runs periodically to detect full and partial agreements.

## How to run

```bash
python main.py           # normal
python main.py --debug   # with debug output to stderr
```

Requires `OPENAI_API_KEY` in `.env`.

## File map

| File | Role |
|---|---|
| `main.py` | CLI game loop, display, user input, `!` commands |
| `graph.py` | `build_graph(participants)` — assembles the LangGraph `StateGraph` |
| `nodes.py` | All three node types: moderator, parallel turn, consensus checker |
| `state.py` | `RoomState` TypedDict — single source of truth for graph state |
| `personas.py` | Character definitions — the only file to edit when adding characters |
| `debug.py` | Per-channel debug logging (`dlog`, `toggle`, `status`) |

## Graph shape

```
START → moderator → parallel_turn → moderator → parallel_turn → ... → consensus_checker → END
```

- The moderator only checks whether it's time for a consensus check. No LLM call.
- `parallel_turn` scores all eligible speakers by hot-topic keyword overlap, generates the top 2 in parallel via `ThreadPoolExecutor`, then calls a `gpt-4o-mini` selector to pick the winner.
- Consensus is checked every `len(participants) * 3` turns.
- The graph runs one full batch (until `consensus_checker → END`) per `graph.stream()` call. `main.py` handles user input between batches.

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
| `remaining_disagreements` | `list[str]` | Bullet points of open tensions |
| `argument_log` | `dict` | `{name: [claim1, …]}` — last 5 claims per character, used for cross-turn no-repeat |

## Models used

| Node | Model | Why |
|---|---|---|
| Philosopher (candidate generation) | `gpt-4o` | Needs high quality for character fidelity |
| Selector | `gpt-4o-mini` | Fast routing decision |
| Consensus checker | `gpt-4o` | Needs careful structured reasoning |
| History summarizer | `gpt-4o` | Accurate compression of debate arc |

## Context management

- Each LLM candidate call receives a trimmed history: leading summary block (if present) + last 10 messages (`_CANDIDATE_HISTORY = 10`). Full history is still passed to the no-repeat prompt builder.
- Once `messages` exceeds 14 entries (`_SUMMARIZE_AFTER`), older messages are compressed into a single `SystemMessage` summary. The 6 most recent messages are always kept intact (`_KEEP_RECENT`).
- `argument_log` tracks each character's last 5 full responses across the whole debate. The no-repeat guard in the user prompt shows all of them, not just the last message.

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

`dynamics` keys only fire when that character is in the same room. Note: `dynamics` is defined in personas but not currently injected into prompts — characters react to each other based on what is actually said, not pre-loaded relationships.

## Runtime `!` commands

Type these at the conversation prompt:

| Command | Effect |
|---|---|
| `!quit` / `!exit` | Exit the game |
| `!debug` | Toggle all debug output |
| `!debug <channel>` | Toggle one channel: `moderator` `philosopher` `consensus` `routing` `state` |
| `!debug status` | Show all channel states |
| `!help` | List commands |

Debug output goes to **stderr** — redirect independently: `python main.py --debug 2>debug.log`

> **Windows note:** open `debug.log` in VS Code rather than a text editor — PowerShell's `2>` redirect writes UTF-16 which some editors misread.

## Key design decisions

- **Lazy LLM clients** — `_chat_llm()` / `_selector_llm()` / `_structured_llm()` are called at invocation time, not module import, so `load_dotenv()` in `main.py` always runs first.
- **`name` field sanitization** — OpenAI rejects spaces in message `name` fields. Philosopher names are stored as `First_Last` in messages and converted back for display.
- **Parallel generation + selection** — Generating 2 candidates and picking the best one produces more dramatically alive conversation than routing a single speaker. The ping-pong warning in the selector prompt breaks up two-person lock-ins.
- **Partial consensus** — The consensus checker returns both full and partial agreements. Partial agreements are fed back into the philosopher system prompt so characters are aware of forming coalitions.
- **Graph reruns per batch** — There is no LangGraph checkpointer. `main.py` holds the full state dict and passes it to `graph.stream()` each batch. This is intentional simplicity.
- **`STATE` debug channel** is off by default — it's very verbose (fires after every graph node).
- **API cost** — With 4 participants, each round makes ~24 `gpt-4o` calls. On a low-credit account this depletes quota quickly. The biggest levers are: drop to 1 candidate per turn, switch philosopher model to `gpt-4o-mini`, or increase the consensus check interval.
