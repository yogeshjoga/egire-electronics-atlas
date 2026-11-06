@phase 16 | Measurement and testing | Your bench: seeing what the circuit really does

# lab-safety: Bench safety
kind: method
level: 1
needs: voltage, current
> Start isolated, low-voltage, and current-limited. Always.

Current through the body is what harms, and voltage is what pushes it through skin. As little as tens of milliamps across the chest can stop a heart. Dry skin may resist many kilohms, but wet skin far less.

Key rules:

- Never experiment on Indian mains directly.
- Begin with isolated, current-limited low-voltage DC supplies.
- Treat LiPo packs as energetic devices, charge them in a fire-safe bag, and never leave them charging unattended.
- Discharge big capacitors before touching them.
- Wear eye protection when soldering and clipping.
- Remove props before powering a drone on the bench.

## Math
$$I = \frac{V}{R_{\text{body}}}$$ Ohm's law applies to you.

## Example
Q: 230 V is applied across 1 kΩ of wet-skin body resistance. What current flows?
- $I = 230/1000$
A: 230 mA, well into the lethal range. This is why mains is off-limits.

## Check
Q: What should you do first when bench-testing a drone's motors?
+ Remove the propellers
- Fully charge the battery
- Raise the current limit
W: Spinning props cause serious injuries, and a firmware bug can start them unexpectedly.

# breadboard: Breadboards
kind: method
level: 1
needs: circuit
> Build circuits without soldering.

Rows of five holes connect internally, and side rails carry power. Breadboards are good for low-frequency experiments. Their stray capacitance (a few pF per row) and contact resistance rule them out for fast or high-current circuits.

## Watch out
Some long breadboards split their power rails halfway. If half your circuit is dead, check the rail with a meter first.

## Lab
Use your meter's continuity mode to map which holes are joined. Doing this once saves hours later.

# multimeter: Digital multimeter
kind: method
level: 1
needs: voltage, current, resistance
viz: multimeter
> Measures voltage, current and resistance. Learn this first.

- **Voltage:** in parallel, across the part.
- **Current:** in series, with the circuit broken and probes in the A jack.
- **Resistance:** power off, part out of circuit if possible.
- **Continuity:** beeps for a short; the fastest debug tool.

A meter disturbs what it measures. In voltage mode it looks like about 10 MΩ. In current mode it adds a small resistance, called **burden voltage**, which can matter for low-voltage circuits.

Cheap meters assume a sine wave for AC. A **true RMS** meter is needed for square or distorted waveforms.

## Math
$$R_{\text{seen}} = R\parallel R_{\text{meter}}$$ Loading of a voltage measurement.

## Example
Q: Two 1 MΩ resistors divide 10 V. A 10 MΩ meter reads across the lower one. What does it show?
- $R_{\text{low}} = 1\text{M}\parallel10\text{M} = 909$ kΩ
- $V = 10\times909/(1000+909)$
A: 4.76 V rather than 5 V. High-impedance nodes are affected by the meter.

## Watch out
Measuring voltage while the probe is in the current jack is a short circuit through the meter.

## Check
Q: How do you connect an ammeter?
+ In series with the load
- In parallel with the load
- Across the battery
W: All the current must flow through it, and it has near-zero resistance, so across a supply it would be a short.

# bench-supply: Regulated bench supply
kind: method
level: 1
needs: ideal-sources
viz: supply
> A source with a settable voltage and current limit.

A bench supply runs in one of two modes. In **constant voltage**, it holds your set voltage. If the load tries to draw more than your current limit, it switches to **constant current**, and the voltage falls to whatever gives the limit.

Set voltage first, then the current limit just above what you expect. If a board is shorted, the supply folds back and nothing burns. This is the best protection for a first power-on.

## Example
Q: A supply is set to 12 V and limited to 0.1 A. What happens with a 50 Ω load?
- At 12 V the load would draw 0.24 A, above the limit
- The supply holds 0.1 A, so $V = 0.1\times50$
A: It enters constant current, and output falls to 5 V.

## Check
Q: The CC light comes on as soon as you power a new board. What does that suggest?
+ The board draws more than the limit, possibly a short
- The board is working perfectly
- The supply is broken
W: Stop and look for a short before raising the limit.

# oscilloscope: Oscilloscope
kind: method
level: 2
needs: frequency
viz: scope
> Plots voltage against time. It lets you see a signal.

A meter gives one number; a scope gives you the shape. Learn four controls: volts per division, time per division, trigger, and coupling.

The **trigger** is what makes a repeating wave stand still: every sweep begins at the same point. Single-shot mode captures one-off events like power-up.

Three specifications matter:

- **Bandwidth:** about 5× your signal's top frequency.
- **Sample rate:** at least 4–5× the bandwidth.
- **Memory depth:** keeps the sample rate high at slow time bases.

## Math
$$t_r \approx \frac{0.35}{BW}$$ Fastest edge a scope can show.
$$t_{\text{meas}} = \sqrt{t_{\text{sig}}^2+t_{\text{scope}}^2}$$ Your scope's rise time adds in.

## Example
Q: A 100 MHz scope views a 3 ns edge. What rise time does it show?
- $t_{\text{scope}} = 0.35/10^8 = 3.5$ ns
- $\sqrt{3^2+3.5^2}$
A: About 4.6 ns. The scope slows what you see.

## Lab
Connect the probe to the scope's own calibration output, and adjust the probe's compensation screw until the square wave has flat tops.

## Check
Q: What does the trigger do?
- Sets the voltage scale
+ Starts each sweep at the same point on the waveform
- Removes noise
W: A stable reference point lets repeated sweeps line up.

# probing: Probing technique
kind: method
level: 3
needs: oscilloscope, inductor
> Most false ringing comes from the probe, not the circuit.

A 10× probe looks like 10 MΩ in parallel with about 15 pF. Its long ground lead adds inductance, and the two form a resonant circuit that adds ringing that does not exist on your board.

For fast signals, swap the crocodile clip for a short ground spring. For ripple, measure right at the capacitor.

## Math
$$f_{\text{ring}} = \frac{1}{2\pi\sqrt{L_{\text{lead}}C_{\text{probe}}}}$$ Ringing frequency from the probe itself.

## Example
Q: A 10 cm ground lead (about 100 nH) with 10 pF at the tip. Where does it ring?
- $\sqrt{10^{-7}\times10^{-11}} = 10^{-9}$
- $f = 1/(2\pi\times10^{-9})$
A: About 159 MHz.

## Watch out
A mains-powered scope's probe ground connects to earth. Clipping it to a point that isn't at earth potential causes a short circuit through the scope. Never do this on mains-connected circuits.

# function-generator: Signal generator
kind: method
level: 2
needs: frequency
> Produces test waveforms to inject into a circuit.

Sine, square, triangle, and pulse. Combined with a scope, it measures filter responses and amplifier gain. Step through frequencies, and record output against input to build a [[bode|Bode plot]].

## Watch out
Many generators assume a 50 Ω load, so a high-impedance input shows double the set amplitude.

## Lab
Build an RC low-pass filter with 1.6 kΩ and 100 nF, then sweep it. Output should be down to 70.7% near 1 kHz.

# spectrum-analysis: Spectrum and FFT
kind: method
level: 3
needs: oscilloscope, harmonics
see: emi
> Viewing signals against frequency rather than time.

Many problems hide in the time view, yet stand out in the frequency view. Most scopes have an FFT mode, good for finding a switching harmonic or a vibration peak.

RF power is expressed in dBm, relative to 1 mW. 0 dBm in 50 Ω is 224 mV RMS.

## Math
$$\Delta f = \frac{f_s}{N}$$ FFT frequency resolution.
$$P_{\text{dBm}} = 10\log_{10}\frac{P}{1\ \text{mW}}$$ Power in dBm.

## Example
Q: Capture 1000 samples at 1 MS/s. What is the frequency resolution?
- $10^6/1000$
A: 1 kHz.

## EgireRobotics
Blackbox gyro logs viewed as a spectrum show frame resonances and motor noise, which is how you place notch filters.

# logic-analyzer: Logic analyser
kind: method
level: 2
needs: logic-levels
see: spi, i2c, uart
> Captures digital lines and decodes protocols.

An inexpensive USB analyser decodes UART, SPI and I²C for you. When a sensor isn't responding, it shows whether you're sending what you think you're sending. It sees only highs and lows, so use a scope for signal quality.

## Math
$$f_{\text{sample}} \ge 4f_{\text{bus}}$$ Rule of thumb.

## Example
Q: What sample rate suits a 10 MHz SPI bus?
- $4\times10$ MHz
A: At least 40 MS/s.

# measurement-error: Accuracy and error
kind: concept
level: 2
needs: si-units
> Every measurement comes with an uncertainty.

Accuracy is closeness to truth; precision is repeatability; resolution is the smallest visible step. A meter showing 5.0012 V may still be wrong in the second decimal place. Instruments also disturb what they measure, which is called loading.

## Math
$$\text{error} = \pm(\%\text{ of reading}+\text{counts})$$ Typical meter specification.

## Example
Q: 5.00 V on a ±(0.5% + 2 counts) meter with 0.01 V resolution. Find the error.
- $0.025+0.02$
A: ±0.045 V.

## Check
Q: A meter gives 3.301, 3.302, 3.301 V, but the true value is 3.25 V. It is:
+ Precise but not accurate
- Accurate but not precise
- Both
W: Readings agree with each other, yet are off from the truth.

# soldering: Soldering
kind: method
level: 1
needs: states-of-matter
> Joining parts with molten metal to make electrical and mechanical bonds.

Solder doesn't glue. It forms a thin **intermetallic** layer with the copper, and flux removes oxide so this can happen. Heat the pad and lead together, then feed the solder into the joint, not the iron. A good joint is shiny and concave. A dull, ball-shaped joint is a cold joint.

Common solder: lead-free SAC305 melts at about 217 °C; 63/37 tin-lead at 183 °C.

## Watch out
Use ventilation. Flux fumes irritate lungs, and you should wash your hands after handling leaded solder.

## Lab
Practise on a cheap kit, including 0805 parts. Add flux, tin one pad, tack the part, then solder the other end.

## EgireRobotics
XT60 and motor wires need a large tip and plenty of heat. A cold joint at 60 A will fail in flight.

# debug-method: Systematic debugging
kind: method
level: 2
needs: multimeter, oscilloscope
see: bringup
> Start from power, then clocks, then signals.

Don't guess. Check in order, because each layer depends on the one before:

- Visual inspection: bridges, rotated parts.
- Resistance between rails, with power off.
- Rail voltages, and total current.
- Clocks and reset.
- Communication buses.
- Firmware.

Change one thing at a time, and keep a log. Compare with a working board if you have one.

## Check
Q: An MCU doesn't respond to the debugger. What do you check first?
+ Its power rails
- The firmware's main loop
- The USB driver
W: Nothing else matters until power is right, then clock and reset.
