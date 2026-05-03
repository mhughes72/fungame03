/**
 * Thin wrappers around fetch + EventSource.
 * All paths are relative so the Vite proxy routes them to localhost:8000.
 */

const BASE = '/api'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

async function del(path) {
  await fetch(`${BASE}${path}`, { method: 'DELETE' })
}

export async function fetchTopics(level = null) {
  const url = level ? `${BASE}/topics?level=${encodeURIComponent(level)}` : `${BASE}/topics`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load topics')
  return res.json()   // [{ id, topic, tagline, characters, category, theme, audience_level, source, ... }]
}

export async function fetchCharacters() {
  const res = await fetch(`${BASE}/characters`)
  if (!res.ok) throw new Error('Failed to load characters')
  return res.json()   // [{ name, era, known_for }]
}

export async function fetchStyles() {
  const res = await fetch(`${BASE}/styles`)
  if (!res.ok) throw new Error('Failed to load styles')
  return res.json()   // [{ style, description }]
}

export async function fetchFeatures() {
  const res = await fetch(`${BASE}/features`)
  if (!res.ok) return {}   // graceful degradation — hide optional features
  return res.json()   // { podcast: bool }
}

export async function createSession(characters, topic, commentator = true, moderator = true, diagrams = false, audienceLevel = 'university', philosopherLength = 'normal', commentatorLength = 'normal', moderatorLength = 'normal', debateFormat = '', formatRoles = null) {
  return post('/sessions', {
    characters, topic,
    commentator_enabled: commentator,
    moderator_enabled: moderator,
    diagrams_enabled: diagrams,
    audience_level: audienceLevel,
    philosopher_length: philosopherLength,
    commentator_length: commentatorLength,
    moderator_length: moderatorLength,
    debate_format: debateFormat,
    format_roles: formatRoles,
  })
}

export async function steer(sessionId, text, style, evidence = '', drinks = {}) {
  return post(`/sessions/${sessionId}/steer`, { text, style, evidence, drinks })
}

export async function searchEvidence(query) {
  return post('/search', { query })   // { finding, source }
}

export async function newTopic(sessionId, topic) {
  return post(`/sessions/${sessionId}/new-topic`, { topic })
}

export async function deleteSession(sessionId) {
  return del(`/sessions/${sessionId}`)
}

export async function fetchNewspaper(sessionId) {
  return post(`/sessions/${sessionId}/newspaper`, {})
}

export async function exportPodcast(sessionId) {
  const resp = await fetch(`/api/sessions/${sessionId}/podcast`, { method: 'POST' })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: resp.statusText }))
    throw new Error(err.detail || resp.statusText)
  }
  const blob = await resp.blob()
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `philosophers-bar-podcast.mp3`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function cheat(sessionId, heat, drinks = {}) {
  const body = { drinks }
  if (heat !== null) body.heat = heat
  return post(`/sessions/${sessionId}/cheat`, body)
}

/**
 * Open an SSE stream for a session.
 *
 * @param {string} sessionId
 * @param {(event: {type: string, data: object}) => void} onEvent
 * @returns {() => void}  close() — call to disconnect
 */
export function openStream(sessionId, onEvent) {
  const es = new EventSource(`${BASE}/sessions/${sessionId}/stream`)

  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data)
      onEvent(parsed)
    } catch {
      console.error('Unparseable SSE frame:', e.data)
    }
  }

  es.onerror = (e) => {
    console.error('SSE error', e)
    onEvent({ type: 'error', data: { text: 'Connection lost.' } })
  }

  return () => es.close()
}
