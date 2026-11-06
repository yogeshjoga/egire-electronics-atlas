@phase 14 | Digital electronics | Binary, logic, flip-flops and state

# binary: Binary numbers
kind: method
level: 1
needs: algebra
viz: binary
> Numbers in base 2, because a switch has two states.

Reliable hardware only needs to tell two states apart, so it uses base 2. Hexadecimal groups four bits per digit.

| Decimal | Binary | Hex |
|---|---|---|
| 5 | 0101 | 5 |
| 10 | 1010 | A |
| 15 | 1111 | F |
| 255 | 1111 1111 | FF |

Two's complement represents negatives: invert every bit and add 1.

## Math
$$N = \sum_i b_i2^i$$ Value of a binary number.
$$\text{range} = 2^n$$ Number of values in $n$ bits.

## Example
Q: Convert 1011₂ to decimal.
- $8+0+2+1$
A: 11.
Q: Write −5 as an 8-bit two's complement number.
- 5 is 00000101
- Invert: 11111010, then add 1
A: 11111011.

## Check
Q: What is 0xFF in decimal?
+ 255
- 256
- 15
W: Eight bits, all 1.

# logic-levels: Logic levels
kind: concept
level: 1
needs: binary, voltage
> Voltage bands that are read as 0 or 1, with noise margin.

A 1 is not exactly 3.3 V; it's a range. Thresholds leave a gap so noise does no harm.

| Family | $V_{IL}$ max | $V_{IH}$ min |
|---|---|---|
| 3.3 V CMOS | 0.8 V | 2.0 V |
| 5 V CMOS | 1.5 V | 3.5 V |

## Math
$$NM_H = V_{OH}-V_{IH}$$ High noise margin.
$$NM_L = V_{IL}-V_{OL}$$ Low noise margin.

## Example
Q: $V_{OH}$ = 2.4 V and $V_{IH}$ = 2.0 V. What is the high noise margin?
- $2.4-2.0$
A: 0.4 V.

## Watch out
Connecting 5 V logic into a non-tolerant 3.3 V pin can destroy it. Use a level shifter.

## Check
Q: What happens when a signal sits between $V_{IL}$ and $V_{IH}$?
+ The logic value is undefined
- It reads 1
- It reads 0
W: That's the forbidden zone, so the input can read either value.

# boolean: Boolean algebra
kind: method
level: 1
needs: binary
viz: logic
> The algebra of true and false.

AND is multiplication, OR is addition, NOT is inversion. De Morgan's laws let you swap between them, which is why NAND alone can build everything.

## Math
$$\overline{A\cdot B} = \bar A+\bar B$$ De Morgan's first law.
$$\overline{A+B} = \bar A\cdot\bar B$$ De Morgan's second law.
$$A+\bar A = 1,\quad A\cdot\bar A = 0$$ Complements.

## Example
Q: Simplify $A\cdot B+A\cdot\bar B$.
- $A(B+\bar B) = A\cdot1$
A: $A$.

## Check
Q: By De Morgan, NOT(A AND B) equals:
+ (NOT A) OR (NOT B)
- (NOT A) AND (NOT B)
- A OR B
W: Invert each term and swap the operator.

# logic-gates: Logic gates
kind: component
level: 1
needs: boolean, logic-levels
see: cmos-inverter
viz: logic
> Tiny transistor circuits that compute Boolean functions.

| Gate | Output is 1 when |
|---|---|
| NOT | Input is 0 |
| AND | All inputs are 1 |
| OR | Any input is 1 |
| NAND | Not all inputs are 1 |
| NOR | No input is 1 |
| XOR | Inputs differ |

NAND gates are **universal**: every other gate can be built from NAND alone. NOT is a NAND with its inputs tied together.

## Lab
Wire a 74HC00 NAND chip on a breadboard with switches and LEDs, and verify its truth table. Tie unused inputs to a rail.

## Check
Q: Which gate outputs 1 only when its inputs differ?
- AND
- NOR
+ XOR
W: Exclusive OR: 01 and 10 give 1.

# combinational: Combinational logic
kind: concept
level: 2
needs: logic-gates
viz: logic
> Circuits whose outputs depend only on current inputs.

Adders, multiplexers, decoders, and comparators. A half adder is an XOR (sum) plus an AND (carry). Chain full adders together and you have the arithmetic heart of a CPU.

A **multiplexer** selects one of several inputs, like a rotary switch. A **decoder** turns a binary number into one active line, which is how memory addresses pick a row.

## Math
$$S = A\oplus B,\quad C = A\cdot B$$ Half adder.

## Check
Q: A half adder gets A = 1 and B = 1. What does it output?
+ Sum 0, carry 1
- Sum 1, carry 0
- Sum 1, carry 1
W: 1 + 1 = 10 in binary.

# flip-flops: Latches and flip-flops
kind: component
level: 2
needs: combinational
viz: flipflop
> Feedback gives gates a memory of one bit.

Cross-couple two gates and the output holds itself. A D flip-flop copies D to Q only on a clock edge. That single idea makes synchronous design possible.

A latch is level-sensitive, and its output can change the entire time its enable is high. A flip-flop is edge-triggered, changing only at the clock's edge. So a flip-flop gives every signal a clean moment to change.

## Math
$$Q_{n+1} = D$$ D flip-flop.

## Check
Q: When does a D flip-flop's output change?
+ At the active clock edge
- Whenever D changes
- At power-off
W: It samples D only at the edge.

# counters: Registers and counters
kind: component
level: 2
needs: flip-flops
viz: flipflop
> Groups of flip-flops that store words or count clock pulses.

A register holds a word. A shift register turns serial into parallel. Each stage of a ripple counter divides frequency by 2.

## Math
$$f_{out} = \frac{f_{in}}{2^n}$$ After $n$ stages.

## Example
Q: An 8 MHz clock goes through three divide-by-2 stages. What frequency results?
- $8/2^3$
A: 1 MHz.

# fsm: Finite state machines
kind: method
level: 3
needs: flip-flops
> Hardware that moves through defined states based on inputs.

State registers hold where you are. Combinational logic picks the next state. Every communication controller and CPU control unit is one. Flight modes (disarmed, armed, flying, failsafe) are a software one.

## Check
Q: What does a state machine's flip-flops store?
+ The current state
- The program
- The clock frequency
W: The next state is computed from it and from the inputs.

# timing: Setup, hold and clock timing
kind: concept
level: 3
needs: flip-flops
> Signals must be stable around the clock edge.

Setup is how long before the edge data must be stable; hold is how long after. Violate them and a flip-flop can go metastable, sitting between 0 and 1. This limits maximum clock speed.

## Math
$$T_{clk} \ge t_{cq}+t_{logic}+t_{su}$$ Minimum clock period.

## Example
Q: Delays: clock-to-Q 1 ns, logic 6 ns, setup 1 ns. What is the max clock?
- $T = 8$ ns
A: 125 MHz.

## Check
Q: What limits a synchronous circuit's maximum clock speed?
+ The slowest path between flip-flops
- The number of pins
- The chip's colour
W: T must cover clock-to-Q, logic, and setup.

# memory: Memory technologies
kind: concept
level: 2
needs: flip-flops, mosfet, tunneling
> SRAM, DRAM and flash store bits in different physical ways.

| Type | Cell | Volatile | Use |
|---|---|---|---|
| SRAM | 6 transistors | Yes | Cache, MCU RAM |
| DRAM | 1T + 1 capacitor | Yes | Main memory |
| Flash | Floating-gate | No | Firmware, SSDs |
| EEPROM | Floating-gate | No | Settings |

Flash writes by tunnelling electrons onto an isolated gate.

## Example
Q: How many address lines does 64 KB of byte-wide memory need?
- $2^{16} = 65536$
A: 16.

## Check
Q: Which memory keeps its data with no power?
+ Flash
- SRAM
- DRAM
W: Trapped charge on a floating gate lasts for years.

# adders-alu: Adders and the ALU
kind: component
level: 2
needs: combinational
> Circuits that do the arithmetic inside a CPU.

A full adder adds two bits plus a carry. Chain 32 of them and you can add 32-bit numbers. Subtraction reuses the same hardware with two's complement.

An arithmetic logic unit (ALU) combines adders with logic operations, and a control input selects which result to output.

## Math
$$S = A\oplus B\oplus C_{in}$$ Full adder sum.
$$C_{out} = AB+C_{in}(A\oplus B)$$ Full adder carry.

## Example
Q: Add 0110 and 0011.
- $6+3$
A: 1001, which is 9.

# clock-domain: Clock domains and metastability
kind: concept
level: 3
needs: timing
see: uart
> Passing signals safely between unrelated clocks.

A signal from outside, or from another clock, can change right at the sampling edge. The flip-flop can hang between 0 and 1, called metastability, and then settle randomly.

The standard fix is a **two-flip-flop synchroniser**: the first may go metastable, but it has a full cycle to settle before the second samples it.

## Check
Q: How do you bring a button signal safely into a clocked circuit?
+ Pass it through two flip-flops in series
- Connect it straight to the logic
- Use a bigger resistor
W: The first stage has time to settle.

# cpu-basics: How a CPU works
kind: system
level: 2
needs: counters, memory, adders-alu, fsm
see: mcu
> Fetch an instruction, decode it, execute it, repeat.

A CPU is a state machine driving an ALU. A **program counter** holds the address of the next instruction. Each cycle:

- **Fetch:** read the instruction from memory.
- **Decode:** work out what it asks for.
- **Execute:** use the ALU, or read or write memory.

Registers hold working values. Software is just a list of numbers, stored in memory, that steer this machine. Everything earlier on this board, from atoms to gates, comes together here.

## Math
$$t = \frac{N\times\text{CPI}}{f}$$ Time for $N$ instructions at CPI cycles each.

## Example
Q: 1000 instructions at 1.5 cycles each, on a 150 MHz clock. How long?
- $1000\times1.5/(150\times10^6)$
A: 10 µs.

## Check
Q: What does the program counter hold?
+ The address of the next instruction
- The number of programs
- The clock speed
W: It steps through memory, and jumps change it.

# crc: Error detection and CRC
kind: method
level: 2
needs: logic-gates, binary
see: can-bus, dshot
> Extra bits that reveal corrupted data.

Noise flips bits. A **parity** bit catches any single flip. A **CRC** treats a message as a big binary number, divides it by a fixed polynomial, and sends the remainder. The receiver repeats that, and any mismatch shows damage. It's only XOR gates and shift registers in hardware.

## Check
Q: What can a single parity bit not detect?
+ Two bits flipped together
- One bit flipped
- Any odd number of flips
W: Two flips cancel out, so parity looks correct.
