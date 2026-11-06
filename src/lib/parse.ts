// Turns the Markdown files in src/content into phases and concepts.
// The format is documented in README.md so new concepts can be added without touching code.

export type Kind = 'particle' | 'concept' | 'quantity' | 'law' | 'component' | 'method' | 'system'

export interface Formula { tex: string; note: string }
export interface Example { q: string; steps: string[]; a: string }
export interface Check { q: string; options: string[]; correct: number; why: string }

export interface Concept {
  id: string
  title: string
  phase: number
  kind: Kind
  level: number
  needs: string[]
  see: string[]
  viz: string[]
  summary: string
  nature: string
  eng: string
  math: Formula[]
  examples: Example[]
  trap: string
  lab: string
  apply: string
  checks: Check[]
}

export interface Phase { n: number; title: string; blurb: string }

const SECTIONS: Record<string, 'nature' | 'eng' | 'math' | 'example' | 'trap' | 'lab' | 'apply' | 'check'> = {
  nature: 'nature',
  engineering: 'eng',
  math: 'math',
  example: 'example',
  'watch out': 'trap',
  lab: 'lab',
  egirerobotics: 'apply',
  check: 'check',
}

const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)

export function parseContent(raw: string): { phase: Phase; concepts: Concept[] } {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const head = lines.find((l) => l.startsWith('@phase'))
  if (!head) throw new Error('Content file has no @phase line')
  const [num, title, blurb] = head.replace('@phase', '').split('|').map((s) => s.trim())
  const phase: Phase = { n: Number(num), title, blurb: blurb ?? '' }

  const concepts: Concept[] = []
  let c: Concept | null = null
  let section: string = 'nature'
  let inHeader = false
  let ex: Example | null = null
  let ck: Check | null = null

  for (const line of lines) {
    if (line.startsWith('@phase')) continue
    const h1 = line.match(/^# ([a-z0-9-]+):\s*(.+)$/)
    if (h1) {
      c = {
        id: h1[1], title: h1[2].trim(), phase: phase.n, kind: 'concept', level: 1,
        needs: [], see: [], viz: [], summary: '', nature: '', eng: '', math: [],
        examples: [], trap: '', lab: '', apply: '', checks: [],
      }
      concepts.push(c)
      section = 'nature'
      inHeader = true
      ex = null
      ck = null
      continue
    }
    if (!c) continue

    if (inHeader) {
      const meta = line.match(/^(kind|level|needs|see|viz):\s*(.*)$/)
      if (meta) {
        const [, key, val] = meta
        if (key === 'kind') c.kind = val.trim() as Kind
        if (key === 'level') c.level = Number(val)
        if (key === 'needs') c.needs = list(val)
        if (key === 'see') c.see = list(val)
        if (key === 'viz') c.viz = list(val)
        continue
      }
      if (line.startsWith('> ')) { c.summary = line.slice(2).trim(); continue }
      if (line.trim() === '') continue
      inHeader = false
    }

    const h2 = line.match(/^## (.+)$/)
    if (h2) {
      const key = SECTIONS[h2[1].trim().toLowerCase()]
      if (!key) throw new Error(`Unknown section "${h2[1]}" in ${c.id}`)
      section = key
      ex = null
      ck = null
      continue
    }

    switch (section) {
      case 'math': {
        const m = line.match(/^\$\$(.+?)\$\$\s*(.*)$/)
        if (m) c.math.push({ tex: m[1].trim(), note: m[2].trim() })
        break
      }
      case 'example': {
        if (line.startsWith('Q: ')) { ex = { q: line.slice(3), steps: [], a: '' }; c.examples.push(ex) }
        else if (ex && line.startsWith('- ')) ex.steps.push(line.slice(2))
        else if (ex && line.startsWith('A: ')) ex.a = line.slice(3)
        break
      }
      case 'check': {
        if (line.startsWith('Q: ')) { ck = { q: line.slice(3), options: [], correct: -1, why: '' }; c.checks.push(ck) }
        else if (ck && line.startsWith('+ ')) { ck.correct = ck.options.length; ck.options.push(line.slice(2)) }
        else if (ck && line.startsWith('- ')) ck.options.push(line.slice(2))
        else if (ck && line.startsWith('W: ')) ck.why = line.slice(3)
        break
      }
      default: {
        const key = section as 'nature' | 'eng' | 'trap' | 'lab' | 'apply'
        c[key] += line + '\n'
      }
    }
  }
  for (const k of concepts) {
    for (const f of ['nature', 'eng', 'trap', 'lab', 'apply'] as const) k[f] = k[f].trim()
  }
  return { phase, concepts }
}

/** Every [[id]] or [[id|label]] mentioned in a concept's prose. */
export function inlineLinks(c: Concept): string[] {
  const text = [c.summary, c.nature, c.eng, c.trap, c.lab, c.apply].join(' ')
  return [...text.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1])
}
