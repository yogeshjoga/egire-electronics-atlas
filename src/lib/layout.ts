import type { Graph } from './graph'

export const CELL_W = 176
export const CELL_H = 86
const PAD_X = 46
const PAD_TOP = 76
const PAD_BOTTOM = 26
const GAP = 64
const ROW_TARGET = 2700
const MAX_COLS = 6

export interface Pt { x: number; y: number }
export interface Zone { phase: number; title: string; x: number; y: number; w: number; h: number }
export interface Board { pos: Map<string, Pt>; zones: Zone[]; width: number; height: number }

/** Lays each phase out as a silkscreened zone, with prerequisites to the left inside it. */
export function layoutBoard(g: Graph): Board {
  const local = g.phases.map((p) => {
    const items = g.concepts.filter((c) => c.phase === p.n)
    const ids = new Set(items.map((c) => c.id))
    const memo = new Map<string, number>()
    const depth = (id: string): number => {
      if (memo.has(id)) return memo.get(id)!
      const d = Math.max(0, ...g.byId.get(id)!.needs.filter((n) => ids.has(n)).map((n) => depth(n) + 1))
      memo.set(id, d)
      return d
    }
    const maxRows = Math.max(3, Math.ceil(Math.sqrt(items.length * 0.8)))
    const columns: string[][] = []
    const levels = new Map<number, string[]>()
    items.forEach((c) => {
      const d = depth(c.id)
      levels.set(d, [...(levels.get(d) ?? []), c.id])
    })
    for (const d of [...levels.keys()].sort((a, b) => a - b)) {
      const lvl = levels.get(d)!
      for (let i = 0; i < lvl.length; i += maxRows) columns.push(lvl.slice(i, i + maxRows))
    }
    // Long chains wrap into stacked bands so every zone stays roughly square.
    const bands: string[][][] = []
    for (let i = 0; i < columns.length; i += MAX_COLS) bands.push(columns.slice(i, i + MAX_COLS))
    const bandRows = bands.map((b) => Math.max(...b.map((c) => c.length)))
    const rows = bandRows.reduce((a, b) => a + b, 0)
    const cols = Math.max(...bands.map((b) => b.length))
    return { phase: p, bands, bandRows, rows, cols, w: cols * CELL_W + PAD_X * 2 - 40, h: rows * CELL_H + PAD_TOP + PAD_BOTTOM }
  })

  // Shelf-pack in reading order, snaking so consecutive phases stay neighbours.
  const shelves: (typeof local)[] = [[]]
  let used = 0
  for (const z of local) {
    if (used + z.w > ROW_TARGET && shelves.at(-1)!.length) { shelves.push([]); used = 0 }
    shelves.at(-1)!.push(z)
    used += z.w + GAP
  }

  const pos = new Map<string, Pt>()
  const zones: Zone[] = []
  const widest = Math.max(...shelves.map((s) => s.reduce((a, z) => a + z.w, 0) + GAP * (s.length - 1)))
  let y = 0
  shelves.forEach((shelf, si) => {
    const h = Math.max(...shelf.map((z) => z.h))
    const slack = (widest - shelf.reduce((a, z) => a + z.w, 0) - GAP * (shelf.length - 1)) / shelf.length
    const ordered = si % 2 ? [...shelf].reverse() : shelf
    let x = 0
    for (const z of ordered) {
      const w = z.w + slack
      zones.push({ phase: z.phase.n, title: z.phase.title, x, y, w, h })
      const colGap = (w - PAD_X * 2) / z.cols
      const spare = (h - PAD_TOP - PAD_BOTTOM - z.rows * CELL_H) / 2
      let bandY = y + PAD_TOP + spare
      z.bands.forEach((band, bi) => {
        const bandH = z.bandRows[bi] * CELL_H
        band.forEach((col, ci) => {
          const top = bandY + (bandH - col.length * CELL_H) / 2
          col.forEach((id, ri) => pos.set(id, { x: x + PAD_X + colGap * (ci + 0.5), y: top + CELL_H * (ri + 0.36) }))
        })
        bandY += bandH
      })
      x += w + GAP
    }
    y += h + GAP
  })
  zones.sort((a, b) => a.phase - b.phase)
  return { pos, zones, width: widest, height: y - GAP }
}

/** PCB-style route: straight runs joined by a single 45° segment. */
export function route(a: Pt, b: Pt): string {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  const sx = Math.sign(dx)
  const sy = Math.sign(dy)
  if (ax >= ay) {
    const run = (ax - ay) / 2
    return `M${a.x} ${a.y}h${sx * run}l${dx === 0 ? 0 : sx * ay} ${sy * ay}H${b.x}`
  }
  const run = (ay - ax) / 2
  return `M${a.x} ${a.y}v${sy * run}l${sx * ax} ${sy * ax}V${b.y}`
}

export interface TraceLayout { pos: Map<string, Pt>; ids: string[]; edges: [string, string][]; bounds: { x: number; y: number; w: number; h: number } }

/** Prerequisites on the left, the concept in the middle, what it unlocks on the right. */
export function layoutTrace(g: Graph, id: string, back: Map<string, number>, vertical = false): TraceLayout {
  const cols = new Map<number, string[]>()
  const add = (c: number, n: string) => cols.set(c, [...(cols.get(c) ?? []), n])
  add(0, id)
  back.forEach((d, n) => add(-d, n))
  const forward = g.unlocks.get(id) ?? []
  forward.forEach((n) => { if (!back.has(n)) add(1, n) })

  const W = vertical ? 104 : 230   // step between learning levels
  const H = vertical ? 186 : 92    // step between concepts in one level
  const pos = new Map<string, Pt>()
  for (const [c, list] of cols) {
    list.sort((a, b) => g.byId.get(a)!.phase - g.byId.get(b)!.phase)
    list.forEach((n, i) => {
      const across = (i - (list.length - 1) / 2) * H
      pos.set(n, vertical ? { x: across, y: c * W } : { x: c * W, y: across })
    })
  }
  const ids = [...pos.keys()]
  const edges: [string, string][] = []
  for (const n of ids) for (const need of g.byId.get(n)!.needs) if (pos.has(need)) edges.push([need, n])
  const xs = ids.map((n) => pos.get(n)!.x)
  const ys = ids.map((n) => pos.get(n)!.y)
  const x = Math.min(...xs) - 110
  const y = Math.min(...ys) - 70
  return { pos, ids, edges, bounds: { x, y, w: Math.max(...xs) + 110 - x, h: Math.max(...ys) + 80 - y } }
}
