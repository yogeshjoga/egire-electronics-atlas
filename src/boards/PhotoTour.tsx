import { useState } from 'react'
import { PHOTOS } from './photos'
import { Inline } from '../components/Rich'

/** A real board photo with numbered parts. Select a number to learn what that part does. */
export function PhotoTour({ id }: { id: string }) {
  const photos = PHOTOS[id]
  const [p, setP] = useState(0)
  const [i, setI] = useState(0)
  if (!photos) return null
  const ph = photos[p]
  const s = ph.spots[i]
  return (
    <div className="tour">
      {photos.length > 1 && (
        <div className="sim-seg" role="group" aria-label="Choose a photo">
          {photos.map((x, k) => <button key={x.file} type="button" aria-pressed={k === p} onClick={() => { setP(k); setI(0) }}>{x.caption}</button>)}
        </div>
      )}
      <div className="tour-photo" style={{ aspectRatio: String(ph.ratio), width: `min(100%, ${Math.round(640 * ph.ratio)}px)` }}>
        <img src={`./boards/${ph.file}`} alt={ph.caption} loading="lazy" />
        {ph.spots.map((sp, k) => (
          <button key={sp.name} type="button" className="tour-spot" data-on={k === i || undefined} aria-pressed={k === i} aria-label={sp.name}
            style={{ left: `${sp.x}%`, top: `${sp.y}%` }} onClick={() => setI(k)}>{k + 1}</button>
        ))}
      </div>
      <div className="tour-note" aria-live="polite">
        <p><b>{i + 1}. {s.name}</b></p>
        <p><Inline text={s.text} /></p>
        <div className="sim-seg">
          <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}>Previous part</button>
          <button type="button" disabled={i === ph.spots.length - 1} onClick={() => setI(i + 1)}>Next part</button>
        </div>
      </div>
      <p className="tour-credit">
        Photo: {ph.caption}, by {ph.credit.author}, <a href={ph.credit.licenseUrl} target="_blank" rel="noreferrer">{ph.credit.license}</a>,
        via <a href={ph.credit.source} target="_blank" rel="noreferrer">Wikimedia Commons</a>. Resized. Numbered labels added.
      </p>
    </div>
  )
}
