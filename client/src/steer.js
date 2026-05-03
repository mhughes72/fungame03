/**
 * Steer drawer — slides up from the bottom of the left column.
 * Returns a Promise that resolves with { text, style } or null (quit).
 */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function open(currentStyle, styles, summary = '', drawerContainer, searchFn = null, participants = [], skin = {}) {
  const styleNames = skin.moderatorStyleNames ?? {}
  const s_title    = skin.steerTitle            ?? "── STEER THE DEBATE ──"
  const s_quit     = skin.steerQuitLabel        ?? "Quit game"
  const s_ph       = skin.steerInputPlaceholder ?? "Speak into the debate — or leave blank for the moderator…"
  const s_submit   = skin.steerSubmitLabel      ?? "Steer ▶"
  const s_evidence = skin.evidenceLabel         ?? "── inject evidence ──"
  const s_evPh     = skin.evidencePlaceholder   ?? "Search term — result will be injected as empirical fact…"
  const s_approach = skin.moderatorStyleLabel   ?? "── choose a moderator approach ──"

  return new Promise((resolve) => {
    const drawer = document.createElement('div')
    drawer.className = 'steer-drawer'
    drawer.innerHTML = `
      <div class="steer-drawer-header">
        <div class="steer-title">${s_title}</div>
        <button class="steer-quit-btn" id="steer-quit">${escHtml(s_quit)}</button>
      </div>

      ${summary ? `<div class="steer-summary">${escHtml(summary)}</div>` : ''}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${escHtml(s_ph)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${escHtml(s_submit)}</button>
      </div>

      <div class="steer-or">${s_evidence}</div>

      <div class="evidence-search-row">
        <input
          class="steer-text-input"
          id="evidence-query"
          type="text"
          placeholder="${escHtml(s_evPh)}"
          autocomplete="off"
        />
        <button class="steer-search-btn" id="evidence-search">Search</button>
      </div>

      <div id="evidence-preview" class="evidence-preview" style="display:none"></div>

      <div class="steer-or">${s_approach}</div>

      <div class="style-list" id="style-list">
        ${styles.map(s => `
          <button
            class="style-item${s.style === currentStyle ? ' style-selected' : ''}"
            data-style="${escHtml(s.style)}"
          >
            <span class="style-name">${escHtml(styleNames[s.style] ?? s.style)}</span>
            <span class="style-desc">${escHtml(s.description)}</span>
          </button>
        `).join('')}
      </div>
    `

    const target = drawerContainer || document.body
    target.appendChild(drawer)

    const textInput    = drawer.querySelector('#steer-text-input')
    const queryInput   = drawer.querySelector('#evidence-query')
    const searchBtn    = drawer.querySelector('#evidence-search')
    const preview      = drawer.querySelector('#evidence-preview')
    textInput.focus()

    let selectedStyle  = currentStyle
    let pendingEvidence = ''

    // ── evidence search ──
    async function doSearch() {
      const query = queryInput.value.trim()
      if (!query || !searchFn) return
      searchBtn.disabled = true
      searchBtn.textContent = 'Searching…'
      preview.style.display = 'none'
      pendingEvidence = ''
      try {
        const result = await searchFn(query)
        pendingEvidence = result.finding
        preview.style.display = 'block'
        preview.innerHTML = `
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${escHtml(result.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `
        preview.querySelector('#evidence-accept').addEventListener('click', () => {
          preview.innerHTML = `<div class="evidence-accepted">✓ Evidence will be injected: ${escHtml(pendingEvidence)}</div>`
        })
        preview.querySelector('#evidence-discard').addEventListener('click', () => {
          pendingEvidence = ''
          preview.style.display = 'none'
        })
      } catch (err) {
        preview.style.display = 'block'
        preview.textContent = `Search failed: ${err.message}`
      } finally {
        searchBtn.disabled = false
        searchBtn.textContent = 'Search'
      }
    }

    searchBtn.addEventListener('click', doSearch)
    queryInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch() })

    // ── style selection ──
    drawer.querySelectorAll('.style-item').forEach(item => {
      item.addEventListener('click', () => {
        drawer.querySelectorAll('.style-item').forEach(i => i.classList.remove('style-selected'))
        item.classList.add('style-selected')
        selectedStyle = item.dataset.style
        submit()
      })
    })

    function submit() {
      const text = textInput.value.trim()
      drawer.remove()
      resolve({ text, style: selectedStyle, evidence: pendingEvidence })
    }

    drawer.querySelector('#steer-submit').addEventListener('click', submit)
    drawer.querySelector('#steer-quit').addEventListener('click', () => {
      drawer.remove()
      resolve(null)
    })

    textInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') submit()
    })
  })
}
