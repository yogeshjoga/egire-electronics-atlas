import { useCallback, useEffect, useState } from 'react'

const KEY = 'egire-atlas-learned-v1'

function load(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')) } catch { return new Set() }
}

/** Learned concepts, saved in this browser. */
export function useLearned() {
  const [learned, setLearned] = useState<Set<string>>(load)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify([...learned])) }, [learned])
  const toggle = useCallback((id: string) => {
    setLearned((s) => {
      const n = new Set(s)
      if (!n.delete(id)) n.add(id)
      return n
    })
  }, [])
  const reset = useCallback(() => setLearned(new Set()), [])
  return { learned, toggle, reset }
}

export type View = 'board' | 'labs' | 'formulas' | 'laws' | 'symbols' | 'tools' | 'components' | 'boards' | 'words' | 'test' | 'research' | 'guide'
export interface Route { view: View; arg?: string }

function parse(): Route {
  const [, view, arg] = location.hash.split('/')
  return { view: (['board', 'labs', 'formulas', 'laws', 'symbols', 'tools', 'components', 'boards', 'words', 'test', 'research', 'guide'].includes(view) ? view : 'board') as View, arg: arg ? decodeURIComponent(arg) : undefined }
}

/** Keeps the current view in the URL so the back button and links work. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  const go = useCallback((view: View, arg?: string) => {
    location.hash = `#/${view}${arg ? '/' + encodeURIComponent(arg) : ''}`
  }, [])
  return { route, go }
}
