/**
 * Debate timeline strip — heatmap of coloured blocks, one per turn.
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

  function heatLabel(h) {
    if (h <= 2) return 'cool'
    if (h <= 4) return 'warm'
    if (h <= 6) return 'charged'
    if (h <= 8) return 'heated'
    return 'flashpoint'
  }

  function addPoint({ turn, heat, agreements = 0 }) {
    const block = document.createElement('div')
    block.className = 'tl-block'
    block.style.background = heatColor(heat)

    if (agreements > 0) block.classList.add('tl-block--agreement')
    if (pendingSteer)    block.classList.add('tl-block--steered')

    const label = document.createElement('div')
    label.className = 'tl-block-label'
    label.textContent = turn
    block.appendChild(label)

    pendingSteer = false

    block.addEventListener('mouseenter', e => showTooltip(e, { turn, heat, agreements, steered: block.classList.contains('tl-block--steered') }))
    block.addEventListener('mouseleave', hideTooltip)

    canvas.appendChild(block)
    canvas.scrollLeft = canvas.scrollWidth
  }

  function markSteered() {
    pendingSteer = true
    const last = canvas.querySelector('.tl-block:last-child')
    if (last) last.classList.add('tl-block--steered')
  }

  function showTooltip(e, { turn, heat, agreements, steered }) {
    hideTooltip()
    tooltip = document.createElement('div')
    tooltip.className = 'tl-tooltip'
    tooltip.innerHTML =
      `<span class="tl-tt-turn">Turn ${turn}</span>` +
      `<span class="tl-tt-heat" style="color:${heatColor(heat)}">heat ${heat} — ${heatLabel(heat)}</span>` +
      (agreements > 0 ? `<span class="tl-tt-agree">+${agreements} agreement${agreements > 1 ? 's' : ''}</span>` : '') +
      (steered ? `<span class="tl-tt-steer">steered here</span>` : '')
    document.body.appendChild(tooltip)
    positionTooltip(e)
  }

  function positionTooltip(e) {
    if (!tooltip) return
    tooltip.style.left = (e.clientX + 12) + 'px'
    tooltip.style.top  = (e.clientY - 40) + 'px'
  }

  function hideTooltip() {
    if (tooltip) { tooltip.remove(); tooltip = null }
  }

  return { addPoint, markSteered }
}
