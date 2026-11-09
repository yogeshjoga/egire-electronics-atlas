import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

export const WELCOME_KEY = 'egire-atlas-welcome-v1'

export function seenWelcome() {
  try { return localStorage.getItem(WELCOME_KEY) === 'done' } catch { return true }
}
export function markWelcome() {
  try { localStorage.setItem(WELCOME_KEY, 'done') } catch { /* private mode: show again next time */ }
}

interface Step { find: string[]; title: string; text: string; view?: string }

// Each step points at a real part of the page. The first selector that is visible wins,
// so phone layouts can point at the Phases button instead of the hidden side list.
const STEPS: Step[] = [
  { find: ['.board'], view: 'board', title: 'The board is a map of electronics', text: 'Every pad is one concept, from atoms at the top left to flight controllers at the end. Traces join each idea to the ideas it needs. Drag to move, and scroll or pinch to zoom.' },
  { find: ['.rail .progress', '.rail-btn'], view: 'board', title: 'Your progress and Next up', text: 'This counts the concepts you have learned. Next up always picks a concept you are ready for, so it is the easiest way to know what to study.' },
  { find: ['.rail .phases', '.rail-btn'], view: 'board', title: 'Twenty-one phases', text: 'The course in order, from matter to advanced hardware design. Select a phase to jump to it on the board. On a phone, this list is behind the Phases button.' },
  { find: ['.board-tools'], view: 'board', title: 'Find and trace', text: 'Find any concept by name. When a concept is open, Trace this concept hides everything except the ideas behind it.' },
  { find: ['.node[data-state=ready]', '.node'], view: 'board', title: 'Ready pads have a dashed ring', text: 'A dashed ring means you have learned everything this concept needs. A white pad is one you have learned. Select any pad to open its lesson.' },
  { find: ['.search-btn'], title: 'Search from anywhere', text: 'Press / or Ctrl+K on any page to find a concept.' },
  { find: ['nav[aria-label=Main]'], title: 'Libraries for practice and reference', text: 'Labs has every simulator. Formulas, Laws, Symbols and Words are for quick lookup. Tools, Components and Boards cover real hardware. Self-test checks what you know.' },
  { find: ['nav[aria-label=Main] a[href="#/guide"]'], title: 'The full guide', text: 'The Guide explains every screen with annotated screenshots, and sets out the learning path from beginner to expert. Open it whenever you need it.' },
]

/** First-visit welcome card, and a walkthrough that highlights the real controls one at a time. */
export function Walkthrough({ mode, close, go, startLearning }: {
  mode: 'welcome' | 'tour'; close: () => void; go: (view: string) => void; startLearning: () => void
}) {
  const [i, setI] = useState(mode === 'tour' ? 0 : -1)
  const [box, setBox] = useState<DOMRect | null>(null)
  const step = i >= 0 ? STEPS[i] : null

  useEffect(() => { if (step?.view && !location.hash.startsWith(`#/${step.view}`)) go(step.view) }, [step, go])

  useLayoutEffect(() => {
    if (!step) return
    let raf = 0
    const measure = () => {
      const all = step.find.flatMap((s) => [...document.querySelectorAll(s)])
      const shown = (e: Element) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight }
      const el = all.find(shown) ?? all.find((e) => e.getBoundingClientRect().width > 0)
      const r = el?.getBoundingClientRect()
      if (el && r && (r.bottom > innerHeight || r.right > innerWidth || r.left < 0)) el.scrollIntoView({ block: 'nearest', inline: 'center' })
      setBox(el ? el.getBoundingClientRect() : null)
    }
    const t = setTimeout(measure, 120)
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    addEventListener('resize', on); addEventListener('scroll', on, true)
    return () => { clearTimeout(t); cancelAnimationFrame(raf); removeEventListener('resize', on); removeEventListener('scroll', on, true) }
  }, [step])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
      if (i >= 0 && e.key === 'ArrowRight') next()
      if (i > 0 && e.key === 'ArrowLeft') setI(i - 1)
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  })

  // The card's real size and place, measured after each render, so the arrow can start at its edge.
  const cardRef = useRef<HTMLDivElement>(null)
  const [card, setCard] = useState<Rect | null>(null)
  useLayoutEffect(() => {
    const r = cardRef.current?.getBoundingClientRect()
    const next = r ? { left: r.left, top: r.top, width: r.width, height: r.height } : null
    if (JSON.stringify(next) !== JSON.stringify(card)) setCard(next)
  })

  function finish() { markWelcome(); close() }
  function next() { if (i < STEPS.length - 1) setI(i + 1); else finish() }

  if (!step) {
    return (
      <div className="wt-back">
        <div className="wt-card wt-welcome" role="dialog" aria-modal="true" aria-labelledby="wt-title">
          <p className="wt-kicker">EgireRobotics Electronics Atlas</p>
          <h2 id="wt-title">Welcome. Learn electronics from the atom up.</h2>
          <p>305 concepts in 21 phases, from matter and charge to PCBs, flight controllers and AI boards. Every lesson has the physics, a live simulator, the maths, worked examples and a check question.</p>
          <p>How would you like to start?</p>
          <div className="wt-choices">
            <button type="button" className="solder" onClick={() => setI(0)}><b>Take the walkthrough</b><span>2 minutes. See what each part of the screen does.</span></button>
            <button type="button" className="wt-choice" onClick={() => { finish(); go('guide') }}><b>Read the guide</b><span>Annotated screenshots and the full learning path.</span></button>
            <button type="button" className="wt-choice" onClick={() => { finish(); startLearning() }}><b>Start the first lesson</b><span>Jump straight in at phase 0.</span></button>
          </div>
          <button type="button" className="wt-skip" onClick={finish}>Skip for now. The Guide tab has all of this later.</button>
        </div>
      </div>
    )
  }

  const pad = 8
  // The highlight, clipped to the screen, so a tall list is pointed at where you can see it.
  const hole = box && (() => {
    const l = Math.max(box.left - pad, 2), t = Math.max(box.top - pad, 2)
    const r = Math.min(box.right + pad, innerWidth - 2), b = Math.min(box.bottom + pad, innerHeight - 2)
    return { left: l, top: t, width: Math.max(0, r - l), height: Math.max(0, b - t) }
  })()
  const cardW = Math.min(380, innerWidth - 24)
  const pos = place(hole, cardW, card?.height ?? 250)
  const arrow = hole && card ? arrowPath(card, hole) : null
  return (
    <div className="wt-layer">
      <div className="wt-hole" style={hole ?? { left: '50%', top: '50%', width: 0, height: 0 }} />
      {arrow && (
        <svg className="wt-arrow" key={i} aria-hidden="true" style={{ '--nx': `${arrow.ux * 5}px`, '--ny': `${arrow.uy * 5}px` } as CSSProperties}>
          <path className="wt-arrow-line" d={arrow.d} pathLength={1} />
          <path className="wt-arrow-head" d="M-13 -7 L1 0 L-13 7 Q-9 0 -13 -7 Z" transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`} />
        </svg>
      )}
      <div ref={cardRef} className="wt-card wt-step" role="dialog" aria-modal="true" aria-labelledby="wt-step-title" style={{ ...pos, width: cardW }}>
        <p className="wt-kicker">Step {i + 1} of {STEPS.length}</p>
        <h2 id="wt-step-title">{step.title}</h2>
        <p>{step.text}</p>
        <div className="wt-nav">
          <button type="button" className="wt-skip" onClick={finish}>End tour</button>
          <span>
            <button type="button" className="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
            <button type="button" className="solder" onClick={next} autoFocus>{i === STEPS.length - 1 ? 'Finish' : 'Next'}</button>
          </span>
        </div>
      </div>
    </div>
  )
}

interface Rect { left: number; top: number; width: number; height: number }

const GAP = 76 // room between the card and the highlight for the arrow
const EDGE = 12

/** Puts the card below, above, right of or left of the highlight, whichever fits first, else in the middle. */
function place(h: Rect | null, w: number, ht: number): CSSProperties {
  const middle = { left: (innerWidth - w) / 2, top: Math.max(EDGE, (innerHeight - ht) / 2) }
  if (!h) return middle
  const clampX = (x: number) => Math.max(EDGE, Math.min(x, innerWidth - w - EDGE))
  const clampY = (y: number) => Math.max(EDGE, Math.min(y, innerHeight - ht - EDGE))
  const cx = clampX(h.left + h.width / 2 - w / 2)
  const cy = clampY(h.top + h.height / 2 - ht / 2)
  if (h.top + h.height + GAP + ht + EDGE <= innerHeight) return { left: cx, top: h.top + h.height + GAP }
  if (h.top - GAP - ht >= EDGE) return { left: cx, top: h.top - GAP - ht }
  if (h.left + h.width + GAP + w + EDGE <= innerWidth) return { left: h.left + h.width + GAP, top: cy }
  if (h.left - GAP - w >= EDGE) return { left: h.left - GAP - w, top: cy }
  return middle
}

/** A gently curved line from the edge of the card to the edge of the highlight. */
function arrowPath(c: Rect, h: Rect): { d: string; x: number; y: number; angle: number; ux: number; uy: number } | null {
  const overlap = c.left < h.left + h.width && c.left + c.width > h.left && c.top < h.top + h.height && c.top + c.height > h.top
  if (overlap) return null
  const centre = (r: Rect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  const nearest = (p: { x: number; y: number }, r: Rect, inset: number) => ({
    x: Math.max(r.left + inset, Math.min(p.x, r.left + r.width - inset)),
    y: Math.max(r.top + inset, Math.min(p.y, r.top + r.height - inset)),
  })
  const hc = centre(h)
  const a = nearest(hc, c, 18)
  // Aim at the side of the highlight facing the card, a little way out from its border.
  const b0 = nearest(centre(c), h, 0)
  const dx0 = hc.x - b0.x, dy0 = hc.y - b0.y
  const l0 = Math.hypot(dx0, dy0) || 1
  const b = { x: b0.x - (dx0 / l0) * 6, y: b0.y - (dy0 / l0) * 6 }
  const dx = b.x - a.x, dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (len < 28) return null
  // Bend the line sideways by a fraction of its length for a smooth curve.
  const bend = Math.min(60, len * 0.28)
  const qx = (a.x + b.x) / 2 - (dy / len) * bend
  const qy = (a.y + b.y) / 2 + (dx / len) * bend
  // The head points along the curve's final direction, from the control point to the tip.
  const tx = b.x - qx, ty = b.y - qy, tl = Math.hypot(tx, ty) || 1
  // Stop the line short of the tip so its round cap does not poke through the head.
  const e = { x: b.x - (tx / tl) * 8, y: b.y - (ty / tl) * 8 }
  const f = (n: number) => n.toFixed(1)
  return {
    d: `M${f(a.x)} ${f(a.y)} Q${f(qx)} ${f(qy)} ${f(e.x)} ${f(e.y)}`,
    x: b.x, y: b.y, angle: (Math.atan2(ty, tx) * 180) / Math.PI, ux: tx / tl, uy: ty / tl,
  }
}
