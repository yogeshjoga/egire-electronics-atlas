@phase 15 | Power electronics | PWM, DC-DC converters and motor drives

# pwm: Pulse-width modulation
kind: method
level: 1
needs: mosfet-switch, frequency
viz: pwm
> Switching fast and varying the on-time sets the average voltage.

Turn a supply on and off quickly. A motor or LED cannot follow each pulse, so it responds to the average. A MOSFET wastes little power at either extreme: when off, no current flows, and when fully on, almost no voltage is dropped. Power is $P = VI$, and at each extreme one of those is nearly zero. That one idea explains why switching beats a linear regulator.

## Engineering
Choosing a frequency is a trade-off.

- **Too low:** you can hear it (below about 20 kHz), and ripple current in the load grows.
- **Too high:** switching loss rises, because each transition wastes energy.

PWM resolution also falls as frequency rises, since a timer has fewer clock ticks per period.

## Math
$$D = \frac{t_{on}}{T}$$ Duty cycle.
$$V_{avg} = DV_{in}$$ Average output.
$$\text{bits} = \log_2\frac{f_{clk}}{f_{PWM}}$$ Timer resolution.

## Example
Q: 12 V at 25% duty. What is the average?
- $0.25\times12$
A: 3 V.
Q: An 84 MHz timer makes 20 kHz PWM. How many steps of resolution does it have?
- $84\times10^6 / 20\times10^3 = 4200$ steps
- $\log_2 4200$
A: 4200 steps, or about 12 bits.

## Watch out
Average voltage is not RMS. A resistive heater at 50% duty receives half the power of full voltage, but an RMS meter reads 70.7% of the voltage, and a cheap averaging meter may show something else again.

## Lab
Drive an LED from an MCU PWM pin through 330 Ω. Sweep the duty and view the pin on a scope. Then lower the frequency until you can see the flicker, usually below about 60 Hz.

## Check
Q: Why does a PWM switch waste so little power?
+ It is either carrying current with almost no voltage, or has voltage with no current
- Its frequency cancels the losses
- The load returns the energy
W: Dissipation is V × I in the switch, and one of the two is nearly zero in each state.

# smps-idea: Why switching converters?
kind: concept
level: 2
needs: pwm, inductor, capacitor, linear-regulator
viz: buck, regulator
> Move energy in packets through an inductor, rather than burning it.

A chopped voltage alone is useless to a chip, which needs steady DC. So a switching converter adds an inductor and capacitor. The inductor stores energy in its magnetic field while the switch is on, and releases it while the switch is off. The capacitor smooths what is left.

The key rule is **volt-second balance**. In steady state the inductor current ends each cycle where it began, so the average voltage across the inductor must be zero. Every converter equation comes from this rule.

| | Linear | Switching |
|---|---|---|
| Efficiency | $V_{out}/V_{in}$ | 85–97% |
| Noise | Very low | Needs care |
| Step up? | No | Yes |
| Parts | 3 | 6 or more |

## Math
$$\langle v_L\rangle = 0$$ Volt-second balance.
$$V_{on}t_{on} = V_{off}t_{off}$$ The same statement as two areas.

## Check
Q: In steady state, what is the average voltage across an ideal inductor?
+ Zero
- The input voltage
- The output voltage
W: If it were not zero, the inductor current would climb forever.

# buck: Buck converter
kind: component
level: 2
needs: smps-idea
viz: buck
> Steps voltage down efficiently.

Switch on: the inductor sits between input and output, its current ramps up, and it feeds the load. Switch off: the inductor keeps its current flowing through a diode or low-side MOSFET, ramping down.

Applying volt-second balance: $(V_{in}-V_{out})D = V_{out}(1-D)$, which simplifies to $V_{out} = DV_{in}$.

The input current is a chopped square wave, so the input capacitor sees large ripple current. The output current is smooth, because the inductor sits on that side.

## Engineering
The most important layout feature is the **hot loop**: input capacitor, high-side switch, low-side switch, and back. Its current switches abruptly, so that loop must be as small as you can make it. See [[emi]].

## Math
$$V_{out} = DV_{in}$$ Ideal transfer.
$$\Delta I_L = \frac{(V_{in}-V_{out})D}{Lf_{sw}}$$ Inductor ripple.
$$\Delta V = \frac{\Delta I_L}{8Cf_{sw}}$$ Output ripple from capacitance.
$$I_{C_{in},RMS} = I_{out}\sqrt{D(1-D)}$$ Input capacitor ripple current.

## Example
Q: 22.2 V to 5 V at 500 kHz, with 30% ripple on 3 A. Find L.
- $D = 0.225$, $\Delta I = 0.9$ A
- $L = (17.2\times0.225)/(0.9\times5\times10^5)$
A: 8.6 µH; use 10 µH.
Q: Using 0.9 A ripple at 500 kHz, what capacitive ripple does 22 µF give?
- $\Delta V = 0.9/(8\times22\times10^{-6}\times5\times10^5)$
A: About 10 mV, before adding ESR.
Q: What RMS ripple current must the input capacitor take at 3 A and $D = 0.225$?
- $3\sqrt{0.225\times0.775}$
A: About 1.25 A. Check this against the capacitor's rating.

## Watch out
Design for the full battery range. A 6S pack spans about 18 to 25.2 V, so duty cycle and ripple change across a flight. Worst-case inductor ripple occurs at the highest input voltage.

## Lab
Build a module-based buck and probe the switch node with a short ground spring. Measure output ripple with the scope on AC coupling and 20 MHz bandwidth limit. Compare efficiency at light and full load.

## EgireRobotics
Your BEC is usually a buck. A 6S battery to a 5 V rail has to be switched, not linear.

## Check
Q: An ideal buck has 24 V in and 25% duty. What is the output?
+ 6 V
- 12 V
- 96 V
W: V_out = D × V_in.

# boost: Boost converter
kind: component
level: 2
needs: smps-idea
viz: buck
> Steps voltage up by stacking inductor energy on top of the input.

Switch on: the inductor charges from the input, while the output capacitor alone feeds the load. Switch off: the inductor's voltage adds to the input, and it pushes current through a diode into the output.

Since power is conserved, higher output voltage means higher input current. That input current can be much larger than the output current.

## Engineering
A boost is harder to control than a buck. It has a right-half-plane zero: asking for more output first takes energy away from the output, because the switch stays on longer. So the control loop must stay slow.

A plain boost also has no way to disconnect the load. With the switch off, there is still a path from input to output through the inductor and diode.

## Math
$$V_{out} = \frac{V_{in}}{1-D}$$ Ideal transfer.
$$I_{in} = \frac{I_{out}}{1-D}$$ Input current is higher.
$$\Delta I_L = \frac{V_{in}D}{Lf_{sw}}$$ Inductor ripple.

## Example
Q: 3.7 V to 5 V. What is the duty?
- $1-D = 3.7/5$
A: $D = 0.26$.
Q: With that duty, 2.2 µH and 1 MHz, what is the ripple?
- $\Delta I = (3.7\times0.26)/(2.2\times10^{-6}\times10^{6})$
A: About 0.44 A.

## Check
Q: A boost makes 12 V at 1 A from 6 V. Ignoring loss, what is the input current?
- 0.5 A
- 1 A
+ 2 A
W: Power in equals power out: 12 W at 6 V is 2 A.

# sync-rectification: Synchronous rectification
kind: method
level: 2
needs: buck, mosfet-switch
> Replacing the freewheeling diode with a MOSFET to cut loss.

In a low-output buck, the freewheeling diode conducts for most of the cycle, and its drop of about 0.5 V is a large fraction of the output voltage. A low-side MOSFET has only resistive drop, so the loss falls dramatically.

The price is complexity, as the controller must never turn both switches on together. See [[gate-driver|dead time]].

## Math
$$P_{\text{diode}} = V_FI(1-D)$$ Schottky freewheeling loss.
$$P_{\text{FET}} = I^2R_{DS(on)}(1-D)$$ Synchronous loss.

## Example
Q: Compare a 0.5 V Schottky with a 10 mΩ MOSFET, at 3 A and $D = 0.225$.
- Diode: $0.5\times3\times0.775 = 1.16$ W
- MOSFET: $9\times0.01\times0.775 = 0.07$ W
A: The MOSFET wastes about 16 times less.

# power-stage-design: Choosing converter parts
kind: method
level: 3
needs: buck, parasitics
see: decoupling
viz: buck
> Selecting the inductor, capacitors and switches for a real design.

Follow a fixed order.

- **Inductor:** pick for 20–40% ripple. Its saturation current must exceed peak current, with margin. Compare DCR for copper loss.
- **Output capacitor:** sets ripple and load-step response. Use ceramics for low ESR, and remember [[capacitor|DC bias loss]].
- **Input capacitor:** rated for ripple current, and placed right at the switches.
- **Switches:** $V_{DS}$ rating at least 1.3–1.5× maximum input, for ringing.

## Math
$$I_{pk} = I_{out}+\frac{\Delta I_L}{2}$$ Peak inductor current.
$$\Delta V_{ESR} = \Delta I_L\times\text{ESR}$$ Ripple from capacitor resistance.

## Example
Q: 3 A load, 0.9 A ripple, output capacitor ESR of 5 mΩ. Find the peak current and ESR ripple.
- $I_{pk} = 3+0.45$
- $\Delta V = 0.9\times0.005$
A: 3.45 A peak, so pick $I_{sat}$ of 4.5 A or more. ESR ripple is 4.5 mV.

## Watch out
Inductors are rated two ways. $I_{sat}$ is where inductance collapses, and $I_{rms}$ is where it overheats. A datasheet's headline current may be the kinder of the two.

# converter-control: Converter control loops
kind: concept
level: 3
needs: buck, feedback, bode
> Feedback adjusts duty cycle to hold the output steady.

An error amplifier compares the output with a reference, and a modulator turns the error into duty cycle. The output L and C form a second-order filter with a resonant peak, so the loop needs compensation.

- **Voltage mode:** duty is set directly from voltage error.
- **Peak current mode:** the switch turns off when inductor current reaches a target. Simpler to compensate, and it gives cycle-by-cycle current limiting.

Set the crossover around a tenth of the switching frequency, with 45–60° of phase margin. Too low and load steps droop; too little margin and the output rings.

## Math
$$f_0 = \frac{1}{2\pi\sqrt{LC}}$$ Output filter resonance.
$$f_c \approx \frac{f_{sw}}{10}$$ Typical loop crossover.

## Example
Q: Find the output filter resonance for 10 µH and 22 µF.
- $\sqrt{LC} = \sqrt{2.2\times10^{-10}} = 1.48\times10^{-5}$
A: About 10.7 kHz.

## Lab
Step a load on and off with a MOSFET and a resistor while watching the output on a scope. Ringing that takes many cycles to settle points to a low phase margin.

# gate-driver: Gate drivers
kind: component
level: 2
needs: mosfet-switch
viz: deadtime
> Amplifiers that charge a MOSFET's gate capacitance quickly.

A MOSFET gate is a capacitor. To turn on quickly, it must be filled with charge $Q_g$ in nanoseconds. An MCU pin sources only milliamps, so a driver supplies amps for a moment.

High-side N-channel MOSFETs have a further problem: their source rises to battery voltage, so the gate must go above the battery. A **bootstrap** capacitor charges while the low side is on, then rides up with the switch node to supply the gate.

**Dead time** is a short gap when both switches are off. Without it, one switch turns on before the other turns off, shorting the supply, which is called **shoot-through**.

## Engineering
A gate resistor sets switching speed. Faster means less switching loss but more ringing and EMI. Separate turn-on and turn-off paths let you tune both, and a resistor from gate to source holds the MOSFET off during power-up.

## Math
$$I_{pk} \approx \frac{Q_g}{t_{sw}}$$ Peak gate current.
$$P_{gate} = Q_gV_{drv}f_{sw}$$ Gate drive power.
$$C_{boot} \ge \frac{Q_g}{\Delta V}$$ Bootstrap capacitor size.

## Example
Q: 60 nC gate, switched in 30 ns. What current?
- $60\times10^{-9}/30\times10^{-9}$
A: 2 A.
Q: With 60 nC and at most 0.5 V bootstrap droop, what capacitance is needed?
- $C = 60\times10^{-9}/0.5$
A: 120 nF at the minimum. Designers use 220 nF to 1 µF.

## Watch out
A bootstrap capacitor recharges only while the low side is on, so a driver cannot normally hold the high side on at 100% duty.

## Check
Q: What does dead time prevent?
- Gate oxide breakdown
+ Both half-bridge switches conducting at once
- Inductor saturation
W: That condition, shoot-through, shorts the supply through the two MOSFETs.

# h-bridge: H-bridge
kind: component
level: 2
needs: gate-driver, dc-motor
viz: deadtime
> Four switches that drive a load in either direction.

Close one diagonal pair and current flows one way; close the other pair and it reverses. Close both low-side switches and the motor brakes, as its back-EMF drives current through itself. Close both on one side and you short the supply.

## Engineering
When switches turn off, the motor inductance keeps current flowing, through the body diodes.

- **Fast decay:** current flows back into the supply. This can raise the supply voltage, so keep a bulk capacitor.
- **Slow decay:** current circulates through the low side.

## Check
Q: Which switches must never close together in an H-bridge?
+ The high and low switches on the same side
- The two high-side switches
- The diagonal pair
W: High and low on the same leg form a direct short across the supply.

# current-sensing: Current sensing
kind: method
level: 2
needs: opamp-circuits, power-formulas
see: pdb
> Measuring current with shunts, amplifiers or magnetic sensors.

A **shunt** is a small resistor in the current path, and $V = IR$ gives a voltage to amplify. Its value is a compromise: bigger gives more signal, but more heat.

- **Low side:** easy, as the signal is near ground, but it disturbs the ground and can't see shorts to ground.
- **High side:** sees all faults, and needs an amplifier that tolerates high common-mode voltage.
- **Hall sensor:** isolated with almost no loss, but noisier and more prone to offset drift.

## Engineering
Use **Kelvin** sensing: route two separate traces from the shunt's pads to the amplifier. Otherwise the solder and copper resistance adds to your measurement.

## Math
$$V_s = IR_s$$ Shunt voltage.
$$P_s = I^2R_s$$ Shunt dissipation.

## Example
Q: A 0.5 mΩ shunt carries 100 A. Find the voltage and the heat.
- $V = 100\times0.0005$
- $P = 100^2\times0.0005$
A: 50 mV and 5 W. The shunt needs a real power rating.

## EgireRobotics
A current sensor on the battery lead gives you mAh used, which is a much better fuel gauge than voltage under load.

# esc: Electronic speed controllers
kind: system
level: 3
needs: h-bridge, bldc, pwm
see: esc-design
viz: esc
> Three half-bridges commutating a brushless motor.

An ESC is six MOSFETs, gate drivers, a small MCU and bulk capacitors. It has to know where the rotor is, and it has no sensor for this. Instead, it watches the undriven phase, where the back-EMF crosses zero at a known rotor angle.

## Engineering
Six-step commutation energises two of three phases at a time, in six electrical sectors per cycle. An electrical cycle occurs once per pole pair. Speed is set by PWM on top of commutation.

Starting is the hard part. At standstill there is no back-EMF to read, so the ESC blindly spins the field until the signal appears. Heavy props and low throttle make that stage unreliable, which is called desync.

## Math
$$f_{elec} = \frac{\text{rpm}}{60}\cdot\frac{p}{2}$$ Electrical frequency for $p$ poles.
$$E_{bemf} \approx \frac{\text{rpm}}{K_v}$$ Back-EMF, line to line.

## Example
Q: 12,000 rpm with 14 poles. What is the electrical frequency?
- $200\times7$
A: 1400 Hz.
Q: A 920 Kv motor spins at 9,200 rpm. What is the back-EMF?
- $9200/920$
A: About 10 V. Only the difference from battery voltage drives current through the windings.

## Watch out
Motor current and battery current differ. At partial throttle, the ESC acts like a buck, so phase current can be far above battery current. Size the MOSFETs for phase current.

## Check
Q: How does a sensorless ESC find rotor position?
- A Hall sensor in the motor
+ Back-EMF on the undriven phase
- The gyro
W: The floating phase's zero crossing marks the rotor angle.

# foc: Field-oriented control
kind: method
level: 3
needs: esc, phasor, current-sensing
see: control-loop
viz: esc
> Sine-wave motor drive that controls torque directly.

Six-step jumps the field in 60° steps, which produces torque ripple. FOC drives smooth sine currents, keeping the stator field at exactly 90° to the rotor, where torque per amp is highest.

Its trick is mathematical. Three AC phase currents are transformed into a frame rotating with the rotor, where they become two DC values:

- $i_q$: makes torque.
- $i_d$: makes no torque, so it is normally held at zero.

Now simple PI controllers can regulate DC values. The same [[phasor]] idea of removing rotation makes the problem easy.

## Math
$$i_\alpha = i_a,\quad i_\beta = \frac{i_a+2i_b}{\sqrt3}$$ Clarke transform.
$$i_d = i_\alpha\cos\theta+i_\beta\sin\theta$$ Park transform, d axis.
$$i_q = -i_\alpha\sin\theta+i_\beta\cos\theta$$ Park transform, q axis.
$$\tau \propto i_q$$ Torque follows the q current.

## EgireRobotics
FOC gives quieter, more efficient motors and smooth low-speed control, which is valuable for gimbals. It needs phase current sensing and a faster MCU than simple six-step.

# thermal-design: Thermal design
kind: method
level: 2
needs: power-formulas
see: reliability
viz: thermal
> Heat flows through thermal resistances, just like current through resistors.

The thermal circuit is Ohm's law in another domain: temperature is voltage, heat is current, and °C/W is resistance. Keep the junction below its maximum, usually 125–150 °C.

Heat leaves by conduction (through copper and heatsinks), convection (to moving air), and radiation (minor at these temperatures). Short loads also benefit from **thermal mass**, which lets a part absorb a burst before getting hot.

## Engineering
$\theta_{JA}$ on datasheets assumes a standard test board, and your board will differ. For power parts, use $\theta_{JC}$ and calculate your own path, using copper pours and [[copper-pours|thermal vias]].

## Math
$$T_j = T_a+P(\theta_{JC}+\theta_{CS}+\theta_{SA})$$ Thermal resistance stack.
$$\Delta T = \frac{Pt}{mc}$$ Temperature rise of a thermal mass, short bursts.

## Example
Q: 3 W, 40 °C/W total, and 45 °C ambient. Find the junction temperature.
- $T_j = 45+3\times40$
A: 165 °C, too hot. Add copper area or a heatsink.

## EgireRobotics
Drones get strong airflow in flight, but none on the ground. ESCs and AI computers that survive a flight can overheat on the bench.

## Check
Q: In the thermal analogy, what does power correspond to?
+ Current
- Voltage
- Resistance
W: Heat flow is the through variable; temperature difference is the across variable.

# efficiency: Efficiency and loss budgets
kind: method
level: 2
needs: power, buck
viz: regulator
> Every watt lost is heat you must also get rid of.

Add up each loss source, and you'll see what to fix.

| Loss | Grows with |
|---|---|
| MOSFET conduction | $I^2$ |
| Switching | $V$, $I$, $f_{sw}$ |
| Gate drive | $f_{sw}$ |
| Inductor copper | $I^2$ |
| Inductor core | Ripple, $f_{sw}$ |
| Controller quiescent | Fixed |

So efficiency drops at light load, where fixed losses dominate, and at heavy load, where $I^2$ losses dominate.

## Math
$$\eta = \frac{P_{out}}{P_{in}}$$ Efficiency.
$$P_{\text{loss}} = P_{out}\left(\frac1\eta-1\right)$$ Loss from efficiency.

## Example
Q: A 30 W load runs at 90% efficiency. How much loss?
- $30(1/0.9-1)$
A: 3.33 W.

## Lab
Measure input and output voltage and current at 10%, 50% and 100% load, using separate meters. Plot the curve and find the peak.

# heat-transfer-laws: Laws of heat transfer
kind: law
level: 2
needs: thermal-design, heat-temperature
see: copper-pours, wiedemann-franz
> Fourier, Newton and Stefan–Boltzmann: how heat leaves your board.

- **Fourier's law:** conduction through a solid.
- **Newton's law of cooling:** convection into moving air.
- **Stefan–Boltzmann law:** radiation, rising with the fourth power of absolute temperature.

## Math
$$\dot Q = \frac{kA\Delta T}{d}$$ Fourier conduction.
$$\dot Q = hA\Delta T$$ Newton's law of cooling.
$$P = \varepsilon\sigma A(T_1^4-T_2^4)$$ Stefan–Boltzmann radiation, with $\sigma = 5.67\times10^{-8}\ \text{W/m}^2\text{K}^4$.

## Example
Q: How much heat flows along 1 oz copper 10 mm wide and 20 mm long, with a 10 °C difference?
- $A = 10\ \text{mm}\times35\ \mu\text{m} = 3.5\times10^{-7}$ m²
- $400\times3.5\times10^{-7}\times10/0.02$
A: About 0.07 W. Thin copper needs width and vias to move real heat.
Q: A 100 cm² black surface sits at 60 °C in 25 °C air. How much does it radiate? ($\varepsilon$ = 0.9)
- $0.01\times0.9\times5.67\times10^{-8}\times(333^4-298^4)$
A: About 2.3 W.

## EgireRobotics
Airflow raises $h$ many times over, which is why ESCs that are fine in flight overheat on the bench.

# buck-boost: Buck-boost and isolated converters
kind: component
level: 3
needs: buck, boost, transformer
> Topologies that go up, down, or across an isolation barrier.

A buck only steps down and a boost only steps up. Sometimes the input crosses the output. A single Li-ion cell runs from 4.2 V down to about 3 V, yet you may want a steady 3.3 V, so you need both.

- **Inverting buck-boost:** simple, but the output is negative.
- **SEPIC:** a positive output above or below the input.
- **Four-switch buck-boost:** efficient, and used in many modern chips.
- **Flyback and forward:** add a transformer for isolation, as in phone chargers.

## Math
$$V_{out} = -V_{in}\frac{D}{1-D}$$ Inverting buck-boost.

## Example
Q: What duty gives $-12$ V from a 12 V input?
- $12 = 12\times D/(1-D)$
- $D = 1-D$
A: $D = 0.5$.

## Check
Q: When do you need a buck-boost rather than a buck?
+ When the input can go above or below the output
- When the input is always higher
- When the load is very small
W: A buck can only step down.
