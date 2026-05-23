/**
 * Debate transcript PDF generator.
 * Loaded lazily so jsPDF only enters the bundle on first download click.
 */

const W = 210, H = 297
const ML = 18, MR = 18, MT = 22, MB = 22
const CW = W - ML - MR  // 174 mm

const HEAT_LABEL = ['', 'cool', 'cool', 'warming', 'warming', 'heated', 'heated', 'fiery', 'fiery', 'flashpoint', 'flashpoint']

export async function downloadTranscript({ topic, participants, format, transcript, state, oxfordVerdict, cableReport }) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  let y = MT
  let pageCount = 1

  // ── page helpers ───────────────────────────────────────────────────────

  function newPage() {
    doc.addPage()
    pageCount++
    y = MT
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(170, 170, 170)
    doc.text(String(pageCount), W - MR, H - 10, { align: 'right' })
  }

  function check(needed = 8) {
    if (y + needed > H - MB) newPage()
  }

  function hRule(r = 180, g = 180, b = 180) {
    doc.setDrawColor(r, g, b)
    doc.line(ML, y, W - MR, y)
    y += 3
  }

  function gap(mm = 4) { y += mm }

  function sectionLabel(text, r = 100, g = 100, b = 100) {
    gap(2)
    check(12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(r, g, b)
    doc.text(text, ML, y)
    y += 4
    hRule(r, g, b)
    gap(2)
  }

  // ── page 1 number ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(170, 170, 170)
  doc.text('1', W - MR, H - 10, { align: 'right' })

  // ── cover ─────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(25, 25, 25)
  doc.text("THE PHILOSOPHER'S BAR", ML, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(130, 130, 130)
  doc.text('Debate Transcript', ML, y)
  y += 6

  hRule(60, 60, 60)
  gap(2)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(20, 20, 20)
  const topicLines = doc.splitTextToSize(topic, CW)
  doc.text(topicLines, ML, y)
  y += topicLines.length * 5.5 + 3

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const fmtLabel = format === 'oxford' ? 'Oxford' : format === 'cable_news' ? 'Cable News' : 'Freeform'
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Format: ${fmtLabel}`, ML, y)
  doc.text(dateStr, W - MR, y, { align: 'right' })
  y += 5

  const castLines = doc.splitTextToSize(`Participants: ${participants.join(', ')}`, CW)
  doc.setTextColor(60, 60, 60)
  doc.text(castLines, ML, y)
  y += castLines.length * 4.5 + 6

  hRule()

  // ── transcript ────────────────────────────────────────────────────────
  sectionLabel('TRANSCRIPT')

  let turnNum = 0

  for (const entry of transcript) {
    const text = stripMarkers(entry.content || '')

    // Atmosphere beat
    if (entry.type === 'beat') {
      const lines = doc.splitTextToSize(text, CW - 6)
      check(lines.length * 4 + 3)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7.5)
      doc.setTextColor(160, 130, 70)
      doc.text(lines, ML + 6, y)
      y += lines.length * 4 + 3
      continue
    }

    // Evidence block
    if (entry.type === 'evidence') {
      const lines = doc.splitTextToSize(text, CW - 6)
      const bh = lines.length * 4.5 + 9
      check(bh)
      doc.setFillColor(255, 247, 215)
      doc.setDrawColor(190, 140, 40)
      doc.roundedRect(ML, y, CW, bh, 1, 1, 'FD')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(150, 95, 0)
      doc.text('EVIDENCE', ML + 3, y + 4)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(70, 50, 0)
      doc.text(lines, ML + 3, y + 8)
      y += bh + 3
      continue
    }

    // Backchannel
    if (entry.backchannel) {
      const cleanName = (entry.name || '').replace(/_bc$/, '').replace(/_/g, ' ')
      const lines = doc.splitTextToSize(`${cleanName}: ${text}`, CW - 10)
      check(lines.length * 4 + 2)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7.5)
      doc.setTextColor(145, 145, 145)
      doc.text(lines, ML + 10, y)
      y += lines.length * 4 + 2
      continue
    }

    // User / steer
    if (entry.role === 'user') {
      const lines = doc.splitTextToSize(text, CW - 6)
      check(lines.length * 4.5 + 9)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(60, 90, 160)
      doc.text('You', ML, y)
      y += 4.5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(40, 60, 130)
      doc.text(lines, ML + 4, y)
      y += lines.length * 4.5 + 4
      continue
    }

    // Moderator
    if (entry.role === 'moderator') {
      const cleanName = (entry.name || 'Moderator').replace(/_/g, ' ')
      const lines = doc.splitTextToSize(text, CW - 6)
      check(lines.length * 4.5 + 9)
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(`─ ${cleanName} ─`, ML, y)
      y += 4.5
      doc.setFontSize(8)
      doc.text(lines, ML + 4, y)
      y += lines.length * 4.5 + 4
      continue
    }

    // Philosopher turn
    turnNum++
    const cleanName = (entry.name || '').replace(/_/g, ' ')
    const lines = doc.splitTextToSize(text, CW - 6)
    check(lines.length * 4.5 + 10)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(175, 175, 175)
    doc.text(`[${turnNum}]`, ML, y)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(25, 25, 25)
    doc.text(cleanName, ML + 8, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(40, 40, 40)
    doc.text(lines, ML + 4, y)
    y += lines.length * 4.5 + 5
  }

  // ── report ────────────────────────────────────────────────────────────
  gap(2)
  check(20)
  hRule(80, 80, 80)
  sectionLabel('DEBATE REPORT', 80, 80, 80)

  const {
    turn = 0,
    heat = 0,
    concession_total = 0,
    concession_counts = {},
    partial_agreements = [],
    points_of_agreement = [],
    remaining_disagreements = [],
  } = state || {}

  // Scoreboard
  if (turn) {
    check(16)
    const cols = [ML, ML + 50, ML + 100]
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text(String(turn), cols[0], y)
    doc.text(String(heat), cols[1], y)
    doc.text(String(concession_total), cols[2], y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(120, 120, 120)
    doc.text('turns', cols[0], y + 5)
    doc.text(`${HEAT_LABEL[heat] || 'heat'} (${heat}/10)`, cols[1], y + 5)
    doc.text('total concessions', cols[2], y + 5)
    y += 14
  }

  // Agreements
  if (points_of_agreement.length) {
    sectionLabel('AGREEMENTS REACHED', 35, 120, 65)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 30, 30)
    for (const pt of points_of_agreement) {
      const lines = doc.splitTextToSize(`• ${pt}`, CW - 4)
      check(lines.length * 4.5 + 2)
      doc.text(lines, ML + 2, y)
      y += lines.length * 4.5 + 1.5
    }
  }

  // Alignments
  if (partial_agreements.length) {
    sectionLabel('ALIGNMENTS THAT FORMED', 55, 90, 160)
    for (const a of partial_agreements) {
      const names = (a.participants || []).join(' + ')
      const lines = doc.splitTextToSize(`${names}  —  ${a.on}`, CW - 4)
      check(lines.length * 4.5 + 2)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(30, 30, 30)
      doc.text(lines, ML + 2, y)
      y += lines.length * 4.5 + 2
    }
  }

  // Tensions
  if (remaining_disagreements.length) {
    sectionLabel('STILL UNRESOLVED', 170, 60, 35)
    for (const t of remaining_disagreements) {
      if (typeof t === 'object' && t !== null) {
        const tLines = doc.splitTextToSize(t.topic || '', CW - 4)
        check(tLines.length * 4.5 + 10)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8.5)
        doc.setTextColor(30, 30, 30)
        doc.text(tLines, ML + 2, y)
        y += tLines.length * 4.5 + 1
        const stance = `${t.participant_a}: ${t.stance_a}  ·  ${t.participant_b}: ${t.stance_b}`
        const sLines = doc.splitTextToSize(stance, CW - 6)
        check(sLines.length * 4.5 + 3)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text(sLines, ML + 4, y)
        y += sLines.length * 4.5 + 4
      } else {
        const lines = doc.splitTextToSize(String(t), CW - 4)
        check(lines.length * 4.5 + 2)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(30, 30, 30)
        doc.text(lines, ML + 2, y)
        y += lines.length * 4.5 + 2
      }
    }
  }

  // Concessions per character
  const cEntries = Object.entries(concession_counts)
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a)
  if (cEntries.length) {
    sectionLabel('CONCESSIONS PER CHARACTER', 100, 100, 100)
    const maxN = Math.max(...cEntries.map(([, n]) => n), 1)
    const BAR_X = ML + 55, BAR_W = 55
    for (const [charName, n] of cEntries) {
      check(7)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(30, 30, 30)
      doc.text(charName.replace(/_/g, ' '), ML + 2, y)
      const filled = Math.round((n / maxN) * BAR_W)
      doc.setFillColor(80, 80, 80)
      if (filled > 0) doc.rect(BAR_X, y - 3, filled, 2.5, 'F')
      doc.setFillColor(210, 210, 210)
      if (filled < BAR_W) doc.rect(BAR_X + filled, y - 3, BAR_W - filled, 2.5, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(80, 80, 80)
      doc.text(String(n), BAR_X + BAR_W + 3, y)
      y += 6
    }
  }

  // Oxford verdict
  if (oxfordVerdict?.winner) {
    sectionLabel('OXFORD VERDICT', 55, 75, 150)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 30, 30)
    const { winner, proposition_open = 50, proposition_final = 50 } = oxfordVerdict
    check(20)
    doc.text(`Opening vote:  Proposition ${proposition_open}%  ·  Opposition ${100 - proposition_open}%`, ML + 2, y)
    y += 5
    doc.text(`Final vote:    Proposition ${proposition_final}%  ·  Opposition ${100 - proposition_final}%`, ML + 2, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    const label = winner === 'proposition' ? 'Proposition wins' : 'Opposition wins'
    const tie = proposition_final === 50 ? ' (tied — opposition takes it)' : ''
    doc.text(`Verdict: ${label}${tie}`, ML + 2, y)
    y += 8
  }

  // Cable News
  if (cableReport?.final_ratings) {
    sectionLabel('CABLE NEWS REPORT', 180, 55, 35)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 30, 30)
    const { final_ratings, peak_ratings, network_offers = {}, catchphrases = {}, guest_stats = {} } = cableReport
    check(10)
    doc.text(`Final ratings: ${final_ratings.toFixed(1)}M  ·  Peak: ${peak_ratings.toFixed(1)}M`, ML + 2, y)
    y += 6

    const offerEntries = Object.entries(network_offers)
    if (offerEntries.length) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      check(6)
      doc.text('Network offers', ML + 2, y)
      y += 4
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      for (const [name, offer] of offerEntries) {
        const lines = doc.splitTextToSize(`${name.replace(/_/g, ' ')}: ${offer}`, CW - 6)
        check(lines.length * 4.5 + 2)
        doc.text(lines, ML + 4, y)
        y += lines.length * 4.5 + 2
      }
    }

    const cpEntries = Object.entries(catchphrases)
    if (cpEntries.length) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      gap(2)
      check(6)
      doc.text('Guest catchphrases', ML + 2, y)
      y += 4
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      for (const [name, phrase] of cpEntries) {
        const ct = guest_stats[name]?.catchphrase_count || 0
        const lines = doc.splitTextToSize(`${name.replace(/_/g, ' ')}: "${phrase}"  (used ${ct}×)`, CW - 6)
        check(lines.length * 4.5 + 2)
        doc.text(lines, ML + 4, y)
        y += lines.length * 4.5 + 2
      }
    }
  }

  // ── save ──────────────────────────────────────────────────────────────
  const slug = topic.slice(0, 40).replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '')
  doc.save(`philosophers-bar-${slug || 'transcript'}.pdf`)
}

function stripMarkers(text) {
  return text.replace(/\*\[([^\]]*)\]\*/g, '[$1]').trim()
}
