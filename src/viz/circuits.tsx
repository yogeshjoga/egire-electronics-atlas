import { useMemo, useState } from 'react'
import { C, Chevron, Controls, Out, Plot, Seg, Sim, Slider, Stage, useTime } from './kit'
import { divider, flightMinutes, parallel, rcCharge, si, twoSourceNode, wireResistance } from '../lib/physics'

/** Animated dashes moving along a path, showing conventional current. */
function Flow({ d, speed, t, color = C.gold }: { d: string; speed: number; t: number; color?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={4} strokeDasharray="3 15" strokeLinecap="round" strokeDashoffset={-(t * speed * 60) % 18} />
}

export function Resistor({ x, y, vertical, label }: { x: number; y: number; vertical?: boolean; label?: string }) {
  const zig = 'l5 -9l10 18l10 -18l10 18l10 -18l5 9'
  return (
    <g transform={`translate(${x} ${y}) ${vertical ? 'rotate(90)' : ''}`}>
      <rect x={-2} y={-11} width={54} height={22} fill={C.mask} />
      <path d={`M0 0${zig}`} fill="none" stroke={C.tin} strokeWidth={2.4} />
      {label && <text x={25} y={vertical ? 26 : -15} textAnchor="middle" className="sim-t" transform={vertical ? 'rotate(-90 25 26)' : undefined}>{label}</text>}
    </g>
  )
}

function Battery({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 16} y={y - 12} width={32} height={24} fill={C.mask} />
      <line x1={x - 15} x2={x + 15} y1={y - 7} y2={y - 7} stroke={C.tin} strokeWidth={3} />
      <line x1={x - 8} x2={x + 8} y1={y + 3} y2={y + 3} stroke={C.tin} strokeWidth={3} />
      <text x={x - 22} y={y + 5} textAnchor="end" className="sim-t">{label}</text>
    </g>
  )
}

export function OhmViz() {
  const [v, setV] = useState(12)
  const [r, setR] = useState(6)
  const t = useTime()
  const i = v / r
  const p = v * i
  const loop = 'M110 40H410V190H110V40'
  const hot = Math.min(1, p / 150)
  return (
    <Sim note="Dots show conventional current, from + round to −. Change one quantity and watch the other two respond.">
      <Stage h={230} label={`Circuit with ${v} volts across ${r} ohms`}>
        <path d={loop} fill="none" stroke={C.grid} strokeWidth={5} />
        <Flow d={loop} speed={Math.min(i, 9) * 0.8} t={t} />
        <Battery x={110} y={115} label={`${v.toFixed(1)} V`} />
        <rect x={382} y={85} width={56} height={60} rx={4} fill={C.copper} opacity={0.15 + hot * 0.85} />
        <Resistor x={410} y={90} vertical />
        <text x={446} y={120} fontSize={15} fontWeight={500} fill={C.silk}>{r.toFixed(1)} Ω</text>
        {i > 0 && <>
          <Chevron x={260} y={40} />
          <Chevron x={260} y={190} angle={180} />
          <text x={260} y={28} textAnchor="middle" className="sim-t" style={{ fill: C.gold }}>Current I</text>
        </>}
        <text x={260} y={120} textAnchor="middle" fontSize={32} fontWeight={600} fill={C.gold}>{si(i, 'A')}</text>
      </Stage>
      <Controls>
        <Slider label="Voltage" value={v} min={0} max={24} step={0.1} onChange={setV} show={`${v.toFixed(1)} V`} />
        <Slider label="Resistance" value={r} min={1} max={100} step={0.5} onChange={setR} show={`${r.toFixed(1)} Ω`} />
      </Controls>
      <Out items={[['Current I = V/R', si(i, 'A')], ['Power P = VI', si(p, 'W')], ['Heat in 10 s', si(p * 10, 'J')]]} />
    </Sim>
  )
}

const WIRE_MATS: [string, number][] = [['Copper', 1.68e-8], ['Aluminium', 2.65e-8], ['Silver', 1.59e-8], ['Nichrome', 1.1e-6]]
const AWG = [10, 12, 14, 16, 18, 20, 22, 24]
const awgArea = (n: number) => (Math.PI / 4) * (0.127 * 92 ** ((36 - n) / 39)) ** 2

export function WireViz() {
  const [m, setM] = useState(0)
  const [g, setG] = useState(1)
  const [len, setLen] = useState(0.3)
  const [amps, setAmps] = useState(40)
  const area = awgArea(AWG[g])
  const R = wireResistance(WIRE_MATS[m][1], len * 2, area * 1e-6)
  const drop = amps * R
  const loss = amps * amps * R
  const perM = (amps * amps * wireResistance(WIRE_MATS[m][1], 1, area * 1e-6))
  const hot = perM > 15
  return (
    <Sim note="Length is one way; the round trip out and back is counted. Heat grows with the square of current.">
      <Stage h={130} label="Wire thickness and heating">
        <rect x={30} y={65 - 4 - area * 6} width={460} height={8 + area * 12} rx={4 + area * 6} fill={hot ? C.red : C.copper} opacity={0.5 + Math.min(0.5, perM / 40)} />
        <text x={260} y={120} textAnchor="middle" className="sim-t">{AWG[g]} AWG, {area.toFixed(2)} mm², {hot ? 'running hot' : 'within a comfortable range'}</text>
      </Stage>
      <Controls>
        <Seg label="Material" value={m} onChange={setM} options={WIRE_MATS.map(([n], i) => [i, n])} />
        <Slider label="Gauge" value={g} min={0} max={7} step={1} onChange={setG} show={`${AWG[g]} AWG`} />
        <Slider label="Length" value={len} min={0.05} max={3} step={0.05} onChange={setLen} show={`${len.toFixed(2)} m`} />
        <Slider label="Current" value={amps} min={1} max={120} step={1} onChange={setAmps} show={`${amps} A`} />
      </Controls>
      <Out items={[['Resistance', si(R, 'Ω')], ['Voltage drop', si(drop, 'V')], ['Power lost', si(loss, 'W'), hot]]} />
    </Sim>
  )
}

export function SeriesParallelViz() {
  const [mode, setMode] = useState<'s' | 'p'>('s')
  const [v, setV] = useState(12)
  const [r1, setR1] = useState(10)
  const [r2, setR2] = useState(20)
  const [r3, setR3] = useState(30)
  const t = useTime()
  const rs = [r1, r2, r3]
  const RT = mode === 's' ? r1 + r2 + r3 : parallel(r1, r2, r3)
  const IT = v / RT
  return (
    <Sim note={mode === 's' ? 'One path: the same current in every part. Voltages add to the supply.' : 'Same two nodes: same voltage on every branch. Currents add to the total.'}>
      <Stage h={210} label={mode === 's' ? 'Series resistors' : 'Parallel resistors'}>
        {mode === 's' ? (
          <g>
            <path d="M70 30H450V180H70V30" fill="none" stroke={C.grid} strokeWidth={5} />
            <Flow d="M70 30H450V180H70V30" speed={Math.min(IT, 6)} t={t} />
            <Battery x={70} y={105} label={`${v} V`} />
            <Chevron x={260} y={180} angle={180} />
            <Chevron x={450} y={105} angle={90} />
            {rs.map((r, i) => <Resistor key={i} x={130 + i * 110} y={30} label={`${r} Ω: ${si(IT * r, 'V')}`} />)}
          </g>
        ) : (
          <g>
            <path d="M70 26H430M70 186H430M70 26V186" fill="none" stroke={C.grid} strokeWidth={5} />
            {rs.map((r, i) => {
              const x = 190 + i * 120
              return (
                <g key={i}>
                  <path d={`M${x} 26V186`} stroke={C.grid} strokeWidth={5} />
                  <Flow d={`M${x} 26V186`} speed={Math.min(v / r, 6)} t={t} />
                  <Resistor x={x} y={80} vertical label="" />
                  <text x={x + 16} y={100} className="sim-t">{r} Ω</text>
                  <text x={x + 16} y={118} className="sim-t" style={{ fill: C.gold }}>{si(v / r, 'A')}</text>
                  <Chevron x={x} y={160} angle={90} />
                </g>
              )
            })}
            <Battery x={70} y={105} label={`${v} V`} />
          </g>
        )}
      </Stage>
      <Controls>
        <Seg label="Connection" value={mode} onChange={setMode} options={[['s', 'Series'], ['p', 'Parallel']]} />
        <Slider label="Supply" value={v} min={1} max={24} step={0.5} onChange={setV} show={`${v} V`} />
        <Slider label="R1" value={r1} min={1} max={100} step={1} onChange={setR1} show={`${r1} Ω`} />
        <Slider label="R2" value={r2} min={1} max={100} step={1} onChange={setR2} show={`${r2} Ω`} />
        <Slider label="R3" value={r3} min={1} max={100} step={1} onChange={setR3} show={`${r3} Ω`} />
      </Controls>
      <Out items={[['Total resistance', si(RT, 'Ω')], ['Total current', si(IT, 'A')], ['Total power', si(v * IT, 'W')]]} />
    </Sim>
  )
}

export function KirchhoffViz() {
  const [v1, setV1] = useState(12)
  const [v2, setV2] = useState(5)
  const [r1, setR1] = useState(100)
  const [r2, setR2] = useState(220)
  const [r3, setR3] = useState(150)
  const s = twoSourceNode(v1, v2, r1, r2, r3)
  const t = useTime()
  const dir = (i: number, d: string, rev: string) => (i >= 0 ? d : rev)
  return (
    <Sim note="Node A is solved by writing KCL there. If I₃ goes negative, source 2 is being charged by source 1.">
      <Stage h={220} label="Two-source circuit with shared node">
        <path d="M60 40H460V190H60ZM260 40V190" fill="none" stroke={C.grid} strokeWidth={5} />
        <Flow d={dir(s.i1, 'M60 40H260', 'M260 40H60')} speed={Math.min(Math.abs(s.i1) * 30, 5)} t={t} />
        <Flow d={dir(s.i3, 'M460 40H260', 'M260 40H460')} speed={Math.min(Math.abs(s.i3) * 30, 5)} t={t} />
        <Flow d="M260 40V190" speed={Math.min(s.i2 * 30, 5)} t={t} />
        <Battery x={60} y={115} label="" />
        <Battery x={460} y={115} label="" />
        <text x={28} y={120} className="sim-t">V₁</text>
        <text x={482} y={120} className="sim-t">V₂</text>
        <Resistor x={130} y={40} label={`R1: I₁ = ${si(s.i1, 'A')}`} />
        <Resistor x={335} y={40} label={`R3: I₃ = ${si(s.i3, 'A')}`} />
        <Resistor x={260} y={90} vertical />
        <text x={276} y={120} className="sim-t">R2: I₂ = {si(s.i2, 'A')}</text>
        <Chevron x={100} y={40} angle={s.i1 >= 0 ? 0 : 180} />
        <Chevron x={420} y={40} angle={s.i3 >= 0 ? 180 : 0} />
        <Chevron x={260} y={165} angle={90} />
        <circle cx={260} cy={40} r={7} fill={C.gold} />
        <text x={260} y={22} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.gold}>A = {s.va.toFixed(2)} V</text>
      </Stage>
      <Controls>
        <Slider label="V₁" value={v1} min={0} max={24} step={0.5} onChange={setV1} show={`${v1} V`} />
        <Slider label="V₂" value={v2} min={0} max={24} step={0.5} onChange={setV2} show={`${v2} V`} />
        <Slider label="R1" value={r1} min={10} max={1000} step={10} onChange={setR1} show={`${r1} Ω`} />
        <Slider label="R2" value={r2} min={10} max={1000} step={10} onChange={setR2} show={`${r2} Ω`} />
        <Slider label="R3" value={r3} min={10} max={1000} step={10} onChange={setR3} show={`${r3} Ω`} />
      </Controls>
      <Out items={[
        ['KCL at A: I₁ + I₃ − I₂', `${si(s.i1, 'A')} + ${si(s.i3, 'A')} − ${si(s.i2, 'A')} = 0`],
        ['KVL left loop', `${v1} − ${(s.i1 * r1).toFixed(2)} − ${(s.i2 * r2).toFixed(2)} = 0`],
      ]} />
    </Sim>
  )
}

export function DividerViz() {
  const [vin, setVin] = useState(25.2)
  const [r1, setR1] = useState(68000)
  const [r2, setR2] = useState(10000)
  const [rl, setRl] = useState(1e6)
  const unloaded = divider(vin, r1, r2)
  const r2e = parallel(r2, rl)
  const loaded = divider(vin, r1, r2e)
  const err = ((unloaded - loaded) / unloaded) * 100
  return (
    <Sim note="This is the drone battery monitor. Lower the load resistance to see why a divider cannot power things.">
      <Stage h={230} label="Voltage divider with load">
        <path d="M120 30H220V60M220 110V130M220 180V205H120M220 130H330V150M330 200V205H220" fill="none" stroke={C.grid} strokeWidth={4} />
        <path d="M120 30V205" stroke={C.grid} strokeWidth={4} />
        <Battery x={120} y={118} label={`${vin.toFixed(1)} V`} />
        <Resistor x={220} y={58} vertical />
        <Resistor x={220} y={130} vertical />
        <Resistor x={330} y={148} vertical />
        <text x={236} y={88} className="sim-t">R1 {si(r1, 'Ω')}</text>
        <text x={150} y={160} className="sim-t">R2 {si(r2, 'Ω')}</text>
        <text x={346} y={178} className="sim-t">Load {si(rl, 'Ω')}</text>
        <circle cx={220} cy={130} r={6} fill={C.gold} />
        <text x={256} y={122} fontSize={20} fontWeight={600} fill={C.gold}>{loaded.toFixed(2)} V</text>
      </Stage>
      <Controls>
        <Slider label="Input" value={vin} min={1} max={30} step={0.1} onChange={setVin} show={`${vin.toFixed(1)} V`} />
        <Slider label="R1" value={r1} min={100} max={1e6} log onChange={setR1} show={si(r1, 'Ω')} />
        <Slider label="R2" value={r2} min={100} max={1e6} log onChange={setR2} show={si(r2, 'Ω')} />
        <Slider label="Load" value={rl} min={100} max={1e7} log onChange={setRl} show={si(rl, 'Ω')} />
      </Controls>
      <Out items={[['Unloaded', `${unloaded.toFixed(2)} V`], ['With load', `${loaded.toFixed(2)} V`], ['Error from load', `${err.toFixed(1)}%`, err > 5]]} />
    </Sim>
  )
}

export function TheveninViz() {
  const [vth, setVth] = useState(12)
  const [rth, setRth] = useState(4)
  const [rl, setRl] = useState(10)
  const P = (r: number) => (vth * vth * r) / (rth + r) ** 2
  const pmax = (vth * vth) / (4 * rth)
  const eff = rl / (rl + rth)
  return (
    <Sim note="The peak is at load = source resistance, yet efficiency there is only 50%.">
      <Plot x={[0.1, 100]} y={[0, pmax * 1.15]} logx series={[{ f: P }, { f: (r) => (r / (r + rth)) * pmax, color: C.cyan, dash: '5 4', width: 1.5 }]}
        marks={[{ x: rth }]} dots={[{ x: rl, y: P(rl) }]} xlabel="Load resistance (Ω, log scale)" ylabel="Load power (gold), efficiency (blue)" label="Load power against load resistance" />
      <Controls>
        <Slider label="Vth" value={vth} min={1} max={24} step={0.5} onChange={setVth} show={`${vth} V`} />
        <Slider label="Rth" value={rth} min={0.5} max={50} step={0.5} onChange={setRth} show={`${rth} Ω`} />
        <Slider label="Load" value={rl} min={0.1} max={100} log onChange={setRl} show={si(rl, 'Ω')} />
      </Controls>
      <Out items={[['Load power', si(P(rl), 'W')], ['Maximum possible', si(pmax, 'W')], ['Efficiency', `${(eff * 100).toFixed(0)}%`]]} />
    </Sim>
  )
}

const BANDS: [string, string][] = [['Black', '#222'], ['Brown', '#7a4a21'], ['Red', '#d33'], ['Orange', '#ee8a2c'], ['Yellow', '#f2d33c'], ['Green', '#2f9e55'], ['Blue', '#2f6fd6'], ['Violet', '#8a4fd0'], ['Grey', '#8c8c8c'], ['White', '#f4f4f4']]

export function ResistorCodeViz() {
  const [a, setA] = useState(4)
  const [b, setB] = useState(7)
  const [m, setM] = useState(2)
  const val = (a * 10 + b) * 10 ** m
  const pick = (label: string, v: number, set: (n: number) => void, max = 9) => (
    <Slider label={label} value={v} min={0} max={max} step={1} onChange={set} show={BANDS[v][0]} />
  )
  return (
    <Sim note="Four-band code: two digits, a multiplier, then tolerance. Gold means ±5%.">
      <Stage h={120} label={`Resistor with value ${si(val, 'Ω')}`}>
        <line x1={20} x2={500} y1={60} y2={60} stroke={C.tin} strokeWidth={4} />
        <rect x={130} y={26} width={260} height={68} rx={22} fill="#d9bb8a" />
        {[a, b, m].map((n, i) => <rect key={i} x={170 + i * 42} y={26} width={18} height={68} fill={BANDS[n][1]} />)}
        <rect x={340} y={26} width={18} height={68} fill={C.gold} />
      </Stage>
      <Controls>{pick('First digit', a, setA)}{pick('Second digit', b, setB)}{pick('Multiplier', m, setM, 7)}</Controls>
      <Out items={[['Value', si(val, 'Ω')], ['Calculation', `${a}${b} × 10${m === 0 ? '⁰' : '^' + m}`], ['SMD code', `${a}${b}${m}`]]} />
    </Sim>
  )
}

export function BatteryViz() {
  const [s, setS] = useState(6)
  const [mah, setMah] = useState(5000)
  const [cRate, setC] = useState(30)
  const [ir, setIr] = useState(3)
  const [motors, setMotors] = useState(400)
  const [fc, setFc] = useState(2.5)
  const [ai, setAi] = useState(24)
  const [cam, setCam] = useState(4)
  const vn = s * 3.7
  const wh = (vn * mah) / 1000
  const total = motors + fc + ai + cam
  const amps = total / vn
  const maxA = (cRate * mah) / 1000
  const r = (ir * s) / 1000
  const sag = amps * r
  const mins = flightMinutes(wh, total)
  const slices: [string, number, string][] = [['Motors', motors, C.gold], ['Flight controller', fc, C.pink], ['AI computer', ai, C.cyan], ['Camera', cam, C.copper]]
  let x = 20
  return (
    <Sim note="The default values are the lesson's example. Flight time assumes 80% usable capacity, so treat it as a first estimate.">
      <Stage h={92} label="Power budget bar">
        {slices.map(([n, p, c]) => {
          const w = total > 0 ? (p / total) * 480 : 0
          const el = <rect key={n} x={x} y={14} width={Math.max(w, 1)} height={30} fill={c} />
          x += w
          return el
        })}
        <text x={20} y={66} className="sim-t">Total {total.toFixed(1)} W from {vn.toFixed(1)} V at {amps.toFixed(1)} A</text>
        <text x={20} y={84} className="sim-t">Gold motors, pink flight controller, blue AI computer, orange camera</text>
      </Stage>
      <Controls>
        <Slider label="Cells in series" value={s} min={2} max={12} step={1} onChange={setS} show={`${s}S`} />
        <Slider label="Capacity" value={mah} min={500} max={30000} step={100} onChange={setMah} show={`${mah} mAh`} />
        <Slider label="C-rating" value={cRate} min={5} max={100} step={5} onChange={setC} show={`${cRate}C`} />
        <Slider label="Cell resistance" value={ir} min={1} max={15} step={0.5} onChange={setIr} show={`${ir} mΩ`} />
        <Slider label="Motors" value={motors} min={0} max={3000} step={10} onChange={setMotors} show={`${motors} W`} />
        <Slider label="Flight controller" value={fc} min={0} max={10} step={0.5} onChange={setFc} show={`${fc} W`} />
        <Slider label="AI computer" value={ai} min={0} max={60} step={1} onChange={setAi} show={`${ai} W`} />
        <Slider label="Camera" value={cam} min={0} max={20} step={0.5} onChange={setCam} show={`${cam} W`} />
      </Controls>
      <Out items={[
        ['Nominal energy', `${wh.toFixed(1)} Wh`],
        ['Flight time', total > 0 ? `${mins.toFixed(1)} min` : 'No load set'],
        ['Full charge', `${(s * 4.2).toFixed(1)} V`],
        ['Battery limit', `${maxA.toFixed(0)} A`, amps > maxA],
        ['Voltage sag', `${sag.toFixed(2)} V`],
        ['Heat in pack', `${(amps * amps * r).toFixed(1)} W`],
      ]} />
    </Sim>
  )
}

export function RcViz() {
  const [mode, setMode] = useState<'rc' | 'rl'>('rc')
  const [r, setR] = useState(10000)
  const [c, setC] = useState(100e-9)
  const [l, setL] = useState(10e-3)
  const [t1, setT1] = useState(1)
  const tau = mode === 'rc' ? r * c : l / r
  const series = useMemo(() => [{ f: (x: number) => rcCharge(1, x, 1) * 100 }], [])
  return (
    <Sim note={mode === 'rc' ? 'Capacitor voltage as a share of the supply. Each τ closes 63% of the remaining gap.' : 'Inductor current as a share of V/R. The same curve, with τ = L/R.'}>
      <Plot x={[0, 5]} y={[0, 100]} series={series} marks={[{ x: t1 }, { y: 63.2 }]} dots={[{ x: t1, y: rcCharge(1, t1, 1) * 100 }]}
        xlabel="Time (multiples of τ)" ylabel={mode === 'rc' ? 'Voltage (%)' : 'Current (%)'} label="Exponential charging curve" divs={[5, 5]} />
      <Controls>
        <Seg label="Circuit" value={mode} onChange={setMode} options={[['rc', 'RC'], ['rl', 'RL']]} />
        <Slider label="R" value={r} min={1} max={1e6} log onChange={setR} show={si(r, 'Ω')} />
        {mode === 'rc'
          ? <Slider label="C" value={c} min={1e-9} max={1e-3} log onChange={setC} show={si(c, 'F')} />
          : <Slider label="L" value={l} min={1e-6} max={1} log onChange={setL} show={si(l, 'H')} />}
        <Slider label="Time" value={t1} min={0} max={5} step={0.05} onChange={setT1} show={`${t1.toFixed(2)} τ`} />
      </Controls>
      <Out items={[['Time constant τ', si(tau, 's')], ['Settled at 5τ', si(tau * 5, 's')], ['Reached so far', `${(rcCharge(1, t1, 1) * 100).toFixed(1)}%`], ['At this moment', si(tau * t1, 's')]]} />
    </Sim>
  )
}
