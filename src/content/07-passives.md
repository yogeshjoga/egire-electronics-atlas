@phase 7 | Passive components | Resistors, capacitors, inductors and their time behaviour

# resistor: Resistors
kind: component
level: 1
needs: ohms-law, power-formulas
viz: ohm
> The component that sets current and voltage on purpose.

Resistors limit current, divide voltage, set bias, pull signals to known levels and terminate lines. Three numbers matter: resistance, tolerance and power rating.

Common SMD sizes are 0402, 0603 and 0805. Standard values follow E-series like E12 (10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82).

Inside a typical chip resistor is a thin film of resistive material on a ceramic base, trimmed by laser to its exact value. Three everyday jobs are worth learning to spot: limiting current, dividing voltage, and setting a default logic level.

## Example
Q: Find the resistor for a red LED ($V_F=2$ V, 10 mA) on 5 V.
- $R = (5-2)/0.01$
A: 300 Ω; use the 330 Ω standard value.

## Watch out
A resistor's power rating assumes cool surroundings. Keep it under about half its rating, because a part at full rating runs very hot.

## Lab
Measure ten "identical" 1 kΩ resistors with a meter, and look at how they spread within their tolerance.

## Check
Q: What range can a 10 kΩ 1% resistor be?
+ 9.9 kΩ to 10.1 kΩ
- 9 kΩ to 11 kΩ
- Exactly 10 kΩ
W: 1% of 10 kΩ is 100 Ω either way.

# resistor-codes: Resistor codes
kind: method
level: 1
needs: resistor
viz: resistor-code
> Reading value from colour bands or SMD numbers.

Through-hole bands give two digits, a multiplier and a tolerance. SMD parts use three digits: 472 is $47\times10^2$ = 4.7 kΩ.

The usual digits: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9.

## Example
Q: Read yellow, violet, red, gold.
- Digits 4 and 7, multiplier $10^2$
A: 4.7 kΩ ±5%.

## Check
Q: What does an SMD code of 103 mean?
+ 10 kΩ
- 103 Ω
- 1.03 kΩ
W: 10 × 10³ = 10 kΩ.

# dielectric: Dielectrics and polarisation
kind: concept
level: 2
needs: electric-field, insulators
> Insulators weaken an applied field by aligning their charges.

Placed in a field, the atoms of an insulator stretch into small dipoles, which partly cancel the field. That lets a capacitor store more charge at a given voltage. The factor is the relative permittivity $\varepsilon_r$.

| Material | $\varepsilon_r$ |
|---|---|
| Air | 1.0 |
| FR-4 | About 4.5 |
| SiO₂ | 3.9 |
| Ceramic (X7R) | 2000+ |

## Engineering
Dielectrics with very high $\varepsilon_r$ are unstable. Their value shifts with voltage and temperature. That is the trade-off between stable C0G and compact X7R capacitors.

## Math
$$C = \varepsilon_rC_0$$ A dielectric raises capacitance by $\varepsilon_r$.

## Check
Q: What does a dielectric do in a capacitor?
+ Increases capacitance by partly cancelling the field
- Conducts charge between the plates
- Makes the plates thicker
W: Aligned dipoles reduce the field, so more charge fits at the same voltage.

# capacitor: Capacitors
kind: component
level: 1
needs: electric-field, voltage, derivative
see: dielectric
viz: rc
> Stores energy in an electric field. Resists sudden voltage change.

Two conductors separated by an insulator. Charge piled on one plate pushes equal charge off the other. Current appears to pass, though no electron crosses the gap.

It takes time to change voltage, so a capacitor smooths voltage. At DC, once charged, it acts as an open circuit. At high frequencies it acts almost as a short.

## Math
$$C = \frac{Q}{V}$$ Capacitance, in farads.
$$C = \frac{\varepsilon_0\varepsilon_r A}{d}$$ Parallel plates.
$$i = C\frac{dv}{dt}$$ Current through a capacitor.
$$E = \tfrac12CV^2$$ Stored energy.

## Example
Q: How much energy is in a 1000 µF capacitor at 25 V?
- $E = \tfrac12(1000\times10^{-6})(25^2)$
A: 0.31 J.

## Watch out
Electrolytics are polarised, and they can burst if reversed. Ceramic capacitors lose much of their capacitance at DC bias: a 10 µF X5R may be 4 µF at rated voltage.

## Lab
Charge a 100 µF capacitor through 10 kΩ from 5 V, and time how long it takes to reach 3.16 V. It should be about one second, which is one time constant.

## EgireRobotics
A low-ESR capacitor at each ESC's power input absorbs voltage spikes from motor switching.

## Check
Q: In steady-state DC, an ideal capacitor behaves like:
+ An open circuit
- A short circuit
- A resistor
W: Once dv/dt = 0, i = C dv/dt = 0.

# capacitor-networks: Capacitors in series and parallel
kind: method
level: 1
needs: capacitor, series, parallel
> The rules are the reverse of resistors.

Parallel adds plate area, so capacitance adds. Series adds spacing, so it falls.

## Math
$$C_T = C_1 + C_2$$ Parallel.
$$\frac1{C_T} = \frac1{C_1} + \frac1{C_2}$$ Series.

## Example
Q: Find the total of 10 µF and 22 µF, first in parallel, then in series.
- Parallel: $10+22$
- Series: $(10\times22)/(10+22)$
A: 32 µF in parallel, and 6.9 µF in series.

# capacitor-types: Capacitor types
kind: component
level: 2
needs: capacitor, dielectric
> Ceramic, electrolytic, tantalum and film. Each has a role.

| Type | Range | Best for |
|---|---|---|
| Ceramic C0G | pF to nF | Timing, RF |
| Ceramic X7R | nF to µF | Decoupling |
| Aluminium electrolytic | µF to mF | Bulk energy |
| Polymer | µF to mF | Low ESR rails |
| Tantalum | µF | Compact bulk, surge-sensitive |
| Film | nF to µF | Audio, high voltage |

## Watch out
Solid tantalum capacitors can fail short and burn when hit by surges, so derate them to about half their voltage. Ceramic capacitors can crack if the board flexes.

## Check
Q: Which type suits a 32 MHz timing circuit best?
+ Ceramic C0G
- Aluminium electrolytic
- Ceramic X7R with high bias
W: C0G holds its value over voltage and temperature.

# inductor: Inductors
kind: component
level: 2
needs: magnetic-field, current, derivative
see: faraday-law
viz: rc
> Stores energy in a magnetic field. Resists sudden current change.

A coil of wire. Current builds a magnetic field; changing that field induces a voltage that opposes the change. So inductors smooth current the way capacitors smooth voltage.

At DC an ideal inductor is a wire. Try to stop its current suddenly and it produces a large voltage spike.

## Engineering
The spike when you switch off an inductor is dangerous to transistors. A flyback diode across a relay coil or motor gives the current a safe path. The same spike is put to good use in a boost converter.

## Math
$$v = L\frac{di}{dt}$$ Inductor voltage, in henries.
$$E = \tfrac12LI^2$$ Stored energy.
$$L = \frac{\mu N^2A}{l}$$ Solenoid inductance.

## Example
Q: Current in a 10 µH inductor changes 2 A in 1 µs. What voltage appears?
- $v = (10\times10^{-6})(2/10^{-6})$
A: 20 V.

## Watch out
Saturation: above a certain current the core gives up and inductance collapses. Always check $I_{sat}$.

## Lab
Connect a relay coil with a switch, and view it on a scope, first with a flyback diode, then carefully without. Use a low supply voltage, and a 10× probe.

## EgireRobotics
Motor windings are inductors. That is why ESCs need diodes or body diodes, and why cutting power can kick the battery rail upward.

## Check
Q: What physical quantity can't change instantly in an inductor?
- Voltage
+ Current
- Resistance
W: An instant change in i would need infinite voltage.

# rc-transient: RC time constant
kind: concept
level: 2
needs: capacitor, resistor, diff-eq
viz: rc
> A capacitor charges through a resistor along an exponential curve.

At the start, an uncharged capacitor acts like a short and draws maximum current. As it charges, the voltage across R falls, and so does the current, slowing the charge.

| Time | Charged |
|---|---|
| $1\tau$ | 63.2% |
| $2\tau$ | 86.5% |
| $3\tau$ | 95.0% |
| $5\tau$ | 99.3% |

## Math
$$\tau = RC$$ Time constant.
$$v_C(t) = V_s(1-e^{-t/\tau})$$ Charging.
$$v_C(t) = V_0e^{-t/\tau}$$ Discharging.

## Example
Q: How long until 10 kΩ and 100 nF is essentially settled?
- $\tau = 10^4\times10^{-7} = 1$ ms
- $5\tau = 5$ ms
A: About 5 ms. This is a typical MCU reset delay.

## Lab
Feed a square wave into 10 kΩ and 10 nF. Set the period to about 10 τ, then watch the exponential edges on a scope.

## EgireRobotics
RC filters clean noisy button signals and analog sensors. Choose τ longer than the noise, but shorter than the signal you care about.

## Check
Q: What share is reached after one time constant?
+ 63%
- 50%
- 100%
W: 1 − e⁻¹ ≈ 0.632.

# rl-transient: RL time constant
kind: concept
level: 2
needs: inductor, resistor, diff-eq
viz: rc
> Current through an inductor builds along an exponential curve.

The inductor starts by blocking changes in current. Current builds up to $V/R$ over about $5\tau$.

## Math
$$\tau = \frac{L}{R}$$ Time constant.
$$i(t) = \frac{V}{R}(1-e^{-t/\tau})$$ Current rise.

## Example
Q: Find τ and final current for 10 mH and 10 Ω on 5 V.
- $\tau = 0.01/10$
- $I = 5/10$
A: 1 ms, and 0.5 A.

## Check
Q: What does a larger resistance do to an RL time constant?
+ Shortens it
- Lengthens it
- Nothing
W: τ = L/R. This is the opposite of RC.

# parasitics: Real components: parasitics
kind: concept
level: 3
needs: capacitor, inductor
see: decoupling
viz: rlc
> Every real part contains hidden R, L and C.

Real capacitors have series resistance (ESR) and inductance (ESL), so above self-resonance they act as inductors. Real inductors have winding resistance (DCR) and capacitance. Even a trace has inductance, roughly 1 nH per mm.

## Math
$$f_{SRF} = \frac{1}{2\pi\sqrt{\text{ESL}\cdot C}}$$ Self-resonant frequency.

## Example
Q: 100 nF with 1 nH ESL. Where is its self-resonance?
- $f = 1/(2\pi\sqrt{10^{-9}\times10^{-7}})$
A: About 16 MHz. Above that, it is an inductor.

## Check
Q: Above its self-resonant frequency, a capacitor behaves like:
+ An inductor
- A bigger capacitor
- An open circuit
W: Its lead and package inductance takes over.

# potentiometer: Potentiometers and trimmers
kind: component
level: 1
needs: resistor, voltage-divider
> A resistor with a sliding contact, giving an adjustable divider.

A potentiometer has a resistive track and a wiper that slides along it. Connected as three terminals, it is an adjustable [[voltage-divider]]. With two terminals, it is a variable resistor, also called a rheostat.

Audio knobs and joysticks use them. Small trimmers set a value once at the factory.

## Math
$$V_{out} = V_{in}\frac{x}{100\%}$$ Output at wiper position $x$, unloaded.

## Lab
Connect a 10 kΩ potentiometer across 3.3 V, feed its wiper into an MCU ADC, and print the value.

# ferrite-bead: Ferrite beads
kind: component
level: 2
needs: inductor, impedance
see: emi, decoupling
> A lossy inductor that turns high-frequency noise into heat.

A ferrite bead has low resistance at DC, yet high impedance at about 100 MHz. Unlike an inductor, it is resistive at those frequencies, so it burns noise as heat instead of storing it.

They are used to isolate a quiet analog rail from a noisy digital one.

## Watch out
DC current partly saturates the core, so impedance falls well below the headline figure. Check the curve at your real current. A bead with capacitors can also ring.
