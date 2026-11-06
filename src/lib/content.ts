import raw from '../glossary/words.md?raw'
import { buildMatcher, parseGlossary } from './glossary'
import { buildGraph } from './graph'

const files = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const graph = buildGraph(Object.values(files))

export const words = parseGlossary(raw).sort((a, b) => a.name.localeCompare(b.name))
export const matcher = buildMatcher(words)
export const wordByName = new Map(words.map((w) => [w.name, w]))
