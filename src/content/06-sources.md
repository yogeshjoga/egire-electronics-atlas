@phase 6 | Electrical sources | Cells, batteries, DC and AC

# emf: Electromotive force
kind: quantity
level: 2
needs: voltage, energy
> The energy per coulomb that a source supplies by non-electric means.

A resistor drops voltage. A source does the opposite, lifting charge to a higher potential using chemical, magnetic, or light energy. That energy per coulomb is the EMF, $\mathcal{E}$. Despite its name it is a voltage, not a force.

Think of a water pump in a closed pipe loop. The pump does not create water. It lifts water that is already there, and that water falls back down through the pipes. A source does the same to charge: it lifts each coulomb up by a fixed energy, and the circuit lets it back down.

## Math
$$\mathcal{E} = \frac{W}{Q}$$ Energy supplied per unit charge.

## Check
Q: What does a source give each coulomb of charge?
+ Energy
- Extra electrons
- Extra mass
W: EMF is energy per coulomb. The charge itself goes round the loop.

# ideal-sources: Ideal voltage and current sources
kind: concept
level: 1
needs: emf, ohms-law
> Models: a perfect source holds its voltage, or current, regardless of load.

Ideal voltage sources hold $V$ at any current. Ideal current sources hold $I$ at any voltage. They do not exist physically, but real sources are modelled as an ideal source plus a resistance. This modelling is the idea behind [[thevenin]] and [[norton]].

## Example
Q: A 4.2 V cell is joined in parallel with a 3.7 V cell, each with 10 mΩ internal resistance. What current flows?
- $I = (4.2-3.7)/0.02$
A: 25 A. This is why you must never parallel cells at different charge levels.

## Watch out
Never connect two voltage sources directly in parallel unless they are equal. The only thing limiting the current between them is their small internal resistance.

## Check
Q: What is the voltage across an ideal current source?
+ Whatever the rest of the circuit needs it to be
- Always zero
- Always 5 V
W: An ideal current source fixes its current, and voltage follows from the load.

# internal-resistance: Internal resistance
kind: quantity
level: 1
needs: ideal-sources, series
viz: battery
> Every real source sags under load because of its own resistance.

A battery behaves like an ideal EMF in series with a small resistance $r$. When current flows, some voltage is lost inside, so terminal voltage falls and the battery warms.

## Math
$$V_t = \mathcal{E} - Ir$$ Terminal voltage under load.
$$P_{\text{loss}} = I^2r$$ Heat inside the battery.

## Example
Q: A 4S pack reads 16.0 V open and sags to 14.8 V at 60 A. Find $r$.
- $r = (16.0 - 14.8)/60$
A: 20 mΩ, with 72 W of heat inside the pack.

## Lab
Measure a cell's open voltage, then its voltage with a known load resistor across it. Using $r = (V_{open}-V_{load})/I$ gives internal resistance. Use a low-power cell and a suitable resistor, and keep the test short.

## EgireRobotics
Voltage sag on punch-out is $Ir$. Your flight controller's low-voltage alarm must allow for it, or it will trigger falsely under throttle.

## Check
Q: Battery voltage falls when you throttle up. What causes this?
+ Current flowing through internal resistance
- The battery losing charge instantly
- Wire colour
W: The drop is I × r, and it recovers when current falls.

# electrochemical-cell: How a cell works
kind: concept
level: 1
needs: emf, chemical-bond
> Chemistry pushes electrons out one terminal and takes them in the other.

Two electrodes with different appetites for electrons sit in an electrolyte. A chemical reaction makes one electrode electron-rich, so electrons want to get to the other side. The electrolyte blocks them, and offers a path only for ions, so the electrons must travel through your external circuit.

In lithium-ion cells, $\text{Li}^+$ ions shuttle between a graphite anode and a metal-oxide cathode.

Why is a cell's voltage fixed? It comes from chemistry, not size. Each electrode material holds electrons with a certain strength, and the difference sets the voltage. Making a cell bigger adds capacity, not voltage.

When charging, an external source forces the reaction to run backwards. Only some reactions can be reversed cleanly, which is why some batteries are not rechargeable.

## Check
Q: What does making a lithium cell physically larger change?
+ Its capacity, not its voltage
- Its voltage, not its capacity
- Neither
W: Voltage comes from the chemistry. More material stores more charge.

# battery-types: Battery chemistries
kind: concept
level: 1
needs: electrochemical-cell
> Different chemistries trade off voltage, energy density, power and safety.

| Chemistry | Cell voltage | Energy density | Notes |
|---|---|---|---|
| Alkaline | 1.5 V | Medium | Not rechargeable |
| NiMH | 1.2 V | Low | Robust |
| Lead-acid | 2.0 V | Very low | Cheap, heavy |
| Li-ion | 3.6 V | High | Long endurance |
| LiPo | 3.7 V | High | High discharge |
| LiFePO₄ | 3.2 V | Medium | Very safe, long life |

Energy density is what matters most for flying. Approximate figures: lead-acid 35 Wh/kg, NiMH 80 Wh/kg, LiFePO₄ 120 Wh/kg, LiPo 150–200 Wh/kg, and Li-ion 200–260 Wh/kg.

## Example
Q: How heavy is a 111 Wh pack at 200 Wh/kg?
- $111/200$
A: About 0.56 kg.

## EgireRobotics
LiPo gives high current for agile flight. Li-ion gives more energy per kg for long, gentle missions, but lower peak current.

# lipo: LiPo batteries
kind: component
level: 1
needs: battery-types, capacity-ah-wh
viz: battery
> The drone standard: high power, and needs careful handling.

A LiPo cell is 3.7 V nominal, 4.2 V full, and about 3.5 V under load at the safe limit. The "S" count is cells in series; "P" is cells in parallel.

Under load, voltage falls steadily, then drops sharply near empty. So the last few percent are not really usable, and running into that knee damages cells.

Cells also age. Heat, high discharge rates and storing them fully charged all raise internal resistance over time.

## Math
$$V_{\text{pack}} = S\times3.7\ \text{V}$$ Nominal voltage.
$$V_{\text{full}} = S\times4.2\ \text{V}$$ Peak voltage.

## Example
Q: What are the nominal and full voltages of a 6S pack?
- $6\times3.7 = 22.2$ V
- $6\times4.2 = 25.2$ V
A: 22.2 V nominal, 25.2 V full.

## Watch out
Never discharge below about 3.0 V per cell, charge with balance leads, and store at 3.8 V per cell. Punctured or swollen packs can ignite.

## Lab
Log pack voltage against time during a controlled, supervised discharge. Find the knee in the curve.

## EgireRobotics
Land at about 3.5 V per cell under load. Track internal resistance per pack, because a rising value tells you a pack is ageing before it fails.

## Check
Q: What is the safest storage voltage for a LiPo cell?
+ About 3.8 V
- 4.2 V
- 3.0 V
W: Full cells age fast in storage, and very low cells can be permanently damaged.

# c-rating: C-rating
kind: quantity
level: 1
needs: lipo
viz: battery
> Discharge current expressed as a multiple of capacity.

A 1C rate empties a battery in one hour. A pack's C-rating gives its claimed maximum continuous current.

## Math
$$I_{\max} = C\times\text{Ah}$$ Maximum current from C-rating.
$$t = \frac{60}{C_{\text{actual}}}\ \text{min}$$ Time at a given C-rate.

## Example
Q: What is the maximum current of a 5000 mAh 30C pack?
- $I = 30\times5$
A: 150 A, as claimed. Real sustainable current is often lower.
Q: A drone draws 60 A from a 5 Ah pack. What is the C-rate, and how long does the pack last?
- $60/5 = 12$C
- $60/12$ minutes
A: 12C, or 5 minutes in theory. Real time is shorter.

## Watch out
Labelled C-ratings are often optimistic. Internal resistance is a better guide to what a pack can really deliver.

## Check
Q: What is the maximum current from a 2200 mAh 20C pack?
+ 44 A
- 22 A
- 110 A
W: 20 × 2.2 Ah = 44 A.

# battery-packs: Series and parallel packs
kind: method
level: 2
needs: lipo, series, parallel
> Series raises voltage, parallel raises capacity. Energy adds either way.

A 6S2P pack has 12 cells: six series groups of two. Voltage comes from S, capacity and current from P.

## Math
$$V = S\,V_{\text{cell}},\quad \text{Ah} = P\,\text{Ah}_{\text{cell}}$$ Pack totals.

## Example
Q: Find the energy of a 6S2P pack of 3 Ah, 3.6 V cells.
- $V = 21.6$ V, Ah $= 6$
A: 129.6 Wh, which matches 12 cells × 10.8 Wh.

## Watch out
Cells in series all carry the same current, so the weakest cell sets the limit. Parallel groups share voltage, so cells must be at the same charge before they are joined.

## Check
Q: What are the nominal values for 4S2P of 3.7 V, 2 Ah cells?
+ 14.8 V, 4 Ah
- 7.4 V, 8 Ah
- 29.6 V, 2 Ah
W: S multiplies voltage and P multiplies capacity.

# bms: Battery management
kind: system
level: 3
needs: battery-packs, fuses-protection
> Electronics that keep every cell inside safe limits.

A BMS measures each cell's voltage, the pack's current and temperature. It protects against over-voltage, under-voltage, over-current and over-temperature, and balances cells so that none drifts high.

Passive balancing bleeds the highest cells through resistors. Active balancing shuttles charge between cells. State of charge estimation uses [[integral|coulomb counting]] and voltage models.

## Example
Q: One cell is 50 mAh above the rest, and the balancer bleeds 100 mA. How long does it take?
- $50/100$
A: 30 minutes.

## Check
Q: Why are cells balanced?
+ So that no cell overcharges while others are still low
- To raise the pack's voltage
- To reduce mass
W: The pack is only as safe as its most extreme cell.

# dc: Direct current
kind: concept
level: 1
needs: current
> Current that flows in one direction at a steady value.

Batteries, solar cells and almost all electronics use DC. Inside your phone, charger or drone, every chip runs from steady low-voltage DC rails. Most power electronics exists to convert between DC levels.

Real DC is rarely perfect. Supplies have small ripple, and loads cause dips. A chip's datasheet gives the range it accepts, for example 3.0 to 3.6 V.

# ac-intro: Alternating current
kind: concept
level: 1
needs: dc, trigonometry
see: sine-wave, transformer
viz: phasor
> Current that reverses direction repeatedly, normally as a sine wave.

Mains supply reverses 50 times per second in India. AC won the distribution war because a [[transformer]] can raise and lower it cheaply. High voltage means low current, and so low $I^2R$ losses in long lines.

## Math
$$v(t) = V_p\sin(2\pi ft)$$ Sinusoidal voltage.

## Example
Q: Compare line losses at 230 V and 23 kV for the same 23 kW over a 1 Ω line.
- At 230 V: $I=100$ A, loss $=10\,000$ W
- At 23 kV: $I=1$ A, loss $=1$ W
A: Raising voltage 100× cuts losses by 10,000×.

## Watch out
Do not experiment directly with Indian household mains. 230 V AC can kill. Begin with isolated, current-limited low-voltage DC supplies.

## Check
Q: Why does the grid use high voltage for long distances?
+ The same power needs less current, so less is lost as heat
- High voltage travels faster
- Wires are thinner at any current
W: Line loss is I²R, so cutting current has a huge effect.

# charging: Charging lithium batteries
kind: method
level: 2
needs: lipo
see: bms, c-rating
> Constant current first, then constant voltage, always balanced.

Lithium cells charge in two stages.

- **Constant current (CC):** the charger pushes a set current, usually 1C, while voltage rises.
- **Constant voltage (CV):** at 4.2 V per cell, the charger holds voltage and current falls away.

Charging ends when the current drops to a small fraction of the starting value. A balance charger also monitors each cell through the balance lead.

## Math
$$t \approx \frac{\text{Ah}}{I}+t_{CV}$$ CC time plus a CV tail.

## Example
Q: What current should charge a 5000 mAh pack at 1C?
- $1\times5$
A: 5 A, taking a little over an hour.

## Watch out
Never exceed 4.2 V per cell. Overcharging lithium can cause fire. Use a proper charger, a fire-safe location, and stay nearby.

## Check
Q: What happens to charging current in the CV stage?
+ It falls steadily
- It rises
- It stays constant
W: As the cell approaches the set voltage, less current flows.

# faraday-electrolysis: Faraday's laws of electrolysis
kind: law
level: 2
needs: electrochemical-cell, current
see: capacity-ah-wh, lipo
> The amount of chemical change is proportional to the charge passed.

Every electron that passes through a cell drives a fixed amount of chemistry. So charge can be counted in atoms. This law links Ah ratings to actual material, and explains why capacity depends on how much active material a cell holds.

These are different from [[faraday-law|Faraday's law of induction]], by the same scientist.

## Math
$$m = \frac{QM}{zF}$$ Mass changed, with molar mass $M$ and $z$ electrons per ion.
$$F = 96\,485\ \text{C/mol}$$ Faraday constant, about 26.8 Ah per mole.

## Example
Q: How much copper is plated by 1 A for 1 hour? ($M$ = 63.55 g/mol, $z$ = 2)
- $Q = 3600$ C
- $m = 3600\times63.55/(2\times96485)$
A: About 1.19 g.
Q: What is the theoretical capacity of lithium metal? ($M$ = 6.94 g/mol, $z$ = 1)
- $26.8$ Ah per mole, divided by $6.94$ g per mole
A: About 3.86 Ah per gram, which is why lithium is so attractive.

## Check
Q: What sets how much material a cell reaction uses?
+ The total charge passed
- The voltage alone
- The wire length
W: Each electron drives a fixed amount of reaction.
