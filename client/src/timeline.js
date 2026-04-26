/**
 * Debate timeline strip — fixed-height bar chart below the conversation pane.
 * create(container) → { addPoint({turn, heat, agreements, steered}), markSteered() }
 */

export function create(container) {
  container.innerHTML = ''

  const canvas = document.createElement('div')
  canvas.className = 'tl-canvas'
  container.appendChild(canvas)

  let pendingSteer = false
  let tooltip = null

  function heatColor(h) {
    if (h <= 2) return '#4a7ab5'
    if (h <= 4) return '#8a9040'
    if (h <= 6) return '#c8a030'
    if (h <= 8) return '#c86030'
    return '#c83030'
  }

  function addPoint({ turn, heat, agreements = 0, steered = false }) {
    const col = document.createElement('div')
    col.className = 'tl-turn'

    const steerTick = document.createElement('div')
    steerTick.className = 'tl-steer-tick' + (pendingSteer ? ' tl-steer-tick--active' : '')
    col.appendChild(steerTick)

    const bar = document.createElement('div')
    bar.className = 'tl-bar'
    const pct = Math.max(4, (heat / 10) * 100)
    bar.style.height = pct + '%'
    bar.style.background = heatColor(heat)
    col.appendChild(bar)

    const dot = document.createElement('div')
    dot.className = 'tl-dot' + (agreements > 0 ? ' tl-dot--active' : '')
    col.appendChild(dot)

    pendingSteer = false

    // tooltip
    col.addEventListener('mouseenter', e => showTooltip(e, { turn, heat, agreements, steered: steerTick.classList.contains('tl-steer-tick--active') }))
    col.addEventListener('mouseleave', hideTooltip)

    canvas.appendChild(col)
    canvas.scrollLeft = canvas.scrollWidth
  }

  function markSteered() {
    pendingSteer = true
    // mark the most recent bar too
    const last = canvas.querySelector('.tl-turn:last-child .tl-steer-tick')
    if (last) last.classList.add('tl-steer-tick--active')
  }

  function showTooltip(e, { turn, heat, agreements, steered }) {
    hideTooltip()
    tooltip = document.createElement('div')
    tooltip.className = 'tl-tooltip'
    const heatLabels = ['', '', 'cool', '', 'warm', '', 'charged', '', 'heated', '', 'flashpoint']
    const label = heatLabels[heat] || ''
    tooltip.innerHTML =
      `<span class="tl-tt-turn">Turn ${turn}</span>` +
      `<span class="tl-tt-heat" style="color:${heatColor(heat)}">heat ${heat} — ${label}</span>` +
      (agreements > 0 ? `<span class="tl-tt-agree">+${agreements} agreement${agreements > 1 ? 's' : ''}</span>` : '') +
      (steered ? `<span class="tl-tt-steer">steered here</span>` : '')
    document.body.appendChild(tooltip)
    positionTooltip(e)
  }

  function positionTooltip(e) {
    if (!tooltip) return
    const x = e.clientX
    const y = e.clientY
    tooltip.style.left = (x + 12) + 'px'
    tooltip.style.top  = (y - 40) + 'px'
  }

  function hideTooltip() {
    if (tooltip) { tooltip.remove(); tooltip = null }
  }

  return { addPoint, markSteered }
}
