/**
 * Debate screen — two-pane layout with real message rendering.
 *
 * mount(container, sessionId, participants, topic, styles, api)
 *   styles : [{ style, description }] from /api/styles
 *   api    : { steer, deleteSession, newTopic, openStream }
 */

import { open as openSteerModal } from './steer.js'
import { open as openCheatModal } from './cheat.js'
import * as Seating from './seating.js'
import { openAbout, openHelp } from './info.js'

export function mount(container, sessionId, participants, topic, styles, api) {
  container.innerHTML = `
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${escHtml(topic)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="cheat-btn" id="cheat-btn">Cheat</button>
        <button class="sidebar-toggle-btn" id="sidebar-toggle">Stats</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `

  const seatsBar  = container.querySelector('#seats-bar')
  const convoPane = container.querySelector('#convo-pane')
  const sidebar   = container.querySelector('#sidebar')
  const leftCol   = container.querySelector('#left-col')

  let currentStyle      = 'socratic'
  let currentHeat       = 0
  let closeStream       = null
  let gameEnded         = false
  let steerModalPending = false
  let lastState    = { turn: 0, heat: 0, concession_total: 0, partial_agreements: [], remaining_disagreements: [], drift_topic: '' }

  const seating = Seating.create(seatsBar, participants)
  renderSidebar(sidebar, {
    topic,
    turn: 0,
    heat: 0,
    moderator_style: 'socratic',
    partial_agreements: [],
    points_of_agreement: [],
    remaining_disagreements: [],
  })

  // ── event handler ──────────────────────────────────────────────────── //

  function onEvent({ type, data }) {
    switch (type) {
      case 'speaker':
        seating.setThinking(data.name)
        showTyping(convoPane, data.name)
        break

      case 'message':
        clearTyping(convoPane)
        if (!data.backchannel) seating.setSpeaking(data.name)
        appendMessage(convoPane, data)
        break

      case 'bars':
        currentHeat = data.heat ?? currentHeat
        updateBars(sidebar, data.heat, data.concession_total ?? 0)
        break

      case 'debug': {
        const payload = data.data != null ? data.data : ''
        const detail = typeof payload === 'object'
          ? '\n' + Object.entries(payload).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`).join('\n')
          : (payload ? ` — ${payload}` : '')
        console.log(`[${data.channel}] ${data.label}${detail}`)
        break
      }

      case 'state':
        currentStyle = data.moderator_style
        currentHeat  = data.heat ?? currentHeat
        lastState = data
        renderSidebar(sidebar, { topic, ...data })
        break

      case 'steer_needed':
        if (steerModalPending) break
        steerModalPending = true
        currentStyle = data.current_style
        if (data.drift_topic) {
          appendSystem(convoPane,
            `── DRIFT ── conversation has shifted to: ${data.drift_topic}`)
          appendSystem(convoPane,
            `   original topic: ${topic}`)
        }
        convoPane.scrollTop = convoPane.scrollHeight
        openSteerModal(currentStyle, styles, debateSummary(lastState, participants), leftCol, api.searchEvidence, participants).then(result => {
          steerModalPending = false
          if (result === null) {
            appendGameOver(convoPane, lastState, participants, quit, sessionId, api)
          } else {
            currentStyle = result.style
            renderSidebar(sidebar, { topic, ...lastState, moderator_style: result.style })
            api.steer(sessionId, result.text, result.style, result.evidence || '', result.drinks || {})
              .catch(err => appendSystem(convoPane, `Steer error: ${err.message}`))
          }
        })
        break

      case 'consensus':
        if (gameEnded) break
        gameEnded = true
        if (closeStream) { closeStream(); closeStream = null }
        clearTyping(convoPane)
        seating.clearAll()
        appendConsensus(convoPane, data, {
          onNewTopic(newTopic) {
            api.newTopic(sessionId, newTopic)
              .then(() => {
                gameEnded = false
                lastState = { turn: 0, heat: 0, concession_total: 0, partial_agreements: [], remaining_disagreements: [], drift_topic: '' }
                container.querySelector('.debate-topic').textContent = newTopic
                renderSidebar(sidebar, { topic: newTopic, ...lastState, moderator_style: currentStyle, points_of_agreement: [] })
                seating.clearAll()
                closeStream = api.openStream(sessionId, onEvent)
              })
              .catch(err => appendSystem(convoPane, `Error: ${err.message}`))
          },
          onQuit: quit,
        }, lastState, sessionId, api, participants)
        break

      case 'game_over':
        if (gameEnded) break
        gameEnded = true
        if (closeStream) { closeStream(); closeStream = null }
        clearTyping(convoPane)
        seating.clearAll()
        appendGameOver(convoPane, data, participants, quit, sessionId, api)
        break

      case 'bar_beat':
        appendBarBeat(convoPane, data.text)
        break

      case 'evidence':
        appendEvidence(convoPane, data.finding)
        break

      case 'system':
        appendSystem(convoPane, data.text)
        break

      case 'error':
        appendSystem(convoPane, `⚠ ${data.text}`)
        break
    }
  }

  // ── quit ───────────────────────────────────────────────────────────── //

  function quit() {
    if (closeStream) closeStream()
    api.deleteSession(sessionId).catch(() => {})
    container.dispatchEvent(new CustomEvent('debate:quit', { bubbles: true }))
  }

  container.querySelector('#about-btn').addEventListener('click', openAbout)
  container.querySelector('#help-btn').addEventListener('click', openHelp)
  container.querySelector('#sidebar-toggle').addEventListener('click', () => {
    const shell = container.querySelector('.debate-shell')
    const open = shell.classList.toggle('sidebar-open')
    container.querySelector('#sidebar-toggle').textContent = open ? 'Stats ▲' : 'Stats'
  })
  container.querySelector('#cheat-btn').addEventListener('click', () => {
    openCheatModal(sessionId, currentHeat, participants, api.cheat)
  })

  container.querySelector('#quit-btn').addEventListener('click', () => {
    if (gameEnded) { quit(); return }
    if (lastState.turn > 0) {
      gameEnded = true
      if (closeStream) { closeStream(); closeStream = null }
      appendGameOver(convoPane, lastState, participants, quit, sessionId, api)
    } else {
      quit()
    }
  })

  // ── open stream ────────────────────────────────────────────────────── //

  closeStream = api.openStream(sessionId, onEvent)
}


// ── message rendering ────────────────────────────────────────────────── //

function appendMessage(el, { role, name, content, backchannel }) {
  const div = document.createElement('div')

  if (backchannel) {
    div.className = 'msg msg-bc'
    div.innerHTML =
      `<span class="bc-name">${escHtml(name)}:</span> ` +
      `<em>${renderContent(content)}</em>`
  } else if (role === 'moderator') {
    div.className = 'msg msg-moderator'
    div.innerHTML =
      `<div class="msg-mod-label">― Moderator ―</div>` +
      `<div class="msg-content">${renderContent(content)}</div>`
  } else if (role === 'user') {
    div.className = 'msg msg-user'
    div.innerHTML =
      `<div class="msg-name msg-name-user">You</div>` +
      `<div class="msg-content">${renderContent(content)}</div>`
  } else {
    const imgSrc  = `/portraits/${name.replace(/ /g, '_')}.png`
    const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    div.className = 'msg msg-philosopher'
    div.innerHTML =
      `<div class="msg-avatar">` +
        `<img class="msg-avatar-img" src="${imgSrc}" alt="${escHtml(name)}"` +
             ` onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` +
        `<div class="msg-avatar-initials" style="display:none">${escHtml(initials)}</div>` +
      `</div>` +
      `<div class="msg-body">` +
        `<div class="msg-name">${escHtml(name)}</div>` +
        `<div class="msg-content">${renderContent(content)}</div>` +
      `</div>`
  }

  scrollAppend(el, div)
}

function appendBarBeat(el, text) {
  const div = document.createElement('div')
  div.className = 'msg msg-beat'
  div.innerHTML = renderContent(text)
  scrollAppend(el, div)
}

function appendSystem(el, text) {
  const div = document.createElement('div')
  div.className = 'msg msg-system'
  div.textContent = text
  scrollAppend(el, div)
}

function appendEvidence(el, finding) {
  const div = document.createElement('div')
  div.className = 'msg msg-evidence'
  div.innerHTML = `<span class="evidence-label">── EVIDENCE ──</span> ${escHtml(finding)}`
  scrollAppend(el, div)
}

function appendConsensus(el, { summary, points }, { onNewTopic, onQuit }, state = {}, sessionId, api, participants = []) {
  const div = document.createElement('div')
  div.className = 'consensus-panel'
  div.innerHTML = `
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${escHtml(summary)}</div>
    ${points.length ? `
      <ul class="consensus-points">
        ${points.map(p => `<li>${escHtml(p)}</li>`).join('')}
      </ul>
    ` : ''}
    ${_debateStats(state)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `
  scrollAppend(el, div)

  const input = div.querySelector('#consensus-topic-input')
  input.focus()

  div.querySelector('#consensus-continue').addEventListener('click', () => {
    const t = input.value.trim()
    if (t) onNewTopic(t)
  })
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const t = input.value.trim()
      if (t) onNewTopic(t)
    }
  })
  div.querySelector('#consensus-end').addEventListener('click', onQuit)
  div.querySelector('#consensus-paper').addEventListener('click', () => openNewspaper(sessionId, api, participants))
}

function appendGameOver(el, state, participants, onQuit, sessionId, api) {
  clearTyping(el)
  const div = document.createElement('div')
  div.className = 'game-over-panel'
  const turn = state.turn || 0
  const subtitle = turn
    ? `${turn} turn${turn !== 1 ? 's' : ''} — no consensus reached`
    : 'The evening ends before it really began.'
  div.innerHTML = `
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${escHtml(subtitle)}</div>
    ${_debateStats(state)}
    <div class="game-over-actions">
      ${sessionId ? `<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>` : ''}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `
  scrollAppend(el, div)
  div.querySelector('#game-over-leave').addEventListener('click', onQuit)
  if (sessionId) div.querySelector('#game-over-paper')?.addEventListener('click', () => openNewspaper(sessionId, api, participants))
}

// ── newspaper modal ──────────────────────────────────────────────────── //

async function openNewspaper(sessionId, api, participants = []) {
  const overlay = document.createElement('div')
  overlay.className = 'newspaper-overlay'
  overlay.innerHTML = `
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `
  document.body.appendChild(overlay)

  let paper
  try {
    paper = await api.fetchNewspaper(sessionId)
  } catch (err) {
    overlay.remove()
    alert(`Could not print the paper: ${err.message}`)
    return
  }

  overlay.innerHTML = `
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${escHtml(paper.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${escHtml(paper.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${escHtml(paper.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${escHtml(paper.headline)}</div>
        <div class="newspaper-subhead">${escHtml(paper.subheadline)}</div>

        ${participants.length ? `
        <div class="newspaper-portrait-strip">
          ${participants.map(p => `
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(p.replace(/ /g, '_'))}.png"
                   alt="${escHtml(p)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${escHtml(p)}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${escHtml(paper.lede)}</p>
            <p class="newspaper-body">${escHtml(paper.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${escHtml(paper.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${escHtml(paper.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${escHtml(paper.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${escHtml(paper.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `

  overlay.querySelector('#newspaper-close').addEventListener('click', () => overlay.remove())
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove() })

  overlay.querySelector('#newspaper-download').addEventListener('click', () => {
    const pageHtml = overlay.querySelector('.newspaper-page').outerHTML
    const styleHref = document.querySelector('link[rel=stylesheet]')?.href || ''
    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${escHtml(paper.newspaper_name)}</title>
${styleHref ? `<link rel="stylesheet" href="${styleHref}">` : ''}
<style>
  body { margin: 0; background: #f2ebd4; }
  .newspaper-page { max-width: 760px; margin: 0 auto; padding: 2.5rem 2.5rem 2rem; }
  @media print { body { margin: 0; } }
</style>
</head><body>${pageHtml}</body></html>`)
    win.document.close()
    win.addEventListener('load', () => { win.focus(); win.print() })
  })
}

function _debateStats(state) {
  const {
    turn = 0,
    heat = 0,
    partial_agreements = [],
    points_of_agreement = [],
    remaining_disagreements = [],
  } = state

  if (!turn) return ''

  const heatLabel = heatLabel_(heat)
  const heatColor = heatColor_(heat)
  const filled = '█'.repeat(heat)
  const empty  = '░'.repeat(10 - heat)

  let html = `<div class="report-stats">`
  html += `<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${turn}</span>
  </div>`
  html += `<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${heatColor}">${filled}<span style="color:var(--text-dim)">${empty}</span> ${heatLabel}</span>
  </div>`

  if (points_of_agreement.length) {
    html += `<div class="report-section-label">agreements reached</div>`
    html += points_of_agreement.map(p =>
      `<div class="report-agree-item">✓ ${escHtml(p)}</div>`
    ).join('')
  }

  if (partial_agreements.length) {
    html += `<div class="report-section-label">alignments that formed</div>`
    html += partial_agreements.map(a =>
      `<div class="report-partial"><span class="report-partial-names">${escHtml(a.participants.join(' + '))}</span> — <span class="report-partial-on">${escHtml(a.on)}</span></div>`
    ).join('')
  }

  if (remaining_disagreements.length) {
    html += `<div class="report-section-label">still unresolved</div>`
    html += remaining_disagreements.map(t => {
      if (typeof t === 'object' && t !== null) {
        return `<div class="report-tension">
          <span class="report-tension-topic">${escHtml(t.topic)}</span>
          <span class="report-tension-stance">${escHtml(t.participant_a)}: ${escHtml(t.stance_a)}</span>
          <span class="report-tension-stance">${escHtml(t.participant_b)}: ${escHtml(t.stance_b)}</span>
        </div>`
      }
      return `<div class="report-tension">${escHtml(String(t))}</div>`
    }).join('')
  }

  html += `</div>`
  return html
}

function showTyping(el, name) {
  clearTyping(el)
  const div = document.createElement('div')
  div.className = 'msg msg-typing'
  div.id = 'typing-indicator'
  div.innerHTML =
    `<span class="typing-name">${escHtml(name)}</span>` +
    `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`
  scrollAppend(el, div)
}

function clearTyping(el) {
  el.querySelector('#typing-indicator')?.remove()
}


// ── sidebar ───────────────────────────────────────────────────────────── //

function renderSidebar(el, state) {
  const {
    topic,
    turn = 0,
    heat = 0,
    concession_total = 0,
    moderator_style = 'socratic',
    partial_agreements = [],
    points_of_agreement = [],
    remaining_disagreements = [],
  } = state

  const heatColor = heatColor_(heat)
  const heatLabel = heatLabel_(heat)
  const filled = '█'.repeat(heat)
  const empty  = '░'.repeat(10 - heat)

  let html = `
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${escHtml(topic)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${turn}</div>
  `

  if (points_of_agreement.length) {
    html += `
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${points_of_agreement.map(p =>
          `<div class="sb-agree-item">✓ ${escHtml(p)}</div>`
        ).join('')}
      </div>
    `
  }

  if (partial_agreements.length) {
    html += `
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${partial_agreements.map(a => `
          <div class="sb-partial">
            <div class="sb-partial-names">${escHtml(a.participants.join(' + '))}</div>
            <div class="sb-partial-on">${escHtml(a.on)}</div>
          </div>
        `).join('')}
      </div>
    `
  }

  if (remaining_disagreements.length) {
    html += `
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${remaining_disagreements.map(t => {
          if (typeof t === 'object' && t !== null) {
            return `
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${escHtml(t.topic)}</div>
                <div class="sb-tension-stance">${escHtml(t.participant_a)}: ${escHtml(t.stance_a)}</div>
                <div class="sb-tension-stance">${escHtml(t.participant_b)}: ${escHtml(t.stance_b)}</div>
              </div>
            `
          }
          return `<div class="sb-tension">• ${escHtml(String(t))}</div>`
        }).join('')}
      </div>
    `
  }

  html += `
    <div class="sb-section" id="sb-bars">
      ${barsHtml_(heat, concession_total)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${escHtml(moderator_style)}</div>
    </div>
  `

  el.innerHTML = html
}


// ── helpers ───────────────────────────────────────────────────────────── //

function renderContent(text) {
  const escaped = escHtml(text)

  // *[action]* → stage direction (keep brackets)
  // *anything else* → stage direction (add brackets)
  const result = escaped
    .replace(/\*\[([^\]]+)\]\*/g, '<em class="stage-dir">[$1]</em>')
    .replace(/\*([^*\n]+)\*/g, '<em class="stage-dir">[$1]</em>')

  return result.replace(/\n/g, '<br>')
}

function scrollAppend(el, child) {
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  el.appendChild(child)
  if (nearBottom) el.scrollTop = el.scrollHeight
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function barsHtml_(heat, concessionTotal) {
  const heatColor = heatColor_(heat)
  const heatLabel = heatLabel_(heat)
  const hFilled = '█'.repeat(heat)
  const hEmpty  = '░'.repeat(10 - heat)

  const capped    = Math.min(concessionTotal, 10)
  const cColor    = concessionColor_(concessionTotal)
  const cFilled   = '█'.repeat(capped)
  const cEmpty    = '░'.repeat(10 - capped)
  const cLabel    = concessionLabel_(concessionTotal)

  return `
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${heatColor}">${hFilled}</span><span class="sb-heat-empty">${hEmpty}</span>
      <span class="sb-heat-label" style="color:${heatColor}">${heatLabel}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${cColor}">${cFilled}</span><span class="sb-heat-empty">${cEmpty}</span>
      <span class="sb-heat-label" style="color:${cColor}">${cLabel} (${concessionTotal})</span>
    </div>
  `
}

function updateBars(sidebar, heat, concessionTotal) {
  const el = sidebar.querySelector('#sb-bars')
  if (el) el.innerHTML = barsHtml_(heat, concessionTotal)
}

function heatColor_(h) {
  if (h <= 2) return '#4a7ab5'
  if (h <= 4) return '#8a9040'
  if (h <= 6) return '#c8a030'
  if (h <= 8) return '#c86030'
  return '#c83030'
}

function heatLabel_(h) {
  if (h <= 2) return 'cool'
  if (h <= 4) return 'warm'
  if (h <= 6) return 'charged'
  if (h <= 8) return 'heated'
  return 'flashpoint'
}

function concessionColor_(n) {
  if (n <= 2) return '#4a7ab5'
  if (n <= 5) return '#4a9b6f'
  if (n <= 8) return '#6abf8a'
  return '#a8e6bf'
}

function concessionLabel_(n) {
  if (n === 0) return 'none'
  if (n <= 2) return 'rare'
  if (n <= 5) return 'some'
  if (n <= 8) return 'frequent'
  return 'flowing'
}

function debateSummary(state, participants) {
  const { turn, heat, partial_agreements, remaining_disagreements, drift_topic } = state

  if (!turn) return 'The debate is just getting started.'

  if (drift_topic) {
    return `The conversation has drifted from the original topic toward ${drift_topic}.`
  }

  const agreements = partial_agreements || []
  const tensions   = remaining_disagreements || []

  if (agreements.length && tensions.length) {
    const a = agreements[0]
    const t = tensions[0]
    const aNames = a.participants.join(' and ')
    const tTopic = typeof t === 'object' ? t.topic : String(t)
    return `${aNames} are finding common ground, but the group remains divided on ${tTopic}.`
  }

  if (agreements.length) {
    const a = agreements[0]
    return `${a.participants.join(' and ')} are converging on ${a.on}, ${heat >= 6 ? 'though tempers are running high' : 'with the room following closely'}.`
  }

  if (tensions.length) {
    const t = tensions[0]
    if (typeof t === 'object') {
      return `${t.participant_a} and ${t.participant_b} are sharply divided over ${t.topic}.`
    }
    return `The room is deadlocked — ${String(t)}.`
  }

  const heatPhrase = heat >= 8 ? 'at flashpoint' : heat >= 5 ? 'heating up' : heat >= 3 ? 'warming up' : 'still feeling each other out'
  return `${turn} turns in, no clear alignments yet — the room is ${heatPhrase}.`
}
