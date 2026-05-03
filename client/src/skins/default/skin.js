/** Default skin — The Philosopher's Bar.
 *  All exports are optional; consuming code falls back to these values if a
 *  custom skin omits any of them. */

// ── App-wide ────────────────────────────────────────────────────────────── //
export const appName = "THE PHILOSOPHER'S BAR"

// ── Setup screen ────────────────────────────────────────────────────────── //
export const setupSub              = "Select 2–4 thinkers for tonight's debate"
export const charFilterPlaceholder = "Filter thinkers…"
export const topicLabel            = "What should they discuss?"
export const topicPlaceholder      = "What is the nature of justice?"
export const startLabel            = "Open the bar ▶"
export const orLabel               = "── or ──"
export const dotdLoadingText       = "generating tonight's debate…"

// ── Debate screen ───────────────────────────────────────────────────────── //
export const debateStartingText = "Opening the bar"

// ── Steer drawer ────────────────────────────────────────────────────────── //
export const steerTitle            = "── STEER THE DEBATE ──"
export const steerQuitLabel        = "Quit game"
export const steerInputPlaceholder = "Speak into the debate — or leave blank for the moderator…"
export const steerSubmitLabel      = "Steer ▶"
export const evidenceLabel         = "── inject evidence ──"
export const evidencePlaceholder   = "Search term — result will be injected as empirical fact…"
export const moderatorStyleLabel   = "── choose a moderator approach ──"

/** Override display names for any moderator styles.
 *  Keys are the style IDs from the server; values are display names.
 *  Unrecognised keys fall back to the server-supplied name. */
export const moderatorStyleNames = {}

/** Optional custom seat HTML.
 *  Must preserve .seat, .seat-thinking, .seat-speaking class hooks.
 *  If not exported, seating.js uses its built-in default.
 *
 * export function renderSeat(name, portraitUrl, slug, lastName, initials) {
 *   return `<div class="seat" id="seat-${slug}">…</div>`
 * }
 */
