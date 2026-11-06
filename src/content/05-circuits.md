@phase 5 | Circuit fundamentals | Paths, series, parallel and what goes wrong

# circuit: What is a circuit?
kind: concept
level: 1
needs: current, voltage
viz: ohm
> A closed path through which current can flow.

A basic circuit needs four things: a power source, a conducting path, an electrical load, and a complete path for current to return.

Charge is not used up. Every electron that leaves the source returns to it. What the load uses is **energy**.

## Check
Q: Compared with the current entering a lamp, the current leaving it is:
- Smaller, as the lamp uses it up
+ The same
- Larger
W: Charge is conserved. The lamp takes energy, not electrons.

# open-short: Open, closed and short circuits
kind: concept
level: 1
needs: circuit, ohms-law
> Closed works, open stops, and short is dangerous.

| Condition | Meaning |
|---|---|
| Closed circuit | Complete conducting path |
| Open circuit | Broken path; no sustained current |
| Short circuit | Unintended low-impedance path |

A short leaves almost no resistance, so $I = V/R$ becomes huge and is limited only by wire and battery internal resistance.

## Example
Q: A LiPo with 0.01 Ω total resistance is shorted at 16.8 V. Roughly what current flows?
- $I = 16.8/0.01$
A: About 1680 A: instant wire melting and a risk of battery fire.

## EgireRobotics
Always power a new board through a current-limited bench supply or a smoke stopper first.

# schematic-symbols: Reading schematics
kind: method
level: 1
needs: circuit
see: schematic-capture
> The language of circuits: symbols show connection, not physical position.

A schematic shows what connects to what, and nothing about physical position. Learn to read it the way you read a map.

| Designator | Part |
|---|---|
| R | Resistor |
| C | Capacitor |
| L | Inductor |
| D | Diode |
| Q | Transistor |
| U | IC |
| J | Connector |

Signals flow left to right, with higher voltage at the top. A dot means wires join; a plain crossing does not.

See every symbol, with when to use it, on the [Symbols page](#/symbols).

# series: Series circuits
kind: concept
level: 1
needs: circuit, kvl
viz: series-parallel
> One path: the same current flows through every part, and voltages add.

Components connected end to end form a series circuit. Since there is one path, current is the same throughout. The source voltage divides across the parts.

## Math
$$R_T = R_1 + R_2 + R_3$$ Total resistance.
$$V_T = V_1 + V_2 + V_3$$ Voltages add.
$$I_T = I_1 = I_2 = I_3$$ Same current.

## Example
Q: 10 Ω, 20 Ω and 30 Ω are in series on 12 V. Find the current and each voltage drop.
- $R_T = 10+20+30 = 60\ \Omega$
- $I = 12/60 = 0.2$ A
- $V_1 = 2$ V, $V_2 = 4$ V, $V_3 = 6$ V
A: 0.2 A. Check: $2+4+6 = 12$ V.

## Watch out
Series strings fail as a unit. One open part stops everything.

# parallel: Parallel circuits
kind: concept
level: 1
needs: circuit, kcl
viz: series-parallel
> Same two nodes: every branch sees the same voltage, and currents add.

Components across the same two nodes form a parallel circuit. Each new branch is another path, so total resistance **falls**.

## Math
$$V_T = V_1 = V_2 = V_3$$ Same voltage.
$$I_T = I_1 + I_2 + I_3$$ Currents add.
$$\frac{1}{R_T} = \frac1{R_1}+\frac1{R_2}+\frac1{R_3}$$ Equivalent resistance.
$$R_T = \frac{R_1R_2}{R_1+R_2}$$ For two resistors.

## Example
Q: 10 Ω and 10 Ω are in parallel. What is the total?
- $R_T = (10\times10)/(10+10)$
A: $R_T = 5\ \Omega$, smaller than either resistor.

## EgireRobotics
All four ESCs sit in parallel across the battery. Each sees full pack voltage, and the battery supplies the sum of their currents.

## Check
Q: Two 10 Ω resistors in parallel have a total resistance of:
- 20 Ω
- 10 Ω
+ 5 Ω
- 100 Ω
W: Equal resistors in parallel: R/2.

# mixed-circuits: Series-parallel networks
kind: method
level: 1
needs: series, parallel
viz: series-parallel
> Simplify step by step, then work back out.

Find a group that is purely series or purely parallel, replace it with one resistor, and repeat until a single value is left. Then work backwards to find each branch's current and voltage.

## Example
Q: 4 Ω in series with (6 Ω ∥ 3 Ω) on 12 V. Find the total current.
- $6\parallel3 = 18/9 = 2\ \Omega$
- $R_T = 4+2 = 6\ \Omega$
A: $I = 12/6 = 2$ A.

# wire-sizing: Wire sizing and voltage drop
kind: method
level: 1
needs: resistivity, joule-heating, series
viz: wire
> Wires are resistors. Size them for both heat and voltage drop.

Real wires have resistance in series with your load. Current through them drops voltage and makes heat. AWG is the common scale: a smaller number is a thicker wire.

| AWG | Area (mm²) | Ω per m | Typical drone use |
|---|---|---|---|
| 10 | 5.26 | 0.0033 | Main battery lead, heavy lift |
| 12 | 3.31 | 0.0052 | Battery lead |
| 14 | 2.08 | 0.0083 | ESC power |
| 16 | 1.31 | 0.0132 | ESC power, small quad |
| 22 | 0.33 | 0.0530 | Signals, low current |

## Math
$$V_{\text{drop}} = 2 I\rho\frac{L}{A}$$ Round trip, out and back.

## Example
Q: 40 A flows through 0.2 m of 12 AWG, out and back. What is the drop?
- $R = 2\times0.2\times0.0052 = 0.00208\ \Omega$
- $V = 40\times0.00208$
A: 0.083 V, wasting 3.3 W.

# fuses-protection: Fuses and protection
kind: component
level: 1
needs: open-short, joule-heating
see: bms
> Components that deliberately fail or trip to save everything else.

A fuse is a designed weak link: Joule heating melts it before the wires overheat. Other protection includes:

- **PTC resettable fuse:** resistance jumps when hot.
- **TVS diode:** clamps fast voltage spikes.
- **Reverse-polarity MOSFET:** blocks a backwards battery.
- **Circuit breaker:** a mechanical, resettable fuse.

## Engineering
Pick a fuse by normal current with margin, voltage rating, and breaking capacity. It protects the wire, so size it to the wire.

# switches-relays: Switches and relays
kind: component
level: 1
needs: circuit
see: mosfet-switch
> Mechanical ways to open and close a circuit.

SPST is a simple on/off; SPDT chooses between two paths. A relay is a switch moved by an electromagnet, so a small current controls a big one, with full isolation.

Mechanical contacts bounce for a few milliseconds, which a microcontroller reads as many presses. Software handles this by debouncing.

## Watch out
Relay coils are inductors. Switching them off creates a voltage spike, so add a flyback diode. See [[inductor]].
