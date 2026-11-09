import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'

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
  const hole = box && { left: box.left - pad, top: box.top - pad, width: box.width + pad * 2, height: box.height + pad * 2 }
  // Put the card below the highlight if there is room, otherwise above it, otherwise in the middle.
  const cardW = Math.min(380, innerWidth - 24)
  let pos: CSSProperties = { left: (innerWidth - cardW) / 2, top: innerHeight / 2 - 120 }
  if (hole) {
    const left = Math.max(12, Math.min(hole.left, innerWidth - cardW - 12))
    if (hole.top + hole.height + 230 < innerHeight) pos = { left, top: hole.top + hole.height + 12 }
    else if (hole.top > 240) pos = { left, bottom: innerHeight - hole.top + 12 }
  }
  return (
    <div className="wt-layer">
      <div className="wt-hole" style={hole ?? { left: '50%', top: '50%', width: 0, height: 0 }} />
      <div className="wt-card wt-step" role="dialog" aria-modal="true" aria-labelledby="wt-step-title" style={{ ...pos, width: cardW }}>
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
