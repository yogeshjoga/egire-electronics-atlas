@phase 12 | Semiconductor components | Diodes, Zeners, BJTs and MOSFETs

# diode: Diodes
kind: component
level: 1
needs: junction-bias, non-ohmic
viz: pn
> A one-way valve for current with a forward voltage drop.

A diode conducts from anode to cathode above a forward voltage: about 0.6–0.7 V for silicon. In reverse, it blocks until breakdown.

Its uses: rectifying AC, reverse-polarity protection, clamping spikes, and as flyback protection across coils.

## Engineering
Forward voltage falls by about 2 mV per °C. The drop also wastes power at high current, so look at $P = V_FI$ before you use one for reverse-polarity protection.

## Math
$$I = I_S\left(e^{V/nV_T}-1\right)$$ Shockley diode equation.
$$V_T = \frac{kT}{q} \approx 26\ \text{mV}$$ Thermal voltage.

## Example
Q: How much must $V$ rise to multiply a diode's current by 10?
- $\ln10\times26$ mV (with $n=1$)
A: About 60 mV. This is why forward drop seems almost fixed.

## Watch out
A diode has no built-in current limit. Connect one directly across a supply in forward bias, and it will burn.

## Lab
Sweep a diode with a 1 kΩ series resistor and a variable supply. Plot current against voltage, and find the knee.

## Check
Q: A silicon diode's forward voltage is typically:
- 0.1 V
+ 0.7 V
- 5 V
W: 0.6–0.7 V at moderate current; Schottky is 0.2–0.4 V.

# rectifier: Rectifiers
kind: method
level: 1
needs: diode, ac-intro, capacitor
viz: rectifier
> Diodes that turn AC into pulsing DC, smoothed by a capacitor.

A half-wave rectifier passes one half of the cycle. A full-wave bridge flips the negative half. A reservoir capacitor fills in between peaks.

## Math
$$V_{\text{dc}} \approx V_p - 2V_F$$ Peak output of a bridge.
$$\Delta V \approx \frac{I}{2fC}$$ Ripple of full-wave rectification.

## Example
Q: A 1 A load on 50 Hz, with a 4700 µF reservoir. What's the ripple?
- $\Delta V = 1/(2\times50\times0.0047)$
A: About 2.1 V.

## Check
Q: Why does a bridge rectifier lose about 1.4 V?
+ Current passes through two diodes
- The capacitor absorbs it
- The transformer limits it
W: Two forward drops of about 0.7 V are in the path.

# zener: Zener diodes
kind: component
level: 2
needs: diode
see: tunneling
> Designed to break down at a precise reverse voltage.

A Zener holds a near-constant reverse voltage when biased past breakdown. It is used as a simple reference or a clamp.

## Math
$$R = \frac{V_{in}-V_Z}{I_Z+I_L}$$ Series resistor sizing.

## Example
Q: Make 5.1 V from 12 V for a 10 mA load, keeping 5 mA in the Zener.
- $R = (12-5.1)/0.015$
A: 460 Ω.

## Check
Q: How is a Zener diode connected to regulate voltage?
+ Reverse biased
- Forward biased
- In series with no resistor
W: It works at its reverse breakdown, with a resistor limiting current.

# schottky: Schottky diodes
kind: component
level: 2
needs: diode
> A metal-semiconductor junction with low drop and fast switching.

With no minority-carrier storage, a Schottky turns off quickly and drops only 0.2–0.4 V, at the cost of greater reverse leakage. They are used widely in switch-mode power and OR-ing of supplies.

## EgireRobotics
Two Schottky diodes combine USB and battery power, so the higher one feeds the board. This is called diode OR-ing.

# led: LEDs
kind: component
level: 1
needs: diode, photon
> A junction that emits a photon when electrons cross the gap.

Electrons fall across the band gap and release its energy as a photon, so the gap sets colour. Current must be limited by a resistor, because the LED's own resistance is near zero above $V_F$.

| Colour | Approx $V_F$ |
|---|---|
| Red | 1.8–2.2 V |
| Green | 2.0–3.2 V |
| Blue/White | 3.0–3.4 V |

## Math
$$\lambda = \frac{hc}{E_g}$$ Wavelength from band gap.
$$R = \frac{V_s-V_F}{I_F}$$ Current-limiting resistor.

## Lab
Breadboard a red LED on 5 V with 330 Ω, then measure the voltage across each part. Check that they add up to 5 V.

## Check
Q: Why does an LED need a series resistor?
+ Its current rises steeply above V_F, so it must be limited
- It needs a voltage boost
- To change its colour
W: Without limiting, current runs away and destroys it.

# photodiode: Photodiodes and solar cells
kind: component
level: 2
needs: diode, photon
> A junction where absorbed photons generate current.

Each photon above the band gap creates an electron-hole pair, and the junction field separates them. Solar cells extract power; photodiodes measure light, in reverse bias.

## Lab
Reverse-bias a photodiode through a 100 kΩ resistor on 3.3 V, and watch the voltage as you shade it.

# bjt: Bipolar junction transistors
kind: component
level: 2
needs: junction-bias
viz: bjt
> A small base current controls a much larger collector current.

Two junctions back to back: NPN or PNP. Forward-biasing base-emitter injects carriers across a thin base, and most reach the collector. So a tiny $I_B$ controls a large $I_C$.

| Region | Use |
|---|---|
| Cut-off | Off switch |
| Active | Amplifier |
| Saturation | On switch |

Why does so little base current control so much? Electrons are injected from the emitter into a very thin base. Only a few recombine there, which is what the base current replaces. The rest are swept across into the collector.

## Math
$$I_C = \beta I_B$$ Current gain, typically 100–300.
$$I_E = I_C + I_B$$ KCL on the device.
$$I_C = I_Se^{V_{BE}/V_T}$$ Exponential transfer.
$$g_m = \frac{I_C}{V_T}$$ Transconductance.

## Example
Q: A relay needs 100 mA. With $\beta = 100$, what base resistor from 3.3 V?
- $I_B = 1$ mA, and use 2× overdrive: 2 mA
- $R_B = (3.3-0.7)/0.002$
A: 1.3 kΩ.

## Watch out
Base current must be limited with a resistor, since the base-emitter is a forward-biased diode. $\beta$ varies widely between parts, so good designs don't depend on its exact value.

## Lab
Build a transistor switch to turn on an LED from an MCU pin. Measure base and collector current, and calculate the actual $\beta$.

## Check
Q: A BJT has β of 100 and 50 µA base current, in its active region. What is the collector current?
+ 5 mA
- 50 mA
- 0.5 mA
W: I_C = β I_B = 100 × 50 µA.

# mosfet: MOSFETs
kind: component
level: 2
needs: junction-bias, capacitor, electric-field
see: cmos-inverter
viz: mosfet
> Gate voltage creates a conductive channel. Essentially no DC gate current.

Metal, Oxide, Semiconductor. The gate is a capacitor plate. Applying enough voltage draws electrons to the surface of P-type silicon, inverting it and forming an N-type channel between source and drain.

Voltage-controlled, with an insulated gate, MOSFETs are the most manufactured object in history, with more than $10^{22}$ made.

## Engineering
N-channel parts conduct better than P-channel, because electrons are more mobile. So P-channel devices are bigger for the same resistance. Power MOSFETs use vertical structures with thousands of cells in parallel.

## Math
$$I_D = \tfrac12k(V_{GS}-V_{th})^2$$ Saturation region.
$$I_D = k\left[(V_{GS}-V_{th})V_{DS}-\tfrac12V_{DS}^2\right]$$ Triode region.
$$g_m = k(V_{GS}-V_{th})$$ Transconductance.

## Watch out
Gates are easily destroyed by static, as the oxide is so thin. Never leave a gate floating; it can drift on and overheat.

## Lab
Connect a logic-level N-MOSFET as a low-side switch for an LED strip. Measure $V_{DS}$ and work out its real on-resistance.

## Check
Q: What controls a MOSFET?
+ Gate voltage
- Base current
- Drain temperature
W: The gate is insulated; only voltage matters, apart from charging its capacitance.

# mosfet-switch: MOSFET as a switch
kind: method
level: 2
needs: mosfet
see: gate-driver, esc
viz: mosfet
> Fully on, it acts like a tiny resistor. Fully off, it's an open circuit.

For power, a MOSFET lives at the two ends: off, or fully enhanced with low $R_{DS(on)}$. Losses come from conduction and switching.

$V_{GS(th)}$ on a datasheet is only where it starts to conduct. Look for $R_{DS(on)}$ at your actual gate drive.

## Math
$$P_{\text{cond}} = I^2R_{DS(on)}$$ Conduction loss.
$$P_{\text{sw}} \approx \tfrac12VI(t_r+t_f)f_{sw}$$ Switching loss.
$$I_g = \frac{Q_g}{t}$$ Gate current for a switching time.

## Example
Q: 30 A through 3 mΩ. What is the conduction loss?
- $P = 900\times0.003$
A: 2.7 W, which needs real copper area to shed.

## Watch out
A MOSFET rated $V_{GS(th)}$ = 2 V is not "on" at 2.5 V. Check $R_{DS(on)}$ at your gate voltage. With a 3.3 V MCU, select a logic-level part specified at 2.5 V or 4.5 V.

## EgireRobotics
ESC MOSFETs are chosen by $R_{DS(on)}$, gate charge and voltage rating. These fight each other, so it's a balance.

## Check
Q: Where does a power MOSFET lose most power in a slow-switching circuit?
+ In conduction, I²R
- In the gate oxide
- In the package label
W: Switching loss matters at high frequency; conduction dominates at low frequency.

# body-diode: MOSFET body diode
kind: concept
level: 2
needs: mosfet
see: h-bridge, sync-rectification
> A built-in diode from source to drain in every power MOSFET.

The way a power MOSFET is built creates a diode that conducts from source to drain. So a MOSFET blocks in only one direction. It is useful in motor drives, where it carries current in the dead time, but it's slow and drops about 1 V.

## Engineering
Two MOSFETs back to back block in both directions. A P-channel MOSFET in the supply line with its body diode oriented forward gives reverse-polarity protection, with less loss than a diode.

## Check
Q: Why can't one MOSFET block voltage in both directions?
+ Its body diode conducts in reverse
- The gate shorts
- Silicon is one-way
W: The internal diode bypasses the channel in one direction.

# tvs-diode: TVS diodes
kind: component
level: 2
needs: zener
see: static-electricity, fuses-protection
> A fast clamp that absorbs voltage spikes.

A TVS diode does nothing at normal voltage. A spike pushes it into avalanche in less than a nanosecond, clamping the voltage and dumping the energy. It's a Zener built for huge short pulses.

Use small ones on USB and data lines, and big ones across a battery rail.

## Watch out
Three voltages matter: standoff (normal), breakdown, and clamping. Clamping voltage at peak current can be well above standoff, so check that your parts survive it.

# igbt: IGBTs
kind: component
level: 3
needs: mosfet, bjt
> A MOSFET input with a BJT output, for high voltages.

An IGBT is voltage-controlled like a MOSFET, but carries current like a BJT, with a drop of 1.5 to 2 V. At several hundred volts it beats silicon MOSFETs, so it dominates EV drives and industrial motors. It switches slowly, though, and SiC MOSFETs are now taking over.
