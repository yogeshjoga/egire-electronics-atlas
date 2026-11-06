@phase 0 | What is matter? | From the stuff around you down to quarks and leptons

# matter: Matter
kind: concept
level: 1
viz: scale
> Anything that has [[mass]] and takes up space. Your drone, the air, a silicon chip.

Everything you can touch is matter: your laptop, your phone, copper wire, water, air, your drone, a silicon chip. Matter is the starting pad of this whole board, because electricity is not a separate substance that gets added to things. **Electricity is what matter does** when some of its smallest parts are pushed around.

If you keep zooming into any object, you pass through a fixed ladder of structure: object, crystal or molecule, [[atom]], [[nucleus]], [[proton|nucleon]], [[quark]]. Each rung is roughly 10 to 100,000 times smaller than the one above it. Use the ladder below to feel how extreme that is.

Matter is mostly empty. If an atom were a cricket stadium, its nucleus would be a marble on the centre of the pitch, and the electrons would be a blur in the stands. A solid feels solid because of electric forces between electrons, not because it is packed full.

Matter also "takes up space", which means two things cannot sit in the same place at once. The amount of space something fills is its **volume**, measured in cubic metres.

## Engineering
Every property printed on a datasheet comes from this ladder. Copper conducts because of how its atoms bond. Silicon can be switched because of how its electrons sit in a crystal. FR-4 insulates because its electrons are held tightly. You will keep coming back to this idea: the material decides the electrical behaviour.

## Math
$$\rho = \frac{m}{V}$$ Density: mass per unit volume, the first number used to describe a piece of matter.

## Check
Q: Which statement is the best description of electricity at the deepest level?
- It is a fluid that is stored inside batteries
+ It is the behaviour of charged parts of matter under electric forces
- It is a kind of very fast heat
W: Nothing extra flows in from outside. The charges were already in the matter; electric forces push them.

# mass: Mass
kind: quantity
level: 1
needs: matter, force
see: energy, atom, quark, fundamental-forces
viz: mass
> How hard an object is to push, and how strongly gravity pulls it. Measured in kilograms.

Forget formulas for a moment. Imagine two things resting on a smooth floor: an empty cardboard box and a crate full of batteries. Push each with the same strength. The box shoots away. The crate barely moves. **Mass is that resistance to being pushed.** The technical name is **inertia**.

Mass shows up in two ways, and they always match:

- **Inertia:** the more mass, the harder it is to speed up, slow down or turn.
- **Gravity:** the more mass, the harder Earth pulls on it.

**Mass is not weight.** Mass is a property of the object, and it is the same everywhere. Weight is the force of gravity on it, so it depends on where you are. A 1.5 kg drone is still 1.5 kg on the Moon, but it weighs about one sixth as much. In deep space it weighs nothing, yet it would still take effort to push.

**Mass is not size either.** A balloon is big with little mass. A lead fishing weight is small with a lot.

**If atoms are mostly empty, where is the mass?** Almost all of it is packed into the tiny [[nucleus]]. In a copper atom, the nucleus holds about 99.97% of the mass, and the 29 electrons hold the rest. So the mass is real, just concentrated into a speck.

One level deeper, the surprise gets bigger. The three [[quark|quarks]] in a proton supply only about 1% of its mass. The other 99% is **energy**: the motion of the quarks and the strong force field binding them. Because $E=mc^2$, trapped energy behaves as mass. So most of the mass in your hand comes from energy locked inside protons and neutrons, not from solid little balls.

And the "empty" space is not truly nothing. It is filled by electric fields and the electron cloud. That is why your finger stops at a table: the table's electrons repel yours, even though no particles touch.

## Engineering
Electronics rarely uses mass directly, because electric forces are so strong and electrons so light. It still matters in three places: electron mass sets how carriers accelerate in a field, the same $F=ma$ drives MEMS accelerometers, and every gram on a drone costs flight time.

## Math
$$F = ma$$ Newton's second law: force equals mass times acceleration. Mass is what links them.
$$a = \frac{F}{m}$$ The same force gives less acceleration to more mass.
$$W = mg$$ Weight in newtons, with $g = 9.81\ \text{m/s}^2$ on Earth.
$$m = \frac{E}{c^2}$$ Energy has mass. This is where most of a proton's mass comes from.

## Example
Q: A 1.5 kg drone must hover. How much thrust do the motors need?
- Thrust must equal weight
- $W = mg = 1.5\times9.81$
A: 14.7 N. Add any mass and the motors must work harder, which drains the battery sooner.
Q: The same 10 N push acts on a 2 kg and a 5 kg object. Compare their accelerations.
- $a = F/m = 10/2 = 5\ \text{m/s}^2$
- $a = 10/5 = 2\ \text{m/s}^2$
A: The heavier object accelerates 2.5 times less. That is inertia.

## Watch out
In daily speech, "weight" often means mass, as in "I weigh 70 kg". In physics, kilograms measure mass and newtons measure weight.

## EgireRobotics
A mass budget matters as much as a power budget. Every extra gram raises hover thrust, and hover power grows faster than mass does.

## Check
Q: An astronaut carries a 10 kg box to the Moon. What changes?
- Its mass falls to about 1.6 kg
+ Its weight falls, but its mass stays 10 kg
- Both stay the same
W: Mass belongs to the object. Weight depends on local gravity.
Q: Where is nearly all of an atom's mass?
- In the electron cloud
+ In the nucleus
- Spread evenly through the atom
W: Protons and neutrons are about 1836 times heavier than electrons, and they sit in the nucleus.

# states-of-matter: States of matter
kind: concept
level: 1
needs: matter
see: dielectric-breakdown, band-theory
> Solid, liquid, gas and plasma differ in how tightly the particles are held.

The same atoms behave differently depending on how much thermal energy they have compared with the forces holding them together.

- **Solid:** atoms sit in fixed positions. Electronics is built almost entirely from solids.
- **Liquid:** atoms slide past each other. Solder is a metal you briefly make liquid.
- **Gas:** particles fly freely. Air is a good insulator until it breaks down.
- **Plasma:** atoms are stripped of electrons, so the gas conducts. A spark or a lightning bolt is a plasma channel.

## Engineering
Solder joints depend on the solid to liquid transition. A high voltage arc turns air into plasma, which is why boards with high voltage need clearance between traces.

# atom: Atom
kind: particle
level: 1
needs: matter
viz: atom
see: periodic-table
> The smallest piece of an element: a tiny nucleus with electrons around it.

An atom is the smallest unit that still has the identity of an element. It has a dense central [[nucleus]] holding [[proton|protons]] and [[neutron|neutrons]], surrounded by [[electron|electrons]].

| Particle | Electrical charge | Location | Made of |
|---|---|---|---|
| Proton | Positive (+1) | Nucleus | Quarks (u u d) |
| Neutron | Neutral (0) | Nucleus | Quarks (u d d) |
| Electron | Negative (−1) | Electron cloud | Nothing smaller known |

A neutral atom has equal numbers of protons and electrons, so the charges cancel. The number of protons, called the atomic number $Z$, decides which element it is: 1 is hydrogen, 14 is silicon, 29 is copper.

An atom that loses or gains electrons becomes an **ion**. This is the first place in the story where a net charge appears.

## Engineering
The outermost electrons, called valence electrons, do almost all of the work in electronics. Copper has one loosely held valence electron, which is why it conducts. Silicon has four, which is why it forms a neat crystal that can be tuned by doping.

## Math
$$Z = n_p$$ Atomic number equals the number of protons.
$$A = n_p + n_n$$ Mass number counts protons plus neutrons.
$$q_{\text{net}} = (n_p - n_e)\,e$$ Net charge of an atom or ion.

## Example
Q: A copper atom ($Z=29$) loses 2 electrons. What is its net charge?
- $n_p - n_e = 29 - 27 = 2$
- $q = 2e = 2 \times 1.602\times10^{-19}\ \text{C}$
A: $q = 3.2\times10^{-19}\ \text{C}$, written Cu²⁺.

## Watch out
Protons and neutrons are not truly fundamental. Only the electron in this table is. Protons and neutrons are built from [[quark|quarks]]. Many beginner courses call all three fundamental, which is fine for circuits and wrong for physics.

The picture of electrons circling like planets is a useful drawing, not reality. See [[orbital]].

## Check
Q: What decides which element an atom is?
- Number of electrons
+ Number of protons
- Number of neutrons
W: Electrons can be gained or lost, and neutrons vary between isotopes. Change the proton count and you have a different element.

# electron: Electron
kind: particle
level: 1
needs: atom
see: lepton, electric-charge
viz: atom
> The light, negatively charged particle that does the moving in almost all electronics.

The electron carries a charge of $-e$ and has a mass about 1836 times smaller than a proton. Being so light, and sitting on the outside of atoms, it is the particle that moves when current flows in a metal.

As far as anyone has measured, the electron has no internal parts. It is a true elementary particle, a member of the [[lepton]] family.

The electron also has **spin**, an intrinsic angular momentum, which makes it behave like a tiny magnet. Spin is why [[magnetic-materials|magnets]] exist, and the [[pauli-exclusion|Pauli exclusion principle]] that applies to it is why atoms have shells at all.

## Math
$$m_e = 9.109\times10^{-31}\ \text{kg}$$ Electron rest mass.
$$e = 1.602176634\times10^{-19}\ \text{C}$$ Magnitude of its charge. This value is exact by definition of the SI.

## Check
Q: Why is it electrons, not protons, that move through a copper wire?
+ Protons are locked in nuclei inside the crystal; valence electrons can move between atoms
- Protons have no charge
- Electrons are heavier
W: In a metal the nuclei stay in the lattice. Only the outer electrons are free to drift.
Q: Which particle has a negative charge?
- Proton
- Neutron
+ Electron
- Nucleus
W: Electrons carry −e. Protons are positive, neutrons are neutral, and a nucleus is positive overall.

# nucleus: Atomic nucleus
kind: particle
level: 1
needs: atom
see: strong-force
> The tiny, dense centre of the atom holding nearly all of its mass.

The nucleus is about 100,000 times smaller across than the atom, yet holds more than 99.9% of its mass. It contains positive protons packed together, and they repel each other fiercely. Something stronger must hold them. That is the [[strong-force|strong force]].

For electronics the nucleus mostly just sits there. It provides the positive charge that holds electrons, and forms the fixed lattice that moving electrons bump into.

## Math
$$r \approx 1.2\ \text{fm}\times A^{1/3}$$ Approximate nuclear radius (1 fm = $10^{-15}$ m).

# proton: Proton
kind: particle
level: 1
needs: nucleus
viz: quarks
> A positive particle in the nucleus. Its count defines the element.

A proton has charge $+e$, exactly opposite to the electron. It is a composite particle made of two up quarks and one down quark, bound by gluons.

That its charge exactly cancels the electron's, to better than one part in $10^{21}$, is one of the most precise facts in physics. It is why bulk matter is electrically neutral.

## Math
$$m_p = 1.673\times10^{-27}\ \text{kg}$$ About 1836 times the electron's mass.
$$q_p = \tfrac23 e + \tfrac23 e - \tfrac13 e = +e$$ Charge of u + u + d.

# neutron: Neutron
kind: particle
level: 1
needs: nucleus
viz: quarks
> A neutral particle in the nucleus that helps hold it together.

A neutron has no net charge, but it is made of charged parts: one up quark and two down quarks. It adds strong-force glue without adding electric repulsion, which is why heavy nuclei need more neutrons than protons.

Atoms of one element with different neutron counts are **isotopes**. A free neutron is unstable and decays in about 15 minutes into a proton, an electron and an antineutrino.

## Math
$$q_n = \tfrac23 e - \tfrac13 e - \tfrac13 e = 0$$ Charge of u + d + d.

# quark: Quarks
kind: particle
level: 2
needs: proton, neutron
see: strong-force, standard-model
viz: quarks, standard-model
> The elementary particles inside protons and neutrons, with fractional charges.

Quarks are elementary particles that come in six flavours: up, down, charm, strange, top, bottom. Ordinary matter only uses up and down.

| Flavour | Charge | Found in |
|---|---|---|
| Up (u) | $+\tfrac23 e$ | Protons, neutrons |
| Down (d) | $-\tfrac13 e$ | Protons, neutrons |

Quarks are never seen alone. Pull two apart and the energy you put in creates new quarks. This is called **confinement**. So the smallest free charge you can ever measure on a wire is still $e$, not a fraction of it.

## Math
$$p = uud,\qquad n = udd$$ The quark content of the two nucleons.

## Watch out
Most of a proton's mass is not the mass of its quarks. The three quarks contribute around 1%. The rest is the energy of the strong field binding them, which is $E=mc^2$ in action.

## Check
Q: What is the charge of a particle made of u, u, d?
+ +1 e
- 0
- +2 e
W: ⅔ + ⅔ − ⅓ = +1. That is a proton.

# lepton: Leptons
kind: particle
level: 2
needs: electron
see: standard-model
viz: standard-model
> The family of elementary particles that ignore the strong force. The electron is one.

Leptons are the other branch of elementary matter. There are six: the electron, muon and tau, each with a matching neutrino.

So your question, "is matter quarks or leptons?", has a clean answer: **ordinary matter is both.** Quarks build the nucleus, and a lepton, the electron, surrounds it. All of electronics runs on that one lepton.

| Lepton | Charge | Note |
|---|---|---|
| Electron | $-e$ | Stable, in all atoms |
| Muon | $-e$ | Heavy cousin, lives 2.2 µs |
| Tau | $-e$ | Heavier still |
| Neutrinos (3 kinds) | 0 | Almost never interact |

## Engineering
One real engineering link: cosmic-ray muons reach ground level and can flip bits in memory. Radiation-tolerant design for aerospace electronics has to account for this.

# standard-model: Standard Model
kind: concept
level: 2
needs: quark, lepton
see: fundamental-forces
viz: standard-model
> The full table of known elementary particles and forces.

The Standard Model is the best tested theory in science. It contains twelve matter particles (six [[quark|quarks]] and six [[lepton|leptons]]), the force carriers ([[gauge-boson|bosons]]), and the Higgs boson.

Matter particles are **fermions**, which obey [[pauli-exclusion|exclusion]] and refuse to share a state. Force carriers are **bosons**, which do not. That one distinction is why matter has structure and light does not.

Everything in your lab uses only four of the particles: up quark, down quark, electron and photon.

## Watch out
The Standard Model does not include gravity, and it does not explain dark matter. For electronics this does not matter at all; it is simply honest to say it is not a complete theory of the universe.

# fundamental-forces: The four fundamental forces
kind: concept
level: 2
needs: standard-model
> Gravity, electromagnetism, the strong force and the weak force.

All interactions reduce to four forces.

| Force | Relative strength | Range | Job |
|---|---|---|---|
| Strong | 1 | Inside the nucleus | Binds quarks and nuclei |
| Electromagnetic | 1/137 | Infinite | Atoms, chemistry, all electronics |
| Weak | $10^{-6}$ | Sub-nuclear | Radioactive decay |
| Gravity | $10^{-38}$ | Infinite | Planets, and your drone's weight |

The electromagnetic force is vastly stronger than gravity. A small fridge magnet lifts a paperclip against the gravity of the entire Earth. Everything on this board after Phase 0 is the electromagnetic force, seen from different angles.

## Check
Q: Which force is responsible for all of electronics and chemistry?
- Gravity
- The strong force
+ The electromagnetic force
W: The strong and weak forces stay inside the nucleus, and gravity is far too weak at this scale.

# strong-force: Strong force
kind: concept
level: 2
needs: fundamental-forces
see: quark, nucleus
> The force that binds quarks together and holds the nucleus against proton repulsion.

The strong force is carried by gluons. It binds quarks into protons and neutrons, and a leftover of it binds those nucleons into a nucleus. It is why the positive charges in a nucleus do not fly apart. Its range is only about $10^{-15}$ m, so it has no direct role in a circuit.

# gauge-boson: Force carriers (bosons)
kind: particle
level: 2
needs: standard-model
see: photon
viz: standard-model
> Particles that transmit forces: photon, gluon, W and Z. The Higgs gives masses.

In quantum field theory, particles feel forces by exchanging bosons.

- **Photon:** electromagnetic force.
- **Gluon:** strong force.
- **W and Z:** weak force.
- **Higgs boson:** not a force carrier; its field gives mass to elementary particles.

# photon: Photon
kind: particle
level: 2
needs: gauge-boson
see: em-waves, led
> The quantum of light and the carrier of the electromagnetic force.

A photon is a packet of electromagnetic energy with no mass or charge. Radio waves, infrared, visible light and X-rays are all photons, and differ only in energy.

Two charges push on each other through the electromagnetic field, whose quantum is the photon. In an [[led]], an electron falling across a band gap emits a photon. In a solar cell or [[photodiode]] the reverse happens.

## Math
$$E = hf = \frac{hc}{\lambda}$$ Photon energy, where $h = 6.626\times10^{-34}$ J·s.

## Example
Q: What is the energy of a red photon with $\lambda = 650$ nm, in electron-volts?
- $E = hc/\lambda = (6.626\times10^{-34})(3\times10^{8})/(650\times10^{-9}) = 3.06\times10^{-19}$ J
- Divide by $1.602\times10^{-19}$ J/eV
A: About 1.9 eV, which is why a red LED drops roughly 1.8 to 2 V.

# energy: Energy and mass
kind: quantity
level: 1
needs: matter, force
see: energy-electrical, electric-potential
> The ability to do work. It is conserved, and mass is a form of it.

Energy cannot be created or destroyed, only moved or converted. A battery stores chemical energy, a circuit carries it, and a motor turns it into motion and heat. Every calculation in electronics is ultimately energy bookkeeping.

Forms you will meet: kinetic, potential, thermal, chemical, electrical, magnetic, radiant.

The **electron-volt** (eV) is the natural energy unit at atomic scale: the energy one electron gains across one volt.

Energy is not a thing you can hold. It is a number that tells you how much change something can cause. A raised drone, a hot wire and a charged battery all have energy, because each can make something happen.

**Work** is the word physics uses for energy being moved by a force. Push something 1 metre with 1 newton, and you have done 1 joule of work.

## Math
$$E = mc^2$$ Mass and energy are equivalent.
$$W = F\,d$$ Work is force times distance moved along the force.
$$1\ \text{eV} = 1.602\times10^{-19}\ \text{J}$$ The atomic-scale energy unit.

# quantum-mechanics: Quantum behaviour
kind: concept
level: 2
needs: electron, energy
see: photon, tunneling
> At atomic scale, energy comes in steps and particles behave like waves.

Classical physics fails inside atoms. Three facts replace it.

- **Quantisation:** bound electrons can only have certain energies.
- **Wave nature:** an electron has a wavelength, and it spreads out like a wave.
- **Probability:** you can only predict where an electron is likely to be found.

This is not a side curiosity. Without quantum mechanics there is no explanation of why copper conducts and glass does not, and no semiconductor industry.

## Math
$$\lambda = \frac{h}{p}$$ De Broglie wavelength of a particle with momentum $p$.
$$\Delta x\,\Delta p \ge \frac{\hbar}{2}$$ Heisenberg uncertainty principle.
$$E_n = -\frac{13.6\ \text{eV}}{n^2}$$ Allowed energies of hydrogen.

## Example
Q: How much energy is needed to free hydrogen's electron from its lowest level?
- $E_1 = -13.6/1^2 = -13.6$ eV
- Free means $E = 0$
A: 13.6 eV, the ionisation energy of hydrogen.

# orbital: Electron orbitals
kind: concept
level: 2
needs: quantum-mechanics
viz: atom
> Regions of probability where an electron is likely to be found, labelled s, p, d, f.

An electron in an atom is not a dot on a track. It is a standing wave described by an orbital. Orbitals group into shells ($n = 1, 2, 3 \dots$) and subshells (s, p, d, f).

| Subshell | Orbitals | Max electrons |
|---|---|---|
| s | 1 | 2 |
| p | 3 | 6 |
| d | 5 | 10 |
| f | 7 | 14 |

Copper is $[\text{Ar}]\,3d^{10}\,4s^1$. That lone 4s electron is the conduction electron in every copper wire you will ever solder. Silicon is $[\text{Ne}]\,3s^2\,3p^2$, with four valence electrons.

## Math
$$N_{\max} = 2n^2$$ Maximum electrons in shell $n$.

# pauli-exclusion: Pauli exclusion principle
kind: law
level: 2
needs: orbital
see: band-theory
> No two electrons can share the same quantum state.

Electrons are fermions, so each quantum state holds at most one. An orbital can hold two electrons only because they have opposite spins. As a result electrons stack upward in energy, instead of all dropping to the lowest level.

This single rule produces the shells, the periodic table, chemistry, and the energy [[band-theory|bands]] of solids.

# periodic-table: Periodic table
kind: concept
level: 1
needs: orbital, pauli-exclusion
viz: atom
> Elements arranged by proton count, so that valence behaviour repeats.

The table is a map of valence electrons. Columns share outer-shell structure and so behave alike.

| Group | Valence electrons | Electronics role |
|---|---|---|
| 11: Cu, Ag, Au | 1 | Best conductors |
| 13: B, Al, Ga | 3 | P-type dopants |
| 14: C, Si, Ge | 4 | Semiconductors |
| 15: P, As, Sb | 5 | N-type dopants |
| 18: He, Ne, Ar | Full | Inert gases used in processing |

## Engineering
Doping works because boron sits one column left of silicon and phosphorus one column right. The whole of [[doping]] is readable from this table.

# chemical-bond: Chemical bonding
kind: concept
level: 1
needs: periodic-table
see: insulators
> Atoms share or transfer valence electrons to reach stable arrangements.

Three bond types explain electrical behaviour.

- **Ionic:** electrons transfer completely. Salt. Electrons are locked to ions, so the solid insulates.
- **Covalent:** electrons are shared between neighbours. Silicon, diamond, polymers. They are held tightly, giving insulators and semiconductors.
- **Metallic:** valence electrons belong to the whole crystal. Copper, silver, aluminium. They move freely, giving conductors.

# metallic-bond: Metallic bonding
kind: concept
level: 1
needs: chemical-bond
> Positive ions in a shared sea of electrons. This is why metals conduct.

In a metal, each atom releases its valence electrons into a shared pool. The ions form a rigid lattice, and the pool flows through it. That sea of [[free-electrons|free electrons]] is what you connect to when you solder a wire. It also explains why metals carry heat well, shine, and bend without shattering.

# crystal-lattice: Crystal lattice
kind: concept
level: 1
needs: chemical-bond
see: silicon-crystal
> Atoms repeating in a regular 3D pattern. The basis of solid-state electronics.

A crystal is a pattern of atoms repeated in three dimensions. Copper has a face-centred cubic lattice. Silicon has a diamond cubic lattice, where each atom bonds to four neighbours.

Because the atoms are periodic, an electron wave passing through can only have certain energies. This produces energy bands. Lattice vibrations, called **phonons**, scatter electrons, and this is the origin of resistance rising with heat.

## Math
$$a_{\text{Si}} = 0.543\ \text{nm}$$ Silicon lattice constant.

# motion: Motion: speed and acceleration
kind: quantity
level: 1
needs: matter
> Speed is how fast position changes. Acceleration is how fast speed changes.

Everything electrical comes down to things moving, so we need exact words for movement.

- **Speed:** distance covered per second. A car at 20 m/s travels 20 metres each second.
- **Velocity:** speed plus direction.
- **Acceleration:** how quickly velocity changes. Speeding up, slowing down and turning are all acceleration.
- **Momentum:** mass multiplied by velocity, or how much motion something carries.

An object with no force on it does not stop. It keeps moving in a straight line at a steady speed. In daily life, friction hides this. In the empty space inside a crystal, it is why an electron keeps moving until it hits something.

## Math
$$v = \frac{d}{t}$$ Speed: distance over time.
$$a = \frac{\Delta v}{\Delta t}$$ Acceleration: change in velocity over time.
$$p = mv$$ Momentum.

## Example
Q: A drone goes from rest to 12 m/s in 3 s. What is its average acceleration?
- $a = 12/3$
A: 4 m/s².

## Check
Q: A drone flies a circle at a constant 10 m/s. Is it accelerating?
+ Yes, as its direction keeps changing
- No, as its speed is constant
- Only if it climbs
W: Acceleration is any change in velocity, and velocity includes direction.

# force: Force
kind: quantity
level: 1
needs: motion
see: fundamental-forces, coulomb-law
> A push or a pull. Forces are what change motion.

A force is any push or pull. Your hand on a door, gravity on a falling phone, and a magnet tugging a paperclip are all forces. Forces do not need contact: gravity, electric and magnetic forces all reach across empty space.

Forces change motion. With no net force, an object just carries on as it was. With a net force, it accelerates.

Forces have a direction as well as a size. Two equal forces in opposite directions cancel. This is why a hovering drone stays put: thrust up, weight down, net force zero.

Forces also come in pairs. If you push a wall, the wall pushes back equally. A propeller pushes air down, and the air pushes the propeller up. That is thrust.

Every push in daily life comes down to just four basic forces. See [[fundamental-forces]].

## Math
$$F_{\text{net}} = ma$$ Net force causes acceleration.
$$1\ \text{N} = 1\ \text{kg·m/s}^2$$ The newton. About the weight of a small apple.

## Example
Q: A 2 kg drone has 25 N of thrust pointing straight up. What is its acceleration?
- Weight $= 2\times9.81 = 19.6$ N
- Net force $= 25-19.6 = 5.4$ N
- $a = 5.4/2$
A: 2.7 m/s² upwards.

## Check
Q: A drone hovers perfectly still. What is the net force on it?
+ Zero
- Equal to its weight
- Equal to its thrust
W: Thrust and weight balance, so nothing changes its motion.

# heat-temperature: Heat and temperature
kind: quantity
level: 1
needs: energy, atom
see: joule-heating, thermal-design
> Temperature measures how fast particles jiggle. Heat is energy moving from hot to cold.

All atoms are constantly moving. In a solid, they vibrate around fixed positions. **Temperature** measures how vigorous that jiggling is. Hotter means faster.

**Heat** is different. It is energy on the move, flowing from something hotter to something colder. A hot wire does not "contain heat"; it contains thermal energy, and heat is what flows out of it.

Scientists use the kelvin scale, which starts at absolute zero, where the jiggling is at its minimum. Room temperature is about 300 K. One kelvin is the same step as one degree Celsius.

This is why resistance exists. Moving electrons bump into vibrating atoms and hand them energy, so the atoms vibrate more, and the wire gets hotter. See [[joule-heating]].

## Math
$$T_K = T_C+273.15$$ Celsius to kelvin.
$$Q = mc\,\Delta T$$ Heat needed to warm a mass $m$, where $c$ is the specific heat.

## Example
Q: How much heat does it take to warm 10 g of copper by 50 °C? ($c = 385$ J/kg·K)
- $Q = 0.01\times385\times50$
A: About 193 J. A 10 W loss would do that in about 19 s.

## Check
Q: Which is the best description of heat?
+ Energy flowing from hot to cold
- A substance stored in hot objects
- Another word for temperature
W: Temperature describes a state. Heat is energy in transit.

# waves: Waves
kind: concept
level: 1
needs: energy, motion
see: sine-wave, em-waves, photon, frequency
viz: phasor
> A pattern that carries energy from place to place without carrying matter along.

Drop a stone in a pond. Ripples travel outwards, yet the water itself only bobs up and down. A wave carries energy, not the stuff it travels through.

Three numbers describe a wave.

- **Amplitude:** how big it is.
- **Wavelength:** the distance between crests.
- **Frequency:** how many crests pass each second.

Sound is a wave in air. Radio and light are waves in electric and magnetic fields, and need no material at all. AC mains is a wave of voltage over time.

## Math
$$v = f\lambda$$ Wave speed equals frequency times wavelength.

## Example
Q: Sound travels at 343 m/s. What is the wavelength of a 1 kHz tone?
- $\lambda = 343/1000$
A: 0.34 m.

## Check
Q: What does a wave carry from place to place?
+ Energy
- The material it travels through
- Electrons
W: Particles of the medium move only locally, while energy travels along.

# newton-laws: Newton's laws of motion
kind: law
level: 1
needs: force, mass
see: motion, lorentz-force
> Three rules that connect force, mass and motion.

- **First law:** an object keeps doing what it is doing unless a net force acts on it. This is inertia.
- **Second law:** net force equals mass times acceleration.
- **Third law:** every force has an equal and opposite partner.

All three are at work in a hovering drone. The first says it stays put while forces balance. The second tells you how quickly it climbs when thrust rises. The third is how thrust exists at all: the propeller throws air down, and the air pushes the propeller up.

## Engineering
The same laws describe electrons between collisions, and the tiny moving mass inside a MEMS accelerometer.

## Math
$$\sum F = 0 \Rightarrow a = 0$$ First law.
$$F = ma$$ Second law.
$$F_{AB} = -F_{BA}$$ Third law.

## Example
Q: A 2 kg drone needs to climb at 1 m/s². What thrust does it need?
- Net force: $2\times1 = 2$ N
- Weight: $2\times9.81 = 19.6$ N
A: 21.6 N.

## Check
Q: What pushes a drone upward?
+ The air, reacting to being pushed down by the propellers
- The battery
- Gravity
W: That is Newton's third law.

# energy-conservation: Conservation of energy
kind: law
level: 1
needs: energy
see: kvl, efficiency, lenz-law
> Energy is never created or destroyed. It only changes form.

The total energy of a closed system stays constant. This is the first law of thermodynamics, and it is the most useful check in engineering. If your sums show more power out than in, the sums are wrong.

It sits behind [[kvl|Kirchhoff's voltage law]], [[lenz-law|Lenz's law]], and every efficiency figure on this board. "Lost" energy is not gone. It became heat.

## Math
$$E_{in} = E_{out}+E_{\text{stored}}+E_{\text{heat}}$$ Energy balance.

## Example
Q: A motor takes 100 W, and 88 W reaches the propeller. Where is the rest?
- $100-88$
A: 12 W becomes heat in the windings, ESC and bearings.

## Check
Q: An engineer claims a converter gives 12 W out from 10 W in. What is true?
+ It is impossible
- It is very efficient
- It is possible at high frequency
W: Voltage can rise, but energy cannot appear from nowhere.
