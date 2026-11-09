import { useEffect, useMemo, useState } from 'react'
import boardsMd from '../boards/boards.md?raw'
import stacksMd from '../boards/stacks.md?raw'
import protocolsMd from '../boards/protocols.md?raw'
import projectsMd from '../boards/projects.md?raw'
import { list, parseCards, type Card } from '../lib/cards'
import { graph, matcher } from '../lib/content'
import { annotate } from '../lib/glossary'
import { Inline, Rich } from '../components/Rich'
import { Question } from '../components/Lesson'
import { DIAGRAMS } from '../boards/diagrams'
import { PhotoTour } from '../boards/PhotoTour'
import { PHOTOS } from '../boards/photos'

const SETS = {
  boards: { title: 'Boards', cards: parseCards(boardsMd), groupBy: 'group' },
  stacks: { title: 'Software stacks', cards: parseCards(stacksMd), groupBy: 'group' },
  protocols: { title: 'Protocols', cards: parseCards(protocolsMd), groupBy: 'group' },
  projects: { title: 'Projects', cards: parseCards(projectsMd), groupBy: 'level' },
} as const
type SetKey = keyof typeof SETS
const KEYS = Object.keys(SETS) as SetKey[]

const byId = new Map<string, { card: Card; set: SetKey }>()
for (const k of KEYS) for (const c of SETS[k].cards) byId.set(c.id, { card: c, set: k })

const STORE = 'egire-atlas-project-steps-v1'
function useSteps() {
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORE) ?? '[]')) } catch { return new Set() }
  })
  useEffect(() => { try { localStorage.setItem(STORE, JSON.stringify([...done])) } catch { /* storage may be blocked */ } }, [done])
  const flip = (k: string) => setDone((s) => { const n = new Set(s); if (!n.delete(k)) n.add(k); return n })
  return { done, flip }
}

const INTRO: Record<SetKey, string> = {
  boards: 'Pick the board to suit the job. Microcontrollers handle exact timing and low power; Linux computers handle cameras, AI and networking. Real robots usually use both.',
  stacks: 'The software that runs on those boards: IDEs, vendor SDKs, real-time operating systems, Linux and AI tools, robotics middleware and flight stacks.',
  protocols: 'How boards, sensors and computers talk. Wired buses on the board, links between boards, drone signals, wireless, and networking.',
  projects: 'Thirteen projects in learning order. Each one names the boards, software, protocols and lessons it uses. Tick off steps as you go.',
}

function Links({ ids, open }: { ids: string[]; open: (id: string) => void }) {
  return (
    <div className="chips">
      {ids.filter((id) => byId.has(id)).map((id) => <a key={id} className="chip" href={`#/boards/${id}`}>{byId.get(id)!.card.name}</a>)}
      {ids.filter((id) => graph.byId.has(id)).map((id) => <button key={id} type="button" className="chip" onClick={() => open(id)}>{graph.byId.get(id)!.title}</button>)}
    </div>
  )
}

function Detail({ card, set, open, steps }: { card: Card; set: SetKey; open: (id: string) => void; steps: ReturnType<typeof useSteps> }) {
  const text = useMemo(() => {
    const seen = new Set<string>()
    return card.sections.map((s) => ({ title: s.title, body: annotate(s.body, matcher, seen, '') }))
  }, [card])
  const m = card.meta
  const peers = SETS[set].cards
  const idx = peers.indexOf(card)
  const done = card.steps.filter((_, i) => steps.done.has(`${card.id}:${i}`)).length
  // Things that point at this card, such as projects that use this board.
  const usedBy = KEYS.flatMap((k) => SETS[k].cards).filter((o) => o !== card && ['boards', 'stacks', 'protocols'].some((f) => list(o.meta[f]).includes(card.id)))
  return (
    <div className="page narrow tool-page">
      <a className="back" href={`#/boards/${set}`}>All {SETS[set].title.toLowerCase()}</a>
      <h1>{card.name}</h1>
      <p className="lede">{card.summary}</p>
      <p className="tool-tags">{[m.group, m.level].filter(Boolean).map((t) => <span key={t}>{t}</span>)}</p>
      <div className="guide-body">
        {PHOTOS[card.id] && <section className="ds-section"><h3>Tour the board</h3><p>Select each number to see what that part does.</p><PhotoTour id={card.id} /></section>}
        {m.parts && <section className="ds-section"><h3>You'll need</h3><p>{m.parts}</p></section>}
        {text.map((s) => (
          <section key={s.title} className={`ds-section ${s.title === 'Safety' || s.title.startsWith('When not') || s.title === 'Watch out' || s.title === 'Disadvantages' ? 'trap' : ''}`}>
            <h3>{s.title}</h3>
            {s.title === 'Pins and circuit' && DIAGRAMS[card.id]}
            <Rich text={s.body} />
          </section>
        ))}
        {card.steps.length > 0 && (
          <section className="ds-section">
            <h3>Steps ({done} of {card.steps.length} done)</h3>
            <ul className="practice">
              {card.steps.map((p, i) => {
                const k = `${card.id}:${i}`
                return <li key={k}><label><input type="checkbox" checked={steps.done.has(k)} onChange={() => steps.flip(k)} /><span><Inline text={p} /></span></label></li>
              })}
            </ul>
          </section>
        )}
        {card.checks.length > 0 && <section className="ds-section"><h3>Check yourself</h3>{card.checks.map((q, i) => <Question key={card.id + i} q={q} />)}</section>}
        <section className="ds-section links">
          {list(m.boards).length > 0 && <><h3>Boards</h3><Links ids={list(m.boards)} open={open} /></>}
          {list(m.stacks).length > 0 && <><h3>Software</h3><Links ids={list(m.stacks)} open={open} /></>}
          {list(m.protocols).length > 0 && <><h3>Protocols</h3><Links ids={list(m.protocols)} open={open} /></>}
          {usedBy.length > 0 && <><h3>Used with</h3><Links ids={usedBy.map((o) => o.id)} open={open} /></>}
          {list(m.lessons).length > 0 && <><h3>Electronics lessons behind this</h3><Links ids={list(m.lessons)} open={open} /></>}
        </section>
        <nav className="ds-pager" aria-label="Move through this list">
          {idx > 0 ? <a href={`#/boards/${peers[idx - 1].id}`}>Previous: {peers[idx - 1].name}</a> : <span />}
          {idx < peers.length - 1 && <a href={`#/boards/${peers[idx + 1].id}`}>Next: {peers[idx + 1].name}</a>}
        </nav>
      </div>
    </div>
  )
}

export function Boards({ arg, open }: { arg?: string; open: (id: string) => void }) {
  const steps = useSteps()
  const [q, setQ] = useState('')
  useEffect(() => { document.querySelector('.stage')?.scrollTo(0, 0) }, [arg])
  const hit = arg ? byId.get(arg) : undefined
  if (hit) return <Detail card={hit.card} set={hit.set} open={open} steps={steps} />

  const set: SetKey = KEYS.includes(arg as SetKey) ? (arg as SetKey) : 'boards'
  const { cards, groupBy } = SETS[set]
  const s = q.trim().toLowerCase()
  const shown = cards.filter((c) => !s || `${c.name} ${c.summary}`.toLowerCase().includes(s))
  const groups = [...new Set(cards.map((c) => c.meta[groupBy]))]
  return (
    <div className="page">
      <h1>Boards and software</h1>
      <p className="lede">Development boards, the software that runs on them, how they talk, and projects that put your electronics lessons to work.</p>
      <div className="sim-seg sub-tabs" role="group" aria-label="Section">
        {KEYS.map((k) => <a key={k} className="seg-link" aria-current={set === k ? 'true' : undefined} href={`#/boards/${k}`}>{SETS[k].title}</a>)}
      </div>
      <p className="lede">{INTRO[set]}</p>
      <div className="filter-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Find in ${SETS[set].title.toLowerCase()}`} aria-label={`Find in ${SETS[set].title}`} />
      </div>
      {groups.map((g) => {
        const items = shown.filter((c) => c.meta[groupBy] === g)
        if (!items.length) return null
        return (
          <section key={g}>
            <h2>{g}</h2>
            <div className="lab-grid">
              {items.map((c) => {
                const total = c.steps.length
                const doneN = c.steps.filter((_, i) => steps.done.has(`${c.id}:${i}`)).length
                return (
                  <a key={c.id} className="card-link" href={`#/boards/${c.id}`}>
                    <b>{c.name}</b><span>{c.summary}</span>
                    {total > 0 ? <em>{doneN} of {total} steps done</em> : c.meta.level && <em>{c.meta.level}</em>}
                  </a>
                )
              })}
            </div>
          </section>
        )
      })}
      {shown.length === 0 && <p className="lede">Nothing matches. Try a shorter word.</p>}
    </div>
  )
}

export const ALL_CARDS = byId
