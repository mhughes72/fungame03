/**
 * Steer modal — opens as a full-screen overlay.
 * Returns a Promise that resolves with { text, style } or null (quit).
 */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function open(currentStyle, styles, summary = '') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.className = 'steer-overlay'
    overlay.innerHTML = `
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

        ${summary ? `<div class="steer-summary">${escHtml(summary)}</div>` : ''}

        <label class="steer-field-label" for="steer-text-input">
          Speak directly into the debate:
        </label>
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="Leave blank to let the moderator intervene…"
          autocomplete="off"
        />

        <div class="steer-or">── or choose a moderator approach ──</div>

        <div class="style-list" id="style-list">
          ${styles.map(s => `
            <label class="style-item${s.style === currentStyle ? ' style-selected' : ''}">
              <input type="radio" name="mod-style" value="${escHtml(s.style)}"
                     ${s.style === currentStyle ? 'checked' : ''} />
              <span class="style-name">${escHtml(s.style)}</span>
              <span class="style-desc">${escHtml(s.description)}</span>
            </label>
          `).join('')}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `

    document.body.appendChild(overlay)

    // Hover to toggle backdrop opacity
    overlay.addEventListener('mouseenter', () => {
      overlay.classList.add('overlay-focused')
    })
    overlay.addEventListener('mouseleave', () => {
      overlay.classList.remove('overlay-focused')
    })

    const textInput = overlay.querySelector('#steer-text-input')
    textInput.focus()

    // Highlight the selected radio item
    overlay.querySelectorAll('.style-item input').forEach(radio => {
      radio.addEventListener('change', () => {
        overlay.querySelectorAll('.style-item').forEach(el => el.classList.remove('style-selected'))
        radio.closest('.style-item').classList.add('style-selected')
      })
    })

    function getStyle() {
      const checked = overlay.querySelector('input[name=mod-style]:checked')
      return checked ? checked.value : currentStyle
    }

    function submit() {
      const text = textInput.value.trim()
      const style = getStyle()
      overlay.remove()
      resolve({ text, style })
    }

    overlay.querySelector('#steer-submit').addEventListener('click', submit)
    overlay.querySelector('#steer-quit').addEventListener('click', () => {
      overlay.remove()
      resolve(null)
    })

    textInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') submit()
    })

    // Click outside the box = blank steer (same as pressing Enter with empty input)
    overlay.addEventListener('click', e => {
      if (e.target === overlay) submit()
    })
  })
}
