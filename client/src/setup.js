/**
 * Setup screen — character picker + topic input.
 *
 * mount(container, characters, onStart)
 *   characters : [{ name, era, known_for }]
 *   onStart    : ({ characters: string[], topic: string }) => void
 */

import { openAbout, openHelp } from './info.js'
import { fetchTopics } from './api.js'

export function mount(container, characters, onStart, { isLocal = false } = {}) {
  container.innerHTML = `
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

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
            <label class="char-row"
              data-name="${c.name.toLowerCase()}"
              data-desc="${escHtml(c.known_for)}"
              data-category="${escHtml(c.category || '')}"
              data-portrait="${escHtml(c.name.replace(/ /g, '_'))}">
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

        <div class="setup-toggles">
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-commentator" checked />
            <span class="toggle-label">Commentator</span>
            <span class="toggle-desc">play-by-play after each round</span>
          </label>
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-moderator" checked />
            <span class="toggle-label">Moderator</span>
            <span class="toggle-desc">AI steers debate at each break</span>
          </label>
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-diagrams" />
            <span class="toggle-label">Diagrams</span>
            <span class="toggle-desc">characters produce supporting images <span class="toggle-wip">· work in progress</span></span>
          </label>
        </div>

        <div class="setup-audience">
          <span class="audience-label">Audience level</span>
          <div class="audience-options">
            <label class="audience-opt"><input type="radio" name="audience" value="grade5" /> Grade 5</label>
            <label class="audience-opt"><input type="radio" name="audience" value="highschool" /> High School</label>
            <label class="audience-opt"><input type="radio" name="audience" value="university" checked /> University</label>
            <label class="audience-opt"><input type="radio" name="audience" value="expert" /> Expert</label>
          </div>
        </div>

        <div class="setup-lengths" id="setup-lengths" style="display:none">
          <div class="length-group">
            <span class="length-label">Philosopher length</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="phil-length" value="punchy" /> Punchy</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="conversational" /> Conversational</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="expansive" /> Expansive</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Commentator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="comm-length" value="off" /> Off</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="verbose" /> Verbose</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Moderator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="mod-length" value="brief" /> Brief</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="elaborate" /> Elaborate</label>
            </div>
          </div>
        </div>

        <button class="start-btn" id="start-btn" disabled>Open the bar ▶</button>
        <p class="setup-error" id="setup-error"></p>

        <div class="setup-or">── or ──</div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">generating tonight's debate…</div>
        </div>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `

  const checkboxes = container.querySelectorAll('#char-list input[type=checkbox]')
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

  // ── Character tooltip ─────────────────────────────────────────────── //
  const tooltip = document.createElement('div')
  tooltip.className = 'char-tooltip'
  tooltip.style.display = 'none'
  document.body.appendChild(tooltip)

  function showTooltip(e) {
    const { desc, category, portrait } = e.currentTarget.dataset
    if (!desc) return
    const portraitUrl = `/portraits/${portrait}.png`
    tooltip.innerHTML = `
      <div class="tt-inner">
        <img class="tt-portrait" src="${portraitUrl}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${category ? `<span class="tt-category">${escHtml(category)}</span>` : ''}
          <span class="tt-desc">${escHtml(desc)}</span>
        </div>
      </div>`
    tooltip.style.display = 'block'
    positionTooltip(e)
  }

  function positionTooltip(e) {
    const pad = 14
    const tw = tooltip.offsetWidth
    const th = tooltip.offsetHeight
    let x = e.clientX + pad
    let y = e.clientY + pad
    if (x + tw > window.innerWidth - pad)  x = e.clientX - tw - pad
    if (y + th > window.innerHeight - pad) y = e.clientY - th - pad
    tooltip.style.left = x + 'px'
    tooltip.style.top  = y + 'px'
  }

  function hideTooltip() { tooltip.style.display = 'none' }

  rows.forEach(row => {
    row.addEventListener('mouseenter', showTooltip)
    row.addEventListener('mousemove',  positionTooltip)
    row.addEventListener('mouseleave', hideTooltip)
  })

  // clean up tooltip when setup screen is replaced
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      tooltip.remove()
      observer.disconnect()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  if (isLocal) container.querySelector('#setup-lengths').style.display = ''

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

  function getToggles() {
    const audienceEl  = container.querySelector('input[name="audience"]:checked')
    const philEl      = container.querySelector('input[name="phil-length"]:checked')
    const commEl      = container.querySelector('input[name="comm-length"]:checked')
    const modEl       = container.querySelector('input[name="mod-length"]:checked')
    return {
      commentator:       container.querySelector('#toggle-commentator').checked,
      moderator:         container.querySelector('#toggle-moderator').checked,
      diagrams:          container.querySelector('#toggle-diagrams').checked,
      audienceLevel:     audienceEl ? audienceEl.value : 'university',
      philosopherLength: philEl    ? philEl.value     : 'normal',
      commentatorLength: commEl    ? commEl.value     : 'normal',
      moderatorLength:   modEl     ? modEl.value      : 'normal',
    }
  }

  startBtn.addEventListener('click', () => {
    const selected = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value)
    const topic = container.querySelector('#topic-input').value.trim()
                  || 'What is the nature of justice?'
    errorEl.textContent = ''
    onStart({ characters: selected, topic, ...getToggles() })
  })

  container.querySelector('#topic-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !startBtn.disabled) startBtn.click()
  })

  container.querySelector('#setup-about').addEventListener('click', openAbout)
  container.querySelector('#setup-help').addEventListener('click', openHelp)

  // ── Suggested Debate ──────────────────────────────────────────────────── //
  const dotdCard = container.querySelector('#dotd-card')

  const catColors = {
    heated:        'var(--red)',
    historic:      'var(--blue)',
    philosophical: 'var(--gold-dim)',
    scientific:    'var(--blue)',
    cultural:      'var(--amber)',
    political:     'var(--green)',
  }

  let allTopics    = []
  let currentTopic = null

  function getLevel() {
    const el = container.querySelector('input[name="audience"]:checked')
    return el ? el.value : 'university'
  }

  function topicsForLevel(level) {
    return allTopics.filter(t => t.audience_level === level)
  }

  function weightedPick(pool, exclude = null) {
    if (!pool.length) return null
    const available = exclude ? pool.filter(t => t.id !== exclude.id) : pool
    const src = available.length ? available : pool
    const weighted = []
    for (const t of src) {
      weighted.push(t)
      if (t.source === 'curated') { weighted.push(t); weighted.push(t) }
    }
    return weighted[Math.floor(Math.random() * weighted.length)]
  }

  function renderDotd(topic) {
    currentTopic = topic
    const color = catColors[topic.category] || 'var(--text-dim)'
    const sourceBadge = topic.source === 'curated'
      ? '<span class="dotd-curated">★ curated</span>'
      : '<span class="dotd-generated">AI</span>'
    dotdCard.innerHTML = `
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${color}">${topic.category.toUpperCase()}</span>
          ${sourceBadge}
        </span>
      </div>
      <div class="dotd-cast">${topic.characters.join(' · ')}</div>
      <div class="dotd-topic">${escHtml(topic.topic)}</div>
      <div class="dotd-tagline">${escHtml(topic.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `
    dotdCard.querySelector('#dotd-start').addEventListener('click', () => {
      onStart({ characters: topic.characters, topic: topic.topic, ...getToggles() })
    })
    dotdCard.querySelector('#dotd-new').addEventListener('click', () => {
      const next = weightedPick(topicsForLevel(getLevel()), currentTopic)
      if (next) renderDotd(next)
    })
  }

  function loadSuggestion() {
    const pick = weightedPick(topicsForLevel(getLevel()))
    if (pick) renderDotd(pick)
    else dotdCard.style.display = 'none'
  }

  fetchTopics().then(topics => {
    allTopics = topics
    loadSuggestion()
  }).catch(() => {
    dotdCard.style.display = 'none'
  })

  // Re-pick when audience level changes
  container.querySelectorAll('input[name="audience"]').forEach(radio => {
    radio.addEventListener('change', loadSuggestion)
  })

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
