import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { ancestors, buildGraph, findPath, readySet, rootChain } from './graph'
import { inlineLinks } from './parse'
import { VIZ_IDS } from '../viz/ids'
import { annotate, buildMatcher, parseGlossary } from './glossary'

const dir = join(__dirname, '../content')
const g = buildGraph(readdirSync(dir).map((f) => readFileSync(join(dir, f), 'utf8')))

describe('knowledge graph integrity', () => {
  it('has 21 phases numbered 0 to 20', () => {
    expect(g.phases.map((p) => p.n)).toEqual(Array.from({ length: 21 }, (_, i) => i))
  })

  it('has unique ids', () => {
    expect(new Set(g.concepts.map((c) => c.id)).size).toBe(g.concepts.length)
  })

  it('every reference points at a real concept', () => {
    const bad: string[] = []
    for (const c of g.concepts) {
      for (const r of [...c.needs, ...c.see, ...inlineLinks(c)]) {
        if (!g.byId.has(r)) bad.push(`${c.id} -> ${r}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('every simulator id exists', () => {
    const bad = g.concepts.flatMap((c) => c.viz.filter((v) => !VIZ_IDS.includes(v)).map((v) => `${c.id}: ${v}`))
    expect(bad).toEqual([])
  })

  it('every simulator is used by at least one concept', () => {
    const used = new Set(g.concepts.flatMap((c) => c.viz))
    expect(VIZ_IDS.filter((v) => !used.has(v))).toEqual([])
  })

  it('prerequisites contain no cycles', () => {
    const state = new Map<string, 1 | 2>()
    const cycles: string[] = []
    const visit = (id: string, trail: string[]) => {
      if (state.get(id) === 2) return
      if (state.get(id) === 1) { cycles.push([...trail, id].join(' > ')); return }
      state.set(id, 1)
      for (const n of g.byId.get(id)!.needs) visit(n, [...trail, id])
      state.set(id, 2)
    }
    g.concepts.forEach((c) => visit(c.id, []))
    expect(cycles).toEqual([])
  })

  it('has exactly one root and everything traces back to matter', () => {
    expect(g.concepts.filter((c) => c.needs.length === 0).map((c) => c.id)).toEqual(['matter'])
    for (const c of g.concepts) if (c.id !== 'matter') expect(ancestors(g, c.id).has('matter')).toBe(true)
  })

  it('every concept has a summary and valid kind', () => {
    const kinds = ['particle', 'concept', 'quantity', 'law', 'component', 'method', 'system']
    for (const c of g.concepts) {
      expect(c.summary, c.id).not.toBe('')
      expect(kinds, c.id).toContain(c.kind)
    }
  })

  it('every check question has one marked answer', () => {
    for (const c of g.concepts) for (const k of c.checks) {
      expect(k.correct, `${c.id}: ${k.q}`).toBeGreaterThanOrEqual(0)
      expect(k.options.length, `${c.id}: ${k.q}`).toBeGreaterThan(1)
    }
  })

  it('every worked example has an answer', () => {
    for (const c of g.concepts) for (const e of c.examples) expect(e.a, `${c.id}: ${e.q}`).not.toBe('')
  })

  it('all maths parses in KaTeX', () => {
    const bad: string[] = []
    const tryTex = (id: string, tex: string) => {
      try { katex.renderToString(tex, { throwOnError: true }) } catch (e) { bad.push(`${id}: ${tex} :: ${(e as Error).message}`) }
    }
    for (const c of g.concepts) {
      c.math.forEach((m) => { tryTex(c.id, m.tex); inline(m.note).forEach((t) => tryTex(c.id, t)) })
      const prose = [c.summary, c.nature, c.eng, c.trap, c.lab, c.apply,
        ...c.examples.flatMap((e) => [e.q, e.a, ...e.steps]),
        ...c.checks.flatMap((k) => [k.q, k.why, ...k.options])]
      prose.forEach((p) => inline(p).forEach((t) => tryTex(c.id, t)))
    }
    expect(bad).toEqual([])
  })
})

function inline(s: string) {
  return [...s.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])
}

describe('glossary', () => {
  const list = parseGlossary(readFileSync(join(__dirname, '../glossary/words.md'), 'utf8'))
  const m = buildMatcher(list)

  it('points every word at a real lesson', () => {
    expect(list.filter((w) => w.concept && !g.byId.has(w.concept)).map((w) => w.name)).toEqual([])
  })
  it('has a definition for every word', () => {
    expect(list.filter((w) => w.def.length < 10).map((w) => w.name)).toEqual([])
  })
  it('marks only the first use of a word', () => {
    expect(annotate('Mass and mass again.', m, new Set(), 'x')).toBe('{{mass::Mass}} and mass again.')
  })
  it('does not add table separators', () => {
    expect(annotate('| mass | heat |', m, new Set(), 'x').split('|').length).toBe(4)
  })
  it('leaves maths and links alone', () => {
    expect(annotate('$mass$ [[mass]]', m, new Set(), 'x')).toBe('$mass$ [[mass]]')
  })
  it('does not define a word inside its own lesson', () => {
    expect(annotate('Mass here.', m, new Set(), 'mass')).toBe('Mass here.')
  })
  it('keeps abbreviations case-sensitive', () => {
    expect(annotate('the kv of it', m, new Set(), 'x')).toBe('the kv of it')
  })
})

describe('graph queries', () => {
  it('traces the chain from matter to a transistor', () => {
    const chain = rootChain(g, 'mosfet')
    expect(chain[0]).toBe('matter')
    expect(chain.at(-1)).toBe('mosfet')
  })

  it('links a quark to a flight controller', () => {
    const p = findPath(g, 'quark', 'flight-controller')
    expect(p).not.toBeNull()
  })

  it('offers matter first, then unlocks the next ring', () => {
    expect([...readySet(g, new Set())]).toEqual(['matter'])
    const next = readySet(g, new Set(['matter']))
    expect(next.has('atom')).toBe(true)
    expect(next.has('matter')).toBe(false)
  })
})
