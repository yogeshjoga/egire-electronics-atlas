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
import { DRONE_CATEGORIES, SENSOR_LESSONS } from './parts'
import { list, parseCards } from './cards'

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

describe('boards and software', () => {
  const files = ['boards', 'stacks', 'protocols', 'projects']
  const sets = Object.fromEntries(files.map((n) => [n, parseCards(readFileSync(join(__dirname, `../boards/${n}.md`), 'utf8'))]))
  const all = Object.values(sets).flat()
  const ids = new Set(all.map((c) => c.id))

  it('has unique ids across every list', () => expect(ids.size).toBe(all.length))
  it('has a summary and content on every card', () => {
    for (const c of all) {
      expect(c.summary, c.id).not.toBe('')
      expect(c.sections.length + c.steps.length, c.id).toBeGreaterThan(0)
    }
  })
  it('links only to real lessons, boards, stacks and protocols', () => {
    for (const c of all) {
      expect(list(c.meta.lessons).filter((id) => !g.byId.has(id)), c.id).toEqual([])
      expect(list(c.meta.boards).filter((id) => !sets.boards.some((b) => b.id === id)), c.id).toEqual([])
      expect(list(c.meta.stacks).filter((id) => !sets.stacks.some((b) => b.id === id)), c.id).toEqual([])
      expect(list(c.meta.protocols).filter((id) => !sets.protocols.some((b) => b.id === id)), c.id).toEqual([])
    }
  })
  it('gives every protocol the full set of sections and a wiring diagram', () => {
    const dia = readFileSync(join(__dirname, '../boards/diagrams.tsx'), 'utf8')
    const need = ['How it works inside', 'Advantages', 'Disadvantages', 'Pick it when', 'Pins and circuit', 'Example projects']
    for (const p of sets.protocols.filter((c) => c.id !== 'choosing-protocols')) {
      const titles = p.sections.map((s) => s.title)
      expect(need.filter((t) => !titles.includes(t)), p.id).toEqual([])
      expect(dia.includes(`  ${p.id}: `) || dia.includes(`  '${p.id}': `), `diagram for ${p.id}`).toBe(true)
    }
  })
  it('has a screenshot with labels on the image for every guide screen', async () => {
    const { SCREENS, STAGES } = await import('../guide/guide')
    const { existsSync } = await import('node:fs')
    expect(new Set(SCREENS.map((x) => x.id)).size).toBe(SCREENS.length)
    for (const sc of SCREENS) {
      expect(existsSync(join(__dirname, '../../public/guide', sc.file)), sc.file).toBe(true)
      expect(sc.spots.length, sc.id).toBeGreaterThan(2)
      for (const p of sc.spots) {
        expect(p.x, sc.id + p.name).toBeGreaterThan(0); expect(p.x).toBeLessThan(100)
        expect(p.y, sc.id + p.name).toBeGreaterThan(0); expect(p.y).toBeLessThan(100)
      }
    }
    expect(STAGES.map((x) => x.n)).toEqual([1, 2, 3, 4, 5, 6])
  })
  it('has a real, credited photo with valid labels for each board tour', async () => {
    const { PHOTOS } = await import('../boards/photos')
    const { existsSync } = await import('node:fs')
    for (const [id, list] of Object.entries(PHOTOS)) {
      expect(sets.boards.some((b) => b.id === id), id).toBe(true)
      for (const ph of list) {
        expect(existsSync(join(__dirname, '../../public/boards', ph.file)), ph.file).toBe(true)
        for (const k of ['author', 'license', 'licenseUrl', 'source'] as const) expect(ph.credit[k], `${ph.file} ${k}`).toBeTruthy()
        expect(ph.credit.source, ph.file).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
        for (const s of ph.spots) {
          expect(s.x, s.name).toBeGreaterThan(0); expect(s.x, s.name).toBeLessThan(100)
          expect(s.y, s.name).toBeGreaterThan(0); expect(s.y, s.name).toBeLessThan(100)
          for (const r of [...s.text.matchAll(/\[\[([a-z0-9-]+)/g)].map((m) => m[1])) expect(g.byId.has(r) || r === 'ethernet', r).toBe(true)
        }
      }
    }
  })
  it('gives every project boards, software, lessons and steps', () => {
    for (const p of sets.projects) {
      for (const f of ['boards', 'stacks', 'lessons', 'level', 'parts']) expect(p.meta[f], `${p.id} ${f}`).toBeTruthy()
      expect(p.steps.length, p.id).toBeGreaterThan(2)
    }
  })
  it('has one right answer per check', () => {
    for (const c of all) for (const k of c.checks) expect(k.correct, k.q).toBeGreaterThanOrEqual(0)
  })
  it('keeps code blocks closed', () => {
    for (const n of files) expect((readFileSync(join(__dirname, `../boards/${n}.md`), 'utf8').match(/^```/gm) ?? []).length % 2, n).toBe(0)
  })
  it('never marks glossary words inside code', () => {
    const m = buildMatcher(parseGlossary(readFileSync(join(__dirname, '../glossary/words.md'), 'utf8')))
    expect(annotate('```\nvoltage = 5\n```', m, new Set(), 'x')).not.toContain('{{')
    expect(annotate('call `voltage()` now', m, new Set(), 'x')).not.toContain('{{')
  })
})

describe('components', () => {
  const data = JSON.parse(readFileSync(join(__dirname, '../parts/sensors.json'), 'utf8'))
  const guides = ['types', 'fpv', 'ai', 'selection'].map((n) => readFileSync(join(__dirname, `../parts/${n}.md`), 'utf8'))

  it('has all 300 catalogue sensors, numbered 1 to 300', () => {
    expect(data.sensors.map((s: { n: number }) => s.n)).toEqual(Array.from({ length: 300 }, (_, i) => i + 1))
  })
  it('has 30 categories of 10', () => {
    expect(data.categories.length).toBe(30)
    for (const c of data.categories) expect(data.sensors.filter((s: { category: string }) => s.category === c).length, c).toBe(10)
  })
  it('has every field filled in for every sensor', () => {
    for (const s of data.sensors) for (const k of ['name', 'measures', 'why', 'uses', 'when', 'example']) expect(s[k], `${s.n} ${k}`).not.toBe('')
  })
  it('links only to real lessons and categories', () => {
    for (const [c, ids] of Object.entries(SENSOR_LESSONS)) {
      expect(data.categories, c).toContain(c)
      expect(ids.filter((id) => !g.byId.has(id)), c).toEqual([])
    }
    for (const c of DRONE_CATEGORIES) expect(data.categories).toContain(c)
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
  it('cites sources for FPV and AI parts', () => {
    for (const t of [guides[1], guides[2]]) expect((t.match(/\]\(https:\/\//g) ?? []).length).toBeGreaterThan(3)
  })
})

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
  it('defines elementary charge', () => {
    expect(annotate('the elementary charge.', m, new Set(), 'x')).toContain('{{elementary charge::elementary charge}}')
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
