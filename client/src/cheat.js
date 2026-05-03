/**
 * Cheat modal — heat override + buy a round.
 * open(sessionId, currentHeat, participants, cheatFn) → Promise<void>
 */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const _HEAT_LABELS = ['arctic', 'cool', 'cool', 'warm', 'warm', 'charged', 'charged', 'heated', 'heated', 'flashpoint', 'flashpoint']

export function open(sessionId, currentHeat, participants, cheatFn, onNewspaper = null, onPodcast = null, onEndGame = null, onForceConsensus = null) {
  return new Promise((resolve) => {
    const drinkCounts = {}
    participants.forEach(p => { drinkCounts[p] = 0 })

    const overlay = document.createElement('div')
    overlay.className = 'cheat-overlay'
    overlay.innerHTML = `
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${currentHeat}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${currentHeat} — ${_HEAT_LABELS[currentHeat]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${participants.map(p => `
            <div class="drink-row">
              <span class="drink-name">${escHtml(p)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${escHtml(p)}">−</button>
                <span class="drink-count" id="drink-count-${escHtml(p.replace(/ /g, '_'))}">0</span>
                <button class="drink-btn drink-plus" data-name="${escHtml(p)}">+</button>
              </div>
            </div>
          `).join('')}
        </div>

        ${(onNewspaper || onPodcast) ? `
        <div class="cheat-utils-row">
          ${onNewspaper ? `<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>` : ''}
          ${onPodcast ? `<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>` : ''}
        </div>` : ''}

        ${(onForceConsensus || onEndGame) ? `
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${onForceConsensus ? `<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>` : ''}
          ${onEndGame ? `<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>` : ''}
        </div>` : ''}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `

    document.body.appendChild(overlay)

    const slider    = overlay.querySelector('#cheat-heat-slider')
    const heatValue = overlay.querySelector('#cheat-heat-value')

    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10)
      heatValue.textContent = `${v} — ${_HEAT_LABELS[v]}`
    })

    overlay.querySelectorAll('.drink-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name  = btn.dataset.name
        const delta = btn.classList.contains('drink-plus') ? 1 : -1
        drinkCounts[name] = Math.max(0, (drinkCounts[name] || 0) + delta)
        const key = name.replace(/ /g, '_')
        const el = overlay.querySelector(`#drink-count-${key}`)
        if (el) el.textContent = drinkCounts[name]
      })
    })

    function close() {
      overlay.remove()
      resolve()
    }

    async function apply() {
      const heat   = parseInt(slider.value, 10)
      const drinks = Object.fromEntries(
        Object.entries(drinkCounts).filter(([, v]) => v > 0)
      )
      const heatChanged = heat !== currentHeat
      try {
        await cheatFn(sessionId, heatChanged ? heat : null, drinks)
      } catch (err) {
        console.error('Cheat failed:', err)
      }
      close()
    }

    overlay.querySelector('#cheat-apply').addEventListener('click', apply)
    overlay.querySelector('#cheat-close').addEventListener('click', close)
    overlay.querySelector('#cheat-paper')?.addEventListener('click', () => { close(); onNewspaper() })
    overlay.querySelector('#cheat-podcast')?.addEventListener('click', () => { close(); onPodcast() })
    overlay.querySelector('#cheat-consensus')?.addEventListener('click', () => { close(); onForceConsensus() })
    overlay.querySelector('#cheat-end')?.addEventListener('click', () => { close(); onEndGame() })
    overlay.addEventListener('click', e => { if (e.target === overlay) close() })
  })
}
