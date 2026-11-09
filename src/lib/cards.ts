import type { Check } from './parse'

// A general teaching card: "# id: Name", metadata lines, "> summary", then "## Title" sections.
export interface Card {
  id: string; name: string; summary: string
  meta: Record<string, string>
  sections: { title: string; body: string }[]
  steps: string[]
  checks: Check[]
}

export const list = (s?: string) => (s ?? '').split(',').map((x) => x.trim()).filter(Boolean)

export function parseCards(raw: string): Card[] {
  const out: Card[] = []
  let c: Card | null = null
  let sec: { title: string; body: string } | null = null
  let mode: 'head' | 'body' | 'steps' | 'check' = 'head'
  let ck: Check | null = null
  let fence = false
  for (const line of raw.replace(/\r\n/g, '\n').split('\n')) {
    if (!fence) {
      const h1 = line.match(/^# ([a-z0-9-]+):\s*(.+)$/)
      if (h1) {
        c = { id: h1[1], name: h1[2].trim(), summary: '', meta: {}, sections: [], steps: [], checks: [] }
        out.push(c)
        mode = 'head'
        sec = null
        continue
      }
      if (!c) continue
      const h2 = line.match(/^## (.+)$/)
      if (h2) {
        const title = h2[1].trim()
        if (title === 'Steps') mode = 'steps'
        else if (title === 'Check') { mode = 'check'; ck = null }
        else { mode = 'body'; sec = { title, body: '' }; c.sections.push(sec) }
        continue
      }
    }
    if (!c) continue
    if (mode === 'head') {
      const m = line.match(/^([a-z]+):\s*(.*)$/)
      if (m) c.meta[m[1]] = m[2].trim()
      else if (line.startsWith('> ')) c.summary = line.slice(2).trim()
    } else if (mode === 'steps') {
      if (line.startsWith('- ')) c.steps.push(line.slice(2))
    } else if (mode === 'check') {
      if (line.startsWith('Q: ')) { ck = { q: line.slice(3), options: [], correct: -1, why: '' }; c.checks.push(ck) }
      else if (ck && line.startsWith('+ ')) { ck.correct = ck.options.length; ck.options.push(line.slice(2)) }
      else if (ck && line.startsWith('- ')) ck.options.push(line.slice(2))
      else if (ck && line.startsWith('W: ')) ck.why = line.slice(3)
    } else if (sec) {
      if (line.startsWith('```')) fence = !fence
      sec.body += line + '\n'
    }
  }
  for (const x of out) for (const s of x.sections) s.body = s.body.trim()
  return out
}
