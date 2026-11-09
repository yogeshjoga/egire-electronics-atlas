import { useEffect } from 'react'
import { graph } from '../lib/content'
import { Inline } from '../components/Rich'
import { Shot } from '../guide/Shot'
import { LOOP, SCREENS, STAGES } from '../guide/guide'

const PARTS: [string, string][] = [
  ['start', 'Where to start'], ['loop', 'How to study one concept'], ['path', 'The path to expert'],
  ...SCREENS.map((s): [string, string] => [s.id, s.title]), ['tips', 'Habits of good engineers'], ['faq', 'Questions'],
]

/** How to use the site, and how to go from beginner to expert with it. */
export function Guide({ open, tour, learned }: { open: (id: string) => void; tour: () => void; learned: number }) {
  useEffect(() => { document.querySelector('.stage')?.scrollTo(0, 0) }, [])
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const first = graph.concepts[0]
  return (
    <div className="page guide-page">
      <h1>How to use this site</h1>
      <p className="lede">This site teaches electronics from the atom up to flight controllers and AI boards. It works like a map: 305 concepts, each on its own pad, joined by traces that show what to learn first. This page explains every screen, and how to use them to become an expert.</p>
      <div className="guide-actions">
        <button type="button" className="solder" onClick={tour}>Take the 2-minute walkthrough</button>
        <button type="button" className="ghost" onClick={() => open(first.id)}>{learned ? 'Continue learning' : `Start learning: ${first.title}`}</button>
      </div>

      <nav className="guide-toc" aria-label="On this page">
        <h2>On this page</h2>
        <ol>{PARTS.map(([id, t]) => <li key={id}><a href={`#/guide`} onClick={(e) => { e.preventDefault(); jump(id) }}>{t}</a></li>)}</ol>
      </nav>

      <section id="start">
        <h2>Where to start</h2>
        <ol className="guide-steps">
          <li><b>Start at phase 0, even if you know some electronics.</b> Electricity makes much more sense when you know what charge and electrons are. The early lessons are short; you can move through what you know quickly.</li>
          <li><b>Open the first lesson.</b> Select <b>Next up</b> at the top of the phase list, or the <b>Matter</b> pad at the top left of the board.</li>
          <li><b>Follow the loop below for every concept.</b> Mark each one as learned only when you can answer its check question without looking.</li>
          <li><b>Always press Next up when unsure.</b> It picks a concept you are ready for, so you never meet an idea before the ideas it needs.</li>
          <li><b>Use one browser.</b> There is no account or login. Your progress is saved in this browser on this device.</li>
        </ol>
      </section>

      <section id="loop">
        <h2>How to study one concept</h2>
        <p>Each lesson follows the same order. Use it as a routine. About 20 to 40 minutes per concept is normal.</p>
        <ol className="guide-steps">{LOOP.map((t) => <li key={t}><Inline text={t} /></li>)}</ol>
        <p className="guide-tip">Pace yourself with a steady rhythm, such as one or two concepts a day plus one hands-on session a week. Regular short practice beats one long weekend.</p>
      </section>

      <section id="path">
        <h2>The path from beginner to expert</h2>
        <p>The 21 phases fall into six stages. Each stage has a goal, the parts of the site that help most, and something to build. Do not skip the building: an engineer is someone who can make things work, not only explain them.</p>
        <ol className="stages">
          {STAGES.map((s) => (
            <li key={s.n}>
              <h3><span>Stage {s.n}</span> {s.title} <small>Phases {s.phases}</small></h3>
              <dl>
                <dt>You will be able to</dt><dd><Inline text={s.goal} /></dd>
                <dt>Use on this site</dt><dd><Inline text={s.use} /></dd>
                <dt>Build</dt><dd><Inline text={s.build} /></dd>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="guide-major">Every screen, explained</h2>
      <p>Select a number on a screenshot to jump to its explanation.</p>
      {SCREENS.map((s) => (
        <section key={s.id} id={s.id}>
          <h2>{s.title}</h2>
          <p><Inline text={s.intro} /></p>
          <Shot s={s} />
          {s.after && <p><Inline text={s.after} /></p>}
        </section>
      ))}

      <section id="tips">
        <h2>Habits of good engineers</h2>
        <ul className="guide-steps">
          <li><b>Measure everything.</b> Predict a value, then measure it. When the two disagree, you are about to learn something.</li>
          <li><Inline text={"**Read datasheets early.** Use the datasheet section in [Symbols](#/symbols) and look up the real parts you use."} /></li>
          <li><Inline text={"**Revise the load-bearing ideas.** [Research](#/research) lists the concepts most others depend on. Weakness there spreads everywhere."} /></li>
          <li><b>Explain it to someone.</b> If you cannot explain a concept simply, go back to its lesson.</li>
          <li><b>Keep a notebook.</b> Write down circuits you built, what you measured, and what went wrong.</li>
          <li><Inline text={"**Finish projects.** The projects in [Boards](#/boards/projects) combine many lessons. Each one finished is worth more than ten started."} /></li>
        </ul>
      </section>

      <section id="faq">
        <h2>Questions</h2>
        <dl className="faq">
          <dt>Do I need an account?</dt>
          <dd>No. There is no login. Progress is stored in your browser. Clearing your browser data, or using another device, starts you from zero.</dd>
          <dt>Can I skip ahead?</dt>
          <dd>Yes, any lesson can be opened at any time. The lesson tells you which earlier concepts you have not learned yet, so you can fill the gaps.</dd>
          <dt>What does a word with a dotted underline mean?</dt>
          <dd><Inline text={"It is explained in the glossary. Hover over it or tap it to read the meaning. Every word is also listed on the [Words](#/words) page."} /></dd>
          <dt>How do I reset my progress?</dt>
          <dd>Use <b>Clear my progress</b> at the bottom of the phase list.</dd>
          <dt>Can I see the walkthrough again?</dt>
          <dd>Yes, use the button at the top of this page.</dd>
        </dl>
      </section>
    </div>
  )
}
