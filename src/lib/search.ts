import type { Concept } from './parse'

/** Ranks concepts for a search: title start, then title, summary, and lesson text. */
export function searchConcepts(concepts: Concept[], query: string, limit = 10): Concept[] {
  const s = query.trim().toLowerCase()
  if (!s) return concepts.slice(0, limit)
  const score = (c: Concept) => {
    const t = c.title.toLowerCase()
    if (t.startsWith(s)) return 4
    if (t.includes(s)) return 3
    if (c.summary.toLowerCase().includes(s)) return 2
    return c.nature.toLowerCase().includes(s) ? 1 : 0
  }
  return concepts
    .map((c) => ({ c, n: score(c) }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map((x) => x.c)
}
