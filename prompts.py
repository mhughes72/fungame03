from personas import CHARACTERS


_CONCESSION_SIGNALS = {
    "perhaps", "i grant", "you raise", "i admit", "that is fair", "fair point",
    "i concede", "you are right", "granted", "i acknowledge", "true enough",
    "well said", "you make a point", "i'll grant", "i cannot deny",
}

_COMBATIVE_SIGNALS = {
    "wrong", "absurd", "nonsense", "false", "ridiculous", "contradiction",
    "mistaken", "naive", "foolish", "preposterous", "you fail", "precisely wrong",
    "you have not", "you cannot", "that is not", "that is simply",
}

_CONCESSION_THRESHOLD = 8   # turns before no-concession pressure kicks in
_BACKCHANNEL_CHANCE   = 0.5


def _heat_description(heat: int) -> str:
    if heat <= 2:
        return "The room is cool — the debate is measured and exploratory."
    elif heat <= 4:
        return "The room is warm — positions are being staked."
    elif heat <= 6:
        return "The room is charged — disagreement runs deep."
    elif heat <= 8:
        return "The room is heated — tempers are close to the surface."
    else:
        return "The room is at flashpoint — the argument has become personal."


def _philosopher_system_prompt(
    name: str,
    participants: list[str],
    partial_agreements: list[dict],
    own_summary: str = "",
    heat: int = 0,
) -> str:
    char = CHARACTERS[name]

    coalition_section = ""
    if partial_agreements:
        allied, opposing = [], []
        for a in partial_agreements:
            if name in a["participants"]:
                others = [p for p in a["participants"] if p != name]
                allied.append(f"  - You and {', '.join(others)} are converging on: {a['on']}")
            else:
                allied_names = " and ".join(a["participants"])
                opposing.append(f"  - {allied_names} are converging on: {a['on']}")
        if allied:
            coalition_section += (
                f"\n\nYou are part of an emerging alignment:\n" + "\n".join(allied) + "\n"
                "When relevant, deepen this common ground and try to bring others around to it."
            )
        if opposing:
            coalition_section += (
                f"\n\nOther participants are forming a coalition you are NOT part of:\n"
                + "\n".join(opposing) + "\n"
                "Challenge this alliance — find the flaw in their shared position or drive a wedge."
            )

    # Once a character has an established debate arc, drop the verbose reference
    # sections — voice and obsessions are already evident in what they've said.
    if own_summary:
        reference_sections = (
            f"Core beliefs:\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"\nYour debate arc so far (first person):\n{own_summary}\n"
        )
    else:
        reference_sections = (
            f"Core beliefs:\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"Works and ideas you may draw from:\n{char['cite_these']}\n\n"
            f"What fires you up:\n{char['hot_topics']}\n"
        )

    heat_line = f"\nAtmosphere: {_heat_description(heat)}\n" if heat > 0 else ""
    jab_line = (
        "\n- The room is tense. A sharp personal jab is fair game — their manner, "
        "their contradiction, their record. Make it pointed.\n"
        if heat >= 6 else ""
    )

    return (
        f"You are {name} ({char['era']}).\n\n"
        f"Known for: {char['known_for']}\n\n"
        f"{reference_sections}"
        f"{coalition_section}"
        f"{heat_line}\n"
        "You are seated in a room with these specific thinkers, engaging in open discussion.\n"
        "Rules:\n"
        "- Stay completely in character. Do not break the fourth wall or mention being an AI.\n"
        "- Keep your response to 2–3 sentences. Be sharp, not exhaustive.\n"
        "- Address ONE person or ONE idea per turn — do not survey the whole room.\n"
        "- NEVER restate a point you have already made. The conversation must move forward.\n"
        "- Engage with the specific argument just made — not the topic in general.\n"
        "- Stay anchored to the central question. Sub-arguments must serve as evidence toward it — not replace it.\n"
        "- Do not assume the answer to the question. If the topic is a question, treat it as genuinely open.\n"
        "- Deploy your signature rhetorical style every response, not just occasionally.\n"
        "- When someone touches your hot topics, let your conviction show.\n"
        "- Use your cited works naturally, as a thinker would — not as a list.\n"
        "- Occasionally — not every turn — include a brief stage direction in the format *[action]* "
        "e.g. *[laughs]*, *[sets down glass]*, *[long pause]*. Only when it feels natural for the setting."
        f"{jab_line}"
    )


# Situation × verbosity → length instruction. Situation is determined by the last
# message's word count and tone; verbosity comes from the speaker's persona definition.
_LENGTH_INSTRUCTIONS: dict[tuple[str, str], str] = {
    ("question_short", "terse"):     "LENGTH: Pointed question — answer in 1 short sentence. Blunt and direct. No qualifications.",
    ("question_short", "normal"):    "LENGTH: Pointed question — answer in 1 short sentence. Blunt and direct. No qualifications.",
    ("question_short", "expansive"): "LENGTH: Pointed question — answer in 1 short sentence. Blunt and direct. No qualifications.",
    ("short",    "terse"):     "LENGTH: 1 sentence. Match the energy.",
    ("short",    "normal"):    "LENGTH: Short provocation — match the energy. 1 to 2 short sentences maximum.",
    ("short",    "expansive"): "LENGTH: Short provocation — match the energy. 1 to 2 short sentences maximum.",
    ("long",     "terse"):     "LENGTH: A substantial argument was made. Respond in 2 to 3 sentences — be precise.",
    ("long",     "normal"):    "LENGTH: A substantial argument was made. Respond fully — 3 to 4 sentences.",
    ("long",     "expansive"): "LENGTH: A substantial argument was made. Match the depth — 4 to 5 sentences.",
    ("rapid",    "terse"):     "LENGTH: The room has been trading short jabs. Step back and develop your argument — 3 to 4 sentences.",
    ("rapid",    "normal"):    "LENGTH: The room has been trading short jabs. Step back and develop your argument — 3 to 4 sentences.",
    ("rapid",    "expansive"): "LENGTH: The room has been trading short jabs. Step back and develop your argument — 3 to 4 sentences.",
    ("normal",   "terse"):     "LENGTH: 1 to 2 sentences. Stay sharp.",
    ("normal",   "normal"):    "LENGTH: 2 to 3 sentences.",
    ("normal",   "expansive"): "LENGTH: 3 to 4 sentences. Build the argument properly.",
    ("opening",  "terse"):     "LENGTH: Open with a clear position — 1 to 2 sentences.",
    ("opening",  "normal"):    "LENGTH: Open with a clear position — 2 to 3 sentences.",
    ("opening",  "expansive"): "LENGTH: Open with a clear position — 3 to 4 sentences.",
}


def _philosopher_user_prompt(
    name: str,
    history: list,
    topic: str,
    argument_log: dict | None = None,
    turn_count: int = 0,
    concession_counts: dict | None = None,
) -> str:
    safe_name = name.replace(" ", "_")

    # Skip backchannel asides when deciding what to respond to
    last_msg = None
    for m in reversed(history):
        if hasattr(m, "name") and (m.name or "").endswith("_bc"):
            continue
        last_msg = m
        break

    verbosity = CHARACTERS[name].get("verbosity", "normal")

    # Detect rapid-fire cadence: last 3+ messages all under 40 words
    recent_msgs = [m for m in history[-4:] if hasattr(m, "content")]
    rapid_fire = (
        len(recent_msgs) >= 3
        and all(len(m.content.split()) < 40 for m in recent_msgs)
        and verbosity != "terse"
    )

    if last_msg and hasattr(last_msg, "content") and last_msg.name != safe_name:
        last_speaker = (last_msg.name or "Someone").replace("_", " ")
        last_said = last_msg.content[:300]
        respond_to = (
            f'{last_speaker} just said: "{last_said}"\n\n'
            f"Respond directly to THIS argument. Do not restate your own position — "
            f"engage with what {last_speaker} specifically argued."
        )
        last_content = last_msg.content.strip()
        word_count = len(last_content.split())
        is_question = last_content.endswith("?") or last_content.count("?") >= 2
        situation = (
            "question_short" if is_question and word_count < 30
            else "short"     if word_count < 30
            else "long"      if word_count > 120
            else "rapid"     if rapid_fire
            else "normal"
        )
    else:
        respond_to = "It is your turn to open or advance the debate."
        situation = "opening"

    length_instruction = _LENGTH_INSTRUCTIONS[situation, verbosity]

    past_claims = (argument_log or {}).get(name, [])
    if past_claims:
        formatted = "\n".join(
            f'  - "{c[:150]}{"…" if len(c) > 150 else ""}"' for c in past_claims
        )
        no_repeat = f"\nArguments you have already made — do NOT repeat these, build further or shift ground:\n{formatted}\n"
    else:
        no_repeat = ""

    concession_pressure = ""
    if turn_count >= _CONCESSION_THRESHOLD and (concession_counts or {}).get(name, 0) == 0:
        concession_pressure = (
            "\nYou have not acknowledged any merit in your opponents' arguments. "
            "A confident thinker can grant a point without losing the debate — "
            "find something true in what was just said.\n"
        )

    callback_lines = []
    for other, claims in (argument_log or {}).items():
        if other == name or not claims:
            continue
        oldest = claims[0]
        callback_lines.append(f'  {other}: "{oldest[:150]}{"…" if len(oldest) > 150 else ""}"')
    callbacks = (
        "Earlier on record — pin them to these if it serves your argument:\n"
        + "\n".join(callback_lines) + "\n\n"
        if callback_lines else ""
    )

    return (
        f'Central question being debated: "{topic}"\n\n'
        f"{no_repeat}"
        f"{callbacks}"
        f"{concession_pressure}"
        f"{respond_to}\n\n"
        f'Ensure your response connects back to the central question: "{topic}". '
        f"Do not assume the answer — engage with whether it is true.\n\n"
        f"IMPORTANT — {length_instruction}"
    )
