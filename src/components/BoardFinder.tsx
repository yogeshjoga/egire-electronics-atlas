import { useMemo, useRef, useState } from 'react'
import { graph } from '../lib/content'
import { searchConcepts } from '../lib/search'

/** Search box and phase dropdown. Either one takes you straight to a node on the board. */
export function BoardFinder({ selected, onPick }: { selected?: string; onPick: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const hits = useMemo(() => searchConcepts(graph.concepts, q, 8), [q])

  const pick = (id: string) => {
    setQ('')
    setOpen(false)
    setI(0)
    input.current?.blur()
    onPick(id)
  }

  return (
    <div className="finder">
      <div className="finder-box">
        <input
          ref={input} value={q} role="combobox" aria-expanded={open} aria-controls="finder-list"
          aria-autocomplete="list" aria-label="Find a concept on the board" placeholder="Find a concept"
          aria-activedescendant={open && hits[i] ? `finder-${hits[i].id}` : undefined}
          onChange={(e) => { setQ(e.target.value); setI(0); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setI(Math.min(i + 1, hits.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setI(Math.max(i - 1, 0)) }
            if (e.key === 'Enter' && hits[i]) pick(hits[i].id)
            if (e.key === 'Escape') { setOpen(false); input.current?.blur() }
          }}
        />
        {open && (
          <ul id="finder-list" role="listbox" aria-label="Matching concepts">
            {hits.map((c, k) => (
              <li
                key={c.id} id={`finder-${c.id}`} role="option" aria-selected={k === i}
                onMouseEnter={() => setI(k)}
                onMouseDown={(e) => { e.preventDefault(); pick(c.id) }}
              >
                <b>{c.title}</b><span>Phase {c.phase}</span>
              </li>
            ))}
            {hits.length === 0 && <li className="none">No concept matches. Try a shorter word.</li>}
          </ul>
        )}
      </div>
      <select aria-label="Choose a concept by phase" value={selected ?? ''} onChange={(e) => { if (e.target.value) pick(e.target.value) }}>
        <option value="">Choose a concept</option>
        {graph.phases.map((p) => (
          <optgroup key={p.n} label={`${p.n}. ${p.title}`}>
            {graph.concepts.filter((c) => c.phase === p.n).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
