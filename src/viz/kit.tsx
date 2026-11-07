import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export const C = {
  gold: '#e8c872', copper: '#ee9f5a', tin: '#dfe6e6', silk: '#f1f5ee', dim: '#8fb5a6',
  cyan: '#7ad7e8', pink: '#f299b8', grid: '#2c6657', mask: '#0a352c', red: '#ff7a66',
}

export const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Seconds since mount, updated every frame. Stays at a fixed moment under reduced motion. */
export function useTime(running = true) {
  const [t, setT] = useState(0.35)
  useEffect(() => {
    if (!running || prefersReduced()) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 60) / 1000
      last = now
      setT((x) => x + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])
  return t
}

/** Drawing happens in a fixed 520-wide space, so it fills the canvas on any screen density. */
export function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const w = 520
    const scale = cv.width / w
    const h = cv.height / scale
    ctx.scale(scale, scale)
    if (prefersReduced()) { for (let i = 0; i < 60; i++) drawRef.current(ctx, w, h, 0.016); return }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000
      last = now
      drawRef.current(ctx, w, h, dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return ref
}

/** A straight arrow. The head stays the same size however short the line is. */
export function Arrow({ x1, y1, x2, y2, color = C.gold, width = 3, head = 11 }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; head?: number
}) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  if (len < 1) return null
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const bx = x2 - ux * head
  const by = y2 - uy * head
  const hw = head * 0.55
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`} fill={color} />
    </g>
  )
}

/** A small arrowhead sitting on a wire or field line. Angle in degrees, 0 points right. */
export function Chevron({ x, y, angle = 0, color = C.gold, size = 8 }: { x: number; y: number; angle?: number; color?: string; size?: number }) {
  return <polygon points={`${size},0 ${-size * 0.7},${size * 0.75} ${-size * 0.7},${-size * 0.75}`} fill={color} transform={`translate(${x} ${y}) rotate(${angle})`} />
}

export function Sim({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="sim">
      {children}
      {note && <p className="sim-note">{note}</p>}
    </div>
  )
}

export function Stage({ w = 520, h = 260, children, label }: { w?: number; h?: number; children: ReactNode; label: string }) {
  return (
    <svg className="sim-stage" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      {children}
    </svg>
  )
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="sim-ctl">{children}</div>
}

interface SliderProps {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void; show?: string; log?: boolean
}

export function Slider({ label, value, min, max, step, onChange, show, log }: SliderProps) {
  const id = useId()
  const toPos = (v: number) => (log ? (Math.log(v / min) / Math.log(max / min)) * 1000 : v)
  const fromPos = (p: number) => (log ? min * (max / min) ** (p / 1000) : p)
  return (
    <div className="sim-slider">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{show ?? value}</output>
      <input
        id={id} type="range"
        min={log ? 0 : min} max={log ? 1000 : max} step={log ? 1 : step ?? (max - min) / 200}
        value={toPos(value)}
        onChange={(e) => onChange(fromPos(Number(e.target.value)))}
      />
    </div>
  )
}

export function Seg<T extends string | number>({ value, options, onChange, label }: {
  value: T; options: [T, string][]; onChange: (v: T) => void; label: string
}) {
  return (
    <div className="sim-seg" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={String(v)} type="button" aria-pressed={v === value} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  )
}

export function Out({ items }: { items: [string, string, boolean?][] }) {
  return (
    <dl className="sim-out">
      {items.map(([k, v, warn]) => (
        <div key={k} className={warn ? 'warn' : undefined}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  )
}

export interface Series { f?: (x: number) => number; pts?: [number, number][]; color?: string; width?: number; dash?: string }

interface PlotProps {
  w?: number; h?: number; x: [number, number]; y: [number, number]; series: Series[]
  logx?: boolean; xlabel?: string; ylabel?: string; marks?: { x?: number; y?: number; color?: string }[]
  dots?: { x: number; y: number; color?: string }[]; label: string; divs?: [number, number]
}

/** Small line plot with a scope-style grid. */
export function Plot({ w = 520, h = 220, x, y, series, logx, xlabel, ylabel, marks = [], dots = [], label, divs = [10, 6] }: PlotProps) {
  const L = 34, R = 10, T = 8, B = 24
  const sx = (v: number) => {
    const r = logx ? Math.log(v / x[0]) / Math.log(x[1] / x[0]) : (v - x[0]) / (x[1] - x[0])
    return L + r * (w - L - R)
  }
  const sy = (v: number) => {
    const c = Math.max(y[0] - (y[1] - y[0]) * 0.1, Math.min(y[1] + (y[1] - y[0]) * 0.1, v))
    return T + (1 - (c - y[0]) / (y[1] - y[0])) * (h - T - B)
  }
  const paths = series.map((s) => {
    let pts = s.pts
    if (!pts && s.f) {
      pts = []
      for (let i = 0; i <= 260; i++) {
        const r = i / 260
        const v = logx ? x[0] * (x[1] / x[0]) ** r : x[0] + r * (x[1] - x[0])
        pts.push([v, s.f(v)])
      }
    }
    return (pts ?? []).map(([a, b], i) => `${i ? 'L' : 'M'}${sx(a).toFixed(1)} ${sy(b).toFixed(1)}`).join('')
  })
  return (
    <Stage w={w} h={h} label={label}>
      {Array.from({ length: divs[0] + 1 }, (_, i) => {
        const px = L + (i / divs[0]) * (w - L - R)
        return <line key={'v' + i} x1={px} x2={px} y1={T} y2={h - B} stroke={C.grid} strokeWidth={0.6} />
      })}
      {Array.from({ length: divs[1] + 1 }, (_, i) => {
        const py = T + (i / divs[1]) * (h - T - B)
        return <line key={'h' + i} x1={L} x2={w - R} y1={py} y2={py} stroke={C.grid} strokeWidth={0.6} />
      })}
      {marks.map((m, i) => m.x !== undefined
        ? <line key={i} x1={sx(m.x)} x2={sx(m.x)} y1={T} y2={h - B} stroke={m.color ?? C.dim} strokeDasharray="4 4" />
        : <line key={i} x1={L} x2={w - R} y1={sy(m.y!)} y2={sy(m.y!)} stroke={m.color ?? C.dim} strokeDasharray="4 4" />)}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={series[i].color ?? C.gold} strokeWidth={series[i].width ?? 2}
          strokeDasharray={series[i].dash} strokeLinejoin="round" />
      ))}
      {dots.map((d, i) => <circle key={i} cx={sx(d.x)} cy={sy(d.y)} r={4.5} fill={d.color ?? C.gold} stroke={C.mask} />)}
      {xlabel && <text x={w - R} y={h - 7} textAnchor="end" className="sim-t">{xlabel}</text>}
      {ylabel && <text x={L + 4} y={T + 13} className="sim-t">{ylabel}</text>}
    </Stage>
  )
}
