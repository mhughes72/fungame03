import './style.css'
import * as api from './api.js'
import * as setup from './setup.js'
import * as debate from './debate.js'

const app = document.querySelector('#app')

let _features = {}

async function showSetup() {
  let characters, styles
  try {
    ;[characters, styles, _features] = await Promise.all([api.fetchCharacters(), api.fetchStyles(), api.fetchFeatures()])
  } catch (err) {
    app.innerHTML = `<div class="fatal-error">Could not reach the server.<br/>${err.message}</div>`
    return
  }

  const isLocal = !!_features.local

  const screen = setup.mount(app, characters, async ({
    characters: chosen,
    topic,
    commentator = true,
    moderator = true,
    diagrams = false,
    audienceLevel = 'university',
    philosopherLength = 'normal',
    commentatorLength = 'normal',
    moderatorLength = 'normal',
  }) => {
    try {
      const session = await api.createSession(chosen, topic, commentator, moderator, diagrams, audienceLevel, philosopherLength, commentatorLength, moderatorLength)
      showDebate(session.session_id, chosen, topic, styles)
    } catch (err) {
      screen.showError(`Could not start session: ${err.message}`)
    }
  }, { isLocal })
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
    exportPodcast:  _features.podcast ? api.exportPodcast : null,
    isLocal:        !!_features.local,
  })

  app.addEventListener('debate:quit', () => showSetup(), { once: true })
}

showSetup()
