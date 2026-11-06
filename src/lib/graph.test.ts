import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { ancestors, buildGraph, findPath, readySet, rootChain } from './graph'
import { inlineLinks } from './parse'
import { VIZ_IDS } from '../viz/ids'
import { annotate, buildMatcher, parseGlossary } from './glossary'
import { searchConcepts } from './search'
import { TOOL_GROUPS, PRIORITIES, parseTools } from './tools'

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

describe('tools library', () => {
  const tools = parseTools(readFileSync(join(__dirname, '../tools/tools.md'), 'utf8'))
  const panels = readFileSync(join(__dirname, '../tools/panels.tsx'), 'utf8')

  it('has a full teaching page for every tool', () => {
    for (const t of tools) {
      for (const k of ['summary', 'what', 'why', 'how', 'mistakes'] as const) expect(t[k], `${t.id} ${k}`).not.toBe('')
      expect(t.practice.length, t.id).toBeGreaterThan(0)
      expect(t.checks.length, t.id).toBeGreaterThan(0)
      expect(t.lessons.length, t.id).toBeGreaterThan(0)
    }
  })
  it('uses valid groups and priorities', () => {
    for (const t of tools) {
      expect(TOOL_GROUPS, t.id).toContain(t.group)
      expect(PRIORITIES, t.id).toContain(t.priority)
    }
  })
  it('links only to real lessons, simulators and panels', () => {
    for (const t of tools) {
      expect(t.lessons.filter((id) => !g.byId.has(id)), t.id).toEqual([])
      expect(t.viz.filter((v) => !VIZ_IDS.includes(v)), t.id).toEqual([])
      if (t.panel) expect(panels, t.id).toContain(`${t.panel}: {`)
    }
  })
  it('has one right answer per check', () => {
    for (const t of tools) for (const k of t.checks) expect(k.correct, k.q).toBeGreaterThanOrEqual(0)
  })
  it('has unique ids', () => expect(new Set(tools.map((t) => t.id)).size).toBe(tools.length))
})

describe('symbols and guides', () => {
  const guides = ['design', 'datasheets', 'examples'].map((n) => readFileSync(join(__dirname, `../symbols/${n}.md`), 'utf8'))
  const lib = readFileSync(join(__dirname, '../symbols/library.tsx'), 'utf8')

  it('points every symbol at a real lesson', () => {
    const ids = [...lib.matchAll(/lesson: '([a-z0-9-]+)'/g)].map((m) => m[1])
    expect(ids.length).toBeGreaterThan(30)
    expect(ids.filter((id) => !g.byId.has(id))).toEqual([])
  })
  it('gives each symbol a unique id', () => {
    const ids = [...lib.matchAll(/\{ id: '([a-z0-9-]+)'/g)].map((m) => m[1])
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('links guides only to real lessons', () => {
    const refs = guides.flatMap((t) => [...t.matchAll(/\[\[([a-z0-9-]+)/g)].map((m) => m[1]))
    expect(refs.filter((id) => !g.byId.has(id))).toEqual([])
  })
  it('renders all guide maths', () => {
    const bad: string[] = []
    for (const t of guides) for (const tex of inline(t)) {
      try { katex.renderToString(tex, { throwOnError: true }) } catch { bad.push(tex) }
    }
    expect(bad).toEqual([])
  })
  it('cites sources for the real product examples', () => {
    expect((guides[2].match(/\]\(https:\/\//g) ?? []).length).toBeGreaterThan(8)
  })
})

describe('concept search', () => {
  it('puts title matches first', () => {
    expect(searchConcepts(g.concepts, 'buck')[0].id).toBe('buck')
  })
  it('ignores case and spaces', () => {
    expect(searchConcepts(g.concepts, '  MOSFET ')[0].title.toLowerCase()).toContain('mosfet')
  })
  it('returns nothing for nonsense', () => {
    expect(searchConcepts(g.concepts, 'zzzzqq')).toEqual([])
  })
  it('respects the limit', () => {
    expect(searchConcepts(g.concepts, 'a', 8).length).toBe(8)
  })
})

describe('laws', () => {
  it('includes every law and theorem on the course list', () => {
    const course = ['ohms-law', 'kcl', 'kvl', 'joule-heating', 'coulomb-law', 'faraday-law', 'lenz-law', 'ampere-law',
      'gauss-law', 'biot-savart', 'thevenin', 'norton', 'superposition', 'max-power']
    expect(course.filter((id) => g.byId.get(id)?.kind !== 'law')).toEqual([])
  })
})

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
