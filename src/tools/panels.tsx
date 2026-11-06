import { useState, type ReactNode } from 'react'
import { C } from '../viz/kit'

interface Spot { x: number; y: number; name: string; text: string }
interface PanelDef { draw: ReactNode; spots: Spot[]; label: string }

const T = ({ x, y, s, size = 11, a = 'middle', c = C.mask }: { x: number; y: number; s: string; size?: number; a?: 'middle' | 'start'; c?: string }) =>
  <text x={x} y={y} fontSize={size} textAnchor={a} fill={c} fontWeight={600}>{s}</text>

const jack = (x: number, y: number, color: string, label: string) => (
  <g key={label}><circle cx={x} cy={y} r={12} fill={C.mask} stroke={color} strokeWidth={4} /><T x={x} y={y + 27} s={label} /></g>
)

function knob(x: number, y: number, r = 20) {
  return <g><circle cx={x} cy={y} r={r} fill="#10312a" stroke={C.dim} strokeWidth={2} /><line x1={x} y1={y} x2={x} y2={y - r + 4} stroke={C.silk} strokeWidth={3} /></g>
}

const wave = (() => {
  let d = ''
  for (let i = 0; i <= 200; i += 4) d += `${i ? 'L' : 'M'}${28 + i} ${85 - 34 * Math.sin(i / 16)}`
  return d
})()

export const PANELS: Record<string, PanelDef> = {
  multimeter: {
    label: 'Multimeter front panel',
    draw: <>
      <rect x={110} y={6} width={180} height={272} rx={16} fill={C.gold} />
      <rect x={126} y={20} width={148} height={56} rx={4} fill={C.mask} />
      <text x={262} y={60} textAnchor="end" fontSize={30} fontWeight={600} fill={C.silk}>5.02 V</text>
      <rect x={126} y={84} width={44} height={16} rx={3} fill={C.mask} /><T x={148} y={96} s="HOLD" c={C.silk} size={9} />
      <rect x={230} y={84} width={44} height={16} rx={3} fill={C.mask} /><T x={252} y={96} s="RANGE" c={C.silk} size={9} />
      <circle cx={200} cy={158} r={46} fill={C.mask} />
      <circle cx={200} cy={158} r={26} fill="#10312a" stroke={C.dim} strokeWidth={2} />
      <line x1={200} y1={158} x2={200} y2={134} stroke={C.silk} strokeWidth={4} />
      {[['V', -60], ['Ω', 0], ['A', 60]].map(([s, a]) => {
        const r = (Number(a) - 90) * Math.PI / 180
        return <text key={s} x={200 + 37 * Math.cos(r)} y={162 + 37 * Math.sin(r)} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.silk}>{s}</text>
      })}
      {jack(140, 228, C.red, '10A')}{jack(180, 228, C.red, 'mA')}{jack(220, 228, C.tin, 'COM')}{jack(260, 228, C.red, 'VΩ')}
    </>,
    spots: [
      { x: 92, y: 48, name: 'Display', text: 'Shows the reading and unit. Check the unit: mV and V look alike at a glance. OL means over limit, or an open circuit.' },
      { x: 92, y: 92, name: 'Hold and range', text: 'HOLD freezes the reading, so you can look away from the probes. RANGE lets you fix the scale, rather than auto-ranging.' },
      { x: 308, y: 158, name: 'Dial', text: 'Selects the function. Set it before touching the circuit. Never turn it with the probes connected to a live source.' },
      { x: 118, y: 228, name: 'Current jacks', text: 'Only for current, with the meter in series. These jacks have almost no resistance, and are protected by fuses. Move the lead back afterwards.' },
      { x: 220, y: 268, name: 'COM jack', text: 'The black lead always goes here, for every measurement.' },
      { x: 284, y: 228, name: 'VΩ jack', text: 'The red lead goes here for voltage, resistance, continuity and diode tests. This is its normal home.' },
    ],
  },
  oscilloscope: {
    label: 'Oscilloscope front panel',
    draw: <>
      <rect x={6} y={6} width={388} height={190} rx={10} fill={C.tin} />
      <rect x={20} y={20} width={216} height={132} rx={3} fill={C.mask} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={20 + i * 27} x2={20 + i * 27} y1={20} y2={152} stroke={C.grid} />)}
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={20} x2={236} y1={20 + i * 33} y2={20 + i * 33} stroke={C.grid} />)}
      <path d={wave} fill="none" stroke={C.cyan} strokeWidth={2} />
      <line x1={20} x2={236} y1={68} y2={68} stroke={C.gold} strokeDasharray="4 3" />
      {knob(272, 50)}<T x={272} y={86} s="V/div" />
      {knob(342, 50)}<T x={342} y={86} s="Time/div" />
      {knob(272, 122, 15)}<T x={272} y={151} s="Trigger" />
      <rect x={318} y={106} width={48} height={18} rx={3} fill={C.gold} /><T x={342} y={119} s="AUTO" />
      <rect x={318} y={130} width={48} height={18} rx={3} fill={C.dim} /><T x={342} y={143} s="SINGLE" />
      <circle cx={46} cy={174} r={10} fill={C.gold} stroke={C.mask} strokeWidth={3} /><T x={66} y={178} s="CH1" a="start" />
      <circle cx={126} cy={174} r={10} fill={C.cyan} stroke={C.mask} strokeWidth={3} /><T x={146} y={178} s="CH2" a="start" />
      <rect x={262} y={166} width={22} height={14} fill={C.mask} /><T x={294} y={178} s="Probe comp" a="start" />
    </>,
    spots: [
      { x: 128, y: 34, name: 'Screen', text: 'Up is voltage, across is time. Each grid square is one division, so read the settings to convert squares into real values.' },
      { x: 244, y: 50, name: 'Volts per division', text: 'Vertical zoom. Turn it until the wave fills most of the screen height, for the best accuracy.' },
      { x: 372, y: 50, name: 'Time per division', text: 'Horizontal zoom. Aim for two or three cycles on the screen.' },
      { x: 246, y: 122, name: 'Trigger level', text: 'The dashed line. Each sweep starts where the signal crosses it, which makes a repeating wave stand still.' },
      { x: 374, y: 115, name: 'Auto and Single', text: 'AUTO finds a sensible view when you are lost. SINGLE captures one event then stops, ideal for power-up.' },
      { x: 26, y: 174, name: 'Input channels', text: 'Probes connect here. Each channel has its own colour on screen. The outer shell is tied to earth on a mains scope.' },
      { x: 250, y: 173, name: 'Probe compensation', text: 'A small square wave output. Touch the probe here, and trim it until the top of the wave is flat.' },
    ],
  },
  supply: {
    label: 'Bench power supply front panel',
    draw: <>
      <rect x={6} y={6} width={388} height={190} rx={10} fill={C.tin} />
      <rect x={22} y={22} width={150} height={56} rx={3} fill={C.mask} />
      <text x={160} y={62} textAnchor="end" fontSize={30} fontWeight={600} fill={C.gold}>12.00 V</text>
      <rect x={22} y={86} width={150} height={56} rx={3} fill={C.mask} />
      <text x={160} y={126} textAnchor="end" fontSize={30} fontWeight={600} fill={C.cyan}>0.150 A</text>
      <circle cx={196} cy={46} r={7} fill={C.gold} /><T x={196} y={68} s="CV" />
      <circle cx={196} cy={102} r={7} fill={C.dim} /><T x={196} y={124} s="CC" />
      {knob(250, 50)}<T x={250} y={86} s="Voltage" />
      {knob(250, 122)}<T x={250} y={158} s="Current" />
      <rect x={312} y={32} width={62} height={24} rx={3} fill={C.mask} /><T x={343} y={49} s="OUTPUT" c={C.silk} />
      <circle cx={322} cy={116} r={12} fill={C.mask} stroke={C.red} strokeWidth={4} /><T x={322} y={144} s="+" size={15} />
      <circle cx={364} cy={116} r={12} fill={C.mask} stroke={C.tin} strokeWidth={4} /><T x={364} y={144} s="−" size={15} />
    </>,
    spots: [
      { x: 14, y: 50, name: 'Voltage display', text: 'The real output voltage. It falls below your setting when the current limit is active.' },
      { x: 14, y: 114, name: 'Current display', text: 'What your circuit is really drawing. Watch this at first power-on: it is your earliest sign of a fault.' },
      { x: 218, y: 34, name: 'CV and CC lights', text: 'CV is normal. CC means it is limiting current. If CC comes on with a new board, turn off and look for a short.' },
      { x: 280, y: 50, name: 'Voltage knob', text: 'Sets the target voltage. Set it with the output off.' },
      { x: 280, y: 122, name: 'Current knob', text: 'Sets the limit. Keep it just above what you expect, because this is your protection.' },
      { x: 380, y: 44, name: 'Output button', text: 'Connects the terminals. Set everything first, then press this last.' },
      { x: 343, y: 96, name: 'Terminals', text: 'Red is positive and black is negative. Check polarity before turning on, as reversing it can kill a board.' },
    ],
  },
  iron: {
    label: 'Soldering station',
    draw: <>
      <rect x={16} y={70} width={170} height={120} rx={10} fill={C.tin} />
      <rect x={32} y={84} width={138} height={46} rx={3} fill={C.mask} />
      <text x={158} y={118} textAnchor="end" fontSize={28} fontWeight={600} fill={C.gold}>350 °C</text>
      <rect x={34} y={144} width={32} height={24} rx={3} fill={C.mask} /><T x={50} y={161} s="−" c={C.silk} size={15} />
      <rect x={76} y={144} width={32} height={24} rx={3} fill={C.mask} /><T x={92} y={161} s="+" c={C.silk} size={15} />
      <path d="M186 160C230 170 240 110 268 96" fill="none" stroke={C.dim} strokeWidth={4} />
      <g transform="rotate(-24 300 70)">
        <rect x={260} y={58} width={72} height={24} rx={8} fill={C.cyan} />
        <rect x={332} y={64} width={26} height={12} fill={C.tin} />
        <path d="M358 64L382 70L358 76Z" fill={C.copper} />
      </g>
      <rect x={232} y={150} width={118} height={38} rx={6} fill={C.dim} />
      <ellipse cx={291} cy={165} rx={32} ry={10} fill={C.gold} />
    </>,
    spots: [
      { x: 192, y: 92, name: 'Temperature display', text: 'Set and actual temperature. Around 350 °C suits leaded solder. Too hot burns flux and lifts pads.' },
      { x: 124, y: 156, name: 'Set buttons', text: 'Change the temperature. Raise it for heavy battery wires, or switch to a larger tip, which works better.' },
      { x: 240, y: 54, name: 'Handle', text: 'Hold it like a pen. A heater and sensor inside keep the tip temperature steady.' },
      { x: 366, y: 12, name: 'Tip', text: 'Keep it shiny with fresh solder. A chisel tip transfers heat better than a sharp point.' },
      { x: 358, y: 168, name: 'Brass wool', text: 'Cleans the tip without chilling it. Clean, then re-tin before parking the iron.' },
    ],
  },
}

export function Panel({ id }: { id: string }) {
  const p = PANELS[id]
  const [i, setI] = useState(0)
  const h = id === 'multimeter' ? 284 : 202
  return (
    <div className="panel">
      <svg viewBox={`0 0 400 ${h}`} role="group" aria-label={p.label}>
        {p.draw}
        {p.spots.map((s, k) => (
          <g key={s.name} role="button" tabIndex={0} aria-label={s.name} aria-pressed={k === i} className="spot" data-on={k === i || undefined}
            onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setI(k) } }}>
            <circle cx={s.x} cy={s.y} r={11} />
            <text x={s.x} y={s.y + 4.500} textAnchor="middle" fontSize={12} fontWeight={600}>{k + 1}</text>
          </g>
        ))}
      </svg>
      <div className="panel-note">
        <p><b>{i + 1}. {p.spots[i].name}</b></p>
        <p>{p.spots[i].text}</p>
        <div className="sim-seg">
          <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
          <button type="button" disabled={i === p.spots.length - 1} onClick={() => setI(i + 1)}>Next control</button>
        </div>
      </div>
    </div>
  )
}
