import { useEffect, useMemo, useState } from 'react'
import { graph, matcher } from '../lib/content'
import { annotate } from '../lib/glossary'
import { Inline, Rich } from '../components/Rich'
import { GROUPS, SYMBOLS, type Sym } from '../symbols/library'
import { Out, Seg, Sim, Slider } from '../viz/kit'
import designMd from '../symbols/design.md?raw'
import sheetsMd from '../symbols/datasheets.md?raw'
import examplesMd from '../symbols/examples.md?raw'

const TABS: [string, string][] = [['library', 'Symbol library'], ['design', 'Schematic design'], ['datasheets', 'Reading datasheets'], ['examples', 'Real examples']]

export function splitGuide(raw: string) {
  return raw.replace(/\r\n/g, '\n').split(/^# /m).filter((s) => s.trim()).map((s) => {
    const nl = s.indexOf('\n')
    return { title: s.slice(0, nl).trim(), body: s.slice(nl + 1).trim() }
  })
}

function Guide({ raw }: { raw: string }) {
  const parts = useMemo(() => {
    const seen = new Set<string>()
    return splitGuide(raw).map((p) => ({ title: p.title, body: annotate(p.body, matcher, seen, '') }))
  }, [raw])
  return (
    <div className="guide">
      <nav aria-label="On this page">
        {parts.map((p, i) => <a key={p.title} href={`#sec-${i}`} onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${i}`)?.scrollIntoView({ behavior: 'smooth' }) }}>{p.title}</a>)}
      </nav>
      <div className="guide-body">
        {parts.map((p, i) => (
          <section key={p.title} id={`sec-${i}`} className="ds-section">
            <h3>{p.title}</h3>
            <Rich text={p.body} />
          </section>
        ))}
      </div>
    </div>
  )
}

function Draw({ s }: { s: Sym }) {
  return <svg viewBox="-4 -4 108 68" className="sym" role="img" aria-label={`${s.name} symbol`}><g>{s.draw}</g></svg>
}

function Library({ open }: { open: (id: string) => void }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState('r')
  const s = q.trim().toLowerCase()
  const list = SYMBOLS.filter((x) => !s || [x.name, x.ref, x.what, x.when, x.group].some((t) => t.toLowerCase().includes(s)))
  const cur = SYMBOLS.find((x) => x.id === sel)!
  return (
    <div className="sym-layout">
      <div>
        <div className="filter-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a symbol, such as MOSFET or ground" aria-label="Find a symbol" />
        </div>
        {GROUPS.map((g) => {
          const items = list.filter((x) => x.group === g)
          if (!items.length) return null
          return (
            <section key={g}>
              <h2>{g}</h2>
              <div className="sym-grid">
                {items.map((x) => (
                  <button key={x.id} type="button" aria-pressed={x.id === sel} onClick={() => setSel(x.id)}>
                    <Draw s={x} /><span>{x.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
        {list.length === 0 && <p className="lede">No symbol matches "{q}". Try a shorter word.</p>}
      </div>
      <aside className="sym-detail" aria-live="polite">
        <Draw s={cur} />
        <h2>{cur.name}</h2>
        <dl>
          <div><dt>Reference letter</dt><dd>{cur.ref}</dd></div>
          <div><dt>In KiCad</dt><dd><code>{cur.kicad}</code></dd></div>
          <div><dt>What it is</dt><dd>{cur.what}</dd></div>
          <div><dt>When to use it</dt><dd>{cur.when}</dd></div>
          <div><dt>Watch out</dt><dd>{cur.watch}</dd></div>
        </dl>
        {cur.lesson && <button type="button" className="solder" onClick={() => open(cur.lesson!)}>Open the lesson: {graph.byId.get(cur.lesson)!.title}</button>}
      </aside>
    </div>
  )
}

// An invented part, so the numbers can be chosen to teach. It is not a real product.
const ROWS: { label: string; value: string; note: string; group: string }[] = [
  { group: 'Absolute maximum ratings', label: 'Drain-source voltage, VDS', value: '40 V', note: 'Never exceed this, even for a spike. On a 6S battery (25.2 V), ringing can add 15 V or more, so 40 V is tight. Most designers would choose 60 V.' },
  { group: 'Absolute maximum ratings', label: 'Gate-source voltage, VGS', value: '±20 V', note: 'A thin oxide protects the gate. Static or ringing past this can kill the part instantly.' },
  { group: 'Absolute maximum ratings', label: 'Continuous drain current, ID at Tc = 25 °C', value: '120 A', note: 'A marketing favourite. The case is held at 25 °C by an ideal heatsink, which is impossible on a drone. Calculate your own limit below.' },
  { group: 'Absolute maximum ratings', label: 'Junction temperature, Tj', value: '150 °C', note: 'The silicon limit. Keep well below it, because lifetime falls as temperature rises.' },
  { group: 'Electrical characteristics', label: 'Gate threshold, VGS(th) at ID = 250 µA', value: '1.0 to 2.5 V', note: 'Not where it turns fully on. At 250 µA it has barely started to conduct.' },
  { group: 'Electrical characteristics', label: 'On-resistance, RDS(on) at VGS = 10 V', value: '3 mΩ max', note: 'Only true at 10 V gate drive. Use the row for your actual gate voltage.' },
  { group: 'Electrical characteristics', label: 'On-resistance, RDS(on) at VGS = 4.5 V', value: '5 mΩ max', note: 'Higher with less drive. A 5 V logic signal is about here.' },
  { group: 'Electrical characteristics', label: 'Total gate charge, Qg at VGS = 10 V', value: '60 nC', note: 'Sets how much current the gate driver needs, and how fast it can switch.' },
  { group: 'Thermal', label: 'Junction-to-ambient, θJA', value: '40 °C/W', note: 'Measured on a test board with a set copper area. Your board will differ.' },
]

function Trainer() {
  const [row, setRow] = useState(5)
  const [drive, setDrive] = useState(4.5)
  const [amps, setAmps] = useState(20)
  const [ta, setTa] = useState(45)
  const [theta, setTheta] = useState(40)
  const rds = drive === 10 ? 0.003 : 0.005
  const hot = 1.5   // RDS(on) rises with temperature; 1.5× is a common allowance.
  const p = amps * amps * rds * hot
  const tj = ta + p * theta
  const limit = Math.sqrt((150 - ta) / theta / (rds * hot))
  return (
    <section className="trainer">
      <h2>Practice: read a MOSFET datasheet</h2>
      <p className="lede">This part is invented for teaching, so the numbers are safe to learn from. Select any row.</p>
      <div className="sheet">
        <table>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.label} data-first={i === 0 || ROWS[i - 1].group !== r.group || undefined} aria-selected={i === row} onClick={() => setRow(i)}>
                <td><button type="button" onClick={() => setRow(i)}><small>{r.group}</small>{r.label}</button></td>
                <td>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sheet-note"><b>{ROWS[row].label}.</b> {ROWS[row].note}</p>
      </div>
      <Sim note="The sheet says 120 A. Your real limit comes from heat. The calculation allows 1.5× for on-resistance rising when hot.">
        <div className="sim-ctl">
          <Seg label="Gate drive" value={drive} onChange={setDrive} options={[[4.5, '4.5 V gate'], [10, '10 V gate']]} />
          <Slider label="Load current" value={amps} min={1} max={120} step={1} onChange={setAmps} show={`${amps} A`} />
          <Slider label="Ambient" value={ta} min={20} max={70} step={1} onChange={setTa} show={`${ta} °C`} />
          <Slider label="Thermal resistance, your board" value={theta} min={5} max={60} step={1} onChange={setTheta} show={`${theta} °C/W`} />
        </div>
        <Out items={[['Heat in the part', `${p.toFixed(1)} W`], ['Junction temperature', `${tj.toFixed(0)} °C`, tj > 150], ['Real current limit', `${limit.toFixed(0)} A`], ['Verdict', tj > 150 ? 'Too hot' : tj > 125 ? 'Little margin' : 'Fine']]} />
      </Sim>
      <p className="lede"><Inline text="The formula is $P = I^2R_{DS(on)}$, then $T_j = T_a+P\theta_{JA}$." /></p>
    </section>
  )
}

export function Symbols({ tab, go, open }: { tab?: string; go: (t: string) => void; open: (id: string) => void }) {
  const t = TABS.some(([k]) => k === tab) ? tab! : 'library'
  useEffect(() => { document.querySelector('.stage')?.scrollTo(0, 0) }, [t])
  return (
    <div className="page wide">
      <h1>Symbols and datasheets</h1>
      <p className="lede">Learn the symbols, draw a clear schematic, and read a datasheet without getting fooled.</p>
      <div className="sim-seg sub-tabs" role="group" aria-label="Section">
        {TABS.map(([k, n]) => <button key={k} type="button" aria-pressed={t === k} onClick={() => go(k)}>{n}</button>)}
      </div>
      {t === 'library' && <Library open={open} />}
      {t === 'design' && <Guide raw={designMd} />}
      {t === 'datasheets' && <><Guide raw={sheetsMd} /><Trainer /></>}
      {t === 'examples' && <Guide raw={examplesMd} />}
    </div>
  )
}
