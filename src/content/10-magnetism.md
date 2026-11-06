@phase 10 | Magnetic fundamentals | Moving charge, induction, motors and Maxwell

# magnetic-field: Magnetic field
kind: quantity
level: 1
needs: current, electric-field
viz: induction
> The field made by moving charges, felt by other moving charges.

Any current creates a magnetic field around it. Magnetism and electricity are one phenomenon: what looks like a pure electric force in one reference frame looks partly magnetic in another.

$B$ is measured in tesla. Earth's field is about 50 µT, and a neodymium magnet about 1 T.

Picture the field as closed loops around a wire. The **right-hand rule** gives its direction: point your thumb along conventional current, and your fingers curl the way the field circles.

Magnetic field lines never start or end. A bar magnet's lines leave the north pole, go round, and return through the magnet.

## Math
$$F = qvB\sin\theta$$ Force on a moving charge.

## EgireRobotics
High battery currents near a compass distort heading, which is why GPS and magnetometer modules sit on a mast far from power wires.

## Check
Q: What creates a magnetic field?
+ Moving charge
- Stationary charge alone
- Temperature
W: Currents, and electron spin, are the sources of magnetism.

# lorentz-force: Lorentz force
kind: law
level: 2
needs: magnetic-field
see: dc-motor
> The combined electric and magnetic force on a charge.

This is the working principle of all motors, and of hall sensors. A current in a field feels a sideways force.

## Math
$$\vec F = q(\vec E+\vec v\times\vec B)$$ Force on a charge.
$$F = BIL\sin\theta$$ Force on a wire.

## Example
Q: A wire 0.05 m long carries 20 A at right angles to a 0.5 T field. What is the force?
- $F = 0.5\times20\times0.05$
A: 0.5 N.

## Check
Q: A charge moves exactly parallel to a magnetic field. What force does it feel?
+ None
- Maximum force
- A force along the field
W: The force depends on sin θ, which is zero here.

# biot-savart: Biot–Savart law
kind: law
level: 3
needs: magnetic-field, integral
> The magnetic field from a small piece of current.

Add up each short section's contribution to find the field of any wire shape.

## Math
$$d\vec B = \frac{\mu_0}{4\pi}\frac{I\,d\vec l\times\hat r}{r^2}$$ Field from a current element, with $\mu_0 = 4\pi\times10^{-7}$ H/m.

## Example
Q: Find the field at the centre of a 1 cm radius loop carrying 1 A.
- $B = \mu_0I/2R = (4\pi\times10^{-7})/0.02$
A: About 63 µT, similar to Earth's field.

# ampere-law: Ampère's circuital law
kind: law
level: 3
needs: biot-savart
see: maxwell
> Field around a closed path equals μ₀ times the current through it.

The magnetic version of Gauss's law. It gives quick results for straight wires and coils.

## Math
$$\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}}$$ Integral form.
$$B = \frac{\mu_0I}{2\pi r}$$ Long straight wire.
$$B = \mu_0nI$$ Inside a solenoid.

## Example
Q: What is $B$ at 2 cm from a wire carrying 40 A?
- $B = (4\pi\times10^{-7})(40)/(2\pi\times0.02)$
A: 400 µT, eight times Earth's field. This is what upsets a compass.
Q: A solenoid has 1000 turns per metre and carries 1 A. Find $B$ inside.
- $B = 4\pi\times10^{-7}\times1000\times1$
A: About 1.26 mT.

# magnetic-flux: Magnetic flux
kind: quantity
level: 2
needs: magnetic-field
> The total magnetic field passing through an area.

## Math
$$\Phi = BA\cos\theta$$ Flux, in webers.
$$\lambda = N\Phi$$ Flux linkage of a coil.

## Example
Q: 0.5 T passes straight through a 10 cm² loop. What is the flux?
- $\Phi = 0.5\times10^{-3}$
A: 0.5 mWb.

## Check
Q: A loop turns edge-on to a field. What is the flux?
+ Zero
- Maximum
- Unchanged
W: cos 90° = 0, as no field lines pass through it.

# faraday-law: Faraday's law
kind: law
level: 2
needs: magnetic-flux, derivative
viz: induction
> A changing magnetic flux induces a voltage.

The most useful discovery in electrical engineering. Change the flux through a loop and a voltage appears, with no contact needed. It explains generators, transformers, inductors, wireless charging, and pickup noise.

## Engineering
Any loop of wire is a receiver. Near a fast-changing current, your signal loops pick up voltage. Keep loops small, and twist wire pairs so that induced voltages cancel.

## Math
$$\mathcal{E} = -N\frac{d\Phi}{dt}$$ Induced EMF.

## Example
Q: Flux through a 100-turn coil changes by 2 mWb in 10 ms. What EMF results?
- $\mathcal{E} = 100\times(0.002/0.01)$
A: 20 V.

## Lab
Connect a coil to an oscilloscope and push a magnet through. Moving faster gives a bigger pulse; reversing gives the opposite sign.

## Check
Q: A strong magnet sits motionless in a coil. What voltage appears?
+ None
- A large one
- A steady DC voltage
W: Induction needs change.

# lenz-law: Lenz's law
kind: law
level: 2
needs: faraday-law
viz: induction
> Induced effects always oppose the change that caused them.

This is why Faraday's law has a minus sign. If it were the other way, a tiny change would feed itself and create energy from nothing. It is conservation of energy, and also explains the back-EMF that limits a motor's speed.

## Lab
Drop a strong magnet down a copper pipe. It falls slowly, as induced currents make a field that opposes the motion. Copper isn't magnetic, so there's no sticking.

## Check
Q: Why does Lenz's law have to hold?
+ Otherwise energy would not be conserved
- Copper repels magnets
- Current always flows clockwise
W: If induced effects aided the change, energy would appear from nowhere.

# magnetic-materials: Magnetic materials
kind: concept
level: 2
needs: magnetic-field, electron
> Electron spins aligned in domains amplify a field.

In iron, nickel and cobalt, spins align in domains. Applied fields line those domains up, multiplying $B$ by the relative permeability, which can be thousands. Past saturation, no more domains are left to align.

Ferrites offer high permeability with low eddy losses for use at high frequencies.

Magnetising a core is not perfectly reversible. Plot $B$ against $H$, and the curve forms a loop, called **hysteresis**. The area of that loop is energy lost as heat in each cycle, which is why some cores run hot at high frequency.

## Math
$$B = \mu_0\mu_rH$$ Field in a material.

## Check
Q: What happens to a core past saturation?
+ Permeability collapses, so inductance falls
- It stops conducting
- It generates more flux
W: All domains are already aligned.

# transformer: Transformers
kind: component
level: 1
needs: faraday-law, ac-intro, inductor
viz: transformer
> Two coiled windings that trade voltage for current by turns ratio.

AC in the primary makes a changing flux in the core. That flux links the secondary and induces a voltage in it. Power in equals power out, ideally. A transformer gives isolation as well, and passes no DC.

## Engineering
Real transformers lose energy in winding resistance and in the core. Efficiency is high at mains frequency, and higher frequency allows a much smaller core, which is how phone chargers got tiny.

## Math
$$\frac{V_s}{V_p} = \frac{N_s}{N_p}$$ Voltage ratio.
$$\frac{I_s}{I_p} = \frac{N_p}{N_s}$$ Current ratio.
$$Z_{\text{in}} = \left(\frac{N_p}{N_s}\right)^2Z_L$$ Impedance is reflected by the square of the ratio.

## Example
Q: 230 V to 12 V. If the primary has 1150 turns, how many in the secondary?
- $N_s = 1150\times12/230$
A: 60 turns.

## Watch out
DC gives no changing flux, so a transformer can't pass it. Applying DC gives a large current limited only by winding resistance.

## Check
Q: A transformer has twice as many secondary turns as primary. What does the secondary current do?
+ It is half the primary current
- It doubles
- It stays equal
W: Power is conserved, so voltage up means current down.

# dc-motor: Brushed DC motors
kind: component
level: 1
needs: lorentz-force, lenz-law
> Force on a coil, with a commutator flipping current to keep it turning.

Current in a coil in a magnetic field feels force, giving torque. The brushes flip the current every half turn. As it spins it also acts as a generator, making a back-EMF.

## Engineering
At startup $\omega = 0$, so there is no back-EMF, and the current is just $V/R$: the stall current. This is the highest load a driver has to withstand.

## Math
$$V = IR + K_e\omega$$ Voltage balance.
$$\tau = K_tI$$ Torque is proportional to current.

## Example
Q: A 12 V motor has 1 Ω windings. Find the current at stall, and when back-EMF is 10 V.
- Stall: $12/1 = 12$ A
- Running: $(12-10)/1 = 2$ A
A: 12 A at stall, and 2 A running.

## Check
Q: Why does a motor draw most current at start-up?
+ It has no back-EMF yet
- Friction is highest
- The magnets are cold
W: Only winding resistance limits the current.

# bldc: Brushless motors (BLDC)
kind: component
level: 2
needs: dc-motor, three-phase
see: esc
viz: esc
> Electronics replace brushes, switching three coils in sequence.

The magnets rotate and the coils stay still. An electronic controller energises the phases in sequence to pull the rotor around.

$K_v$ is rpm per volt with no load. A 920 Kv motor on 14.8 V spins near 13,600 rpm.

## Math
$$\text{rpm} \approx K_v\times V$$ No-load speed.
$$K_t \approx \frac{60}{2\pi K_v}$$ Torque constant in N·m/A.

## Example
Q: What is the no-load speed of a 400 Kv motor on 22.2 V?
- $400\times22.2$
A: About 8,900 rpm.

## EgireRobotics
Lower Kv with a higher voltage gives the same power with less current, thinner wires, and lower $I^2R$ loss, which is why heavy lifters use 6S or 12S.

## Check
Q: What replaces the brushes in a brushless motor?
+ Electronic switching in the ESC
- A second magnet
- A gearbox
W: Transistors switch the coils at the right times.

# maxwell: Maxwell's equations
kind: law
level: 4
needs: gauss-law, ampere-law, faraday-law
> Four equations that contain all of classical electromagnetism.

Everything in the electric and magnetic parts of this board condenses into four equations, plus the Lorentz force.

Maxwell's great addition was that a changing electric field also makes a magnetic field. He called this displacement current. It explains how current seems to pass a capacitor's gap, and it completes the loop that lets waves travel.

## Engineering
Ohm's law, KVL and KCL are approximations of these for circuits small compared with the wavelength. As frequency climbs, that approximation breaks down.

## Math
$$\nabla\cdot\vec E = \frac{\rho}{\varepsilon_0}$$ Gauss: charges make E fields.
$$\nabla\cdot\vec B = 0$$ No magnetic monopoles.
$$\nabla\times\vec E = -\frac{\partial\vec B}{\partial t}$$ Faraday: changing B makes E.
$$\nabla\times\vec B = \mu_0\vec J+\mu_0\varepsilon_0\frac{\partial\vec E}{\partial t}$$ Ampère–Maxwell: current and changing E make B.

# em-waves: Electromagnetic waves
kind: concept
level: 3
needs: maxwell
see: photon, antenna
> Changing E and B fields regenerate each other and travel at light speed.

Maxwell's equations predict self-sustaining waves. Their speed comes out from two constants of electricity and magnetism, and turned out to be the speed of light. That is how we learned light is an EM wave.

| Band | Frequency | Use |
|---|---|---|
| Radio | Up to about 300 MHz | RC control, FM |
| Microwave | 300 MHz to 300 GHz | Wi-Fi, GPS, radar |
| Infrared | About 10¹³ Hz | Thermal cameras |
| Visible | About 5 × 10¹⁴ Hz | Cameras, LEDs |

## Math
$$c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}$$ Speed of light, $3\times10^8$ m/s.
$$\lambda = \frac{c}{f}$$ Wavelength.

## Example
Q: What is the wavelength of 2.4 GHz?
- $\lambda = 3\times10^8/2.4\times10^9$
A: 12.5 cm, so a quarter-wave antenna is about 3.1 cm.

## Check
Q: What do electromagnetic waves travel through?
+ Nothing is needed; they cross empty space
- Only air
- Only metal
W: The fields sustain each other.

# antenna: Antennas
kind: component
level: 3
needs: em-waves, transmission-line
> Structures that launch and catch electromagnetic waves.

An antenna turns guided energy into free-space waves. A dipole is half a wavelength long. Gain is directional focus, not extra power.

## Math
$$\frac{P_r}{P_t} = G_tG_r\left(\frac{\lambda}{4\pi d}\right)^2$$ Friis link equation.

## Example
Q: How long is a quarter-wave antenna at 915 MHz?
- $\lambda = 3\times10^8/9.15\times10^8 = 32.8$ cm
- $32.8/4$
A: About 8.2 cm.

## Watch out
Never power up a radio transmitter without its antenna attached. The reflected power can destroy the output stage.

## EgireRobotics
Each doubling of range needs 6 dB more link budget. Keep video and RC antennas apart, and away from carbon fibre, which blocks RF.

# eddy-currents: Eddy currents
kind: concept
level: 2
needs: faraday-law, lenz-law
see: transformer
> Swirling currents induced in conductors by changing fields.

A changing field induces voltage in any conductor, including a solid iron core. Loops of current swirl around inside it, which heats it. These are eddy currents.

Transformer cores are made of thin, insulated layers, called laminations, which break up those paths. Ferrites avoid the problem since they barely conduct.

They're also useful: induction cooktops and magnetic brakes depend on them.

## Math
$$P_e \propto B^2f^2t^2$$ Loss rises with the square of lamination thickness $t$.

## Check
Q: Why laminate a transformer core?
+ To block eddy current paths
- To save weight
- To increase resistance of the windings
W: Thin insulated layers keep each current loop small.

# hall-effect: Hall effect sensors
kind: component
level: 2
needs: lorentz-force
see: current-sensing
> A magnetic field pushes carriers sideways, producing a measurable voltage.

Run current through a thin conductor in a field. The Lorentz force pushes carriers to one side until a sideways voltage balances it. That is the Hall voltage. Semiconductors give a bigger effect than metals, since they have fewer carriers.

Used in current sensors, motor position sensors and contactless switches.

## Math
$$V_H = \frac{IB}{nqt}$$ Hall voltage, with thickness $t$.

## Check
Q: Why are Hall sensors made from semiconductors?
+ Fewer carriers give a larger Hall voltage
- Metals block magnetic fields
- They are cheaper than copper
W: V_H is inversely proportional to carrier density.
