# EgireRobotics Electronics Atlas

An interactive knowledge graph that teaches electronics from matter and quarks up to flight controllers and custom silicon. The graph is drawn as a circuit board: phases are silkscreened zones, concepts are pads, and prerequisites are copper traces.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5273. `npm run build` writes a static site to `dist/`, and `npm test` checks the graph and the physics.

## Add or change a concept

All teaching content lives in `src/content/`, one Markdown file per phase. No code changes are needed.

```markdown
# my-concept: Title shown on the board
kind: concept        particle, concept, quantity, law, component, method or system
level: 2             1 Foundation, 2 Core, 3 Advanced, 4 Research
needs: voltage, current     prerequisites (draws the copper traces)
see: resistor               related concepts
viz: ohm                    simulators, ids listed in src/viz/ids.ts
> One-line summary.

Text explaining what happens in nature. Use $V=IR$ for maths and [[voltage]] or [[voltage|custom text]] for links.

## Engineering
## Math
$$V=IR$$ Short note about the formula.
## Example
Q: The question
- A step
A: The answer
## Watch out
## Lab
## EgireRobotics
## Check
Q: The question
+ The right option
- A wrong option
W: Why the right option is right.
```

Every section is optional. To define a word, add a line to `src/glossary/words.md`. Lessons mark its first use automatically. `npm test` fails if a link is broken, a prerequisite loop appears, a formula will not render, or a concept cannot be traced back to Matter.

Progress is saved in the browser, so clearing site data clears it.
