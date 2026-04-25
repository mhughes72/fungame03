# The Philosopher's Room

A terminal game powered by LangGraph and OpenAI where famous thinkers from history debate each other — and you — in search of consensus.

## How it works

You pick 2–4 historical figures, give them a topic, and watch them argue. Each character speaks in turn, responding to what others have said. After every full round a consensus checker evaluates whether the room has converged. You can jump in at any point to steer the conversation.

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
python main.py --debug
# or
DEBUG=1 python main.py
```

## Debug commands

Type these at the conversation prompt during the game:

| Command | Effect |
|---|---|
| `!debug` | Toggle all debug output on/off |
| `!debug <channel>` | Toggle a single channel (e.g. `!debug state`) |
| `!debug status` | Show on/off state of all channels |
| `!help` | List available commands |

**Debug channels:**

| Channel | What it shows |
|---|---|
| `moderator` | Who speaks next, round transitions |
| `philosopher` | Prompt sent, token counts, response preview |
| `consensus` | Transcript sent to checker, structured result |
| `routing` | Graph edge decisions |
| `state` | Full state snapshot after every node (verbose, off by default) |

Debug output goes to **stderr** so you can separate it from the game:

```bash
python main.py --debug 2>debug.log
```

## Architecture

```
main.py        CLI game loop, display, user input
graph.py       LangGraph StateGraph builder
nodes.py       moderator, philosopher factory, consensus checker
state.py       RoomState TypedDict
personas.py    Character definitions
debug.py       Debug logging with per-channel toggles
```

**Graph flow per round:**

```
moderator → philosopher_A → moderator → philosopher_B → ... → consensus_checker → END
```

Each round all selected philosophers speak once. The moderator does round-robin routing. After a full round the consensus checker uses structured output to evaluate whether genuine agreement has formed. The main loop then pauses for optional user input before starting the next round.

## Adding characters

Add an entry to the `CHARACTERS` dict in `personas.py`:

```python
"Your Character": {
    "era":           "dates and location",
    "known_for":     "what they are famous for",
    "style":         "how they speak",
    "core_beliefs":  "their key philosophical positions",
},
```

## Requirements

- Python 3.11+
- OpenAI API key with access to `gpt-4o`
