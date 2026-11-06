# multimeter: Digital multimeter
group: Measure
priority: Buy first
lessons: multimeter, voltage, current, resistance, measurement-error
viz: multimeter
panel: multimeter
> Measures voltage, current and resistance. The first tool every engineer buys.

## What it is
A handheld meter that shows one number at a time. It combines a voltmeter, ammeter and ohmmeter, usually with continuity and diode tests. Think of it as your eyes for anything that changes slowly.

## Why it matters
Almost every fault starts with a simple question. Is power reaching this pin? Is this wire broken? Is this rail shorted? A multimeter answers all of these in seconds. You will use it more than every other instrument combined.

## How to use it
- **Measure voltage:** black lead in COM, red in VΩ. Select V, then touch the probes across the part. The circuit stays connected.
- **Measure resistance:** turn the power off first. Select Ω, and touch both ends. Lift one end of the part out of the circuit for a true reading.
- **Check continuity:** power off. Select the beep symbol. A beep means there's a very low resistance path.
- **Test a diode:** select the diode symbol. Red on anode, black on cathode. A good silicon diode shows about 0.6 V; reversed shows OL.
- **Measure current:** power off, and break the circuit. Move the red lead to the A or mA jack, and put the meter in series. Power on, read it, then **move the lead back** straight away.

## Functions
| Symbol | Function | Typical use |
|---|---|---|
| V with a straight line | DC voltage | Batteries, rails |
| V with a wave | AC voltage | Mains, transformers |
| A | Current | Board power draw |
| Ω | Resistance | Parts, sensors |
| Sound waves | Continuity | Broken wires, shorts |
| Arrow and bar | Diode test | Diodes, MOSFET body diodes |
| Parallel bars | Capacitance | Sorting capacitors |
| OL on screen | Over limit, or open circuit | Nothing connected |

## Practice
- Measure a fresh AA cell, then the same cell with the leads swapped. Note the minus sign.
- Measure ten resistors of the same value, and compare them to their tolerance.
- Find which breadboard holes are connected, using continuity.
- Measure a LiPo through its balance lead, cell by cell.
- Measure the current of an LED circuit, with the meter in series.
- Use diode mode to find the anode of an unmarked diode.

## Mistakes
- Measuring voltage with the red lead still in the current jack. This shorts the source through the meter.
- Measuring resistance on a powered circuit.
- Trusting a resistance reading with the part still connected to the circuit.
- Using a cheap meter on mains. It needs a proper CAT rating.

## Buying
Pick auto-ranging, a fast continuity beep, and fused current ranges. True RMS is useful for non-sine AC. CAT III rated meters have better internal protection. Avoid the cheapest meters for anything above low-voltage work.

## Check
Q: A meter's red lead is still in the 10 A jack, and you touch the probes across a battery. What happens?
+ You short the battery through the meter
- It reads the voltage normally
- It reads zero and nothing happens
W: The current jack has almost no resistance. Always move the lead back.
Q: What does OL mean in resistance mode?
+ The resistance is too high to read, such as an open circuit
- The battery is low
- The part is shorted
W: Over limit. Nothing is connected, or the value exceeds the range.

# oscilloscope: Oscilloscope
group: Measure
priority: Buy next
lessons: oscilloscope, probing, frequency, sampling
viz: scope
panel: oscilloscope
> Draws voltage against time, so you can see what a signal really does.

## What it is
An instrument that plots a graph of voltage (up the screen) against time (across the screen). A multimeter gives one number; a scope shows the shape.

## Why it matters
Some faults are invisible to a meter. A 3.3 V rail can read perfectly on a meter while it dips 500 mV thousands of times per second. A scope shows ripple, ringing, noise, PWM, and data on a bus. It's the tool that makes fast electronics understandable.

## How to use it
- **Connect:** clip the ground lead to circuit ground, and the probe tip to the signal. Set the probe to 10×, and tell the scope.
- **Compensate:** touch the probe to the calibration output, and trim until the square wave has flat tops.
- **Vertical:** turn volts per division until the wave fills most of the screen height.
- **Horizontal:** turn time per division until you can see two or three cycles.
- **Trigger:** set the level inside the signal, so the picture stands still.
- **Measure:** use the built-in measurements or cursors to read frequency, amplitude and rise time.

If you're lost, press **Auto** to get started.

## Functions
| Control | What it does |
|---|---|
| Volts per division | Vertical zoom |
| Time per division | Horizontal zoom |
| Trigger level | The voltage that starts each sweep |
| Trigger edge | Starts on a rising or falling edge |
| AC or DC coupling | AC removes the DC part, so small ripple can be seen |
| Single | Captures one event, such as power-up |
| Cursors | Measure between two points |
| FFT | Shows frequency content |
| Bandwidth limit | Cuts high-frequency noise, handy for ripple |

## Practice
- View the scope's own calibration signal, and compensate the probe.
- Measure the PWM of an LED, and read the duty cycle.
- Measure ripple on a USB charger, using AC coupling.
- Capture power-up of a board with Single mode.
- View a UART transmit line, and find the start bit.
- Compare a long ground lead with a short ground spring on a fast edge.

## Mistakes
- Clipping the probe ground to a point that isn't at earth potential. A mains-powered scope's ground is tied to earth, so this causes a short.
- Leaving the probe on 1× and missing fast details.
- Believing ringing caused by a long ground lead.
- Measuring beyond the scope's bandwidth.

## Safety
Never connect a normal scope probe to mains circuits. Use a differential probe designed for the job, or stay with isolated low-voltage circuits.

## Buying
Look for at least two channels, 100 MHz bandwidth and a good sample rate. Serial decoding is useful. A small USB or handheld scope is a low-cost way to begin, but with lower performance.

## Check
Q: The waveform drifts across the screen. What should you adjust?
+ The trigger level
- Volts per division
- The probe tip
W: Trigger keeps sweeps in step. It must sit inside the signal's range.
Q: You want to see 20 mV of ripple on a 12 V rail. What helps most?
+ AC coupling, with a small volts-per-division setting
- A large volts-per-division setting
- A slower trigger
W: AC coupling removes the 12 V, so you can zoom in on the ripple.

# logic-analyzer: Logic analyser
group: Measure
priority: Buy next
lessons: logic-analyzer, uart, spi, i2c
viz: serial
> Records many digital lines at once, and decodes the protocols for you.

## What it is
A small USB device that samples 8 or more lines as highs and lows. Software then shows them as a timeline, and turns them into readable bytes.

## Why it matters
When a sensor stays silent, you need to know whether it's your wiring, firmware, or the sensor. A logic analyser shows exactly what was on the bus, translated into addresses and data. Cheap units already solve most embedded bugs.

## How to use it
- Connect its ground to your circuit's ground first.
- Clip channels to the signals, such as SCK, MOSI, MISO and CS.
- Check the input voltage limit against your logic level.
- Set a sample rate at least 4 times faster than the fastest signal.
- Add a protocol decoder, and set the correct pins and settings.
- Start capture, and trigger the event.

## Functions
| Feature | What it does |
|---|---|
| Channels | How many signals at once |
| Sample rate | How finely time is sliced |
| Protocol decoders | Convert bits to bytes |
| Trigger | Starts on a pattern |

## Practice
- Capture a UART "hello" message and decode it.
- Read an I²C sensor and find the address and ACK.
- Change the SPI mode on purpose, and see the data go wrong.

## Mistakes
- Forgetting the ground connection.
- Sampling too slowly, and seeing false timing.
- Setting the wrong baud rate in the decoder.
- Using it for analog questions. It can't show signal quality, so use a scope.

## Buying
An inexpensive 8-channel USB analyser works with open-source software such as PulseView for slow buses. Faster models help with high-speed SPI.

## Check
Q: What sample rate suits a 2 MHz SPI clock?
+ At least 8 MS/s
- 2 MS/s
- 500 kS/s
W: Sample at least 4 times faster than the signal.

# lcr-meter: LCR and component tester
group: Measure
priority: Later
lessons: impedance, capacitor, inductor, parasitics
viz: rlc
> Measures inductance, capacitance, resistance and ESR.

## What it is
A meter that applies a small AC test signal and measures impedance. Simple component testers also identify unknown parts.

## Why it matters
An inductor's value can't be read with a multimeter, and a capacitor's ESR can show it is failing even though its capacitance looks fine. It's also how you check what a part does at the frequency you care about.

## How to use it
- Discharge capacitors before testing.
- Choose a test frequency close to your application.
- Run open and short calibration.
- Connect the part with short leads, and read the value, plus ESR or Q.

## Practice
- Compare a new capacitor with an old one.
- Measure a 10 µF ceramic at different test frequencies.
- Measure a motor winding, and compare all three phases.

## Mistakes
- Testing a charged capacitor, which can damage the tester.
- Testing parts while still on the board.
- Ignoring test frequency.

## Check
Q: Why might a capacitor read differently at 100 Hz and 100 kHz?
+ Its impedance and parasitics depend on frequency
- The meter is broken
- Capacitors change colour
W: Real parts have ESR and ESL.

# clamp-meter: DC clamp meter
group: Measure
priority: Later
lessons: current-sensing, magnetic-field, hall-effect
> Measures current through a wire without breaking the circuit.

## What it is
A meter with jaws that close around one wire and sense its magnetic field. Hall-effect types measure DC, while simpler ones are AC only.

## Why it matters
A drone's current is far too high for a normal multimeter. A clamp meter lets you measure a battery lead at tens of amps, with no connection at all.

## How to use it
- Check it's a **DC** model.
- Zero it with the jaws closed, away from wires.
- Clamp around **one** conductor only.
- Keep the wire near the centre of the jaws.

## Practice
- Measure a battery lead on a bench-tested motor, with props removed.
- Clamp both the positive and negative wires at once, and see it read near zero.

## Mistakes
- Clamping both wires together, as their fields cancel.
- Buying an AC-only model for drone work.
- Forgetting to zero it first.

## Check
Q: Why does clamping around both battery wires read zero?
+ Equal and opposite currents cancel their magnetic fields
- The meter overloads
- Batteries are DC
W: The jaws sense the net field.

# thermal-camera: Thermal camera
group: Measure
priority: Later
lessons: thermal-design, heat-temperature, joule-heating
viz: thermal
> Shows heat as a picture, so that hot parts stand out.

## What it is
A camera that sees infrared radiation. Warm objects glow in the image.

## Why it matters
A short circuit often heats up one small part. On a dead board, a thermal camera can point at the fault within seconds. It also shows where your design is running hot.

## How to use it
- Power the board with a current-limited supply.
- Watch for the first part to warm up.
- Compare with a known good board.

## Practice
- Find the hottest part on a running flight controller.
- Compare a regulator with and without airflow.

## Mistakes
- Shiny metal reflects heat, so readings on bare metal are low. Point it at a matte surface.
- Forgetting that a small hot part may be smaller than one camera pixel.

## Check
Q: Why might bare metal look cooler than it is?
+ Shiny surfaces emit little infrared, and reflect their surroundings
- Metal cannot get hot
- The camera ignores metal
W: Emissivity is low on polished metal.

# spectrum-analyzer: Spectrum analyser and VNA
group: Measure
priority: Later
lessons: spectrum-analysis, harmonics, antenna, emi
viz: fourier
> Shows signals by frequency. Essential for radio and noise work.

## What it is
A spectrum analyser plots power against frequency. A vector network analyser (VNA) tests how antennas and filters respond, and shows whether they are matched. Low-cost pocket VNAs are popular with hobbyists.

## Why it matters
Radio trouble is invisible on a scope. You need these tools to see whether your switching converter is noisy at the GPS frequency, or if an antenna is tuned correctly.

## How to use it
- Calibrate a VNA at the end of the cable, with open, short and load.
- Connect the antenna, and find the frequency with the deepest dip.
- For a spectrum analyser, set centre frequency and span.

## Practice
- Measure your video antenna's match.
- Use your scope's FFT on a PWM signal, and find the harmonics.

## Mistakes
- Connecting too much power to the input. Check its limit, and use an attenuator.
- Skipping calibration.

## Check
Q: What does a deep dip in a VNA's reflection plot show?
+ The antenna is well matched at that frequency
- The antenna is broken
- The battery is low
W: Little power is reflected there.

# bench-supply: Bench power supply
group: Power
priority: Buy first
lessons: bench-supply, ideal-sources, ohms-law, bringup
viz: supply
panel: supply
> Gives a chosen voltage with a current limit. Your best protection for new boards.

## What it is
A mains-powered box with two knobs: voltage, and current limit. It holds your set voltage until the load tries to draw more than the limit, then it holds the current instead.

## Why it matters
A battery will happily push huge current into a short circuit. A bench supply will not. With the limit set low, a mistake simply makes the supply fold back, and your new board survives. It also shows you how much current your circuit draws, right on the front panel.

## How to use it
- With the output **off**, set the voltage.
- Short the output leads briefly, or use the limit preview, to set the current limit just above what you expect.
- Connect the load, with the correct polarity.
- Turn the output on, and watch the current display.
- If **CC** lights up unexpectedly, turn off and look for a fault.

## Functions
| Control | What it does |
|---|---|
| Voltage knob | Sets the target voltage |
| Current knob | Sets the limit |
| CV light | Holding constant voltage: normal |
| CC light | Limiting current: possible fault |
| Output button | Connects the terminals |

## Practice
- Set 5 V and 100 mA, connect a 100 Ω resistor, and read the current.
- Lower the limit to 20 mA, and watch the voltage fall to 2 V.
- Power an LED with no resistor at a low limit, and see the supply protect it.
- Read the idle current of a flight controller, with a low limit.

## Mistakes
- Setting the limit too high, which removes the protection.
- Connecting a battery to the output, which can push current backwards.
- Leaving leads connected while changing the voltage.

## Buying
Choose 30 V, 5 A or better, with a good display. It should cover 6S voltage (25.2 V). Check for low ripple if you test analog circuits.

## Check
Q: The supply is set to 12 V and 0.1 A, and the load is 50 Ω. What will it show?
+ 5 V and 0.1 A, in CC mode
- 12 V and 0.24 A
- 12 V and 0.1 A
W: 12 V would need 0.24 A, above the limit, so voltage falls to I × R.

# function-generator: Signal generator
group: Power
priority: Later
lessons: function-generator, bode, frequency
viz: filter
> Makes test signals of any shape and frequency.

## What it is
An instrument that outputs sine, square, triangle and pulse waves, at a frequency and amplitude you choose.

## Why it matters
To test a filter or amplifier, you need a known input. Feed in a clean signal, and compare the output with it on a scope. That's how you measure gain and bandwidth.

## How to use it
- Choose the wave shape.
- Set frequency and amplitude.
- Add a DC offset if needed.
- Check the output impedance setting: 50 Ω or High-Z.
- Turn the output on, and view it on a scope.

## Practice
- Sweep an RC low-pass filter, and find the −3 dB point.
- Send a square wave into an RC filter, and watch the edges round.
- Measure the gain of an op-amp circuit.

## Mistakes
- Seeing double the set amplitude, because the generator assumes a 50 Ω load.
- Driving a circuit beyond its supply voltage.

## Check
Q: A generator set to 1 V shows 2 V on a scope. Why?
+ It assumes a 50 Ω load, while the scope is high impedance
- The scope is broken
- The probe is on 2×
W: With no 50 Ω load, the internal divider no longer halves the voltage.

# electronic-load: Electronic load
group: Power
priority: Later
lessons: efficiency, internal-resistance, thermal-design
> A controllable load that draws a set current.

## What it is
An instrument that acts like an adjustable resistor. Most offer constant current, resistance or power modes, and turn the power into heat.

## Why it matters
You can't trust a regulator until it has been tested at full load. An electronic load checks real current, efficiency, voltage droop, and battery capacity.

## How to use it
- Check the voltage, current and power limits.
- Connect it with thick, short wires.
- Set constant current, starting low, then raise it.
- Monitor temperature and voltage.

## Practice
- Plot the efficiency of a buck converter at several loads.
- Measure a battery's internal resistance from voltage sag.

## Mistakes
- Exceeding its power limit.
- Connecting it backwards.
- Discharging a LiPo below its safe voltage. Set a cut-off.

## Check
Q: What does constant-current mode do?
+ Draws a fixed current whatever the voltage
- Holds the voltage steady
- Charges the battery
W: The load adjusts itself to keep current constant.

# lipo-charger: LiPo balance charger
group: Power
priority: Buy first
lessons: charging, lipo, bms, internal-resistance
viz: charger
> Charges lithium packs safely, cell by cell.

## What it is
A smart charger that does CC/CV charging, and uses the balance lead to watch every cell.

## Why it matters
LiPo packs store a lot of energy and can catch fire if mistreated. A good charger protects them, shows cell health, and is the only safe way to charge.

## How to use it
- Inspect the pack for swelling or damage.
- Select the right chemistry, LiPo, and cell count.
- Set current to 1C: for a 1500 mAh pack, 1.5 A.
- Connect main and balance leads.
- Start in balance mode, on a fire-safe surface.
- Stay nearby, and use storage mode if you won't fly soon.

## Functions
| Mode | Use |
|---|---|
| Balance charge | Normal use |
| Storage | Brings cells to about 3.8 V |
| Discharge | Lowers charge safely |
| Internal resistance | Tracks the pack's ageing |

## Practice
- Record each cell's voltage and resistance on a new pack.
- Compare the same pack after 20 flights.

## Mistakes
- Selecting the wrong chemistry or cell count.
- Charging a swollen or damaged pack.
- Charging without supervision.
- Using parallel boards with packs at different voltages.

## Safety
Charge on a non-flammable surface, away from anything that can burn. Dispose of damaged packs according to local guidance.

## Check
Q: What current should you use to charge a 1300 mAh pack at 1C?
+ 1.3 A
- 13 A
- 0.13 A
W: 1C equals the capacity in amps.

# smoke-stopper: Smoke stopper
group: Power
priority: Buy first
lessons: open-short, fuses-protection, bringup
> A cheap device that protects a build the first time you plug in a battery.

## What it is
A small inline adapter between battery and drone. It limits current during power-up, often using a fuse or a small lamp in series.

## Why it matters
Many new builds are destroyed in the first second, by a solder bridge or a reversed wire. A smoke stopper turns that into a bright lamp or a blown fuse, not a burnt ESC.

## How to use it
- Check for shorts with a multimeter's continuity mode first.
- Connect the smoke stopper to the battery, then the drone.
- Watch for a bright lamp or a tripped fuse.
- If it's fine, power normally. Don't spin motors with it in line.

## Practice
- Make every first power-up go through it, every time.

## Mistakes
- Skipping it on a "simple" rebuild.
- Testing motors through it. It limits current, so they won't run properly.

## Check
Q: When should you use a smoke stopper?
+ On first power-up, and after any repair
- Only in flight
- Only for batteries above 6S
W: That's when shorts are most likely.

# soldering-station: Soldering station
group: Build
priority: Buy first
lessons: soldering, states-of-matter, assembly
panel: iron
> Melts solder to join parts. The core skill of hardware building.

## What it is
A temperature-controlled iron. A sensor in the tip holds the temperature steady, which simple plug-in irons can't do.

## Why it matters
Most drone failures that aren't a crash are bad joints. Good soldering makes everything else reliable. Heavy battery wires also need more heat than small irons can supply.

## How to use it
- Set around 350 °C for leaded solder, and a little higher for lead-free.
- Clean and tin the tip, so that it's shiny.
- Touch the tip to **both** the pad and the lead together.
- Feed solder into the joint, not onto the tip.
- Remove the solder, then the iron. It should take a few seconds.
- Let it cool without moving.

Flux is the secret. It removes oxide, so that solder flows.

## Functions
| Part | What it does |
|---|---|
| Temperature control | Holds tip heat steady |
| Tip shape | Chisel tips transfer more heat |
| Brass wool | Cleans the tip gently |
| Stand | Parks the iron safely |

## Practice
- Tin a wire, and solder it to a pad.
- Solder ten 0805 resistors on a practice board.
- Solder an XT60, using a large tip and enough heat.
- Remove a part with solder wick.

## Mistakes
- Heating the solder rather than the joint, which gives a cold joint.
- Using a tiny tip on big wires.
- Holding it too long, and lifting a pad.
- Letting the tip go dull. Tin it before storing.

## Safety
The tip burns skin instantly. Use ventilation for fumes, and eye protection, and wash your hands after using leaded solder.

## Buying
Pick a station with a fast warm-up, and replaceable tips. Compact USB-C irons are also good and portable, if powered well enough.

## Check
Q: What should touch the iron's tip?
+ Both the pad and the component lead
- Only the solder
- Only the lead
W: Heat both surfaces, so solder bonds to each.

# hot-air: Hot air and rework
group: Build
priority: Later
lessons: footprints, assembly, soldering
> Melts every joint on a part at once, for removing and fitting chips.

## What it is
A tool that blows air at a set temperature and flow rate. With solder paste, it can fit QFN and other small parts.

## Why it matters
You can't remove a many-pin chip with an iron alone. Hot air lets you repair boards, and swap a damaged MOSFET or MCU.

## How to use it
- Add flux to the part.
- Use a moderate temperature and low airflow.
- Move the nozzle in small circles.
- Lift the part only when all joints are molten.
- Clean, then place a new part with paste and heat it again.

## Practice
- Remove a chip from a scrap board.
- Fit a QFN part with solder paste.

## Mistakes
- Blowing small parts away with high airflow.
- Overheating the board, so that it blisters.
- Melting nearby plastic connectors. Shield them with heat-resistant tape.

## Check
Q: What is the most common way to lose a small part with hot air?
+ Airflow set too high
- Temperature too low
- Too much flux
W: Tiny parts simply blow away.

# breadboard-kit: Breadboard and jumper kit
group: Build
priority: Buy first
lessons: breadboard, circuit, resistor
> Build and change circuits with no soldering.

## What it is
A plastic board of spring contacts, along with jumper wires and a kit of parts.

## Why it matters
It lets you try an idea in minutes. Almost every lesson on this site can be tested on a breadboard.

## How to use it
- Bring power to the side rails.
- Each short row of five holes is one node.
- Place chips across the centre gap.
- Keep wires short and colour-coded: red for power, black for ground.

## Practice
- Build the LED, voltage divider and RC circuits from the lessons.
- Measure each with a meter.

## Mistakes
- High current. Contacts are only for small currents.
- High-speed circuits, as stray capacitance spoils them.
- Bent or dirty leads, giving poor contacts.

## Check
Q: Which holes on a breadboard row are joined?
+ The five on one side of the centre gap
- All holes on the board
- None of them
W: The centre gap separates the two halves.

# esd-kit: ESD protection
group: Build
priority: Buy next
lessons: static-electricity, mosfet, lab-safety
> A wrist strap and mat that stop static killing parts.

## What it is
An anti-static mat and wrist strap that hold you and your work at the same potential. Both connect to ground through a high-value safety resistor.

## Why it matters
Static can damage a chip with no spark that you feel. The damage may only show up later, as an unreliable board. It's especially important for MOSFETs and sensors.

## How to use it
- Connect the mat to a proper ground point.
- Wear the strap against your skin.
- Keep parts in their bags until needed.
- Handle boards by the edges.

## Practice
- Set up a bench corner with a mat before your first board build.

## Mistakes
- Wearing it over clothing.
- Keeping plastic near sensitive boards.
- Using a strap with no resistor. The resistor protects you.

## Safety
Never work on live mains while using a wrist strap. It gives a path to ground.

## Check
Q: Why does a wrist strap include a resistor of about 1 MΩ?
+ It drains static slowly, and limits current through you
- It makes the strap stronger
- It raises your voltage
W: A direct ground link would be a shock hazard.

# microscope: Magnifier or microscope
group: Build
priority: Buy next
lessons: soldering, debug-method
> Lets you see solder joints and tiny parts clearly.

## What it is
A magnifying lamp, stereo microscope or USB microscope.

## Why it matters
Most board faults are visible: a bridge, a lifted pin, a part rotated the wrong way. If you can't see it, you can't fix it.

## How to use it
- Inspect every board before powering on.
- Look along each row of pins.
- Check polarity marks on diodes and capacitors.

## Practice
- Compare your best and worst joints up close.

## Mistakes
- Using a laggy USB camera while soldering. A stereo microscope is better for hands-on work.

## Check
Q: When should you inspect a new board?
+ Before first power-on
- After it fails
- Only if it smokes
W: Finding a bridge early saves the board.

# hand-tools: Hand tools
group: Build
priority: Buy first
lessons: wire-sizing, footprints
> Cutters, strippers, tweezers and calipers.

## What it is
The small tools used every day.

| Tool | Use |
|---|---|
| Flush cutters | Trim leads and zip ties |
| Wire strippers | Remove insulation without nicking copper |
| Fine tweezers | Place small parts |
| Crimp tool | Make connectors |
| Digital calipers | Measure parts and footprints |
| Hex drivers | Frame screws |

## Why it matters
A nicked wire is a weak wire. Good hand tools prevent problems you'd otherwise blame on electronics.

## How to use it
- Match the stripper notch to the wire gauge.
- Use the right crimp die for each connector.
- Measure a part with calipers before designing its footprint.

## Practice
- Crimp a JST connector, and pull-test it.
- Measure a connector's pitch with calipers.

## Mistakes
- Stripping with cutters, which damages strands.
- Using steel tweezers near live circuits.

## Check
Q: Why do nicks in a wire matter?
+ They reduce its strength and current capacity
- They change the colour code
- They raise the voltage
W: Vibration then breaks the wire at that point.

# debug-probe: ST-Link and debug probe
group: Debug
priority: Buy next
lessons: swd-debug, stm32, bringup
> Lets you program a chip, and pause it to look inside.

## What it is
A USB adapter that speaks SWD to an STM32. Other chips use similar probes, such as J-Link.

## Why it matters
Printing messages only goes so far. A debug probe lets you stop code at a line, read every variable, and see where a crash happened. It also programs a chip with no bootloader.

## How to use it
- Connect SWDIO, SWCLK, GND and, if available, NRST.
- Connect the target reference voltage.
- Power the board.
- Connect from STM32CubeProgrammer or your IDE.
- Flash, then set a breakpoint.

## Practice
- Flash a blink program over SWD.
- Pause it, and change a variable.

## Mistakes
- Missing ground connection.
- Long, loose wires at high speed. Lower the SWD speed.
- Reusing the SWD pins as GPIO in firmware, locking yourself out.

## Check
Q: What are the two main SWD signals?
+ SWDIO and SWCLK
- TX and RX
- SDA and SCL
W: SWD needs only those two, plus ground.

# usb-serial: USB to UART adapter
group: Debug
priority: Buy first
lessons: uart, logic-levels, gpio
viz: serial
> Lets your computer talk to any UART device.

## What it is
A small adapter based on chips such as CP2102 or FT232, that gives a serial port on your computer.

## Why it matters
Many modules speak UART: GPS, telemetry radios, and debug consoles. This adapter is the quickest way to see what they're saying.

## How to use it
- Set the adapter to the right logic level, usually 3.3 V.
- Connect GND to GND, TX to RX, and RX to TX.
- Open a serial terminal on your computer.
- Set the correct baud rate.

## Practice
- Connect a GPS module, and read its NMEA messages.
- Print debug messages from an MCU.

## Mistakes
- TX to TX.
- Wrong baud rate, which gives garbage characters.
- 5 V adapter on a 3.3 V device.

## Check
Q: Your terminal shows random symbols. What is the most likely cause?
+ Wrong baud rate
- Too much ground
- A faulty screen
W: A timing mismatch garbles each byte.
