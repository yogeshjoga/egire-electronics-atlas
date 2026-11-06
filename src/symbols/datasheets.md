# Datasheet or product page?
They are different documents, and you must know which one you hold.

| | Component datasheet | Product page |
|---|---|---|
| Example | A MOSFET or a gyro chip | A flight controller or motor |
| Written by | The chip maker's engineers | Marketing or sales |
| Limits | Min, typical and max values | Often one number |
| Test conditions | Stated | Often missing |
| Graphs | Yes | Rarely |
| Trust level | High | Verify it |

Hobby products like flight controllers usually only have a product page or manual, so read them with more suspicion.

# Read in this order
Do not read a datasheet from page 1 to page 100. Jump to what answers your question.

- **Title and features:** what is it? Remember that this page is written to sell the part.
- **Absolute maximum ratings:** the lines you must never cross.
- **Recommended operating conditions:** where it is designed to live.
- **Electrical characteristics:** real performance, with test conditions.
- **Graphs:** how those numbers change with temperature and load.
- **Pin descriptions:** what every pin does, including unused ones.
- **Application circuit:** a working example. Copy this first.
- **Layout guidance:** where parts must go.
- **Package drawing:** the size of your footprint.
- **Ordering information:** suffix letters change the package or temperature range.

Also check the revision history, and search for an **errata** sheet, which lists known bugs.

# The three limits people mix up
| Section | Meaning | How to use it |
|---|---|---|
| Absolute maximum | Beyond this it may be destroyed | Never design here, even briefly |
| Recommended | It's guaranteed to work here | Design inside this range |
| Electrical characteristics | Performance under stated conditions | Use for your calculations |

Operating right at the absolute maximum isn't "using it to the full". The part isn't promised to work there at all.

# Min, typ and max
**Design with min or max, not typical.** Typical is what a good sample shows on a good day. Min and max are what the manufacturer guarantees.

If a regulator's output is 3.20 V min, 3.30 V typ and 3.40 V max, then your circuit must work at both 3.20 V and 3.40 V.

# Test conditions change everything
A number means nothing without its conditions. An $R_{DS(on)}$ of 3 mΩ at $V_{GS}$ = 10 V tells you nothing about a gate driven at 3.3 V.

Check these for every value you use:

- Temperature, often 25 °C. Your part won't be at 25 °C.
- Supply voltage.
- Load current.
- Pulse or continuous? "Pulse" ratings are measured quickly, so that the part doesn't heat up.

# Marketing numbers to distrust
| Claim | Why to be careful |
|---|---|
| MOSFET "120 A" | Often limited by silicon at a case temperature of 25 °C. The package or your board won't get there. |
| Regulator "3 A" | Only if the heat can leave. Check the thermal section. |
| Capacitor "10 µF" | Can fall well below that at your DC voltage. Check the bias curve. |
| ESC "60 A" | Usually per motor, for how long and with what cooling? |
| LiPo "100C" | Rarely reached. Internal resistance is more honest. |
| Gyro "low noise" | Look for the noise density figure and its units. |

# What to look for, by part
| Part | Key values |
|---|---|
| Resistor | Value, tolerance, power, temperature coefficient |
| Ceramic capacitor | Capacitance at DC bias, voltage, dielectric |
| Electrolytic capacitor | Ripple current, ESR, lifetime at temperature |
| Inductor | $I_{sat}$, $I_{rms}$, DCR |
| Diode | $V_F$ at your current, reverse voltage, leakage |
| MOSFET | $V_{DS}$, $R_{DS(on)}$ at your $V_{GS}$, $Q_g$, $V_{GS}$ limit, thermal resistance |
| LDO | Dropout, noise, PSRR, required capacitors |
| Buck regulator | Input range, switching frequency, current limit, layout |
| Op-amp | Supply, input range, GBW, slew rate, offset |
| IMU | Interface, range, noise density, supply |
| MCU | Pin functions, clocks, per-pin current, errata |

# A method for any datasheet
Before opening it, write down your question, such as "Will this survive 6S?" Then:

- Find the matching limit.
- Note the test conditions.
- Compare with your worst case, not your normal case.
- Add margin: around 20 to 50% on voltage.
- Save the datasheet revision with your design.

Now try this on the practice part below.
