@phase 3 | Mathematical foundations | The maths toolkit, from units to transforms

# si-units: SI units
kind: method
level: 1
needs: matter
> The seven base units from which every electrical unit is built.

Every electrical unit breaks down into base units. Checking those units on a result is the fastest way to catch a wrong formula.

| Quantity | Unit | In base units |
|---|---|---|
| Charge | coulomb (C) | A·s |
| Voltage | volt (V) | kg·m²/(A·s³) |
| Resistance | ohm (Ω) | V/A |
| Capacitance | farad (F) | C/V |
| Inductance | henry (H) | V·s/A |
| Power | watt (W) | J/s |

## Example
Q: Show that volts × amps gives watts.
- $\text{V}\cdot\text{A} = \frac{\text{J}}{\text{C}}\cdot\frac{\text{C}}{\text{s}}$
- The coulombs cancel, leaving J/s
A: J/s is the watt.

# metric-prefixes: Metric prefixes
kind: method
level: 1
needs: si-units
> p, n, µ, m, k, M, G: the shorthand for very small and very large values.

Electronics spans about 24 orders of magnitude, from picofarads to gigahertz.

| Prefix | Symbol | Factor | Example |
|---|---|---|---|
| pico | p | $10^{-12}$ | 22 pF crystal capacitor |
| nano | n | $10^{-9}$ | 100 nF decoupling |
| micro | µ | $10^{-6}$ | 10 µF bulk capacitor |
| milli | m | $10^{-3}$ | 20 mA LED |
| kilo | k | $10^{3}$ | 10 kΩ pull-up |
| mega | M | $10^{6}$ | 8 MHz crystal |
| giga | G | $10^{9}$ | 2.4 GHz radio |

## Example
Q: Convert 4.7 kΩ and 330 mA to base units, then find the voltage.
- $4.7$ kΩ $= 4700\ \Omega$; $330$ mA $= 0.33$ A
- $V = 0.33 \times 4700$
A: 1551 V, a reminder to check whether your answer is sensible.

## Watch out
m is milli and M is mega. Mixing them is a factor of a billion. On schematics, 4k7 means 4.7 kΩ and 2R2 means 2.2 Ω, because decimal points vanish in photocopies.

## Check
Q: 0.0047 A is the same as:
- 47 mA
+ 4.7 mA
- 4.7 µA
W: Move the decimal three places to convert A to mA.

# scientific-notation: Scientific notation
kind: method
level: 1
needs: metric-prefixes
> Writing a number as a value times a power of ten.

Instead of 0.000000000000000000160 C, write $1.6\times10^{-19}$ C. Multiply by adding exponents; divide by subtracting them.

## Math
$$10^a\times10^b = 10^{a+b}$$ Multiplication.
$$\frac{10^a}{10^b} = 10^{a-b}$$ Division.

## Example
Q: Compute $(3\times10^{8})\times(2\times10^{-3})$.
- $3\times2 = 6$
- $10^{8-3} = 10^{5}$
A: $6\times10^{5}$.

# algebra: Rearranging equations
kind: method
level: 1
needs: scientific-notation
> Solving for the unknown by doing the same thing to both sides.

Almost every problem here is one formula rearranged. If you know $V=IR$, then $I=V/R$ and $R=V/I$ follow, with nothing more to memorise. Also learn substitution: put one equation inside another, the way $P=I^2R$ comes from $P=VI$ with $V=IR$.

## Example
Q: Derive $P = V^2/R$ from $P = VI$ and $I = V/R$.
- Substitute for $I$: $P = V\cdot\frac{V}{R}$
A: $P = V^2/R$.

# logarithms-db: Logarithms and decibels
kind: method
level: 2
needs: algebra
> A log scale squeezes huge ratios into small numbers. dB is the engineer's form.

Signals span huge ratios. Logarithms turn multiplication into addition, so a chain of gains can be added. The decibel is a ratio on a log scale.

| dB (power) | Power ratio | Voltage ratio |
|---|---|---|
| 0 | 1 | 1 |
| 3 | 2 | 1.41 |
| 10 | 10 | 3.16 |
| 20 | 100 | 10 |

## Math
$$\text{dB} = 10\log_{10}\frac{P_2}{P_1}$$ Power ratio.
$$\text{dB} = 20\log_{10}\frac{V_2}{V_1}$$ Voltage ratio, same impedance.

## Example
Q: An amplifier takes 10 mV to 1 V. What is its gain in dB?
- Ratio $= 100$
- $20\log_{10}100 = 20\times2$
A: 40 dB.

# trigonometry: Trigonometry
kind: method
level: 1
needs: algebra
> Sine and cosine describe rotation, and so describe AC.

A point going around a circle traces a sine wave over time. So every AC waveform is a rotation in disguise. Angles are in radians: $2\pi$ rad = 360°.

## Math
$$\sin^2\theta + \cos^2\theta = 1$$ Pythagorean identity.
$$\tan\theta = \frac{\sin\theta}{\cos\theta}$$ Used for phase angles.
$$\theta_{\text{rad}} = \theta_{\deg}\cdot\frac{\pi}{180}$$ Conversion.

# complex-numbers: Complex numbers
kind: method
level: 2
needs: trigonometry
see: phasor, impedance
viz: phasor
> Numbers with magnitude and angle. They turn AC calculus into simple algebra.

A complex number $a+jb$ is a point on a plane. Engineers write $j$, because $i$ is already current. Multiplying by $j$ rotates a point by 90°, exactly what a capacitor or inductor does to a sine wave.

## Math
$$j = \sqrt{-1}$$ The imaginary unit.
$$|z| = \sqrt{a^2+b^2},\ \ \theta=\arctan\frac{b}{a}$$ Rectangular to polar.
$$e^{j\theta} = \cos\theta + j\sin\theta$$ Euler's formula.

## Example
Q: Convert $3 + j4$ to polar form.
- $|z| = \sqrt{9+16} = 5$
- $\theta = \arctan(4/3) = 53.1°$
A: $5\angle53.1°$.

# derivative: Derivatives
kind: method
level: 2
needs: algebra
see: capacitor, inductor
> The instantaneous rate of change: the slope of a curve at a point.

Capacitors and inductors are defined by rates of change. Current into a capacitor is proportional to how fast its voltage is changing; voltage across an inductor to how fast its current is changing.

## Math
$$\frac{dy}{dx} = \lim_{\Delta x\to0}\frac{\Delta y}{\Delta x}$$ Definition.
$$\frac{d}{dt}\sin\omega t = \omega\cos\omega t$$ Why reactance depends on frequency.
$$\frac{d}{dt}e^{at} = a\,e^{at}$$ Why exponentials show up in transients.

# integral: Integrals
kind: method
level: 2
needs: derivative
> Accumulated total: the area under a curve.

An integral adds up tiny slices. Charge is the integral of current over time. Energy is the integral of power.

## Math
$$Q = \int i\,dt$$ Charge from current.
$$E = \int p\,dt$$ Energy from power.
$$v_C = \frac1C\int i\,dt$$ Capacitor voltage.

## EgireRobotics
A battery fuel gauge is literally an integrator: it adds up measured current over time, which is called coulomb counting.

# diff-eq: Differential equations
kind: method
level: 3
needs: integral
see: rc-transient
> Equations relating a quantity to its own rate of change.

Apply KVL around a circuit containing C or L and you get a differential equation. First-order ones give exponential curves; second-order ones (RLC) give ringing.

## Math
$$RC\frac{dv}{dt} + v = V_s$$ First-order RC circuit.
$$v(t) = V_s\left(1-e^{-t/RC}\right)$$ Its solution from $v(0)=0$.
$$\frac{d^2v}{dt^2} + 2\zeta\omega_0\frac{dv}{dt} + \omega_0^2 v = 0$$ Second-order standard form.

# linear-systems: Simultaneous equations and matrices
kind: method
level: 2
needs: algebra
see: nodal-analysis, mesh-analysis
> Solving several unknowns at once. The core of circuit simulation.

Nodal or mesh analysis gives a set of linear equations, which a matrix expresses as $Ax=b$. SPICE simulators do exactly this at every time step.

## Math
$$A\mathbf{x} = \mathbf{b}$$ General form.
$$\det\begin{pmatrix}a&b\\c&d\end{pmatrix} = ad-bc$$ 2×2 determinant, used in Cramer's rule.

## Example
Q: Solve $3x + y = 9$ and $x + 2y = 8$.
- From the second: $x = 8 - 2y$
- $3(8-2y) + y = 9 \Rightarrow 24 - 5y = 9$
A: $y = 3,\ x = 2$.

# fourier: Fourier analysis
kind: method
level: 3
needs: integral, complex-numbers
see: harmonics
viz: fourier
> Any repeating signal is a sum of sine waves.

Fourier's idea is that any periodic waveform can be built from sines at multiples of its base frequency. It lets you analyse a square wave as a set of harmonics, and it explains why fast edges cause [[emi|EMI]].

## Math
$$f(t) = a_0 + \sum_{n=1}^{\infty}\left(a_n\cos n\omega t + b_n\sin n\omega t\right)$$ Fourier series.
$$X(f) = \int_{-\infty}^{\infty}x(t)\,e^{-j2\pi ft}\,dt$$ Fourier transform.
$$\text{square}(t) = \frac4\pi\sum_{n\ \text{odd}}\frac{\sin n\omega t}{n}$$ Square wave: odd harmonics only.

# laplace: Laplace transform
kind: method
level: 3
needs: fourier, diff-eq
see: bode
> Converts differential equations into algebra in the s domain.

The Laplace transform takes time functions to functions of $s=\sigma+j\omega$. Derivatives turn into multiplication by $s$. Capacitors become $1/sC$, and inductors $sL$, so circuits solve as if they were resistors. It is the basis of control theory, the core of a flight controller's stabilisation loops.

## Math
$$F(s) = \int_0^\infty f(t)\,e^{-st}\,dt$$ Definition.
$$H(s) = \frac{1}{1+sRC}$$ Transfer function of an RC low-pass filter.
