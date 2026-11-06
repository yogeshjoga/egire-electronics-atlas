import { useEffect, useMemo, useRef, useState } from 'react'
import { graph } from '../lib/content'
import { searchConcepts } from '../lib/search'
import { Inline } from './Rich'

export function Search({ onPick, onClose }: { onPick: (id: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => input.current?.focus(), [])

  const hits = useMemo(() => searchConcepts(graph.concepts, q, q.trim() ? 10 : 8), [q])

  return (
    <div className="search-back" onClick={onClose}>
      <div className="search" role="dialog" aria-label="Search concepts" onClick={(e) => e.stopPropagation()}>
        <input
          ref={input} value={q} placeholder={`Search ${graph.concepts.length} concepts, such as quark, Ohm or buck`}
          aria-label="Search concepts"
          onChange={(e) => { setQ(e.target.value); setI(0) }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') { e.preventDefault(); setI(Math.min(i + 1, hits.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setI(Math.max(i - 1, 0)) }
            if (e.key === 'Enter' && hits[i]) onPick(hits[i].id)
          }}
        />
        <ul>
          {hits.map((c, k) => (
            <li key={c.id}>
              <button type="button" data-on={k === i || undefined} onMouseEnter={() => setI(k)} onClick={() => onPick(c.id)}>
                <b>{c.title}</b>
                <span>Phase {c.phase}</span>
                <small><Inline text={c.summary} /></small>
              </button>
            </li>
          ))}
          {hits.length === 0 && <li className="none">No concept matches "{q}". Try a shorter word.</li>}
        </ul>
      </div>
    </div>
  )
}
