import type { Check } from './parse'

export interface Tool {
  id: string; name: string; group: string; priority: string
  lessons: string[]; viz: string[]; panel?: string; summary: string
  what: string; why: string; how: string; functions: string
  practice: string[]; mistakes: string; safety: string; buying: string
  checks: Check[]
}

export const TOOL_GROUPS = ['Measure', 'Power', 'Build', 'Debug']
export const PRIORITIES = ['Buy first', 'Buy next', 'Later']

const KEYS: Record<string, 'what' | 'why' | 'how' | 'functions' | 'practice' | 'mistakes' | 'safety' | 'buying' | 'check'> = {
  'what it is': 'what', 'why it matters': 'why', 'how to use it': 'how', functions: 'functions',
  practice: 'practice', mistakes: 'mistakes', safety: 'safety', buying: 'buying', check: 'check',
}

export function parseTools(raw: string): Tool[] {
  const tools: Tool[] = []
  let t: Tool | null = null
  let key = ''
  let ck: Check | null = null
  const list = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)
  for (const line of raw.replace(/\r\n/g, '\n').split('\n')) {
    const h1 = line.match(/^# ([a-z0-9-]+):\s*(.+)$/)
    if (h1) {
      t = { id: h1[1], name: h1[2].trim(), group: '', priority: '', lessons: [], viz: [], summary: '', what: '', why: '', how: '', functions: '', practice: [], mistakes: '', safety: '', buying: '', checks: [] }
      tools.push(t)
      key = ''
      continue
    }
    if (!t) continue
    const h2 = line.match(/^## (.+)$/)
    if (h2) {
      key = KEYS[h2[1].trim().toLowerCase()]
      if (!key) throw new Error(`Unknown section "${h2[1]}" in ${t.id}`)
      ck = null
      continue
    }
    if (!key) {
      const m = line.match(/^(group|priority|lessons|viz|panel):\s*(.*)$/)
      if (m) {
        if (m[1] === 'group') t.group = m[2].trim()
        if (m[1] === 'priority') t.priority = m[2].trim()
        if (m[1] === 'lessons') t.lessons = list(m[2])
        if (m[1] === 'viz') t.viz = list(m[2])
        if (m[1] === 'panel') t.panel = m[2].trim()
      } else if (line.startsWith('> ')) t.summary = line.slice(2).trim()
      continue
    }
    if (key === 'practice') {
      if (line.startsWith('- ')) t.practice.push(line.slice(2))
    } else if (key === 'check') {
      if (line.startsWith('Q: ')) { ck = { q: line.slice(3), options: [], correct: -1, why: '' }; t.checks.push(ck) }
      else if (ck && line.startsWith('+ ')) { ck.correct = ck.options.length; ck.options.push(line.slice(2)) }
      else if (ck && line.startsWith('- ')) ck.options.push(line.slice(2))
      else if (ck && line.startsWith('W: ')) ck.why = line.slice(3)
    } else {
      const k = key as 'what' | 'why' | 'how' | 'functions' | 'mistakes' | 'safety' | 'buying'
      t[k] += line + '\n'
    }
  }
  for (const x of tools) for (const k of ['what', 'why', 'how', 'functions', 'mistakes', 'safety', 'buying'] as const) x[k] = x[k].trim()
  return tools
}
