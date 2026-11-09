# choosing-protocols: Choosing a protocol
group: Start here
lessons: uart, i2c, spi, can-bus, radio-link
> Compare every protocol side by side, then pick with a few simple questions.

## Ask these questions in order
1. **Where are the two ends?** On one board, between boards in one robot, across a building, or across the internet.
2. **How fast must data flow?** A temperature once a second, or an IMU at 8 kHz.
3. **How many devices share it?** Two, a handful, or dozens.
4. **How noisy and long is the path?** Short traces, or long wires beside motors.
5. **Does timing matter?** A control loop needs fixed timing; a dashboard doesn't.
6. **What does the other end already speak?** Often this decides it.

## Wired protocols at a glance
| Protocol | Wires | Typical speed | Distance | Devices | Best for |
|---|---|---|---|---|---|
| UART | 2 and ground | Up to a few Mbit/s | Short | 2 | Modules, debug, board to board |
| I²C | 2 and ground | 100 kHz to 1 MHz | On one board | Many, addressed | Slow sensors, displays |
| SPI | 3, plus 1 per device | 1 to 50 MHz | On one board | Several, by chip select | IMUs, flash, fast ADCs |
| CAN | 2, twisted | Up to 1 Mbit/s, more with CAN FD | Tens of metres | Many | Vehicles, robots, noisy places |
| RS-485 | 2, twisted | Up to about 10 Mbit/s | Hundreds of metres | Many | Industrial, long cables |
| USB | 2 data, power | 12 to 480 Mbit/s and more | Up to about 5 m | Host and devices | Computers, config |
| Ethernet | 2 or 4 pairs | 100 Mbit/s and more | 100 m | Network | Computers, cameras |

## Drone signals at a glance
| Protocol | Carried on | Used between |
|---|---|---|
| PWM | One signal wire | Receiver or FC and a servo |
| DShot | One signal wire | FC and ESC |
| CRSF | UART | Receiver and FC |
| MSP | UART or USB | FC and configurator, OSD |
| MAVLink | UART, UDP, radio | Autopilot and companion or ground station |

## Wireless and network protocols at a glance
| Protocol | Range | Data rate | Power | Best for |
|---|---|---|---|---|
| Wi-Fi | Tens of metres | High | High | Video, dashboards |
| BLE | Metres to tens | Low | Very low | Phones, battery sensors |
| LoRa | Kilometres | Very low | Low | Remote sensors |
| MQTT | Any network | Small messages | Depends on link | Telemetry fleets |
| HTTP and WebSocket | Any network | Medium | Depends on link | Web pages, APIs |
| DDS | Local network | High | Depends on link | ROS 2 robots |

## Quick picks
| Situation | Choose |
|---|---|
| Fast IMU on the same board | SPI |
| Several slow sensors with few pins | I²C |
| GPS module, or Pi to microcontroller | UART |
| Long wires beside motors | CAN or RS-485 |
| Plug into a laptop | USB |
| Sensor values to a dashboard | MQTT over Wi-Fi |
| Kilometres, tiny data | LoRa |
| Phone app | BLE |
| AI computer to autopilot | MAVLink over UART |

## Design rules for any wired link
- **Share a ground** between both ends, unless the link is isolated.
- **Match logic levels.** Joining 3.3 V and 5 V parts may need a level shifter.
- **Keep fast signals short**, with a ground return close by.
- **Protect connectors** that leave the board, using TVS diodes or series resistors.
- **Plan pins early.** Check which MCU pins support each peripheral before you draw the schematic.

# uart: UART
group: Wired, on the board
lessons: uart, logic-levels, clock-tree, crc
> Two wires, no clock. The everyday serial link.

## How it works inside
UART stands for universal asynchronous receiver-transmitter. "Asynchronous" means there's no clock wire, so both ends agree a speed in advance, called the **baud rate**.

The line rests **high** when idle. Each byte is sent as a frame:

| Part | Bits | Purpose |
|---|---|---|
| Start bit | 1, low | Signals a new byte, and lets the receiver lock its timing |
| Data | 8, lowest bit first | The byte itself |
| Parity | 0 or 1 | Optional simple error check |
| Stop bit | 1 or 2, high | Returns the line to idle |

The common setting "8N1" means 8 data bits, no parity, 1 stop bit, so each byte takes 10 bit times. At 115200 baud that's 11,520 bytes per second.

The receiver samples each bit many times, typically 16, and reads the middle. It restarts its timing at every start bit, so the two clocks must agree within about 2%. A wrong baud rate produces garbage characters.

UART only moves bytes. For anything important, wrap your data in **packets**: a start marker, a length, the data, and a checksum or [[crc|CRC]].

## Advantages
- Very simple, with hardware in every microcontroller.
- Only two signal wires, and it's full duplex: both directions at once.
- Easy to read with a USB adapter and a terminal.

## Disadvantages
- Normally only two devices.
- Both ends must agree the baud rate.
- Logic-level UART only reaches short distances.
- No built-in error checking beyond parity.

## Pick it when
Connecting one module to one microcontroller, such as GPS, an ELRS receiver or a telemetry radio. It's also ideal for a Raspberry Pi talking to a microcontroller, and for printing debug messages.

## Pins and circuit
- **TX goes to RX**, and RX to TX. This crossover is the most common mistake.
- **Connect the grounds.**
- **Match logic levels.** 3.3 V to 3.3 V is direct. 5 V into a 3.3 V pin needs a divider or a level shifter.
- A series resistor of about 100 Ω to 1 kΩ on each line limits current if the two boards are powered in a different order.
- **RS-232** serial ports, on old PCs and some instruments, use ±12 V inverted levels. Use a converter chip, and never connect them straight to a microcontroller.
- Optional RTS and CTS lines add hardware flow control for fast or bursty data.

## Example projects
- **GPS reader:** connect a GPS module's TX to an ESP32 RX at 9600 or 115200 baud, then read the NMEA sentences and display the position.
- **Pi to STM32 link:** send motor commands from a Raspberry Pi to an STM32 as framed packets with a CRC, and reject any corrupted ones. See [ROS 2 rover](#/boards/p10-ros2-rover).

```
Serial.begin(115200);
Serial.println("hello");
```

## Check
Q: Your terminal shows random characters. What's the most likely cause?
+ The baud rate doesn't match
- The grounds are joined
- The cable is too short
W: Without a shared clock, both ends must agree the speed.

# i2c: I²C
group: Wired, on the board
lessons: i2c, gpio, rc-transient
> Two shared wires, many addressed devices.

## How it works inside
I²C uses two lines, **SDA** for data and **SCL** for clock. Both are **open drain**: a device can only pull a line low. Resistors pull the lines high when nobody is pulling down.

A transaction looks like this:

1. **Start:** SDA falls while SCL is high.
2. **Address:** 7 address bits, then 1 bit for read or write.
3. **Acknowledge:** the addressed device pulls SDA low on the 9th clock. No pull means no device answered.
4. **Data:** bytes of 8 bits, each acknowledged.
5. **Stop:** SDA rises while SCL is high.

To read a register, you usually write the register number, send a **repeated start**, then read. A slow device can hold SCL low to make the controller wait. This is called **clock stretching**.

Because every device only pulls low, two devices can't fight. The low always wins, which makes sharing safe.

## Advantages
- Only two wires for many devices.
- Each device has an address, so no extra select pins.
- Acknowledge bits show whether a device is present.

## Disadvantages
- Slow: 100 kHz, 400 kHz, sometimes 1 MHz.
- Two parts with the same address can't share a bus, unless you add a multiplexer.
- Rise time is limited by pull-ups and bus capacitance, so long wires fail.
- A device stuck holding SDA low can freeze the bus.

## Pick it when
You have several slow sensors and few spare pins: barometers, magnetometers, temperature sensors, small OLED displays and EEPROMs.

## Pins and circuit
- **One pull-up resistor per line**, not one per device. Use 2.2 kΩ to 4.7 kΩ for 3.3 V. Lower values allow faster speeds, but draw more current.
- Many sensor modules already carry pull-ups. Several modules in parallel can make the total too strong, so check and remove extras.
- Keep total bus capacitance under about 400 pF, which means short wires.
- **Level shifting** between 3.3 V and 5 V buses is often done with two small MOSFETs, such as a BSS138 module.
- **Address conflicts:** use a part's address pin to change it, or an I²C multiplexer.
- Add a bus recovery routine in firmware, to clock SCL until a stuck device releases SDA.

## Example projects
- **Weather station:** a BME280 (temperature, humidity, pressure) and an OLED display share one I²C bus on an ESP32.
- **Sensor scan:** write a program that tries every address and prints which ones acknowledge. It's the first step in debugging any I²C board.

## Check
Q: An I²C bus works on the bench but fails with a 1 m cable. Why?
+ Cable capacitance slows the rising edges
- I²C needs a clock wire
- The address changed
W: Pull-ups charge the line slowly. Shorten the cable, or lower the speed or pull-up value.

# spi: SPI
group: Wired, on the board
lessons: spi, logic-analyzer, signal-integrity
> Four wires, fast, with a chip select for each device.

## How it works inside
SPI connects two **shift registers** in a loop. The controller drives the clock (**SCK**). On each clock, one bit moves from controller to device on **MOSI**, and one bit moves back on **MISO**, at the same time. After 8 clocks, the two have swapped a byte.

**Chip select (CS)** picks the device. It's active low: pull it low to start, high to finish. Unselected devices let MISO float, so they don't interfere.

Two settings, **CPOL** and **CPHA**, give four modes:

| Mode | Clock idles | Data sampled on |
|---|---|---|
| 0 | Low | Rising edge |
| 1 | Low | Falling edge |
| 2 | High | Falling edge |
| 3 | High | Rising edge |

The device's datasheet tells you which mode it needs. Many sensors accept mode 0 and mode 3.

## Advantages
- Fast, often 10 to 50 MHz.
- Full duplex.
- Simple hardware, and no addresses.
- Works smoothly with DMA for high data rates.

## Disadvantages
- More pins: one chip select per device.
- No acknowledge, so a missing device just returns 0x00 or 0xFF.
- Only suitable for short distances on one board.

## Pick it when
Speed matters: IMUs in flight controllers, flash memory, SD cards, displays and fast ADCs.

## Pins and circuit
- SCK, MOSI and MISO are **shared**. Each device gets its own **CS**.
- Add a **10 kΩ pull-up on each CS**, so devices stay deselected while the MCU boots.
- For fast clocks, keep traces short. A series resistor of about 22 to 33 Ω at the driver reduces ringing.
- Route the clock away from sensitive analog parts.
- Some devices also have an interrupt pin. Connect it, so you read data when it's ready, not by constant polling.

## Example projects
- **IMU logger:** read an ICM-42688-P at 8 kHz over SPI on an STM32, using DMA, and stream it over UART. See [IMU attitude display](#/boards/p04-imu).
- **Flight data recorder:** write sensor data to an SD card or SPI flash, then read it back on a PC.

## Check
Q: Your SPI sensor always returns 0xFF. What's a likely cause?
+ Wrong SPI mode, or the chip select isn't reaching it
- Pull-up resistors are missing on SDA
- The baud rate is wrong
W: SPI has no acknowledge, so check mode, CS and wiring with a logic analyser.

# can: CAN and DroneCAN
group: Wired, between boards
lessons: can-bus, differential-pairs, crc, transmission-line
> A robust two-wire network for vehicles.

## How it works inside
CAN sends each bit as the **difference** between two wires, CANH and CANL. Noise hits both wires equally, so it cancels.

| State | CANH | CANL | Meaning |
|---|---|---|---|
| Recessive | About 2.5 V | About 2.5 V | Logic 1, nobody driving |
| Dominant | About 3.5 V | About 1.5 V | Logic 0, someone driving |

A dominant bit always overrides a recessive one. That gives CAN its key trick, **arbitration without collisions**. Every node sends its message ID bit by bit while listening. A node that sends recessive but hears dominant knows it has lost, and stops. The message with the **lowest ID wins** and continues undamaged.

Other built-in safety features:
- **Bit stuffing:** after five identical bits, an opposite bit is inserted, so receivers stay synchronised.
- **CRC** on every frame.
- **ACK slot:** any receiver confirms it heard a valid frame.
- **Error counters:** a node that keeps causing errors takes itself off the bus.

Classic CAN carries up to 8 data bytes at up to 1 Mbit/s. **CAN FD** carries up to 64 bytes, with a faster data phase.

## Advantages
- Very resistant to noise.
- Many nodes on two wires.
- Priorities and error handling are built into hardware.

## Disadvantages
- Needs a transceiver chip at each node.
- Small messages.
- Longer cables need lower bit rates.

## Pick it when
Wires run past motors or across a vehicle: car and robot networks, multi-joint arms, and drone GPS, compasses and ESCs using **DroneCAN**.

## Pins and circuit
- The MCU's CAN controller has **TX and RX** pins. These connect to a **CAN transceiver**, which drives CANH and CANL. Choose a 3.3 V transceiver for 3.3 V microcontrollers.
- Use a **twisted pair** for CANH and CANL.
- Put **120 Ω between CANH and CANL at each end** of the bus, never at the middle nodes. With power off, a meter across the bus should read about 60 Ω.
- Keep the stubs from the bus to each node short.
- Add ESD protection at connectors.

## Example projects
- **DroneCAN GPS:** connect a CAN GPS and compass to an ArduPilot flight controller, and see each node appear.
- **Robot arm:** an STM32 in each joint reports angle and receives commands over one CAN bus.

## Check
Q: Two nodes send at once. What happens?
+ The message with the lower ID wins, and continues without damage
- Both messages are destroyed
- The bus shuts down
W: Dominant bits override recessive ones, so the lower ID carries on.

# usb: USB
group: Wired, between boards
lessons: usb-interface, differential-pairs, tvs-diode
> The universal computer link.

## How it works inside
USB is **host-controlled**. The host, such as your PC, asks; devices only answer. When a device is plugged in, the host **enumerates** it: it reads descriptors that say what the device is, then loads a driver.

Data travels on a differential pair, **D+ and D−**. A device has **endpoints**, numbered channels for data. Common device classes need no custom driver:

| Class | Appears as | Example |
|---|---|---|
| CDC | A virtual serial port | Flight controller in Betaflight |
| HID | Keyboard, mouse, joystick | A radio as a simulator joystick |
| MSC | A disk drive | A data logger |
| DFU | A firmware update device | STM32 bootloader |

Full speed runs at 12 Mbit/s, which many microcontrollers support. High speed is 480 Mbit/s.

## Advantages
- Every computer has it.
- Carries power as well as data.
- Standard classes work without writing drivers.

## Disadvantages
- More complex firmware, using a USB stack.
- Needs an accurate clock.
- Cables are limited to a few metres.

## Pick it when
Connecting to a computer for configuration, firmware updates, logs and fast data.

## Pins and circuit
- Route D+ and D− as a **90 Ω differential pair**, kept short and together.
- On a USB-C device, connect a **5.1 kΩ resistor from each CC pin to ground**. Without them, many USB-C chargers won't turn on the 5 V supply.
- Add a low-capacitance **ESD protection** chip right at the connector.
- Power from VBUS through a regulator. Add protection so VBUS and a battery can't fight.
- The MCU needs an accurate clock, usually from a crystal.

## Example projects
- **USB virtual serial port:** turn on CDC in STM32CubeMX, and stream sensor data to a PC.
- **Radio as a joystick:** make an RP2040 appear as a HID joystick, reading two Hall gimbals.

## Check
Q: A USB-C board gets no power from a USB-C charger, but works from a USB-A cable. Why?
+ The 5.1 kΩ CC resistors are missing
- D+ and D− are swapped
- The crystal is wrong
W: USB-C chargers only turn on VBUS when they detect those resistors.

# rs485: RS-485 and Modbus
group: Wired, between boards
lessons: differential-pairs, transmission-line, crc
> Long-distance industrial serial over a differential pair.

## How it works inside
RS-485 is an **electrical layer**: it carries UART bytes over a differential pair called **A and B**. Usually it's **half duplex**: one twisted pair, used one direction at a time. Each node's transceiver has a driver-enable pin that turns its transmitter on only while sending.

**Modbus RTU** is often run on top. A controller sends a request: device address, function code, data and a **CRC-16**. Only the addressed device replies. Silence of 3.5 character times marks the end of a message.

## Advantages
- Very long cables, hundreds of metres or more at lower speeds.
- Many devices on one pair.
- Cheap, and widely used in industry.

## Disadvantages
- Half duplex, so firmware must control the driver enable.
- Slower than Ethernet.
- Modbus has no security.

## Pick it when
Industrial sensors, solar inverters, energy meters and long-distance farm or building wiring.

## Pins and circuit
- MCU **TX goes to DI**, transceiver **RO goes to MCU RX**, and a GPIO drives **DE and RE**, tied together.
- Choose a 3.3 V transceiver for 3.3 V microcontrollers.
- **Terminate both ends** with 120 Ω across A and B.
- Add **fail-safe bias resistors** at one point, pulling A up and B down. These hold the line in a known state when nobody is talking.
- Use twisted pair, and add surge and ESD protection on long outdoor cables.

## Example projects
- **Soil sensor network:** read several Modbus soil moisture sensors along a 100 m cable from one ESP32.
- **Energy meter logger:** read voltage and power from a Modbus meter, and publish them over MQTT.

# pwm-protocol: PWM and servo signals
group: Drone and motor signals
lessons: pwm, timers
> Information carried in pulse width.

## How it works inside
A **servo signal** repeats about 50 times per second, every 20 ms. The **pulse width** carries the value: about 1.0 ms is one end of travel, 1.5 ms is the centre, and 2.0 ms is the other end. The servo's own circuit compares the pulse with its position sensor and drives its motor to match.

This differs from **power PWM**, which switches energy into a load and uses the duty cycle. Both use a timer peripheral.

## Advantages
- Very simple, and supported by every servo.
- One signal wire.

## Disadvantages
- Slow updates, and low resolution.
- No error checking.
- Pulse timing must be accurate, so use hardware timers, not software delays.

## Pick it when
Servos for steering, pan-tilt heads, grippers and flaps.

## Pins and circuit
- Connect signal, servo power and ground.
- **Power servos from a separate regulator** rated for their stall current. Never from the microcontroller's 5 V pin.
- **Join all grounds.**
- Add a large capacitor, a few hundred microfarads, near the servos to absorb current spikes.
- Many servos accept a 3.3 V signal, but check yours.

## Example projects
- **Pan-tilt camera mount:** two servos aim a camera, driven by joystick input or by an AI tracker.
- **Rover steering:** one servo steers, while an ESC drives the wheels.

# dshot-protocol: DShot
group: Drone and motor signals
lessons: dshot, crc, timers, interrupts-dma
> Digital throttle from flight controller to ESC.

## How it works inside
Each DShot frame is **16 bits**:

| Bits | Content |
|---|---|
| 11 | Throttle, 48 to 2047. Values 1 to 47 are commands |
| 1 | Telemetry request |
| 4 | Checksum, an XOR of the other three groups of four bits |

Each bit has a fixed period, and the **length of the high part** encodes the value. A long high means 1, a short high means 0. The number in the name is the speed in kbit/s: DShot600 runs at 600 kbit/s, so a frame takes about 27 µs.

**Bidirectional DShot** uses the same wire with the signal inverted. After each frame, the ESC replies with motor eRPM, which the flight controller uses for RPM filtering.

Flight controllers generate DShot with **timers and DMA**, so the CPU doesn't bit-bang each pulse.

## Advantages
- Digital, so no calibration.
- The checksum rejects corrupted commands.
- High update rate, and optional RPM telemetry.

## Disadvantages
- Needs timer and DMA hardware for reliable timing.
- Long wires can corrupt fast frames.

## Pick it when
Any modern multirotor ESC.

## Pins and circuit
- One signal wire per motor, plus **ground**, from the FC's motor outputs to the ESC.
- Keep wires short, with signal and ground run together.
- With a 4-in-1 ESC, a short harness carries all four signals, ground, and often current sensor and telemetry lines.
- The ESC gets battery power directly. The flight controller only sends signals.

## Example projects
- **Thrust stand:** command an ESC with DShot from an STM32, and log thrust and current. See [motor thrust stand](#/boards/p07-thrust).
- **RPM logger:** read bidirectional DShot telemetry, and plot motor RPM during throttle steps.

## Safety
Always remove propellers when testing your own ESC code.

# crsf: CRSF (Crossfire protocol)
group: Drone and motor signals
lessons: uart, radio-link, crc
> The serial protocol between an ELRS receiver and the flight controller.

## How it works inside
CRSF runs on a **UART**, often at 420,000 baud with ExpressLRS. Each frame has:

| Field | Meaning |
|---|---|
| Address or sync | Who the frame is for |
| Length | Bytes that follow |
| Type | What the frame contains |
| Payload | The data |
| CRC-8 | Error check |

The most important frame packs **16 channels of 11 bits** each into 22 bytes. Other frames carry **telemetry** back, such as battery voltage and link quality.

## Advantages
- Fast, low-latency control data.
- Two-way, so telemetry returns to your radio.
- CRC protects every frame.

## Disadvantages
- Mostly used in the RC world.
- Needs a full UART, with both TX and RX.

## Pick it when
Connecting ExpressLRS or TBS Crossfire receivers to a flight controller, or to your own robot.

## Pins and circuit
- **Receiver TX to FC RX**, and **receiver RX to FC TX**.
- Usually **5 V** and ground. Check your receiver's supply range.
- Use a hardware UART, and keep the antenna away from carbon fibre and power wires.

## Example projects
- **ELRS-controlled rover:** read CRSF channels on an ESP32, and drive motors and a steering servo.
- **Custom telemetry:** send rover battery voltage back to the radio screen.

# msp: MSP
group: Drone and motor signals
lessons: uart, crc
> MultiWii Serial Protocol, used by Betaflight and INAV.

## How it works inside
A simple **request and reply** protocol. A message starts with a fixed header, then a payload size, a command number, the payload, and a checksum. MSP version 2 uses a CRC-8 instead of a simple checksum, and allows bigger messages. The configurator app uses MSP to read and change settings.

## Advantages
- Easy to read and write.
- Gives access to flight controller data and settings.

## Disadvantages
- Polling based, so not designed for high-rate streaming.
- Specific to Betaflight-style firmware.

## Pick it when
Reading attitude, battery or settings from a Betaflight or INAV flight controller, or for OSD and display systems that use it.

## Pins and circuit
- Connect over USB, or wire a spare UART: TX to RX, RX to TX, and ground.
- Enable MSP on that UART in the configurator.

## Example projects
- **Flight data display:** a Raspberry Pi polls attitude over MSP, and shows it on a screen.
- **Battery reader:** an ESP32 reads FC battery voltage over MSP, and publishes it over MQTT.

# mavlink: MAVLink
group: Drone and motor signals
lessons: uart, nav-sensors, failsafe, crc
> The message protocol of ArduPilot and PX4.

## How it works inside
MAVLink sends small binary **messages**. Each MAVLink 2 packet has:

| Field | Purpose |
|---|---|
| Start marker | Finds the packet start |
| Length | Payload size |
| Sequence | Detects lost packets |
| System and component ID | Which vehicle and part sent it |
| Message ID | What kind of message |
| Payload | The data |
| CRC | Checks integrity, including the message definition |
| Signature | Optional authentication |

Every system sends a **HEARTBEAT** once a second, so the others know it's alive. Other messages stream attitude, GPS and battery data, or carry **commands**, which are acknowledged.

## Advantages
- Standard across ArduPilot, PX4 and ground station software.
- Works over UART, UDP and radio links.
- Libraries for Python and C.

## Disadvantages
- A large message set to learn.
- Unsigned links can be spoofed.

## Pick it when
Ground stations, telemetry radios, and linking an AI companion computer to an autopilot.

## Pins and circuit
- Use the flight controller's TELEM port: TX, RX and ground, plus optional CTS and RTS for flow control.
- On a Raspberry Pi, the main UART is GPIO14 (TXD) and GPIO15 (RXD). Cross them to the FC.
- Pick a fast baud rate, such as 921600, for companion links.
- **Don't power a Raspberry Pi from the telemetry port's 5 V.** Give it its own supply, and join grounds.

## Example projects
- **Companion computer:** read attitude from ArduPilot in Python, then send guided commands in simulation. See [companion computer project](#/boards/p11-companion).
- **Long-range telemetry:** add a telemetry radio pair, and watch live data in a ground station.

# wifi: Wi-Fi
group: Wireless
lessons: radio-link, antenna, power-tree, decoupling
> High-speed wireless networking at 2.4, 5 and 6 GHz.

## How it works inside
Devices join an **access point**, such as a router, as **stations**. Before sending, each device listens for a quiet channel, then sends a packet, and the receiver acknowledges it. Wi-Fi then carries normal IP networking, so TCP, UDP, MQTT and HTTP all run on top. WPA2 or WPA3 encrypts the data.

2.4 GHz reaches further and passes walls better. 5 GHz is faster but shorter range.

## Advantages
- High data rate.
- Uses existing networks and the internet.

## Disadvantages
- Power-hungry, with current peaks of several hundred milliamps.
- Range of tens of metres.
- Latency varies, so it's unsuitable for control loops.

## Pick it when
Dashboards, camera streams, firmware updates and lab telemetry.

## Pins and circuit
- An ESP32 module has the radio inside. You supply clean **3.3 V**, rated for about **500 mA peaks**, with bulk and ceramic capacitors close to the module.
- Give the EN pin an RC delay, about 10 kΩ and 1 µF, for a clean reset at power-up.
- Add a boot button on the boot-mode pin for programming.
- Keep a **copper-free zone** under and around the PCB antenna, at the board edge.

## Example projects
- **Bench power dashboard:** see [wireless telemetry with MQTT](#/boards/p06-mqtt).
- **Camera stream:** stream video from an ESP32-S3 camera to a browser.

# ble: Bluetooth Low Energy
group: Wireless
lessons: radio-link, antenna
> Very low power wireless for phones and sensors.

## How it works inside
BLE has two main parts:
- **GAP**, which covers advertising and connecting. A device advertises its presence on three special channels, and a phone scans.
- **GATT**, which organises data as **services** containing **characteristics**. A characteristic is a value that a phone can read, write, or be notified about.

Between short bursts of radio activity, devices sleep, which is why BLE uses so little power.

## Advantages
- Very low power, so coin cells can last months or more.
- Every phone supports it.

## Disadvantages
- Low data rate, and short range.
- More complex to design than plain serial.

## Pick it when
Wearables, battery sensors, and devices controlled from a phone app.

## Pins and circuit
- Use a certified module with a built-in antenna, such as an nRF52 or ESP32 module, to avoid radio certification work.
- Keep the antenna area free of copper.
- Decouple the supply well. A coin cell needs a capacitor to handle radio current bursts.

## Example projects
- **Phone battery monitor:** a BLE sensor reports battery voltage to a phone app.
- **BLE remote:** control a rover's LEDs or mode from a phone.

# lora: LoRa and LoRaWAN
group: Wireless
lessons: radio-link, shannon-hartley, antenna, spi
> Long range at very low data rate.

## How it works inside
LoRa uses **chirps**: signals that sweep in frequency. A higher **spreading factor** (SF7 to SF12) makes each symbol longer, which reaches further and resists noise, but sends data much more slowly.

**LoRaWAN** adds a network: sensors send to **gateways**, which pass data to a network server on the internet.

It uses licence-free bands, which differ by country. In India, LoRa is commonly used around 865 to 867 MHz. Check local rules for power and duty cycle.

## Advantages
- Kilometres of range.
- Very low power.

## Disadvantages
- Very low data rate, so no video.
- Duty-cycle limits on how often you may transmit.

## Pick it when
Remote farm sensors, tracking, and long-range telemetry with small data.

## Pins and circuit
- A LoRa module such as an SX1276 or SX1262 connects to the MCU by **SPI** (SCK, MOSI, MISO, NSS), plus a **reset** pin and a **DIO interrupt** pin.
- Use an antenna tuned for your band. **Never transmit without the antenna**.
- Power with a clean 3.3 V supply that can handle transmit current.

## Example projects
- **Farm sensor node:** send soil moisture every 15 minutes, running for months on batteries.
- **Recovery beacon:** send GPS position from a downed drone to a ground receiver kilometres away.

# ethernet: Ethernet and TCP/IP
group: Networking
lessons: differential-pairs, transformer, signal-integrity
> Wired networking: the foundation of the internet.

## How it works inside
Ethernet has layers:
- **PHY chip:** turns bits into signals on twisted pairs.
- **MAC:** builds frames with addresses, inside the processor.
- **IP:** routes packets between networks.
- **TCP or UDP:** carries your application's data.

| Choose | When |
|---|---|
| TCP | Correctness matters: files, commands. Lost data is resent |
| UDP | Speed matters: live video, telemetry. Late data is dropped |

## Advantages
- Fast and reliable, up to 100 m per cable.
- Standard everywhere.

## Disadvantages
- Bulky connectors and cables.
- More complex hardware.

## Pick it when
Linking computers on a robot (Raspberry Pi to Jetson), IP cameras, and lab equipment.

## Pins and circuit
- An MCU's **MAC** connects to a **PHY** chip, such as a LAN8720, over an interface like RMII, with a 50 MHz reference clock.
- The PHY connects through **magnetics**, an isolation transformer, to the RJ45 socket. Many sockets have the magnetics built in.
- Route the pairs as **100 Ω differential pairs**.

## Example projects
- **Robot backbone:** connect a Raspberry Pi and a Jetson by Ethernet, and stream ROS 2 topics between them.
- **STM32 UDP sender:** send sensor packets from an STM32 with an Ethernet PHY to a PC.

# mqtt: MQTT
group: Networking
lessons: radio-link
> Lightweight publish and subscribe messaging for IoT.

## How it works inside
MQTT runs over a **TCP** connection to a central **broker**.

1. The client sends **CONNECT**, and the broker replies **CONNACK**.
2. Senders **PUBLISH** messages to a **topic**, such as `drone/1/battery`.
3. Receivers **SUBSCRIBE** to topics. The broker forwards every matching message.
4. **PINGREQ** keep-alives show the client is still there.

| Feature | Meaning |
|---|---|
| Wildcards | `+` matches one level, `#` matches everything below |
| QoS 0 | At most once: fast, may be lost |
| QoS 1 | At least once: may duplicate |
| QoS 2 | Exactly once: slowest |
| Retained | The broker keeps the last value for new subscribers |
| Last will | A message the broker sends if a client disappears |
| Ports | 1883 plain, 8883 with TLS |

## Advantages
- Tiny messages, and simple clients.
- Senders and receivers don't need to know each other.
- Works across networks and the internet.

## Disadvantages
- Needs a broker.
- Delivery timing isn't guaranteed, so not for control loops.
- Secure it with TLS and passwords outside a closed lab network.

## Pick it when
Telemetry dashboards, smart sensors and fleets of devices.

## Pins and circuit
MQTT is software, so it has no pins. It runs over Wi-Fi or Ethernet. The diagram shows how devices connect through the broker.

## Example projects
- **Bench dashboard:** publish voltage and current from an ESP32. See [wireless telemetry with MQTT](#/boards/p06-mqtt).
- **Drone fleet status:** each drone publishes `fleet/<id>/battery` and `fleet/<id>/gps`, and a dashboard subscribes to `fleet/+/battery`.

```
import paho.mqtt.client as mqtt
c = mqtt.Client()
c.connect("192.168.1.10", 1883)
c.publish("drone/1/battery", "15.8")
```

## Check
Q: A sensor publishes to `farm/field1/soil`. Which subscription receives it?
+ farm/+/soil
- farm/soil
- field1/#
W: + matches exactly one level, here field1.

# http: HTTP, REST and WebSocket
group: Networking
lessons: radio-link
> The web's protocols, used by devices too.

## How it works inside
HTTP is **request and response** over TCP. A request has a method (GET to read, POST to send), a path, headers, and optionally a body, often JSON. The reply has a **status code**, such as 200 for OK or 404 for not found.

A **REST API** organises this around resources, for example `GET /api/battery`.

**WebSocket** starts as an HTTP request, then "upgrades" to a permanent connection where either side can send at any time. That suits live dashboards.

## Advantages
- Works with every browser and programming language.
- Easy to test with a browser or command-line tool.

## Disadvantages
- Heavier than MQTT for many small messages.
- Plain HTTP is not encrypted.

## Pick it when
Device configuration pages, cloud APIs, and live browser dashboards with WebSocket.

## Pins and circuit
HTTP is software, running over Wi-Fi or Ethernet. The diagram shows the request and response flow.

## Example projects
- **Setup page:** an ESP32 serves a web page to set Wi-Fi details and calibration values.
- **Live dashboard:** a WebSocket pushes motor RPM to a browser chart in real time.

# dds: DDS (behind ROS 2)
group: Networking
lessons: radio-link
> The publish and subscribe system underneath ROS 2.

## How it works inside
DDS (Data Distribution Service) has no central broker. Participants **discover each other automatically**, using multicast messages on the local network. Then publishers send data straight to matching subscribers, usually over UDP.

**Quality of service** settings control delivery:

| QoS | Options |
|---|---|
| Reliability | Reliable, resent if lost; or best effort, newest wins |
| Durability | Keep the last messages for late joiners, or not |
| History | How many messages to queue |

Sensor streams usually use best effort; commands use reliable.

## Advantages
- No broker to fail.
- Fine control of delivery.
- Automatic discovery.

## Disadvantages
- Discovery can struggle across Wi-Fi, VPNs and separate subnets.
- Mismatched QoS settings silently block communication.

## Pick it when
You use ROS 2. You mostly meet DDS as QoS settings and network configuration.

## Pins and circuit
DDS is software, running over Ethernet or Wi-Fi. The diagram shows nodes discovering each other.

## Example projects
- **Remote viewer:** stream a robot's IMU and camera topics from a Raspberry Pi to RViz on a laptop.
- **Teleop:** drive a rover by publishing velocity commands from a laptop. See [ROS 2 rover](#/boards/p10-ros2-rover).

## Check
Q: A ROS 2 subscriber gets nothing, though the topic exists. What should you check first?
+ That the QoS settings are compatible, and both are on the same network
- The baud rate
- The pull-up resistors
W: Mismatched QoS, such as reliable versus best effort, can block delivery.
