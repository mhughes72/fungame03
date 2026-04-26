# The Philosopher's Bar

A terminal game powered by LangGraph and OpenAI where famous thinkers from history debate each other — and you — in search of consensus.

## How it works

You pick 2–4 historical figures, give them a topic, and watch them argue. Each turn the most likely candidate to react (scored by hot-topic keyword overlap with the last message) generates a response — a second candidate is generated only when scores are tied, and a selector LLM picks the winner. The debate runs in structured rounds: every 4 turns a moderator automatically steers the conversation toward common ground; every 12 turns a consensus checker evaluates whether the room has converged. You can jump in at any point to guide the conversation yourself.

**26 characters** spanning philosophy, physics, politics, and tech — including Socrates, Nietzsche, Marx, Lenin, Stalin, Mao, Pol Pot, Hitler, Newton, Einstein, Bohr, Heisenberg, Feynman, Penrose, Musk, Gates, Jobs, and more.

Response length adapts to context: a short pointed question gets a blunt one-liner; a long developed argument gets a full response.

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

| Command | Mode |
|---|---|
| `python main.py` | Classic CLI |
| `python main.py --ui` | Bar UI (recommended) |
| `python main.py --debug` | CLI with debug output to stderr |
| `python main.py --ui --debug` | Bar UI with debug output to stderr |

**Redirect debug output to a file:**

```bash
python main.py --debug 2>debug.log
python main.py --ui --debug 2>debug.log
```

> **Windows note:** open `debug.log` in VS Code rather than Notepad — PowerShell's `2>` redirect writes UTF-16 which some editors misread.

## Bar UI controls

| Key | Effect |
|---|---|
| `Enter` (empty input) | Moderator steers the debate |
| `Enter` (with text) | Your message guides the next turn |
| `Ctrl+D` | Toggle debug output |
| `Ctrl+C` | Quit |

## In-game commands (CLI and bar UI)

Type these at the input prompt:

| Command | Effect |
|---|---|
| `!quit` / `!exit` | Exit the game |
| `!debug` | Toggle all debug output on/off |
| `!debug <channel>` | Toggle a single channel (e.g. `!debug state`) |
| `!debug status` | Show on/off state of all channels |
| `!help` | List available commands (CLI only) |

**Debug channels:**

| Channel | What it shows | Default |
|---|---|---|
| `moderator` | Speaker selection, round transitions | on |
| `philosopher` | Candidate generation, token counts, debate arcs | on |
| `consensus` | Transcript sent to checker, structured result | on |
| `routing` | Graph edge decisions | on |
| `state` | Full state snapshot after every node (very verbose) | off |

## Debate logic

### Round structure

Each debate runs in cycles controlled by `participant_count (N)`:

- Every `N × 2` philosopher turns → **steer exit**: graph pauses for player/moderator input
- Every `N × 6` philosopher turns → **consensus check**: structured analysis of agreements and tensions
- This means a consensus check fires every 3 steer cycles

For 2 participants: steer at turns 4, 8, 16, 20 … consensus at turns 12, 24.  
For 4 participants: steer at turns 8, 16, 32, 40 … consensus at turns 24, 48.

The debate ends after 24 philosopher turns if no consensus is reached.

### Who speaks next

Each turn, all participants except the last speaker are eligible. Their `hot_topics` field is scored against the last message by word overlap — whoever's obsessions were most triggered gets to speak. If the top two scores are tied, both generate responses and a selector LLM picks the more dramatically compelling one. Otherwise only the top scorer generates.

Ping-pong detection watches the last 6 speakers: if two people have dominated ≥4 of the last 6 turns, the selector is warned to prefer a fresh voice.

### What goes into each philosopher's prompt

**System prompt:**
- Character identity: era, known_for, core beliefs, rhetorical style
- Early debate (before first history compression): also includes `cite_these` and `hot_topics`
- Established debate (after first compression): `cite_these` and `hot_topics` are dropped and replaced with a first-person debate arc summary — what this character has argued, conceded, and is currently defending
- If partial agreements exist: coalition context is injected — who the character is aligning with, and who they should challenge

**User prompt:**
- The central question
- The last 3 claims this character has made (no-repeat guard)
- A direct quote of the last thing said, with instruction to engage with it specifically
- If the character has made zero concessions after turn 8: a nudge to find merit in what was just said

### Candidate history

Each philosopher call receives a trimmed history: the leading summary block (if present) + the last 6 messages. The full history is used only for the no-repeat guard.

### Argument log

Each character's last 3 full responses are stored and shown in their prompt as claims they must not repeat. Older entries are dropped as new ones arrive.

### Concession tracking

After each philosopher turn, the winning response is scanned for concession language: *perhaps, i grant, you raise, i admit, that is fair, fair point, i concede, you are right, granted, i acknowledge, true enough, well said, you make a point, i'll grant, i cannot deny.* Hits increment that character's concession count in state.

Concession counts are used in two ways:
1. Prompt pressure: zero concessions past turn 8 → nudge to find merit in opponent's argument
2. Moderator targeting: the character with the fewest concessions is identified as most entrenched and addressed by name in the steer

### Moderator steer

At each steer exit, pressing Enter (or typing a style number) triggers a `gpt-4o-mini` call that generates a 1–2 sentence intervention. The moderator receives the topic, recent transcript, all current agreements and tensions, and a targeting instruction naming the most entrenched participant.

Seven moderator styles are available and switchable at any break:

| Style | Approach |
|---|---|
| **Socratic** | Builds bridges, seeks common ground, extends partial agreements |
| **Combative** | Exposes contradictions, demands concessions, asks what it would cost to be wrong |
| **Devil's Advocate** | Attacks whatever position is gaining momentum to stress-test it |
| **Koan** | Throws an oblique, unanswerable question at the most confident participant |
| **Journalist** | Demands one concrete sentence — no metaphor, no abstraction, no history |
| **Straw Man** | Misrepresents a position to force the speaker to clarify and sharpen it |
| **Steel Man** | Forces a participant to argue their opponent's case at its strongest before replying |

### Consensus checker

Every `N × 6` turns, the last 12 messages are sent to `gpt-4o` with a structured output schema. The model returns:

- `full_consensus` — whether the entire group genuinely agrees
- `points_of_agreement` — things **all** participants agree on (strict: no partial counts)
- `partial_agreements` — subsets of 2+ participants converging on something
- `remaining_disagreements` — open tensions, each with the two opposing participants and their actual stances
- `dissenters` — participants not part of any alignment

Partial agreements are fed back into each philosopher's system prompt so characters are aware of forming coalitions and who they should challenge.

### History compression

Once the message history exceeds 14 entries, older messages are compressed by `gpt-4o` into a 150–250 word third-person summary. The 6 most recent messages are always kept verbatim.

At the same time, a first-person debate arc is generated for each participant in parallel using `gpt-4o-mini` — 60–80 words covering what they've argued, conceded, and are currently defending. This arc replaces the verbose `cite_these` and `hot_topics` sections in their system prompt for the rest of the debate.

### Models

| Node | Model |
|---|---|
| Philosopher (candidate generation) | `gpt-4o-mini` |
| Selector (when scores tie) | `gpt-4o-mini` |
| Consensus checker | `gpt-4o` |
| History summarizer | `gpt-4o` |
| Character arc summaries | `gpt-4o-mini` |
| Moderator steer | `gpt-4o-mini` |

> **API costs:** with 4 participants, each steer cycle (8 turns) makes ~8 philosopher calls plus 1 moderator call. The consensus checker (`gpt-4o`) runs every 3 cycles. The biggest single cost lever is reducing participants from 4 to 2.

## Architecture

```
main.py        Entry point — CLI game loop or launches bar UI
ui.py          Textual bar UI (setup screen + three-panel debate view)
graph.py       LangGraph StateGraph builder
nodes.py       All node functions, prompt builders, steer generator
state.py       RoomState TypedDict
personas.py    Character definitions
debug.py       Per-channel debug logging to stderr
```

**Graph routing:**

```
START → moderator ─┬─ consensus_check → consensus_checker → END
                   ├─ __steer__ ──────────────────────────→ END
                   └─ __turn__ ──→ parallel_turn → moderator → (loop)
```

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
