# How an FPV system fits together
An FPV drone is two radio links and a power system.

- **Control link:** your radio controller sends stick commands to a receiver, which feeds the flight controller.
- **Video link:** the camera feeds a video transmitter (VTX), which sends to your goggles.
- **Power:** the battery feeds the ESCs and motors, and regulators make the small rails.

Named chips below are common examples, not the only choices. Products change between revisions, so check the part numbers on your own board.

Learn these parts in this order: flight controller, ESC, receiver, VTX, then antennas.

# Flight controller (FC)
The brain. It reads the gyro thousands of times per second, runs control loops, and commands the motors. Lesson: [[flight-controller]].

| Component | Job | Common examples | What to check |
|---|---|---|---|
| Microcontroller | Runs Betaflight, INAV or ArduPilot | STM32F405, STM32F722, STM32H743, AT32F435 | Firmware support, UART count, timers |
| IMU (gyro and accelerometer) | Measures rotation and tilt | ICM-42688-P, BMI270, BMI088 | SPI interface, noise, firmware support |
| Barometer | Measures altitude | DPS310, BMP390 | Foam shield from prop wash |
| OSD chip | Draws text on analog video | AT7456E | Only used with analog video |
| Blackbox flash | Logs flight data | 16 MB or larger SPI flash | Capacity |
| Buck regulators | Make 5 V and 9 V or 10 V rails | Switching regulator ICs | Current, ripple |
| LDO | Quiet rail for the gyro | Low-noise LDO | Noise, PSRR |
| Crystal | Accurate clock | 8 MHz or similar | Load capacitors |
| Inverter or level shifter | Adapts some signals | Logic parts | Logic voltage |
| TVS and capacitors | Protect from spikes | Battery-rated TVS | Clamping voltage |

Must know: [[imu-sensors]], [[power-tree]], [[spi]], [[uart]], [[decoupling]].

# ESC
Turns battery power into three-phase drive for each brushless motor. It handles the hardest power electronics on the drone. Lesson: [[esc-design]].

| Component | Job | Common examples | What to check |
|---|---|---|---|
| Power MOSFETs | Six per motor, switching phases | Low $R_{DS(on)}$ N-channel parts | $V_{DS}$ at 1.5× battery, gate charge, thermal |
| Gate driver | Drives the MOSFET gates | FD6288 3-phase driver | Bootstrap, dead time |
| Microcontroller | Runs motor firmware | EFM8BB (BLHeli_S, Bluejay), STM32G071, AT32F421 (AM32) | Firmware support |
| Bulk capacitor | Absorbs spikes on the input | Low-ESR electrolytic | Voltage, ripple current |
| Ceramic capacitors | Fast local decoupling | Near the MOSFETs | Voltage, DC bias |
| Current shunt and amplifier | Measures battery current | Low-value shunt | Heat, accuracy |
| Back-EMF sensing resistors | Reads rotor position | Resistor divider | Layout |
| TVS diode | Clamps voltage spikes | Sized to battery voltage | Clamping voltage |
| LDO | Powers the MCU | Small regulator | Maximum input voltage |

**Firmware note:** BLHeli_S and Bluejay run on 8-bit EFM8 chips. AM32 is open source and supports STM32G071, AT32F421 and similar chips. Community sources report that BLHeli_32 is no longer developed, so new designs tend to use AM32.

Must know: [[mosfet-switch]], [[gate-driver]], [[foc]], [[thermal-design]], [[dshot]].

# Radio controller
The transmitter in your hands. It reads your sticks and sends channels to the drone.

| Component | Job | Common examples | What to check |
|---|---|---|---|
| Gimbals | Convert stick position to a signal | Hall-effect gimbals | Accuracy, wear |
| Hall sensors | Measure magnet position | Linear Hall sensors | Resolution, drift |
| ADC | Digitises stick position | On the MCU | Bits, sample rate |
| Microcontroller | Runs EdgeTX | STM32H750 on the RadioMaster TX16S MK3 | Firmware support |
| RF module | The control link | Internal ELRS, or external bay | Band, power |
| Display | Shows menus | Colour touchscreen | Sunlight use |
| Battery and charger IC | Portable power | Lithium cells, USB-C charging | Safety, charge rate |
| Switches and encoders | Modes and menus | Toggle switches | Lifetime |
| MicroSD or flash | Stores models and sounds | | Capacity |

Hall gimbals have no sliding contacts, so they don't wear like potentiometer gimbals. See [[hall-effect]].

# ExpressLRS (ELRS)
An open-source control link, using LoRa-style radio chips. A receiver is a tiny complete radio.

| Component | Job | Common examples | What to check |
|---|---|---|---|
| RF transceiver | The radio itself | SX1281 (2.4 GHz), SX1276 (900 MHz), LR1121 (both bands) | Band |
| Microcontroller | Runs ELRS firmware | ESP32 family | Target support |
| Power amplifier | Raises transmit power | PA and LNA front-end | Output power, heat |
| LNA | Improves receive sensitivity | Front-end | Noise |
| Crystal or TCXO | Accurate radio frequency | Temperature-compensated type | Stability |
| Antenna and connector | Radiates the signal | Dipole, T antenna, U.FL | Band matches |

**The RF chip decides the band**, not the ESP chip. Dual-band chips don't always mean both bands at once: Gemini and GemX features need two radios or matching hardware.

Receivers connect to the flight controller by [[uart|UART]], using the CRSF protocol. Must know: [[radio-link]], [[antenna]].

# Video transmitter (VTX)
Sends camera video to your goggles, usually at 5.8 GHz.

| Component | Job | Common examples | What to check |
|---|---|---|---|
| RF synthesiser and modulator | Puts video onto 5.8 GHz | RTC6705 in analog VTXs | Band, channels |
| Power amplifier | Raises output power | 25 mW to 1 W or more | Heat. Check local legal limit |
| Microcontroller | Controls frequency and power | Small MCU | SmartAudio or Tramp |
| Regulator | Clean supply | Low-noise rail | Noise lines in video |
| Antenna connector | Links to the antenna | U.FL, MMCX, SMA | Never power on without an antenna |
| Heatsink | Removes heat | Metal case, airflow | Overheating on the bench |

The flight controller changes VTX settings over a half-duplex UART, using SmartAudio or Tramp.

**Analog and digital.** Analog VTXs use simple FM video. Digital systems such as DJI, HDZero and Walksnail use encoders and proprietary chipsets, so you can't mix them, and their parts aren't openly documented.

Must know: [[em-waves]], [[thermal-design]], [[noise]].

# FPV camera
| Component | Job | Common examples | What to check |
|---|---|---|---|
| Image sensor | Turns light into signals | CMOS sensor | Size, dynamic range, low light |
| Lens | Sets field of view | M12 or M8 lens | Focal length |
| ISP | Processes the image | Built into the camera | Latency |
| Output stage | Sends video | Analog video, or MIPI for digital | Matches VTX |
| Regulator | Stable power | LDO | Noise-free supply |

Latency matters more than resolution for flying. Rolling shutter causes "jello" under vibration. For AI vision, prefer **global shutter**.

# Goggles
| Component | Job | Common examples | What to check |
|---|---|---|---|
| Video receiver | Tunes the 5.8 GHz signal | RX5808-class analog module, or digital module | Sensitivity |
| Diversity switch | Picks the better antenna | Two receivers | Link quality |
| Micro-display | Shows the image | OLED or LCD panel | Resolution, latency |
| Video processor | Handles scaling and OSD | | Delay |
| DVR | Records video | MicroSD | Write speed |
| Fan | Stops lens fogging and heat | Small blower | Noise |
| Battery input | External power | 2S to 6S | Check the range |

# Antennas
| Type | Pattern | Use |
|---|---|---|
| Dipole | Doughnut shape | Receivers, simple builds |
| T antenna | Dipole on a receiver | ELRS receivers |
| Cloverleaf or pagoda | Omnidirectional, circular | VTX |
| Patch | Directional | Goggles, long range |
| Helical | Very directional | Long-range ground stations |
| Moxon or Yagi | Directional | 900 MHz long range |

**Polarisation:** LHCP and RHCP must match at both ends, or you lose much of the signal.

**Connectors:** SMA and RP-SMA look alike, but the centre pin differs. U.FL (IPEX) is tiny and fragile. MMCX snaps in.

**Length:** a quarter wave is $\lambda/4$. At 5.8 GHz that is about 13 mm, and at 915 MHz about 82 mm.

Must know: [[antenna]], [[transmission-line]], [[impedance-control]].

# Motors and propellers
| Component | Job | What to check |
|---|---|---|
| Stator and windings | Create the rotating field | Size such as 2207, Kv |
| Rotor magnets | Follow the field | N52-type magnets, heat limit |
| Bearings | Smooth rotation | Damage after crashes |
| Propeller | Makes thrust | Diameter, pitch, load on the motor |

See [[bldc]] and the worked motor example on the Symbols page.

# Battery, power and GPS
| Component | Job | What to check |
|---|---|---|
| LiPo or Li-ion pack | Energy | S count, capacity, internal resistance |
| XT30, XT60 connector | Carries high current | Rating, good solder joints |
| Low-ESR capacitor | Absorbs spikes | Voltage above full charge |
| GPS and compass module | Position and heading | Multi-constellation, far from noise |
| Buzzer | Lost-model alert | Independent power is useful |

See [[lipo]], [[nav-sensors]] and [[system-budget]].

# Sources
- [Oscar Liang: how to choose ExpressLRS receivers](https://oscarliang.com/expresslrs-receivers/)
- [Oscar Liang: AT32 flight controllers and ESCs](https://oscarliang.com/at32-flight-controllers)
- [Oscar Liang: AM32 ESC firmware](https://oscarliang.com/am32-esc-firmware-an-open-source-alternative-to-blheli32/)
- [AM32 firmware on GitHub](https://github.com/am32-firmware/AM32)
- [OpenVTx project](https://github.com/OpenVTx/OpenVTx)
- [Betaflight: VTX guide](https://betaflight.com/docs/development/VTX)
- [PX4: video transmitters](https://docs.px4.io/main/en/vtx/index.html)
- [ReadyMadeRC: RadioMaster TX16S MK3](https://www.readymaderc.com/products/details/86685-radiomaster-tx16s-mk3-elrs-dual-band-gemini-v6-hall-gimbals-black)
- [RadioMaster DBR4 receiver](https://radiomasterrc.com/collections/new-collection/products/dbr4-dual-band-xross-gemini-expresslrs-receiver)
