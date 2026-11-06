@phase 13 | Analog electronics | Amplifiers, op-amps, filters, regulators and data conversion

# amplifier: Amplifiers
kind: concept
level: 2
needs: bjt, mosfet, logarithms-db
> Uses a small signal to control a larger power supply.

An amplifier adds no energy to a signal; it uses the signal to steer energy from the supply. Key specifications are gain, bandwidth, input and output impedance, noise and distortion.

An amplifier has input impedance and output impedance, as well as gain. For a voltage amplifier you want high input impedance, so it doesn't load the source, and low output impedance, so it can drive its load.

## Math
$$A_v = \frac{v_{out}}{v_{in}}$$ Voltage gain.
$$A_{\text{dB}} = 20\log_{10}|A_v|$$ Gain in dB.

## Check
Q: Where does an amplifier's extra output power come from?
+ The power supply
- The input signal
- The transistor's mass
W: The input steers energy drawn from the supply.

# common-emitter: Common-emitter amplifier
kind: method
level: 3
needs: amplifier, thevenin, superposition
> The classic single-transistor amplifier.

A divider biases the base; DC sets the operating point, and the signal rides on it. Output is inverted. An emitter resistor trades gain for stability.

## Math
$$A_v \approx -g_mR_C$$ Without emitter degeneration.
$$A_v \approx -\frac{R_C}{R_E}$$ With an emitter resistor.

## Example
Q: $I_C$ = 1 mA and $R_C$ = 4.7 kΩ. Find the gain with no emitter resistor.
- $g_m = 1\ \text{mA}/26\ \text{mV} = 38.5$ mS
- $A_v = -0.0385\times4700$
A: About −181.

## Lab
Build one on a breadboard with a 1 kHz signal of 10 mV, and compare input and output on a scope. Note the inversion.

# feedback: Negative feedback
kind: concept
level: 2
needs: amplifier
see: control-loop
> Feeding output back to reduce error trades gain for accuracy.

Subtract a fraction of the output from the input, and an amplifier corrects itself. Its gain then depends on stable resistors rather than variable transistors. Bandwidth, linearity and noise rejection all improve. With too much phase shift, it oscillates instead.

## Math
$$A_{cl} = \frac{A}{1+A\beta}$$ Closed-loop gain.
$$A_{cl} \approx \frac1\beta$$ When $A\beta\gg1$.

## Example
Q: Open-loop gain is $10^5$, and $\beta$ = 0.01. Find the closed-loop gain.
- $A_{cl} = 10^5/(1+1000)$
A: 99.9, nearly exactly $1/\beta$ = 100.

## Check
Q: Open-loop gain halves. What happens to a closed-loop gain of 100?
+ It barely changes
- It halves
- It doubles
W: With high loop gain, the result depends on the resistors.

# opamp: Operational amplifiers
kind: component
level: 2
needs: feedback
viz: opamp
> A very high-gain differential amplifier, tamed by feedback.

An op-amp amplifies the difference between its inputs by about $10^5$ or more. With negative feedback, two golden rules apply:

- Inputs draw no current.
- The output does whatever makes the two inputs equal.

Real limits include supply rails, offset voltage, slew rate and gain-bandwidth product.

## Math
$$v_o = A(v_+-v_-)$$ Open-loop behaviour.
$$\text{GBW} = A_{cl}\times f$$ Bandwidth trade-off.
$$\text{SR} = 2\pi fV_p$$ Slew rate needed for a sine wave.

## Example
Q: A 1 MHz GBW op-amp is set for a gain of 100. What is the bandwidth?
- $f = 10^6/100$
A: 10 kHz.

## Watch out
An op-amp's output can't always reach its supply rails. Check for "rail-to-rail" parts on low supplies. Input common-mode range also limits you.

## Check
Q: With negative feedback, what do the two inputs do?
+ They sit at nearly equal voltages
- They differ by the supply voltage
- They draw large currents
W: The output moves to make the difference almost zero.

# opamp-circuits: Op-amp circuits
kind: method
level: 2
needs: opamp
viz: opamp
> Inverting, non-inverting, summing and differential configurations.

## Math
$$A = -\frac{R_f}{R_{in}}$$ Inverting amplifier.
$$A = 1+\frac{R_f}{R_g}$$ Non-inverting amplifier.
$$v_o = -R_f\left(\frac{v_1}{R_1}+\frac{v_2}{R_2}\right)$$ Summing amplifier.
$$v_o = \frac{R_2}{R_1}(v_2-v_1)$$ Difference amplifier.

## Example
Q: Current sensing: 0.5 mΩ shunt at 100 A, to 3 V full scale. What gain?
- $V_{\text{shunt}} = 50$ mV
- $A = 3/0.05$
A: 60, a common current-sense amplifier setting.

## Lab
Build a non-inverting amplifier with gain 11, using 10 kΩ and 1 kΩ. Feed in a small sine, and increase it until clipping starts.

## EgireRobotics
Current sensors and battery monitors use these exact circuits to scale signals into an ADC's range.

## Check
Q: What is the gain of a non-inverting amplifier with Rf = 9 kΩ and Rg = 1 kΩ?
+ 10
- 9
- −9
W: 1 + 9k/1k = 10.

# active-filter: Active filters
kind: method
level: 3
needs: opamp-circuits, bode
viz: filter
> Op-amps with RC networks give sharper filters without inductors.

A Sallen-Key stage is a second-order filter, falling 40 dB per decade. Butterworth gives a maximally flat response, Chebyshev a sharper one with ripple, and Bessel a clean time response.

## Math
$$f_c = \frac{1}{2\pi\sqrt{R_1R_2C_1C_2}}$$ Sallen-Key corner.

## Check
Q: How fast does a second-order filter roll off?
+ 40 dB per decade
- 20 dB per decade
- 3 dB per decade
W: Each order adds 20 dB per decade.

# comparator: Comparators
kind: component
level: 2
needs: opamp
> Output snaps high or low depending on which input is greater.

Unlike op-amps, comparators work open-loop. Hysteresis stops chatter around the threshold, using positive feedback.

## Math
$$V_{hys} \approx V_{out}\frac{R_1}{R_1+R_2}$$ Hysteresis width from positive feedback.

## Example
Q: A 3.3 V swing with 10 kΩ and 1 MΩ feedback. Find the hysteresis.
- $3.3\times10^4/1.01\times10^6$
A: About 33 mV.

## EgireRobotics
Comparators give very fast over-current trips in ESCs, faster than firmware could respond.

# linear-regulator: Linear regulators and LDOs
kind: component
level: 2
needs: opamp, zener, mosfet
viz: regulator
> A pass device burns the excess voltage as heat.

A feedback loop steers a pass transistor to hold output steady. They are quiet, simple and cheap, but all excess voltage is heat. LDOs just need a smaller headroom.

## Engineering
Good regulators reject supply noise, called PSRR. Output capacitors matter, as some LDOs need a specified ESR to remain stable.

## Math
$$P = (V_{in}-V_{out})I$$ Dissipation.
$$\eta \approx \frac{V_{out}}{V_{in}}$$ Efficiency.
$$T_j = T_a+P\,\theta_{JA}$$ Junction temperature.

## Example
Q: A linear regulator drops 12 V to 3.3 V at 0.5 A. What is the waste?
- $P = 8.7\times0.5$
A: 4.35 W, and only 27.5% efficiency. Use a buck, then an LDO.

## Check
Q: Where does a linear regulator's extra voltage go?
+ It is burned as heat
- It is stored
- It returns to the battery
W: P = (V_in − V_out) × I.

# voltage-reference: Voltage references
kind: component
level: 3
needs: linear-regulator, bjt
> A very stable voltage that everything else is measured against.

A bandgap reference adds a voltage that falls with heat ($V_{BE}$) to one that rises with it ($V_T$), cancelling temperature drift and giving around 1.2 V, close to silicon's band gap.

## Engineering
An ADC is only as accurate as its reference. A 1% reference error is a 1% measurement error, however many bits you have.

# noise: Electronic noise
kind: concept
level: 3
needs: resistor, amplifier
> Random fluctuations that set the floor on any measurement.

Thermal noise comes from the random motion of electrons in any resistor. Shot noise comes from charge being discrete. 1/f noise dominates at low frequencies.

## Math
$$v_n = \sqrt{4kTRB}$$ Johnson–Nyquist thermal noise.
$$v_{total} = \sqrt{v_1^2+v_2^2}$$ Adding uncorrelated noise.

## Example
Q: Find the noise of 1 kΩ across 10 kHz at 300 K.
- $v_n = \sqrt{4(1.38\times10^{-23})(300)(1000)(10^4)}$
A: About 0.41 µV RMS.

## Watch out
Noise adds as power, so uncorrelated noise sources add as root-sum-squares. The first stage of an amplifier chain sets most of the total, as later noise isn't amplified as much.

## EgireRobotics
Noise is why your IMU needs a clean rail. A noisy rail appears as a noisy gyro.

# oscillator: Oscillators
kind: component
level: 2
needs: feedback, resonance
> Positive feedback at one frequency makes a steady signal.

When loop gain is 1 with 0° phase (Barkhausen), a circuit sustains its own oscillation. Quartz crystals are mechanical resonators with a Q around $10^4$ to $10^6$, giving parts-per-million accuracy.

## Math
$$A\beta = 1\angle0°$$ Barkhausen criterion.

## Lab
Build a 555 timer astable with 10 kΩ and 100 nF, and view the output on a scope.

## Check
Q: What sets a crystal oscillator's accuracy?
+ The very high Q of its mechanical resonance
- The supply voltage
- The size of the MCU
W: Quartz vibrates at a very precise frequency.

# sampling: Sampling and Nyquist
kind: concept
level: 2
needs: frequency, harmonics
viz: adc
> Sample at more than twice the highest frequency, or it aliases.

Sampling turns a continuous signal into numbers. If the sample rate is too low, high frequencies disguise themselves as low ones. That false signal is **aliasing**, and after sampling you can't remove it.

## Engineering
So, filter first. An **anti-aliasing filter** before the ADC removes frequencies above half the sample rate. Software can't fix this after sampling.

## Math
$$f_s > 2f_{\max}$$ Nyquist criterion.
$$f_{\text{alias}} = |f-kf_s|$$ Where an out-of-band tone appears.

## Example
Q: A 900 Hz vibration is sampled at 1 kHz. Where does it appear?
- $|900-1000|$
A: At 100 Hz, right in the control band of a drone.

## Check
Q: What is the minimum sample rate for a signal up to 1 kHz?
+ Above 2 kHz
- Above 1 kHz
- Above 500 Hz
W: Nyquist: more than twice the highest frequency.

# adc: Analog-to-digital converters
kind: component
level: 2
needs: sampling, comparator, binary
viz: adc
> Converts a voltage into a number.

SAR ADCs do a binary search with a comparator. Sigma-delta gives high resolution, flash gives high speed.

## Math
$$\text{LSB} = \frac{V_{ref}}{2^N}$$ Step size.
$$\text{SNR} = 6.02N+1.76\ \text{dB}$$ Ideal quantisation limit.

## Example
Q: Find the step size of a 12-bit ADC with a 3.3 V reference.
- $3.3/4096$
A: 0.81 mV.

## Check
Q: How many levels does a 10-bit ADC have?
+ 1024
- 100
- 10
W: 2¹⁰ = 1024.

# dac: Digital-to-analog converters
kind: component
level: 2
needs: binary, opamp-circuits
> Converts a number into a voltage.

R-2R ladders use only two resistor values; PWM plus a low-pass filter is the cheap alternative.

## Math
$$V_{out} = V_{ref}\frac{D}{2^N}$$ Ideal output.

## Example
Q: A 12-bit DAC with a 3.3 V reference gets code 2048. What's the output?
- $3.3\times2048/4096$
A: 1.65 V.

# loop-stability: Stability and phase margin
kind: concept
level: 3
needs: feedback, bode
see: converter-control, control-loop
> Feedback becomes oscillation if the loop's delay is too large.

Negative feedback relies on the correction arriving in time. Every stage adds phase lag. If the signal returns 180° late with gain still above 1, negative feedback has become positive, and the loop oscillates.

**Phase margin** is how far you are from that. Aim for 45–60°. Too little gives ringing.

## Math
$$\text{PM} = 180°+\angle T(f_c)$$ Phase margin at crossover, where $|T| = 1$.

## Check
Q: What does low phase margin look like on a scope?
+ Ringing after a step
- A perfectly flat line
- A slow drift
W: The loop is near oscillation, so it overshoots.

# instrumentation-amp: Instrumentation amplifiers
kind: component
level: 3
needs: opamp-circuits
see: current-sensing
> Precise amplification of tiny differences between two signals.

Three op-amps form a high-input-impedance difference amplifier with one gain resistor. It rejects common-mode noise and suits bridge sensors such as load cells.

## Math
$$G = 1+\frac{2R}{R_g}$$ Gain.

## Example
Q: $R$ = 25 kΩ and $R_g$ = 1 kΩ. Find the gain.
- $1+50$
A: 51.

## EgireRobotics
A load cell thrust stand gives millivolts, so it needs one of these before the ADC.

# current-mirror: Current mirrors
kind: method
level: 3
needs: bjt, mosfet
> One transistor's current is copied into another.

Two matched transistors share the same gate or base voltage, so they carry the same current. Chips use these everywhere for biasing, since matched transistors are easy on one die, while precise resistors are not.

## Math
$$I_{out} = I_{ref}\frac{(W/L)_2}{(W/L)_1}$$ Ratio set by device sizes.

# pll: Phase-locked loops
kind: component
level: 3
needs: oscillator, feedback
see: clock-tree
> A feedback loop that makes a fast clock from a slow one.

A voltage-controlled oscillator is divided down and compared with a reference. If it's early or late, the error adjusts its voltage, until they are locked. The output is then $N$ times the reference.

## Math
$$f_{out} = Nf_{ref}$$ Locked output frequency.

## Example
Q: 8 MHz reference with $N$ = 21. What's the output?
- $21\times8$
A: 168 MHz.
