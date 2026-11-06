import { useMemo, useState } from 'react'
import { C, Controls, Out, Plot, Seg, Sim, Slider, Stage } from './kit'
import { diesPerWafer, junctionTemp, microstripEeff, microstripZ0, pidStep, poissonYield, si } from '../lib/physics'

export function DeadTimeViz() {
  const [dead, setDead] = useState(100)
  const [tOff, setTOff] = useState(60)
  const [f, setF] = useState(24000)
  const [amps, setAmps] = useState(30)
  const T = 1000 // nanoseconds shown
  const hi: [number, number][] = [[0, 1], [400, 1], [400, 0], [400 + dead + 400, 0]]
  const loOn = 400 + dead
  const lo: [number, number][] = [[0, 0], [loOn, 0], [loOn, 1], [T, 1]]
  // The high-side FET keeps conducting for tOff after its gate falls.
  const hiReal: [number, number][] = [[0, 1], [400 + tOff, 1], [400 + tOff, 0], [T, 0]]
  const overlap = tOff - dead
  const shoot = overlap > 0
  const bodyLoss = 0.9 * amps * 2 * Math.max(dead - tOff, 0) * 1e-9 * f
  return (
    <Sim note={shoot ? 'Both switches are on at once. The battery is shorted through them, so current is limited only by loop resistance. This destroys MOSFETs.' : 'No overlap. During the gap, the load current flows through a body diode, which wastes a little power.'}>
      <Plot h={190} x={[0, T]} y={[-0.2, 3.6]} divs={[10, 4]} series={[
        { pts: hi.map(([a, b]) => [a, b + 2.3]), color: C.gold },
        { pts: hiReal.map(([a, b]) => [a, b + 1.15]), color: C.copper, dash: '5 3' },
        { pts: lo, color: C.cyan },
      ]} marks={shoot ? [{ x: loOn, color: C.red }, { x: 400 + tOff, color: C.red }] : []} xlabel="Time (ns)" ylabel="Gold high gate, orange high FET really on, blue low gate" label="Half-bridge gate timing" />
      <Controls>
        <Slider label="Dead time" value={dead} min={0} max={300} step={5} onChange={setDead} show={`${dead} ns`} />
        <Slider label="MOSFET turn-off delay" value={tOff} min={10} max={200} step={5} onChange={setTOff} show={`${tOff} ns`} />
        <Slider label="Switching frequency" value={f} min={8000} max={96000} step={1000} onChange={setF} show={si(f, 'Hz')} />
        <Slider label="Phase current" value={amps} min={1} max={80} step={1} onChange={setAmps} show={`${amps} A`} />
      </Controls>
      <Out items={[['Overlap', shoot ? `${overlap} ns` : 'None', shoot], ['Body diode loss', si(bodyLoss, 'W')], ['Duty lost to dead time', `${(2 * dead * 1e-9 * f * 100).toFixed(2)}%`]]} />
    </Sim>
  )
}

export function ThermalViz() {
  const [p, setP] = useState(3)
  const [ta, setTa] = useState(45)
  const [jc, setJc] = useState(2)
  const [cs, setCs] = useState(1)
  const [sa, setSa] = useState(37)
  const [limit, setLimit] = useState(125)
  const tj = junctionTemp(ta, p, jc, cs, sa)
  const steps: [string, number, string][] = [['Ambient', ta, C.cyan], ['Heatsink or board', ta + p * sa, C.gold], ['Case', ta + p * (sa + cs), C.copper], ['Junction', tj, tj > limit ? C.red : C.pink]]
  const top = Math.max(tj, limit) * 1.1
  const y = (v: number) => 180 - (v / top) * 165
  return (
    <Sim note="Heat flows like current, and each thermal resistance drops temperature the way a resistor drops voltage. The biggest number, usually board or heatsink to air, is where the effort pays.">
      <Stage h={196} label="Temperature at each stage">
        <line x1={20} x2={500} y1={y(limit)} y2={y(limit)} stroke={C.red} strokeDasharray="5 4" />
        <text x={500} y={y(limit) - 5} textAnchor="end" className="sim-t">Limit {limit} °C</text>
        {steps.map(([n, v, c], i) => (
          <g key={n}>
            <rect x={36 + i * 118} y={y(v)} width={82} height={180 - y(v)} fill={c} />
            <text x={77 + i * 118} y={y(v) - 5} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.silk}>{v.toFixed(0)} °C</text>
            <text x={77 + i * 118} y={193} textAnchor="middle" className="sim-t">{n}</text>
          </g>
        ))}
      </Stage>
      <Controls>
        <Slider label="Power" value={p} min={0.1} max={30} step={0.1} onChange={setP} show={`${p.toFixed(1)} W`} />
        <Slider label="Ambient" value={ta} min={0} max={70} step={1} onChange={setTa} show={`${ta} °C`} />
        <Slider label="Junction to case" value={jc} min={0.2} max={20} step={0.1} onChange={setJc} show={`${jc.toFixed(1)} °C/W`} />
        <Slider label="Case to heatsink" value={cs} min={0} max={5} step={0.1} onChange={setCs} show={`${cs.toFixed(1)} °C/W`} />
        <Slider label="Heatsink to air" value={sa} min={1} max={80} step={1} onChange={setSa} show={`${sa} °C/W`} />
        <Slider label="Design limit" value={limit} min={85} max={175} step={5} onChange={setLimit} show={`${limit} °C`} />
      </Controls>
      <Out items={[['Junction', `${tj.toFixed(0)} °C`, tj > limit], ['Margin', `${(limit - tj).toFixed(0)} °C`, tj > limit], ['Most power allowed', si((limit - ta) / (jc + cs + sa), 'W')]]} />
    </Sim>
  )
}

export function MicrostripViz() {
  const [w, setW] = useState(0.35)
  const [h, setH] = useState(0.2)
  const [oz, setOz] = useState(1)
  const [er, setEr] = useState(4.3)
  const t = oz * 0.035
  const z = microstripZ0(w, h, t, er)
  const eeff = microstripEeff(w, h, er)
  const ps = 3.336 * Math.sqrt(eeff)
  const valid = w / h > 0.1 && w / h < 3
  const s = 170
  return (
    <Sim note="A wider trace or thinner dielectric raises capacitance, which lowers impedance. This approximate formula gets you close; confirm final values with your fab's stackup tool.">
      <Stage h={140} label="Microstrip cross-section">
        <rect x={40} y={118} width={440} height={12} fill={C.copper} />
        <rect x={40} y={118 - h * s} width={440} height={h * s} fill={C.grid} />
        <rect x={260 - (w * s) / 2} y={118 - h * s - Math.max(t * s, 3)} width={w * s} height={Math.max(t * s, 3)} fill={C.copper} />
        <text x={50} y={112} className="sim-t">Dielectric, εr {er.toFixed(1)}</text>
        <text x={260} y={22} textAnchor="middle" fontSize={21} fontWeight={600} fill={C.gold}>{z > 0 ? `${z.toFixed(1)} Ω` : 'Out of range'}</text>
      </Stage>
      <Controls>
        <Slider label="Trace width" value={w} min={0.08} max={1} step={0.01} onChange={setW} show={`${w.toFixed(2)} mm`} />
        <Slider label="Height to plane" value={h} min={0.08} max={0.5} step={0.01} onChange={setH} show={`${h.toFixed(2)} mm`} />
        <Slider label="Dielectric constant" value={er} min={2.2} max={5} step={0.1} onChange={setEr} show={er.toFixed(1)} />
        <Seg label="Copper weight" value={oz} onChange={setOz} options={[[0.5, '0.5 oz'], [1, '1 oz'], [2, '2 oz']]} />
      </Controls>
      <Out items={[['Delay', `${ps.toFixed(2)} ps/mm`], ['Effective εr', eeff.toFixed(2)], ['Signal speed', `${(300 / Math.sqrt(eeff)).toFixed(0)} mm/ns`], ['Formula range', valid ? 'Inside' : 'Outside, do not trust it', !valid]]} />
    </Sim>
  )
}

function Wave({ y, levels, step, x0, color, label, h = 24 }: { y: number; levels: number[]; step: number; x0: number; color: string; label: string; h?: number }) {
  let d = ''
  levels.forEach((l, i) => { d += `${i ? 'L' : 'M'}${x0 + i * step} ${y - l * h}L${x0 + (i + 1) * step} ${y - l * h}` })
  return <g><text x={6} y={y - 4} className="sim-t">{label}</text><path d={d} fill="none" stroke={color} strokeWidth={2} /></g>
}

export function SerialViz() {
  const [bus, setBus] = useState<'uart' | 'spi' | 'i2c'>('uart')
  const [v, setV] = useState(0x41)
  const bits = Array.from({ length: 8 }, (_, i) => (v >> (7 - i)) & 1)   // MSB first
  const x0 = 56
  const W = 456
  let body = null
  let note = ''
  if (bus === 'uart') {
    const seq = [1, 0, ...[...bits].reverse(), 1, 1]
    const step = W / seq.length
    note = 'Idle high, one start bit low, eight data bits with the lowest bit first, then a stop bit high. There is no clock wire, so both sides must agree the baud rate.'
    body = <>
      <Wave y={80} levels={seq} step={step} x0={x0} color={C.gold} label="TX" h={44} />
      {['Idle', 'Start', '0', '1', '2', '3', '4', '5', '6', '7', 'Stop', 'Idle'].map((t, i) => (
        <text key={i} x={x0 + (i + 0.5) * step} y={100} textAnchor="middle" fontSize={12} fill={C.dim}>{t}</text>
      ))}
    </>
  } else if (bus === 'spi') {
    const n = 8 * 2 + 4
    const step = W / n
    const cs = [1, 0, ...Array(16).fill(0), 0, 1]
    const sck = [0, 0, ...bits.flatMap(() => [0, 1]), 0, 0]
    const mosi = [0, 0, ...bits.flatMap((b) => [b, b]), 0, 0]
    note = 'Chip select goes low, then the slave reads MOSI on each rising clock edge, highest bit first (mode 0). Data moves both ways at once, on MOSI and MISO.'
    body = <>
      <Wave y={42} levels={cs} step={step} x0={x0} color={C.pink} label="CS" h={22} />
      <Wave y={84} levels={sck} step={step} x0={x0} color={C.cyan} label="SCK" h={22} />
      <Wave y={126} levels={mosi} step={step} x0={x0} color={C.gold} label="MOSI" h={22} />
    </>
  } else {
    const addr = (v >> 1) & 0x7f
    const rw = v & 1
    const data = [...Array.from({ length: 7 }, (_, i) => (addr >> (6 - i)) & 1), rw, 0]
    const sda = [1, 0, 0, ...data.flatMap((b) => [b, b]), 0, 1, 1]
    const scl = [1, 1, 0, ...data.flatMap(() => [0, 1]), 1, 1, 1]
    const step = W / sda.length
    note = 'Start is SDA falling while SCL is high. Seven address bits and a read or write bit follow, then the device pulls SDA low to acknowledge. Stop is SDA rising while SCL is high.'
    body = <>
      <Wave y={54} levels={scl} step={step} x0={x0} color={C.cyan} label="SCL" h={30} />
      <Wave y={112} levels={sda} step={step} x0={x0} color={C.gold} label="SDA" h={30} />
    </>
  }
  return (
    <Sim note={note}>
      <Stage h={140} label={`${bus} waveform for value ${v}`}>{body}</Stage>
      <Controls>
        <Seg label="Bus" value={bus} onChange={setBus} options={[['uart', 'UART'], ['spi', 'SPI'], ['i2c', 'I²C']]} />
        <Slider label={bus === 'i2c' ? 'Address and R/W byte' : 'Byte to send'} value={v} min={0} max={255} step={1} onChange={setV} show={`${v} (0x${v.toString(16).toUpperCase().padStart(2, '0')})`} />
      </Controls>
      <Out items={[['Binary', bits.join('')], ['ASCII', v >= 32 && v < 127 ? String.fromCharCode(v) : 'Not printable'], ...(bus === 'i2c' ? [['7-bit address', '0x' + (v >> 1).toString(16).toUpperCase()] as [string, string], ['Direction', v & 1 ? 'Read' : 'Write'] as [string, string]] : [])]} />
    </Sim>
  )
}

export function PidViz() {
  const [kp, setKp] = useState(20)
  const [ki, setKi] = useState(5)
  const [kd, setKd] = useState(6)
  const [delay, setDelay] = useState(0)
  const [gust, setGust] = useState(0)
  const pts = useMemo(() => pidStep(kp, ki, kd, delay, 6, gust), [kp, ki, kd, delay, gust])
  const peak = Math.max(...pts.map((p) => p[1]))
  const stable = Math.abs(pts.at(-1)![1] - 1) < 0.05
  const rise = pts.find((p) => p[1] >= 0.9)?.[0]
  const unstable = !isFinite(peak) || peak > 3
  return (
    <Sim note="This models one drone axis being commanded to a new angle. Raise P until it responds fast, add D to calm the overshoot, and use I to remove steady error, which you can see after adding a gust. Then add delay: filtering and slow loops eat stability.">
      <Plot x={[0, 6]} y={[0, 2]} series={[{ pts: pts.map(([a, b]) => [a, Math.max(-1, Math.min(3, b))]) }]} marks={[{ y: 1, color: C.cyan }, ...(gust ? [{ x: 3 }] : [])]} xlabel="Time (s)" ylabel="Angle (1 = target)" label="Step response" divs={[6, 4]} />
      <Controls>
        <Slider label="P" value={kp} min={0} max={80} step={0.5} onChange={setKp} show={kp.toFixed(1)} />
        <Slider label="I" value={ki} min={0} max={40} step={0.5} onChange={setKi} show={ki.toFixed(1)} />
        <Slider label="D" value={kd} min={0} max={20} step={0.1} onChange={setKd} show={kd.toFixed(1)} />
        <Slider label="Loop delay" value={delay} min={0} max={300} step={5} onChange={setDelay} show={`${delay} ms`} />
        <Slider label="Gust at 3 s" value={gust} min={-20} max={20} step={1} onChange={setGust} show={String(gust)} />
      </Controls>
      <Out items={[['Overshoot', unstable ? 'Unstable' : `${Math.max(0, (peak - 1) * 100).toFixed(0)}%`, unstable || peak > 1.3], ['Rise time', rise !== undefined ? `${rise.toFixed(2)} s` : 'Never reaches it'], ['Settles on target', stable ? 'Yes' : 'No', !stable]]} />
    </Sim>
  )
}

export function WaferViz() {
  const [die, setDie] = useState(10)
  const [d0, setD0] = useState(0.1)
  const [cost, setCost] = useState(10000)
  const D = 300
  const R = 120
  const sc = (2 * R) / D
  const { cells, good, gross } = useMemo(() => {
    let seed = 12345
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    const defects = Array.from({ length: Math.round(d0 * Math.PI * 15 * 15) }, () => {
      const r = 150 * Math.sqrt(rnd()), a = rnd() * 6.283
      return [r * Math.cos(a), r * Math.sin(a)]
    })
    const out: { x: number; y: number; ok: boolean }[] = []
    const n = Math.ceil(D / die)
    for (let i = -n; i < n; i++) for (let j = -n; j < n; j++) {
      const x = i * die, y = j * die
      if (Math.max(Math.hypot(x, y), Math.hypot(x + die, y), Math.hypot(x, y + die), Math.hypot(x + die, y + die)) > 147) continue
      out.push({ x, y, ok: !defects.some(([a, b]) => a >= x && a < x + die && b >= y && b < y + die) })
    }
    return { cells: out, good: out.filter((c) => c.ok).length, gross: out.length }
  }, [die, d0])
  const area = die * die
  const model = poissonYield(d0, area)
  return (
    <Sim note="Red dies were hit by a random defect. Yield falls exponentially with die area, so doubling a chip's size more than doubles its cost. This is why chiplets exist. Wafer cost here is illustrative.">
      <Stage h={260} label="Wafer map">
        <circle cx={260} cy={130} r={R} fill={C.grid} stroke={C.dim} />
        {cells.map((c, i) => <rect key={i} x={260 + c.x * sc + 0.4} y={130 + c.y * sc + 0.4} width={die * sc - 0.8} height={die * sc - 0.8} fill={c.ok ? C.gold : C.red} />)}
      </Stage>
      <Controls>
        <Slider label="Die edge" value={die} min={5} max={30} step={1} onChange={setDie} show={`${die} mm`} />
        <Slider label="Defect density" value={d0} min={0.02} max={1} step={0.01} onChange={setD0} show={`${d0.toFixed(2)} per cm²`} />
        <Slider label="Wafer cost" value={cost} min={1000} max={25000} step={500} onChange={setCost} show={`$${cost.toLocaleString('en-US')}`} />
      </Controls>
      <Out items={[['Dies by formula', String(diesPerWafer(D, area))], ['Dies on this map', String(gross)], ['Good here', `${good} (${((good / gross) * 100).toFixed(0)}%)`], ['Model yield', `${(model * 100).toFixed(0)}%`], ['Cost per good die', good ? `$${(cost / good).toFixed(2)}` : 'None survive']]} />
    </Sim>
  )
}
