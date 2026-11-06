@phase 11 | Semiconductor physics | Silicon, electrons, holes and PN junctions

# silicon-crystal: Silicon crystal
kind: concept
level: 2
needs: semiconductors-intro, crystal-lattice
viz: doping
> Each silicon atom shares four covalent bonds with its neighbours.

Silicon has four valence electrons, which it shares with four neighbours, so every atom has a full shell. At absolute zero, all electrons are locked in bonds, and pure silicon is an insulator.

It dominates because it is abundant, grows into near-perfect crystals, and forms a superb natural oxide, SiO₂.

## Engineering
Electronic-grade silicon is purified to around 99.9999999%, or "nine nines". A boule is grown by slowly pulling a seed crystal out of molten silicon, and then sawn into wafers.

## Check
Q: Why is pure silicon a poor conductor at low temperature?
+ All its valence electrons are held in covalent bonds
- It has no electrons
- Its atoms are too far apart
W: With every bond complete, nothing is free to move.

# electron-hole: Electrons and holes
kind: concept
level: 2
needs: silicon-crystal, band-theory
viz: doping
> A freed electron leaves a gap, a hole, which acts as a positive carrier.

Heat breaks a bond and sends an electron to the conduction band. The vacancy left behind can be filled by a neighbour, and so moves the other way. It behaves like a positive particle with charge $+e$.

Think of an empty seat in a full row: people shift left, the gap moves right.

So silicon has two carrier types, unlike metals. Electrons are about three times more mobile than holes.

## Math
$$\mu_n \approx 1400,\ \ \mu_p \approx 450\ \text{cm}^2/\text{V·s}$$ Silicon mobilities.

## Watch out
A hole is not a real particle. It is a useful way of describing many electrons shifting one step at a time. The maths works perfectly if you treat it as a positive charge.

## Check
Q: Pure silicon has one free electron. How many holes does it have?
+ One
- None
- Four
W: Each freed electron leaves one vacancy behind.

# intrinsic-carriers: Intrinsic carrier concentration
kind: quantity
level: 3
needs: electron-hole
viz: bands
> Pure silicon has about 10¹⁰ carriers per cm³ at room temperature.

Thermal generation balances recombination. The mass-action law holds true, doped or not.

## Engineering
$n_i$ doubles about every 11 °C, which is why leakage rises and silicon stops working usefully above about 150–200 °C.

## Math
$$n_i \approx 1\times10^{10}\ \text{cm}^{-3}$$ Silicon at 300 K.
$$n\,p = n_i^2$$ Mass-action law.

## Example
Q: Silicon doped with $N_D = 10^{16}$ cm⁻³. Find the hole density.
- $n \approx 10^{16}$
- $p = (10^{10})^2/10^{16}$
A: $10^{4}$ cm⁻³. Holes are now rare; these are minority carriers.

## Check
Q: Doping raises electrons tenfold. What happens to holes?
+ They fall tenfold
- They rise tenfold
- They stay the same
W: n × p stays fixed at n_i².

# doping: Doping: N-type and P-type
kind: method
level: 2
needs: electron-hole, periodic-table
viz: doping
> Adding a few impurity atoms changes conductivity by a factor of millions.

Replace one silicon atom in a million or so with an impurity:

- **N-type:** phosphorus has 5 valence electrons. Four bond, and the fifth is free. Electrons are the majority carrier.
- **P-type:** boron has 3 valence electrons. One bond is missing, which is a hole. Holes are the majority carrier.

Doped silicon is still electrically neutral. The dopants are charged only once they give up their carrier.

## Engineering
Dopants are added by ion implantation, which fires them into the wafer, then heat moves them into place in the lattice.

## Math
$$\sigma = qn\mu$$ Conductivity from carrier density and mobility.

## Example
Q: Find the resistivity of N-type silicon with $n = 10^{16}$ cm⁻³ and $\mu_n$ = 1400 cm²/V·s.
- $\sigma = 1.6\times10^{-19}\times10^{16}\times1400 = 2.24$ S/cm
- $\rho = 1/2.24$
A: About 0.45 Ω·cm, roughly 500,000 times better than pure silicon.

## Check
Q: Which dopant makes N-type silicon?
- Boron
+ Phosphorus
- Oxygen
W: Phosphorus is in group 15 and has one spare electron.

# fermi-level: Fermi level
kind: concept
level: 3
needs: doping, band-theory
> The energy at which an electron state is 50% likely to be occupied.

The Fermi level summarises where electrons sit in a material. N-type doping lifts it towards the conduction band; P-type drops it towards the valence band. In equilibrium the Fermi level is flat across joined materials, and that one rule produces a junction's built-in voltage.

## Math
$$f(E) = \frac{1}{1+e^{(E-E_F)/kT}}$$ Fermi–Dirac distribution.

## Check
Q: Where does N-type doping move the Fermi level?
+ Towards the conduction band
- Towards the valence band
- It doesn't move
W: More electrons mean states are filled to a higher energy.

# carrier-transport: Drift and diffusion
kind: concept
level: 3
needs: electron-hole, drift-velocity
> Carriers move by being pushed by a field, or by spreading out.

Two mechanisms make current in a semiconductor:

- **Drift:** carriers pushed by a field.
- **Diffusion:** carriers spreading from high to low concentration, like ink in water.

Metals only need drift. Semiconductor devices rely on both.

## Math
$$J_n = qn\mu_nE + qD_n\frac{dn}{dx}$$ Electron current density.
$$\frac{D}{\mu} = \frac{kT}{q}$$ Einstein relation: 26 mV at 300 K.

## Example
Q: Find the diffusion constant for electrons with $\mu_n$ = 1400 cm²/V·s at 300 K.
- $D = \mu\times0.0259$
A: About 36 cm²/s.

## Check
Q: What drives diffusion current?
+ A difference in concentration
- An electric field
- A magnetic field
W: Particles spread from crowded to less crowded places.

# pn-junction: PN junction
kind: concept
level: 2
needs: doping, carrier-transport
see: fermi-level
viz: pn
> Where P meets N, a depletion region and built-in field appear.

Join P and N. Electrons diffuse into the P side and holes into the N side, and they annihilate. That leaves behind fixed charged dopant ions, forming a **depletion region** free of carriers. Its built-in field opposes further diffusion, until equilibrium is reached.

This is the single most important structure in electronics. Diodes, BJTs, solar cells and LEDs are all junctions.

## Math
$$V_{bi} = \frac{kT}{q}\ln\frac{N_AN_D}{n_i^2}$$ Built-in potential.
$$W = \sqrt{\frac{2\varepsilon(V_{bi}-V)}{q}\left(\frac1{N_A}+\frac1{N_D}\right)}$$ Depletion width.

## Example
Q: Find $V_{bi}$ for $N_A = N_D = 10^{16}$ cm⁻³.
- $\ln(10^{32}/10^{20}) = \ln10^{12} = 27.6$
- $0.0259\times27.6$
A: About 0.72 V.

## Check
Q: What stops diffusion across a PN junction from continuing forever?
+ The built-in electric field in the depletion region
- The wire
- Running out of atoms
W: The field pushes back until drift balances diffusion.

# junction-bias: Forward and reverse bias
kind: concept
level: 2
needs: pn-junction
viz: pn
> Forward bias shrinks the barrier; reverse bias widens it.

- **Forward:** + on P. The barrier falls, and carriers flood across. Current rises exponentially.
- **Reverse:** + on N. The barrier grows, and only a tiny leakage flows.

So the junction is a one-way valve for current.

## Engineering
A reverse-biased junction acts as a small capacitor, whose value depends on voltage. Varactor diodes use that for tuning radios.

## Check
Q: Under reverse bias, the depletion region:
+ Widens
- Narrows
- Vanishes
W: The applied voltage adds to the barrier, pulling carriers further from the junction.

# tunneling: Quantum tunnelling
kind: concept
level: 3
needs: quantum-mechanics, pn-junction
see: zener, scaling
> Electrons can pass through a thin barrier they classically could not cross.

An electron's wave decays inside a barrier, but does not reach zero. If the barrier is thin enough, some of it comes out the other side. This is how flash memory writes, why Zeners below about 5 V work, and it is a key limit in shrinking transistors.

## Math
$$T \approx e^{-2\kappa d}$$ Probability falls exponentially with barrier width $d$.

## EgireRobotics
Tunnelling explains why flash memory has a limited number of write cycles. Each write stresses the oxide, so keep frequent logging off internal flash.

# recombination: Generation and recombination
kind: concept
level: 3
needs: electron-hole
see: led, photodiode
> Electrons and holes are created by energy, and destroyed when they meet.

Heat or light creates electron-hole pairs. When an electron meets a hole, it drops back into the bond, and they vanish, releasing energy. The average time before this happens is the carrier lifetime.

Why can't silicon make LEDs? In silicon, the energy usually leaves as lattice vibration, because its band gap is **indirect**. In GaN and GaAs the gap is **direct**, so a photon comes out.

## Math
$$L = \sqrt{D\tau}$$ Diffusion length: how far carriers travel before recombining.

## Example
Q: $D$ = 36 cm²/s and $\tau$ = 1 µs. Find the diffusion length.
- $\sqrt{3.6\times10^{-5}}$ cm
A: About 60 µm.

## Check
Q: Why are LEDs not made from silicon?
+ Its indirect gap releases energy as heat, not light
- Silicon is opaque
- It has no holes
W: Direct-gap materials like GaN emit photons efficiently.

# mos-capacitor: MOS capacitor
kind: concept
level: 3
needs: doping, capacitor, electric-field
see: mosfet
> Metal, oxide and silicon stacked up: the heart of a MOSFET.

Put a metal plate on a thin insulator over P-type silicon. As you raise the plate's voltage, the surface goes through three states.

- **Accumulation:** negative voltage attracts holes to the surface.
- **Depletion:** a small positive voltage pushes holes away.
- **Inversion:** past a threshold, enough electrons gather that the surface acts N-type.

That thin inverted layer is the channel of every MOSFET.

## Math
$$C_{ox} = \frac{\varepsilon_{ox}}{t_{ox}}$$ Oxide capacitance per area.

## Example
Q: Find $C_{ox}$ for 10 nm of SiO₂ ($\varepsilon_r$ = 3.9).
- $3.9\times8.85\times10^{-14}/10^{-6}$
A: About 3.5 × 10⁻⁷ F/cm².

## Check
Q: What forms the channel in an N-channel MOSFET?
+ An inversion layer of electrons at the surface
- A wire under the gate
- Holes in the oxide
W: Gate voltage inverts the P-type surface.
