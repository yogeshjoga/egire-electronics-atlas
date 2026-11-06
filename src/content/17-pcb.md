@phase 17 | PCB engineering | From schematic to a working board

# pcb-basics: What is a PCB?
kind: concept
level: 1
needs: schematic-symbols, conductors, insulators
> Copper layers bonded to an insulating fibreglass core.

A PCB replaces wires with etched copper. Its layers, from the inside out:

- **FR-4 core:** woven fibreglass in epoxy, the insulator and structure.
- **Copper:** 35 µm thick is called "1 oz", meaning one ounce per square foot.
- **Solder mask:** the coloured coating that stops solder bridging.
- **Silkscreen:** white labels.
- **Surface finish:** HASL or ENIG gold, protecting bare pads.

You are looking at one now: this whole atlas is drawn as a board.

A PCB is itself a circuit element. Each trace has resistance and inductance, and each pair of conductors has capacitance. At low speed you can ignore these. Everything in this phase is about what happens when you can't.

## Math
$$R_\square = \frac{\rho}{t}$$ Sheet resistance: 0.48 mΩ per square for 1 oz copper.

## Example
Q: A trace in 1 oz copper is 1 mm wide and 100 mm long. Find its resistance.
- That is $100/1 = 100$ squares
- $R = 100\times0.48$ mΩ
A: 48 mΩ.

## Check
Q: What does "1 oz copper" refer to?
+ Copper thickness of about 35 µm
- Total board weight
- Trace width
W: One ounce of copper spread over one square foot.

# schematic-capture: Schematic capture
kind: method
level: 1
needs: pcb-basics
> Drawing the electrical design that drives everything else.

Tools such as KiCad and Altium hold symbols, nets and part values. The schematic is the source of truth, and the layout must match it. Run ERC to catch unconnected pins. Add every decoupling capacitor and pull-up here, since the layout will not invent them.

## Engineering
Make it readable: group by function, label nets by purpose, and note voltage and current on power nets. Add test points and spare pads while it's cheap.

## Watch out
Read the reference design and the datasheet's "typical application" before drawing anything. Most first-board failures are missing pull-ups, swapped TX/RX, or a boot pin left floating.

# footprints: Footprints and parts
kind: method
level: 1
needs: schematic-capture
> Physical copper patterns matched to each component's package.

A wrong footprint means a useless board. Check pin 1, pad size and package from the datasheet. Print the layout 1:1, and put real parts on the paper before ordering.

Also check availability: a part that's out of stock halts a build, so select parts your assembler stocks.

| Package | Size (mm) | Hand-solderable? |
|---|---|---|
| 0805 | 2.0 × 1.25 | Easily |
| 0603 | 1.6 × 0.8 | Yes |
| 0402 | 1.0 × 0.5 | With practice |
| QFN | Varies | With hot air |
| BGA | Varies | No, use assembly |

# stackup: Layer stackup
kind: method
level: 2
needs: pcb-basics, capacitor
viz: microstrip
> Order and thickness of copper and dielectric layers.

A typical 4-layer board is signal, ground, power, signal. Keeping a solid ground next to signals gives them a low-inductance return. Cores are pre-cured sheets, and prepreg is the uncured sheet that bonds them. The dielectric thickness sets trace impedance.

Two-layer boards are cheap, but it's hard to keep a good ground plane. For a flight controller or anything above tens of MHz, start at 4 layers.

## Math
$$C = \frac{\varepsilon_0\varepsilon_rA}{d}$$ Plane capacitance.

## Example
Q: Ground and power planes overlap 100 cm², with 0.2 mm of FR-4 ($\varepsilon_r = 4.5$). What is their capacitance?
- $C = (8.854\times10^{-12}\times4.5\times0.01)/(2\times10^{-4})$
A: About 2 nF, a useful low-inductance capacitor at high frequency.

## Check
Q: Why put a ground plane beside the signal layer?
+ It gives each signal a low-inductance return path
- It makes the board stronger
- It raises trace resistance
W: Return current runs in the plane right under the trace, keeping the loop tiny.

# routing: Routing
kind: method
level: 2
needs: footprints, stackup
> Connecting nets with copper, respecting current and return paths.

Layout decides most of a board's performance. **Place first, route second.** Place parts by signal flow: connectors at the edge, noisy power far from sensitive analog, decoupling beside pins. Then route the critical nets first: power, clocks, high-speed.

Avoid crossing gaps in the ground plane. Use 45° corners out of habit and neatness; at normal speeds, their electrical effect is small.

## Watch out
Autorouters ignore return paths and hot loops, so don't trust them for anything that matters.

# vias: Vias
kind: component
level: 2
needs: routing
> Plated holes that carry signals and heat between layers.

A via is a small copper tube. It has resistance, inductance and a current limit. Through vias go through the whole board; blind and buried vias cost much more.

When a signal changes layers, its return current must change planes too. Place a ground via next to each signal via, so the return has a short path.

## Math
$$L \approx 5.08h\left[\ln\frac{4h}{d}+1\right]\ \text{nH}$$ Via inductance, with $h$ and $d$ in inches.
$$R = \frac{\rho h}{\pi dt}$$ Barrel resistance, plating thickness $t$.

## Example
Q: Find the resistance of a 0.3 mm via in a 1.6 mm board with 25 µm plating.
- $A = \pi\times0.3\times0.025 = 0.0236$ mm²
- $R = 1.68\times10^{-8}\times1.6\times10^{-3}/2.36\times10^{-8}$
A: About 1.1 mΩ.
Q: What is the inductance of a via with $h$ = 0.0625 in and $d$ = 0.012 in?
- $\ln(4\times0.0625/0.012) = 3.04$
- $5.08\times0.0625\times4.04$
A: About 1.3 nH. Use several in parallel for high current.

# trace-width: Trace width and current
kind: method
level: 2
needs: routing, joule-heating
viz: trace
> Trace size is set by allowed temperature rise and drop.

Use IPC-2221 or better IPC-2152 to size traces. Outer layers cool better than inner ones, which are buried in fibreglass. High-current paths should usually be pours, not traces.

## Math
$$I = kT_r^{0.44}A^{0.725}$$ IPC-2221, where $A$ is cross-section in mil², $k = 0.048$ outer, $0.024$ inner.

## Example
Q: Roughly what width is needed for 5 A in 1 oz outer copper, with 10 °C rise?
- $A = (5/(0.048\times10^{0.44}))^{1/0.725} \approx 150$ mil²
- $w = 150/1.378$
A: About 110 mil, or 2.8 mm.

## Watch out
A wide trace with a thin neck is limited by the neck. The same applies to a few small vias on a big pour.

# copper-pours: Copper pours and thermal vias
kind: method
level: 2
needs: routing, thermal-design
see: vias
viz: thermal
> Using copper area to spread current and heat.

Copper conducts heat about 1000 times better than FR-4. So copper area on a board acts as a heatsink. Thermal vias under a power part carry heat to inner and bottom layers.

**Thermal relief** spokes on a pad make soldering easier by limiting heat flow, but they add resistance. For high-current pads use a solid connection.

## Example
Q: A 30 mm wide, 60 mm long pour in 2 oz copper carries 40 A. What is the drop?
- Sheet resistance is 0.24 mΩ per square, and there are 2 squares
- $R = 0.48$ mΩ, so $V = 40\times0.00048$
A: About 19 mV, losing 0.77 W.

## EgireRobotics
On an ESC, the MOSFET thermal pads connect through via arrays to all layers. The board itself is the heatsink.

# impedance-control: Controlled impedance
kind: method
level: 3
needs: stackup, transmission-line
viz: microstrip
> Setting trace geometry so a line matches its driver and load.

Trace width, dielectric height and material fix the characteristic impedance. Typical targets are 50 Ω single-ended, and 90 or 100 Ω differential. Fabs tune the process to hit ±10%, if you ask.

A trace on an outer layer is a **microstrip**, and one between planes is a **stripline**.

## Math
$$Z_0 \approx \frac{87}{\sqrt{\varepsilon_r+1.41}}\ln\frac{5.98h}{0.8w+t}$$ Surface microstrip (IPC-2141).

## Example
Q: Find $Z_0$ for $w$ = 0.35 mm, $h$ = 0.2 mm, $t$ = 0.035 mm, $\varepsilon_r$ = 4.3.
- $87/\sqrt{5.71} = 36.4$
- $\ln(1.196/0.315) = 1.33$
A: About 49 Ω.

## Check
Q: What happens to $Z_0$ if the trace gets wider?
+ It falls
- It rises
- It does not change
W: More capacitance to the plane lowers impedance.

# grounding: Grounding and return currents
kind: concept
level: 2
needs: routing, ground-reference, inductor
> Every current returns to its source, along the path of least impedance.

Current flows in loops. At DC, return current spreads out along the lowest resistance. Above a few kHz, inductance dominates, so return current runs directly beneath its signal trace, because this minimises loop area.

Cut the plane under a signal, and the current must detour around the gap, making a big loop that radiates and picks up noise.

Do not route motor current through the same copper as sensor ground, since that voltage drop appears as noise.

## Math
$$V_{\text{bounce}} = L\frac{di}{dt}$$ Ground bounce.

## Example
Q: 100 mA changes in 1 ns through 5 nH of ground path. How much bounce?
- $5\times10^{-9}\times0.1/10^{-9}$
A: 0.5 V, enough to cause false logic levels.

## Watch out
Splitting analog and digital ground planes usually causes more harm than good. Use one solid plane and partition by placement.

## EgireRobotics
A star-point at the battery keeps the heavy ESC current away from your IMU's reference.

## Check
Q: Where does a high-frequency return current flow?
- Along the shortest straight line
+ In the plane directly beneath the signal trace
- Evenly across the plane
W: That path has the smallest loop area, and so the lowest inductance.

# decoupling: Decoupling capacitors
kind: method
level: 2
needs: capacitor, parasitics, grounding
viz: rlc
> Local charge reservoirs that feed fast current spikes.

Chips draw current in nanosecond bursts. Rail inductance can't deliver that, so a local capacitor does. Place 100 nF right beside each power pin, with short vias to ground, plus bulk at the regulators.

Inductance matters more than capacitance. A perfect capacitor on a long trace is useless, because the trace inductance blocks the fast current.

## Math
$$C = \frac{I\,\Delta t}{\Delta V}$$ Size from a current step.
$$Z_{\text{target}} = \frac{\Delta V}{\Delta I}$$ Target impedance of the power network.

## Example
Q: A 100 mA step for 10 ns. What $C$ holds droop to 50 mV?
- $C = 0.1\times10^{-8}/0.05$
A: 20 nF. A 100 nF part leaves margin.

## Check
Q: What most limits a decoupling capacitor at high frequency?
- Its voltage rating
+ The inductance of its package, trace and vias
- Its colour code
W: Above self-resonance, it behaves like an inductor.

# signal-integrity: Signal integrity
kind: concept
level: 3
needs: transmission-line, routing
> Keeping fast edges clean: impedance, reflections, crosstalk.

Edge rate matters more than clock rate. A slow 1 MHz clock from a modern chip can have sub-nanosecond edges. Treat a trace as a transmission line when its delay exceeds about 1/6 of the rise time.

Typical fixes:

- **Reflections:** series resistor at the driver, often 22–33 Ω.
- **Crosstalk:** space traces at least 3× their width.
- **Discontinuities:** avoid stubs and plane gaps.

## Math
$$l_{\text{crit}} \approx \frac{t_r\cdot v}{6}$$ Critical length, $v \approx 15$ cm/ns.

## Example
Q: What's the critical length for a 1 ns edge?
- $1\times15/6$
A: 2.5 cm.

# differential-pairs: Differential pairs
kind: method
level: 3
needs: signal-integrity, impedance-control
see: can-bus, usb-interface
> Two opposite signals that reject noise and radiate less.

The receiver reads the difference between two lines. Noise lands on both equally and cancels. USB, Ethernet, CAN, MIPI and PCIe all use this.

Route the two traces together at constant spacing, and match their lengths, because any skew turns differential signal into common-mode noise.

## Math
$$v_{\text{diff}} = v_+-v_-$$ What the receiver sees.
$$\Delta t \approx 6.7\ \text{ps/mm}$$ Skew from length mismatch on FR-4.

## Example
Q: A pair has 3 mm of mismatch. What's the skew?
- $3\times6.7$
A: About 20 ps.

# emi: EMI and EMC
kind: concept
level: 3
needs: harmonics, grounding, faraday-law
viz: fourier
> Keep noise from leaving your board or getting in.

Noise needs a source, a path and a victim, and removing any one fixes it.

- **Source:** fast $di/dt$ loops and $dv/dt$ nodes. Slow edges where you can.
- **Path:** conducted through wires, or radiated. Filter lines leaving the board, and add ferrites.
- **Victim:** high-gain inputs, GPS, radio. Keep them away, and shield them.

Cables are the most common antennas. Any noise that reaches a cable can radiate well.

## Math
$$E \propto \frac{f^2AI}{r}$$ Radiated field of a small loop.

## EgireRobotics
Buck converter hot loops near a GPS module can desensitise it. Place them apart, and shield the GPS. USB 3 cameras are a well-known source of GPS interference.

## Check
Q: Halving a loop's area changes its radiated field by:
+ A factor of two lower
- Nothing
- A factor of four higher
W: The field is proportional to loop area.

# dfm: Design for manufacture
kind: method
level: 2
needs: routing
> Designing boards that fabs and assemblers can build well.

Follow your fab's rules. Low-cost fabs commonly offer about 0.127 mm trace and space, and 0.3 mm drills; check their current limits. Add fiducials, test points and clear reference designators. Run DRC, then review Gerbers before ordering.

## Watch out
Keep copper and parts away from the board edge, and from mounting holes. Tall parts can block connectors or the enclosure.

# assembly: BOM and assembly
kind: method
level: 2
needs: dfm
see: soldering
> Turning files into built boards: Gerbers, BOM and pick-and-place.

A fab needs Gerbers and drill files. An assembler also needs a bill of materials and a pick-and-place file. Paste is printed through a stencil, parts are placed, then the board goes through a reflow oven.

For a first run, build 5 boards, populate one stage at a time, and keep spares of every part.

## Example
Q: A board has 80 parts, and each joint run has 0.1% chance of a fault. What fraction of boards are fault-free?
- $0.999^{80}$
A: About 92%. Plan for rework.
