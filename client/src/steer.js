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

export function open(currentStyle, styles, summary = '', drawerContainer, searchFn = null, participants = []) {
  return new Promise((resolve) => {
    const drinkCounts = {}
    participants.forEach(p => { drinkCounts[p] = 0 })

    const drinksHtml = participants.length ? `
      <div class="steer-or">── buy a round ──</div>
      <div class="drinks-grid" id="drinks-grid">
        ${participants.map(p => `
          <div class="drink-row" data-name="${escHtml(p)}">
            <span class="drink-name">${escHtml(p)}</span>
            <div class="drink-controls">
              <button class="drink-btn drink-minus" data-name="${escHtml(p)}">−</button>
              <span class="drink-count" id="drink-count-${escHtml(p.replace(/ /g,'_'))}">0</span>
              <button class="drink-btn drink-plus" data-name="${escHtml(p)}">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''

    const drawer = document.createElement('div')
    drawer.className = 'steer-drawer'
    drawer.innerHTML = `
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${summary ? `<div class="steer-summary">${escHtml(summary)}</div>` : ''}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="Speak into the debate — or leave blank for the moderator…"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">Steer ▶</button>
      </div>

      ${drinksHtml}

      <div class="steer-or">── inject evidence ──</div>

      <div class="evidence-search-row">
        <input
          class="steer-text-input"
          id="evidence-query"
          type="text"
          placeholder="Search term — result will be injected as empirical fact…"
          autocomplete="off"
        />
        <button class="steer-search-btn" id="evidence-search">Search</button>
      </div>

      <div id="evidence-preview" class="evidence-preview" style="display:none"></div>

      <div class="steer-or">── choose a moderator approach ──</div>

      <div class="style-list" id="style-list">
        ${styles.map(s => `
          <button
            class="style-item${s.style === currentStyle ? ' style-selected' : ''}"
            data-style="${escHtml(s.style)}"
          >
            <span class="style-name">${escHtml(s.style)}</span>
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

    // ── drink controls ──
    drawer.querySelectorAll('.drink-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name
        const delta = btn.classList.contains('drink-plus') ? 1 : -1
        drinkCounts[name] = Math.max(0, (drinkCounts[name] || 0) + delta)
        const key = name.replace(/ /g, '_')
        const el = drawer.querySelector(`#drink-count-${key}`)
        if (el) el.textContent = drinkCounts[name]
      })
    })

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
      const drinks = Object.fromEntries(
        Object.entries(drinkCounts).filter(([, v]) => v > 0)
      )
      drawer.remove()
      resolve({ text, style: selectedStyle, evidence: pendingEvidence, drinks })
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
