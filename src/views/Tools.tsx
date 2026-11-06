import { useEffect, useMemo, useState, type ReactNode } from 'react'
import raw from '../tools/tools.md?raw'
import { Panel } from '../tools/panels'
import { graph, matcher } from '../lib/content'
import { annotate } from '../lib/glossary'
import { PRIORITIES, TOOL_GROUPS, parseTools, type Tool } from '../lib/tools'
import { Inline, Rich } from '../components/Rich'
import { Question } from '../components/Lesson'
import { VIZ } from '../viz'
import { VIZ_TITLE } from '../viz/ids'

const tools = parseTools(raw)
const KEY = 'egire-atlas-tool-practice-v1'

function usePractice() {
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')) } catch { return new Set() }
  })
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify([...done])) }, [done])
  const flip = (k: string) => setDone((s) => { const n = new Set(s); if (!n.delete(k)) n.add(k); return n })
  return { done, flip }
}

function Block({ title, tone, children }: { title: string; tone?: string; children: ReactNode }) {
  return <section className={`ds-section ${tone ?? ''}`}><h3>{title}</h3>{children}</section>
}

function Detail({ t, open, back, practice }: { t: Tool; open: (id: string) => void; back: () => void; practice: ReturnType<typeof usePractice> }) {
  const x = useMemo(() => {
    const seen = new Set<string>()
    const m = (s: string) => annotate(s, matcher, seen, '')
    return { what: m(t.what), why: m(t.why), how: m(t.how), functions: m(t.functions), mistakes: m(t.mistakes), safety: m(t.safety), buying: m(t.buying) }
  }, [t])
  const count = t.practice.filter((_, i) => practice.done.has(`${t.id}:${i}`)).length
  const peers = tools.filter((o) => o.group === t.group)
  const idx = tools.indexOf(t)
  return (
    <div className="page narrow tool-page">
      <button type="button" className="back" onClick={back}>All tools</button>
      <h1>{t.name}</h1>
      <p className="lede">{t.summary}</p>
      <p className="tool-tags"><span>{t.group}</span><span>{t.priority}</span></p>
      <div className="guide-body">
        <Block title="What it is"><Rich text={x.what} /></Block>
        <Block title="Why it matters"><Rich text={x.why} /></Block>
        {t.panel && <Block title="Learn the controls"><p>Select each number to see what that control does.</p><Panel id={t.panel} /></Block>}
        {x.how && <Block title="How to use it"><Rich text={x.how} /></Block>}
        {x.functions && <Block title="What each function does"><Rich text={x.functions} /></Block>}
        {t.viz.map((v) => { const V = VIZ[v]; return <Block key={v} title={`Try it: ${VIZ_TITLE.get(v)}`}><V /></Block> })}
        {t.practice.length > 0 && (
          <Block title={`Practice at your bench (${count} of ${t.practice.length} done)`}>
            <ul className="practice">
              {t.practice.map((p, i) => {
                const k = `${t.id}:${i}`
                return <li key={k}><label><input type="checkbox" checked={practice.done.has(k)} onChange={() => practice.flip(k)} /><span><Inline text={p} /></span></label></li>
              })}
            </ul>
          </Block>
        )}
        {x.mistakes && <Block title="Common mistakes" tone="trap"><Rich text={x.mistakes} /></Block>}
        {x.safety && <Block title="Safety" tone="trap"><Rich text={x.safety} /></Block>}
        {x.buying && <Block title="What to look for when buying"><Rich text={x.buying} /></Block>}
        {t.checks.length > 0 && <Block title="Check yourself">{t.checks.map((q, i) => <Question key={t.id + i} q={q} />)}</Block>}
        <section className="ds-section links">
          <h3>Related lessons</h3>
          <div className="chips">{t.lessons.map((id) => <button key={id} type="button" className="chip" onClick={() => open(id)}>{graph.byId.get(id)!.title}</button>)}</div>
          {peers.length > 1 && <>
            <h3>More {t.group.toLowerCase()} tools</h3>
            <div className="chips">{peers.filter((o) => o !== t).map((o) => <a key={o.id} className="chip" href={`#/tools/${o.id}`}>{o.name}</a>)}</div>
          </>}
        </section>
        <nav className="ds-pager" aria-label="Move through the tools">
          {idx > 0 ? <a href={`#/tools/${tools[idx - 1].id}`}>Previous: {tools[idx - 1].name}</a> : <span />}
          {idx < tools.length - 1 && <a href={`#/tools/${tools[idx + 1].id}`}>Next: {tools[idx + 1].name}</a>}
        </nav>
      </div>
    </div>
  )
}

export function Tools({ id, go, open }: { id?: string; go: (id?: string) => void; open: (c: string) => void }) {
  const [q, setQ] = useState('')
  const [pri, setPri] = useState('All')
  const practice = usePractice()
  const cur = tools.find((t) => t.id === id)
  useEffect(() => { document.querySelector('.stage')?.scrollTo(0, 0) }, [id])
  if (cur) return <Detail t={cur} open={open} back={() => go()} practice={practice} />

  const s = q.trim().toLowerCase()
  const list = tools.filter((t) => (pri === 'All' || t.priority === pri) && (!s || `${t.name} ${t.summary} ${t.group}`.toLowerCase().includes(s)))
  const total = tools.reduce((a, t) => a + t.practice.length, 0)
  return (
    <div className="page">
      <h1>Tools</h1>
      <p className="lede">{tools.length} bench tools. Each page explains why it matters, how to use it, and gives you practice tasks. You have finished {practice.done.size} of {total} tasks.</p>
      <div className="filter-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a tool, such as oscilloscope" aria-label="Find a tool" />
      </div>
      <div className="sim-seg" role="group" aria-label="When to buy">
        {['All', ...PRIORITIES].map((p) => <button key={p} type="button" aria-pressed={pri === p} onClick={() => setPri(p)}>{p}</button>)}
      </div>
      {TOOL_GROUPS.map((g) => {
        const items = list.filter((t) => t.group === g)
        if (!items.length) return null
        return (
          <section key={g}>
            <h2>{g}</h2>
            <div className="lab-grid">
              {items.map((t) => (
                <button key={t.id} type="button" onClick={() => go(t.id)}>
                  <b>{t.name}</b><span>{t.summary}</span><em>{t.priority}</em>
                </button>
              ))}
            </div>
          </section>
        )
      })}
      {list.length === 0 && <p className="lede">No tool matches. Clear the search, or choose All.</p>}
    </div>
  )
}
