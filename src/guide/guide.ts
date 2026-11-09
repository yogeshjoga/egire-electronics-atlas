// Content for the Guide page: annotated screenshots of each part of the site, and the learning path.
// Screenshots live in public/guide and are 1440 by 900. x and y are percentages of the image.

export interface Spot { x: number; y: number; name: string; text: string }
export interface Screen { id: string; title: string; file: string; intro: string; spots: Spot[]; after?: string }

export const SCREENS: Screen[] = [
  {
    id: 'board', title: 'The board: your map of electronics', file: 'board.jpg',
    intro: 'This is the home screen. Every pad on the board is one concept. The copper traces between pads show which ideas you need first. You start at the top left with matter, and the board ends with flight controllers and SoCs.',
    spots: [
      { x: 62.5, y: 3, name: 'Main menu', text: 'Every section of the site. **Board** is the map, and the other tabs are libraries you dip into: simulators, formulas, laws, symbols, tools, components, boards, a glossary, tests and research.' },
      { x: 90.3, y: 3, name: 'Search', text: 'Find any concept by name or by a word in its summary. Press **/** or **Ctrl+K** from anywhere.' },
      { x: 15.5, y: 9.6, name: 'Your progress', text: 'How many of the 305 concepts you have marked as learned. Progress is saved in this browser only, so use the same browser each time.' },
      { x: 14.6, y: 15.9, name: 'Next up', text: 'The single best concept to learn next: the first one whose prerequisites you have all learned. If you are unsure what to do, press this.' },
      { x: 14.5, y: 22.2, name: 'Phases', text: 'The course in 21 phases, from **0. What is matter?** to **20. Advanced hardware design**. Select a phase to fly the board to it. The numbers on the right count learned concepts in that phase. On a phone, open this list with the **Phases** button.' },
      { x: 22, y: 13.5, name: 'Whole board or Trace this concept', text: '**Whole board** shows everything. **Trace this concept** hides everything except the selected concept and the chain of ideas behind it, so you can see exactly what to learn first.' },
      { x: 79, y: 9.2, name: 'Find a concept and Choose a concept', text: 'Type part of a name, or pick from the list, and the board jumps to that pad and opens its lesson.' },
      { x: 37, y: 18.8, name: 'Phase area', text: 'Each outlined area holds one phase. Select its title to zoom to it. Drag to move around, and scroll or pinch to zoom.' },
      { x: 27.5, y: 43.2, name: 'Learned pad (white)', text: 'A white, tinned pad is a concept you have marked as learned.' },
      { x: 57.5, y: 68.6, name: 'Ready pad (dashed ring)', text: 'A gold pad with a dashed ring is **ready**: you have learned everything it needs. These are the best places to go next.' },
      { x: 26.5, y: 81.2, name: 'Not ready yet', text: 'A plain gold pad still needs other concepts first. You can open it anyway, and the lesson lists what is missing.' },
      { x: 62, y: 26.3, name: 'Pad shape', text: 'The shape tells you the kind of idea: a circle is a concept, a square is a quantity you can measure, an octagon is a law, a ring is a particle, a rounded bar is a component, a diamond is a method, and a grid of dots is a whole system. The key is at the bottom of the phase list.' },
      { x: 80.5, y: 97.7, name: 'Trace colours', text: 'When a concept is selected, its traces light up. **Orange**: learn these first. **Blue**: what this concept unlocks. **Pink**: related ideas.' },
    ],
  },
  {
    id: 'lesson', title: 'A lesson, from the top', file: 'lesson.jpg',
    intro: 'Select any pad and its lesson slides in from the right, like a datasheet. The board stays visible on the left with the traces for that concept lit up.',
    spots: [
      { x: 71, y: 8.4, name: 'Where you are', text: 'The phase this concept belongs to.' },
      { x: 87.2, y: 8.4, name: 'Wide page and Close', text: '**Wide page** gives the lesson more room for reading. **Close** returns to the full board.' },
      { x: 96, y: 20.2, name: 'Title and one-line summary', text: 'The idea in one sentence. If you remember nothing else, remember this line. Words with a dotted underline explain themselves: hover or tap them.' },
      { x: 89.5, y: 24.3, name: 'Type and level', text: 'The kind of idea, how advanced it is, and where it sits in its phase.' },
      { x: 89.6, y: 27.8, name: 'Route from matter', text: 'The shortest chain of ideas from the very first concept to this one. Select any step to go back and fill a gap.' },
      { x: 72, y: 35, name: 'Mark as learned', text: 'Press this when you can explain the idea and answer its check question. It turns the pad white and updates **Next up**. Press again to undo.' },
      { x: 93.5, y: 39.4, name: 'Missing prerequisites', text: 'If you skipped ahead, this tells you which earlier concepts you have not learned yet.' },
      { x: 60.3, y: 45.8, name: 'What happens in nature', text: 'The physical story first, before any maths. Read this part slowly.' },
      { x: 34.5, y: 50, name: 'The concept on the board', text: 'The selected pad gets a white ring, and its traces show where it comes from and where it leads.' },
      { x: 34, y: 5.6, name: 'Trace this concept', text: 'Hide the rest of the board and see only this concept and everything behind it.' },
      { x: 38.5, y: 97.7, name: 'Trace key', text: 'Orange traces lead to concepts to learn first, blue to concepts this one unlocks, and pink to related ideas.' },
    ],
  },
  {
    id: 'lesson-body', title: 'Try it, then the maths', file: 'lesson-body.jpg',
    intro: 'Scroll down inside the lesson. Most lessons have a live simulator, and every formula is written out with what each letter means.',
    spots: [
      { x: 60.3, y: 11.7, name: 'Simulator', text: 'A working model of the idea. The animation responds to every change you make.' },
      { x: 70, y: 42.5, name: 'Sliders', text: 'Drag to change one quantity at a time. Predict what will happen **before** you move the slider, then check.' },
      { x: 82, y: 49, name: 'Live readouts', text: 'The numbers the simulator calculates, with the formula it used. Check them by hand with the formulas below.' },
      { x: 66.5, y: 63.9, name: 'The maths', text: 'Each formula with a note on what it is for. You only need to memorise one form; the others come from rearranging.' },
    ],
  },
  {
    id: 'lesson-check', title: 'Practise and check yourself', file: 'lesson-check.jpg',
    intro: 'The end of each lesson is where learning sticks. Do these parts properly, not just read them.',
    spots: [
      { x: 72.5, y: 11.8, name: 'Worked examples', text: 'Real problems. Try each one on paper first.' },
      { x: 72.5, y: 24.2, name: 'Show the first step', text: 'Reveals one step at a time, so you can get a hint without seeing the whole answer.' },
      { x: 69.5, y: 50.8, name: 'Watch out', text: 'The most common mistake or misunderstanding for this idea. Engineers lose hours to these.' },
      { x: 70.5, y: 67, name: 'At the bench', text: 'A small experiment to do with real parts and a multimeter. Doing it is what turns knowledge into skill.' },
      { x: 73.5, y: 83.6, name: 'Check yourself', text: 'A question with an explanation for every answer. If you get it right without looking, mark the concept as learned.' },
    ],
    after: 'Below these are **For EgireRobotics** (how the idea shows up in drones and robots), links to related concepts, and buttons to move to the previous or next concept in the phase.',
  },
  {
    id: 'search', title: 'Search', file: 'search.jpg',
    intro: 'The fastest way to jump to anything. Press **/** or **Ctrl+K** on any page.',
    spots: [
      { x: 68.5, y: 12.1, name: 'Type a word', text: 'Part of a name works, such as "capac" or "mosfet".' },
      { x: 60, y: 19.8, name: 'Results', text: 'Each result shows its one-line summary. Use the arrow keys and **Enter**, or select one, to open its lesson.' },
      { x: 73.5, y: 17.2, name: 'Phase', text: 'Which phase the concept lives in, so you know whether it is a basic or advanced idea.' },
      { x: 90.3, y: 3, name: 'Search button', text: 'The same search, for touch screens.' },
    ],
  },
  {
    id: 'labs', title: 'Labs: every simulator in one place', file: 'labs.jpg',
    intro: 'The 50 simulators from the lessons, grouped by topic. Use Labs to play freely, or to revise an idea quickly.',
    spots: [
      { x: 40.8, y: 10.2, name: 'All labs', text: 'Back to the full list of simulators.' },
      { x: 38.5, y: 22, name: 'The model', text: 'An animated circuit or physical system. Here, moving dots show current flowing round the loop.' },
      { x: 41.2, y: 55.5, name: 'Controls', text: 'Sliders and buttons change the inputs. Try the extremes: very small and very large values teach the most.' },
      { x: 57, y: 61.4, name: 'Readouts', text: 'The results, with the formula used to get each one.' },
      { x: 83.5, y: 66.7, name: 'What to notice', text: 'A short note on what this model shows.' },
      { x: 52, y: 74, name: 'Used in these lessons', text: 'Every lesson that uses this simulator. Select one to read the theory behind it.' },
    ],
  },
  {
    id: 'tools', title: 'Tools: learn your bench instruments', file: 'tools.jpg',
    intro: 'Every tool an electronics engineer uses, from a multimeter to a spectrum analyser. Each page explains what the tool is, why it matters, how to use it, and has a picture of its controls to explore.',
    spots: [
      { x: 48, y: 23.2, name: 'Tags', text: 'What the tool is for, and when to buy it. **Buy first** marks the tools a beginner needs on day one.' },
      { x: 45.5, y: 29.7, name: 'What it is', text: 'The tool in plain words.' },
      { x: 47, y: 46, name: 'Why it matters', text: 'The problems this tool solves on a real bench.' },
      { x: 49, y: 62.2, name: 'Learn the controls', text: 'A drawing of the tool. Select each number to learn what that control does. Further down are step-by-step uses, mistakes to avoid, and a practice task.' },
      { x: 38.9, y: 87.8, name: 'Numbered controls', text: 'Work through them in order, the same way you learn a real instrument.' },
    ],
  },
  {
    id: 'components', title: 'Components: sensors and parts', file: 'components.jpg',
    intro: 'All 300 sensors from the EgireRobotics catalogue, every component family, and the parts to know for FPV drones and AI hardware.',
    spots: [
      { x: 63.4, y: 23.7, name: 'Sections', text: '**Sensors**, **Choosing sensors**, **All component types**, **FPV parts** (ESC, flight controller, radio, ELRS, goggles, VTX, camera, antennas) and **AI hardware**.' },
      { x: 57, y: 29.2, name: 'Find a sensor', text: 'Type a name such as gyroscope or LiDAR.' },
      { x: 93, y: 29.2, name: 'Category', text: 'Show one of the 30 sensor categories at a time.' },
      { x: 57.5, y: 44.8, name: 'Related lessons', text: 'The lessons that explain the physics behind this category of sensor.' },
      { x: 68, y: 53.4, name: 'A sensor', text: 'Select any row to read what the sensor measures, how it works, its interface and typical parts.' },
    ],
  },
  {
    id: 'boards', title: 'Boards: real hardware and software', file: 'boards.jpg',
    intro: 'Development boards (Arduino, ESP32, STM32, Raspberry Pi, Jetson and more), the software to program them, the protocols they talk over, and projects that tie your skills together.',
    spots: [
      { x: 40.8, y: 10.2, name: 'All boards', text: 'Back to the list. The tabs there switch between **Boards**, **Software**, **Protocols** and **Projects**.' },
      { x: 54, y: 25.3, name: 'Tags', text: 'The family of board, and a **Start here** tag on the best first boards.' },
      { x: 48.5, y: 31.9, name: 'Tour the board', text: 'A real photo of the board. Select each number to learn what that part does.' },
      { x: 79, y: 50, name: 'Numbered parts', text: 'Each number is a part on the board: the chip, the USB connector, the regulator, buttons and pins. Further down the page: what the board is good for, its software, and lessons to read first.' },
    ],
  },
  {
    id: 'symbols', title: 'Symbols and datasheets', file: 'symbols.jpg',
    intro: 'Learn to read and draw schematics, and to read a datasheet properly, with real examples from BETAFPV, GEPRC, iFlight and KiCad.',
    spots: [
      { x: 61, y: 23.7, name: 'Sections', text: '**Symbol library**, **Schematic design**, **Reading datasheets** and **Real examples**.' },
      { x: 70.5, y: 29.9, name: 'Find a symbol', text: 'Search by name, such as MOSFET or ground.' },
      { x: 22.5, y: 45.1, name: 'Symbol grid', text: 'Select any symbol to see it large, with its details.' },
      { x: 74.3, y: 30, name: 'Symbol details', text: 'Its reference letter, its name in KiCad, what it is, when to use it, and what to watch out for.' },
      { x: 91.5, y: 93.7, name: 'Open the lesson', text: 'Jump to the full lesson on that component.' },
    ],
  },
  {
    id: 'test', title: 'Self-test', file: 'test.jpg',
    intro: 'Question sets that check whole stages of the course. Answer without looking, then read the explanation.',
    spots: [
      { x: 34.4, y: 21.3, name: 'Choose a question set', text: 'Each set is a short assessment. Start with the foundation set.' },
      { x: 34.4, y: 33.7, name: 'Answer', text: 'Pick an answer. The explanation appears straight away, whether you were right or wrong.' },
      { x: 55, y: 48.9, name: 'Open the lesson', text: 'If you got it wrong, go back to this lesson before moving on.' },
    ],
  },
  {
    id: 'research', title: 'Research the graph', file: 'research.jpg',
    intro: 'Tools for seeing the big picture once you have some experience.',
    spots: [
      { x: 34.4, y: 27.7, name: 'Connect two concepts', text: 'Pick any two concepts and see the shortest chain of ideas that links them, such as quarks to flight controller design.' },
      { x: 34.4, y: 42, name: 'The chain', text: 'Each step in the chain. Select one to open it.' },
      { x: 34.4, y: 74, name: 'Load-bearing concepts', text: 'The concepts that the most other concepts depend on. If you feel weak anywhere, revise these first. Further down you can download the whole graph as data.' },
    ],
  },
]

export interface Stage { n: number; title: string; phases: string; goal: string; use: string; build: string }

export const STAGES: Stage[] = [
  { n: 1, title: 'Foundations', phases: '0 to 5', goal: 'Explain where electricity comes from, what voltage, current and resistance are, and solve simple circuits with Ohm\'s law and Kirchhoff\'s laws.', use: 'Lessons in order, the Ohm\'s law and divider simulators in [Labs](#/labs), [Formulas](#/formulas) and [Laws](#/laws) for revision, and the foundation set in [Self-test](#/test).', build: 'Buy a multimeter and a breadboard. Light an LED with the right resistor, and measure voltage and current around a few resistor circuits.' },
  { n: 2, title: 'Components and circuits', phases: '6 to 10', goal: 'Understand batteries, resistors, capacitors and inductors, analyse any linear circuit, and work with AC and magnetism.', use: 'The RC and AC simulators in [Labs](#/labs), [Symbols](#/symbols) to start reading schematics, and the [multimeter](#/tools/multimeter) and [oscilloscope](#/tools/oscilloscope) pages in Tools.', build: 'Build an RC timer and a voltage divider. Watch a capacitor charge on an oscilloscope.' },
  { n: 3, title: 'Semiconductors and analog', phases: '11 to 13', goal: 'Know how diodes, transistors and MOSFETs really work, and design amplifiers, filters and regulators.', use: '[Components](#/components) for real part families, and the datasheet section of [Symbols](#/symbols) to read MOSFET and regulator datasheets.', build: 'Switch a motor with a MOSFET. Build an op-amp amplifier and a filter, and measure them.' },
  { n: 4, title: 'Digital, power and the bench', phases: '14 to 16', goal: 'Work with logic and state, design PWM and DC-DC converters and motor drives, and measure circuits with confidence.', use: 'All of [Tools](#/tools), the [Components](#/components) pages for ESCs and power parts, and the protocols in [Boards](#/boards/protocols).', build: 'Program your first board from [Boards](#/boards). Drive a motor with PWM, and build a small buck converter.' },
  { n: 5, title: 'Real hardware', phases: '17 and 18', goal: 'Draw a schematic, lay out a PCB, and design the clocks, reset, power and interfaces around a microcontroller.', use: '[Symbols](#/symbols) for schematic design and real FPV datasheets, and [Boards](#/boards) for software stacks, protocols and projects.', build: 'Design and order your own small PCB in KiCad, then bring it up with the bench tools.' },
  { n: 6, title: 'Expert design', phases: '19 and 20', goal: 'Understand chips down to CMOS and fabrication, and design flight controllers, ESCs and AI boards.', use: '[Research](#/research) to find gaps, FPV parts and AI hardware in [Components](#/components), and the advanced projects in [Boards](#/boards/projects).', build: 'Design a flight controller or ESC board of your own, test it, and document it so someone else could build it.' },
]

export const LOOP: string[] = [
  'Read the one-line summary and **What happens in nature**. Say the idea out loud in your own words.',
  'Play with the simulator. Predict what each slider will do before you move it.',
  'Read **The maths**. Check one readout from the simulator by hand.',
  'Try every worked example on paper before revealing the steps.',
  'Read **Watch out**, then do **At the bench** if you have the parts.',
  'Answer **Check yourself** without scrolling up. If you get it right, press **Mark as learned**.',
  'Press **Next up**, or follow a blue trace to a concept this one unlocks.',
]
