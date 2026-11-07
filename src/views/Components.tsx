import { useEffect, useMemo, useState } from 'react'
import data from '../parts/sensors.json'
import typesMd from '../parts/types.md?raw'
import fpvMd from '../parts/fpv.md?raw'
import aiMd from '../parts/ai.md?raw'
import selectionMd from '../parts/selection.md?raw'
import { graph } from '../lib/content'
import { DRONE_CATEGORIES, SENSOR_LESSONS } from '../lib/parts'
import { Guide } from './Symbols'

const TABS: [string, string][] = [['sensors', 'Sensors'], ['choosing', 'Choosing sensors'], ['types', 'All component types'], ['fpv', 'FPV parts'], ['ai', 'AI hardware']]

interface Sensor { n: number; name: string; category: string; measures: string; why: string; uses: string; when: string; example: string }
const sensors = data.sensors as Sensor[]

function Sensors({ open }: { open: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const s = q.trim().toLowerCase()
  const list = sensors.filter((x) =>
    (cat === 'all' || (cat === 'drone' ? DRONE_CATEGORIES.includes(x.category) : x.category === cat)) &&
    (!s || `${x.name} ${x.measures} ${x.uses} ${x.when} ${x.example}`.toLowerCase().includes(s)))
  return (
    <>
      <div className="filter-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a sensor, such as gyroscope or LiDAR" aria-label="Find a sensor" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
          <option value="all">All 30 categories</option>
          <option value="drone">Most useful for drones</option>
          {data.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="lede">Showing {list.length} of {sensors.length}. Select a sensor to read about it.</p>
      {data.categories.map((c) => {
        const items = list.filter((x) => x.category === c)
        if (!items.length) return null
        const lessons = SENSOR_LESSONS[c] ?? []
        return (
          <section key={c}>
            <h2>{c}</h2>
            {lessons.length > 0 && (
              <div className="chips dark sensor-lessons">
                {lessons.map((id) => <button key={id} type="button" className="chip" onClick={() => open(id)}>{graph.byId.get(id)!.title}</button>)}
              </div>
            )}
            <div className="sensor-list">
              {items.map((x) => (
                <details key={x.n}>
                  <summary><span>{String(x.n).padStart(3, '0')}</span><b>{x.name}</b><em>{x.measures}</em></summary>
                  <dl>
                    <div><dt>Why it exists</dt><dd>{x.why}</dd></div>
                    <div><dt>Used in</dt><dd>{x.uses}</dd></div>
                    <div><dt>When to use it</dt><dd>{x.when}</dd></div>
                    <div><dt>Example</dt><dd>{x.example}</dd></div>
                  </dl>
                </details>
              ))}
            </div>
          </section>
        )
      })}
      {list.length === 0 && <p className="lede">No sensor matches. Try a shorter word, or choose all categories.</p>}
      <p className="lede fine">Hobby gas, smoke and flame modules are not certified safety devices. Part names are examples: check current datasheets before design.</p>
    </>
  )
}

export function Components({ tab, go, open }: { tab?: string; go: (t: string) => void; open: (id: string) => void }) {
  const t = TABS.some(([k]) => k === tab) ? tab! : 'sensors'
  useEffect(() => { document.querySelector('.stage')?.scrollTo(0, 0) }, [t])
  const raw = useMemo(() => ({ choosing: selectionMd, types: typesMd, fpv: fpvMd, ai: aiMd } as Record<string, string>)[t], [t])
  return (
    <div className="page wide">
      <h1>Components</h1>
      <p className="lede">Every sensor and component family, and which parts to know for FPV drones and AI hardware.</p>
      <div className="sim-seg sub-tabs" role="group" aria-label="Section">
        {TABS.map(([k, n]) => <button key={k} type="button" aria-pressed={t === k} onClick={() => go(k)}>{n}</button>)}
      </div>
      {t === 'sensors' ? <Sensors open={open} /> : <Guide key={t} raw={raw} />}
    </div>
  )
}
