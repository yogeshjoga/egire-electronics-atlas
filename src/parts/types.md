# How to use this list
Every electronic product is built from the same families of parts. Learn the families, and any new board becomes readable.

The **Must know** column shows what to learn first for drone work. Yes means you will meet it on almost every board.

# Passive components
They need no power to do their job.

| Component | Job | Must know | Lesson |
|---|---|---|---|
| Resistor | Sets current and voltage | Yes | [[resistor]] |
| Resistor network | Several resistors in one package | | [[resistor]] |
| Current-sense shunt | Very low value resistor for measuring current | Yes | [[current-sensing]] |
| Potentiometer or trimmer | Adjustable resistor | | [[potentiometer]] |
| NTC or PTC thermistor | Resistance changes with temperature | Yes | [[temp-coefficient]] |
| Ceramic capacitor (MLCC) | Decoupling and filters | Yes | [[capacitor-types]] |
| Electrolytic capacitor | Bulk energy storage | Yes | [[capacitor-types]] |
| Polymer or tantalum capacitor | Compact, low ESR storage | | [[capacitor-types]] |
| Film capacitor | Stable, high voltage | | [[capacitor-types]] |
| Supercapacitor | Short-term backup energy | | [[capacitor]] |
| Power inductor | Energy storage in converters | Yes | [[inductor]] |
| RF inductor | Tuning and matching | | [[inductor]] |
| Common-mode choke | Blocks noise on a pair of wires | | [[emi]] |
| Ferrite bead | Burns high-frequency noise as heat | Yes | [[ferrite-bead]] |
| Transformer | Isolation and voltage change | | [[transformer]] |

# Discrete semiconductors
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Signal diode | Small one-way path | Yes | [[diode]] |
| Rectifier diode | Converts AC to DC | | [[rectifier]] |
| Schottky diode | Low drop, fast | Yes | [[schottky]] |
| Zener diode | Reference or clamp | | [[zener]] |
| TVS diode | Absorbs voltage spikes | Yes | [[tvs-diode]] |
| LED | Indicator and lighting | Yes | [[led]] |
| Photodiode | Detects light | | [[photodiode]] |
| BJT | Small switches and analog | | [[bjt]] |
| Power MOSFET | Main power switch | Yes | [[mosfet-switch]] |
| Small-signal MOSFET | Level shifting, load switches | Yes | [[level-shifting]] |
| IGBT | High-voltage power | | [[igbt]] |
| GaN or SiC FET | Fast, efficient power | | [[band-theory]] |

# Analog integrated circuits
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Op-amp | Amplifies signals | Yes | [[opamp]] |
| Comparator | Compares two voltages | | [[comparator]] |
| Instrumentation amplifier | Amplifies tiny differences | | [[instrumentation-amp]] |
| Current-sense amplifier | Reads a shunt voltage | Yes | [[current-sensing]] |
| Voltage reference | Accurate fixed voltage | | [[voltage-reference]] |
| ADC | Voltage to number | Yes | [[adc]] |
| DAC | Number to voltage | | [[dac]] |
| Analog switch or multiplexer | Routes analog signals | | [[combinational]] |

# Power integrated circuits
| Component | Job | Must know | Lesson |
|---|---|---|---|
| LDO regulator | Quiet, simple rails | Yes | [[linear-regulator]] |
| Buck regulator | Efficient step-down | Yes | [[buck]] |
| Boost regulator | Step-up | | [[boost]] |
| Buck-boost regulator | Input above or below output | | [[buck-boost]] |
| Load switch | Turns a rail on and off | Yes | [[mosfet-switch]] |
| Gate driver | Drives power MOSFETs | Yes | [[gate-driver]] |
| Battery charger IC | CC and CV charging | | [[charging]] |
| BMS or cell monitor | Watches each cell | Yes | [[bms]] |
| Power monitor IC | Reads voltage, current, power | Yes | [[current-sensing]] |
| PMIC | Many rails in one chip | | [[power-tree]] |

# Digital integrated circuits
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Logic gates | Small logic functions | | [[logic-gates]] |
| Level shifter | Connects different logic voltages | Yes | [[level-shifting]] |
| Microcontroller | Runs firmware | Yes | [[mcu]] |
| Application processor or SoC | Runs Linux and AI | Yes | [[soc-architecture]] |
| FPGA | Reconfigurable logic | | [[fpga]] |
| Flash memory | Firmware, logs | Yes | [[memory]] |
| RAM | Working memory | | [[memory]] |
| EEPROM | Small settings store | | [[memory]] |
| USB to UART bridge | Connects to a computer | Yes | [[uart]] |
| CAN transceiver | Physical CAN layer | | [[can-bus]] |
| Ethernet PHY | Physical network layer | | [[signal-integrity]] |

# Timing
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Quartz crystal | Accurate clock | Yes | [[clock-tree]] |
| Crystal oscillator | Complete clock in a can | | [[oscillator]] |
| MEMS oscillator | Vibration-tolerant clock | | [[oscillator]] |
| Real-time clock | Keeps time of day | | [[timers]] |

# Radio frequency parts
| Component | Job | Must know | Lesson |
|---|---|---|---|
| RF transceiver | Sends and receives data | Yes | [[radio-link]] |
| Power amplifier (PA) | Raises transmit power | Yes | [[radio-link]] |
| Low-noise amplifier (LNA) | Boosts weak received signals | Yes | [[noise]] |
| RF switch | Picks antenna or path | | [[antenna]] |
| Balun | Balanced to unbalanced match | | [[impedance]] |
| SAW or ceramic filter | Blocks out-of-band signals | | [[bode]] |
| Antenna | Launches and catches waves | Yes | [[antenna]] |
| Coax and U.FL connector | Carries RF | Yes | [[transmission-line]] |

# Protection
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Fuse or resettable fuse | Stops overcurrent | Yes | [[fuses-protection]] |
| TVS or ESD diode | Stops spikes and static | Yes | [[tvs-diode]] |
| Ideal diode controller | Low-loss reverse protection | | [[body-diode]] |
| eFuse | Electronic current limiter | | [[fuses-protection]] |
| Varistor (MOV) | Clamps surges | | [[fuses-protection]] |

# Electromechanical and connection
| Component | Job | Must know | Lesson |
|---|---|---|---|
| Battery connector, such as XT30 or XT60 | High-current power | Yes | [[wire-sizing]] |
| JST-style wire-to-board connector | Small signal cables | Yes | [[footprints]] |
| FPC or ribbon connector | Cameras and displays | Yes | [[usb-interface]] |
| USB-C connector | Power and data | Yes | [[usb-interface]] |
| Push button and slide switch | User input | Yes | [[switches-relays]] |
| Relay | Isolated switching | | [[switches-relays]] |
| Brushed motor | Simple rotation | | [[dc-motor]] |
| Brushless motor | Drone propulsion | Yes | [[bldc]] |
| Servo | Position control | | [[pwm]] |
| Buzzer | Audible alerts | Yes | [[pwm]] |
| Fan and heatsink | Cooling | Yes | [[thermal-design]] |

# Sensors
See the **Sensors** tab for the 300-entry catalogue.

# Sources
Lists like this are a teaching summary. Use each part's manufacturer datasheet for design.
