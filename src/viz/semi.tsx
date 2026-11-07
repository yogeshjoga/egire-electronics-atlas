import { useState } from 'react'
import { Arrow, C, Controls, Out, Plot, Seg, Sim, Slider, Stage, useTime } from './kit'
import { adcLsb, aliasOf, depletionNm, mosfetId, shockley, si } from '../lib/physics'

export function DopingViz() {
  const [dop, setDop] = useState<'none' | 'n' | 'p'>('none')
  const t = useTime()
  const nx = 7, ny = 5, gx = 66, gy = 48, ox = 62, oy = 30
  const dopant = (i: number, j: number) => dop !== 'none' && ((i === 1 && j === 1) || (i === 5 && j === 3))
  return (
    <Sim note={dop === 'none' ? 'Pure silicon: every atom shares four bonds, so there is almost nothing free to carry current.' : dop === 'n' ? 'Phosphorus brings a fifth electron. It has no bond to sit in, so it wanders freely.' : 'Boron has only three electrons, leaving a gap in one bond. Neighbouring electrons hop in, so the hole moves.'}>
      <Stage h={250} label="Silicon lattice">
        {Array.from({ length: nx * ny }, (_, k) => {
          const i = k % nx, j = Math.floor(k / nx), x = ox + i * gx, y = oy + j * gy
          return (
            <g key={k} stroke={C.grid} strokeWidth={3}>
              {i < nx - 1 && <line x1={x} x2={x + gx} y1={y} y2={y} strokeDasharray={dop === 'p' && dopant(i, j) ? '3 7' : undefined} />}
              {j < ny - 1 && <line x1={x} x2={x} y1={y} y2={y + gy} />}
            </g>
          )
        })}
        {Array.from({ length: nx * ny }, (_, k) => {
          const i = k % nx, j = Math.floor(k / nx), x = ox + i * gx, y = oy + j * gy
          const d = dopant(i, j)
          return (
            <g key={k}>
              <circle cx={x} cy={y} r={15} fill={d ? (dop === 'n' ? C.cyan : C.pink) : C.dim} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.mask}>{d ? (dop === 'n' ? 'P' : 'B') : 'Si'}</text>
            </g>
          )
        })}
        {dop === 'n' && [0, 1].map((k) => (
          <circle key={k} cx={ox + ((t * 70 + k * 210) % 400)} cy={oy + gy * (k ? 3 : 1) + 24 * Math.sin(t * 3 + k) * 0.9} r={6} fill={C.gold} />
        ))}
        {dop === 'p' && [0, 1].map((k) => (
          <circle key={k} cx={ox + 400 - ((Math.floor(t * 2.5) * gx + k * 198) % 396)} cy={oy + gy * (k ? 3 : 1)} r={7} fill="none" stroke={C.gold} strokeWidth={3} />
        ))}
      </Stage>
      <Controls>
        <Seg label="Dopant" value={dop} onChange={setDop} options={[['none', 'Pure silicon'], ['n', 'Add phosphorus (N-type)'], ['p', 'Add boron (P-type)']]} />
      </Controls>
      <Out items={[['Majority carrier', dop === 'none' ? 'None: equal electrons and holes' : dop === 'n' ? 'Electrons' : 'Holes'], ['Carriers per cm³', dop === 'none' ? '1 × 10¹⁰' : '1 × 10¹⁶ (typical)'], ['Net charge', 'Still neutral']]} />
    </Sim>
  )
}

export function PnViz() {
  const [v, setV] = useState(0)
  const vbi = 0.72
  const w = depletionNm(vbi, v)
  const wp = Math.min(240, w * 0.45)
  const i = v >= 0 ? shockley(v) : -1e-12
  const forward = v > 0.55
  const t = useTime(forward)
  const iv = (x: number) => (x > 0 ? shockley(x) * 1000 : (x < -5.5 ? -((-5.5 - x) ** 2) * 60 : 0))
  return (
    <Sim note={v > 0.55 ? 'Forward: the barrier collapses and carriers flood across.' : v < 0 ? 'Reverse: the depletion region widens and only tiny leakage flows.' : 'Below about 0.6 V the barrier still blocks almost everything.'}>
      <Stage h={130} label="PN junction with depletion region">
        <rect x={20} y={14} width={240} height={90} fill={C.pink} opacity={0.45} />
        <rect x={260} y={14} width={240} height={90} fill={C.cyan} opacity={0.45} />
        <rect x={260 - wp / 2} y={14} width={wp} height={90} fill={C.mask} stroke={C.gold} />
        {wp > 44 && <>
          <Arrow x1={260 + wp / 2 - 8} y1={66} x2={260 - wp / 2 + 8} y2={66} />
          <text x={260} y={54} textAnchor="middle" className="sim-t" style={{ fill: C.gold }}>Built-in field</text>
        </>}
        <text x={40} y={36} fontSize={18} fontWeight={600} fill={C.silk}>P</text>
        <text x={470} y={36} fontSize={18} fontWeight={600} fill={C.silk}>N</text>
        <text x={260} y={122} textAnchor="middle" className="sim-t">Depletion region about {Math.round(w)} nm wide (illustrative doping)</text>
        {forward && Array.from({ length: 10 }, (_, k) => {
          const x = (t * 160 + k * 48) % 480
          return <circle key={k} cx={500 - x} cy={30 + (k % 5) * 15} r={4} fill={C.gold} />
        })}
      </Stage>
      <Plot h={170} x={[-7, 1]} y={[-100, 200]} series={[{ f: iv }]} dots={[{ x: v, y: iv(v) }]} xlabel="Voltage (V)" ylabel="Current (mA)" label="Diode current against voltage" divs={[8, 6]} />
      <Controls><Slider label="Bias voltage" value={v} min={-7} max={0.8} step={0.01} onChange={setV} show={`${v.toFixed(2)} V`} /></Controls>
      <Out items={[['Current', v < -5.5 ? 'Breakdown' : si(i, 'A')], ['Built-in potential', `${vbi} V`], ['Barrier now', `${Math.max(vbi - v, 0).toFixed(2)} V`]]} />
    </Sim>
  )
}

export function RectifierViz() {
  const [mode, setMode] = useState<'h' | 'f'>('f')
  const [c, setC] = useState(4700e-6)
  const [load, setLoad] = useState(1)
  const vp = 17, f = 50, vd = mode === 'f' ? 1.4 : 0.7
  const peak = vp - vd
  const pts: [number, number][] = []
  const T = 0.06, dt = 0.00004
  let vc = peak
  const rl = peak / load
  for (let s = 0; s < T; s += dt) {
    const sin = Math.sin(2 * Math.PI * f * s) * vp
    const src = mode === 'f' ? Math.abs(sin) - vd : sin - vd
    vc = src > vc ? src : vc * Math.exp(-dt / (rl * c))
    pts.push([s * 1000, vc])
  }
  const tail = pts.slice(pts.length / 2).map((p) => p[1])
  const ripple = Math.max(...tail) - Math.min(...tail)
  return (
    <Sim note="Blue is the rectified waveform, gold is what the load sees. A bigger capacitor or a lighter load reduces the ripple.">
      <Plot x={[0, 60]} y={[-20, 20]} series={[
        { f: (x) => { const s = Math.sin(2 * Math.PI * f * x / 1000) * vp; return mode === 'f' ? Math.max(Math.abs(s) - vd, 0) : Math.max(s - vd, 0) }, color: C.cyan, width: 1.4 },
        { f: (x) => Math.sin(2 * Math.PI * f * x / 1000) * vp, color: C.dim, width: 1, dash: '3 4' },
        { pts, color: C.gold },
      ]} xlabel="Time (ms)" ylabel="Volts" label="Rectifier output" />
      <Controls>
        <Seg label="Rectifier" value={mode} onChange={setMode} options={[['h', 'Half wave'], ['f', 'Full wave bridge']]} />
        <Slider label="Capacitor" value={c} min={47e-6} max={0.02} log onChange={setC} show={si(c, 'F')} />
        <Slider label="Load current" value={load} min={0.05} max={3} step={0.05} onChange={setLoad} show={`${load.toFixed(2)} A`} />
      </Controls>
      <Out items={[['Peak output', `${peak.toFixed(1)} V`], ['Ripple', `${ripple.toFixed(2)} V`, ripple > 3], ['Ripple frequency', `${mode === 'f' ? 100 : 50} Hz`]]} />
    </Sim>
  )
}

export function BjtViz() {
  const [ib, setIb] = useState(40)
  const [vcc, setVcc] = useState(12)
  const [rc, setRc] = useState(1000)
  const [beta, setBeta] = useState(150)
  const ic = (b: number, vce: number) => (b * beta * 1e-6 * (1 + vce / 100) * (1 - Math.exp(-vce / 0.15))) * 1000
  const icLoad = (vce: number) => ((vcc - vce) / rc) * 1000
  let lo = 0, hi = vcc
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2
    if (ic(ib, m) > icLoad(m)) hi = m
    else lo = m
  }
  const vce = lo
  const icq = icLoad(vce)
  const region = ib === 0 ? 'Cut-off: open switch' : vce < 0.3 ? 'Saturation: closed switch' : 'Active: amplifier'
  return (
    <Sim note="The dashed load line is set by the supply and collector resistor. The dot is where the transistor and the resistor agree.">
      <Plot x={[0, 15]} y={[0, 30]} series={[
        ...[20, 40, 60, 80, 100].map((b) => ({ f: (x: number) => ic(b, x), color: C.grid, width: 1.4 })),
        { f: (x: number) => ic(ib, x), color: C.gold },
        { f: icLoad, color: C.cyan, dash: '5 4', width: 1.6 },
      ]} dots={[{ x: vce, y: icq, color: C.pink }]} xlabel="VCE (V)" ylabel="IC (mA)" label="BJT output curves with load line" />
      <Controls>
        <Slider label="Base current" value={ib} min={0} max={120} step={1} onChange={setIb} show={`${ib} µA`} />
        <Slider label="Beta" value={beta} min={50} max={300} step={5} onChange={setBeta} show={String(beta)} />
        <Slider label="Supply" value={vcc} min={3} max={15} step={0.5} onChange={setVcc} show={`${vcc} V`} />
        <Slider label="Collector resistor" value={rc} min={100} max={10000} log onChange={setRc} show={si(rc, 'Ω')} />
      </Controls>
      <Out items={[['Region', region], ['IC', `${icq.toFixed(2)} mA`], ['VCE', `${vce.toFixed(2)} V`]]} />
    </Sim>
  )
}

export function MosfetViz() {
  const [vgs, setVgs] = useState(3.5)
  const [vds, setVds] = useState(4)
  const vth = 2, k = 20
  const id = mosfetId(vgs, vds, vth, k)
  const on = vgs > vth
  const sat = on && vds >= vgs - vth
  const region = !on ? 'Cut-off' : sat ? 'Saturation: current set by VGS' : 'Triode: acts like a resistor'
  const ron = on ? 1 / (k * (vgs - vth)) * 1000 : Infinity
  return (
    <Sim note="Raise the gate past threshold and a channel appears. The channel pinches at the drain end when VDS is larger than VGS − Vth.">
      <Stage h={110} label="MOSFET cross-section">
        <rect x={60} y={44} width={400} height={60} fill={C.pink} opacity={0.3} />
        <rect x={80} y={44} width={90} height={30} fill={C.cyan} opacity={0.7} />
        <rect x={350} y={44} width={90} height={30} fill={C.cyan} opacity={0.7} />
        <rect x={170} y={34} width={180} height={10} fill={C.tin} />
        <rect x={170} y={20} width={180} height={14} fill={on ? C.gold : C.dim} />
        <text x={260} y={14} textAnchor="middle" className="sim-t">Gate at {vgs.toFixed(1)} V</text>
        <text x={125} y={36} textAnchor="middle" className="sim-t">Source</text>
        <text x={395} y={36} textAnchor="middle" className="sim-t">Drain</text>
        {on && <path d={sat ? 'M170 44H340L350 44L340 52H170Z' : `M170 44H350V${44 + 3 + (vgs - vth) * 2}H170Z`} fill={C.gold} opacity={0.9} />}
      </Stage>
      <Plot h={190} x={[0, 10]} y={[0, 260]} series={[
        ...[3, 4, 5, 6].map((g) => ({ f: (x: number) => mosfetId(g, x, vth, k), color: C.grid, width: 1.4 })),
        { f: (x: number) => mosfetId(vgs, x, vth, k), color: C.gold },
      ]} dots={[{ x: vds, y: id, color: C.pink }]} xlabel="VDS (V)" ylabel="Drain current (relative)" label="MOSFET output curves" />
      <Controls>
        <Slider label="Gate voltage VGS" value={vgs} min={0} max={6} step={0.1} onChange={setVgs} show={`${vgs.toFixed(1)} V`} />
        <Slider label="Drain voltage VDS" value={vds} min={0} max={10} step={0.1} onChange={setVds} show={`${vds.toFixed(1)} V`} />
      </Controls>
      <Out items={[['Region', region], ['Drain current', `${id.toFixed(1)} units`], ['Channel resistance', isFinite(ron) ? `${ron.toFixed(1)} (relative)` : 'Open']]} />
    </Sim>
  )
}

export function OpampViz() {
  const [mode, setMode] = useState<'inv' | 'non'>('non')
  const [rf, setRf] = useState(10000)
  const [rg, setRg] = useState(1000)
  const [vin, setVin] = useState(0.5)
  const [rail, setRail] = useState(5)
  const A = mode === 'inv' ? -rf / rg : 1 + rf / rg
  const out = (x: number) => Math.max(-rail, Math.min(rail, A * vin * Math.sin(x)))
  const clips = Math.abs(A * vin) > rail
  return (
    <Sim note="Gold is the output, blue is the input. The output can never exceed the supply rails, so too much gain clips the wave.">
      <Plot x={[0, 4 * Math.PI]} y={[-12, 12]} series={[{ f: (x) => vin * Math.sin(x), color: C.cyan, width: 1.5 }, { f: out }]} marks={[{ y: rail, color: C.red }, { y: -rail, color: C.red }]} xlabel="Time" ylabel="Volts" label="Op-amp input and output" divs={[8, 6]} />
      <Controls>
        <Seg label="Configuration" value={mode} onChange={setMode} options={[['non', 'Non-inverting'], ['inv', 'Inverting']]} />
        <Slider label="Feedback Rf" value={rf} min={100} max={1e6} log onChange={setRf} show={si(rf, 'Ω')} />
        <Slider label="Input Rg" value={rg} min={100} max={1e5} log onChange={setRg} show={si(rg, 'Ω')} />
        <Slider label="Input amplitude" value={vin} min={0.01} max={5} log onChange={setVin} show={si(vin, 'V')} />
        <Slider label="Supply rails" value={rail} min={1.5} max={12} step={0.5} onChange={setRail} show={`±${rail} V`} />
      </Controls>
      <Out items={[['Gain', A.toFixed(2)], ['In dB', `${(20 * Math.log10(Math.abs(A))).toFixed(1)} dB`], ['Output', clips ? 'Clipping' : `${Math.abs(A * vin).toFixed(2)} V peak`, clips]]} />
    </Sim>
  )
}

export function RegulatorViz() {
  const [vin, setVin] = useState(22.2)
  const [vout, setVout] = useState(5)
  const [amps, setAmps] = useState(2)
  const [eff, setEff] = useState(92)
  const v = Math.min(vout, vin)
  const pOut = v * amps
  const lin = (vin - v) * amps
  const sw = pOut * (100 / eff - 1)
  const scale = 400 / Math.max(pOut + lin, 1)
  const bar = (y: number, loss: number, name: string) => (
    <g>
      <text x={20} y={y - 6} className="sim-t">{name}: {si(loss, 'W')} wasted as heat</text>
      <rect x={20} y={y} width={pOut * scale} height={24} fill={C.cyan} />
      <rect x={20 + pOut * scale} y={y} width={loss * scale} height={24} fill={C.red} />
    </g>
  )
  return (
    <Sim note="Blue is useful power, red is heat. For a big voltage drop at real current, a linear regulator needs a heatsink that a drone cannot carry.">
      <Stage h={130} label="Linear and switching losses compared">
        {bar(30, lin, 'Linear')}
        {bar(90, sw, 'Switching')}
      </Stage>
      <Controls>
        <Slider label="Input" value={vin} min={3.3} max={50} step={0.1} onChange={setVin} show={`${vin.toFixed(1)} V`} />
        <Slider label="Output" value={vout} min={0.8} max={24} step={0.1} onChange={setVout} show={`${vout.toFixed(1)} V`} />
        <Slider label="Load" value={amps} min={0.05} max={10} step={0.05} onChange={setAmps} show={`${amps.toFixed(2)} A`} />
        <Slider label="Switcher efficiency" value={eff} min={70} max={98} step={1} onChange={setEff} show={`${eff}%`} />
      </Controls>
      <Out items={[['Linear efficiency', `${((v / vin) * 100).toFixed(0)}%`], ['Junction rise at 40 °C/W', `${(lin * 40).toFixed(0)} °C`, lin * 40 > 100], ['Battery current, switcher', si((pOut / (eff / 100)) / vin, 'A')]]} />
    </Sim>
  )
}

export function AdcViz() {
  const [f, setF] = useState(900)
  const [fs, setFs] = useState(1000)
  const [bits, setBits] = useState(4)
  const T = 0.02
  const lv = 2 ** bits
  const q = (x: number) => (Math.round(((x + 1) / 2) * (lv - 1)) / (lv - 1)) * 2 - 1
  const sig = (t: number) => Math.sin(2 * Math.PI * f * t)
  const samples: { x: number; y: number; color: string }[] = []
  for (let t = 0; t <= T; t += 1 / fs) samples.push({ x: t * 1000, y: q(sig(t)), color: C.pink })
  const shown = samples.slice(0, 120)
  const al = aliasOf(f, fs)
  const ok = fs > 2 * f
  const alPts: [number, number][] = []
  const sign = Math.round(f / fs) * fs - f >= 0 ? -1 : 1
  for (let i = 0; i <= 300; i++) { const t = (i / 300) * T; alPts.push([t * 1000, Math.sin(2 * Math.PI * sign * al * t)]) }
  return (
    <Sim note={ok ? 'Sample rate is above twice the signal, so the wave can be recovered.' : `Aliased: the samples trace a false ${si(al, 'Hz')} wave, shown in blue. Once sampled, it cannot be told apart from a real signal.`}>
      <Plot x={[0, 20]} y={[-1.3, 1.3]} series={[{ f: (x) => sig(x / 1000), color: C.grid, width: 1.3 }, ...(!ok ? [{ pts: alPts, color: C.cyan }] : [])]} dots={shown} xlabel="Time (ms)" label="Sampled signal" />
      <Controls>
        <Slider label="Signal frequency" value={f} min={10} max={2000} step={10} onChange={setF} show={`${f} Hz`} />
        <Slider label="Sample rate" value={fs} min={100} max={5000} step={50} onChange={setFs} show={`${fs} Hz`} />
        <Slider label="ADC bits" value={bits} min={2} max={12} step={1} onChange={setBits} show={`${bits} bit`} />
      </Controls>
      <Out items={[['Nyquist limit', `${fs / 2} Hz`], ['Appears at', `${ok ? f : al} Hz`, !ok], ['Step on 3.3 V', si(adcLsb(3.3, bits), 'V')], ['Ideal SNR', `${(6.02 * bits + 1.76).toFixed(1)} dB`]]} />
    </Sim>
  )
}

export function CmosViz() {
  const [vin, setVin] = useState(0.6)
  const vdd = 3.3, vtn = 0.7, vtp = 0.7
  const vtc = (x: number) => {
    if (x < vtn) return vdd
    if (x > vdd - vtp) return 0
    const r = (x - vtn) / (vdd - vtn - vtp)
    return vdd * (1 / (1 + Math.exp((r - 0.5) * 14)))
  }
  const vout = vtc(vin)
  const nOn = vin > vtn, pOn = vin < vdd - vtp
  const both = nOn && pOn
  const fet = (y: number, on: boolean, name: string) => (
    <g>
      <rect x={100} y={y} width={84} height={46} rx={4} fill={on ? C.gold : C.grid} />
      <text x={142} y={y + 28} textAnchor="middle" fontWeight={600} fill={on ? C.mask : C.silk}>{name} {on ? 'on' : 'off'}</text>
    </g>
  )
  return (
    <Sim note={both ? 'In the middle of the switch both transistors conduct briefly. This short pulse is part of why chips use power when they switch.' : 'One transistor is always off, so no steady current flows from supply to ground.'}>
      <div className="sim-two">
        <Stage w={230} h={220} label="CMOS inverter transistors">
          <line x1={142} x2={142} y1={10} y2={210} stroke={C.grid} strokeWidth={5} />
          <text x={100} y={18} className="sim-t">3.3 V</text>
          <text x={100} y={212} className="sim-t">0 V</text>
          {fet(32, pOn, 'PMOS')}
          {fet(140, nOn, 'NMOS')}
          <circle cx={142} cy={112} r={6} fill={vout > 1.65 ? C.gold : C.cyan} />
          <text x={158} y={117} fontSize={14} fontWeight={600} fill={C.silk}>{vout.toFixed(2)} V</text>
          <text x={14} y={116} className="sim-t">In {vin.toFixed(2)} V</text>
        </Stage>
        <Plot w={290} h={220} x={[0, 3.3]} y={[0, 3.3]} series={[{ f: vtc }]} dots={[{ x: vin, y: vout, color: C.pink }]} xlabel="Input (V)" ylabel="Output (V)" label="Inverter transfer curve" divs={[6, 6]} />
      </div>
      <Controls><Slider label="Input voltage" value={vin} min={0} max={3.3} step={0.01} onChange={setVin} show={`${vin.toFixed(2)} V`} /></Controls>
      <Out items={[['Logic output', vout > 2 ? '1' : vout < 0.8 ? '0' : 'Undefined'], ['Static current', both ? 'Brief crowbar pulse' : 'Near zero']]} />
    </Sim>
  )
}
