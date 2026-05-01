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

export async function fetchDebateOfTheDay(index = 0) {
  const res = await fetch(`${BASE}/debate-of-the-day?index=${index}`)
  if (!res.ok) throw new Error('Failed to load debate of the day')
  return res.json()   // { characters, topic, tagline, category, index, total }
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

export async function createSession(characters, topic) {
  return post('/sessions', { characters, topic })   // { session_id, participants, topic }
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
