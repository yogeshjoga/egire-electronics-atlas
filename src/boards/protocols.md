# uart: UART
group: Wired, on the board
lessons: uart, logic-levels
> Two wires, no clock. The everyday serial link.

## How it works
Each byte is sent as a start bit, eight data bits and a stop bit, at an agreed baud rate. TX of one device connects to RX of the other.

| Item | Typical |
|---|---|
| Wires | TX, RX, ground |
| Speed | 9600 baud to a few Mbit/s |
| Distance | Centimetres on logic levels |
| Devices | Two, point to point |

## When to use it
GPS, radio receivers, debug consoles, and linking a Raspberry Pi to a microcontroller.

```
Serial.begin(115200);
Serial.println("hello");
```

# i2c: I²C
group: Wired, on the board
lessons: i2c, gpio
> Two shared wires, many addressed devices.

## How it works
SDA carries data and SCL the clock. Each device has an address. Pull-up resistors hold both lines high, and devices pull them low.

| Item | Typical |
|---|---|
| Wires | SDA, SCL, ground |
| Speed | 100 kHz, 400 kHz, 1 MHz |
| Devices | Many, by address |

## When to use it
Slow sensors and displays: barometers, magnetometers, temperature and small OLEDs. Not fast IMU streams.

# spi: SPI
group: Wired, on the board
lessons: spi
> Four wires, fast, with a chip select for each device.

## How it works
The controller drives the clock and selects a device with CS. Data moves both ways at once on MOSI and MISO.

| Item | Typical |
|---|---|
| Wires | SCK, MOSI, MISO, CS per device |
| Speed | 1 to 50 MHz or more |

## When to use it
IMUs, flash memory, displays and ADCs: anything fast.

# can: CAN and DroneCAN
group: Wired, between boards
lessons: can-bus, differential-pairs
> A robust two-wire network for vehicles.

## How it works
A differential pair with 120 Ω termination at each end. Messages have priorities, so the most important wins when two nodes talk at once. Every frame is checked with a CRC.

## When to use it
Long wires in noisy places: cars, robots, and drone GPS and ESCs using DroneCAN.

# usb: USB
group: Wired, between boards
lessons: usb-interface
> The universal computer link.

## How it works
A host (your PC) controls one or more devices. Common device classes include CDC (a virtual serial port), HID (keyboard, mouse) and mass storage.

## When to use it
Configuration, firmware updates, and fast data to a computer. Many flight controllers appear as a virtual serial port.

# rs485: RS-485 and Modbus
group: Wired, between boards
lessons: differential-pairs
> Long-distance industrial serial over a differential pair.

## How it works
RS-485 is the electrical layer: a differential pair good for hundreds of metres. Modbus is a simple request-and-reply protocol often run on top.

## When to use it
Industrial sensors, solar inverters and factory equipment.

# pwm-protocol: PWM and servo signals
group: Drone and motor signals
lessons: pwm, timers
> Information carried in pulse width.

## How it works
Hobby servos read a pulse of 1 to 2 ms, repeated about every 20 ms. 1.5 ms is the centre. Older ESCs used the same idea.

## When to use it
Servos, simple ESCs, LED dimming. Digital protocols have replaced it for modern drone ESCs.

# dshot-protocol: DShot
group: Drone and motor signals
lessons: dshot, crc
> Digital throttle from flight controller to ESC.

## How it works
A 16-bit frame: 11 bits of throttle, 1 telemetry request bit and a 4-bit checksum. Bit lengths encode 1s and 0s. Bidirectional DShot also returns motor RPM, which allows RPM filtering.

## When to use it
Any modern multirotor. It needs no calibration and rejects corrupted frames.

# crsf: CRSF (Crossfire protocol)
group: Drone and motor signals
lessons: uart, radio-link
> The serial protocol between an ELRS receiver and the flight controller.

## How it works
A fast UART protocol carrying stick channels one way, and telemetry such as battery voltage and link quality the other.

## When to use it
Connecting ExpressLRS or TBS Crossfire receivers.

# msp: MSP
group: Drone and motor signals
lessons: uart
> MultiWii Serial Protocol, used by Betaflight and INAV.

## How it works
Simple request-and-reply messages over UART or USB. The configurator app uses it, and so do some OSD and digital video systems.

# mavlink: MAVLink
group: Drone and motor signals
lessons: uart, nav-sensors, failsafe
> The message protocol of ArduPilot and PX4.

## How it works
Small binary messages, such as heartbeat, attitude, GPS position and commands, each with a system ID and a checksum. It runs over UART, UDP or radio links.

## When to use it
Ground stations, telemetry radios, and connecting an AI companion computer to an autopilot.

# wifi: Wi-Fi
group: Wireless
lessons: radio-link, antenna
> High-speed wireless networking at 2.4, 5 and 6 GHz.

## When to use it
Video, file transfer and dashboards on a lab network. It uses more power than BLE, and range is limited.

# ble: Bluetooth Low Energy
group: Wireless
lessons: radio-link
> Very low power wireless for phones and sensors.

## How it works
Devices advertise, then connect. Data is organised as services and characteristics that a phone app can read or write.

## When to use it
Wearables, battery sensors and phone-controlled gadgets.

# lora: LoRa and LoRaWAN
group: Wireless
lessons: radio-link, shannon-hartley
> Long range at very low data rate.

## How it works
Chirp spread-spectrum modulation trades speed for range. LoRaWAN adds gateways and a network server. ExpressLRS uses LoRa-style modulation for its long-range modes.

## When to use it
Farm sensors, remote telemetry, kilometres of range with tiny data.

# ethernet: Ethernet and TCP/IP
group: Networking
lessons: differential-pairs
> Wired networking: the foundation of the internet.

## How it works
Messages travel in layers: Ethernet frames carry IP packets, which carry TCP (reliable, ordered) or UDP (fast, no guarantee) data.

| Choose | When |
|---|---|
| TCP | Correctness matters: files, commands |
| UDP | Speed matters: live video, telemetry |

# mqtt: MQTT
group: Networking
lessons: radio-link
> Lightweight publish and subscribe messaging for IoT.

## How it works
Devices connect to a central **broker**. A sensor **publishes** a message to a **topic**, such as `drone/1/battery`. Anything **subscribed** to that topic receives it. Senders and receivers never connect to each other directly.

| Concept | Meaning |
|---|---|
| Broker | The server in the middle, such as Mosquitto |
| Topic | A path name, like `lab/bench/temperature` |
| Wildcards | `+` matches one level, `#` matches everything below |
| QoS 0 | At most once: fast, may be lost |
| QoS 1 | At least once: may duplicate |
| QoS 2 | Exactly once: slowest |
| Retained | The broker keeps the last value for new subscribers |
| Ports | 1883 plain, 8883 with TLS |

```
import paho.mqtt.client as mqtt
c = mqtt.Client()
c.connect("192.168.1.10", 1883)
c.publish("drone/1/battery", "15.8")
```

## When to use it
Telemetry dashboards, smart sensors and fleets of devices. Not for real-time control loops, as delivery timing isn't guaranteed.

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

## How it works
HTTP is request and reply: GET reads, POST sends. A REST API organises this around resources. WebSocket keeps a connection open, so both sides can send at any time.

## When to use it
Device web pages, configuration, cloud APIs. Use WebSocket for live dashboards.

# dds: DDS (behind ROS 2)
group: Networking
lessons: radio-link
> The publish and subscribe system underneath ROS 2.

## How it works
Data Distribution Service finds participants on the network automatically, and delivers messages with configurable quality of service. In ROS 2, you mostly meet it as QoS settings, such as reliable or best effort.

## Watch out
Discovery across Wi-Fi and different subnets can be tricky. Check your network setup first when nodes don't see each other.
