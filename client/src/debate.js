/**
 * Debate screen — two-pane layout with real message rendering.
 *
 * mount(container, sessionId, participants, topic, styles, api)
 *   styles : [{ style, description }] from /api/styles
 *   api    : { steer, deleteSession, newTopic, openStream }
 */

import { open as openSteerModal } from './steer.js'
import * as Seating from './seating.js'

export function mount(container, sessionId, participants, topic, styles, api) {
  container.innerHTML = `
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${escHtml(topic)}</span>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

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

  let currentStyle = 'socratic'
  let closeStream  = null
  let lastState    = { turn: 0, heat: 0, partial_agreements: [], remaining_disagreements: [], drift_topic: '' }

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

      case 'state':
        currentStyle = data.moderator_style
        lastState = data
        renderSidebar(sidebar, { topic, ...data })
        break

      case 'steer_needed':
        currentStyle = data.current_style
        if (data.drift_topic) {
          appendSystem(convoPane,
            `── DRIFT ── conversation has shifted to: ${data.drift_topic}`)
          appendSystem(convoPane,
            `   original topic: ${topic}`)
        }
        openSteerModal(currentStyle, styles, debateSummary(lastState, participants), leftCol).then(result => {
          if (result === null) {
            quit()
          } else {
            api.steer(sessionId, result.text, result.style)
              .catch(err => appendSystem(convoPane, `Steer error: ${err.message}`))
          }
        })
        break

      case 'consensus':
        clearTyping(convoPane)
        seating.clearAll()
        appendConsensus(convoPane, data, {
          onNewTopic(newTopic) {
            api.newTopic(sessionId, newTopic)
              .catch(err => appendSystem(convoPane, `Error: ${err.message}`))
          },
          onQuit: quit,
        })
        break

      case 'bar_beat':
        appendBarBeat(convoPane, data.text)
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

  container.querySelector('#quit-btn').addEventListener('click', quit)

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
    div.className = 'msg msg-philosopher'
    div.innerHTML =
      `<div class="msg-name">${escHtml(name)}</div>` +
      `<div class="msg-content">${renderContent(content)}</div>`
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

function appendConsensus(el, { summary, points }, { onNewTopic, onQuit }) {
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
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
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
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${heatColor}">${filled}</span><span class="sb-heat-empty">${empty}</span>
        <span class="sb-heat-label" style="color:${heatColor}">${heatLabel}</span>
      </div>
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
  return escHtml(text)
    .replace(/\n/g, '<br>')
    .replace(/\*\[([^\]]+)\]\*/g, '<em class="stage-dir">[$1]</em>')
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
