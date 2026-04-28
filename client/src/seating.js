/**
 * Participant avatar strip — compact row in the debate header.
 *
 * create(container, participants) → { setThinking, setSpeaking, clearAll }
 *
 * States per seat:
 *   default   — dim, no ring
 *   thinking  — pulsing gold ring (speaker is generating)
 *   speaking  — solid gold ring (just spoke), auto-clears after 3s
 */

export function create(container, participants) {
  container.innerHTML = participants.map(name => {
    const img  = portraitUrl(name)
    const init = initials(name)
    return `
      <div class="seat" id="seat-${slug(name)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${img}" alt="${escHtml(name)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${escHtml(init)}</div>
        </div>
        <div class="seat-name">${escHtml(lastName(name))}</div>
      </div>
    `
  }).join('')

  let clearTimer = null

  function getSeat(name) {
    return container.querySelector(`#seat-${slug(name)}`)
  }

  function clearAll() {
    clearTimeout(clearTimer)
    container.querySelectorAll('.seat').forEach(el => {
      el.classList.remove('seat-thinking', 'seat-speaking')
    })
  }

  function setThinking(name) {
    clearAll()
    getSeat(name)?.classList.add('seat-thinking')
  }

  function setSpeaking(name) {
    clearAll()
    const el = getSeat(name)
    if (el) {
      el.classList.add('seat-speaking')
      clearTimer = setTimeout(() => el.classList.remove('seat-speaking'), 3000)
    }
  }

  return { setThinking, setSpeaking, clearAll }
}


// ── helpers ───────────────────────────────────────────────────────────── //

function portraitUrl(name) {
  return `/portraits/${name.replace(/ /g, '_')}.png`
}

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function lastName(name) {
  return name.split(' ').at(-1)
}

function slug(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
