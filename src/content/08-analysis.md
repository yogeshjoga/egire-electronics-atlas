@phase 8 | Circuit analysis | Systematic ways to solve any linear circuit

# voltage-divider: Voltage divider
kind: method
level: 1
needs: series, resistor
viz: divider
> Two resistors give a fixed fraction of a voltage.

Two series resistors share the source voltage in proportion to their values. It is the most common small circuit in electronics.

## Math
$$V_{\text{out}} = V_{\text{in}}\frac{R_2}{R_1+R_2}$$ Unloaded output.

## Example
Q: Scale a 25.2 V battery to 3.3 V for an ADC. If $R_2 = 10$ kΩ, what is $R_1$?
- $3.3 = 25.2\times\frac{10k}{R_1+10k}$
- $R_1 + 10k = 76.4k$
A: About 66 kΩ, then use a standard value such as 68 kΩ.

## Watch out
A load in parallel with $R_2$ changes the ratio. Dividers are for signals and references, not for powering things.

## Lab
Build 10 kΩ over 10 kΩ on 5 V. Measure the output, then add a 10 kΩ load, and see it fall to 1.67 V.

## EgireRobotics
Every flight controller's battery voltage input is a divider into the ADC.

## Check
Q: With 10 V in, R1 = 3 kΩ and R2 = 2 kΩ, what is Vout across R2?
- 6 V
+ 4 V
- 5 V
W: 10 × 2/(3+2) = 4 V.

# current-divider: Current divider
kind: method
level: 1
needs: parallel
> Current splits in inverse proportion to resistance.

Current favours the easier path. A branch's share is the **other** branch's resistance over the total.

## Math
$$I_1 = I_T\frac{R_2}{R_1+R_2}$$ Two-branch divider.

## Example
Q: 3 A enters 10 Ω ∥ 20 Ω. How much goes through the 10 Ω?
- $I_1 = 3\times20/30$
A: 2 A.

## Check
Q: 4 A enters 10 Ω ∥ 30 Ω. How much flows through the 10 Ω?
+ 3 A
- 1 A
- 2 A
W: 4 × 30/40 = 3 A. Most current takes the smaller resistance.

# nodal-analysis: Nodal analysis
kind: method
level: 2
needs: kcl, linear-systems
viz: kirchhoff
> Write KCL at each node and solve for node voltages.

The most general hand method, and the one SPICE uses. Steps:

- Pick a ground node.
- Label the other node voltages.
- Write KCL at each, using $I=(V_a-V_b)/R$.
- Solve the simultaneous equations.

Nodal analysis works for any circuit, and needs one equation per unknown node. If a circuit has $N$ nodes, you need $N-1$ equations.

## Math
$$\mathbf{G}\,\mathbf{v} = \mathbf{i}$$ Conductance matrix form.

## Example
Q: 10 V feeds 1 kΩ to node A; from A, 2 kΩ and 2 kΩ go to ground. Find $V_A$.
- $(10-V_A)/1k = V_A/2k + V_A/2k$
- $10 - V_A = V_A$
A: $V_A = 5$ V.

## Check
Q: A circuit has 4 nodes, including ground. How many equations does nodal analysis need?
+ 3
- 4
- 1
W: One node is the reference, so N − 1.

# mesh-analysis: Mesh analysis
kind: method
level: 2
needs: kvl, linear-systems
viz: kirchhoff
> Write KVL around each loop and solve for loop currents.

Assign a current to each independent loop, write KVL around each, and solve. Shared resistors carry the difference of the mesh currents. It works best on planar circuits with few loops.

## Math
$$\mathbf{R}\,\mathbf{i} = \mathbf{v}$$ Resistance matrix form.

## Example
Q: 12 V drives 2 Ω then a shared 4 Ω, and the second loop adds 2 Ω. Find both mesh currents.
- $6i_1-4i_2 = 12$
- $-4i_1+6i_2 = 0$, so $i_2 = \tfrac23i_1$
A: $i_1 = 3.6$ A and $i_2 = 2.4$ A. The shared 4 Ω carries 1.2 A.

# superposition: Superposition theorem
kind: law
level: 2
needs: nodal-analysis
> In a linear circuit, solve each source alone, then add.

Replace all but one independent source (voltage sources become shorts, current sources become opens), solve, and repeat for each. Add up the results.

It explains how a signal and a DC bias coexist in an amplifier.

## Example
Q: 12 V feeds a node through 6 Ω, the node has 3 Ω to ground, and 3 A is injected into it. Find the node voltage.
- Voltage source alone: $12\times3/9 = 4$ V
- Current source alone: $3\times(6\parallel3) = 6$ V
A: $4+6 = 10$ V.

## Watch out
Works for voltage and current, not for power, since power is squared and so non-linear.

## Check
Q: When a voltage source is switched off in superposition, it becomes:
+ A short circuit
- An open circuit
- A resistor
W: Zero volts across it means a wire. Current sources become open circuits.

# thevenin: Thevenin's theorem
kind: law
level: 2
needs: ideal-sources, voltage-divider, nodal-analysis
viz: thevenin
> Any linear network looks like one voltage source and one resistor.

From the outside, any linear circuit with two terminals is identical to a voltage $V_{th}$ in series with $R_{th}$. So a complicated network becomes a single line of algebra.

- $V_{th}$: open-circuit voltage.
- $R_{th}$: resistance seen with sources off.

## Math
$$V_{th} = V_{oc}$$ Open-circuit voltage.
$$R_{th} = \frac{V_{oc}}{I_{sc}}$$ Also the resistance with sources removed.
$$I_L = \frac{V_{th}}{R_{th}+R_L}$$ Current into any load.

## Example
Q: Find the Thevenin equivalent of 12 V with 6 kΩ over 6 kΩ, tapped at the middle.
- $V_{th} = 12\times\frac{6}{12} = 6$ V
- $R_{th} = 6k\parallel6k = 3$ kΩ
A: 6 V in series with 3 kΩ.

## Lab
Measure a circuit's open-circuit voltage, then add a load and measure again. Those two readings give $V_{th}$ and $R_{th}$ with no need to know what's inside.

## EgireRobotics
A battery is a Thevenin source: EMF in series with internal resistance. That single model predicts voltage sag.

## Check
Q: What is $V_{th}$?
+ The open-circuit voltage at the terminals
- The short-circuit current
- The supply's rated voltage
W: With nothing attached, the terminals show V_th.

# norton: Norton's theorem
kind: law
level: 2
needs: thevenin
> The same idea with a current source and parallel resistor.

Any two-terminal linear network also equals a current source in parallel with a resistor. Thevenin and Norton convert directly.

## Math
$$I_N = \frac{V_{th}}{R_{th}}$$ Conversion, with $R_N = R_{th}$.

## Example
Q: Convert 6 V in series with 3 kΩ to Norton form.
- $I_N = 6/3000$
A: 2 mA in parallel with 3 kΩ.

# max-power: Maximum power transfer
kind: law
level: 2
needs: thevenin, power-formulas
viz: thevenin
> A load takes the most power when its resistance equals the source's.

Too small a load: lots of current, but tiny voltage. Too large: voltage but no current. The peak is at $R_L = R_{th}$.

## Math
$$P_L = \frac{V_{th}^2R_L}{(R_{th}+R_L)^2}$$ Load power.
$$P_{\max} = \frac{V_{th}^2}{4R_{th}}$$ At $R_L = R_{th}$.

## Watch out
At that point efficiency is only 50%. Power systems never work there. RF and antenna systems do, since matching matters more than efficiency.

## Check
Q: What is the efficiency at maximum power transfer?
+ 50%
- 100%
- 25%
W: Source and load resistances are equal, so each takes half.

# spice: Circuit simulation (SPICE)
kind: method
level: 2
needs: nodal-analysis, diff-eq
> Software that solves your circuit before you build it.

SPICE turns a circuit into nodal equations, then solves them numerically. Free tools include LTspice and ngspice, and KiCad includes one.

- **Operating point:** DC voltages at every node.
- **Transient:** waveforms over time.
- **AC sweep:** gain and phase against frequency.

## Watch out
A simulation is only as good as its models. It doesn't include your layout's parasitics unless you add them.

## Lab
Simulate an RC filter in LTspice, and compare it with one you built.

# source-transformation: Source transformation
kind: law
level: 2
needs: ideal-sources, ohms-law
see: thevenin, norton
> Swap a voltage source and series resistor for a current source and parallel resistor.

From the outside, these two look identical, so you can swap whichever makes a circuit simpler. Repeated swaps can reduce a network to one source.

## Math
$$I_s = \frac{V_s}{R},\quad R\ \text{unchanged}$$ Conversion.

## Example
Q: Convert 12 V in series with 4 Ω.
- $I = 12/4$
A: 3 A in parallel with 4 Ω.

# millman: Millman's theorem
kind: law
level: 2
needs: nodal-analysis, parallel
viz: kirchhoff
> A quick formula for the voltage where several branches meet.

If many branches join between two nodes, each with a source and a resistor, the shared voltage is a weighted average. It's a shortcut for one line of nodal analysis.

## Math
$$V = \frac{\sum V_k/R_k}{\sum 1/R_k}$$ Common node voltage.

## Example
Q: 12 V through 100 Ω and 5 V through 150 Ω meet at a node, with 220 Ω to ground. Find the voltage.
- Top: $0.12+0.0333 = 0.1533$
- Bottom: $0.01+0.00667+0.00455 = 0.02121$
A: 7.23 V, matching the Kirchhoff simulator.

## EgireRobotics
This explains what happens when batteries or supplies are joined in parallel: the node settles at a resistance-weighted average.

# reciprocity: Reciprocity theorem
kind: law
level: 3
needs: superposition
see: antenna
> In a passive linear network, swapping source and meter gives the same reading.

Put a voltage source in one branch and read current in another. Swap them, and the reading is unchanged. This holds for networks of R, L and C, but not ones with amplifiers.

Its best-known result: an antenna has the same pattern when transmitting as when receiving.

## Check
Q: Which circuit does reciprocity not apply to?
+ One containing an amplifier
- A resistor network
- An LC filter
W: Active parts work in one direction.

# tellegen: Tellegen's theorem
kind: law
level: 3
needs: kcl, kvl
> The powers in all branches of a circuit add up to zero.

If a circuit obeys KCL and KVL, the power delivered by sources exactly equals the power taken by everything else. It holds for any kind of component, linear or not. Use it to check your answers.

## Math
$$\sum_k v_ki_k = 0$$ Sum over all branches.

## Example
Q: A 12 V source gives 2 A. One resistor drops 9 V and another 3 V. Check the power.
- Source: $-24$ W
- Resistors: $18+6$ W
A: The total is zero, so the solution balances.
