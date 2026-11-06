@phase 19 | Semiconductor engineering | CMOS, logic cells and fabrication

# cmos-inverter: CMOS inverter
kind: concept
level: 3
needs: mosfet, logic-gates
viz: cmos
> A PMOS and NMOS pair: the basic building block of digital chips.

One PMOS connects to the supply and one NMOS to ground, sharing a gate. Input low: PMOS on, output high. Input high: NMOS on, output low. One is always off, so almost no static current flows.

This is the reason chips with billions of transistors don't melt. Power goes mainly into charging and discharging capacitance when signals switch.

## Math
$$P_{\text{dyn}} = \alpha CV^2f$$ Dynamic power.
$$t_d \approx \frac{CV}{I_{on}}$$ Gate delay.
$$P_{\text{leak}} = I_{\text{leak}}V$$ Static leakage power.

## Example
Q: A block with $C = 1$ nF, 1 V, 1 GHz and activity 0.1. Find the power.
- $0.1\times10^{-9}\times1\times10^{9}$
A: 0.1 W. Cutting V in half reduces power 4×.

## Check
Q: Why does lowering supply voltage save so much power?
+ Dynamic power scales with V squared
- Frequency rises automatically
- Capacitance vanishes
W: P = αCV²f, so 30% lower voltage saves about half the power.

# logic-cells: Standard cells
kind: concept
level: 3
needs: cmos-inverter, combinational
> Pre-designed gate layouts that tools place by the million.

A NAND has parallel PMOS and series NMOS, four transistors in all. Its dual, NOR, has series PMOS, which is slower as holes are less mobile, so NAND is usually preferred.

A standard-cell library gives gates, flip-flops, and more, with uniform height, so tools can tile them in rows. Each cell comes with timing and power data.

# hdl: Hardware description languages
kind: method
level: 3
needs: fsm, timing
> Verilog and VHDL describe hardware behaviour for synthesis.

HDL is not software: every line describes parallel hardware. Register-transfer level (RTL) describes registers and the logic between them. Synthesis maps it to gates or to FPGA fabric.

## Watch out
Thinking in sequential steps is the classic beginner's error. All blocks run at once, on every clock edge.

# verification: Verification and test
kind: method
level: 3
needs: hdl
> Proving a design is right, then proving each chip is good.

Chip mistakes are extremely expensive, so verification often takes more effort than design.

- **Simulation:** testbenches check behaviour, with coverage metrics.
- **Formal:** mathematically proves properties.
- **Scan test:** flip-flops link into chains, so a tester can shift patterns in and out of each manufactured chip.

Design verification finds bugs in the design. Manufacturing test finds defects in one chip.

# fpga: FPGAs
kind: system
level: 3
needs: hdl
> Reconfigurable logic: look-up tables and wiring set by a bitstream.

A sea of LUTs, flip-flops, RAM and DSP blocks. A 4-input LUT is a tiny 16-bit memory that can implement any 4-input function.

Use them for parallel, low-latency work like camera pipelines, and to prototype chips. They use more power and cost more per unit than an ASIC, but no fab run is needed.

## Math
$$\text{configs} = 2^{2^k}$$ Functions of a $k$-input LUT.

## Example
Q: How many functions can a 4-input LUT make?
- $2^{16}$
A: 65,536.

## EgireRobotics
An FPGA is your first step towards custom silicon. Prototype a vision pre-processor or motor controller there.

# fabrication: Wafer fabrication
kind: concept
level: 3
needs: silicon-crystal, doping, mosfet
viz: wafer
> Hundreds of steps build transistors and wiring on silicon wafers.

Sand is purified and grown into a single crystal, sliced into wafers, then repeatedly patterned, etched, implanted, deposited and polished.

- **Front end:** builds the transistors in the silicon.
- **Back end:** a dozen or more metal layers form the chip's wiring.

Dust a fraction of a micron wide can kill a die, so fabs are ultra-clean.

## Math
$$Y \approx e^{-D_0A}$$ Poisson yield: defect density times die area.
$$\text{DPW} \approx \frac{\pi(d/2)^2}{A}-\frac{\pi d}{\sqrt{2A}}$$ Dies per wafer.

## Example
Q: $D_0 = 0.1$ cm⁻² and a 1 cm² die. What is the yield?
- $e^{-0.1}$
A: About 90%.
Q: How many 100 mm² dies fit on a 300 mm wafer?
- $706.9-66.6$
A: About 640. At 90% yield, about 579 are good.

## Check
Q: Why do large chips cost so much more?
+ Fewer fit on a wafer, and yield falls exponentially with area
- Silicon is priced by weight
- They need more pins
W: Both effects multiply, so cost rises faster than area.

# photolithography: Photolithography
kind: method
level: 3
needs: fabrication, photon
> Printing circuit patterns with light.

A mask projects a pattern onto light-sensitive resist, which then guides etching or implanting. A modern chip needs dozens of mask layers. EUV uses 13.5 nm light, as deep-UV (193 nm) needs multiple exposures for fine patterns.

## Math
$$CD = k_1\frac{\lambda}{NA}$$ Rayleigh resolution.

## Example
Q: $\lambda = 13.5$ nm, $NA = 0.33$, $k_1 = 0.4$. Find the feature size.
- $0.4\times13.5/0.33$
A: About 16 nm.

# scaling: Transistor scaling
kind: concept
level: 3
needs: cmos-inverter, tunneling
> Moore's law, Dennard scaling and why they slowed.

Moore's law: transistor counts double about every two years. Dennard scaling: shrinking by a factor $k$ also let voltage fall, so power density stayed flat.

Around 2005, leakage stopped voltage scaling. Clock speeds stalled, so designers moved to many cores and specialised accelerators. Node names such as "3 nm" are marketing, not a physical size.

## Math
$$P \propto CV^2f$$ With $C$ and $V$ scaled by $1/k$ and $f$ by $k$, power per transistor falls by $k^2$.

# finfet: FinFET and gate-all-around
kind: concept
level: 4
needs: scaling
> Wrapping the gate around the channel to stop leakage.

In a tiny planar transistor, the gate loses control of the channel, and current leaks even when off. A FinFET stands the channel up as a fin, with the gate on three sides. Gate-all-around nanosheets wrap all four.

More gate contact gives a sharper off state. A sharp off state is measured by subthreshold swing, which can't beat about 60 mV per decade at room temperature.

## Math
$$S = \ln(10)\frac{kT}{q} \approx 60\ \text{mV/decade}$$ Ideal limit at 300 K.

# packaging: Chip packaging
kind: concept
level: 3
needs: fabrication, thermal-design
> Connecting a die to the board and removing its heat.

Wire bonding links die pads with fine gold or copper wire. Flip-chip places solder bumps on the die, giving shorter, lower-inductance connections. Chiplets join several dies on an interposer, so each can use the best process, with better yield.

# asic-flow: Chip design flow
kind: method
level: 4
needs: hdl, logic-cells, photolithography, verification
> From RTL to GDSII to tape-out.

The steps: specification, RTL, verification, synthesis, floorplan, placement, clock tree, routing, timing sign-off, DRC/LVS, and tape-out. Open-source flows such as OpenLane, and shuttle programmes on the SKY130 process, make it possible for small teams to learn.

## Engineering
Static timing analysis checks every path for setup and hold, across process, voltage and temperature corners. A shuttle run shares one mask set between many projects, greatly reducing cost.

# soc-architecture: SoC architecture
kind: system
level: 4
needs: asic-flow, mcu
> CPUs, accelerators, memory and I/O joined by on-chip buses.

A system on chip links CPU clusters, GPUs, NPUs, memory controllers and peripherals over an interconnect. Moving data costs more energy than computing on it, so architecture centres on memory.

# npu: AI accelerators
kind: system
level: 4
needs: soc-architecture
see: ai-board
> Arrays of multiply-accumulate units fed by careful memory design.

Neural networks are mostly matrix multiplication. An NPU has large arrays of multiply-accumulate (MAC) units, and low-precision maths such as INT8. Reading DRAM can take over 100 times the energy of a MAC, so data is reused from on-chip SRAM.

## Math
$$\text{TOPS} = \frac{2\times N_{MAC}\times f}{10^{12}}$$ Peak operations per second.

## Example
Q: 4096 MACs at 1 GHz. What is the peak rate?
- $2\times4096\times10^9$
A: About 8.2 TOPS. Real workloads reach only a fraction of the peak.
