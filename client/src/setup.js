/**
 * Setup screen — character picker + topic input.
 *
 * mount(container, characters, onStart)
 *   characters : [{ name, era, known_for }]
 *   onStart    : ({ characters: string[], topic: string }) => void
 */

export function mount(container, characters, onStart) {
  container.innerHTML = `
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${characters.map(c => `
            <label class="char-row" data-name="${c.name}">
              <input type="checkbox" value="${c.name}" />
              <span class="char-name">${c.name}</span>
              <span class="char-era">${c.era}</span>
            </label>
          `).join('')}
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">What should they discuss?</label>
        <input
          id="topic-input"
          class="topic-input"
          type="text"
          placeholder="What is the nature of justice?"
          maxlength="500"
          autocomplete="off"
        />

        <button class="start-btn" id="start-btn" disabled>Open the bar ▶</button>
        <p class="setup-error" id="setup-error"></p>
      </div>
    </div>
  `

  // Default selections: Lincoln + Tesla (indices 5, 8 — same as Textual UI)
  const checkboxes = container.querySelectorAll('input[type=checkbox]')
  const defaultNames = new Set(['Abraham Lincoln', 'Nikola Tesla'])
  checkboxes.forEach(cb => {
    if (defaultNames.has(cb.value)) cb.checked = true
  })

  const hint    = container.querySelector('#selection-hint')
  const startBtn = container.querySelector('#start-btn')
  const errorEl  = container.querySelector('#setup-error')

  function updateHint() {
    const count = [...checkboxes].filter(cb => cb.checked).length
    if (count < 2) {
      hint.textContent = `Select ${2 - count} more`
      hint.classList.remove('hint-ok', 'hint-warn')
    } else if (count > 4) {
      hint.textContent = `Too many — deselect ${count - 4}`
      hint.classList.add('hint-warn')
      hint.classList.remove('hint-ok')
    } else {
      hint.textContent = `${count} selected`
      hint.classList.add('hint-ok')
      hint.classList.remove('hint-warn')
    }
    startBtn.disabled = count < 2 || count > 4
  }

  updateHint()
  checkboxes.forEach(cb => cb.addEventListener('change', updateHint))

  startBtn.addEventListener('click', () => {
    const selected = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value)
    const topic = container.querySelector('#topic-input').value.trim()
                  || 'What is the nature of justice?'
    errorEl.textContent = ''
    onStart({ characters: selected, topic })
  })

  container.querySelector('#topic-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !startBtn.disabled) startBtn.click()
  })

  // Expose a way to show errors without tearing down the screen
  return {
    showError(msg) { errorEl.textContent = msg },
  }
}
