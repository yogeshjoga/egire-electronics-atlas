import { useEffect, useState } from 'react'
import { C, Controls, Out, Plot, Seg, Sim, Slider, Stage, prefersReduced } from './kit'
import { Resistor } from './circuits'
import { buckRipple, si, traceWidthMm } from '../lib/physics'

export function BinaryViz() {
  const [bits, setBits] = useState([0, 0, 1, 0, 1, 0, 1, 0])
  const v = bits.reduce((s, b) => s * 2 + b, 0)
  const signed = v >= 128 ? v - 256 : v
  return (
    <Sim note="Flip any bit. Each position is worth double the one to its right.">
      <div className="bit-row">
        {bits.map((b, i) => (
          <button key={i} type="button" aria-pressed={b === 1} aria-label={`Bit worth ${2 ** (7 - i)}`} onClick={() => setBits(bits.map((x, k) => (k === i ? 1 - x : x)))}>
            <b>{b}</b><small>{2 ** (7 - i)}</small>
          </button>
        ))}
      </div>
      <Out items={[['Decimal', String(v)], ['Hexadecimal', '0x' + v.toString(16).toUpperCase().padStart(2, '0')], ['Two\'s complement', String(signed)], ['Pin voltage on bit 0', bits[7] ? '3.3 V' : '0 V']]} />
    </Sim>
  )
}

const GATES: Record<string, (a: number, b: number) => number> = {
  AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b, XNOR: (a, b) => 1 - (a ^ b),
}

export function LogicViz() {
  const [g, setG] = useState('XOR')
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const y = GATES[g](a, b)
  const lamp = (x: number, yy: number, on: number, label: string) => (
    <g><circle cx={x} cy={yy} r={15} fill={on ? C.gold : C.grid} /><text x={x} y={yy + 5} textAnchor="middle" fontWeight={600} fill={on ? C.mask : C.silk}>{on}</text><text x={x} y={yy - 22} textAnchor="middle" className="sim-t">{label}</text></g>
  )
  return (
    <Sim note="Below the gate is a half adder, the first step towards a CPU: XOR gives the sum, AND gives the carry.">
      <Stage h={170} label={`${g} gate with inputs ${a} and ${b}`}>
        <path d="M60 50H180M60 120H180M280 85H400" stroke={C.grid} strokeWidth={4} />
        <rect x={180} y={34} width={100} height={102} rx={46} fill={C.grid} />
        <text x={230} y={92} textAnchor="middle" fontSize={20} fontWeight={600} fill={C.silk}>{g}</text>
        <g role="button" tabIndex={0} aria-label={`Input A is ${a}`} style={{ cursor: 'pointer' }} onClick={() => setA(1 - a)} onKeyDown={(e) => e.key === 'Enter' && setA(1 - a)}>{lamp(50, 50, a, 'A')}</g>
        <g role="button" tabIndex={0} aria-label={`Input B is ${b}`} style={{ cursor: 'pointer' }} onClick={() => setB(1 - b)} onKeyDown={(e) => e.key === 'Enter' && setB(1 - b)}>{lamp(50, 120, b, 'B')}</g>
        {lamp(420, 85, y, 'Output')}
      </Stage>
      <Controls><Seg label="Gate" value={g} onChange={setG} options={Object.keys(GATES).map((k) => [k, k])} /></Controls>
      <table className="truth">
        <thead><tr><th>A</th><th>B</th><th>{g}</th></tr></thead>
        <tbody>{[[0, 0], [0, 1], [1, 0], [1, 1]].map(([p, q]) => (
          <tr key={`${p}${q}`} className={p === a && q === b ? 'on' : undefined}><td>{p}</td><td>{q}</td><td>{GATES[g](p, q)}</td></tr>
        ))}</tbody>
      </table>
      <Out items={[['Half adder sum', String(a ^ b)], ['Half adder carry', String(a & b)], ['In binary', `${a} + ${b} = ${(a & b)}${a ^ b}`]]} />
    </Sim>
  )
}

export function FlipFlopViz() {
  const [d, setD] = useState(1)
  const [q, setQ] = useState(0)
  const [count, setCount] = useState(0)
  const [run, setRun] = useState(false)
  const [hist, setHist] = useState<{ d: number; q: number; c: number }[]>([])
  const clock = () => {
    setQ(d)
    setCount((c) => (c + 1) % 16)
    setHist((h) => [...h.slice(-23), { d, q: d, c: count + 1 }])
  }
  useEffect(() => {
    if (!run || prefersReduced()) return
    const id = setInterval(clock, 600)
    return () => clearInterval(id)
  })
  const bits = [3, 2, 1, 0].map((i) => (count >> i) & 1)
  const row = (y: number, sel: (h: { d: number; q: number; c: number }) => number, color: string, label: string) => {
    const p = hist.map((h, i) => `${i ? 'L' : 'M'}${60 + i * 19} ${y - sel(h) * 18}H${79 + i * 19}`).join('')
    return <g><text x={8} y={y} className="sim-t">{label}</text><path d={p} fill="none" stroke={color} strokeWidth={2} /></g>
  }
  return (
    <Sim note="Q copies D only on a clock edge, and holds it in between. That is one bit of memory. Each counter bit toggles at half the rate of the bit to its right.">
      <Stage h={118} label="Timing diagram">
        {row(36, (h) => h.d, C.cyan, 'D')}
        {row(72, (h) => h.q, C.gold, 'Q')}
        {row(108, (h) => h.c & 1, C.pink, 'Bit 0')}
      </Stage>
      <div className="bit-row small">
        {bits.map((b, i) => <span key={i} data-on={b}><b>{b}</b><small>{2 ** (3 - i)}</small></span>)}
      </div>
      <Controls>
        <Seg label="D input" value={d} onChange={setD} options={[[0, 'D = 0'], [1, 'D = 1']]} />
        <div className="sim-seg">
          <button type="button" onClick={clock}>Send one clock pulse</button>
          <button type="button" aria-pressed={run} onClick={() => setRun(!run)}>{run ? 'Stop clock' : 'Run clock'}</button>
        </div>
      </Controls>
      <Out items={[['Q output', String(q)], ['Counter value', String(count)]]} />
    </Sim>
  )
}

export function PwmViz() {
  const [duty, setDuty] = useState(25)
  const [v, setV] = useState(12)
  const [f, setF] = useState(20000)
  const d = duty / 100
  const pts: [number, number][] = []
  for (let c = 0; c < 4; c++) { pts.push([c, 0], [c, v], [c + d, v], [c + d, 0]) }
  pts.push([4, 0])
  return (
    <Sim note="The switch is only ever fully on or fully off, so it wastes little power. The load responds to the dashed average.">
      <Plot h={170} x={[0, 4]} y={[0, v * 1.2]} series={[{ pts }]} marks={[{ y: v * d, color: C.cyan }]} xlabel="Time (periods)" ylabel="Volts" label="PWM waveform" divs={[8, 4]} />
      <Controls>
        <Slider label="Duty cycle" value={duty} min={0} max={100} step={1} onChange={setDuty} show={`${duty}%`} />
        <Slider label="Supply" value={v} min={3} max={24} step={0.5} onChange={setV} show={`${v} V`} />
        <Slider label="Frequency" value={f} min={100} max={500000} log onChange={setF} show={si(f, 'Hz')} />
      </Controls>
      <Out items={[['Average voltage', `${(v * d).toFixed(2)} V`], ['On time', si(d / f, 's')], ['Period', si(1 / f, 's')]]} />
    </Sim>
  )
}

export function BuckViz() {
  const [mode, setMode] = useState<'buck' | 'boost'>('buck')
  const [vin, setVin] = useState(22.2)
  const [duty, setDuty] = useState(22.5)
  const [iout, setIout] = useState(3)
  const [l, setL] = useState(10e-6)
  const [f, setF] = useState(500e3)
  const d = duty / 100
  const vout = mode === 'buck' ? vin * d : vin / (1 - Math.min(d, 0.9))
  const ripple = mode === 'buck' ? buckRipple(vin, vout, l, f) : (vin * d) / (l * f)
  const iAvg = mode === 'buck' ? iout : iout / (1 - Math.min(d, 0.9))
  const pts: [number, number][] = []
  for (let c = 0; c < 4; c++) { pts.push([c, iAvg - ripple / 2], [c + d, iAvg + ripple / 2]) }
  pts.push([4, iAvg - ripple / 2])
  const dcm = ripple / 2 > iAvg
  const top = iAvg + Math.max(ripple, 0.5)
  return (
    <Sim note="The inductor current ramps up while the switch is on and down while it is off. Ripple shrinks with a bigger inductor or a faster switch.">
      <Plot h={180} x={[0, 4]} y={[0, top * 1.1]} series={[{ pts: pts.map(([a, b]) => [a, Math.max(b, 0)]) }]} marks={[{ y: iAvg, color: C.cyan }]} xlabel="Time (switching periods)" ylabel="Inductor current (A)" label="Inductor current ripple" divs={[8, 4]} />
      <Controls>
        <Seg label="Converter" value={mode} onChange={setMode} options={[['buck', 'Buck (step down)'], ['boost', 'Boost (step up)']]} />
        <Slider label="Input" value={vin} min={3} max={30} step={0.1} onChange={setVin} show={`${vin.toFixed(1)} V`} />
        <Slider label="Duty cycle" value={duty} min={5} max={90} step={0.5} onChange={setDuty} show={`${duty}%`} />
        <Slider label="Load current" value={iout} min={0.1} max={10} step={0.1} onChange={setIout} show={`${iout.toFixed(1)} A`} />
        <Slider label="Inductor" value={l} min={1e-6} max={100e-6} log onChange={setL} show={si(l, 'H')} />
        <Slider label="Switching frequency" value={f} min={50e3} max={2e6} log onChange={setF} show={si(f, 'Hz')} />
      </Controls>
      <Out items={[['Output voltage', `${vout.toFixed(2)} V`], ['Ripple current', si(ripple, 'A')], ['Ripple share of average', `${((ripple / iAvg) * 100).toFixed(0)}%`, ripple / iAvg > 0.4], ['Mode', dcm ? 'Discontinuous' : 'Continuous']]} />
    </Sim>
  )
}

type Probe = 'r2' | 'batt' | 'series'

export function MultimeterViz() {
  const [dial, setDial] = useState<'V' | 'A' | 'Ω'>('V')
  const [at, setAt] = useState<Probe>('r2')
  const [fuse, setFuse] = useState(true)
  const V = 9, R1 = 1000, R2 = 2000
  const I = V / (R1 + R2)
  let reading = '', msg = 'Measuring voltage in parallel, across the part.'
  if (!fuse) { reading = 'No reading'; msg = 'The fuse inside the meter has blown. Replace it to go on.' }
  else if (dial === 'V') {
    reading = at === 'r2' ? '6.00 V' : at === 'batt' ? '9.00 V' : '0.00 V'
    if (at === 'series') msg = 'A voltmeter in series adds megohms to the loop, so almost nothing flows and the circuit stops working.'
  } else if (dial === 'A') {
    if (at === 'series') { reading = si(I, 'A'); msg = 'Correct. All of the loop current flows through the meter.' }
    else { reading = 'Short circuit'; msg = 'An ammeter has almost no resistance. Connected across a part, it shorts it, and the current blows the fuse.' }
  } else {
    reading = 'Invalid'
    msg = 'Never measure resistance on a powered circuit. Switch off, and lift the part out for a true reading.'
  }
  const bad = !fuse || reading === 'Short circuit' || reading === 'Invalid'
  const probes: Record<Probe, [number, number, number, number]> = { r2: [300, 56, 300, 150], batt: [110, 70, 110, 160], series: [190, 36, 240, 36] }
  const [ax, ay, bx, by] = probes[at]
  return (
    <Sim note={msg}>
      <Stage h={220} label="Multimeter connected to a circuit">
        <path d="M110 36H300V190H110Z" fill="none" stroke={C.grid} strokeWidth={4} />
        <rect x={94} y={100} width={32} height={26} fill={C.mask} />
        <line x1={95} x2={125} y1={106} y2={106} stroke={C.tin} strokeWidth={3} />
        <line x1={102} x2={118} y1={116} y2={116} stroke={C.tin} strokeWidth={3} />
        <text x={84} y={118} textAnchor="end" className="sim-t">9 V</text>
        <Resistor x={190 + 20} y={190} label="" />
        <text x={236} y={170} textAnchor="middle" className="sim-t">R1 1 kΩ</text>
        <Resistor x={300} y={78} vertical />
        <text x={316} y={108} className="sim-t">R2 2 kΩ</text>
        <rect x={376} y={40} width={128} height={150} rx={10} fill={C.gold} />
        <rect x={386} y={52} width={108} height={46} rx={3} fill={C.mask} />
        <text x={440} y={82} textAnchor="middle" fontSize={reading.length > 9 ? 13 : 19} fontWeight={600} fill={bad ? C.red : C.silk}>{reading}</text>
        <text x={440} y={138} textAnchor="middle" fontSize={30} fontWeight={600} fill={C.mask}>{dial}</text>
        <path d={`M${ax} ${ay}Q${(ax + 390) / 2} ${ay - 40} 392 178`} fill="none" stroke={C.red} strokeWidth={2} />
        <path d={`M${bx} ${by}Q${(bx + 400) / 2} ${by + 34} 420 190`} fill="none" stroke={C.dim} strokeWidth={2} />
        <circle cx={ax} cy={ay} r={5} fill={C.red} /><circle cx={bx} cy={by} r={5} fill={C.tin} />
      </Stage>
      <Controls>
        <Seg label="Meter dial" value={dial} onChange={(d) => { setDial(d); if (d === 'A' && at !== 'series') setFuse(false) }} options={[['V', 'Volts'], ['A', 'Amps'], ['Ω', 'Ohms']]} />
        <Seg label="Probe position" value={at} onChange={(p) => { setAt(p); if (dial === 'A' && p !== 'series') setFuse(false) }} options={[['r2', 'Across R2'], ['batt', 'Across battery'], ['series', 'In series (break the loop)']]} />
        {!fuse && <div className="sim-seg"><button type="button" onClick={() => { setFuse(true); setAt('series') }}>Replace the fuse</button></div>}
      </Controls>
    </Sim>
  )
}

export function ScopeViz() {
  const [wave, setWave] = useState<'sine' | 'square' | 'pwm'>('sine')
  const [vdiv, setVdiv] = useState(1)
  const [tdiv, setTdiv] = useState(0.2e-3)
  const [trig, setTrig] = useState(0)
  const amp = 2.5, f = 1000
  const sig = (t: number) => {
    const ph = (((t * f) % 1) + 1) % 1
    if (wave === 'sine') return amp * Math.sin(2 * Math.PI * ph)
    if (wave === 'square') return ph < 0.5 ? amp : -amp
    return ph < 0.2 ? 3.3 : 0
  }
  const canTrigger = wave === 'pwm' ? trig > 0 && trig < 3.3 : Math.abs(trig) < amp
  let t0 = 0
  if (canTrigger) {
    for (let k = 0; k < 2000; k++) {
      const t = (k / 2000) / f
      if (sig(t) <= trig && sig(t + 1 / (f * 2000)) > trig) { t0 = t; break }
    }
  }
  const drift = canTrigger ? 0 : ((Date.now() / 700) % 1) / f
  const span = tdiv * 10
  const ylim = vdiv * 4
  const tick = useState(0)[1]
  useEffect(() => {
    if (canTrigger || prefersReduced()) return
    const id = setInterval(() => tick((x) => x + 1), 120)
    return () => clearInterval(id)
  }, [canTrigger, tick])
  const pts: [number, number][] = []
  for (let i = 0; i <= 600; i++) { const x = (i / 600) * 10; pts.push([x, sig(t0 + drift + (i / 600) * span)]) }
  return (
    <Sim note={canTrigger ? 'Each sweep starts where the wave crosses the trigger level, so the picture stands still.' : 'Trigger level is outside the signal, so the sweeps are unsynchronised and the wave rolls. Move the trigger into the signal to lock it.'}>
      <Plot h={240} x={[0, 10]} y={[-ylim, ylim]} series={[{ pts, color: C.cyan }]} marks={[{ y: trig, color: C.gold }]} label="Oscilloscope screen" divs={[10, 8]} />
      <Controls>
        <Seg label="Input signal" value={wave} onChange={setWave} options={[['sine', '1 kHz sine'], ['square', '1 kHz square'], ['pwm', '3.3 V PWM, 20%']]} />
        <Slider label="Volts per division" value={vdiv} min={0.1} max={5} log onChange={setVdiv} show={si(vdiv, 'V')} />
        <Slider label="Time per division" value={tdiv} min={10e-6} max={5e-3} log onChange={setTdiv} show={si(tdiv, 's')} />
        <Slider label="Trigger level" value={trig} min={-4} max={4} step={0.1} onChange={setTrig} show={`${trig.toFixed(1)} V`} />
      </Controls>
      <Out items={[['Cycles on screen', (span * f).toFixed(1)], ['Period', '1 ms'], ['Peak to peak', wave === 'pwm' ? '3.3 V' : '5 V'], ['Trigger', canTrigger ? 'Locked' : 'Not locked', !canTrigger]]} />
    </Sim>
  )
}

export function TraceViz() {
  const [i, setI] = useState(5)
  const [rise, setRise] = useState(10)
  const [oz, setOz] = useState(1)
  const [len, setLen] = useState(50)
  const [outer, setOuter] = useState(true)
  const w = traceWidthMm(i, rise, oz, outer)
  const t = oz * 0.035
  const rPerM = 1.68e-8 / ((w / 1000) * (t / 1000))
  const r = rPerM * (len / 1000)
  return (
    <Sim note="IPC-2221 is a conservative first estimate. Use IPC-2152 data or a thermal simulation for high-current designs.">
      <Stage h={120} label="Trace cross-section and width">
        <rect x={20} y={60} width={480} height={44} fill={C.grid} />
        <rect x={260 - Math.min(230, w * 22)} y={60 - Math.min(26, oz * 8)} width={Math.min(460, w * 44)} height={Math.min(26, oz * 8)} fill={C.copper} />
        <text x={260} y={24} textAnchor="middle" fontSize={20} fontWeight={600} fill={C.gold}>{w.toFixed(2)} mm wide</text>
        <text x={30} y={92} className="sim-t">FR-4</text>
      </Stage>
      <Controls>
        <Seg label="Layer" value={outer ? 'o' : 'i'} onChange={(v) => setOuter(v === 'o')} options={[['o', 'Outer layer'], ['i', 'Inner layer']]} />
        <Seg label="Copper weight" value={oz} onChange={setOz} options={[[0.5, '0.5 oz'], [1, '1 oz'], [2, '2 oz'], [3, '3 oz']]} />
        <Slider label="Current" value={i} min={0.1} max={40} step={0.1} onChange={setI} show={`${i.toFixed(1)} A`} />
        <Slider label="Allowed temperature rise" value={rise} min={5} max={60} step={1} onChange={setRise} show={`${rise} °C`} />
        <Slider label="Trace length" value={len} min={5} max={300} step={5} onChange={setLen} show={`${len} mm`} />
      </Controls>
      <Out items={[['Resistance', si(r, 'Ω')], ['Voltage drop', si(i * r, 'V')], ['Heat in trace', si(i * i * r, 'W')]]} />
    </Sim>
  )
}
