@phase 2 | Electrical quantities | Voltage, current, resistance, power and energy

# voltage: Voltage (V)
kind: quantity
level: 1
needs: electric-potential
viz: ohm
> The energy each coulomb of charge gains or loses between two points.

Voltage is the electrical potential difference between two points. Water needs a pressure difference to flow through a pipe. In the same way, charge needs a potential difference to produce a current through a circuit.

One volt means one joule of energy transferred per coulomb of charge. Voltage is always **between two points**, so your meter has two probes.

| Device | Typical voltage |
|---|---|
| Coin cell | 3 V |
| USB power | 5 V |
| 2S LiPo nominal | 7.4 V |
| 3S LiPo nominal | 11.1 V |
| 4S LiPo nominal | 14.8 V |
| 6S LiPo nominal | 22.2 V |
| Household supply in India | About 230 V AC |

## Math
$$V = \frac{W}{Q}$$ Energy transferred per unit charge.
$$1\ \text{V} = 1\ \text{J/C}$$ Definition of the volt.

## Example
Q: 10 J of energy is transferred per 2 C of charge. What is the voltage?
- $V = W/Q = 10/2$
A: $V = 5$ V.

## Watch out
Voltage is not something that flows through a component. It is across it. Current flows through; voltage appears across.

LiPo values are nominal. A cell is about 3.7 V nominal and 4.2 V fully charged, so a 6S pack actually reaches 25.2 V. Design for that number.

## Check
Q: One volt equals:
+ One joule per coulomb
- One coulomb per second
- One watt per ampere squared
W: V = W/Q. One coulomb per second is the ampere.

# ground-reference: Ground and reference
kind: concept
level: 1
needs: voltage
see: grounding
> The point we agree to call 0 V so other voltages have a meaning.

Since voltage only exists between two points, a circuit picks one node as reference and calls it **ground**. "This pin is at 3.3 V" means 3.3 V above that node.

There are several meanings of the word:

- **Signal ground:** the reference for your circuit.
- **Chassis ground:** the metal case.
- **Earth ground:** a real connection to the soil, for safety.

A drone has no earth connection at all, and works perfectly well.

## Watch out
Ground is not a magical sink. Ground wires have resistance, and current in them produces voltage. See [[grounding]].

# current: Current (I)
kind: quantity
level: 1
needs: voltage
see: conventional-current
viz: ohm
> The rate at which charge passes a point.

If voltage is pressure difference, current is water flow rate. One ampere means one coulomb passes a point every second.

| Unit | Conversion |
|---|---|
| 1 ampere (A) | 1 A |
| 1 milliampere (mA) | 0.001 A |
| 1 microampere (µA) | 0.000001 A |
| 1 kiloampere (kA) | 1000 A |

To measure current, the meter must be placed **in series**, so that the current passes through it.

## Math
$$I = \frac{Q}{t}$$ Charge per time.
$$i(t) = \frac{dq}{dt}$$ The general form when current varies.
$$1\ \text{A} = 1\ \text{C/s}$$ Definition of the ampere.
$$J = \frac{I}{A}$$ Current density, a key limit for traces and chip wiring.

## Example
Q: 20 C of charge passes through a wire in 5 s. What is the current?
- $I = Q/t = 20/5$
A: $I = 4$ A.

## Check
Q: What is the unit of electric current?
- Volt
+ Ampere
- Ohm
- Watt
W: The ampere is one coulomb per second.

# resistance: Resistance (R)
kind: quantity
level: 1
needs: current, drift-velocity
viz: ohm, wire
> The opposition to current, caused by electrons scattering in the material.

A wide pipe lets more water through and a narrow one restricts it. Electrical resistance limits current in the same way.

Physically, moving electrons scatter off lattice vibrations and impurities and hand over energy as heat. Resistance is the bulk result of this scattering.

It depends on four things: material, length, cross-sectional area and temperature.

## Math
$$R = \frac{V}{I}$$ Definition. Unit: ohm (Ω) = V/A.
$$R = \rho\frac{L}{A}$$ For a uniform conductor.

## Example
Q: A device draws 0.5 A from 5 V. What is its effective resistance?
- $R = V/I = 5/0.5$
A: $R = 10\ \Omega$.

## EgireRobotics
Thin, long wires create voltage drops and heating. In drone power distribution that shows up as voltage sag at the ESC and hot connectors.

# conductance: Conductance (G)
kind: quantity
level: 2
needs: resistance
> The reciprocal of resistance. Unit: siemens.

Conductance says how easily current passes. It is handy for parallel circuits, where conductances simply add, and it is the natural unit in [[nodal-analysis|nodal analysis]].

## Math
$$G = \frac{1}{R}$$ Unit: siemens (S).
$$I = GV$$ Ohm's law in conductance form.
$$\sigma = \frac{1}{\rho}$$ Conductivity is the reciprocal of resistivity.

# resistivity: Resistivity (ρ)
kind: quantity
level: 1
needs: resistance, conductors
viz: wire
> A material's built-in resistance, independent of its shape.

Resistance belongs to an object, while resistivity belongs to the material. Copper is always about $1.68\times10^{-8}\ \Omega\cdot\text{m}$, whatever the wire size.

Microscopically, resistivity comes from carrier density and how long carriers travel between collisions.

## Math
$$R = \rho\frac{L}{A}$$ Resistance from geometry.
$$\sigma = \frac{n e^2 \tau}{m}$$ Drude model: conductivity from density $n$ and collision time $\tau$.

## Example
Q: Find the resistance of 1 m of copper wire with area 1 mm².
- $R = 1.68\times10^{-8} \times 1 / (1\times10^{-6})$
A: $R = 0.0168\ \Omega$, or 16.8 mΩ.

## EgireRobotics
At 60 A, that one metre drops 1 V and burns 60 W, per conductor. This is why heavy-lift drones use short, thick battery leads.

# temp-coefficient: Temperature coefficient
kind: quantity
level: 2
needs: resistivity
> Metal resistance rises with temperature; semiconductor resistance falls.

Heat makes the lattice vibrate harder, so electrons scatter more, and metals resist more. In a semiconductor, heat also frees many more carriers, and that effect wins, so resistance falls.

This sign difference matters. Copper rises by about 0.39% per °C.

## Math
$$R(T) = R_0\,[1+\alpha(T-T_0)]$$ Linear model. For copper, $\alpha \approx 0.0039\ /{}^\circ\text{C}$.

## Example
Q: A copper coil is 10 Ω at 20 °C. What is it at 100 °C?
- $R = 10[1 + 0.0039(80)] = 10 \times 1.312$
A: 13.1 Ω.

## Engineering
Thermistors (NTC, PTC) use this on purpose to sense temperature. MOSFET $R_{DS(on)}$ increases with heat, which helps parallel devices share current.

# power: Electrical power (P)
kind: quantity
level: 1
needs: voltage, current
viz: ohm, battery
> How quickly electrical energy is transferred or converted.

Voltage is energy per charge, and current is charge per time. Multiply them and charge cancels, leaving energy per time. That is power. One watt is one joule per second.

## Math
$$P = VI$$ Fundamental power formula.
$$P = \frac{W}{t}$$ Energy per unit time.

## Example
Q: A device runs at 12 V and draws 2 A. What is its power?
- $P = 12 \times 2$
A: $P = 24$ W.
Q: A drone has a flight controller (5 V, 0.5 A), AI computer (12 V, 2 A) and camera system (5 V, 0.8 A). What is the total power?
- Flight controller: $5 \times 0.5 = 2.5$ W
- AI computer: $12 \times 2 = 24$ W
- Camera system: $5 \times 0.8 = 4$ W
A: $P_{total} = 30.5$ W.

## EgireRobotics
This is how you start estimating power requirements before designing a PCB or picking a power supply.

## Check
Q: A device operates at 5 V and draws 2 A. What is its power?
- 2.5 W
- 7 W
+ 10 W
- 20 W
W: P = VI = 5 × 2 = 10 W.

# energy-electrical: Electrical energy (E)
kind: quantity
level: 1
needs: power, energy
viz: battery
> The total electrical work done: power multiplied by time.

Power says how fast; energy says how much in total. A 1000 W heater for one minute and a 1 W LED for 1000 minutes use the same energy.

## Math
$$E = Pt$$ Energy from power and time.
$$E = VIt$$ Substituting $P = VI$.
$$1\ \text{kWh} = 3.6\times10^{6}\ \text{J}$$ The unit on electricity bills.

## Example
Q: A 12 V device draws 2 A for 10 s. How much energy does it use?
- $P = 12\times2 = 24$ W
- $E = 24\times10$
A: $E = 240$ J.

# capacity-ah-wh: Battery capacity: Ah and Wh
kind: quantity
level: 1
needs: energy-electrical
see: lipo
viz: battery
> Ah counts charge, and Wh counts energy. Compare batteries in Wh.

Ampere-hours are a unit of charge: 1 Ah = 3600 C. Watt-hours are energy. Because packs have different voltages, only watt-hours can compare them fairly.

## Math
$$\text{Wh} = V \times \text{Ah}$$ Nominal energy capacity.
$$1\ \text{Wh} = 3600\ \text{J}$$ Conversion to joules.
$$t = \frac{\text{Wh}\times\eta}{P}$$ Runtime, where $\eta$ is the usable fraction.

## Example
Q: What is the energy in a 6S LiPo (22.2 V nominal) rated 5000 mAh?
- $5000$ mAh $= 5$ Ah
- $\text{Wh} = 22.2\times5$
A: 111 Wh nominal.

## Watch out
Real usable energy depends on discharge limits, temperature, battery condition and load. Plan on roughly 80% of nominal for LiPo.

## EgireRobotics
Airlines commonly limit lithium batteries around 100 Wh without approval, so a 111 Wh pack needs checking before you fly with it.
