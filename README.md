# The Philosopher's Room

A terminal game powered by LangGraph and OpenAI where famous thinkers from history debate each other — and you — in search of consensus.

## How it works

You pick 2–4 historical figures, give them a topic, and watch them argue. Each turn the two most likely candidates to react (scored by hot-topic keyword overlap) generate responses in parallel; a selector LLM picks the most dramatically compelling one. After every full round a consensus checker evaluates whether the room has converged. You can jump in at any point to steer the conversation.

Characters include Socrates, Nietzsche, Marx, Lincoln, Sun Tzu, Marie Curie, Simone de Beauvoir, Cleopatra VII, Nikola Tesla, and Frederick Douglass.

## Setup

```bash
git clone <repo>
cd fungame03

python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

cp .env.example .env
# edit .env and add your OPENAI_API_KEY
```

## Running

```bash
python main.py
```

With debug output:

```bash
python main.py --debug 2>debug.log
```

## In-game commands

Type these at the conversation prompt during the game:

| Command | Effect |
|---|---|
| `!quit` / `!exit` | Exit the game |
| `!debug` | Toggle all debug output on/off |
| `!debug <channel>` | Toggle a single channel (e.g. `!debug state`) |
| `!debug status` | Show on/off state of all channels |
| `!help` | List available commands |

**Debug channels:**

| Channel | What it shows |
|---|---|
| `moderator` | Speaker selection, round transitions |
| `philosopher` | Candidate generation, token counts, response preview |
| `consensus` | Transcript sent to checker, structured result |
| `routing` | Graph edge decisions |
| `state` | Full state snapshot after every node (verbose, off by default) |

Debug output goes to **stderr** — separate it from game output:

```bash
python main.py --debug 2>debug.log
```

## Architecture

```
main.py        CLI game loop, display, user input
graph.py       LangGraph StateGraph builder
nodes.py       moderator, parallel turn, consensus checker nodes
state.py       RoomState TypedDict
personas.py    Character definitions
debug.py       Per-channel debug logging to stderr
```

**Graph flow:**

```
moderator → parallel_turn → moderator → parallel_turn → ... → consensus_checker → END
```

Each turn, the moderator checks whether a consensus check is due. If not, up to 2 candidates are generated in parallel (selected by hot-topic relevance to the last message), a selector LLM picks the best response, and the winner's turn is committed to state. Consensus is checked every `len(participants) * 3` turns. The main loop pauses for optional user input between rounds.

**Conversation memory:**

- Each character carries a rolling log of their last 5 claims — the no-repeat prompt shows all of them, not just the last message, so arguments don't loop even in long debates.
- Once history exceeds 14 messages, older messages are compressed into a summary block. Each LLM call receives the summary + the last 10 messages.

**Models:**

| Node | Model |
|---|---|
| Philosopher (candidate generation) | `gpt-4o` |
| Selector | `gpt-4o-mini` |
| Consensus checker | `gpt-4o` |
| History summarizer | `gpt-4o` |

> **Note on API costs:** with 4 participants, each round generates ~24 philosopher calls. If you're on a free tier or low-credit account, debates can exhaust quota quickly. Consider using fewer participants or a shorter turn limit.

## Adding characters

Add an entry to `CHARACTERS` in `personas.py`. All fields are required:

```python
"Name": {
    "era":             "dates and location",
    "known_for":       "one-line summary of their significance",
    "core_beliefs":    "their key philosophical or intellectual positions",
    "rhetorical_moves":"how they argue and speak",
    "cite_these":      "specific works, quotes, and ideas to draw from",
    "hot_topics":      "subjects that animate or provoke them",
    "dynamics": {
        "Other Character": "how they relate to that specific person",
    },
},
```

`dynamics` keys only have effect when that character is in the same room.

## Requirements

- Python 3.11+
- OpenAI API key with access to `gpt-4o` and `gpt-4o-mini`
