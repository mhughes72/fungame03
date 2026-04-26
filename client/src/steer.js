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

export function open(currentStyle, styles, summary = '', drawerContainer) {
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

    const textInput = drawer.querySelector('#steer-text-input')
    textInput.focus()

    let selectedStyle = currentStyle

    drawer.querySelectorAll('.style-item').forEach(item => {
      item.addEventListener('click', () => {
        drawer.querySelectorAll('.style-item').forEach(i => i.classList.remove('style-selected'))
        item.classList.add('style-selected')
        selectedStyle = item.dataset.style
      })
    })

    function submit() {
      const text = textInput.value.trim()
      drawer.remove()
      resolve({ text, style: selectedStyle })
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
