import { useMemo, useRef, useState, type PointerEvent as RPE } from 'react'
import { Arrow, C, Chevron, Controls, Out, Seg, Sim, Slider, Stage, useCanvas, useTime } from './kit'
import { E_CHARGE, ELEMENTS, ELEMENT_NAMES, coulombForce, driftVelocity, electronConfig, shells, si } from '../lib/physics'

const RUNGS: { name: string; size: string; m: number; text: string }[] = [
  { name: 'Drone', size: '0.5 m', m: 0.5, text: 'An object you can hold. Its wires, chips and battery are all matter.' },
  { name: 'Copper wire', size: '1 mm', m: 1e-3, text: 'One wire from the battery lead. It looks smooth and continuous.' },
  { name: 'Copper crystal', size: '1 nm', m: 1e-9, text: 'Atoms in a repeating lattice, surrounded by a sea of free electrons.' },
  { name: 'Copper atom', size: '0.26 nm', m: 2.6e-10, text: '29 electrons around a nucleus. One outer electron is free to wander.' },
  { name: 'Nucleus', size: '10 fm', m: 1e-14, text: '29 protons and about 35 neutrons, held by the strong force.' },
  { name: 'Proton', size: '1.7 fm', m: 1.7e-15, text: 'Two up quarks and one down quark, bound by gluons.' },
  { name: 'Quark', size: 'Below 0.001 fm', m: 1e-18, text: 'Elementary, as far as any experiment can tell. Alongside the electron, this is the bottom of the ladder.' },
]

function Scene({ i, t }: { i: number; t: number }) {
  const cx = 260, cy = 120
  if (i === 0) return (
    <g stroke={C.tin} strokeWidth={3} fill="none">
      <path d={`M${cx - 90} ${cy - 50}L${cx + 90} ${cy + 50}M${cx + 90} ${cy - 50}L${cx - 90} ${cy + 50}`} />
      <rect x={cx - 26} y={cy - 16} width={52} height={32} rx={6} fill={C.grid} />
      {[[-90, -50], [90, -50], [-90, 50], [90, 50]].map(([x, y], k) => (
        <ellipse key={k} cx={cx + x} cy={cy + y} rx={46} ry={7} stroke={C.gold} strokeWidth={2} transform={`rotate(${(t * 900) % 360} ${cx + x} ${cy + y})`} />
      ))}
    </g>
  )
  if (i === 1) return (
    <g>
      <rect x={40} y={cy - 34} width={440} height={68} rx={34} fill="#22483e" />
      <rect x={40} y={cy - 18} width={440} height={36} rx={18} fill={C.copper} />
      <text x={cx} y={cy + 62} textAnchor="middle" className="sim-t">Copper core inside a plastic insulator</text>
    </g>
  )
  if (i === 2) return (
    <g>
      {Array.from({ length: 45 }, (_, k) => {
        const x = 60 + (k % 9) * 50, y = 30 + Math.floor(k / 9) * 46
        return <circle key={k} cx={x} cy={y} r={15} fill={C.copper} opacity={0.75} />
      })}
      {Array.from({ length: 24 }, (_, k) => {
        const x = 60 + ((k * 73 + t * (30 + (k % 5) * 12)) % 400), y = 25 + ((k * 41 + Math.sin(t + k) * 12 + 200) % 195)
        return <circle key={'e' + k} cx={x} cy={y} r={3} fill={C.cyan} />
      })}
    </g>
  )
  if (i === 3) return (
    <g fill="none">
      {[24, 48, 74, 100].map((r, k) => <circle key={r} cx={cx} cy={cy} r={r} stroke={C.grid} />)}
      <circle cx={cx} cy={cy} r={8} fill={C.gold} />
      {[2, 8, 18, 1].flatMap((n, s) => Array.from({ length: n }, (_, k) => {
        const r = [24, 48, 74, 100][s], a = (k / n) * 6.283 + t * (1.4 - s * 0.3)
        return <circle key={s + '-' + k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={s === 3 ? 5 : 3} fill={s === 3 ? C.gold : C.cyan} />
      }))}
    </g>
  )
  if (i === 4) return (
    <g>
      {Array.from({ length: 64 }, (_, k) => {
        const a = k * 2.4, r = 7 * Math.sqrt(k + 1) * 1.45
        return <circle key={k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={10} fill={k % 9 < 4 ? C.pink : C.dim} stroke={C.mask} />
      })}
    </g>
  )
  const quark = (x: number, y: number, name: string, color: string) => (
    <g key={name + x}><circle cx={x} cy={y} r={30} fill={color} /><text x={x} y={y + 8} textAnchor="middle" fontSize={24} fontWeight={600} fill={C.mask}>{name}</text></g>
  )
  if (i === 5) return (
    <g>
      <circle cx={cx} cy={cy} r={100} fill="none" stroke={C.pink} strokeDasharray="5 6" />
      {[[cx, cy - 50, cx - 52, cy + 34], [cx - 52, cy + 34, cx + 52, cy + 34], [cx + 52, cy + 34, cx, cy - 50]].map(([a, b, c, d], k) => (
        <path key={k} d={`M${a} ${b}Q${(a + c) / 2 + Math.sin(t * 4 + k) * 16} ${(b + d) / 2 + Math.cos(t * 4 + k) * 16} ${c} ${d}`} stroke={C.gold} strokeWidth={3} fill="none" />
      ))}
      {quark(cx, cy - 50, 'u', C.pink)}{quark(cx - 52, cy + 34, 'u', C.pink)}{quark(cx + 52, cy + 34, 'd', C.cyan)}
    </g>
  )
  return <g>{quark(cx, cy, 'u', C.pink)}<circle cx={cx} cy={cy} r={58 + Math.sin(t * 2) * 5} fill="none" stroke={C.grid} /></g>
}

export function ScaleViz() {
  const [i, setI] = useState(0)
  const t = useTime()
  const r = RUNGS[i]
  const factor = i > 0 ? RUNGS[i - 1].m / r.m : 1
  return (
    <Sim note={r.text}>
      <Stage h={240} label={`Picture of ${r.name}`}><Scene i={i} t={t} /></Stage>
      <Controls>
        <Slider label="Zoom in" value={i} min={0} max={6} step={1} onChange={setI} show={r.name} />
      </Controls>
      <Out items={[['Size', r.size], ['Zoom from last step', i ? `${Number(factor.toPrecision(2)).toLocaleString('en-IN')}×` : 'Start here'], ['Metres', r.m.toExponential(0)]]} />
    </Sim>
  )
}

const WORLDS: [string, number][] = [['Earth', 9.81], ['Moon', 1.62], ['Mars', 3.71], ['Deep space', 0]]

export function MassViz() {
  const [m, setM] = useState(1.5)
  const [f, setF] = useState(10)
  const [w, setW] = useState(0)
  const [t0, setT0] = useState(0)
  const t = useTime()
  const g = WORLDS[w][1]
  const a = f / m
  const el = Math.max(t - t0, 0)
  const x = Math.min(0.5 * a * el * el * 8, 350)
  const side = 26 + Math.sqrt(m) * 14
  const arrow = Math.min(8 + g * m * 1.3, 46)
  const push = 14 + f * 0.8
  return (
    <Sim note="Same push, more mass, less acceleration: that is inertia. Change the world and the weight changes, but the mass, and how hard it is to push, stay the same.">
      <Stage h={190} label="A block being pushed along the ground">
        <line x1={20} x2={500} y1={130} y2={130} stroke={C.dim} strokeWidth={2} />
        <g transform={`translate(${64 + x} 0)`}>
          <Arrow x1={-push - 4} y1={130 - side / 2} x2={-4} y2={130 - side / 2} width={4} head={12} />
          <rect x={0} y={130 - side} width={side} height={side} rx={3} fill={C.gold} />
          <text x={side / 2} y={130 - side / 2 + 5} textAnchor="middle" fontWeight={600} fill={C.mask}>{m.toFixed(1)} kg</text>
          {g > 0 && <Arrow x1={side / 2} y1={132} x2={side / 2} y2={132 + arrow} color={C.cyan} />}
        </g>
        <text x={20} y={22} className="sim-t">{WORLDS[w][0]}. Gold arrow: your push. Blue arrow: weight, the pull of gravity.</text>
      </Stage>
      <Controls>
        <Slider label="Mass" value={m} min={0.1} max={20} step={0.1} onChange={setM} show={`${m.toFixed(1)} kg`} />
        <Slider label="Push" value={f} min={1} max={50} step={1} onChange={setF} show={`${f} N`} />
        <Seg label="World" value={w} onChange={setW} options={WORLDS.map(([n], i) => [i, n])} />
        <div className="sim-seg"><button type="button" onClick={() => setT0(t)}>Push it again</button></div>
      </Controls>
      <Out items={[['Mass', `${m.toFixed(1)} kg`], ['Weight here', `${(m * g).toFixed(1)} N`], ['Acceleration', `${a.toFixed(2)} m/s²`], ['Hover thrust here', g ? `${(m * g).toFixed(1)} N` : 'None needed']]} />
    </Sim>
  )
}

export function AtomViz() {
  const [z, setZ] = useState(29)
  const t = useTime()
  const sh = shells(z)
  const valence = sh[sh.length - 1]
  const sup = (n: number) => String(n).replace(/d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)])
  const cfg = electronConfig(z).map((o) => `${o.n}${o.l}${sup(o.e)}`).join(' ')
  const cx = 260, cy = 130
  const role = z === 29 ? 'Lone 4s electron makes copper the classic conductor' :
    z === 14 ? 'Four valence electrons: the basis of the chip industry' :
    z === 5 ? 'Three valence electrons: a P-type dopant' :
    z === 15 ? 'Five valence electrons: an N-type dopant' :
    valence === 8 || z === 2 ? 'Full outer shell, so it barely reacts' :
    valence <= 2 ? 'Gives up outer electrons easily' : 'Shares or gains electrons in bonds'
  return (
    <Sim note={role}>
      <Stage h={260} label={`Bohr model of ${ELEMENT_NAMES[z - 1]}`}>
        {sh.map((n, s) => {
          const r = 34 + s * 30
          const outer = s === sh.length - 1
          return (
            <g key={s}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.grid} />
              {Array.from({ length: n }, (_, k) => {
                const a = (k / n) * 6.283 + t * (1 / (s + 1)) * 1.2
                return <circle key={k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={outer ? 5 : 3.5} fill={outer ? C.gold : C.cyan} />
              })}
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={18} fill={C.pink} />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.mask}>{ELEMENTS[z - 1]}</text>
        <text x={14} y={28} fontSize={22} fontWeight={600} fill={C.silk}>{ELEMENT_NAMES[z - 1]}</text>
        <text x={14} y={48} className="sim-t">{z} protons, {z} electrons</text>
      </Stage>
      <Controls>
        <Slider label="Atomic number Z" value={z} min={1} max={36} step={1} onChange={setZ} show={String(z)} />
        <Seg label="Key elements" value={z} onChange={setZ} options={[[1, 'H'], [5, 'B'], [14, 'Si'], [15, 'P'], [29, 'Cu'], [32, 'Ge']]} />
      </Controls>
      <Out items={[['Shells', sh.join(', ')], ['Valence electrons', String(valence)], ['Configuration', cfg]]} />
    </Sim>
  )
}

export function QuarksViz() {
  const [q, setQ] = useState<string[]>(['u', 'u', 'd'])
  const charge = q.reduce((s, x) => s + (x === 'u' ? 2 : -1), 0)
  const label = charge === 3 ? 'Proton: charge +1' : charge === 0 ? 'Neutron: charge 0' : 'Exotic baryon, not found in ordinary matter'
  const frac = (n: number) => (n % 3 === 0 ? `${n / 3 > 0 ? '+' : ''}${n / 3}` : `${n > 0 ? '+' : ''}${n}/3`)
  const pos: [number, number][] = [[260, 60], [190, 170], [330, 170]]
  return (
    <Sim note="Click a quark to switch it between up and down. Only two of the combinations are found in everyday atoms.">
      <Stage h={240} label={label}>
        <circle cx={260} cy={125} r={112} fill="none" stroke={C.dim} strokeDasharray="5 6" />
        {pos.map(([x, y], i) => (
          <g key={i} role="button" tabIndex={0} aria-label={`Quark ${i + 1}: ${q[i]}`} style={{ cursor: 'pointer' }}
            onClick={() => setQ(q.map((v, k) => (k === i ? (v === 'u' ? 'd' : 'u') : v)))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setQ(q.map((v, k) => (k === i ? (v === 'u' ? 'd' : 'u') : v))) } }}>
            <circle cx={x} cy={y} r={36} fill={q[i] === 'u' ? C.pink : C.cyan} />
            <text x={x} y={y + 2} textAnchor="middle" fontSize={26} fontWeight={600} fill={C.mask}>{q[i]}</text>
            <text x={x} y={y + 21} textAnchor="middle" fontSize={13} fill={C.mask}>{q[i] === 'u' ? '+2/3' : '−1/3'}</text>
          </g>
        ))}
      </Stage>
      <Out items={[['Sum of charges', `${frac(charge)} e`], ['Particle', label], ['In coulombs', `${((charge / 3) * E_CHARGE).toExponential(3)} C`]]} />
    </Sim>
  )
}

const SM: { s: string; name: string; group: string; charge: string; mass: string; note: string }[] = [
  { s: 'u', name: 'Up', group: 'quark', charge: '+2/3', mass: '2.2 MeV', note: 'Two per proton, one per neutron.' },
  { s: 'c', name: 'Charm', group: 'quark', charge: '+2/3', mass: '1.27 GeV', note: 'Second generation. Decays quickly.' },
  { s: 't', name: 'Top', group: 'quark', charge: '+2/3', mass: '173 GeV', note: 'The heaviest known elementary particle.' },
  { s: 'g', name: 'Gluon', group: 'boson', charge: '0', mass: '0', note: 'Carries the strong force.' },
  { s: 'H', name: 'Higgs', group: 'higgs', charge: '0', mass: '125 GeV', note: 'Its field gives elementary particles mass.' },
  { s: 'd', name: 'Down', group: 'quark', charge: '−1/3', mass: '4.7 MeV', note: 'One per proton, two per neutron.' },
  { s: 's', name: 'Strange', group: 'quark', charge: '−1/3', mass: '93 MeV', note: 'Second generation.' },
  { s: 'b', name: 'Bottom', group: 'quark', charge: '−1/3', mass: '4.18 GeV', note: 'Third generation.' },
  { s: 'γ', name: 'Photon', group: 'boson', charge: '0', mass: '0', note: 'Carries the electromagnetic force, the one behind all electronics.' },
  { s: '', name: '', group: '', charge: '', mass: '', note: '' },
  { s: 'e', name: 'Electron', group: 'lepton', charge: '−1', mass: '0.511 MeV', note: 'The particle that does the moving in your circuits.' },
  { s: 'μ', name: 'Muon', group: 'lepton', charge: '−1', mass: '106 MeV', note: 'A heavy electron that lives 2.2 µs.' },
  { s: 'τ', name: 'Tau', group: 'lepton', charge: '−1', mass: '1.78 GeV', note: 'The heaviest charged lepton.' },
  { s: 'Z', name: 'Z boson', group: 'boson', charge: '0', mass: '91 GeV', note: 'Carries the weak force.' },
  { s: '', name: '', group: '', charge: '', mass: '', note: '' },
  { s: 'νe', name: 'Electron neutrino', group: 'lepton', charge: '0', mass: 'Below 1 eV', note: 'Passes through the Earth almost unaffected.' },
  { s: 'νμ', name: 'Muon neutrino', group: 'lepton', charge: '0', mass: 'Below 0.2 MeV', note: 'Second generation neutrino.' },
  { s: 'ντ', name: 'Tau neutrino', group: 'lepton', charge: '0', mass: 'Below 18 MeV', note: 'Third generation neutrino.' },
  { s: 'W', name: 'W boson', group: 'boson', charge: '±1', mass: '80 GeV', note: 'Carries the weak force, and causes beta decay.' },
  { s: '', name: '', group: '', charge: '', mass: '', note: '' },
]
const SM_COLOR: Record<string, string> = { quark: C.pink, lepton: C.cyan, boson: C.gold, higgs: C.copper }

export function StandardModelViz() {
  const [sel, setSel] = useState(10)
  const p = SM[sel]
  return (
    <Sim note={p.note}>
      <div className="sm-grid">
        {SM.map((x, i) => x.s
          ? <button key={i} type="button" aria-pressed={i === sel} aria-label={x.name} onClick={() => setSel(i)} style={{ '--c': SM_COLOR[x.group] } as React.CSSProperties}>{x.s}</button>
          : <span key={i} />)}
      </div>
      <Out items={[['Particle', p.name], ['Family', p.group === 'higgs' ? 'Scalar boson' : p.group[0].toUpperCase() + p.group.slice(1)], ['Charge (e)', p.charge], ['Mass', p.mass]]} />
    </Sim>
  )
}

export function CoulombViz() {
  const [q1, setQ1] = useState(2)
  const [q2, setQ2] = useState(-3)
  const [r, setR] = useState(1)
  const f = coulombForce(q1 * 1e-6, q2 * 1e-6, r)
  const attract = q1 * q2 < 0
  const cy = 92
  const gap = 124 + ((r - 0.25) / 2.75) * 176
  const x1 = 260 - gap / 2, x2 = 260 + gap / 2
  const r1 = 16 + Math.abs(q1) * 2.4, r2 = 16 + Math.abs(q2) * 2.4
  // Arrows start at the edge of each charge, and both are always equal: Newton's third law.
  const want = 20 + Math.min(1, Math.log10(1 + f * 1000) / 3.5) * 58
  const len = attract ? Math.min(want, (gap - r1 - r2) / 2 - 5) : want
  const zero = q1 === 0 || q2 === 0
  const s1 = attract ? x1 + r1 : x1 - r1, s2 = attract ? x2 - r2 : x2 + r2
  const d1 = attract ? 1 : -1
  return (
    <Sim note={zero ? 'A neutral object feels no Coulomb force.' : `${attract ? 'Opposite charges attract.' : 'Like charges repel.'} Both arrows are always the same length, because each charge pushes on the other equally.`}>
      <Stage h={200} label="Two charges and the force between them">
        {[[x1, q1], [x2, q2]].map(([x, q], i) => (
          <g key={i}>
            <circle cx={x} cy={cy} r={16 + Math.abs(q) * 2.4} fill={q > 0 ? C.pink : q < 0 ? C.cyan : C.dim} />
            <text x={x} y={cy + 6} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.mask}>{q > 0 ? `+${q}` : q}</text>
          </g>
        ))}
        {!zero && <>
          <Arrow x1={s1} y1={cy} x2={s1 + d1 * len} y2={cy} width={4} head={13} />
          <Arrow x1={s2} y1={cy} x2={s2 - d1 * len} y2={cy} width={4} head={13} />
          <text x={s1 + (d1 * len) / 2} y={cy - 12} textAnchor="middle" className="sim-t" style={{ fill: C.gold }}>F</text>
          <text x={s2 - (d1 * len) / 2} y={cy - 12} textAnchor="middle" className="sim-t" style={{ fill: C.gold }}>F</text>
        </>}
        <path d={`M${x1} 150v10M${x2} 150v10M${x1} 155H${x2}`} stroke={C.dim} strokeWidth={1.5} fill="none" />
        <text x={260} y={180} textAnchor="middle" className="sim-t">Separation {r.toFixed(2)} m</text>
      </Stage>
      <Controls>
        <Slider label="Charge 1" value={q1} min={-5} max={5} step={1} onChange={setQ1} show={`${q1} µC`} />
        <Slider label="Charge 2" value={q2} min={-5} max={5} step={1} onChange={setQ2} show={`${q2} µC`} />
        <Slider label="Distance" value={r} min={0.25} max={3} step={0.05} onChange={setR} show={`${r.toFixed(2)} m`} />
      </Controls>
      <Out items={[['Force', si(f, 'N')], ['At double the distance', si(f / 4, 'N')]]} />
    </Sim>
  )
}

type Q = { x: number; y: number; q: number }
function eField(qs: Q[], x: number, y: number) {
  let ex = 0, ey = 0
  for (const c of qs) {
    const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy + 1, r3 = r2 * Math.sqrt(r2)
    ex += (c.q * dx) / r3
    ey += (c.q * dy) / r3
  }
  return [ex, ey]
}
function fieldLines(qs: Q[], W: number, H: number) {
  const lines: { d: string; hx: number; hy: number; ang: number }[] = []
  const pos = qs.filter((c) => c.q > 0)
  const seeds = pos.length ? pos : qs
  const sign = pos.length ? 1 : -1
  for (const s of seeds) {
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.283 + 0.1
      let x = s.x + 16 * Math.cos(a), y = s.y + 16 * Math.sin(a)
      let d = `M${x.toFixed(1)} ${y.toFixed(1)}`
      let hx = x, hy = y, ang = 0
      for (let k = 0; k < 340; k++) {
        const [ex, ey] = eField(qs, x, y)
        const m = Math.hypot(ex, ey) || 1
        if (k === 22) { hx = x; hy = y; ang = (Math.atan2(ey, ex) * 180) / Math.PI }
        x += (sign * 3 * ex) / m
        y += (sign * 3 * ey) / m
        if (x < -6 || y < -6 || x > W + 6 || y > H + 6) break
        if (qs.some((c) => c !== s && Math.hypot(x - c.x, y - c.y) < 12)) break
        if (k % 2 === 0) d += `L${x.toFixed(1)} ${y.toFixed(1)}`
      }
      lines.push({ d, hx, hy, ang })
    }
  }
  return lines
}

export function FieldViz() {
  const W = 520, H = 300
  const [qs, setQs] = useState<Q[]>([{ x: 170, y: 150, q: 1 }, { x: 350, y: 150, q: -1 }])
  const drag = useRef<number | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const lines = useMemo(() => fieldLines(qs, W, H), [qs])
  const move = (e: RPE) => {
    if (drag.current === null) return
    const b = svg.current!.getBoundingClientRect()
    const x = ((e.clientX - b.left) / b.width) * W, y = ((e.clientY - b.top) / b.height) * H
    setQs(qs.map((c, i) => (i === drag.current ? { ...c, x: Math.max(14, Math.min(W - 14, x)), y: Math.max(14, Math.min(H - 14, y)) } : c)))
  }
  return (
    <Sim note="Drag the charges. Lines leave + and end on −, and crowded lines mean a strong field.">
      <svg ref={svg} className="sim-stage" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Electric field lines around charges"
        onPointerMove={move} onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)} style={{ touchAction: 'none' }}>
        {lines.map((l, i) => <path key={i} d={l.d} fill="none" stroke={C.gold} strokeOpacity={0.65} strokeWidth={1.2} />)}
        {lines.map((l, i) => <Chevron key={i} x={l.hx} y={l.hy} angle={l.ang} size={5} />)}
        {qs.map((c, i) => (
          <g key={i} style={{ cursor: 'grab' }} onPointerDown={(e) => { drag.current = i; (e.target as Element).setPointerCapture?.(e.pointerId) }}>
            <circle cx={c.x} cy={c.y} r={15} fill={c.q > 0 ? C.pink : C.cyan} />
            <text x={c.x} y={c.y + 6} textAnchor="middle" fontSize={18} fontWeight={600} fill={C.mask} pointerEvents="none">{c.q > 0 ? '+' : '−'}</text>
          </g>
        ))}
      </svg>
      <Controls>
        <Seg<string> label="Charge layouts" value="" onChange={(v) => {
          if (v === 'dipole') setQs([{ x: 170, y: 150, q: 1 }, { x: 350, y: 150, q: -1 }])
          if (v === 'like') setQs([{ x: 170, y: 150, q: 1 }, { x: 350, y: 150, q: 1 }])
          if (v === 'one') setQs([{ x: 260, y: 150, q: 1 }])
          if (v === 'plates') setQs([...Array.from({ length: 7 }, (_, i) => ({ x: 150, y: 40 + i * 37, q: 1 })), ...Array.from({ length: 7 }, (_, i) => ({ x: 370, y: 40 + i * 37, q: -1 }))])
        }} options={[['dipole', 'Opposite pair'], ['like', 'Like pair'], ['one', 'Single charge'], ['plates', 'Capacitor plates']]} />
      </Controls>
    </Sim>
  )
}

interface P { x: number; y: number; vx: number; vy: number }
export function DriftViz() {
  const [i, setI] = useState(10)
  const [mm2, setMm2] = useState(2.5)
  const vd = driftVelocity(i, mm2 * 1e-6)
  const v = useRef({ i })
  v.current.i = i
  const ps = useRef<P[]>(Array.from({ length: 70 }, () => ({ x: Math.random() * 520, y: 10 + Math.random() * 160, vx: 0, vy: 0 })))
  const ions = useMemo(() => Array.from({ length: 60 }, (_, k) => [26 + (k % 12) * 43, 22 + Math.floor(k / 12) * 36]), [])
  const ref = useCanvas((c, w, h, dt) => {
    c.clearRect(0, 0, w, h)
    c.fillStyle = C.copper
    c.globalAlpha = 0.4
    for (const [x, y] of ions) { c.beginPath(); c.arc(x, y, 9, 0, 6.3); c.fill() }
    c.globalAlpha = 1
    c.fillStyle = C.cyan
    const push = v.current.i * 3
    for (const p of ps.current) {
      if (Math.random() < dt * 8) { const a = Math.random() * 6.28; p.vx = Math.cos(a) * 130; p.vy = Math.sin(a) * 130 }
      p.x += (p.vx - push) * dt   // electrons drift against the field, towards the + end on the left
      p.y += p.vy * dt
      if (p.x < 0) p.x += w
      if (p.x > w) p.x -= w
      if (p.y < 6 || p.y > h - 6) p.vy *= -1
      p.y = Math.max(6, Math.min(h - 6, p.y))
      c.beginPath(); c.arc(p.x, p.y, 3, 0, 6.3); c.fill()
    }
  })
  return (
    <Sim note="Electrons zig-zag at about a million m/s and only slowly slide left, towards the + end. The motion here is exaggerated by a huge factor.">
      <Stage h={52} label="Directions of the field and the electron drift">
        <text x={22} y={33} fontSize={22} fontWeight={600} fill={C.pink}>+</text>
        <text x={498} y={33} textAnchor="end" fontSize={22} fontWeight={600} fill={C.cyan}>−</text>
        {i > 0 && <>
          <Arrow x1={60} y1={18} x2={240} y2={18} />
          <text x={250} y={23} className="sim-t" style={{ fill: C.gold }}>Electric field and current</text>
          <Arrow x1={460} y1={38} x2={280} y2={38} color={C.cyan} />
          <text x={270} y={43} textAnchor="end" className="sim-t" style={{ fill: C.cyan }}>Electron drift</text>
        </>}
      </Stage>
      <canvas ref={ref} className="sim-stage" width={1040} height={360} style={{ aspectRatio: '520/180' }} aria-label="Electrons drifting through a copper lattice" />
      <Controls>
        <Slider label="Current" value={i} min={0} max={60} step={1} onChange={setI} show={`${i} A`} />
        <Slider label="Wire area" value={mm2} min={0.25} max={6} step={0.05} onChange={setMm2} show={`${mm2.toFixed(2)} mm²`} />
      </Controls>
      <Out items={[['Drift speed', si(vd, 'm/s')], ['Time to travel 1 m', i ? `${(1 / vd / 60).toFixed(0)} min` : 'Never'], ['Electrons per second', (i / E_CHARGE).toExponential(2)]]} />
    </Sim>
  )
}

const MATERIALS: { name: string; gap: number; kind: string }[] = [
  { name: 'Copper', gap: 0, kind: 'Conductor: bands overlap' },
  { name: 'Germanium', gap: 0.67, kind: 'Semiconductor' },
  { name: 'Silicon', gap: 1.12, kind: 'Semiconductor' },
  { name: 'GaN', gap: 3.4, kind: 'Wide-gap semiconductor' },
  { name: 'Diamond', gap: 5.5, kind: 'Insulator' },
  { name: 'Glass', gap: 9, kind: 'Insulator' },
]

export function BandsViz() {
  const [m, setM] = useState(2)
  const [T, setT] = useState(300)
  const mat = MATERIALS[m]
  const kT = 8.617e-5 * T
  const ratio = mat.gap ? Math.exp(-(mat.gap - 1.12) / (2 * kT)) * (T / 300) ** 1.5 * Math.exp(-1.12 / (2 * kT)) / Math.exp(-1.12 / (2 * 0.02585)) : 0
  const carriers = mat.gap ? 1e10 * ratio : 8.5e22
  const px = 13 // pixels per eV
  const midY = 120
  const gapPx = mat.gap * px
  const excited = mat.gap ? Math.min(14, Math.round(Math.log10(1 + carriers) * 0.95)) : 14
  return (
    <Sim note="Raise the temperature to see how heat frees carriers in a semiconductor, but not in a wide-gap insulator.">
      <Stage h={240} label={`Band diagram of ${mat.name}`}>
        <rect x={120} y={8} width={280} height={midY - gapPx / 2 - 8} fill={C.grid} />
        <rect x={120} y={midY + gapPx / 2 - (mat.gap ? 0 : 18)} width={280} height={232 - midY - gapPx / 2 + (mat.gap ? 0 : 18)} fill={C.copper} opacity={0.75} />
        <text x={130} y={26} className="sim-t">Conduction band</text>
        <text x={130} y={226} className="sim-t" fill={C.mask} style={{ fill: C.mask }}>Valence band (full)</text>
        {mat.gap > 0 && <>
          <path d={`M408 ${midY - gapPx / 2}h8V${midY + gapPx / 2}h-8`} fill="none" stroke={C.gold} strokeWidth={1.5} />
          <text x={424} y={midY + 5} fontSize={14} fontWeight={500} fill={C.gold}>Gap {mat.gap} eV</text>
        </>}
        {Array.from({ length: excited }, (_, k) => {
          const x = 138 + ((k * 53) % 250)
          return <circle key={k} cx={x} cy={midY - gapPx / 2 - 10 - (k % 3) * 11} r={4} fill={C.cyan} />
        })}
        {mat.gap > 0 && Array.from({ length: excited }, (_, k) => {
          const x = 138 + ((k * 53) % 250)
          return <circle key={'h' + k} cx={x} cy={midY + gapPx / 2 + 10 + (k % 3) * 11} r={4} fill="none" stroke={C.mask} strokeWidth={2} />
        })}
      </Stage>
      <Controls>
        <Seg label="Material" value={m} onChange={setM} options={MATERIALS.map((x, i) => [i, x.name])} />
        <Slider label="Temperature" value={T} min={100} max={600} step={5} onChange={setT} show={`${T} K`} />
      </Controls>
      <Out items={[['Type', mat.kind], ['Thermal energy kT', `${kT.toFixed(3)} eV`], ['Free carriers per cm³', mat.gap ? (carriers < 1e-3 ? 'Effectively none' : carriers.toExponential(1)) : '8.5e22']]} />
    </Sim>
  )
}
