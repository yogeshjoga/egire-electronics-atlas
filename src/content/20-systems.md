@phase 20 | Advanced hardware design | Flight controllers, ESCs, AI boards and SoCs

# imu-sensors: IMUs and sensor fusion
kind: system
level: 3
needs: spi, sampling
> Gyros and accelerometers, fused into an estimate of attitude.

MEMS sensors are tiny silicon structures whose motion changes a capacitance. An accelerometer has a proof mass on springs: force moves it, following [[mass|F = ma]]. A gyro vibrates a mass and detects the Coriolis force.

Neither sensor is enough by itself. A gyro is smooth but drifts over time. An accelerometer doesn't drift, but it is noisy and can't tell tilt from acceleration. A complementary or Kalman filter fuses them: trust the gyro in the short term, and the accelerometer in the long term.

## Engineering
Mount the IMU close to the centre of mass, with soft isolation. Give it a clean, quiet rail. Motor vibration that aliases into the control band can't be filtered out afterwards, so sample fast. See [[sampling]].

## Math
$$\theta = \alpha(\theta+\omega\,\Delta t)+(1-\alpha)\theta_{acc}$$ Complementary filter.
$$\alpha = \frac{\tau}{\tau+\Delta t}$$ Sets the crossover time constant.

## Example
Q: For a 0.5 s time constant at 1 kHz, what is $\alpha$?
- $0.5/(0.5+0.001)$
A: 0.998.

## Check
Q: Why fuse a gyro with an accelerometer?
+ Gyro drift is corrected by the accelerometer's long-term reference
- It doubles the sample rate
- It lowers power use
W: Each covers the other's weakness.

# control-loop: Control loops and PID
kind: method
level: 3
needs: feedback, laplace
see: imu-sensors
viz: pid
> Measure, compare, correct, thousands of times per second.

PID computes a correction from three views of the error:

- **P:** the present error. More P responds faster, and eventually oscillates.
- **I:** accumulated past error, removing steady offsets such as wind.
- **D:** the rate of change, which damps overshoot but amplifies noise.

Stability rests on the same phase-margin ideas as amplifier [[feedback]]. Every delay in the loop, including gyro filters, takes away phase margin.

Flight controllers use **cascaded** loops: an inner fast rate loop, inside a slower angle loop, inside a position loop. Each inner loop should run several times faster than the next one out.

## Math
$$u(t) = K_pe+K_i\int e\,dt+K_d\frac{de}{dt}$$ PID controller.
$$\phi_{\text{delay}} = 360°\times f_c\,t_d$$ Phase lost to delay at crossover.

## Example
Q: A 2 ms delay in a loop crossing over at 50 Hz costs how much phase?
- $360\times50\times0.002$
A: 36°, a large part of a typical 45–60° margin.

## Watch out
Integrator wind-up: while a motor is saturated, I keeps growing, causing a big overshoot later. Clamp the integrator.

## Check
Q: Which PID term removes a steady error caused by constant wind?
- P
+ I
- D
W: The integral keeps growing until the error is gone.

# nav-sensors: GPS, barometer and compass
kind: system
level: 3
needs: uart, i2c
see: emi
> Sensors that tell the drone where it is, not just how it's tilted.

- **GNSS (GPS):** position to a few metres, by timing satellite signals. RTK reaches centimetres.
- **Barometer:** altitude from air pressure, about 12 Pa per metre near sea level. Prop wash disturbs it, so shield it with foam.
- **Magnetometer:** heading from Earth's field. Battery current disturbs it easily.

GNSS signals arrive at about −130 dBm, far below the noise floor. So nearby electronic noise easily swamps them.

## Example
Q: Pressure falls by 60 Pa. How much has the drone climbed?
- $60/12$
A: About 5 m.

## EgireRobotics
Mount GPS and compass on a mast, away from ESCs, power wires and USB 3 cameras.

# radio-link: Radio links and telemetry
kind: system
level: 3
needs: antenna, uart, logarithms-db
> Budgeting a control and video link in decibels.

A link budget adds transmit power and antenna gains, then subtracts path loss. What's left must exceed the receiver's sensitivity by a safety margin.

## Math
$$\text{FSPL} = 20\log_{10}d_{\text{km}}+20\log_{10}f_{\text{MHz}}+32.44$$ Free-space path loss in dB.
$$P_r = P_t+G_t+G_r-\text{FSPL}$$ Received power.

## Example
Q: 20 dBm transmitter, 2 dBi antennas, 1 km at 2.4 GHz, −95 dBm sensitivity. What's the margin?
- $\text{FSPL} = 0+67.6+32.44 = 100$ dB
- $P_r = 20+2+2-100 = -76$ dBm
A: 19 dB of margin.

## Watch out
Radio power and frequency are regulated. In India, check WPC rules for your band before transmitting, and drone rules from the DGCA before flying.

## Check
Q: Doubling distance changes free-space path loss by:
+ 6 dB more
- 3 dB more
- Nothing
W: 20 log₁₀(2) is about 6 dB.

# flight-controller: Flight controller design
kind: system
level: 4
needs: stm32, imu-sensors, control-loop, power-tree, decoupling
see: esc-design
> The brain of the drone: MCU, IMU, barometer, and interfaces.

Blocks: STM32 F4/F7/H7, SPI IMU, I²C baro and compass, UARTs for GPS and RC, timers for DShot output, a clean regulator for the IMU, and SD or flash logging. The Pixhawk open standards and open-source flight controller schematics are worth studying.

## Engineering
Place the IMU away from regulators, and feed it from its own LDO. Avoid routing fast signals beneath it. Check that your firmware of choice supports your pin mapping before layout.

## EgireRobotics
Start here: make a 4-layer STM32 board with one IMU, USB, and two UARTs. Get it flying before you add anything else.

## Check
Q: Why give the IMU its own LDO?
+ A quiet rail keeps switching noise out of sensor readings
- The IMU needs a high current
- It saves board space
W: Noise on the rail can appear directly in gyro data.

# esc-design: ESC hardware design
kind: system
level: 4
needs: esc, thermal-design, grounding, gate-driver
viz: deadtime, thermal
> Handling tens of amps of fast switching in a small area.

Key points: low-inductance power loop, heavy copper, low-ESR capacitors at the input, gate resistors for edge control, phase-current sensing, and thermal paths to a heatsink.

Long battery leads add inductance, so when current changes quickly, voltage spikes appear at the ESC. A big low-ESR capacitor right at the input absorbs them.

## Math
$$V_{\text{spike}} = L_{\text{loop}}\frac{di}{dt}$$ Overshoot from layout inductance.

## Example
Q: 10 nH loop, with 30 A switched in 20 ns. What is the overshoot?
- $10^{-8}\times1.5\times10^{9}$
A: 15 V, on top of the battery voltage.

## Watch out
On 6S (25.2 V full), 40 V MOSFETs leave little margin against spikes. Most designers use 60 V parts or above.

# pdb: Power distribution board
kind: system
level: 3
needs: power-tree, trace-width, fuses-protection, current-sensing
viz: trace
> Carries battery current to the ESCs, and generates rails.

Use heavy copper or bus bars, a current sensor, a voltage divider for battery monitoring, TVS protection, and low-ESR capacitors.

## Example
Q: Four ESCs draw 30 A each. What must the main path carry?
- KCL: $4\times30$
A: 120 A, plus accessories. Size copper and connectors accordingly.

# ai-board: Embedded AI compute boards
kind: system
level: 4
needs: power-tree, usb-interface, thermal-design, soc-architecture
> Jetson-class modules, with cameras and high-speed I/O.

A carrier board for an AI module needs clean high-current rails, MIPI CSI with controlled impedance, PCIe, and real thermal design. Expect 10–40 W, which matters on a drone's budget. Using a module means someone else has already solved the hard DDR layout.

## Example
Q: A 25 W AI module runs from a 90% buck on a 111 Wh pack with 80% usable. Alone, how long would it run?
- Draw is $25/0.9 = 27.8$ W
- $88.8/27.8$
A: About 3.2 hours. In flight, its real cost is the extra mass and heat as well.

# system-budget: System power and flight time
kind: method
level: 2
needs: capacity-ah-wh, efficiency
viz: battery
> Estimate flight time before you buy a part.

Add every load, apply converter efficiency, and divide the usable energy by that total. Heavier batteries add energy and also add hover power, so past a point more battery means less flight time.

## Math
$$t = \frac{0.8\,\text{Wh}\times60}{P_{\text{total}}}$$ Minutes, with 80% usable capacity.

## Example
Q: 111 Wh pack, 400 W hover and 30.5 W electronics. Find the flight time.
- $0.8\times111 = 88.8$ Wh
- $88.8/430.5 = 0.206$ h
A: About 12.4 minutes.

# failsafe: Failsafes and safe design
kind: method
level: 3
needs: fsm, flight-controller, radio-link
> Deciding in advance what happens when something fails.

Assume everything will fail, then choose the safest behaviour for each: radio loss, low battery, GPS loss, sensor disagreement, motor failure. Actions range from hold position, to return home, to land.

Hardware helps too: redundant IMUs, independent power for the flight controller, a watchdog, and ESCs that stop if commands cease.

## Check
Q: The radio link is lost. What should the design ensure?
+ A predefined, tested failsafe action runs automatically
- Motors hold their last command indefinitely
- The pilot restarts the system
W: Behaviour must be planned and tested, not left to chance.

# emc-testing: EMC testing and compliance
kind: method
level: 3
needs: emi, spectrum-analysis
> Proving your product neither emits nor suffers interference.

Commercial products must meet emission and immunity limits. Formal lab time is expensive, so do **pre-compliance** first: near-field probes and a spectrum analyser find the noisiest spots on your own bench.

## Lab
Make a near-field probe from a small loop of coax, and scan a running buck converter. You'll find the hot loop.

# bringup: Board bring-up
kind: method
level: 3
needs: debug-method, swd-debug
> The first power-on of a new board, done safely.

Inspect, then check for shorts on each rail. Power up through a current-limited supply. Verify rails one by one, check the clock and reset, connect SWD, and blink an LED. Then test peripherals, one at a time. Write down everything you change on the board, because those notes become the next revision.

## Check
Q: What's the safest first power-on?
+ A current-limited bench supply, with limit just above expected draw
- A fully charged LiPo
- USB and the full firmware
W: The supply limits the damage if there's a short.

# reliability: Reliability and derating
kind: method
level: 3
needs: thermal-design
> Run parts well below their limits, and they will last.

Use voltage derating (for example 50% for ceramics, 80% for MOSFETs). Every 10 °C hotter roughly halves electrolytic capacitor lifetime. Vibration, conformal coating and connector retention all matter in flight.

## Math
$$\text{AF} = e^{\frac{E_a}{k}\left(\frac1{T_1}-\frac1{T_2}\right)}$$ Arrhenius acceleration factor.

## Example
Q: With $E_a = 0.7$ eV, how much faster does ageing run at 85 °C than at 55 °C?
- $\frac{0.7}{8.617\times10^{-5}} = 8123$ K
- $\frac1{328}-\frac1{358} = 2.55\times10^{-4}$
A: About 8 times faster.

# soc-for-robotics: Your own silicon
kind: system
level: 4
needs: soc-architecture, ai-board, flight-controller, npu
> The end of the road: chips designed for your own robots.

With foundations in place, custom silicon is a logical progression. Start with FPGA prototypes of accelerators, move to an open-PDK shuttle run, and only then consider a full SoC with sensor interfaces, motor control blocks and neural processing.
