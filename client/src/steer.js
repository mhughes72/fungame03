/**
 * Steer drawer — slides up from the bottom of the left column.
 * Returns a Promise that resolves with { text, style } or null (quit).
 *
 * openCommercialBreak — cable news commercial break variant.
 * Returns a Promise that resolves with { text, producer_directive } or null (quit).
 */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function _ratingsBarHtml(ratings) {
  const pct   = ((ratings - 0.2) / (4.0 - 0.2)) * 100
  const w     = Math.max(0, Math.min(100, pct)).toFixed(1)
  const color = ratings >= 3 ? '#4a9b6f' : ratings >= 1.5 ? '#c8a030' : '#c83030'
  return `<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${w}%;background:${color}"></div></div>`
}

const STYLE_ICONS = {
  'socratic':         '💭',
  'combative':        '⚔️',
  "devil's advocate": '😈',
  'koan':             '☯️',
  'journalist':       '🎤',
  'straw man':        '🪆',
  'steel man':        '🛡️',
  'last call':        '🔔',
}

export function open(currentStyle, styles, summary = '', drawerContainer, searchFn = null, participants = [], skin = {}) {
  const styleNames = skin.moderatorStyleNames ?? {}
  const s_title    = skin.steerTitle            ?? "── STEER THE DEBATE ──"
  const s_quit     = skin.steerQuitLabel        ?? "Quit game"
  const s_ph       = skin.steerInputPlaceholder ?? "Speak into the debate — or leave blank for the moderator…"
  const s_submit   = skin.steerSubmitLabel      ?? "Steer ▶"
  const s_evPh     = skin.evidencePlaceholder   ?? "Search term — result will be injected as empirical fact…"

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

      <div class="style-grid" id="style-grid">
        ${styles.map(s => {
          const icon  = STYLE_ICONS[s.style] ?? '◆'
          const label = styleNames[s.style] ?? s.style
          return `<button
            class="style-icon-btn${s.style === currentStyle ? ' style-selected' : ''}"
            data-style="${escHtml(s.style)}"
            title="${escHtml(label + ' — ' + s.description)}"
          >
            <span class="style-icon-glyph">${icon}</span>
            <span class="style-icon-name">${escHtml(label)}</span>
          </button>`
        }).join('')}
      </div>

      <div class="steer-secondary-row">
        <button class="steer-pill" id="evidence-toggle">⚡ Evidence</button>
      </div>

      <div id="evidence-panel" style="display:none">
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
      </div>
    `

    const target = drawerContainer || document.body
    target.appendChild(drawer)

    const textInput  = drawer.querySelector('#steer-text-input')
    textInput.focus()

    let selectedStyle   = currentStyle
    let pendingEvidence = ''

    // ── style grid — click fires immediately ──
    drawer.querySelectorAll('.style-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        drawer.querySelectorAll('.style-icon-btn').forEach(b => b.classList.remove('style-selected'))
        btn.classList.add('style-selected')
        selectedStyle = btn.dataset.style
        submit()
      })
    })

    // ── evidence toggle ──
    const evidenceToggle = drawer.querySelector('#evidence-toggle')
    const evidencePanel  = drawer.querySelector('#evidence-panel')
    const preview        = drawer.querySelector('#evidence-preview')
    const queryInput     = drawer.querySelector('#evidence-query')
    const searchBtn      = drawer.querySelector('#evidence-search')

    evidenceToggle.addEventListener('click', () => {
      const open = evidencePanel.style.display === 'none'
      evidencePanel.style.display = open ? '' : 'none'
      evidenceToggle.classList.toggle('steer-pill--active', open)
      if (open) queryInput.focus()
    })

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

    function submit() {
      drawer.remove()
      resolve({ text: textInput.value.trim(), style: selectedStyle, evidence: pendingEvidence })
    }

    drawer.querySelector('#steer-submit').addEventListener('click', submit)
    drawer.querySelector('#steer-quit').addEventListener('click', () => { drawer.remove(); resolve(null) })
    textInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit() })
  })
}

/**
 * Cable news commercial break drawer.
 * breakData: { ratings, peak_ratings, producer_note, producer_stress, catchphrases, directives }
 * directives: [[key, description], ...]
 * Returns Promise<{ text, producer_directive }> or null (quit).
 */
export function openCommercialBreak(breakData, drawerContainer, skin = {}) {
  const {
    ratings       = 0.8,
    peak_ratings  = 0.8,
    producer_note = '',
    producer_stress = 0,
    directives    = [],
  } = breakData

  const stressLabels = ['', 'nervous', 'stressed', 'PANICKING', 'MELTDOWN', 'FIRE FIRE FIRE']
  const stressTag    = producer_stress > 0 ? ` (${stressLabels[Math.min(producer_stress, 5)]})` : ''
  const stressHigh   = producer_stress >= 3

  return new Promise((resolve) => {
    const drawer = document.createElement('div')
    drawer.className = 'steer-drawer'
    drawer.innerHTML = `
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${ratings.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${peak_ratings.toFixed(1)}M</span>
        ${_ratingsBarHtml(ratings)}
      </div>

      ${producer_note ? `
        <div class="commercial-producer-note${stressHigh ? ' commercial-producer-high' : ''}">
          <span class="producer-tag">[PRODUCER${stressTag}]</span> ${escHtml(producer_note)}
        </div>
      ` : ''}

      <div class="steer-input-row">
        <input class="steer-text-input" id="steer-text-input" type="text"
               placeholder="📞 Call-in question — or press Enter to let The Host decide…"
               autocomplete="off" />
        <button class="steer-submit-btn" id="steer-submit">On air ▶</button>
      </div>

      <div class="steer-or">── producer directive ──</div>

      <div class="style-list" id="directive-list">
        ${directives.map(([d, desc]) => `
          <button class="style-item" data-directive="${escHtml(d)}">
            <span class="style-name">${escHtml(d.replace(/_/g, ' '))}</span>
            <span class="style-desc">${escHtml(desc)}</span>
          </button>
        `).join('')}
      </div>
    `

    const target = drawerContainer || document.body
    target.appendChild(drawer)

    const textInput = drawer.querySelector('#steer-text-input')
    textInput.focus()

    let selectedDirective = ''

    drawer.querySelectorAll('.style-item').forEach(item => {
      item.addEventListener('click', () => {
        drawer.querySelectorAll('.style-item').forEach(i => i.classList.remove('style-selected'))
        item.classList.add('style-selected')
        selectedDirective = item.dataset.directive
        submit()
      })
    })

    function submit() {
      const text = textInput.value.trim()
      drawer.remove()
      resolve({ text, producer_directive: selectedDirective })
    }

    drawer.querySelector('#steer-submit').addEventListener('click', submit)
    drawer.querySelector('#steer-quit').addEventListener('click', () => {
      drawer.remove()
      resolve(null)
    })
    textInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit() })
  })
}
