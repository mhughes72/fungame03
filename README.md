# The Philosopher's Bar

A terminal game powered by LangGraph and OpenAI where famous thinkers from history debate each other — and you — in search of consensus.

## How it works

You pick 2–4 historical figures, give them a topic, and watch them argue. Each turn the most likely candidate to react (scored by hot-topic keyword overlap with the last message) generates a response — a second candidate is generated only when scores are tied, and a selector LLM picks the winner. The debate runs in structured rounds: every `N×2` turns (N = participant count) the graph pauses for a moderator steer and consensus check. You can jump in at any point to guide the conversation, call out a specific participant by name, or switch the moderator's approach.

**23 characters** spanning philosophy, physics, politics, and tech — including Socrates, Nietzsche, Marx, Lenin, Stalin, Mao, Pol Pot, Hitler, Newton, Einstein, Bohr, Heisenberg, Feynman, Penrose, Musk, Gates, Jobs, and more.

The conversation has texture: response length adapts to context (verbosity varies by persona and message type), non-speaking participants drop short backchannel reactions, characters leave stage directions, the bar itself sets atmosphere with beats every round, and a heat meter tracks how combative the room has become.

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
| `python generate_portraits.py` | Generate DALL-E 3 portraits for all characters → `portraits/` |
| `python generate_portraits.py Newton Einstein` | Generate specific characters (partial name match) |
| `python generate_portraits.py --overwrite` | Regenerate even if image already exists |

**Redirect debug output to a file:**

```bash
python main.py --debug 2>debug.log
python main.py --ui --debug 2>debug.log
```

> **Windows note:** open `debug.log` in VS Code rather than Notepad — PowerShell's `2>` redirect writes UTF-16 which some editors misread.

## Bar UI controls

At the steer break, a modal opens automatically. From there:
- Type a message to inject it into the debate
- Select a moderator style from the radio list
- Click **Steer** (or press Enter) to submit
- Click **Quit** to exit

| Input | Effect |
|---|---|
| Empty steer modal → Submit | Moderator generates an intervention in the current style |
| Text in steer modal → Submit | Your message is injected as the next turn's prompt |
| Name a participant in your message | That character is forced to respond next (bypasses scorer) |
| Style number in CLI (1–8) | Switches moderator style then fires a steer |
| Quit button (header or modal) | Exit the game |
| `Ctrl+C` | Exit |

## In-game commands (CLI only)

Type these at the input prompt:

| Command | Effect |
|---|---|
| `!quit` / `!exit` | Exit the game |
| `!debug` | Toggle all debug output on/off |
| `!debug <channel>` | Toggle a single channel (e.g. `!debug state`) |
| `!debug status` | Show on/off state of all channels |
| `!help` | List available commands |

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

- Every `N × 2` philosopher turns → **steer break**: graph pauses, steer modal opens, consensus check runs

For 2 participants: break at turns 4, 8, 12, 16 …  
For 4 participants: break at turns 8, 16, 24, 32 …

The debate ends after 24 philosopher turns if no consensus is reached.

### Who speaks next

Each turn, all participants except the last speaker are eligible. Their `hot_topics` field is scored against the last message by word overlap — whoever's obsessions were most triggered gets to speak. If the top two scores are tied, both generate responses and a selector LLM picks the more dramatically compelling one. Otherwise only the top scorer generates.

Ping-pong detection watches the last 6 speakers: if two people have dominated ≥4 of the last 6 turns, the selector is warned to prefer a fresh voice.

If the player's message names a participant (any word > 3 chars matching a participant's name), that character is forced to respond next, bypassing the scorer entirely.

### Variable response length

Response length adapts to context:
- If the last message is ≤ 30 chars — rapid-fire mode: one punchy sentence
- Each persona has a `verbosity` field (`terse` / `normal` / `expansive`) that biases length independently of context
- After history compression, the character arc summary further calibrates length to their current standing in the debate

### Backchannel reactions

After each main philosopher turn, there is a 50% chance a non-speaking participant drops a short backchannel interjection (1 line). These do not count as a full turn, do not affect speaker scoring, and are rendered dim and italic in both UIs. They use the name suffix `_bc` internally.

### Stage directions

Characters occasionally include brief stage directions in their responses: `*[sets down glass]*`, `*[laughs]*`, `*[long pause]*`. These render as dim brown italic text. The bar itself emits an atmosphere beat (e.g. *someone orders another round*) in dark amber after each completed batch.

### Heat / mood state

A `heat` value (0–10) tracks the emotional temperature of the room:
- **+1** when a philosopher's response contains combative language or exclamation marks
- **−1** when a philosopher concedes a point
- Clamped to [0, 10]

Heat effects:
- Injected into each philosopher's system prompt as a room description ("the room is calm" → "the room is volatile")
- At heat ≥ 6, characters are instructed to land a pointed personal jab, not just argue ideas
- The moderator steer receives heat context and adjusts its tone
- The UI right pane shows a `█`/`░` bar color-coded by level (green → yellow → red)

### Topic drift

The consensus checker watches for the conversation drifting from the original topic. If drift is detected, a notice is shown before the steer modal so the player can decide whether to pursue the new thread or steer back.

### Callbacks

Each character's oldest logged claim (from `argument_log`) is fed back into their own prompt as a quote of their earlier words. This enables self-reference and lets opponents pin characters on prior statements.

### What goes into each philosopher's prompt

**System prompt:**
- Character identity: era, known_for, core beliefs, rhetorical style
- Room heat description and jab instruction (if heat ≥ 6)
- Early debate: also includes `cite_these` and `hot_topics`
- Established debate (after first compression): replaced by a first-person debate arc summary
- If partial agreements exist: coalition context is injected

**User prompt:**
- The central question
- The last 3 claims this character has made (no-repeat guard)
- A callback quote of their oldest logged claim
- The last thing said (skipping backchannel messages), with instruction to engage with it specifically
- If zero concessions after turn 8: a nudge to find merit in what was just said

### Concession tracking

After each philosopher turn, the winning response is scanned for concession language: *perhaps, i grant, you raise, i admit, that is fair, fair point, i concede, you are right, granted, i acknowledge, true enough, well said, you make a point, i'll grant, i cannot deny.* Hits increment that character's concession count in state.

1. Prompt pressure: zero concessions past turn 8 → nudge to find merit in opponent's argument
2. Moderator targeting: the most entrenched participant (fewest concessions) is named in the steer

### Moderator steer

At each steer break, submitting empty text (or selecting a style) triggers a `gpt-4o-mini` call generating a 1–2 sentence intervention. The moderator receives the topic, recent transcript, all agreements and tensions, heat context, and a targeting instruction naming the most entrenched participant.

8 styles switchable at any break:

| Style | Approach |
|---|---|
| **Socratic** | Builds bridges, seeks common ground, extends partial agreements |
| **Combative** | Exposes contradictions, demands concessions, asks what it would cost to be wrong |
| **Devil's Advocate** | Attacks whatever position is gaining momentum to stress-test it |
| **Koan** | Throws an oblique, unanswerable question at the most confident participant |
| **Journalist** | Demands one concrete sentence — no metaphor, no abstraction, no history |
| **Straw Man** | Misrepresents a position to force the speaker to clarify and sharpen it |
| **Steel Man** | Forces a participant to argue their opponent's case at its strongest before replying |
| **Last Call** | All-out push for consensus — names every sliver of agreement and forces commitment or explanation |

### Consensus checker

At every steer break, the last 12 messages are sent to `gpt-4o` with a structured output schema. The model returns:

- `full_consensus` — whether the entire group genuinely agrees
- `points_of_agreement` — things **all** participants agree on (strict: no partial counts)
- `partial_agreements` — subsets of 2+ participants converging on something
- `remaining_disagreements` — open tensions, each with the two opposing participants and their actual stances
- `drifted_topic` — non-empty string if the conversation has wandered from the original topic

Partial agreements are fed back into each philosopher's system prompt so characters are aware of forming coalitions and who they should challenge.

### History compression

Once the message history exceeds 14 entries, older messages are compressed by `gpt-4o` into a 150–250 word third-person summary. The 6 most recent messages are always kept verbatim.

At the same time, a first-person debate arc is generated for each participant in parallel using `gpt-4o-mini` — 60–80 words covering what they've argued, conceded, and are currently defending. This replaces `cite_these` and `hot_topics` in their system prompt for the rest of the debate.

### Models

| Node | Model |
|---|---|
| Philosopher (candidate generation) | `gpt-4o-mini` |
| Selector (when scores tie) | `gpt-4o-mini` |
| Backchannel reactions | `gpt-4o-mini` |
| Moderator steer | `gpt-4o-mini` |
| Character arc summaries | `gpt-4o-mini` |
| Consensus checker | `gpt-4o` |
| History summarizer | `gpt-4o` |
| Portrait generation | DALL-E 3 |

> **API costs:** with 4 participants, each steer cycle (8 turns) makes ~8 philosopher calls + possible backchannel calls + 1 moderator call + 1 consensus check. The biggest single cost lever is reducing participants from 4 to 2.

## Architecture

```
main.py               Entry point — CLI game loop or launches bar UI
ui.py                 Textual bar UI (setup screen + three-panel debate view)
graph.py              LangGraph StateGraph builder
nodes.py              All node functions, prompt builders, steer generator
state.py              RoomState TypedDict
personas.py           Character definitions
debug.py              Per-channel debug logging to stderr
generate_portraits.py Standalone CLI — DALL-E 3 portrait generator
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

`dynamics` keys only have effect when that character is in the same room. `verbosity` biases response length: `terse` characters favour one-liners, `expansive` characters develop arguments at length.

## Requirements

- Python 3.11+
- OpenAI API key with access to `gpt-4o`, `gpt-4o-mini`, and `dall-e-3`

---

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

### 2. Steer modal (UI)

**What to verify:** modal opens, accepts input, dismisses correctly, updates style.

1. Run `--ui`. Let the debate reach turn 4.
2. Confirm the `SteerModal` opens automatically over the debate view (background should still be partially visible).
3. Enter text in the input field → click **Steer** → confirm your text appears in the conversation as a `[You]` message and the debate continues.
4. On the next steer break, select a different style from the radio list → click **Steer** without text → confirm the moderator generates a steer and the right pane style indicator updates.
5. On the next steer break, click **Quit** → confirm the app exits cleanly.

**Pass:** modal opens every steer break, user text and style selection both take effect, quit works.

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

**Pass:** at least 1 backchannel appears within 8 turns (50% chance per turn, so expect ~4). Bacchannels are visually distinct (dim, italic, no speaker header box in UI).

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
5. Confirm the heat bar colour changes (green at low, yellow at mid, red at high).

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

### 16. Portrait generation

**What to verify:** `generate_portraits.py` creates images correctly.

1. Run `python generate_portraits.py Newton` — confirm `portraits/Isaac_Newton.png` is created.
2. Run again without `--overwrite` — confirm "already exists, skipping" is printed and no API call is made.
3. Run `python generate_portraits.py Newton --overwrite` — confirm a new image is generated.
4. Run `python generate_portraits.py Xyz` — confirm "No match for 'Xyz'" is printed and no crash occurs.

**Pass:** images created, skip logic works, overwrite flag works, bad name handled gracefully.

---

### 17. Quit / exit paths

**What to verify:** all exit paths work cleanly without errors.

1. **UI quit button (header):** click the Quit button in the top-right of the bar — app exits.
2. **UI quit button (modal):** at a steer break, click Quit in the modal — app exits.
3. **CLI `!quit`:** type `!quit` at the steer prompt — exits with farewell message.
4. **Ctrl+C:** press Ctrl+C mid-debate — exits cleanly.
5. **New topic then quit:** reach consensus, start a new topic, then quit — no crash.

**Pass:** all five paths exit without Python tracebacks or LangSmith thread errors.
