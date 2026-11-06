@phase 1 | Physics of electricity | Charge, force, fields and why electrons move

# electric-charge: Electric charge
kind: quantity
level: 1
needs: electron, proton
viz: coulomb
> A fundamental property of matter. Like charges repel and opposite charges attract.

Charge is as basic a property as mass. There are two kinds, positive and negative. Charge is the foundation of electricity: every effect later on this board is charges either sitting still (electrostatics) or moving (current).

Symbol $Q$, unit coulomb (C). An electron carries a very small negative charge, so one coulomb is a huge number of them.

## Math
$$Q = n\,e$$ Charge is whole-number multiples of the elementary charge.
$$1\ \text{C} \approx 6.242\times10^{18}\ e$$ Elementary charges in a coulomb.

## Example
Q: How many electrons pass a point when 1 A flows for 1 ms?
- $Q = It = 1 \times 0.001 = 0.001$ C
- $n = Q/e = 0.001 / (1.602\times10^{-19})$
A: About $6.24\times10^{15}$ electrons.

## Check
Q: The symbol and unit for charge are:
+ Q, coulomb
- C, coulomb
- I, ampere
W: Q is the symbol, C is the unit. Do not mix the C of coulomb with the C of capacitance.

# elementary-charge: Elementary charge
kind: quantity
level: 1
needs: electric-charge
> The smallest free unit of charge: exactly 1.602176634 × 10⁻¹⁹ C.

All free charge comes in whole-number multiples of $e$. Since 2019, $e$ has been a fixed exact number that helps define the ampere. Millikan's oil-drop experiment first measured it in 1909.

## Math
$$e = 1.602176634\times10^{-19}\ \text{C}$$ Exact by definition.

# charge-conservation: Conservation of charge
kind: law
level: 1
needs: electric-charge
see: kcl
> Net charge in a closed system never changes.

Charge cannot be created or destroyed. It can only move around. Rubbing a balloon does not make charge; it moves electrons from one surface to another.

This law is the physical root of [[kcl|Kirchhoff's current law]]: charge that arrives at a node has nowhere to pile up, so it must leave.

## Math
$$\frac{dQ_{\text{total}}}{dt} = 0$$ For a closed system.

# coulomb-law: Coulomb's law
kind: law
level: 1
needs: electric-charge
viz: coulomb
> The force between two charges falls with the square of their distance.

Two point charges exert equal and opposite forces on each other. The force depends on the product of the charges, and drops with distance squared: double the gap, a quarter of the force.

## Math
$$F = k\frac{|q_1 q_2|}{r^2}$$ Where $k = 8.988\times10^{9}\ \text{N·m}^2/\text{C}^2$.
$$k = \frac{1}{4\pi\varepsilon_0}$$ Linked to the permittivity of free space, $\varepsilon_0 = 8.854\times10^{-12}$ F/m.

## Example
Q: Find the force between a proton and an electron $5.3\times10^{-11}$ m apart (hydrogen).
- $F = (8.988\times10^{9})(1.602\times10^{-19})^2 / (5.3\times10^{-11})^2$
- $= (2.307\times10^{-28}) / (2.81\times10^{-21})$
A: About $8.2\times10^{-8}$ N, tiny in newtons but enormous for an electron's mass.

## Check
Q: If the distance between two charges triples, the force becomes:
- 1/3 as large
+ 1/9 as large
- 3 times larger
W: Inverse square: 1/3² = 1/9.

# electric-field: Electric field
kind: quantity
level: 1
needs: coulomb-law
viz: field
> The force per unit charge at each point in space.

Instead of saying charge A pushes charge B across empty space, physics says A creates a **field** that fills space, and B responds to the field where it is.

$\vec E$ at a point is the force a tiny positive test charge would feel there, divided by that charge. Field lines start on positive charges and end on negative ones. Crowded lines mean a strong field.

The moment you close a switch, a field is established along the wire at close to the speed of light. That is why the lamp comes on at once, though the [[drift-velocity|electrons themselves crawl]].

## Math
$$\vec E = \frac{\vec F}{q}$$ Unit: N/C, identical to V/m.
$$E = k\frac{|Q|}{r^2}$$ Field of a point charge.
$$E = \frac{V}{d}$$ Uniform field between plates.

## Example
Q: 3.3 V sits across a 100 nm gate oxide. What is the field?
- $E = V/d = 3.3 / (100\times10^{-9})$
A: $3.3\times10^{7}$ V/m, about 11 times the field that breaks down air. This is why thin oxides are fragile.

## Engineering
High fields cause arcing and oxide breakdown. Sharp corners concentrate field. ESD damage to a MOSFET gate is a field problem, not an energy problem.

# electric-potential: Electric potential
kind: quantity
level: 1
needs: electric-field, energy
see: voltage
> Potential energy per unit charge at a point in a field.

Lift a mass and you store gravitational energy. Push a positive charge against a field and you store electric potential energy. Divide that energy by the charge and you get **potential** $\phi$, a property of the location.

The difference in potential between two points is [[voltage]]. Only differences have meaning, just as only height differences matter for a falling ball.

## Math
$$\phi = \frac{U}{q}$$ Potential energy per charge.
$$\phi(r) = k\frac{Q}{r}$$ Potential around a point charge.
$$\vec E = -\nabla\phi$$ Field points downhill on the potential surface.

# gauss-law: Gauss's law
kind: law
level: 3
needs: electric-field, integral
see: maxwell
> Total electric flux out of a closed surface equals enclosed charge over ε₀.

Field lines start and end on charges, so counting the lines through a closed surface tells you the charge inside. This is one of [[maxwell|Maxwell's four equations]].

It gives quick answers wherever geometry is symmetric: the field of a charged plate, the fact that charge on a conductor lives on its outer surface, and why a metal enclosure shields its interior.

## Math
$$\oint \vec E\cdot d\vec A = \frac{Q_{\text{enc}}}{\varepsilon_0}$$ Integral form.
$$E = \frac{\sigma}{2\varepsilon_0}$$ Field beside a large sheet of surface charge $\sigma$.

## Engineering
Shield cans on RF sections and grounded enclosures work because of this law, a Faraday cage in practice.

# free-electrons: Conduction electrons
kind: concept
level: 1
needs: metallic-bond, electric-charge
viz: drift
> Electrons not tied to any one atom, free to wander through a metal.

Copper contains electrons that can move fairly freely through its atomic structure. Each atom donates about one, so there are about $8.5\times10^{28}$ per cubic metre.

Without any voltage, they rush about at around $10^6$ m/s in random directions and go nowhere on average. So no net current flows.

## Math
$$n_{\text{Cu}} \approx 8.5\times10^{28}\ \text{m}^{-3}$$ Conduction electron density in copper.

# drift-velocity: Drift velocity
kind: quantity
level: 1
needs: free-electrons, electric-field, current
viz: drift
> The slow average motion of electrons along a wire under a field.

With an electric field in the wire, electrons pick up a small net movement opposite to the field, on top of their random motion. They accelerate, hit a lattice vibration, lose the energy as heat, and start again.

The surprise is the size: it is a fraction of a millimetre per second. Energy moves through the field at nearly light speed, while electrons plod along.

## Math
$$I = n\,A\,v_d\,e$$ Current from electron density, area, drift speed and charge.
$$v_d = \frac{I}{nAe}$$ Rearranged for drift speed.
$$v_d = \mu E$$ Mobility $\mu$ links speed to field.

## Example
Q: 10 A flows in a copper wire with area 2.5 mm². Find the drift speed.
- $A = 2.5\times10^{-6}$ m²
- $v_d = 10 / (8.5\times10^{28} \times 2.5\times10^{-6} \times 1.602\times10^{-19})$
A: About 0.29 mm/s. An electron needs about an hour to travel one metre.

## Watch out
Electrons do not travel from the battery to the bulb in a flash. All the electrons in the wire start drifting nearly together, like water already filling a pipe.

## Check
Q: Why does a lamp light instantly when drift is so slow?
- Electrons actually move at light speed
+ The field spreads at nearly light speed and moves all the electrons at once
- The lamp stores energy
W: The wire is already full of electrons; the field sets them all drifting nearly at the same moment.

# conventional-current: Conventional current
kind: concept
level: 1
needs: drift-velocity
see: current
> Engineers draw current from + to −, opposite to the electron drift.

Benjamin Franklin picked the sign before electrons were known. So there are two directions to keep clear:

- **Electron flow:** from negative to positive.
- **Conventional current:** from positive to negative.

Engineers use conventional current for all circuit analysis. A positive charge going right is mathematically the same as a negative charge going left, so every equation still works. Diode and transistor arrows point in the conventional direction.

## Check
Q: In a battery circuit, conventional current in the external wire flows:
+ From + terminal to − terminal
- From − terminal to + terminal
- Both ways at once
W: Electrons go − to +; conventional current is defined the opposite way.

# band-theory: Energy bands in solids
kind: concept
level: 2
needs: pauli-exclusion, crystal-lattice
viz: bands
> Atomic levels merge into bands. The gap between them sets conductivity.

Bring $10^{23}$ atoms together and their levels split into nearly continuous **bands**, because Pauli forbids any two electrons having the same state. Two bands matter most:

- **Valence band:** the highest band filled at absolute zero.
- **Conduction band:** the next band, where electrons are free to move.

Between them is the **band gap** $E_g$, a range of forbidden energies. An electron has to gain $E_g$ to conduct.

| Material | Gap | Type |
|---|---|---|
| Copper | Bands overlap | Conductor |
| Germanium | 0.67 eV | Semiconductor |
| Silicon | 1.12 eV | Semiconductor |
| GaN | 3.4 eV | Wide-gap semiconductor |
| Diamond | 5.5 eV | Insulator |
| Glass (SiO₂) | about 9 eV | Insulator |

## Math
$$n_i \propto T^{3/2} e^{-E_g/2kT}$$ Thermally excited carriers fall exponentially with band gap.
$$kT \approx 0.0259\ \text{eV}$$ Thermal energy at 300 K.

## Check
Q: Why is silicon a poor conductor at room temperature, yet not an insulator?
+ Its 1.12 eV gap is small enough that a few electrons cross thermally
- Silicon has no electrons
- Its bands overlap
W: Thermal energy (0.026 eV) excites a small fraction across a modest gap. A 9 eV gap allows essentially none.

# conductors: Conductors
kind: concept
level: 1
needs: band-theory, free-electrons
viz: bands
> Materials that let charge move easily. Copper, silver, aluminium, gold.

Their conduction band is partly filled or overlaps the valence band, so electrons can gain energy from even a tiny field.

| Metal | Resistivity at 20 °C (Ω·m) | Used for |
|---|---|---|
| Silver | $1.59\times10^{-8}$ | Contacts, RF plating |
| Copper | $1.68\times10^{-8}$ | Wires, PCB traces |
| Gold | $2.44\times10^{-8}$ | Corrosion-free plating |
| Aluminium | $2.65\times10^{-8}$ | Power lines, chip wiring |

Copper wins on cost and conductivity. Gold is used because it does not corrode, not because it conducts better.

# insulators: Insulators
kind: concept
level: 1
needs: band-theory, chemical-bond
viz: bands
> Materials that strongly resist charge movement. Rubber, glass, plastic, FR-4.

The valence band is full, and the band gap is too wide for thermal energy to cross. Their resistivity can be $10^{20}$ times that of copper.

Insulators are as important as conductors: PCB substrate, wire sheaths, capacitor dielectrics, and gate oxide are all insulators doing a job.

# semiconductors-intro: Semiconductors
kind: concept
level: 1
needs: band-theory
see: silicon-crystal, doping
viz: bands
> Materials whose conductivity can be controlled. Silicon and germanium.

A semiconductor sits between conductor and insulator, but its value is not that middle ground. It is that **engineers can control how electricity moves through it**, using impurities, voltage, light or heat.

That controllability is the foundation of diodes, transistors, MOSFETs, microcontrollers, processors, memory and AI accelerators. It is covered in full from [[silicon-crystal|Phase 11]].

## Check
Q: What makes semiconductors so valuable?
- Their conductivity is high
+ Their conductivity can be controlled precisely
- They are the cheapest materials
W: Control is the key. A switch you can steer with a voltage is what makes logic possible.

# static-electricity: Static electricity and ESD
kind: concept
level: 1
needs: electric-charge, conductors, insulators
see: dielectric-breakdown
> Charge imbalance that sits on surfaces until it discharges.

Contact between materials transfers electrons. On an insulator, that charge cannot flow away, so it builds up. A person walking on a carpet can reach 10 kV or more.

When you touch metal, it discharges in nanoseconds. You feel it at about 3 kV, yet a MOSFET gate can be killed at far below this, without you noticing.

## Engineering
Use a wrist strap and ESD mat, keep parts in shielded bags, and add TVS diodes on exposed connectors such as USB and antenna lines.

## Lab
Rub a balloon on your hair and hold it near small paper bits. You are seeing Coulomb attraction with induced charge.

# dielectric-breakdown: Dielectric breakdown
kind: concept
level: 2
needs: electric-field, insulators
> When field gets strong enough, an insulator suddenly conducts.

Every insulator has a limit. Beyond it, electrons are torn free, they knock more electrons loose, and an avalanche creates a conductive path.

| Material | Breakdown strength |
|---|---|
| Air | about 3 MV/m |
| FR-4 | about 20 MV/m |
| SiO₂ | about 1000 MV/m |

## Example
Q: About how far can a 12 kV spark jump in dry air?
- $d = V/E = 12\,000 / (3\times10^{6})$
A: About 4 mm.
