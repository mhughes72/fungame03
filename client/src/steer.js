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

      <div class="steer-styles-row">
        <span class="steer-or">approach:</span>
        <div class="style-chips" id="style-chips">
          ${styles.map(s => `
            <button
              class="style-chip${s.style === currentStyle ? ' style-selected' : ''}"
              data-style="${escHtml(s.style)}"
              title="${escHtml(s.description)}"
            >${escHtml(s.style)}</button>
          `).join('')}
        </div>
      </div>
    `

    const target = drawerContainer || document.body
    target.appendChild(drawer)

    const textInput = drawer.querySelector('#steer-text-input')
    textInput.focus()

    let selectedStyle = currentStyle

    drawer.querySelectorAll('.style-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        drawer.querySelectorAll('.style-chip').forEach(c => c.classList.remove('style-selected'))
        chip.classList.add('style-selected')
        selectedStyle = chip.dataset.style
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
