# What a schematic is for
A schematic shows **what connects to what**. It is not a picture of the board. Two parts drawn side by side may sit on opposite sides of the PCB.

A good schematic does three jobs:

- It tells the PCB tool which pins connect.
- It tells a human how the circuit works.
- It records every decision: values, ratings and part numbers.

Most people read schematics far more often than they draw them, so write for the reader. That reader may be you, six months from now, with a dead board on the bench.

# Drawing rules that make it readable
| Rule | Why |
|---|---|
| Signals flow left to right | Inputs on the left, outputs on the right, like reading text |
| Higher voltage at the top, ground at the bottom | Current then flows downward, so you can see it |
| Use power and ground symbols, not long wires | Far less clutter |
| Label nets by purpose, such as GYRO_CS or VBAT | The name explains itself |
| Dot means joined; a plain crossing does not | Avoid four-way junctions, which are easy to misread |
| One function per block, with a title | Power, MCU, IMU, motor outputs |
| Keep decoupling capacitors next to the chip they serve | Shows the intent to the layout stage |
| Write a value and rating on every part | 10 µF is not enough; 10 µF 35 V X7R is |

# Reference designators
Each part gets a letter and a number, unique on the board. The letter says what it is: R, C, L, D, Q, U, J, F, Y, SW, TP.

The same labels are printed on the PCB silkscreen and listed in the bill of materials. When you find a burnt part marked Q3, the designator is how you locate it on the schematic.

# Choosing the right symbol
Start from the job, then pick the part.

| What you need | Use | Check in the datasheet |
|---|---|---|
| Limit LED current | Resistor | Power rating |
| Clean up a chip's supply | 100 nF capacitor per pin | Voltage, X7R |
| Absorb motor spikes | Polarised low-ESR capacitor | Voltage, ripple current |
| Switch a load from a 3.3 V pin | N-channel MOSFET | $R_{DS(on)}$ at 2.5 V or 4.5 V |
| Survive a reversed battery | P-channel MOSFET or diode | $V_{DS}$, power |
| Protect a USB connector | Low-capacitance TVS | Clamping voltage |
| Step battery down efficiently | Buck regulator IC | Maximum input, current |
| Make a quiet sensor rail | LDO plus ferrite bead | Dropout, noise |
| Set a default logic level | Pull-up or pull-down resistor | Input leakage |
| Give a probe somewhere to land | Test point | Nothing, just add it |

# Reading a schematic someone else drew
Do not start at the top-left and read every wire. Follow this order instead.

- **Find the power.** Where does it enter, and what makes each rail?
- **Find the brain.** Which chip runs things, and how is it clocked and reset?
- **Follow one signal.** Pick an input and trace it to an output.
- **Check the support parts.** Each small resistor or capacitor has a reason. Ask what breaks if it's removed.

Open-source flight controller schematics are excellent practice. Compare one with [[flight-controller|the blocks a flight controller needs]].

# The KiCad workflow
- **Draw:** place symbols, then wire them and add labels.
- **Annotate:** give every part its designator.
- **Run ERC:** the electrical rules check finds unconnected pins and unpowered rails.
- **Assign footprints:** link each symbol to its physical copper pattern.
- **Update the PCB:** send the netlist to the board editor.
- **Lay out, then run DRC:** the design rules check finds clearance errors.
- **Plot:** make Gerbers, the bill of materials, and placement files.

Every pin in a symbol has a type: input, output, bidirectional, power input, power output, passive and so on. ERC uses these to spot mistakes such as two outputs fighting, or a power input with nothing driving it.

# The most common first-board mistakes
- A symbol's pin numbers do not match the real part.
- TX connected to TX, instead of TX to RX.
- A floating BOOT or reset pin.
- Missing pull-ups on I²C.
- MOSFET gate left floating at power-up.
- Capacitor voltage rating equal to the battery voltage, leaving no margin.
- No test points, and no debug connector.
- Regulator feedback resistors swapped.

Do a slow review before ordering. Print the schematic, and use a highlighter to mark each net as you verify it.
