import { useRef, useState } from 'react'
import { Arrow, C, Controls, Out, Plot, Seg, Sim, Slider, Stage, useTime } from './kit'
import { lowpassMag, resonance, seriesRlcZ, si } from '../lib/physics'

export function PhasorViz() {
  const [vp, setVp] = useState(325)
  const [f, setF] = useState(1)
  const [ph, setPh] = useState(60)
  const t = useTime()
  const w = 2 * Math.PI * f * 0.25
  const cx = 90, cy = 110, R = 76
  const a = w * t
  const b = a - (ph * Math.PI) / 180
  const wave = (shift: number) => {
    let d = ''
    for (let i = 0; i <= 300; i += 3) {
      const yy = cy - R * Math.sin(a - shift - i * 0.035)
      d += `${i ? 'L' : 'M'}${190 + i} ${yy.toFixed(1)}`
    }
    return d
  }
  return (
    <Sim note="The arrow's height over time draws the sine wave. Blue shows a second signal lagging by the phase angle.">
      <Stage h={220} label="Rotating phasor drawing a sine wave">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.grid} />
        <line x1={190} x2={500} y1={cy} y2={cy} stroke={C.grid} />
        <line x1={cx} y1={cy} x2={cx + R * Math.cos(b)} y2={cy - R * Math.sin(b)} stroke={C.cyan} strokeWidth={3} />
        <line x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy - R * Math.sin(a)} stroke={C.gold} strokeWidth={3} />
        <line x1={cx + R * Math.cos(a)} y1={cy - R * Math.sin(a)} x2={190} y2={cy - R * Math.sin(a)} stroke={C.gold} strokeDasharray="3 4" />
        <path d={wave((ph * Math.PI) / 180)} fill="none" stroke={C.cyan} strokeWidth={2} />
        <path d={wave(0)} fill="none" stroke={C.gold} strokeWidth={2} />
      </Stage>
      <Controls>
        <Slider label="Peak voltage" value={vp} min={1} max={400} step={1} onChange={setVp} show={`${vp} V`} />
        <Slider label="Speed (slowed)" value={f} min={0.2} max={4} step={0.1} onChange={setF} show={`${f.toFixed(1)}×`} />
        <Slider label="Phase shift" value={ph} min={-180} max={180} step={5} onChange={setPh} show={`${ph}°`} />
      </Controls>
      <Out items={[['RMS value', `${(vp / Math.SQRT2).toFixed(1)} V`], ['Phase as delay at 50 Hz', si((Math.abs(ph) / 360) * 0.02, 's')], ['Power factor cos φ', Math.cos((ph * Math.PI) / 180).toFixed(2)]]} />
    </Sim>
  )
}

export function RlcViz() {
  const [r, setR] = useState(20)
  const [l, setL] = useState(10e-6)
  const [c, setC] = useState(100e-9)
  const [f, setF] = useState(1e5)
  const f0 = resonance(l, c)
  const Q = Math.sqrt(l / c) / r
  const z = seriesRlcZ(r, l, c, f)
  const Z = (x: number) => Math.log10(seriesRlcZ(r, l, c, x).mag)
  return (
    <Sim note="At resonance the inductor and capacitor cancel, leaving only R. Below it the circuit acts capacitive, above it inductive. A real capacitor has this same dip at its self-resonance.">
      <Plot x={[1e3, 1e8]} y={[-1, 5]} logx series={[{ f: Z }, { f: (x) => Math.log10(1 / (2 * Math.PI * x * c)), color: C.cyan, dash: '4 4', width: 1.3 }, { f: (x) => Math.log10(2 * Math.PI * x * l), color: C.pink, dash: '4 4', width: 1.3 }]}
        marks={[{ x: f0 }]} dots={[{ x: f, y: Z(f) }]} xlabel="Frequency (Hz, log scale)" ylabel="log₁₀|Z| (blue capacitor, pink inductor)" label="Impedance against frequency" />
      <Controls>
        <Slider label="R" value={r} min={0.1} max={500} log onChange={setR} show={si(r, 'Ω')} />
        <Slider label="L" value={l} min={1e-8} max={1e-3} log onChange={setL} show={si(l, 'H')} />
        <Slider label="C" value={c} min={1e-11} max={1e-5} log onChange={setC} show={si(c, 'F')} />
        <Slider label="Test frequency" value={f} min={1e3} max={1e8} log onChange={setF} show={si(f, 'Hz')} />
      </Controls>
      <Out items={[['Resonance', si(f0, 'Hz')], ['Quality factor Q', Q.toFixed(2)], ['|Z| here', si(z.mag, 'Ω')], ['Phase here', `${z.phase.toFixed(0)}°`]]} />
    </Sim>
  )
}

export function FilterViz() {
  const [r, setR] = useState(1590)
  const [c, setC] = useState(100e-9)
  const [type, setType] = useState<'lp' | 'hp'>('lp')
  const [order, setOrder] = useState(1)
  const fc = 1 / (2 * Math.PI * r * c)
  const mag = (f: number) => {
    const m = type === 'lp' ? lowpassMag(f, fc) : lowpassMag(fc, f)
    return 20 * order * Math.log10(m)
  }
  return (
    <Sim note="Above the corner, each order adds 20 dB per decade of attenuation. Cascaded stages here are ideal and buffered, so the corner sits at −3 dB per stage.">
      <Plot x={[1, 1e6]} y={[-80, 5]} logx series={[{ f: mag }]} marks={[{ x: fc }, { y: -3 * order }]} xlabel="Frequency (Hz, log scale)" ylabel="Gain (dB)" label="Bode magnitude plot" />
      <Controls>
        <Seg label="Filter type" value={type} onChange={setType} options={[['lp', 'Low-pass'], ['hp', 'High-pass']]} />
        <Seg label="Order" value={order} onChange={setOrder} options={[[1, '1st order'], [2, '2nd order'], [3, '3rd order']]} />
        <Slider label="R" value={r} min={10} max={1e6} log onChange={setR} show={si(r, 'Ω')} />
        <Slider label="C" value={c} min={1e-10} max={1e-4} log onChange={setC} show={si(c, 'F')} />
      </Controls>
      <Out items={[['Corner frequency', si(fc, 'Hz')], ['Roll-off', `${20 * order} dB per decade`], ['Gain at 10× corner', `${mag(type === 'lp' ? fc * 10 : fc / 10).toFixed(1)} dB`]]} />
    </Sim>
  )
}

export function FourierViz() {
  const [n, setN] = useState(3)
  const [wave, setWave] = useState<'sq' | 'saw'>('sq')
  const term = (k: number) => (wave === 'sq' ? 2 * k - 1 : k)
  const amp = (k: number) => (wave === 'sq' ? 4 / (Math.PI * term(k)) : ((k % 2 ? 1 : -1) * 2) / (Math.PI * k))
  const sum = (x: number) => {
    let s = 0
    for (let k = 1; k <= n; k++) s += amp(k) * Math.sin(term(k) * x)
    return s
  }
  const bars: [number, number][] = []
  for (let k = 1; k <= n; k++) bars.push([term(k), Math.abs(amp(k))])
  return (
    <Sim note={wave === 'sq' ? 'A square wave uses odd harmonics only, falling as 1/n. Sharp edges need high frequencies, which is the root of EMI. The overshoot at the corners is the Gibbs effect.' : 'A sawtooth uses every harmonic.'}>
      <Plot h={180} x={[0, 4 * Math.PI]} y={[-1.5, 1.5]} series={[{ f: sum }, ...(n > 1 ? [{ f: (x: number) => amp(1) * Math.sin(term(1) * x), color: C.cyan, width: 1.2, dash: '4 4' }] : [])]} xlabel="Time" label="Sum of harmonics" divs={[8, 6]} />
      <Stage h={90} label="Harmonic amplitudes">
        {bars.map(([h, a]) => <rect key={h} x={34 + (h - 1) * (470 / Math.max(term(n), 12))} y={78 - a * 54} width={Math.max(3, 300 / Math.max(term(n), 12))} height={a * 54} fill={C.gold} />)}
        <text x={510} y={14} textAnchor="end" className="sim-t">Spectrum: strength of each harmonic</text>
      </Stage>
      <Controls>
        <Seg label="Waveform" value={wave} onChange={setWave} options={[['sq', 'Square'], ['saw', 'Sawtooth']]} />
        <Slider label="Harmonics added" value={n} min={1} max={40} step={1} onChange={setN} show={String(n)} />
      </Controls>
    </Sim>
  )
}

export function InductionViz() {
  const [turns, setTurns] = useState(100)
  const [pos, setPos] = useState(0)
  const [auto, setAuto] = useState(true)
  const t = useTime(auto)
  const x = auto ? 150 * Math.sin(t * 2) : pos
  const speed = auto ? 300 * Math.cos(t * 2) : 0
  // Flux from the magnet through the coil: bell-shaped in position.
  const flux = (p: number) => 1 / (1 + (p / 60) ** 2)
  const dFlux = (flux(x + 0.5) - flux(x - 0.5)) * speed
  const emf = -turns * dFlux * 0.0004
  const hist = useRef<[number, number][]>([])
  if (auto) {
    hist.current.push([t, emf])
    if (hist.current.length > 240) hist.current.shift()
  }
  const t0 = hist.current[0]?.[0] ?? 0
  const loops = Math.min(14, 4 + Math.floor(turns / 25))
  return (
    <Sim note="No motion means no voltage, however strong the magnet. Only change induces EMF. The sign flips as the magnet leaves, which is Lenz's law at work.">
      <Stage h={140} label="Magnet moving through a coil">
        {Array.from({ length: loops }, (_, i) => (
          <ellipse key={i} cx={260 + (i - loops / 2) * 9} cy={70} rx={8} ry={42} fill="none" stroke={C.copper} strokeWidth={2.5} />
        ))}
        <g transform={`translate(${260 + x} 70)`}>
          <rect x={-46} y={-14} width={46} height={28} fill={C.red} />
          <rect x={0} y={-14} width={46} height={28} fill={C.cyan} />
          <text x={-23} y={6} textAnchor="middle" fontWeight={600} fill={C.mask}>N</text>
          <text x={23} y={6} textAnchor="middle" fontWeight={600} fill={C.mask}>S</text>
          {Math.abs(speed) > 12 && <Arrow x1={0} y1={-26} x2={Math.sign(speed) * (14 + Math.abs(speed) / 6)} y2={-26} />}
        </g>
      </Stage>
      <Plot h={130} x={[t0, t0 + 4.2]} y={[-6, 6]} series={[{ pts: hist.current, color: C.gold }]} xlabel="Time" ylabel="Induced EMF" label="Induced voltage against time" divs={[8, 4]} />
      <Controls>
        <Seg label="Motion" value={auto ? 'a' : 'h'} onChange={(v) => setAuto(v === 'a')} options={[['a', 'Moving'], ['h', 'Held still']]} />
        {!auto && <Slider label="Magnet position" value={pos} min={-170} max={170} step={1} onChange={setPos} show={`${pos}`} />}
        <Slider label="Coil turns" value={turns} min={10} max={300} step={10} onChange={setTurns} show={String(turns)} />
      </Controls>
      <Out items={[['Flux through the coil', `${(flux(x) * 100).toFixed(0)}%`], ['EMF now', `${emf.toFixed(2)} (relative units)`]]} />
    </Sim>
  )
}

export function TransformerViz() {
  const [vp, setVp] = useState(230)
  const [np, setNp] = useState(1150)
  const [ns, setNs] = useState(60)
  const [rl, setRl] = useState(12)
  const vs = (vp * ns) / np
  const is = vs / rl
  const ip = (is * ns) / np
  const n1 = Math.min(16, Math.max(2, Math.round(np / 100))), n2 = Math.min(16, Math.max(2, Math.round(ns / 10)))
  const coil = (x: number, n: number, c: string) => Array.from({ length: n }, (_, i) => (
    <ellipse key={i} cx={x} cy={30 + ((i + 0.5) / n) * 130} rx={26} ry={65 / n + 1} fill="none" stroke={c} strokeWidth={2.2} />
  ))
  return (
    <Sim note="Power in equals power out, for an ideal transformer. It trades voltage for current, and the load's resistance sets how much flows.">
      <Stage h={190} label="Transformer windings on a core">
        <rect x={190} y={16} width={140} height={158} rx={6} fill="none" stroke={C.dim} strokeWidth={14} />
        {coil(190, n1, C.gold)}
        {coil(330, n2, C.cyan)}
        <text x={120} y={92} textAnchor="end" fontSize={18} fontWeight={600} fill={C.gold}>{vp} V</text>
        <text x={120} y={112} textAnchor="end" className="sim-t">{si(ip, 'A')}</text>
        <text x={400} y={92} fontSize={18} fontWeight={600} fill={C.cyan}>{si(vs, 'V')}</text>
        <text x={400} y={112} className="sim-t">{si(is, 'A')}</text>
      </Stage>
      <Controls>
        <Slider label="Primary voltage" value={vp} min={12} max={400} step={1} onChange={setVp} show={`${vp} V`} />
        <Slider label="Primary turns" value={np} min={50} max={2000} step={10} onChange={setNp} show={String(np)} />
        <Slider label="Secondary turns" value={ns} min={10} max={2000} step={10} onChange={setNs} show={String(ns)} />
        <Slider label="Load" value={rl} min={1} max={1000} log onChange={setRl} show={si(rl, 'Ω')} />
      </Controls>
      <Out items={[['Ratio', `${(np / ns).toFixed(2)} : 1`], ['Power each side', si(vs * is, 'W')], ['Load as seen from primary', si(rl * (np / ns) ** 2, 'Ω')]]} />
    </Sim>
  )
}

const STEPS: [string, string][] = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'A'], ['C', 'A'], ['C', 'B']]

export function EscViz() {
  const [rpm, setRpm] = useState(30)
  const t = useTime()
  const elec = (t * rpm) / 60 * 6
  const step = Math.floor(elec) % 6
  const [hi, lo] = STEPS[step]
  const coilAngle: Record<string, number> = { A: -90, B: 30, C: 150 }
  // The stator field jumps 60° per step; the rotor's north pole trails it by 60° to 120°.
  const rotor = elec * 60 - 150
  const cx = 150, cy = 128, R = 96
  const fieldAngle = ((-120 + step * 60) * Math.PI) / 180
  const state = (p: string) => (p === hi ? '+' : p === lo ? '−' : 'Off')
  return (
    <Sim note="Six steps per electrical turn. At each step one phase is driven high, one low, and the third floats, which is where the ESC listens for back-EMF. The white arrow is the stator's magnetic field, and the rotor chases it.">
      <Stage h={240} label="Three-phase motor commutation">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.grid} strokeWidth={8} />
        {(['A', 'B', 'C'] as const).map((p) => {
          const a = (coilAngle[p] * Math.PI) / 180
          const col = p === hi ? C.gold : p === lo ? C.cyan : C.dim
          return (
            <g key={p}>
              <line x1={cx + 56 * Math.cos(a)} y1={cy + 56 * Math.sin(a)} x2={cx + (R - 4) * Math.cos(a)} y2={cy + (R - 4) * Math.sin(a)} stroke={col} strokeWidth={18} />
              <text x={cx + (R + 15) * Math.cos(a)} y={cy + (R + 15) * Math.sin(a) + 5} textAnchor="middle" className="sim-t">{p}</text>
            </g>
          )
        })}
        <g transform={`rotate(${rotor} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={44} fill={C.mask} stroke={C.tin} />
          <path d={`M${cx - 40} ${cy}A40 40 0 0 1 ${cx + 40} ${cy}Z`} fill={C.red} />
          <path d={`M${cx - 40} ${cy}A40 40 0 0 0 ${cx + 40} ${cy}Z`} fill={C.cyan} />
        </g>
        <Arrow x1={cx} y1={cy} x2={cx + 50 * Math.cos(fieldAngle)} y2={cy + 50 * Math.sin(fieldAngle)} color={C.silk} width={4} head={13} />
        {(['A', 'B', 'C'] as const).map((p, i) => (
          <g key={p} transform={`translate(310 ${44 + i * 60})`}>
            <text x={0} y={5} className="sim-t">Phase {p}</text>
            <rect x={60} y={-14} width={130} height={28} rx={3} fill={p === hi ? C.gold : p === lo ? C.cyan : C.grid} />
            <text x={125} y={5} textAnchor="middle" fontWeight={600} fill={p === hi || p === lo ? C.mask : C.silk}>{state(p)}</text>
          </g>
        ))}
      </Stage>
      <Controls><Slider label="Speed (slowed)" value={rpm} min={5} max={120} step={1} onChange={setRpm} show={`${rpm}`} /></Controls>
      <Out items={[['Step', `${step + 1} of 6`], ['Current path', `${hi} to ${lo}`], ['Listening for back-EMF on', ['A', 'B', 'C'].find((p) => p !== hi && p !== lo)!]]} />
    </Sim>
  )
}
