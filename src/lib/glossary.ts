// Plain-language definitions. src/glossary/words.md holds the list.

export interface Word { name: string; forms: string[]; concept: string | null; def: string }

export function parseGlossary(raw: string): Word[] {
  return raw.replace(/\r\n/g, '\n').split('\n')
    .filter((l) => l.split('|').length === 3)
    .map((l) => {
      const [forms, concept, def] = l.split('|').map((s) => s.trim())
      const list = forms.split(',').map((s) => s.trim())
      return { name: list[0], forms: list, concept: concept === '-' ? null : concept, def }
    })
}

export interface Matcher { regex: RegExp; lookup: Map<string, Word> }

export function buildMatcher(words: Word[]): Matcher {
  const lookup = new Map<string, Word>()
  for (const w of words) for (const f of w.forms) lookup.set(f.toLowerCase(), w)
  const forms = [...lookup.keys()].sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return { regex: new RegExp(`(?<![\\w-])(${forms.join('|')})(?![\\w-])`, 'gi'), lookup }
}

// Skip maths, links and table header rows; everything else is plain prose.
const PROTECTED = /(```[\s\S]*?```|`[^`\n]+`|\$[^$]+\$|\[\[[^\]]+\]\]|\{\{[^}]+\}\}|\[[^\]]+\]\([^)]+\))/g

/**
 * Marks the first use of each word with {{name::text}} (no bar, as bars split table cells), so a lesson explains a word
 * the first time a reader meets it. `seen` carries across a lesson's sections.
 */
export function annotate(text: string, m: Matcher, seen: Set<string>, skipConcept: string): string {
  return text.split(PROTECTED).map((part, i) => {
    if (i % 2 === 1) return part
    return part.replace(m.regex, (hit) => {
      const w = m.lookup.get(hit.toLowerCase())!
      if (seen.has(w.name) || w.concept === skipConcept) return hit
      // Abbreviations are case-sensitive, so "die" is not "DIE" and "kv" is not "Kv".
      if (w.forms.every((f) => f !== f.toLowerCase()) && !w.forms.includes(hit)) return hit
      seen.add(w.name)
      return `{{${w.name}::${hit}}}`
    })
  }).join('')
}
