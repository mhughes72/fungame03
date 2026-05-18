/**
 * Setup screen — character picker + topic input.
 *
 * mount(container, characters, onStart)
 *   characters : [{ name, era, known_for }]
 *   onStart    : ({ characters: string[], topic: string }) => void
 */

import { openAbout, openHelp } from './info.js'
import { fetchTopics, suggestCast, suggestTopic } from './api.js'

export function mount(container, characters, onStart, { isLocal = false, skin = {} } = {}) {
  const s_appName    = skin.appName             ?? "THE PHILOSOPHER'S BAR"
  const s_sub        = skin.setupSub            ?? "Select 2–4 thinkers for tonight's debate"
  const s_filter     = skin.charFilterPlaceholder ?? "Filter thinkers…"
  const s_topicLabel = skin.topicLabel          ?? "What should they discuss?"
  const s_topicPh    = skin.topicPlaceholder    ?? "What is the nature of justice?"
  const s_start      = skin.startLabel          ?? "Open the bar ▶"
  const s_or         = skin.orLabel             ?? "── or ──"
  const s_dotdLoad   = skin.dotdLoadingText     ?? "generating tonight's debate…"

  container.innerHTML = `
    <div class="setup-overlay">
      <div class="setup-box setup-box--simple" id="setup-box">
        <h1 class="setup-title">${s_appName}</h1>
        <p class="setup-sub">${s_sub}</p>

        <div class="format-selector">
          <label class="format-opt format-opt--freeform" data-desc="Open philosophical debate — the moderator guides the conversation freely with no fixed sides">
            <input type="radio" name="debate-format" value="" checked />
            <span class="format-opt-icon">💭</span>
            <span class="format-opt-name">Freeform</span>
          </label>
          <label class="format-opt" data-desc="Structured Oxford-style debate with proposition and opposition sides — characters are pre-assigned to argue for or against the motion">
            <input type="radio" name="debate-format" value="oxford" />
            <span class="format-opt-icon">🎓</span>
            <span class="format-opt-name">Oxford</span>
          </label>
          <label class="format-opt" data-desc="Chaotic cable TV showdown — ratings-driven, catchphrases, commercial breaks, and a host fighting for airtime">
            <input type="radio" name="debate-format" value="cable_news" />
            <span class="format-opt-icon">📺</span>
            <span class="format-opt-name">Cable News</span>
          </label>
        </div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">${escHtml(s_dotdLoad)}</div>
        </div>

        <div class="setup-or">── or build your own ──</div>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${escHtml(s_filter)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${(() => {
            const CAT_ORDER = ['Philosophy','Science','Politics','Arts','Literature','Technology','Media','Psychology','Religion']
            const grouped = {}
            for (const c of characters) {
              const cat = c.category || 'Other'
              ;(grouped[cat] = grouped[cat] || []).push(c)
            }
            return CAT_ORDER.filter(cat => grouped[cat]).map(cat => `
              <div class="char-category-group">
                <div class="char-category-label">${escHtml(cat)}</div>
                <div class="char-category-cards">
                  ${grouped[cat].map(c => {
                    const portrait  = c.name.replace(/ /g, '_')
                    const initials  = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                    return `<label class="char-card"
                        data-name="${c.name.toLowerCase()}"
                        data-desc="${escHtml(c.known_for)}"
                        data-category="${escHtml(cat)}">
                        <input type="checkbox" value="${escHtml(c.name)}" />
                        <div class="char-card-img">
                          <img src="/portrait_thumbs/${portrait}.webp" alt=""
                            data-portrait="${portrait}"
                            loading="lazy" />
                          <div class="char-card-initials" style="display:none">${escHtml(initials)}</div>
                        </div>
                        <div class="char-card-name">${escHtml(c.name)}</div>
                      </label>`
                  }).join('')}
                </div>
              </div>`
            ).join('')
          })()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${s_topicLabel}</label>
        <div class="advanced-generate-heading">or generate a debate</div>
        <div class="topic-row">
          <input
            id="topic-input"
            class="topic-input"
            type="text"
            placeholder="${escHtml(s_topicPh)}"
            maxlength="500"
            autocomplete="off"
          />
          <button class="suggest-btn" id="suggest-btn" title="Let AI pick the best characters for this topic">Suggest cast ✦</button>
          <button class="suggest-btn" id="suggest-topic-btn" title="Let AI suggest a topic for your selected cast" disabled>Suggest topic ✦</button>
        </div>
        <div class="topic-suggestion" id="topic-suggestion" style="display:none"></div>
        <div class="cast-suggestion" id="cast-suggestion" style="display:none"></div>
        <div class="topic-error" id="topic-error"></div>

        <div class="adv-section-title">more experimental features</div>

        <div class="advanced-panel" id="advanced-panel">
          <div class="setup-toggles">
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
            <div class="adv-inner-title">character response style</div>
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
                <label class="length-opt"><input type="radio" name="mod-length" value="off" /> Off</label>
                <label class="length-opt"><input type="radio" name="mod-length" value="brief" /> Brief</label>
                <label class="length-opt"><input type="radio" name="mod-length" value="normal" checked /> Normal</label>
                <label class="length-opt"><input type="radio" name="mod-length" value="elaborate" /> Elaborate</label>
              </div>
            </div>
          </div>
        </div>

        <button class="start-btn" id="start-btn" disabled>${escHtml(s_start)}</button>
        <div class="start-error" id="start-error"></div>

        <div class="setup-spacer"></div>
        <div class="setup-dotd-sep">── or try a suggested debate ──</div>

        <div class="mode-toggle-row">
          <button class="mode-toggle-btn" id="mode-to-advanced">⚗ Experimental features</button>
          <button class="mode-toggle-btn" id="mode-to-simple">← Simple view</button>
        </div>

        <p class="setup-error" id="setup-error"></p>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `

  const checkboxes = container.querySelectorAll('#char-list input[type=checkbox]')
  const rows      = container.querySelectorAll('.char-card')
  const noResults = container.querySelector('#char-no-results')
  const filterInput = container.querySelector('#char-filter')

  // Two-step portrait fallback: WebP thumb → original PNG → initials placeholder
  container.querySelectorAll('.char-card-img img').forEach(img => {
    img.addEventListener('error', function onThumbError() {
      img.removeEventListener('error', onThumbError)
      if (img.src.includes('/portrait_thumbs/')) {
        img.addEventListener('error', () => {
          img.style.display = 'none'
          img.nextElementSibling.style.display = 'flex'
        })
        img.src = `/portraits/${img.dataset.portrait}.png`
      } else {
        img.style.display = 'none'
        img.nextElementSibling.style.display = 'flex'
      }
    })
  })

  filterInput.addEventListener('input', () => {
    const q = filterInput.value.toLowerCase().trim()
    let visible = 0
    rows.forEach(row => {
      const show = !q || row.dataset.name.includes(q)
      row.style.display = show ? '' : 'none'
      if (show) visible++
    })
    container.querySelectorAll('.char-category-group').forEach(group => {
      const anyVisible = [...group.querySelectorAll('.char-card')].some(c => c.style.display !== 'none')
      group.style.display = anyVisible ? '' : 'none'
    })
    noResults.style.display = visible === 0 ? '' : 'none'
  })

  // ── Character tooltip ─────────────────────────────────────────────── //
  const tooltip = document.createElement('div')
  tooltip.className = 'char-tooltip'
  tooltip.style.display = 'none'
  document.body.appendChild(tooltip)

  function showTooltip(e) {
    const { desc, category } = e.currentTarget.dataset
    if (!desc) return
    tooltip.innerHTML = `
      <div class="tt-body">
        ${category ? `<span class="tt-category">${escHtml(category)}</span>` : ''}
        <span class="tt-desc">${escHtml(desc)}</span>
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

  container.querySelectorAll('.format-opt').forEach(opt => {
    opt.addEventListener('mouseenter', showTooltip)
    opt.addEventListener('mousemove',  positionTooltip)
    opt.addEventListener('mouseleave', hideTooltip)
  })

  // clean up tooltip when setup screen is replaced
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      tooltip.remove()
      observer.disconnect()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })


  if (isLocal) {
    container.querySelector('#setup-lengths').style.display = ''
  }

  // ── Simple / Advanced mode switch ────────────────────────────────────── //
  const setupBox      = container.querySelector('#setup-box')
  const modeToAdv     = container.querySelector('#mode-to-advanced')
  const modeToSimple  = container.querySelector('#mode-to-simple')
  const titleEl       = container.querySelector('.setup-title')

  modeToAdv.addEventListener('click', () => {
    setupBox.classList.replace('setup-box--simple', 'setup-box--advanced')
    titleEl.textContent = "THE PHILOSOPHER'S EXPERIMENT"
    const oxfordRadio = container.querySelector('input[name="debate-format"][value="oxford"]')
    if (oxfordRadio && !oxfordRadio.checked) {
      oxfordRadio.checked = true
      loadSuggestion()
    }
  })

  modeToSimple.addEventListener('click', () => {
    setupBox.classList.replace('setup-box--advanced', 'setup-box--simple')
    titleEl.textContent = s_appName
    // reset format to freeform so simple DOTD shows the right topics
    const freeformRadio = container.querySelector('input[name="debate-format"][value=""]')
    if (freeformRadio && !freeformRadio.checked) {
      freeformRadio.checked = true
      loadSuggestion()
    }
  })

  const hint        = container.querySelector('#selection-hint')
  const startBtn    = container.querySelector('#start-btn')
  const errorEl     = container.querySelector('#setup-error')
  const topicErrorEl = container.querySelector('#topic-error')
  const startErrorEl = container.querySelector('#start-error')

  function updateHint() {
    const count = [...checkboxes].filter(cb => cb.checked).length
    const hasTopic = topicInput.value.trim().length > 0
    container.querySelector('#char-list').classList.toggle('char-list--maxed', count >= 4)
    if (count < 2) {
      hint.textContent = count === 0 ? 'Select 2 to 4 thinkers' : 'Select 1 more'
      hint.classList.remove('hint-ok', 'hint-warn')
    } else if (count > 4) {
      hint.textContent = `Too many — deselect ${count - 4}`
      hint.classList.add('hint-warn')
      hint.classList.remove('hint-ok')
    } else if (!hasTopic) {
      hint.textContent = 'Enter a debate topic'
      hint.classList.remove('hint-ok', 'hint-warn')
    } else {
      hint.textContent = `${count} selected`
      hint.classList.add('hint-ok')
      hint.classList.remove('hint-warn')
    }
    startBtn.disabled = count < 2 || count > 4 || !hasTopic
    const topicBtn = container.querySelector('#suggest-topic-btn')
    if (topicBtn) topicBtn.disabled = count < 2 || count > 4
  }

  const charList   = container.querySelector('#char-list')
  const charFilter = container.querySelector('#char-filter')
  const topicInput = container.querySelector('#topic-input')

  topicInput.addEventListener('input', () => {
    topicErrorEl.textContent = ''
    updateHint()
  })

  const setupOr    = container.querySelector('.setup-or')
  const topicLabel = container.querySelector('.topic-label')
  const topicRow   = container.querySelector('.topic-row')
  const castSugg   = container.querySelector('#cast-suggestion')

  function setRestrictedMode(isRestricted) {
    [setupOr, charFilter, charList, hint, topicLabel, topicRow].forEach(el => {
      el.style.display = isRestricted ? 'none' : ''
    })
    if (isRestricted) castSugg.style.display = 'none'
    // castSugg is only re-shown by the suggest-cast button; never force it open here
    if (isRestricted) {
      startBtn.disabled = true
    } else {
      updateHint()
    }
  }

  updateHint()

  // ── Suggest cast ──────────────────────────────────────────────────────── //
  const suggestBtn     = container.querySelector('#suggest-btn')
  const castSuggestion = container.querySelector('#cast-suggestion')
  let suggestionActive = false

  suggestBtn.addEventListener('click', async () => {
    const topic = topicInput.value.trim()
    if (!topic) { topicInput.focus(); return }
    topicErrorEl.textContent = ''
    suggestBtn.disabled = true
    suggestBtn.textContent = 'thinking…'
    castSuggestion.innerHTML = '<div class="cs-loading">selecting the best minds for this topic…</div>'
    castSuggestion.style.display = ''
    try {
      const { picks } = await suggestCast(topic)
      if (!picks || !picks.length) return
      checkboxes.forEach(cb => { cb.checked = false })
      picks.forEach(({ name }) => {
        const cb = container.querySelector(`#char-list input[value="${CSS.escape(name)}"]`)
        if (cb) cb.checked = true
      })
      suggestionActive = true
      updateHint()
      castSuggestion.innerHTML =
        '<div class="cs-header">── suggested cast ──</div>' +
        picks.map(p =>
          `<div class="cs-pick">
            <span class="cs-name">${escHtml(p.name)}</span>
            <span class="cs-reason">${escHtml(p.reason)}</span>
          </div>`
        ).join('')
      castSuggestion.style.display = ''
      const firstRow = container.querySelector(`.char-card[data-name="${picks[0].name.toLowerCase()}"]`)
      if (firstRow) firstRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    } catch (e) {
      castSuggestion.style.display = 'none'
      topicErrorEl.textContent = e.message || 'Could not suggest a cast — please try again.'
    } finally {
      suggestBtn.disabled = false
      suggestBtn.textContent = 'Suggest cast ✦'
    }
  })

  // ── Suggest topic ─────────────────────────────────────────────────────── //
  const suggestTopicBtn  = container.querySelector('#suggest-topic-btn')
  const topicSuggestion  = container.querySelector('#topic-suggestion')

  suggestTopicBtn.addEventListener('click', async () => {
    const selected = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value)
    if (selected.length < 2) return
    suggestTopicBtn.disabled = true
    suggestTopicBtn.textContent = 'thinking…'
    topicSuggestion.innerHTML = '<div class="cs-loading">finding the perfect flashpoint…</div>'
    topicSuggestion.style.display = ''
    try {
      const { topic, reason } = await suggestTopic(selected)
      if (!topic) return
      topicInput.value = topic
      topicSuggestion.innerHTML =
        '<div class="cs-header">── suggested topic ──</div>' +
        `<div class="cs-pick">
          <span class="cs-name">${escHtml(topic)}</span>
          <span class="cs-reason">${escHtml(reason)}</span>
        </div>`
      topicSuggestion.style.display = ''
    } catch (e) {
      console.error('suggest topic failed', e)
      topicSuggestion.style.display = 'none'
    } finally {
      suggestTopicBtn.disabled = false
      suggestTopicBtn.textContent = 'Suggest topic ✦'
    }
  })

  checkboxes.forEach(cb => cb.addEventListener('change', () => {
    if (suggestionActive) {
      castSuggestion.style.display = 'none'
      suggestionActive = false
    }
    topicSuggestion.style.display = 'none'
    updateHint()
  }))

  function getToggles() {
    const audienceEl  = container.querySelector('input[name="audience"]:checked')
    const philEl      = container.querySelector('input[name="phil-length"]:checked')
    const commEl      = container.querySelector('input[name="comm-length"]:checked')
    const modEl       = container.querySelector('input[name="mod-length"]:checked')
    const formatEl    = container.querySelector('input[name="debate-format"]:checked')
    return {
      commentator:       true,
      moderator:         true,
      diagrams:          container.querySelector('#toggle-diagrams').checked,
      audienceLevel:     audienceEl ? audienceEl.value : 'university',
      philosopherLength: philEl    ? philEl.value     : 'normal',
      commentatorLength: commEl    ? commEl.value     : 'normal',
      moderatorLength:   modEl     ? modEl.value      : 'normal',
      debateFormat:      formatEl  ? formatEl.value   : '',
    }
  }

  startBtn.addEventListener('click', async () => {
    const selected = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value)
    const topic = container.querySelector('#topic-input').value.trim()
    topicErrorEl.textContent = ''
    startErrorEl.textContent = ''
    errorEl.textContent = ''
    const label = startBtn.textContent
    startBtn.disabled = true
    startBtn.textContent = 'opening…'
    try {
      await onStart({ characters: selected, topic, ...getToggles() })
    } catch {
      // error already shown via showError(); just restore the button
    } finally {
      if (document.contains(startBtn)) {
        startBtn.textContent = label
        updateHint()
      }
    }
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
  let topicHistory = []
  let historyIdx   = -1

  function getLevel() {
    const el = container.querySelector('input[name="audience"]:checked')
    return el ? el.value : 'university'
  }

  function getSelectedFormat() {
    const el = container.querySelector('input[name="debate-format"]:checked')
    return el ? el.value : ''
  }

  function topicsForLevel(level) {
    const fmt = getSelectedFormat()
    return allTopics.filter(t =>
      (fmt === 'oxford'     ? t.format === 'oxford'     :
       fmt === 'cable_news' ? t.format === 'cable_news' :
       t.format !== 'oxford' && t.format !== 'cable_news') &&
      (fmt === 'cable_news' || t.audience_level === level)
    )
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
    const color = catColors[topic.category] || 'var(--text-dim)'
    const isOxford    = topic.format === 'oxford'
    const isCableNews = topic.format === 'cable_news'

    dotdCard.classList.toggle('dotd-card--cable', isCableNews)

    const formatBadge = isOxford    ? '<span class="dotd-oxford">🎓 Oxford</span>'
                      : isCableNews ? ''
                      :               '<span class="dotd-freeform">Freeform</span>'
    const sourceBadge = isOxford ? '' : topic.source === 'curated'
      ? '<span class="dotd-curated">★ curated</span>'
      : '<span class="dotd-generated">AI</span>'
    const rolesHtml = topic.roles
      ? `<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${topic.roles.proposition.join(', ')}</span>
           <span class="dotd-role-opp">Against: ${topic.roles.opposition.join(', ')}</span>
         </div>`
      : `<div class="dotd-cast">${topic.characters.join(' · ')}</div>`

    const cableBreaking = isCableNews ? `
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>` : ''

    dotdCard.innerHTML = `
      ${cableBreaking}
      <div class="dotd-header">
        <span class="dotd-label">${isCableNews ? 'TONIGHT\'S SHOWDOWN' : '── SUGGESTED DEBATE ──'}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${color}">${topic.category.toUpperCase()}</span>
          ${formatBadge}
          ${sourceBadge}
        </span>
      </div>
      ${rolesHtml}
      <div class="dotd-topic">${escHtml(topic.topic)}</div>
      <div class="dotd-tagline">${escHtml(topic.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-prev" ${historyIdx <= 0 ? 'disabled' : ''}>← Prev</button>
        <button class="dotd-start-btn" id="dotd-start">${isCableNews ? '🔴 GO LIVE ▶' : 'Start this debate ▶'}</button>
        <button class="dotd-new-btn" id="dotd-next">Next →</button>
      </div>
    `
    dotdCard.querySelector('#dotd-start').addEventListener('click', () => {
      const fmt = isOxford ? 'oxford' : isCableNews ? 'cable_news' : ''
      onStart({ characters: topic.characters, topic: topic.topic, ...getToggles(), debateFormat: fmt, formatRoles: topic.roles || null })
    })
    dotdCard.querySelector('#dotd-prev').addEventListener('click', () => {
      if (historyIdx > 0) { historyIdx--; renderDotd(topicHistory[historyIdx]) }
    })
    dotdCard.querySelector('#dotd-next').addEventListener('click', () => {
      if (historyIdx < topicHistory.length - 1) {
        historyIdx++
        renderDotd(topicHistory[historyIdx])
      } else {
        const next = weightedPick(topicsForLevel(getLevel()), topicHistory[historyIdx])
        if (next) { topicHistory.push(next); historyIdx++; renderDotd(next) }
      }
    })
  }

  function loadSuggestion() {
    const pick = weightedPick(topicsForLevel(getLevel()))
    if (pick) { topicHistory = [pick]; historyIdx = 0; renderDotd(pick) }
    else dotdCard.style.display = 'none'
  }

  fetchTopics().then(topics => {
    allTopics = topics
    loadSuggestion()
  }).catch(() => {
    dotdCard.style.display = 'none'
  })

  // Re-pick when audience level or format changes
  container.querySelectorAll('input[name="audience"]').forEach(radio => {
    radio.addEventListener('change', loadSuggestion)
  })
  container.querySelectorAll('input[name="debate-format"]').forEach(radio => {
    radio.addEventListener('change', loadSuggestion)
  })

  // Expose a way to show errors without tearing down the screen.
  // Routes to the right element based on current mode.
  return {
    showError(msg) {
      if (setupBox.classList.contains('setup-box--advanced')) {
        startErrorEl.textContent = msg
        topicErrorEl.textContent = ''
      } else {
        topicErrorEl.textContent = msg
        startErrorEl.textContent = ''
      }
    },
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
