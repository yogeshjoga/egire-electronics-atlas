import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import katex from 'katex'
import { graph, wordByName } from '../lib/content'

export const OpenConcept = createContext<(id: string) => void>(() => {})

const cache = new Map<string, string>()
function tex(src: string, display: boolean) {
  const key = (display ? 'D' : 'I') + src
  if (!cache.has(key)) cache.set(key, katex.renderToString(src, { throwOnError: false, displayMode: display }))
  return cache.get(key)!
}

export function Tex({ src, display }: { src: string; display?: boolean }) {
  return <span dangerouslySetInnerHTML={{ __html: tex(src, !!display) }} />
}

/** A word with a plain definition on hover or tap. Selecting it opens its lesson, if it has one. */
function Term({ name, shown }: { name: string; shown: string }) {
  const open = useContext(OpenConcept)
  const [at, setAt] = useState<DOMRect | null>(null)
  const w = wordByName.get(name)
  if (!w) return <>{shown}</>
  const show = (e: { currentTarget: Element }) => setAt(e.currentTarget.getBoundingClientRect())
  const hide = () => setAt(null)
  const left = at ? Math.max(8, Math.min(at.left, innerWidth - 308)) : 0
  const above = at ? at.top > 150 : false
  return (
    <>
      <button
        type="button" className="term" aria-label={`${shown}: ${w.def}`}
        onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide}
        onClick={(e) => { if (w.concept) open(w.concept); else show(e) }}
      >{shown}</button>
      {at && createPortal(
        <div className="term-pop" role="tooltip" style={above ? { left, bottom: innerHeight - at.top + 6 } : { left, top: at.bottom + 6 }}>
          <b>{w.name}</b> {w.def}
        </div>,
        document.body,
      )}
    </>
  )
}

export function Inline({ text }: { text: string }) {
  const open = useContext(OpenConcept)
  const parts = useMemo(() => text.split(/(\$[^$]+\$|\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\{\{[^}]+\}\}|\[[^\]]+\]\((?:https:\/\/|#\/)[^)]+\))/g), [text])
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$') && p.endsWith('$') && p.length > 2) return <Tex key={i} src={p.slice(1, -1)} />
        if (p.startsWith('**')) return <strong key={i}><Inline text={p.slice(2, -2)} /></strong>
        if (p.startsWith('{{')) {
          const [name, shown] = p.slice(2, -2).split('::')
          return <Term key={i} name={name} shown={shown} />
        }
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const external = link[2].startsWith('https://')
          return <a key={i} className="xref" href={link[2]} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{link[1]}</a>
        }
        if (p.startsWith('[[')) {
          const [id, label] = p.slice(2, -2).split('|')
          return <button key={i} type="button" className="xref" onClick={() => open(id)}>{label ?? graph.byId.get(id)?.title ?? id}</button>
        }
        return p
      })}
    </>
  )
}

/** Renders the small Markdown subset used in src/content: paragraphs, lists and tables. */
export function Rich({ text }: { text: string }) {
  const blocks = useMemo(() => {
    const out: ReactNode[] = []
    const lines = text.split('\n')
    for (let i = 0; i < lines.length;) {
      const line = lines[i]
      if (!line.trim()) { i++; continue }
      if (line.startsWith('|')) {
        const rows: string[][] = []
        while (i < lines.length && lines[i].startsWith('|')) {
          if (!/^\|[\s:|-]+\|$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()))
          i++
        }
        out.push(
          <div className="table-wrap" key={i}>
            <table>
              <thead><tr>{rows[0].map((c, k) => <th key={k}><Inline text={c} /></th>)}</tr></thead>
              <tbody>{rows.slice(1).map((r, a) => <tr key={a}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>)}</tbody>
            </table>
          </div>,
        )
      } else if (line.startsWith('- ')) {
        const items: string[] = []
        while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
        out.push(<ul key={i}>{items.map((t, k) => <li key={k}><Inline text={t} /></li>)}</ul>)
      } else {
        const para: string[] = []
        while (i < lines.length && lines[i].trim() && !lines[i].startsWith('|') && !lines[i].startsWith('- ')) { para.push(lines[i]); i++ }
        out.push(<p key={i}><Inline text={para.join(' ')} /></p>)
      }
    }
    return out
  }, [text])
  return <>{blocks}</>
}
