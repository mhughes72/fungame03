import './style.css'
import * as api from './api.js'
import * as setup from './setup.js'
import * as debate from './debate.js'

const app = document.querySelector('#app')

let _features = {}
let _skin     = {}

async function loadSkin() {
  const skinName = import.meta.env.VITE_SKIN || 'default'
  const [skinModule] = await Promise.all([
    import(`./skins/${skinName}/skin.js`),
    import(`./skins/${skinName}/theme.css`),
  ])
  return skinModule
}

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
    debateFormat = '',
    formatRoles = null,
  }) => {
    try {
      const session = await api.createSession(chosen, topic, commentator, moderator, diagrams, audienceLevel, philosopherLength, commentatorLength, moderatorLength, debateFormat, formatRoles)
      showDebate(session.session_id, chosen, topic, styles)
    } catch (err) {
      screen.showError(`Could not start session: ${err.message}`)
    }
  }, { isLocal, skin: _skin })
}

function showDebate(sessionId, participants, topic, styles) {
  debate.mount(app, sessionId, participants, topic, styles, {
    skin:           _skin,
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

loadSkin()
  .then(skinModule => { _skin = skinModule })
  .catch(() => { /* skin load failure is non-fatal — defaults apply */ })
  .finally(() => showSetup())
