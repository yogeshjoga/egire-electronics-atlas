@phase 18 | Embedded hardware | MCUs, clocks, reset, interfaces and power

# mcu: Microcontrollers
kind: system
level: 2
needs: memory, counters, logic-levels
> A CPU, memory and peripherals on one chip.

An MCU contains a CPU core, flash for code, SRAM for data, timers, ADCs and communication peripherals. It runs one program with deterministic timing and low power, unlike an application processor running Linux.

Everything an MCU does is reading and writing **registers**: memory addresses wired to hardware. Writing a bit to a GPIO register really does change a pin's voltage. That is the bridge between software and everything earlier on this board.

| | MCU | Application processor |
|---|---|---|
| Example | STM32 | Jetson |
| Memory | KB to MB, on-chip | GB, external |
| Boot time | Milliseconds | Seconds |
| Timing | Deterministic | Best effort |
| Power | mW | W |

## EgireRobotics
A typical drone uses both: an MCU for hard real-time flight control, and a companion computer for vision and AI.

## Check
Q: Why does flight control run on an MCU rather than Linux?
+ An MCU gives deterministic timing for the control loop
- MCUs are always faster
- Linux cannot do maths
W: A late control update can crash a drone, so worst-case timing matters more than average speed.

# stm32: STM32 family
kind: system
level: 2
needs: mcu
> The Arm Cortex-M family used in most flight controllers.

F4 and F7 are common in flight controllers; H7 adds speed for heavier workloads; G4 suits motor control. Every design needs: power, decoupling, a clock, reset, BOOT0, and SWD debug pins.

Read three documents: the **datasheet** for pins and electrical limits, the **reference manual** for registers, and the **errata** for known silicon bugs.

## Engineering
Pin assignment is a puzzle, since each peripheral maps only to certain pins. Use STM32CubeMX to check that your SPI, UARTs, timers and ADC fit together before you draw the schematic.

## Watch out
Each VDD pin needs a capacitor, and VCAP pins on some families need their own specific capacitors. Missing those stops the chip from running properly.

# clock-tree: Clocks and PLLs
kind: concept
level: 2
needs: mcu, oscillator
> A crystal sets timing; a PLL multiplies it for the core.

An external 8 MHz crystal gives precise timing. A phase-locked loop multiplies it up, and buses divide it down. An internal RC oscillator works without parts, but drifts by about 1%, which is too poor for USB and risky for CAN.

## Math
$$C_L = \frac{C_1C_2}{C_1+C_2}+C_{\text{stray}}$$ Crystal load capacitance.
$$f_{out} = f_{in}\frac{N}{M}$$ PLL output.

## Example
Q: A crystal needs 10 pF load with 3 pF stray. What $C_1 = C_2$?
- $C/2 + 3 = 10$
A: 14 pF.

## Watch out
Keep the crystal close to the MCU, with short traces and no signals beneath it. Touching it with a scope probe can stop it, since the probe adds capacitance.

# reset-boot: Reset and boot
kind: concept
level: 2
needs: mcu, rc-transient
> Getting a chip into a known state on power-up.

An RC on NRST holds reset until the rails are stable, and a brownout detector handles low voltage. BOOT pins select flash or a bootloader, and a **watchdog** timer resets a stuck system if software stops checking in.

## Math
$$t = RC\ln\frac{V_{dd}}{V_{dd}-V_{th}}$$ Time for an RC to reach threshold.

## Example
Q: A 10 kΩ and 100 nF on a 3.3 V rail, with reset releasing at 2.0 V. How long?
- $RC = 1$ ms
- $\ln(3.3/1.3) = 0.93$
A: About 0.93 ms.

## Check
Q: What does a watchdog do?
+ Resets the chip if software stops responding
- Monitors the crystal's temperature
- Encrypts firmware
W: Code must refresh it regularly. If it hangs, the timer expires.

# bootloader: Bootloaders and firmware update
kind: concept
level: 2
needs: reset-boot
> Small code that runs first and can replace the main program.

STM32 parts have a ROM bootloader, entered by holding BOOT0 high during reset, supporting USB DFU and UART. So you can recover a chip even if flash is corrupted, as long as those pins are reachable.

A custom bootloader can verify a checksum or signature before jumping to the application. For field updates, keep two firmware slots, so a failed update can roll back.

## EgireRobotics
Bring BOOT0 to a button or pad. It rescues boards when a firmware bug blocks USB.

# gpio: GPIO and pull resistors
kind: concept
level: 1
needs: mcu, voltage-divider
> Pins configured as input or output, with defined default states.

A floating input reads randomly, because a CMOS input has almost no current to hold it. A pull-up or pull-down resistor gives it a known default. Push-pull outputs drive both ways; open-drain only pulls low, letting devices share a line.

## Engineering
GPIO pins source only a few mA. Check the per-pin and whole-chip limits. Use a transistor for anything larger, like a relay.

## Math
$$R_{\min} = \frac{V_{dd}-V_{OL}}{I_{OL}}$$ Smallest pull-up.
$$R_{\max} = \frac{t_r}{0.85C_{\text{bus}}}$$ Largest pull-up that meets rise time.

## Example
Q: Find the I²C pull-up range for 3.3 V, 3 mA sink, 300 ns rise time and 100 pF.
- $R_{\min} = (3.3-0.4)/0.003 = 967\ \Omega$
- $R_{\max} = 300\times10^{-9}/(0.85\times10^{-10}) = 3.5$ kΩ
A: Between about 1 and 3.5 kΩ. A 2.2 kΩ part is a common pick.

## Check
Q: An unconnected input pin reads random values. Why?
+ It is floating, so noise sets its level
- The MCU clock is too slow
- It is an open-drain output
W: High-impedance inputs need a defined level from a pull resistor.

# level-shifting: Level shifting
kind: method
level: 2
needs: gpio, mosfet
> Connecting parts that use different logic voltages.

Most modern MCUs use 3.3 V or lower, yet some peripherals use 5 V. Options include a divider (one direction only), a MOSFET shifter such as BSS138 for open-drain buses, or a dedicated translator chip for fast signals.

## Example
Q: Divide 5 V to 3.3 V with a 1 kΩ top resistor. What bottom resistor?
- $5\times R/(R+1k) = 3.3$
A: About 2 kΩ, giving 3.33 V.

## Watch out
Check whether a pin is "5 V tolerant" in the datasheet. Tolerance can vanish when the MCU is unpowered or the pin is in analog mode.

# interrupts-dma: Interrupts and DMA
kind: concept
level: 2
needs: mcu
> Hardware that reacts at once, and moves data without the CPU.

Interrupts pause code to respond to an event. DMA moves data between peripherals and memory, keeping the CPU free. A flight controller's gyro read runs in exactly this way.

## Math
$$t_{\text{latency}} = \frac{12\ \text{cycles}}{f_{clk}}$$ Typical Cortex-M interrupt entry.

## Example
Q: What is the interrupt entry time at 168 MHz?
- $12/(168\times10^6)$
A: About 71 ns.

## Watch out
Keep interrupt handlers short. Share data carefully, as a value changed mid-read by an interrupt causes rare, painful bugs.

# timers: Timers and PWM peripherals
kind: concept
level: 2
needs: mcu, pwm
> Hardware counters that generate and measure exact timing.

A timer counts clock ticks. Compare registers produce PWM on output pins with no CPU work, and capture registers timestamp incoming edges, for measuring RC pulses or motor speed. Advanced timers add complementary outputs with hardware dead time for motor control.

## Math
$$f_{PWM} = \frac{f_{clk}}{(PSC+1)(ARR+1)}$$ STM32 timer frequency.

## Example
Q: 84 MHz clock, $PSC = 0$. What ARR gives 20 kHz?
- $84\times10^6/20\times10^3 = 4200$
A: ARR = 4199.

# adc-peripheral: Using the on-chip ADC
kind: method
level: 2
needs: mcu, adc
see: voltage-divider
> Getting clean readings from an MCU's ADC.

Inside the ADC is a small sampling capacitor. It must charge to the input voltage within the sample time, through your source's resistance. A high-resistance divider may not charge it in time, giving low readings.

Fixes: a longer sample time, a lower source resistance, or a small capacitor at the pin to act as a charge reservoir.

## Math
$$t_s \ge (N+1)\ln2\cdot RC$$ Settling to half an LSB for an $N$-bit ADC.

## Example
Q: A 12-bit ADC has 5 pF sampling capacitance and 10 kΩ source resistance. What sample time?
- $\tau = 50$ ns
- $13\times0.693\times50$ ns
A: About 450 ns.

## EgireRobotics
A battery-monitor divider with high resistors saves power, so add 100 nF at the ADC pin to feed the sampling capacitor.

# rtos: Real-time scheduling
kind: concept
level: 3
needs: interrupts-dma, timers
> Running several jobs while guaranteeing their deadlines.

An RTOS switches between tasks by priority. "Real-time" means predictable, not fast. A late result is a wrong result.

A flight stack might run the gyro and rate loop at the highest rate, position estimates slower, and logging whenever there's time.

## Math
$$U = \sum\frac{C_i}{T_i} \le n(2^{1/n}-1)$$ Rate-monotonic schedulability bound.

## Example
Q: How many CPU cycles fit in an 8 kHz loop at 168 MHz?
- $168\times10^6/8000$
A: 21,000 cycles for everything in that loop.
Q: Three tasks have utilisation 0.2, 0.3 and 0.2. Is this guaranteed schedulable?
- $U = 0.7$
- Bound for $n=3$ is $3(2^{1/3}-1) = 0.78$
A: Yes, as 0.7 is below 0.78.

# uart: UART
kind: concept
level: 1
needs: gpio
see: logic-analyzer
viz: serial
> Two-wire asynchronous serial, with no shared clock.

TX crosses to RX. Both sides agree a baud rate. Each byte has start, data and stop bits. GPS, telemetry and radio receivers use it.

Since there's no clock wire, the receiver resynchronises on each start bit, so timing must match within about 2%.

## Math
$$\text{bytes/s} = \frac{\text{baud}}{10}$$ With 8N1 framing.

## Example
Q: How many bytes per second at 115200 baud?
- $115200/10$
A: 11,520.

## Watch out
Connecting TX to TX is the classic mistake. Devices also need a common ground. The RS-232 standard is a different voltage level, and connecting it to a 3.3 V pin causes damage.

## Check
Q: Which pin does a UART's TX connect to?
+ The other device's RX
- The other device's TX
- Ground
W: One device's output goes to the other's input.

# spi: SPI
kind: concept
level: 1
needs: gpio
viz: serial
> Fast four-wire synchronous bus with chip selects.

SCK, MOSI, MISO and CS. The master supplies the clock, so there's no baud matching. It's full-duplex and runs at tens of MHz. Most flight controllers connect their IMU via SPI.

Four modes exist, set by clock polarity and phase (CPOL, CPHA). The wrong mode gives bit-shifted garbage, so read the sensor's timing diagram.

## Math
$$t = \frac{8N}{f_{SCK}}$$ Time to move $N$ bytes.

## Example
Q: How long does it take to read 15 bytes from an IMU at 10 MHz?
- $8\times15/10^7$
A: 12 µs.

# i2c: I²C
kind: concept
level: 1
needs: gpio
viz: serial
> Two-wire addressed bus using pull-ups.

SDA and SCL are open-drain, pulled up by resistors. Devices have 7-bit addresses, and each byte is acknowledged. 100 or 400 kHz is typical. Barometers and magnetometers often use it.

It saves pins, but a stuck device can hold the bus low. Firmware needs a recovery routine, clocking SCL until the slave lets go.

## Math
$$t = \frac{9N}{f_{SCL}}$$ Time for $N$ bytes, 9 clocks each.

## Example
Q: How long to transfer 16 bytes at 400 kHz?
- $9\times16/400000$
A: 360 µs, which is 30 times slower than SPI. This is why IMUs use SPI.

## Check
Q: Why does I²C need pull-up resistors?
+ Devices can only pull the lines low
- To limit clock frequency
- To protect the crystal
W: Open-drain outputs never drive high, which lets devices share the wires.

# can-bus: CAN bus
kind: concept
level: 2
needs: uart, transmission-line
> A robust differential bus with arbitration.

CAN is a differential pair with 120 Ω termination at each end. Nodes use message priorities to resolve collisions without losing data, and every frame has a CRC. DroneCAN uses it for GPS and ESCs. It suits long wires in noisy frames.

## Math
$$R_{\text{bus}} = 120\parallel120 = 60\ \Omega$$ What a meter should read, power off.

## Lab
Measure across CANH and CANL with power off. 60 Ω means both terminators are in, and 120 Ω means one is missing.

# dshot: DShot and motor protocols
kind: concept
level: 2
needs: timers, esc
> A digital protocol from flight controller to ESC.

Old ESCs used analog-style pulse widths, needing calibration and suffering jitter. DShot sends a 16-bit digital frame: 11 throttle bits, 1 telemetry bit and a 4-bit checksum. A 1 is a long high pulse, and a 0 a short one. Timers and DMA generate it with no CPU load.

## Math
$$t_{\text{frame}} = \frac{16}{f_{\text{bit}}}$$ Time per frame.

## Example
Q: DShot600 runs at 600 kbit/s. How long is one frame?
- $16/600000$
A: About 26.7 µs.

## Check
Q: What does DShot's checksum protect against?
+ Corrupted commands from electrical noise
- Motor overheating
- Low battery voltage
W: A bad frame is discarded, rather than causing a throttle spike.

# usb-interface: USB and high-speed links
kind: concept
level: 3
needs: signal-integrity, mcu
> Differential serial links with controlled impedance.

USB 2.0 needs 90 Ω differential impedance. MIPI CSI connects cameras, PCIe connects accelerators, and each needs careful length matching. Add ESD protection at the connector, with low capacitance so it doesn't load the signal.

# swd-debug: SWD and debugging
kind: method
level: 2
needs: stm32
> Two wires that let you halt and inspect a running chip.

SWDIO and SWCLK give you breakpoints and flashing with an ST-Link. Always bring these, ground and NRST to a connector or test pads, as a board you can't debug can't be fixed.

## Lab
Flash a blink program over SWD, set a breakpoint, and change a variable while halted. It'll change how you find bugs.

# power-tree: Power tree design
kind: method
level: 2
needs: buck, linear-regulator, efficiency
viz: battery, regulator
> Mapping how every rail is generated, sequenced and budgeted.

Draw from the battery down: which regulators supply which rails, at what current and efficiency. Use a buck for the big drop, and an LDO for quiet analog rails. Check power-up sequencing, because some chips need rails to appear in a set order.

## Example
Q: A 3.3 V rail draws 0.5 A through an LDO from 5 V, fed by a 90% efficient buck from 22.2 V. What current does the battery supply?
- LDO input: 0.5 A at 5 V = 2.5 W
- Buck input: $2.5/0.9 = 2.78$ W
A: $2.78/22.2 = 125$ mA.

## EgireRobotics
Typical: 6S battery → 12 V buck for AI compute → 5 V buck for servos and camera → 3.3 V LDO for the IMU.
