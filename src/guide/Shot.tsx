import { useState } from 'react'
import { Inline } from '../components/Rich'
import type { Screen } from './guide'

/** A screenshot with numbered labels, and the matching numbered explanations beneath it. */
export function Shot({ s }: { s: Screen }) {
  const [on, setOn] = useState<number | null>(null)
  return (
    <figure className="shot">
      <div className="shot-img">
        <img src={`./guide/${s.file}`} alt={`Screenshot: ${s.title}`} loading="lazy" width={1440} height={900} />
        {s.spots.map((p, k) => (
          <button key={p.name} type="button" className="tour-spot" data-on={on === k || undefined} aria-label={`${k + 1}. ${p.name}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => { setOn(k); document.getElementById(`${s.id}-${k}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }}>{k + 1}</button>
        ))}
      </div>
      <ol className="shot-notes">
        {s.spots.map((p, k) => (
          <li key={p.name} id={`${s.id}-${k}`} data-on={on === k || undefined} onMouseEnter={() => setOn(k)} onFocus={() => setOn(k)} tabIndex={-1}>
            <span className="shot-n">{k + 1}</span>
            <p><b>{p.name}.</b> <Inline text={p.text} /></p>
          </li>
        ))}
      </ol>
    </figure>
  )
}
