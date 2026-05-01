/**
 * Setup screen — character picker + topic input.
 *
 * mount(container, characters, onStart)
 *   characters : [{ name, era, known_for }]
 *   onStart    : ({ characters: string[], topic: string }) => void
 */

import { openAbout, openHelp } from './info.js'
import { fetchDebateOfTheDay } from './api.js'

export function mount(container, characters, onStart) {
  container.innerHTML = `
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">generating tonight's debate…</div>
        </div>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="Filter thinkers…"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${characters.map(c => `
            <label class="char-row" data-name="${c.name.toLowerCase()}">
              <input type="checkbox" value="${c.name}" />
              <span class="char-name">${c.name}</span>
              <span class="char-era">${c.era}</span>
            </label>
          `).join('')}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
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
        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `

  const checkboxes = container.querySelectorAll('input[type=checkbox]')
  const rows      = container.querySelectorAll('.char-row')
  const noResults = container.querySelector('#char-no-results')
  const filterInput = container.querySelector('#char-filter')

  filterInput.addEventListener('input', () => {
    const q = filterInput.value.toLowerCase().trim()
    let visible = 0
    rows.forEach(row => {
      const show = !q || row.dataset.name.includes(q)
      row.style.display = show ? '' : 'none'
      if (show) visible++
    })
    noResults.style.display = visible === 0 ? '' : 'none'
  })

  const hint    = container.querySelector('#selection-hint')
  const startBtn = container.querySelector('#start-btn')
  const errorEl  = container.querySelector('#setup-error')

  function updateHint() {
    const count = [...checkboxes].filter(cb => cb.checked).length
    if (count < 2) {
      hint.textContent = count === 0 ? 'Select 2 to 4 thinkers' : 'Select 1 more'
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

  container.querySelector('#setup-about').addEventListener('click', openAbout)
  container.querySelector('#setup-help').addEventListener('click', openHelp)

  // ── Debate of the Day ──────────────────────────────────────────────────── //
  const dotdCard = container.querySelector('#dotd-card')

  const catColors = {
    heated:        'var(--red)',
    historic:      'var(--blue)',
    philosophical: 'var(--gold-dim)',
    scientific:    'var(--blue)',
    cultural:      'var(--amber)',
    political:     'var(--green)',
  }

  let dotdIndex = 0

  function renderDotd(dotd) {
    const color = catColors[dotd.category] || 'var(--text-dim)'
    dotdCard.innerHTML = `
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${color}">${dotd.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${dotd.characters.join(' · ')}</div>
      <div class="dotd-topic">${escHtml(dotd.topic)}</div>
      <div class="dotd-tagline">${escHtml(dotd.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `
    dotdCard.querySelector('#dotd-start').addEventListener('click', () => {
      onStart({ characters: dotd.characters, topic: dotd.topic })
    })
    dotdCard.querySelector('#dotd-new').addEventListener('click', () => {
      dotdIndex++
      loadDotd(dotdIndex)
    })
  }

  function loadDotd(index) {
    dotdCard.innerHTML = `<div class="dotd-loading">generating…</div>`
    fetchDebateOfTheDay(index).then(renderDotd).catch(() => {
      if (index === 0) dotdCard.style.display = 'none'
      else {
        // generation failed mid-cycle — step back and re-render last good one
        dotdIndex--
        fetchDebateOfTheDay(dotdIndex).then(renderDotd).catch(() => {
          dotdCard.style.display = 'none'
        })
      }
    })
  }

  loadDotd(0)

  // Expose a way to show errors without tearing down the screen
  return {
    showError(msg) { errorEl.textContent = msg },
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
