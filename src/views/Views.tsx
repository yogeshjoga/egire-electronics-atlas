import { useMemo, useState } from 'react'
import { graph, words } from '../lib/content'
import { findPath, loadBearing } from '../lib/graph'
import { Question } from '../components/Lesson'
import { Inline, Tex } from '../components/Rich'
import { VIZ } from '../viz'
import { VIZ_GROUPS, VIZ_IDS, VIZ_TITLE } from '../viz/ids'

export function Labs({ active, go, open }: { active?: string; go: (id?: string) => void; open: (id: string) => void }) {
  if (active && VIZ[active]) {
    const V = VIZ[active]
    const users = graph.concepts.filter((c) => c.viz.includes(active))
    return (
      <div className="page narrow">
        <button type="button" className="back" onClick={() => go()}>All labs</button>
        <h1>{VIZ_TITLE.get(active)}</h1>
        <V />
        <h2>Used in these lessons</h2>
        <div className="chips dark">
          {users.map((c) => <button key={c.id} type="button" className="chip" onClick={() => open(c.id)}>{c.title}</button>)}
        </div>
      </div>
    )
  }
  return (
    <div className="page">
      <h1>Labs</h1>
      <p className="lede">{VIZ_IDS.length} working simulators. Each one also sits inside the lessons that use it.</p>
      {VIZ_GROUPS.map((g) => (
        <section key={g.title}>
          <h2>{g.title}</h2>
          <div className="lab-grid">
            {g.items.map(([id, t, d]) => (
              <button key={id} type="button" onClick={() => go(id)}><b>{t}</b><span>{d}</span></button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function Formulas({ open }: { open: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [phase, setPhase] = useState(-1)
  const all = useMemo(() => graph.concepts.flatMap((c) => c.math.map((m) => ({ c, m }))), [])
  const s = q.trim().toLowerCase()
  const list = all.filter(({ c, m }) =>
    (phase < 0 || c.phase === phase) && (!s || c.title.toLowerCase().includes(s) || m.note.toLowerCase().includes(s) || m.tex.toLowerCase().includes(s)))
  return (
    <div className="page">
      <h1>Formulas</h1>
      <p className="lede">All {all.length} equations in the atlas. Select one to open its lesson.</p>
      <div className="filter-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, such as reactance" aria-label="Filter formulas" />
        <select value={phase} onChange={(e) => setPhase(Number(e.target.value))} aria-label="Filter by phase">
          <option value={-1}>All phases</option>
          {graph.phases.map((p) => <option key={p.n} value={p.n}>{p.n}. {p.title}</option>)}
        </select>
      </div>
      <div className="formula-grid">
        {list.map(({ c, m }, i) => (
          <button key={c.id + i} type="button" onClick={() => open(c.id)}>
            <Tex src={m.tex} display />
            <b>{c.title}</b>
            {m.note && <span><Inline text={m.note} /></span>}
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="lede">No formula matches. Clear the filter to see them all.</p>}
    </div>
  )
}

export function Words({ open }: { open: (id: string) => void }) {
  const [q, setQ] = useState('')
  const s = q.trim().toLowerCase()
  const list = words.filter((w) => !s || w.forms.some((f) => f.toLowerCase().includes(s)) || w.def.toLowerCase().includes(s))
  return (
    <div className="page narrow">
      <h1>Words</h1>
      <p className="lede">{words.length} terms in plain language. In lessons, dotted words show these definitions.</p>
      <div className="filter-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word, such as inertia" aria-label="Find a word" />
      </div>
      <dl className="word-list">
        {list.map((w) => (
          <div key={w.name}>
            <dt>{w.concept ? <button type="button" onClick={() => open(w.concept!)}>{w.name}</button> : w.name}</dt>
            <dd>{w.def}</dd>
          </div>
        ))}
      </dl>
      {list.length === 0 && <p className="lede">No word matches "{q}". Try a shorter search.</p>}
    </div>
  )
}

const FOUNDATION = ['current', 'ohms-law', 'power', 'parallel', 'electron']

export function SelfTest({ open }: { open: (id: string) => void }) {
  const phases = graph.phases.filter((p) => graph.concepts.some((c) => c.phase === p.n && c.checks.length))
  const [set, setSet] = useState('foundation')
  const qs = useMemo(() => {
    if (set === 'foundation') {
      return FOUNDATION.map((id) => {
        const c = graph.byId.get(id)!
        return { c, q: id === 'electron' ? c.checks[1] : c.checks[0] }
      })
    }
    return graph.concepts.filter((c) => c.phase === Number(set)).flatMap((c) => c.checks.map((q) => ({ c, q })))
  }, [set])
  return (
    <div className="page narrow">
      <h1>Self-test</h1>
      <p className="lede">Answer without looking first. Each question explains itself after you choose.</p>
      <div className="filter-row">
        <select value={set} onChange={(e) => setSet(e.target.value)} aria-label="Choose a question set">
          <option value="foundation">Foundation assessment, Level 1 (5 questions)</option>
          {phases.map((p) => <option key={p.n} value={p.n}>Phase {p.n}: {p.title}</option>)}
        </select>
      </div>
      <div className="test-list" key={set}>
        {qs.map(({ c, q }, i) => (
          <div key={i} className="test-item">
            <Question q={q} />
            <button type="button" className="xref" onClick={() => open(c.id)}>Open the lesson: {c.title}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Research({ open, learned }: { open: (id: string) => void; learned: Set<string> }) {
  const [from, setFrom] = useState('quark')
  const [to, setTo] = useState('flight-controller')
  const path = useMemo(() => findPath(graph, from, to), [from, to])
  const top = useMemo(() => loadBearing(graph).slice(0, 14), [])
  const stats = useMemo(() => ({
    concepts: graph.concepts.length,
    needs: graph.concepts.reduce((s, c) => s + c.needs.length, 0),
    related: [...graph.related.values()].reduce((s, r) => s + r.length, 0) / 2,
    formulas: graph.concepts.reduce((s, c) => s + c.math.length, 0),
    examples: graph.concepts.reduce((s, c) => s + c.examples.length, 0),
  }), [])
  const exportJson = () => {
    const data = {
      nodes: graph.concepts.map((c) => ({ id: c.id, title: c.title, phase: c.phase, kind: c.kind, level: c.level, summary: c.summary, learned: learned.has(c.id) })),
      edges: graph.concepts.flatMap((c) => c.needs.map((n) => ({ source: n, target: c.id, type: 'prerequisite' }))),
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'egire-electronics-graph.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const options = [...graph.concepts].sort((a, b) => a.title.localeCompare(b.title))
  return (
    <div className="page narrow">
      <h1>Research the graph</h1>
      <p className="lede">Ask how far-apart ideas connect, and find which concepts carry the most weight.</p>

      <h2>How are two concepts connected?</h2>
      <div className="filter-row">
        <select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From concept">
          {options.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} aria-label="To concept">
          {options.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      {path ? (
        <ol className="path">
          {path.map((id) => {
            const c = graph.byId.get(id)!
            return <li key={id}><button type="button" onClick={() => open(id)}><b>{c.title}</b><span><Inline text={c.summary} /></span></button></li>
          })}
        </ol>
      ) : <p className="lede">These two concepts have no connecting path.</p>}

      <h2>Most load-bearing concepts</h2>
      <p className="lede">How many later concepts depend on each one, directly or through a chain. Weak understanding here spreads furthest.</p>
      <div className="bars">
        {top.map(({ id, count }) => (
          <button key={id} type="button" onClick={() => open(id)}>
            <span>{graph.byId.get(id)!.title}</span>
            <i style={{ width: `${(count / top[0].count) * 100}%` }} />
            <b>{count}</b>
          </button>
        ))}
      </div>

      <h2>Graph data</h2>
      <dl className="stat-list">
        <div><dt>Concepts</dt><dd>{stats.concepts}</dd></div>
        <div><dt>Prerequisite links</dt><dd>{stats.needs}</dd></div>
        <div><dt>Related links</dt><dd>{stats.related}</dd></div>
        <div><dt>Formulas</dt><dd>{stats.formulas}</dd></div>
        <div><dt>Worked examples</dt><dd>{stats.examples}</dd></div>
      </dl>
      <button type="button" className="solder" onClick={exportJson}>Download graph as JSON</button>
    </div>
  )
}
