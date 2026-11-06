import { parseContent, inlineLinks, type Concept, type Phase } from './parse'

export type { Concept, Phase }

export interface Graph {
  phases: Phase[]
  concepts: Concept[]
  byId: Map<string, Concept>
  /** concept id -> concepts that list it in `needs` */
  unlocks: Map<string, string[]>
  /** undirected "see also" links from `see:` and inline [[links]] */
  related: Map<string, string[]>
}

export function buildGraph(files: string[]): Graph {
  const parsed = files.map(parseContent).sort((a, b) => a.phase.n - b.phase.n)
  const phases = parsed.map((p) => p.phase)
  const concepts = parsed.flatMap((p) => p.concepts)
  const byId = new Map(concepts.map((c) => [c.id, c]))

  const unlocks = new Map<string, string[]>(concepts.map((c) => [c.id, []]))
  const related = new Map<string, Set<string>>(concepts.map((c) => [c.id, new Set()]))
  for (const c of concepts) {
    for (const n of c.needs) unlocks.get(n)?.push(c.id)
    for (const r of [...c.see, ...inlineLinks(c)]) {
      if (r === c.id || !byId.has(r) || c.needs.includes(r) || byId.get(r)!.needs.includes(c.id)) continue
      related.get(c.id)!.add(r)
      related.get(r)!.add(c.id)
    }
  }
  return {
    phases, concepts, byId, unlocks,
    related: new Map([...related].map(([k, v]) => [k, [...v]])),
  }
}

/** Every concept reachable backwards through `needs`, with its distance. */
export function ancestors(g: Graph, id: string, maxDepth = Infinity): Map<string, number> {
  const dist = new Map<string, number>()
  let frontier = [id]
  for (let d = 1; d <= maxDepth && frontier.length; d++) {
    const next: string[] = []
    for (const f of frontier) {
      for (const n of g.byId.get(f)?.needs ?? []) {
        // Keep the longest distance so columns read in true learning order.
        if ((dist.get(n) ?? 0) < d) { dist.set(n, d); next.push(n) }
      }
    }
    frontier = next
  }
  return dist
}

export function descendants(g: Graph, id: string): Set<string> {
  const seen = new Set<string>()
  const stack = [id]
  while (stack.length) {
    for (const n of g.unlocks.get(stack.pop()!) ?? []) {
      if (!seen.has(n)) { seen.add(n); stack.push(n) }
    }
  }
  return seen
}

/** Shortest chain of prerequisites from the root (matter) to a concept. */
export function rootChain(g: Graph, id: string): string[] {
  const prev = new Map<string, string | null>([[id, null]])
  const queue = [id]
  while (queue.length) {
    const cur = queue.shift()!
    const needs = g.byId.get(cur)?.needs ?? []
    if (needs.length === 0) {
      const chain = [cur]
      let p = prev.get(cur)
      while (p) { chain.push(p); p = prev.get(p) }
      return chain
    }
    for (const n of needs) if (!prev.has(n)) { prev.set(n, cur); queue.push(n) }
  }
  return [id]
}

/** Shortest path across all link types, ignoring direction. */
export function findPath(g: Graph, from: string, to: string): string[] | null {
  const prev = new Map<string, string | null>([[from, null]])
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) {
      const path = [cur]
      let p = prev.get(cur)
      while (p) { path.unshift(p); p = prev.get(p) }
      return path
    }
    const c = g.byId.get(cur)!
    for (const n of [...c.needs, ...(g.unlocks.get(cur) ?? []), ...(g.related.get(cur) ?? [])]) {
      if (!prev.has(n)) { prev.set(n, cur); queue.push(n) }
    }
  }
  return null
}

/** Concepts ranked by how much of the board depends on them. */
export function loadBearing(g: Graph): { id: string; count: number }[] {
  return g.concepts
    .map((c) => ({ id: c.id, count: descendants(g, c.id).size }))
    .sort((a, b) => b.count - a.count)
}

/** The next concepts to study: all prerequisites learned, not yet learned itself. */
export function readySet(g: Graph, learned: Set<string>): Set<string> {
  return new Set(
    g.concepts.filter((c) => !learned.has(c.id) && c.needs.every((n) => learned.has(n))).map((c) => c.id),
  )
}
