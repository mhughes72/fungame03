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

export function open(currentStyle, styles, summary = '', drawerContainer, searchFn = null) {
  return new Promise((resolve) => {
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
