import './style.css'
import * as api from './api.js'
import * as setup from './setup.js'
import * as debate from './debate.js'

const app = document.querySelector('#app')

async function showSetup() {
  let characters, styles
  try {
    ;[characters, styles] = await Promise.all([api.fetchCharacters(), api.fetchStyles()])
  } catch (err) {
    app.innerHTML = `<div class="fatal-error">Could not reach the server.<br/>${err.message}</div>`
    return
  }

  const screen = setup.mount(app, characters, async ({ characters: chosen, topic }) => {
    try {
      const session = await api.createSession(chosen, topic)
      showDebate(session.session_id, chosen, topic, styles)
    } catch (err) {
      screen.showError(`Could not start session: ${err.message}`)
    }
  })
}

function showDebate(sessionId, participants, topic, styles) {
  debate.mount(app, sessionId, participants, topic, styles, {
    steer:          api.steer,
    cheat:          api.cheat,
    deleteSession:  api.deleteSession,
    newTopic:       api.newTopic,
    openStream:     api.openStream,
    searchEvidence: api.searchEvidence,
    fetchNewspaper: api.fetchNewspaper,
  })

  app.addEventListener('debate:quit', () => showSetup(), { once: true })
}

showSetup()
