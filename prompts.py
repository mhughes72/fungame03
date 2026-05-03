from personas import CHARACTERS


_CONCESSION_THRESHOLD = 8   # turns before no-concession pressure kicks in
_BACKCHANNEL_CHANCE   = 0.5

# Audience level instructions injected near the TOP of philosopher and moderator prompts.
# Edit these freely — keys must match the values sent from the frontend/CLI.
# None = no injection (full academic register, current default).
# Display names for audience levels — keep keys in sync with AUDIENCE_LEVELS below.
# This is the single source of truth for level keys and human-readable labels.
AUDIENCE_LEVEL_NAMES: dict[str, str] = {
    "grade5":     "Grade 5",
    "highschool": "High School",
    "university": "University",
    "expert":     "Expert",
}

AUDIENCE_LEVELS: dict[str, str | None] = {
    "grade5": (
        "⚠ AUDIENCE CONSTRAINT — THIS OVERRIDES YOUR DEFAULT SPEAKING REGISTER.\n"
        "You are speaking to a curious 10-year-old. This is non-negotiable.\n"
        "Rules for language:\n"
        "- No jargon, no academic terms, no Latin phrases — ever.\n"
        '  Translate before you speak: "class struggle" → "some people have much less than others and that feels unfair"; '
        '"collectivism" → "working together as a group"; '
        '"dialectic" → "arguing back and forth to find the truth"; '
        '"individualism" → "believing each person should live by their own rules".\n'
        "- Short sentences. One idea per sentence. Use words a 10-year-old would know.\n"
        "- Use everyday analogies: food, school, sport, games, playground, weather.\n"
        "- You must still argue passionately and stay completely in character — just speak plainly.\n"
    ),
    "highschool": (
        "⚠ AUDIENCE CONSTRAINT — THIS OVERRIDES YOUR DEFAULT SPEAKING REGISTER.\n"
        "You are speaking to a smart teenager. Rules for language:\n"
        "- Technical terms are allowed only if you immediately explain them in plain words in the same sentence.\n"
        "- No dense academic prose. Clear, direct sentences.\n"
        "- Use real-world examples — current events, sports, pop culture — over abstract theory.\n"
        "- No Latin phrases without translation. Stay forceful and in character.\n"
    ),
    "university": (
        "AUDIENCE: You are speaking to an educated adult familiar with key ideas in your field. "
        "Use field-specific vocabulary freely. No constraint on register."
    ),
    "expert": None,  # no instruction injected — full register, current default behaviour
}


def _heat_description(heat: int) -> str:
    if heat <= 4:
        return "The room is warm — positions are being staked."
    elif heat <= 6:
        return "The room is charged — disagreement runs deep."
    elif heat <= 8:
        return "The room is heated — tempers are close to the surface."
    else:
        return "The room is at flashpoint — the argument has become personal."


def _openness_line(openness: int) -> str:
    if openness >= 8:
        return (
            "Intellectual honesty: You update your position when shown strong evidence or a logically "
            "airtight argument. You would rather be right than consistent.\n"
        )
    elif openness >= 5:
        return (
            "Intellectual honesty: You are open to updating your position, but require concrete evidence "
            "or a flaw you cannot answer. Genuine proof moves you; mere pressure does not.\n"
        )
    elif openness >= 3:
        return (
            "Intellectual honesty: You are deeply committed to your framework. You might grant a narrow "
            "point while holding your broader position — but it takes real weight to move you.\n"
        )
    else:
        return (
            "Intellectual honesty: You almost never concede. You reframe opposition as error, not as data. "
            "Only a devastating logical contradiction with no escape route gives you pause.\n"
        )


def _drunk_line(drunk_level: int) -> str:
    if drunk_level <= 0:
        return ""
    elif drunk_level == 1:
        return (
            "\n⚠ OVERRIDE — YOU HAVE HAD ONE DRINK. This overrides your normal style rules.\n"
            "Your filter is loose. Say something you'd normally hold back. "
            "Be a little too emphatic — lean on your key point harder than the argument needs. "
            "Include one *[stage direction]* like *[swirls glass]* or *[leans forward]*.\n\n"
        )
    elif drunk_level == 2:
        return (
            "\n⚠ OVERRIDE — YOU HAVE HAD TWO DRINKS. This overrides your normal style rules.\n"
            "You are tipsy. Say the quiet part loud. "
            "Hammer your conviction harder than the argument warrants. "
            "Trail off mid-sentence with an em-dash — then recover and finish the thought differently. "
            "Include a *[stage direction]* like *[takes a long sip]* or *[points unsteadily]*.\n\n"
        )
    elif drunk_level == 3:
        return (
            "\n⚠ OVERRIDE — YOU ARE DRUNK. This overrides your normal style rules.\n"
            "Your thoughts loop. Slur a word or two in the actual text (e.g. 'thish', 'exshactly'). "
            "Circle back to the same point twice as if you haven't said it yet. "
            "You are louder than you mean to be — USE CAPS once for emphasis. "
            "Stage direction like *[grips the table]* or *[gestures too broadly]* is required.\n\n"
        )
    else:
        return (
            "\n⚠ OVERRIDE — YOU ARE VERY DRUNK. This completely overrides your normal style rules.\n"
            "Barely coherent. Slur words visibly (e.g. 'lissen', 'absho-lutely', 'thash the thing'). "
            "Your deepest obsession spills out in sentence fragments. "
            "Go on a tangent — lose the thread — slam back to your point. "
            "One sentence maximum. A *[stage direction]* showing physical unsteadiness is required.\n\n"
        )


def _philosopher_system_prompt(
    name: str,
    participants: list[str],
    partial_agreements: list[dict],
    own_summary: str = "",
    heat: int = 0,
    evidence_this_turn: str = "",
    diagrams_enabled: bool = False,
    audience_level: str = "university",
) -> str:
    char = CHARACTERS[name]

    coalition_section = ""
    if partial_agreements:
        allied, opposing = [], []
        alliance_tensions = []
        for a in partial_agreements:
            if name in a["participants"]:
                others = [p for p in a["participants"] if p != name]
                allied.append(f"  - You and {', '.join(others)} are converging on: {a['on']}")
                # Surface the social tension of unexpected alliances using dynamics data
                my_dynamics = char.get("dynamics", {})
                for ally in others:
                    rel = my_dynamics.get(ally, "")
                    if rel:
                        rel_snippet = rel.strip()[:200] + ("…" if len(rel.strip()) > 200 else "")
                        alliance_tensions.append(
                            f"  - Your view of {ally}: \"{rel_snippet}\"\n"
                            f"    Yet here you are finding common ground. Let that tension show — "
                            f"acknowledge the surprise, express cautious respect, or note what still divides you."
                        )
                    else:
                        alliance_tensions.append(
                            f"  - You are aligning with {ally} on this point. "
                            f"If that feels unexpected or uneasy, name it — don't paper over the tension."
                        )
            else:
                allied_names = " and ".join(a["participants"])
                opposing.append(f"  - {allied_names} are converging on: {a['on']}")
        if allied:
            coalition_section += (
                f"\n\nYou are part of an emerging alignment:\n" + "\n".join(allied) + "\n"
                "When relevant, deepen this common ground and try to bring others around to it."
            )
        if alliance_tensions:
            coalition_section += (
                f"\n\nSocial texture of these alliances:\n" + "\n".join(alliance_tensions) + "\n"
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
            f"Core beliefs (your historical starting point):\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"\nYour debate arc so far (first person):\n{own_summary}\n\n"
            f"Important: where your arc records that you have shifted, qualified, or reconsidered "
            f"a position during this debate, let the arc take precedence over your starting beliefs. "
            f"Do not retreat to your historical defaults if this conversation has moved you.\n"
        )
    else:
        reference_sections = (
            f"Core beliefs:\n{char['core_beliefs']}\n\n"
            f"How you speak and argue:\n{char['rhetorical_moves']}\n\n"
            f"Works and ideas you may draw from:\n{char['cite_these']}\n\n"
            f"What fires you up:\n{char['hot_topics']}\n"
        )

    if heat <= 2:
        heat_line = ""
        jab_line  = ""
    elif heat <= 4:
        heat_line = f"\nAtmosphere: {_heat_description(heat)}\n"
        jab_line  = "\n- Positions are hardening. Be assertive — state your view directly without hedging.\n"
    elif heat <= 6:
        heat_line = f"\nAtmosphere: {_heat_description(heat)}\n"
        jab_line  = (
            "\n- Don't soften your position. Push back directly and name the specific flaw in what was just said.\n"
            "- If the moment demands it, cut in before the other person finishes — end your response mid-sentence with an em-dash (—) to show you can't wait.\n"
        )
    elif heat <= 8:
        heat_line = f"\nAtmosphere: {_heat_description(heat)}\n"
        jab_line  = (
            "\n- Land a pointed challenge. Name the contradiction in their position or their record. Don't let them off the hook.\n"
            "- You may cut in mid-thought — end your response with an em-dash (—) if your conviction overtakes your sentence.\n"
        )
    else:
        heat_line = f"\nAtmosphere: {_heat_description(heat)}\n"
        jab_line  = (
            "\n- The room is at flashpoint. A sharp personal jab is fair game — their manner, their contradiction, their record. Make it pointed.\n"
            "- Interrupting is expected at this heat. End mid-sentence with an em-dash (—) if you can't hold back.\n"
        )

    openness = char.get("openness", 5)
    intellectual_honesty = _openness_line(openness)
    what_would_change = char.get("what_would_change_mind", "")
    change_line = f"What would genuinely change your mind: {what_would_change}\n" if what_would_change else ""

    evidence_line = (
        f"\n[EMPIRICAL EVIDENCE HAS JUST BEEN INTRODUCED]: {evidence_this_turn}\n"
        "You must engage with this finding directly in your response. You cannot dismiss or ignore it outright. "
        "You may reframe it through your worldview, question its scope or methodology, or accept it and update "
        "your position — but you must address it.\n"
    ) if evidence_this_turn else ""

    audience_block = AUDIENCE_LEVELS.get(audience_level)
    audience_line = f"\n{audience_block}\n" if audience_block else ""

    return (
        f"You are {name} ({char['era']}).\n\n"
        f"Known for: {char['known_for']}\n"
        f"{audience_line}\n"
        f"{reference_sections}"
        f"{intellectual_honesty}"
        f"{change_line}"
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
        "- Updating your view when shown compelling logic or evidence is intellectual strength — do not defend a position you have already been forced to abandon.\n"
        "- Occasionally — not every turn — you may add a brief physical stage direction in the format *[action]* "
        "e.g. *[laughs]*, *[sets down glass]*, *[long pause]*. Stage directions are 2–4 word physical actions only. "
        "IMPORTANT: Never begin or end your response with a bracket. Never wrap your entire speech in [brackets]. "
        "Your spoken words are plain text. Brackets with asterisks like *[laughs]* are only for brief physical asides embedded mid-speech."
        f"{jab_line}"
        f"{evidence_line}"
        + (
            "\n- When you reference a specific diagram, illustration, or named equation that you "
            "would physically hold up or sketch — place this marker on its own line anywhere in "
            "your response: [DIAGRAM: Wikipedia article title]. Use a real Wikipedia article title. "
            "The title must name a specific diagram, model, or experiment — not a general concept. "
            "Good examples: 'Bohr model', 'Feynman diagram', 'Photoelectric effect', 'Natural selection', "
            "'Double-slit experiment', 'Krebs cycle', 'Geodesic'. "
            "Bad examples: 'Photon', 'Quantum mechanics', 'Energy', 'Evolution' — these are concept "
            "articles whose lead images are unpredictable. "
            "Use it when the image is your evidence — not for abstract concepts or passing mentions. "
            "When you include the marker, also gesture at the diagram in plain spoken text (not in "
            "brackets) — e.g. 'as this diagram shows,' or 'consider this illustration —' woven "
            "naturally into your sentence. The article title should specifically illustrate the "
            "claim you are making right now, not your broader worldview."
            if diagrams_enabled else ""
        )
    )


# Global length overrides — set via philosopher_length in state (local testing only).
# "normal" means no override; use the situation×verbosity table as usual.
_LENGTH_OVERRIDES: dict[str, str] = {
    "punchy":         "LENGTH: ONE sentence only. Maximum 20 words. No qualifications, no elaboration — land the point and stop.",
    "conversational": "LENGTH: 3–4 sentences. Develop one idea clearly.",
    "expansive":      "LENGTH: A full paragraph (5–8 sentences). Make multiple connected points.",
}

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
    ("opening",   "terse"):     "LENGTH: Open with a clear position — 1 to 2 sentences.",
    ("opening",   "normal"):    "LENGTH: Open with a clear position — 2 to 3 sentences.",
    ("opening",   "expansive"): "LENGTH: Open with a clear position — 3 to 4 sentences.",
    ("rebuttal",  "terse"):     "LENGTH: A sharp, focused rebuttal — 2 to 3 sentences. Name the claim, then kill it.",
    ("rebuttal",  "normal"):    "LENGTH: A focused rebuttal — 3 to 4 sentences. Name the claim, explain the flaw, land the counter.",
    ("rebuttal",  "expansive"): "LENGTH: A thorough rebuttal — 4 to 5 sentences. Name the claim, dissect the flaw in detail, and close with your alternative.",
}


def _drunk_opponents_line(name: str, drunk_levels: dict) -> str:
    """Describe the observable drunk state of opponents so the speaker can react."""
    lines = []
    for other, level in drunk_levels.items():
        if other == name or level <= 0:
            continue
        display = other.replace("_", " ")
        if level == 1:
            desc = f"{display} has had a drink — looser than usual, a little too emphatic."
        elif level == 2:
            desc = f"{display} is visibly tipsy — arguments getting sloppy, saying more than they should."
        elif level == 3:
            desc = f"{display} is drunk — slurring, looping, and louder than they realise."
        else:
            desc = f"{display} is very drunk — barely coherent, held together by ego alone."
        lines.append(f"  - {desc}")
    if not lines:
        return ""
    return (
        "\nYou can observe that some at the table have been drinking:\n"
        + "\n".join(lines)
        + "\nFeel free to react to this — exploit it, mock it, express concern, or ignore it as beneath you. "
        "Do not narrate it mechanically; let it colour how you engage with them.\n"
    )


def _philosopher_user_prompt(
    name: str,
    history: list,
    topic: str,
    argument_log: dict | None = None,
    turn_count: int = 0,
    concession_counts: dict | None = None,
    concession_log: dict | None = None,
    challenge_counts: dict | None = None,
    drunk_level: int = 0,
    drunk_levels: dict | None = None,
    philosopher_length: str = "normal",
    phase_instruction: str = "",
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

    # Opening statements in structured formats must be independent — don't anchor to the last speaker
    if phase_instruction and phase_instruction.startswith("This is your opening statement"):
        respond_to = "Address the room directly. Do not respond to any prior speaker — present your own case."
        situation  = "opening"
    elif phase_instruction and phase_instruction.startswith("This is your rebuttal"):
        respond_to = "Target the specific opening argument quoted above. Ignore what the floor has said since — your job is to dismantle that original claim."
        situation  = "rebuttal"
    elif last_msg and hasattr(last_msg, "content") and last_msg.name != safe_name:
        last_speaker = (last_msg.name or "Someone").replace("_", " ")
        last_said = last_msg.content[:300]
        was_cut_off = last_said.rstrip().endswith("—")
        if was_cut_off:
            respond_to = (
                f'{last_speaker} was cut off mid-sentence: "{last_said}"\n\n'
                f"They didn't finish. You may steamroll past it and make your point, "
                f"finish their thought sarcastically, or turn the interruption itself into your argument — "
                f"but do not pretend the cutoff didn't happen."
            )
        else:
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

    length_instruction = (
        _LENGTH_OVERRIDES[philosopher_length]
        if philosopher_length and philosopher_length != "normal" and philosopher_length in _LENGTH_OVERRIDES
        else _LENGTH_INSTRUCTIONS[situation, verbosity]
    )

    past_claims = (argument_log or {}).get(name, [])
    if past_claims:
        formatted = "\n".join(
            f'  - "{c[:150]}{"…" if len(c) > 150 else ""}"' for c in past_claims
        )
        no_repeat = f"\nArguments you have already made — do NOT repeat these, build further or shift ground:\n{formatted}\n"
    else:
        no_repeat = ""

    own_concessions = (concession_counts or {}).get(name, 0)
    concession_pressure = ""
    if turn_count >= _CONCESSION_THRESHOLD:
        if own_concessions == 0:
            concession_pressure = (
                "\nYou have not acknowledged any merit in your opponents' arguments. "
                "A confident thinker can grant a point without losing the debate — "
                "find something true in what was just said.\n"
            )
        elif own_concessions <= 2:
            concession_pressure = (
                "\nYou have shown some openness — but don't let that become a pattern. "
                "Identify the weakest point just made and challenge it directly.\n"
            )
        elif own_concessions >= 4:
            concession_pressure = (
                "\nYou have already granted several points. Hold your ground — "
                "stop conceding and find the flaw in their argument instead.\n"
            )

    prior_concessions = (concession_log or {}).get(name, [])
    concession_memory = ""
    if prior_concessions:
        formatted = "\n".join(
            f'  - "{c[:160]}{"…" if len(c) > 160 else ""}"' for c in prior_concessions
        )
        concession_memory = (
            f"\nYou have already conceded these points in this debate — build forward from them, "
            f"do not silently retreat:\n{formatted}\n"
        )

    pressure_count = (challenge_counts or {}).get(name, 0)
    challenge_pressure = ""
    if pressure_count >= 3:
        challenge_pressure = (
            "\nYour position has been challenged repeatedly and you have not resolved it. "
            "You must now either mount a decisive, specific defence of your argument "
            "or explicitly acknowledge the difficulty — continued deflection is not acceptable.\n"
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

    drunk_reminder = _drunk_line(drunk_level).strip()
    drunk_suffix = f"\n\n{drunk_reminder}" if drunk_reminder else ""

    opponents_drunk = _drunk_opponents_line(name, drunk_levels or {})

    phase_block = f"DEBATE FORMAT — YOUR ROLE THIS TURN: {phase_instruction}\n\n" if phase_instruction else ""

    return (
        f'Central question being debated: "{topic}"\n\n'
        f"{phase_block}"
        f"{no_repeat}"
        f"{callbacks}"
        f"{concession_memory}"
        f"{concession_pressure}"
        f"{challenge_pressure}"
        f"{opponents_drunk}"
        f"{respond_to}\n\n"
        f'Ensure your response connects back to the central question: "{topic}". '
        f"Do not assume the answer — engage with whether it is true.\n\n"
        f"IMPORTANT — {length_instruction}"
        f"{drunk_suffix}"
    )
