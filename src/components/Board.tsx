import 'd3-transition'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, zoomTransform, type ZoomBehavior } from 'd3-zoom'
import { graph } from '../lib/content'
import { ancestors } from '../lib/graph'
import { layoutBoard, layoutTrace, route, type Pt } from '../lib/layout'
import type { Concept } from '../lib/parse'
import { BoardFinder } from './BoardFinder'
import { PadShape } from './Pad'

const board = layoutBoard(graph)

const baseTraces = (() => {
  let near = ''
  let far = ''
  for (const c of graph.concepts) {
    for (const n of c.needs) {
      const d = route(board.pos.get(n)!, board.pos.get(c.id)!)
      if (graph.byId.get(n)!.phase === c.phase) near += d
      else far += d
    }
  }
  return { near, far }
})()

function wrap(title: string): string[] {
  if (title.length <= 20) return [title]
  const words = title.split(' ')
  let a = ''
  while (words.length && (a + ' ' + words[0]).trim().length <= 20) a = (a + ' ' + words.shift()).trim()
  return [a, words.join(' ')]
}

interface NodeProps {
  c: Concept; p: Pt; state: string; selected: boolean
  onSelect: (id: string) => void; onHover: (id: string | null) => void
}

const Node = memo(function Node({ c, p, state, selected, onSelect, onHover }: NodeProps) {
  const lines = wrap(c.title)
  return (
    <g
      className="node" data-state={state} data-selected={selected || undefined}
      transform={`translate(${p.x} ${p.y})`} tabIndex={0} role="button"
      aria-label={`${c.title}. ${state === 'learned' ? 'Learned.' : state === 'ready' ? 'Ready to learn.' : ''}`}
      onClick={() => onSelect(c.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(c.id) } }}
      onPointerEnter={() => onHover(c.id)} onPointerLeave={() => onHover(null)}
    >
      <circle className="hit" r={44} />
      {state === 'ready' && <circle className="ring" r={24} />}
      {selected && <circle className="sel" r={28} />}
      <PadShape kind={c.kind} />
      <text className="label" y={35} textAnchor="middle">
        {lines.map((l, i) => <tspan key={i} x={0} dy={i ? 17 : 0}>{l}</tspan>)}
      </text>
    </g>
  )
})

interface Props {
  selected?: string
  learned: Set<string>
  ready: Set<string>
  focusPhase: { n: number; nonce: number } | null
  onSelect: (id: string) => void
  onPhaseInView: (n: number) => void
}

export function Board({ selected, learned, ready, focusPhase, onSelect, onPhaseInView }: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const layer = useRef<SVGGElement>(null)
  const zb = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [wantMode, setMode] = useState<'board' | 'trace'>('board')
  const mode = selected ? wantMode : 'board'
  const [depth, setDepth] = useState(3)
  const [jump, setJump] = useState<{ id: string; n: number } | null>(null)

  useEffect(() => {
    const el = svg.current!
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.08, 2.4])
      .on('zoom', (e) => {
        layer.current?.setAttribute('transform', e.transform.toString())
        el.dataset.lod = e.transform.k < 0.34 ? 'far' : e.transform.k < 0.55 ? 'mid' : 'near'
      })
    zb.current = z
    select(el).call(z).on('dblclick.zoom', null)
    return () => { select(el).interrupt() }
  }, [])

  /** Frames a region. With minK set, a region too big to read at that zoom starts from its top-left. */
  const fit = useCallback((x: number, y: number, w: number, h: number, maxK = 1.1, minK = 0, animate = true) => {
    const el = svg.current!
    const b = el.getBoundingClientRect()
    const top = 58
    const availW = b.width - 40
    const availH = b.height - top - 24
    const k = Math.max(minK, Math.min(availW / w, availH / h, maxK))
    const tx = w * k > availW ? 20 - x * k : b.width / 2 - (x + w / 2) * k
    const ty = h * k > availH ? top - y * k : top + availH / 2 - (y + h / 2) * k
    const t = zoomIdentity.translate(tx, ty).scale(k)
    const sel = select(el)
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) sel.call(zb.current!.transform, t)
    else sel.transition().duration(650).call(zb.current!.transform, t)
  }, [])

  const fitPhase = useCallback((n: number) => {
    const zn = board.zones.find((z) => z.phase === n)!
    fit(zn.x, zn.y, zn.w, zn.h, 1, 0.62)
  }, [fit])

  // Open on Phase 0, where the story starts.
  useEffect(() => {
    if (selected) return
    const zn = board.zones[0]
    const id = requestAnimationFrame(() => fit(zn.x, zn.y, zn.w, zn.h, 1, 0.62, false))
    return () => cancelAnimationFrame(id)
    // Runs once on load; later selections are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit])

  useEffect(() => {
    if (!focusPhase) return
    setMode('board')
    requestAnimationFrame(() => fitPhase(focusPhase.n))
  }, [focusPhase, fitPhase])

  const trace = useMemo(() => {
    if (mode !== 'trace' || !selected) return null
    const b = svg.current!.getBoundingClientRect()
    return layoutTrace(graph, selected, ancestors(graph, selected, depth), b.height > b.width)
  }, [mode, selected, depth])

  useEffect(() => {
    if (trace) requestAnimationFrame(() => fit(trace.bounds.x, trace.bounds.y, trace.bounds.w, trace.bounds.h, 1, 0.6))
  }, [trace, fit])

  const flyTo = useCallback((p: Pt) => {
    const el = svg.current!
    const b = el.getBoundingClientRect()
    const k = Math.max(zoomTransform(el).k, 0.8)
    const t = zoomIdentity.translate(b.width / 2 - p.x * k, b.height / 2 - p.y * k).scale(k)
    const sel = select(el)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) sel.call(zb.current!.transform, t)
    else sel.transition().duration(550).call(zb.current!.transform, t)
  }, [])

  // Keep the selected pad in view when the lesson panel changes the board's width.
  const lastSel = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (mode === 'trace') return
    if (selected && selected !== lastSel.current) {
      const p = board.pos.get(selected)!
      onPhaseInView(graph.byId.get(selected)!.phase)
      requestAnimationFrame(() => {
        const el = svg.current!
        const b = el.getBoundingClientRect()
        const cur = zoomTransform(el)
        const sx = cur.applyX(p.x)
        const sy = cur.applyY(p.y)
        // Leave the view alone when the pad is already comfortably on screen and readable.
        if (cur.k >= 0.55 && sx > 60 && sx < b.width - 60 && sy > 90 && sy < b.height - 70) return
        flyTo(p)
      })
    }
    lastSel.current = selected
  }, [selected, mode, onPhaseInView, flyTo])

  // A pick from the search box or dropdown always centres its pad, even if it is the current one.
  const done = useRef(0)
  useEffect(() => {
    if (!jump || jump.n === done.current || selected !== jump.id || mode !== 'board') return
    done.current = jump.n
    requestAnimationFrame(() => flyTo(board.pos.get(jump.id)!))
  }, [jump, selected, mode, flyTo])

  const pick = useCallback((id: string) => {
    setMode('board')
    setJump((j) => ({ id, n: (j?.n ?? 0) + 1 }))
    onSelect(id)
  }, [onSelect])

  const stateOf = (id: string) => (learned.has(id) ? 'learned' : ready.has(id) ? 'ready' : 'idle')

  const focus = hover ?? selected
  const overlay = useMemo(() => {
    if (!focus || mode === 'trace') return null
    const c = graph.byId.get(focus)!
    const p = board.pos.get(focus)!
    return {
      needs: c.needs.map((n) => route(board.pos.get(n)!, p)).join(''),
      unlocks: (graph.unlocks.get(focus) ?? []).map((n) => route(p, board.pos.get(n)!)).join(''),
      related: (graph.related.get(focus) ?? []).map((n) => route(p, board.pos.get(n)!)).join(''),
      near: new Set([focus, ...c.needs, ...(graph.unlocks.get(focus) ?? []), ...(graph.related.get(focus) ?? [])]),
    }
  }, [focus, mode])

  return (
    <div className="board-wrap">
      <svg ref={svg} className="board" data-lod="near" data-dim={overlay ? 'on' : undefined} aria-label="Knowledge graph drawn as a circuit board">
        <defs>
          <pattern id="weave" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="0.9" fill="#ffffff" opacity="0.05" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#weave)" />
        <g ref={layer}>
          {!trace && (
            <>
              {board.zones.map((z) => (
                <g key={z.phase} className="zone" onClick={() => fitPhase(z.phase)}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={14} />
                  <text className="zone-near" x={z.x + 24} y={z.y + 40}>{z.phase}. {z.title}</text>
                  <text className="zone-far" x={z.x + z.w / 2} y={z.y + z.h / 2 + 24} textAnchor="middle">{z.phase}</text>
                  <text className="zone-mid" x={z.x + z.w / 2} y={z.y + z.h / 2 + 118} textAnchor="middle">{z.title.length > 26 ? z.title.slice(0, 25) + '…' : z.title}</text>
                </g>
              ))}
              <path className="trace far" d={baseTraces.far} />
              <path className="trace near" d={baseTraces.near} />
              {overlay && (
                <>
                  <path className="trace hl-related" d={overlay.related} />
                  <path className="trace hl-unlocks" d={overlay.unlocks} />
                  <path className="trace hl-needs" d={overlay.needs} />
                </>
              )}
              {graph.concepts.map((c) => (
                <g key={c.id} opacity={overlay && !overlay.near.has(c.id) ? 0.32 : 1}>
                  <Node c={c} p={board.pos.get(c.id)!} state={stateOf(c.id)} selected={c.id === selected} onSelect={onSelect} onHover={setHover} />
                </g>
              ))}
            </>
          )}
          {trace && (
            <>
              {trace.edges.map(([a, b]) => (
                <path key={a + b} className={`trace ${b === selected || a === selected ? 'hl-needs' : 'hl-chain'}`} d={route(trace.pos.get(a)!, trace.pos.get(b)!)} />
              ))}
              {trace.ids.map((id) => (
                <Node key={id} c={graph.byId.get(id)!} p={trace.pos.get(id)!} state={stateOf(id)} selected={id === selected} onSelect={onSelect} onHover={() => {}} />
              ))}
            </>
          )}
        </g>
      </svg>

      <div className="board-tools">
        <div className="sim-seg" role="group" aria-label="Graph view">
          <button type="button" aria-pressed={mode === 'board'} onClick={() => setMode('board')}>Whole board</button>
          <button type="button" aria-pressed={mode === 'trace'} disabled={!selected} title={selected ? undefined : 'Select a concept first'} onClick={() => setMode('trace')}>Trace this concept</button>
        </div>
        {mode === 'trace' && (
          <div className="sim-seg" role="group" aria-label="How far back to trace">
            {([[1, 'Direct'], [3, '3 levels'], [99, 'Back to matter']] as const).map(([d, t]) => (
              <button key={d} type="button" aria-pressed={depth === d} onClick={() => setDepth(d)}>{t}</button>
            ))}
          </div>
        )}
        {mode === 'board' && <button type="button" className="ghost" onClick={() => fit(0, 0, board.width, board.height)}>Fit whole board</button>}
        <BoardFinder selected={selected} onPick={pick} />
      </div>

      <div className="board-key" aria-hidden="true">
        <span className="k-needs">Learn first</span>
        <span className="k-unlocks">Unlocks</span>
        <span className="k-related">Related</span>
      </div>
    </div>
  )
}
