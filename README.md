# The Philosopher's Bar

A terminal game powered by LangGraph and OpenAI where famous thinkers from history debate each other — and you — in search of consensus.

## How it works

You pick 2–4 historical figures, give them a topic, and watch them argue. Each turn the most likely candidate to react (scored by hot-topic keyword overlap with the last message) generates a response — a second candidate is generated only when scores are tied, and a selector LLM picks the winner. The debate runs in structured rounds: every 4 turns a moderator automatically steers the conversation toward common ground; every 12 turns a consensus checker evaluates whether the room has converged. You can jump in at any point to guide the conversation yourself.

**27 characters** spanning philosophy, physics, politics, and tech — including Socrates, Nietzsche, Marx, Lenin, Stalin, Mao, Pol Pot, Hitler, Newton, Einstein, Bohr, Heisenberg, Feynman, Penrose, Musk, Gates, Jobs, Churchill, Roosevelt, Putin, Xi Jinping, and more.

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
| `python run_server.py` | Web server → `http://localhost:8000` |

**Redirect debug output to a file:**

```bash
python main.py --debug 2>debug.log
python main.py --ui --debug 2>debug.log
```

> **Windows note:** open `debug.log` in VS Code rather than Notepad — PowerShell's `2>` redirect writes UTF-16 which some editors misread.

## Web server

The web version serves a browser-based frontend with a seating chart, a steer drawer, and end-of-debate reports.

```bash
python run_server.py
```

Opens at `http://localhost:8000`. The frontend is pre-built and served as static files — no Node.js required to run it.

**Web UI features:**
- **Seating chart** — oval table with DALL-E 3 portraits; seats pulse on active speaker and glow green on full consensus
- **Steer drawer** — slides up from the bottom of the left column at each steer break; shows all 8 moderator styles with full descriptions; conversation remains visible above it; moderator style updates in the sidebar immediately on submit
- **Cheat button** — always-accessible button in the debate header; opens a modal to directly set the heat level (0–10 slider) and buy rounds for any character; drink controls were moved here from the steer drawer
- **End-of-debate report** — shown on both consensus and quit, with turn count, heat level, agreements reached, partial alignments, and unresolved tensions
- **Newspaper front page** — after a debate ends, click "Read the morning paper" to generate a sensationalist Victorian-style newspaper front page summarising the debate, complete with headline, scandal sidebar, pull quote, and portrait photos of all participants
- **About / Help** — accessible from both the setup screen and the debate header; explains the rules and mechanics to new players

**To rebuild the frontend after editing `client/src/`:**

```bash
cd client
npm install   # first time only
npm run build
cd ..
```

## Generating portraits

Two portrait generators ship with the project. Both use DALL-E 3 for most characters and fall back to real Wikipedia photos for figures that DALL-E refuses to generate (Hitler, Stalin, Mao, Pol Pot, Lenin, Putin, Xi Jinping, and current tech figures). The `WIKIPEDIA_SOURCES` dict at the top of each script is the place to add more if DALL-E blocks additional characters.

### Game portraits (`generate_portraits.py`)

Used by the web UI seating chart. Saved to `portraits/`.

```bash
python generate_portraits.py                  # all characters
python generate_portraits.py Newton           # one character (partial name OK)
python generate_portraits.py Newton Einstein  # multiple characters
python generate_portraits.py --overwrite      # regenerate existing images
```

Style: flat vector illustration, bold cartoon, warm colour palette.

### Newspaper portraits (`generate_newspaper_portraits.py`)

Used by the post-debate newspaper front page. Saved to `newspaper_portraits/`.

```bash
python generate_newspaper_portraits.py                  # all characters
python generate_newspaper_portraits.py Newton           # one character (partial name OK)
python generate_newspaper_portraits.py Newton Einstein  # multiple characters
python generate_newspaper_portraits.py --overwrite      # regenerate existing images
```

Style is era-aware:
- **Photography era** (died after 1845): vintage sepia press-photo style
- **Pre-photography** (died before 1845 — Newton, Mozart, Socrates, Sun Tzu): Victorian woodcut / cross-hatch engraving style

### Forcing a Wikipedia lookup

If a DALL-E result doesn't look like the real person, pass `--wiki` to fetch the main Wikipedia photo instead:

```bash
python generate_portraits.py Feynman --wiki --overwrite
python generate_newspaper_portraits.py Einstein --wiki --overwrite

# Works with multiple names
python generate_portraits.py Newton Tesla Lincoln --wiki --overwrite
```

`--wiki` uses the character's name as the Wikipedia article title. If Wikipedia has no image it falls back to DALL-E automatically. Characters already in `WIKIPEDIA_SOURCES` always use Wikipedia regardless.

Both scripts require `OPENAI_API_KEY` in `.env` for DALL-E generation. Wikipedia fetches need no key.

---

## Debate topics

The setup screen shows a **Suggested Debate** card that picks a topic from a pre-generated pool in `debate_topics.json`. Topics are filtered by the audience level selected on the setup screen (Grade 5 / High School / University / Expert) and picked with weighted random selection — curated entries appear roughly 3× more often than AI-generated ones.

The pool is managed with a standalone CLI that calls OpenAI to generate new entries:

```bash
# Generate 10 topics spread evenly across all audience levels (default)
python generate_debate_topics.py --count 10

# Generate 5 topics for a specific audience level
python generate_debate_topics.py --count 5 --level grade5
python generate_debate_topics.py --count 5 --level highschool
python generate_debate_topics.py --count 5 --level university
python generate_debate_topics.py --count 5 --level expert

# List all topics currently in the file
python generate_debate_topics.py --list

# List topics for one level
python generate_debate_topics.py --list --level university

# Show all valid audience level keys
python generate_debate_topics.py --levels

# Delete all AI-generated topics (curated entries are preserved)
python generate_debate_topics.py --clear

# Verbose output — shows the full generated entry as JSON
python generate_debate_topics.py --count 5 --verbose
```

Each generated entry includes the suggested characters, a one-line tagline, a category (heated / historic / philosophical / scientific / cultural / political), a semantic theme label (used to avoid repetition across runs), and an audience level. The generator automatically avoids topics, casts, and themes already present in the file for that level.

**Adding curated entries manually:** open `debate_topics.json` and add an entry with `"source": "curated"`. Set a unique `"id"` (any string), fill in `topic`, `tagline`, `characters`, `category`, `theme`, and `audience_level`. The `--clear` command will never touch curated entries.

Requires `OPENAI_API_KEY` in `.env`.

---

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
- Every `N × 6` philosopher turns → **consensus check**: structured `gpt-4o` analysis of agreements and tensions
- Consensus check fires every **3rd** steer break
- Web UI hard limit: **24 turns** — debate ends without consensus if not reached by then

| Players | Steer every | Consensus every | Steer breaks before end | Consensus checks before end |
|---|---|---|---|---|
| 2 | 4 turns | 12 turns | 6 | 2 |
| 3 | 6 turns | 18 turns | 4 | 1 |
| 4 | 8 turns | 24 turns | 3 | 1 |

> With 3 or 4 players there is only one consensus check in the whole debate (at turn 18 or 24). Use **Last Call** moderator style in the final steer break to push characters toward agreement before the clock runs out.

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
- A direct quote of the last thing said, with instruction to engage with it specifically — or, if the previous speaker was cut off mid-sentence (response ended with `—`), a prompt describing the cutoff and offering three response options: steamroll past it, finish their thought sarcastically, or turn the interruption itself into an argument
- If the character has made zero concessions after turn 8: a nudge to find merit in what was just said

### Candidate history

Each philosopher call receives a trimmed history: the leading summary block (if present) + the last 6 messages. The full history is used only for the no-repeat guard.

### Argument log

Each character's last 3 full responses are stored and shown in their prompt as claims they must not repeat. Older entries are dropped as new ones arrive.

### Interruptions

At heat ≥ 6, the system prompt instructs characters they may cut off mid-sentence — ending their response with an em-dash (`—`) when conviction overtakes composition. The next speaker's prompt detects this and frames the cutoff as something to react to rather than ignore. At heat 9–10, interrupting is described as expected behaviour.

This is prompt-driven: the model decides whether to cut off, and the detection is a simple string check. If the model never cuts off, nothing breaks.

### Alliance signalling

When partial agreements form, the coalition block in each allied character's system prompt is extended with a **social texture** note. If the character has a `dynamics` entry for their ally (most major character pairs do), that historical relationship is quoted and they are told to let the tension surface — to acknowledge the surprise, express cautious respect, or note what still divides them despite the convergence. If no dynamics entry exists, a generic nudge is added instead.

This turns silent coalitions into named, slightly awkward ones: *"I find myself agreeing with Lenin here, which I'll admit unsettles me."*

### Concession tracking

After each philosopher turn, the winning response is scanned for concession language: *perhaps, i grant, you raise, i admit, that is fair, fair point, i concede, you are right, granted, i acknowledge, true enough, well said, you make a point, i'll grant, i cannot deny.* Hits increment that character's concession count in state.

Concession counts are used in two ways:
1. Prompt pressure: zero concessions past turn 8 → nudge to find merit in opponent's argument
2. Moderator targeting: the character with the fewest concessions is identified as most entrenched and addressed by name in the steer

### Drunk characters

Each character tracks a cumulative drink count (`drunk_levels` in state). The player can add drinks per character at any time using the **Cheat** button in the debate header — `−`/`+` controls per character, applied immediately. Counts accumulate across rounds and reset on new topic.

The drink level is injected as the final instruction in the character's user prompt — the position the model weighs most heavily:

| Drinks | Effect |
|---|---|
| 1 | Filter loosened — says things normally held back; too emphatic on key point; stage direction required |
| 2 | Clearly tipsy — says the quiet part loud; trails off mid-sentence with an em-dash and recovers; unsteady stage direction |
| 3 | Drunk — slurred words in text (e.g. *thish*, *exshactly*); loops back to the same point twice; CAPS for emphasis; required stage direction |
| 4+ | Very drunk — barely coherent; sentence fragments; goes on a tangent and slams back; one sentence maximum; physical unsteadiness required |

---

### Moderator steer

At each steer exit, pressing Enter (or typing a style number) triggers a `gpt-4o-mini` call that generates a 1–2 sentence intervention. The moderator receives the topic, recent transcript, all current agreements and tensions, and a targeting instruction naming the most entrenched participant.

Eight moderator styles are available and switchable at any break:

| Style | Approach |
|---|---|
| **Socratic** | Builds bridges, seeks common ground, extends partial agreements |
| **Combative** | Exposes contradictions, demands concessions, asks what it would cost to be wrong |
| **Devil's Advocate** | Attacks whatever position is gaining momentum to stress-test it |
| **Koan** | Throws an oblique, unanswerable question at the most confident participant |
| **Journalist** | Demands one concrete sentence — no metaphor, no abstraction, no history |
| **Straw Man** | Misrepresents a position to force the speaker to clarify and sharpen it |
| **Steel Man** | Forces a participant to argue their opponent's case at its strongest before replying |
| **Last Call** | All-out push for consensus — names slivers of agreement and forces commitment or explanation |

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

## Diagrams (experimental)

When enabled on the setup screen, characters can produce supporting images during the debate. The feature is off by default.

**How it works:** each philosopher's system prompt includes an optional instruction to embed a `[DIAGRAM: Wikipedia article title]` marker anywhere in their response when they want to physically hold up or sketch something. After generation, the marker is stripped from the displayed text, the named Wikipedia article is queried for its lead image via the Wikipedia pageimages API (with a Wikimedia Commons raster-image fallback), and the image is rendered inline in the conversation pane as a captioned card.

The approach relies on philosopher self-signalling — the character decides when a diagram is warranted and picks the article title. Images already shown in the current session are deduplicated. SVG files are excluded (rendering inconsistency).

**Current limitations:** the LLM picks article titles based on training knowledge of what those articles cover, but has no way to predict what Wikipedia's editorial team has chosen as the lead image. General concept articles (e.g. *Photon*, *Energy*) can return surprising images; named diagram or experiment articles (*Bohr model*, *Photoelectric effect*, *Double-slit experiment*) are much more reliable. The prompt guides characters toward the latter, but this is a heuristic, not a guarantee. A more robust solution would require a vision-model relevance check after fetching the image — not currently implemented.

## Architecture

```
main.py        Entry point — CLI game loop or launches bar UI
ui.py          Textual bar UI (setup screen + three-panel debate view)
graph.py       LangGraph StateGraph builder
nodes.py       All node functions, prompt builders, steer generator
state.py       RoomState TypedDict
personas.py    Character definitions
debug.py       Per-channel debug logging to stderr
run_server.py  Web server entry point
server/        FastAPI app, SSE stream, session store
client/src/    Vanilla JS frontend (Vite)
client/dist/   Pre-built frontend — served by FastAPI
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
    "verbosity":       "terse" | "normal" | "expansive",
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

## QA checklist

Use 2 participants (faster, cheaper) unless a feature specifically requires more. Suggested default pair: **Newton + Nietzsche**, topic: *"Is truth discovered or invented?"*

---

### 1. Basic debate flow

**What to verify:** turns advance, each philosopher responds, no crashes.

1. Run `python main.py --ui` (or `python main.py` for CLI).
2. Pick 2 characters, enter a topic, start the debate.
3. Watch at least one full steer cycle (4 turns for 2 participants).
4. Confirm each turn shows the speaker's name and a non-empty response.
5. Confirm the steer break fires after turn 4.

**Pass:** 4 distinct philosopher turns complete and the steer modal (UI) or steer prompt (CLI) appears.

---

### 2. Steer drawer (Web UI)

**What to verify:** drawer slides up, accepts input, dismisses correctly, updates style.

1. Run `python run_server.py` and open the web UI.
2. Let the debate reach turn 4 (for 2 participants).
3. Confirm the steer drawer slides up from the bottom of the left column — the conversation above remains fully visible.
4. Enter text in the input field → click **Steer** → confirm your text appears in the conversation as a `[You]` message and the debate continues.
5. On the next steer break, click a different style button → click **Steer** without text → confirm the moderator generates a steer in the new style.
6. On the next steer break, click **Quit game** → confirm the end-of-debate report appears before the session ends.

**Pass:** drawer opens every steer break, user text and style selection both take effect, quit shows the report.

---

### 3. Moderator steer generation

**What to verify:** steer fires for each style and produces relevant output.

1. CLI: reach a steer break, press Enter with no input → moderator steer appears.
2. Switch styles (type `2` then Enter) → a new steer appears reflecting the combative style.
3. Try at least 3 different styles (e.g. `3` devil's advocate, `4` koan, `7` steel man).
4. Confirm the steer names a participant and references the actual topic.

**Pass:** each style produces noticeably different language; the participant named is one of the active debaters.

---

### 4. Direct calling-out (forced speaker)

**What to verify:** mentioning a participant's name forces them to respond next.

1. At a steer break, type a message that clearly names one participant, e.g. *"Newton, what do you make of Nietzsche's claim?"*
2. Confirm the very next philosopher turn is Newton (not a scorer-selected speaker).
3. Repeat with the other participant's name.

**Pass:** the named character speaks next in both cases. If the name is ambiguous or too short (≤ 3 chars), normal scoring applies — that is also correct behaviour.

---

### 5. Variable response length

**What to verify:** short prompts get short responses; terse personas stay terse.

1. Include a character with `"verbosity": "terse"` (e.g. Nietzsche, Sun Tzu, Feynman).
2. At a steer break inject a very short message: *"So?"*
3. The next response should be noticeably shorter than a response to a long message.
4. Inject a long, developed argument (3+ sentences) and observe that the next response is longer.
5. Compare terse vs. expansive personas (e.g. Nietzsche vs. Marx) — Marx should write more per turn on average.

**Pass:** response length visibly tracks both the message context and the persona's verbosity setting.

---

### 6. Backchannel reactions

**What to verify:** short interjections from non-speakers appear periodically.

1. Run the debate for at least 8 turns.
2. Watch for dim italic one-liners appearing between full turns — these are backchannels.
3. Confirm the backchannel author is **not** the current main speaker.
4. Confirm the backchannel does **not** increment the turn counter (the next full turn picks up where it left off).

**Pass:** at least 1 backchannel appears within 8 turns (50% chance per turn, so expect ~4). Backchannels are visually distinct (dim, italic, no speaker header box in UI).

---

### 7. Stage directions

**What to verify:** `*[action]*` text renders correctly in both UIs.

1. Run the debate for several turns — stage directions appear probabilistically in responses.
2. In the **bar UI**: confirm `*[sets down glass]*` style text renders as dim brown italic (not as raw asterisks).
3. In the **CLI**: confirm the text passes through (plain text is fine for CLI).
4. Confirm stage directions appear mid-paragraph or at the end of a philosopher's turn, not as a separate message.

**Pass:** at least 1 stage direction appears within 10 turns; it renders without raw markup visible in the UI.

---

### 8. Bar atmosphere beats

**What to verify:** the bar emits an atmosphere line after each completed batch.

1. Run `--ui`. After each steer cycle completes, watch for a dark amber italicised line in the conversation pane (e.g. *someone orders another round*).
2. Confirm beats appear after every batch, not mid-batch.
3. Confirm beats are distinct from backchannel messages (different colour, no speaker name).

**Pass:** a bar beat appears after each steer cycle in the UI conversation pane.

---

### 9. Heat / mood state

**What to verify:** heat rises with combative language, falls with concessions, affects prompts and UI.

1. Use a combative topic: *"Is violence ever justified?"* with Lenin + Nietzsche.
2. Watch the heat bar in the right pane of the UI. It should start low and rise as the debate intensifies.
3. At heat ≥ 6, philosopher responses should contain pointed personal jabs alongside arguments.
4. Switch style to **Steel Man** or **Socratic** and observe whether heat decreases over the next cycle as concessions are coaxed out.
5. Confirm the heat bar colour changes (blue at low, yellow at mid, red at high).

**Pass:** heat bar updates each batch; jabs appear at high heat; heat drops when concessions are made.

---

### 10. Topic drift detection

**What to verify:** drift is detected and surfaced to the player.

1. Start with topic *"What is consciousness?"* using Feynman + Penrose.
2. After a few rounds, inject a message that steers the topic elsewhere: *"But surely this is really about whether God exists."*
3. At the next steer break, confirm a drift notice appears before the steer modal (UI) or in the steer prompt (CLI), naming the new direction.
4. Choose to pursue the drift by entering a message aligned with the new topic.

**Pass:** drift notice appears when conversation leaves the original topic; the notice names the drifted topic specifically.

---

### 11. Callbacks (self-reference)

**What to verify:** characters reference their own earlier claims.

1. Run the debate for at least 8 turns so `argument_log` is populated.
2. Watch for a character quoting or referencing something they said earlier (e.g. "As I argued before…", "I said that…").
3. Confirm the callback is from the same character's own prior turn, not from an opponent.

**Pass:** at least 1 self-referential callback appears within 10 turns. (This is prompt-driven and probabilistic — if absent after 15 turns, check that `argument_log` is being populated in `--debug` mode.)

---

### 12. Concession tracking

**What to verify:** concessions are counted and affect prompts.

1. Enable debug: `python main.py --debug 2>debug.log`.
2. Run for 10+ turns. Open `debug.log` and search for `concession_counts`.
3. Confirm counts increment when a philosopher uses concession language.
4. At turn 8+, if a character has 0 concessions, their prompt should include a nudge phrase — visible in the `PHILOSOPHER` debug channel.
5. Confirm the moderator steer names the most entrenched participant.

**Pass:** `concession_counts` increments correctly; nudge appears in prompt for entrenched characters; moderator names them.

---

### 13. Partial agreements

**What to verify:** subgroup alignments are detected and displayed.

1. Use 3–4 participants with overlapping views (e.g. Newton + Einstein + Bohr, topic: *"Is physics complete?"*).
2. Run until partial agreements appear in the right pane (UI) or are printed between dotted lines (CLI).
3. Confirm the partial agreement names the specific participants and the point of convergence.
4. Confirm the next philosopher turns show awareness of the alignment (characters may reference the coalition).

**Pass:** at least 1 partial agreement appears and is displayed; subsequent philosopher prompts include coalition context.

---

### 14. Full consensus

**What to verify:** consensus is detected and ends the debate gracefully.

1. Use a soft topic with 2 agreeable characters: Socrates + Lincoln, *"Is honesty essential to good leadership?"*
2. Run the debate, occasionally steering with **Last Call** or **Socratic** style to push toward agreement.
3. When consensus fires, confirm the end screen shows the summary, points of agreement, and remaining disagreements.
4. Confirm the option to start a new topic is offered.

**Pass:** full consensus triggers, summary is displayed, new topic option works.

---

### 15. History compression

**What to verify:** old messages are summarised without losing the thread.

1. Run a long debate (14+ messages). Watch for the compression notice: *"Earlier conversation summarized — history condensed to N messages."*
2. After compression, confirm the debate continues coherently — characters should reference their debate arc (first-person summary) rather than specific old messages.
3. Enable `--debug` and check the `PHILOSOPHER` channel for "Debate arc" entries per character.

**Pass:** compression notice appears; debate continues; character arcs appear in debug log.

---

### 16. End-of-debate report (Web UI)

**What to verify:** report appears after both consensus and quit; data is accurate.

1. Reach consensus (or quit mid-debate) in the web UI.
2. Confirm the report panel appears in the conversation pane with: turn count, heat level bar, agreements reached (if any), partial alignments, and unresolved tensions.
3. On consensus: the panel should have a "consensus reached" header and list what everyone agreed on.
4. On quit: the panel should have a "last call" header with whatever state was reached.
5. Confirm the "Leave the bar" button clears the session.

**Pass:** report displays correct turn count and heat; agreements/tensions match what was shown in the sidebar during debate.

---

### 17. About and Help modals (Web UI)

**What to verify:** modals open, render content, and dismiss correctly.

1. Open the web UI setup screen — confirm **About** and **Help** links appear in the footer.
2. Click **About** → modal opens with game explanation and a GitHub link. Click outside the modal (or press Escape) → modal closes.
3. Click **Help** → modal opens with player guide. Close it.
4. Start a debate and confirm **About** and **Help** buttons appear in the debate header.
5. Open one from the debate header — confirm it overlays the debate without disrupting the session.

**Pass:** both modals open from both locations; click-outside and Escape close them; debate state is unaffected.

---

### 18. Portrait generation

**What to verify:** both portrait generators create images correctly.

1. Run `python generate_portraits.py Newton` — confirm `portraits/Isaac_Newton.png` is created.
2. Run `python generate_newspaper_portraits.py Newton` — confirm `newspaper_portraits/Isaac_Newton.png` is created (should use DALL-E engraving style).
3. Run `python generate_newspaper_portraits.py Hitler` — confirm `newspaper_portraits/Adolf_Hitler.png` is fetched from Wikipedia (no DALL-E call, prints "wikipedia").
4. Run either script again without `--overwrite` — confirm "already exists, skipping" is printed.
5. Run `python generate_portraits.py Xyz` — confirm "No match for 'Xyz'" is printed and no crash occurs.

**Pass:** images created in the correct folders, Wikipedia path used for blocked characters, skip and overwrite logic work, bad name handled gracefully.

---

### 19. Quit / exit paths

**What to verify:** all exit paths work cleanly without errors.

1. **Web header Quit:** click the Quit button in the debate header — end-of-debate report appears, then session ends.
2. **Web steer drawer Quit:** at a steer break, click **Quit game** — end-of-debate report appears.
3. **UI quit button (header):** click the Quit button in the top-right of the Textual bar — app exits.
4. **UI quit button (modal):** at a steer break, click Quit in the modal — app exits.
5. **CLI `!quit`:** type `!quit` at the steer prompt — exits with farewell message.
6. **Ctrl+C:** press Ctrl+C mid-debate — exits cleanly.
7. **New topic then quit:** reach consensus, start a new topic, then quit — no crash.

**Pass:** all paths exit without Python tracebacks or LangSmith thread errors; web quit paths show the end-of-debate report.
