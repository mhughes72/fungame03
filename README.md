# The Philosopher's Bar

A game where 2–4 historical figures debate a topic. Built with LangGraph and OpenAI.

Each turn, candidates are scored by keyword overlap with the last message. The top scorer speaks. A consensus checker runs periodically to detect agreements and tensions.

## Setup

```bash
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```
OPENAI_API_KEY=your_key_here
```

## Running

**CLI** — plain terminal, no dependencies beyond Python:
```bash
python main.py
```

**Desktop UI** — rich Textual interface with sidebar, heat bar, and steer modal:
```bash
python main.py --ui
```

**Web server** — browser-based version, serves the frontend at `http://localhost:8000`:
```bash
python run_server.py
```

Add `--debug` to CLI or desktop mode to stream internal reasoning to stderr:
```bash
python main.py --debug
python main.py --ui --debug
```

## Characters

23 characters available including Socrates, Nietzsche, Marx, Lincoln, Tesla, Einstein, Feynman, and more. Select 2–4 per debate.

## Moderator styles

8 styles switchable at every steer break: `socratic`, `combative`, `devil's advocate`, `koan`, `journalist`, `straw man`, `steel man`, `last call`.
