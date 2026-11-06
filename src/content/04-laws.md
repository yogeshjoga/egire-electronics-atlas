@phase 4 | Electrical laws | Ohm, Kirchhoff and Joule: the rules every circuit obeys

# ohms-law: Ohm's law
kind: law
level: 1
needs: resistance, algebra
viz: ohm
> In a resistor, current is proportional to voltage: V = IR.

Ohm's law explains the relationship between voltage, current and resistance. It comes straight from the physics of drift: a stronger field gives faster drift, and drift speed sets the current.

You only need one form. The other two come from [[algebra|rearranging]].

## Math
$$V = IR$$ Voltage across a resistance.
$$I = \frac{V}{R}$$ Find current.
$$R = \frac{V}{I}$$ Find resistance.
$$\vec J = \sigma\vec E$$ The microscopic form, true at each point in the material.

## Example
Q: A 12 V supply is connected to a 6 Ω resistor. Find the current.
- $I = V/R = 12/6$
A: $I = 2$ A.
Q: A circuit has 5 V and 0.5 A. Find the resistance.
- $R = V/I = 5/0.5$
A: $R = 10\ \Omega$.
Q: A 100 Ω resistor carries 0.02 A. Find the voltage across it.
- $V = IR = 0.02\times100$
A: $V = 2$ V.

## Watch out
Ohm's law describes ohmic materials at steady temperature. Diodes, LEDs and transistors do not follow it. See [[non-ohmic]].

## Lab
Connect a 1 kΩ resistor to 1, 2, 3, 4, 5 V. Measure current each time and plot it. A straight line through zero is Ohm's law, and its slope is $1/R$.

## Check
Q: A circuit has 12 V and 4 Ω resistance. What is the current?
- 2 A
+ 3 A
- 4 A
- 48 A
W: I = V/R = 12/4 = 3 A.

# non-ohmic: Non-ohmic devices
kind: concept
level: 2
needs: ohms-law
see: diode
> Devices whose V–I graph is not a straight line.

$R=V/I$ always gives a number, but it only means a constant resistance if the graph is straight. Filament bulbs (R rises with heat), diodes (exponential), thermistors and transistors are all non-ohmic.

For these, engineers use **dynamic resistance**, the local slope.

## Math
$$r_d = \frac{dV}{dI}$$ Small-signal resistance at an operating point.

# power-formulas: The three power formulas
kind: law
level: 1
needs: ohms-law, power
viz: ohm
> P = VI, P = I²R and P = V²/R: one law in three forms.

Combining Ohm's law and power gives three equivalent equations. Use whichever fits the values you know.

| Known values | Formula |
|---|---|
| Voltage and current | $P = VI$ |
| Current and resistance | $P = I^2R$ |
| Voltage and resistance | $P = V^2/R$ |

## Math
$$P = VI$$ General, any device.
$$P = I^2R$$ From $V=IR$.
$$P = \frac{V^2}{R}$$ From $I=V/R$.

## Example
Q: What power rating does a 100 Ω resistor need with 10 V across it?
- $P = 10^2/100 = 1$ W
- Standard practice: at least 2× margin
A: Use a 2 W part.

## Watch out
$I^2R$ means doubling current quadruples the heat. Power wiring problems scale harshly.

# joule-heating: Joule's law of heating
kind: law
level: 1
needs: power-formulas, energy-electrical
viz: wire
> Current through resistance turns electrical energy into heat.

When electrons scatter in the lattice, their energy becomes vibration, which is heat. It is what a toaster wants and what a trace does not want.

## Math
$$H = I^2Rt$$ Heat in joules.

## Example
Q: A wire with 0.1 Ω resistance carries 10 A for 10 s. How much heat does it make?
- $H = 10^2\times0.1\times10$
A: $H = 100$ J.

## EgireRobotics
A wire too thin for its motor current can overheat. A 0.01 Ω connector at 80 A dissipates 64 W, so a bad XT60 joint can melt in flight.

# kcl: Kirchhoff's current law (KCL)
kind: law
level: 1
needs: charge-conservation, current, circuit
viz: kirchhoff
> Current into a node equals current out of it.

Charge cannot pile up in a junction, so the total arriving equals the total leaving. KCL is [[charge-conservation|conservation of charge]] applied to circuits.

## Math
$$\sum_k I_k = 0$$ Signed sum at any node.
$$I_{\text{in}} = I_{\text{out}}$$ Everyday form.

## Example
Q: 5 A enters a node. One branch takes 2 A. What does the other carry?
- $5 = 2 + I$
A: 3 A.

## EgireRobotics
A power distribution board is a big KCL node: battery current equals the sum of all four ESCs plus the accessory rail.

## Check
Q: KCL is a statement of conservation of:
+ Charge
- Energy
- Momentum
W: Current is charge per second. KVL is the energy one.

# kvl: Kirchhoff's voltage law (KVL)
kind: law
level: 1
needs: voltage, energy-electrical, circuit
viz: kirchhoff
> Voltages around any closed loop add up to zero.

Walk around a loop and return to where you began, and you must be at the same potential, just as a hike that ends at the start has zero net climb. KVL is conservation of **energy** per coulomb.

## Math
$$\sum_k V_k = 0$$ Around any closed loop.

## Example
Q: A 12 V supply feeds two resistors. One drops 5 V. What does the other drop?
- $12 - 5 - V_2 = 0$
A: 7 V.

## Watch out
Strictly, KVL assumes no changing magnetic flux through the loop. In fast circuits and near transformers it needs [[faraday-law|Faraday's law]] added.

## Check
Q: KVL expresses conservation of:
- Charge
+ Energy
- Current
W: Going round a loop, the energy gained per coulomb equals the energy lost.
