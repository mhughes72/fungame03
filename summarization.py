from concurrent.futures import ThreadPoolExecutor, as_completed

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from state import RoomState
import debug as dbg


_SUMMARIZE_AFTER = 14   # summarize sooner to keep context lean
_KEEP_RECENT     = 6


def _structured_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.1)

def _chat_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0.85)


def summarize_history(messages: list, topic: str) -> list:
    """Compress old messages into a summary, keeping the most recent ones intact."""
    if len(messages) <= _SUMMARIZE_AFTER:
        return messages

    to_summarize = messages[:-_KEEP_RECENT]
    to_keep      = messages[-_KEEP_RECENT:]

    transcript = "\n\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in to_summarize
        if hasattr(m, "content")
    )

    dbg.dlog("STATE", f"Summarizing {len(to_summarize)} messages → 1 summary block")

    response = _structured_llm().invoke([
        SystemMessage(content="You summarize philosophical debates concisely and accurately."),
        HumanMessage(content=(
            f'Topic: "{topic}"\n\n'
            f"Summarize the debate below. Preserve:\n"
            f"- Each participant's key arguments and how they evolved\n"
            f"- Important moments of agreement, conflict, or shift\n"
            f"- Any notable formulations or turning points\n"
            f"Write in third person, 150–250 words.\n\n"
            f"Transcript:\n{transcript}"
        )),
    ])

    summary_msg = SystemMessage(
        content=(
            f"[DEBATE SUMMARY — {len(to_summarize)} earlier messages]\n\n"
            f"{response.content}"
        )
    )

    dbg.dlog("STATE", "Summary produced", response.content[:200])

    return [summary_msg] + list(to_keep)


def generate_character_summaries(state: RoomState) -> dict:
    """Generate a first-person debate arc summary for each participant, in parallel."""
    participants = state["participants"]
    topic        = state["topic"]
    messages     = state["messages"]

    transcript = "\n\n".join(
        f"{(m.name or 'User').replace('_', ' ')}: {m.content}"
        for m in messages
        if hasattr(m, "content") and not m.content.startswith("[DEBATE SUMMARY")
    )

    def _summarize_for(name: str) -> tuple[str, str]:
        prompt = (
            f'Topic: "{topic}"\n\n'
            f"Transcript:\n{transcript}\n\n"
            f"Write a concise first-person summary for {name} covering:\n"
            f"- The main arguments you have made and how they evolved\n"
            f"- Any positions you have shifted, qualified, or conceded — be specific\n"
            f"- If a compelling argument or piece of evidence has genuinely challenged one of your "
            f"starting positions, say so explicitly in first person (e.g. 'I find I can no longer "
            f"dismiss...', 'I have begun to suspect...', 'The argument from X has forced me to "
            f"reconsider...'). A great mind updates; do not paper over real movement.\n"
            f"- What you are currently defending\n"
            f"- Key tensions you still face from other participants\n\n"
            f"Write as {name} reflecting honestly on their own participation. 60–80 words."
        )
        response = _chat_llm().invoke([
            SystemMessage(content="You write concise first-person debate summaries in the voice of historical figures."),
            HumanMessage(content=prompt),
        ])
        return name, response.content.strip()

    dbg.dlog("STATE", f"Generating per-character summaries for {participants}")

    with ThreadPoolExecutor(max_workers=len(participants)) as executor:
        futures = [executor.submit(_summarize_for, name) for name in participants]
        results = dict(f.result() for f in as_completed(futures))

    dbg.dlog("STATE", "Character summaries generated", {k: v[:80] for k, v in results.items()})
    return results
