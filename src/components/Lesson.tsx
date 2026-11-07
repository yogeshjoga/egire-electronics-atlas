import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { graph, matcher } from '../lib/content'
import { annotate } from '../lib/glossary'
import { rootChain } from '../lib/graph'
import type { Check as CheckQ, Concept, Example } from '../lib/parse'
import { VIZ } from '../viz'
import { VIZ_TITLE } from '../viz/ids'
import { KIND_LABEL } from './Pad'
import { Inline, Rich, Tex } from './Rich'

const LEVEL = ['', 'Foundation', 'Core', 'Advanced', 'Research']

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="ds-section"><h3>{title}</h3>{children}</section>
}

function WorkedExample({ ex }: { ex: Example }) {
  const [shown, setShown] = useState(0)
  const done = shown > ex.steps.length
  return (
    <div className="example">
      <p className="q"><Inline text={ex.q} /></p>
      <ol>{ex.steps.slice(0, shown).map((s, i) => <li key={i}><Inline text={s} /></li>)}</ol>
      {done && <p className="answer"><Inline text={ex.a} /></p>}
      {!done && (
        <button type="button" className="btn-line" onClick={() => setShown(shown + 1)}>
          {shown < ex.steps.length ? (shown === 0 ? 'Show the first step' : 'Show the next step') : 'Show the answer'}
        </button>
      )}
    </div>
  )
}

export function Question({ q }: { q: CheckQ }) {
  const [pick, setPick] = useState<number | null>(null)
  return (
    <div className="check">
      <p className="q"><Inline text={q.q} /></p>
      <div className="options">
        {q.options.map((o, i) => (
          <button key={i} type="button" disabled={pick !== null}
            data-result={pick === null ? undefined : i === q.correct ? 'right' : i === pick ? 'wrong' : undefined}
            onClick={() => setPick(i)}><Inline text={o} /></button>
        ))}
      </div>
      {pick !== null && <p className="why"><strong>{pick === q.correct ? 'Correct.' : 'Not quite.'}</strong> <Inline text={q.why} /></p>}
    </div>
  )
}

function ConceptList({ ids, open, learned }: { ids: string[]; open: (id: string) => void; learned: Set<string> }) {
  return (
    <div className="chips">
      {ids.map((id) => (
        <button key={id} type="button" className="chip" data-learned={learned.has(id) || undefined} onClick={() => open(id)}>
          {graph.byId.get(id)!.title}
        </button>
      ))}
    </div>
  )
}

interface Props {
  c: Concept; learned: Set<string>
  open: (id: string) => void; toggle: (id: string) => void; close: () => void
}

export function Lesson({ c, learned, open, toggle, close }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(false)
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [c.id])

  // Each word is explained the first time it appears in this lesson, not every time.
  const t = useMemo(() => {
    const seen = new Set<string>()
    const mark = (s: string) => annotate(s, matcher, seen, c.id)
    return {
      summary: mark(c.summary), nature: mark(c.nature), eng: mark(c.eng),
      math: c.math.map((m) => ({ ...m, note: mark(m.note) })),
      examples: c.examples.map((e) => ({ q: mark(e.q), steps: e.steps.map(mark), a: mark(e.a) })),
      trap: mark(c.trap), lab: mark(c.lab), apply: mark(c.apply),
      // Answer options are buttons, so they stay plain.
      checks: c.checks.map((k) => ({ ...k, q: mark(k.q), why: mark(k.why) })),
    }
  }, [c])

  const chain = rootChain(graph, c.id)
  const unlocks = graph.unlocks.get(c.id) ?? []
  const related = graph.related.get(c.id) ?? []
  const siblings = graph.concepts.filter((x) => x.phase === c.phase)
  const idx = siblings.indexOf(c)
  const phase = graph.phases[c.phase]
  const isLearned = learned.has(c.id)
  const missing = c.needs.filter((n) => !learned.has(n))

  return (
    <aside className="lesson" data-wide={wide || undefined} aria-label={`Lesson: ${c.title}`}>
      <div className="ds-top">
        <span>Phase {phase.n}: {phase.title}</span>
        <button type="button" className="ds-icon wide-toggle" onClick={() => setWide(!wide)}>{wide ? 'Narrow page' : 'Wide page'}</button>
        <button type="button" className="ds-icon" onClick={close}>Close</button>
      </div>
      <div className="ds-scroll" ref={scroller}>
        <header className="ds-head">
          <h2>{c.title}</h2>
          <p className="ds-summary"><Inline text={t.summary} /></p>
          <dl className="ds-meta">
            <div><dt>Type</dt><dd>{KIND_LABEL[c.kind]}</dd></div>
            <div><dt>Level</dt><dd>{LEVEL[c.level]}</dd></div>
            <div><dt>Concept</dt><dd>{idx + 1} of {siblings.length} in this phase</dd></div>
          </dl>
          {chain.length > 1 && (
            <nav className="chain" aria-label="Shortest route from matter">
              {chain.map((id, i) => (
                <span key={id}>
                  {i > 0 && <i aria-hidden="true" />}
                  {id === c.id ? <b>{graph.byId.get(id)!.title}</b> : <button type="button" onClick={() => open(id)}>{graph.byId.get(id)!.title}</button>}
                </span>
              ))}
            </nav>
          )}
          <button type="button" className="solder" data-on={isLearned || undefined} onClick={() => toggle(c.id)}>
            {isLearned ? 'Learned. Unmark it' : 'Mark as learned'}
          </button>
          {missing.length > 0 && !isLearned && (
            <p className="hint">Not learned yet, and needed here: {missing.map((m) => graph.byId.get(m)!.title).join(', ')}.</p>
          )}
        </header>

        {c.nature && <Section title="What happens in nature"><Rich text={t.nature} /></Section>}
        {c.viz.map((v) => {
          const V = VIZ[v]
          return <Section key={v} title={`Try it: ${VIZ_TITLE.get(v)}`}><V /></Section>
        })}
        {c.eng && <Section title="How engineers use it"><Rich text={t.eng} /></Section>}
        {c.math.length > 0 && (
          <Section title="The maths">
            <div className="formulas">
              {t.math.map((m, i) => (
                <div key={i} className="formula"><Tex src={m.tex} display />{m.note && <p><Inline text={m.note} /></p>}</div>
              ))}
            </div>
          </Section>
        )}
        {c.examples.length > 0 && (
          <Section title={c.examples.length > 1 ? 'Worked examples' : 'Worked example'}>
            {t.examples.map((e, i) => <WorkedExample key={c.id + i} ex={e} />)}
          </Section>
        )}
        {c.trap && <section className="ds-section trap"><h3>Watch out</h3><Rich text={t.trap} /></section>}
        {c.lab && <Section title="At the bench"><Rich text={t.lab} /></Section>}
        {c.apply && <section className="ds-section apply"><h3>For EgireRobotics</h3><Rich text={t.apply} /></section>}
        {c.checks.length > 0 && (
          <Section title="Check yourself">{t.checks.map((q, i) => <Question key={c.id + i} q={q} />)}</Section>
        )}

        <section className="ds-section links">
          {c.needs.length > 0 && <><h3>Learn first</h3><ConceptList ids={c.needs} open={open} learned={learned} /></>}
          {unlocks.length > 0 && <><h3>This unlocks</h3><ConceptList ids={unlocks} open={open} learned={learned} /></>}
          {related.length > 0 && <><h3>Related</h3><ConceptList ids={related} open={open} learned={learned} /></>}
        </section>

        <nav className="ds-pager" aria-label="Move through this phase">
          {idx > 0 ? <button type="button" onClick={() => open(siblings[idx - 1].id)}>Previous: {siblings[idx - 1].title}</button> : <span />}
          {idx < siblings.length - 1 && <button type="button" onClick={() => open(siblings[idx + 1].id)}>Next: {siblings[idx + 1].title}</button>}
        </nav>
      </div>
    </aside>
  )
}
