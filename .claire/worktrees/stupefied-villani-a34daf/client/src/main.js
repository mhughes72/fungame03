import './style.css'
import * as api from './api.js'
import * as setup from './setup.js'
import * as debate from './debate.js'

const app = document.querySelector('#app')

async function showSetup() {
  let characters
  try {
    characters = await api.fetchCharacters()
  } catch (err) {
    app.innerHTML = `<div class="fatal-error">Could not reach the server.<br/>${err.message}</div>`
    return
  }

  const screen = setup.mount(app, characters, async ({ characters: chosen, topic }) => {
    try {
      const session = await api.createSession(chosen, topic)
      showDebate(session.session_id, chosen, topic)
    } catch (err) {
      screen.showError(`Could not start session: ${err.message}`)
    }
  })
}

function showDebate(sessionId, participants, topic) {
  let closeStream

  const handle = debate.mount(app, sessionId, participants, topic, {
    steer: api.steer,
    deleteSession: api.deleteSession,
    openStream: (id, onEvent) => {
      closeStream = api.openStream(id, onEvent)
      return closeStream
    },
  })

  app.addEventListener('debate:quit', () => {
    if (closeStream) closeStream()
    showSetup()
  }, { once: true })
}

showSetup()
