import { useCallback, useEffect, useMemo, useState } from 'react'
import { graph } from './lib/content'
import { readySet } from './lib/graph'
import { useLearned, useRoute, type View } from './lib/store'
import { Board } from './components/Board'
import { Lesson } from './components/Lesson'
import { KIND_LABEL, PadShape } from './components/Pad'
import { OpenConcept } from './components/Rich'
import { Search } from './components/Search'
import { Formulas, Labs, Laws, Research, SelfTest, Words } from './views/Views'
import { Symbols } from './views/Symbols'
import { Tools } from './views/Tools'
import { Components } from './views/Components'
import type { Kind } from './lib/parse'

const TABS: [View, string][] = [['board', 'Board'], ['labs', 'Labs'], ['formulas', 'Formulas'], ['laws', 'Laws'], ['symbols', 'Symbols'], ['tools', 'Tools'], ['components', 'Components'], ['words', 'Words'], ['test', 'Self-test'], ['research', 'Research']]

export default function App() {
  const { route, go } = useRoute()
  const { learned, toggle, reset } = useLearned()
  const [searching, setSearching] = useState(false)
  const [railOpen, setRailOpen] = useState(false)
  const [focusPhase, setFocusPhase] = useState<{ n: number; nonce: number } | null>(null)
  const [activePhase, setActivePhase] = useState(0)

  const ready = useMemo(() => readySet(graph, learned), [learned])
  const open = useCallback((id: string) => go('board', id), [go])
  const selected = route.view === 'board' && route.arg && graph.byId.has(route.arg) ? route.arg : undefined
  const concept = selected ? graph.byId.get(selected)! : null
  const next = graph.concepts.find((c) => ready.has(c.id))

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearching(true) }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLSelectElement)) { e.preventDefault(); setSearching(true) }
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])

  const showPhase = (n: number) => {
    setActivePhase(n)
    setRailOpen(false)
    go('board')
    setFocusPhase({ n, nonce: Date.now() })
  }

  return (
    <OpenConcept.Provider value={open}>
      <div className="app">
        <header className="top">
          <button type="button" className="rail-btn" aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>Phases</button>
          <a className="brand" href="#/board"><strong>EgireRobotics</strong> <span>Electronics Atlas</span></a>
          <nav aria-label="Main">
            {TABS.map(([v, t]) => (
              <a key={v} href={`#/${v}`} aria-current={route.view === v ? 'page' : undefined}>{t}</a>
            ))}
          </nav>
          <button type="button" className="search-btn" onClick={() => setSearching(true)}>Search<span> concepts</span> <kbd>/</kbd></button>
        </header>

        <div className="body">
          <aside className="rail" data-open={railOpen || undefined} aria-label="Learning phases">
            <div className="progress">
              <p><b>{learned.size}</b> of {graph.concepts.length} concepts learned</p>
              <div className="meter"><i style={{ width: `${(learned.size / graph.concepts.length) * 100}%` }} /></div>
              {next && <button type="button" className="solder" onClick={() => { setRailOpen(false); open(next.id) }}>Next up: {next.title}</button>}
            </div>
            <ol className="phases">
              {graph.phases.map((p) => {
                const items = graph.concepts.filter((c) => c.phase === p.n)
                const done = items.filter((c) => learned.has(c.id)).length
                return (
                  <li key={p.n}>
                    <button type="button" aria-current={activePhase === p.n && route.view === 'board' ? 'true' : undefined} onClick={() => showPhase(p.n)}>
                      <span className="n">{p.n}</span>
                      <span className="t">{p.title}<small>{p.blurb}</small></span>
                      <span className="c">{done}/{items.length}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="legend">
              <h2>Pad shapes</h2>
              <ul>
                {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
                  <li key={k}><svg width="30" height="26" viewBox="-20 -16 40 32" aria-hidden="true"><g className="node" data-state="idle"><PadShape kind={k} r={11} /></g></svg>{KIND_LABEL[k]}</li>
                ))}
              </ul>
              <h2>Pad finish</h2>
              <ul>
                <li><svg width="30" height="26" viewBox="-20 -16 40 32" aria-hidden="true"><g className="node" data-state="ready"><circle className="ring" r={14} /><circle className="pad" r={9} /></g></svg>Ready to learn</li>
                <li><svg width="30" height="26" viewBox="-20 -16 40 32" aria-hidden="true"><g className="node" data-state="learned"><circle className="pad" r={11} /></g></svg>Learned</li>
              </ul>
              {learned.size > 0 && <button type="button" className="ghost" onClick={() => { if (confirm('Clear all learned concepts in this browser?')) reset() }}>Clear my progress</button>}
            </div>
          </aside>

          <main className="stage">
            {route.view === 'board' && (
              <div className="split">
                <Board selected={selected} learned={learned} ready={ready} focusPhase={focusPhase} onSelect={open} onPhaseInView={setActivePhase} />
                {concept && <Lesson c={concept} learned={learned} open={open} toggle={toggle} close={() => go('board')} />}
              </div>
            )}
            {route.view === 'labs' && <Labs active={route.arg} go={(id) => go('labs', id)} open={open} />}
            {route.view === 'formulas' && <Formulas open={open} />}
            {route.view === 'laws' && <Laws open={open} />}
            {route.view === 'symbols' && <Symbols tab={route.arg} go={(t) => go('symbols', t)} open={open} />}
            {route.view === 'tools' && <Tools id={route.arg} go={(id) => go('tools', id)} open={open} />}
            {route.view === 'components' && <Components tab={route.arg} go={(t) => go('components', t)} open={open} />}
            {route.view === 'words' && <Words open={open} />}
            {route.view === 'test' && <SelfTest open={open} />}
            {route.view === 'research' && <Research open={open} learned={learned} />}
          </main>
        </div>
        {searching && <Search onClose={() => setSearching(false)} onPick={(id) => { setSearching(false); open(id) }} />}
      </div>
    </OpenConcept.Provider>
  )
}
