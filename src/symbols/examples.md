# How to use these examples
These are real drone products. Most hobby makers publish a product page or manual, not a full datasheet, so these examples teach you to read carefully and ask what's missing.

Figures below were gathered from public listings on 6 November 2026. Specs change with each revision, so **always check the page and manual for your exact board**. Sources are at the bottom.

# BETAFPV F4 1S 12A AIO V3
An all-in-one board for tiny 1–2S whoops: flight controller, ESC and receiver together.

| Spec | Value | How to read it |
|---|---|---|
| MCU | STM32F405RGT6, 168 MHz | Look up ST's own datasheet. The suffix gives the package |
| Gyro | ICM-42688P | A separate chip with its own datasheet |
| ESC | 12 A, 25 A peak | Peak with no time given. Assume seconds at best |
| Input | 1–2S | At most 8.4 V at full charge |
| BEC | 5 V, listed as 2 A and as 3 A | Two sources disagree |

**The lesson: sources conflict.** ArduPilot's page lists a 5 V 2 A BEC, while a retailer lists 5 V 3 A. Neither gives conditions. Design to the lower figure until you can measure it.

Budget check at 2 A: $P = 5\times2 = 10$ W available on the 5 V rail. A camera at 0.5 A, a video transmitter at 1 A and a receiver at 0.1 A use 1.6 A, leaving modest margin.

Watch the name too. BETAFPV boards with similar names use different chips: older F4 1S listings show an STM32F411 MCU, and the newer Matrix 1S line uses an STM32G473. Their firmware targets are different.

# GEPRC TAKER F722 BLS 60A V2 stack
A two-board stack for 3–6S quads: a flight controller on top of a 4-in-1 ESC.

| Spec | Value | How to read it |
|---|---|---|
| MCU | STM32F722 | F7 core. Confirm firmware support |
| Gyro | ICM-42688-P on SPI | SPI is right for fast gyro reads |
| BEC | 9 V at 2.5 A, and 5 V at 3 A | Two separate rails. Good isolation for video |
| ESC | 60 A, 4-in-1 | Per channel. Not 60 A for the whole board |
| Input | Up to 6S | 25.2 V at full charge |
| Mounting | 30.5 × 30.5 mm | Matches a standard frame |

**The lesson: work out what "60 A" means.** It's usually per motor. Four motors would be up to 240 A in theory, but your battery lead, connector and pack limit you first. Also ask how long, and with what airflow. Listings don't say.

Rail power: 9 V × 2.5 A = 22.5 W for video. 5 V × 3 A = 15 W for everything else. Add up your loads, using the [[system-budget|system power method]].

Check the **variant** as well. Listings show the original stack, the V2 and a Bluetooth version. They are different products. The name BLS is also easy to misread, since it may refer to BLHeli_S firmware. Confirm before you flash anything.

# iFlight BLITZ F7 V1.2 with E55 ESC
A stack that shows why a revision number matters.

| Spec | Value | How to read it |
|---|---|---|
| MCU | STM32F722 | |
| Gyro | ICM-42688, BMI270 on earlier boards | **Changed between revisions** |
| Barometer | DPS310 | Altitude sensing |
| OSD | AT7456E | Draws text on analog video |
| Logging | 32 MB | Blackbox for tuning |
| UARTs | 6 | Count them against GPS, RC, VTX and more |
| BEC | 5 V 2.5 A, 9 V 2 A | Compare with your loads |
| ESC input | 2–6S | |
| ESC current | 55 A continuous | Burst listed as 65 A by one seller |
| ESC firmware | BLHeli_32, on a G071 MCU | |
| ESC BEC | None | The flight controller makes the rails |

**The lesson: same name, different parts.** One seller notes that the gyro changed from BMI270 to ICM42688 in January 2024, and the V1.1 board used a BMI270. If you write firmware or copy settings, read the revision printed on the board.

Also notice that sellers advise an extra capacitor on large builds. That is the [[esc-design|voltage spike problem]] showing up in a product note. Retailer burst figures differ, so trust the continuous number.

# iFlight XING-E Pro 2207 motor
A motor spec sheet is a set of numbers you can check with physics.

| Spec | Value | How to read it |
|---|---|---|
| Size | 2207 | 22 mm stator diameter, 7 mm stator height |
| Kv | 1800, 2450 or 2750 | Pick with battery voltage |
| Resistance | 81.5 mΩ | Copper loss, $I^2R$ |
| Idle current | 1.2 A at 12.6 V | With no prop. Conditions are stated, which is good |
| Max current | 35.22 A for under 10 s | A short burst, not continuous |
| Max power | 845 W for 60 s | |
| Weight | 33.8 g with 150 mm wires | Counts in your mass budget |

Retailers suggest 1800 Kv for 6S, and 2450 or 2750 Kv for 4S. Why? Check it: $1800\times22.2 \approx 40\,000$ rpm, and $2450\times14.8 \approx 36\,000$ rpm. Both land in a similar speed range.

Heat at maximum current: $P = 35.22^2\times0.0815 \approx 101$ W in the windings alone. That is why it's only allowed for under 10 seconds.

**The lesson: use the numbers to catch problems.** 845 W at 35.22 A implies 24 V, so that test wasn't at 4S. Watch for this: a number may come from a test unlike your setup. Other XING motors have different figures, so never mix tables between models.

# KiCad: there is no KiCad datasheet
**KiCad is design software, not a component**, so it has no datasheet. What it has is a library system that links each symbol to a part's real datasheet. That link is what matters.

Each KiCad symbol has four required fields:

| Field | Example | Purpose |
|---|---|---|
| Reference | U3 | Its name on this board |
| Value | ICM-42688-P | The part |
| Footprint | A package name | The copper pattern |
| Datasheet | A link | Where the truth lives |

**Fill in the Datasheet field for every part.** Then opening a part in the schematic takes you straight to its document.

KiCad's official libraries follow the KiCad Library Conventions (KLC), the rulebook at klc.kicad.org. They cover how symbols and footprints should be drawn and named. Where its rules conflict with a part's datasheet, the KLC says to follow the datasheet and flag the difference to the library team.

Treat every library symbol as unproven until checked:

- Open the part's datasheet at the pinout page.
- Compare every pin number and name with the KiCad symbol.
- Check the pin types, as ERC depends on them.
- Compare the footprint's pads with the package drawing.
- Print the footprint 1:1, and lay the real part on it.

A wrong pin in a symbol doesn't cause an error. KiCad happily builds the wrong board.

# Your turn
Take any product you own, and fill in this list.

- What is the exact name and revision on the board?
- Is this a datasheet, a manual, or a shop page?
- Which main chips does it have? Find each chip's real datasheet.
- What is the maximum voltage, at full charge?
- Continuous current, or burst? For how long?
- How much can each regulator supply, and what will you connect?
- Which firmware target does it use?
- Which numbers have no test conditions?

# Sources
- [ArduPilot: BETAFPV F405 family](https://ardupilot.org/plane/docs/common-betafpvf405.html)
- [Betaflight: BETAFPV G473 board](https://betaflight.com/docs/wiki/boards/current/BETAFPVG473)
- [OneDrone: BETAFPV AIO F4 1S 12A listing](https://www.onedrone.com/store/aio-f4-1s-12a-elrs-2-4g-v3-by-betafpv.html?tag=2A)
- [FPVUA: BETAFPV F4 1S 12A AIO 2022 listing](https://fpvua.com/en/polotnyi-kontroler-betafpv-f4-1s-12a-aio-2022/)
- [Manuals Plus: GEPRC TAKER F722 BLS 60A V2 manual](https://manuals.plus/ae/1005010682163311)
- [NewBeeDrone: GEPRC TAKER F722 BLS 60A V2](https://newbeedrone.com/a/p/products/geprc-taker-f722-bls-60a-v2-stack)
- [DefianceRC: GEPRC TAKER F722 V2](https://www.defiancerc.com/products/geprc-taker-f722-blheli_s-60a-stack-v2-30x30)
- [iFlight: BLITZ F7 Stack](https://shop.iflight.com/BLITZ-F7-Stack-E55-4-IN-1-ESC-Pro1695)
- [GetFPV: iFlight BLITZ F7 V1.2 and E55](https://www.getfpv.com/iflight-blitz-stack-f7-v1-2-fc-e55-4-in-1-55a-esc.html)
- [RaceDayQuads: iFlight BLITZ F7 V1.2](https://www.racedayquads.com/products/draft-blitz-f7blitz-f7-v1-2-icm42688-e55-4-in-1-flight-tower-system)
- [GetFPV: iFlight XING-E Pro 2207](https://www.getfpv.com/iflight-xing-e-pro-2207-motor-1pc-1800kv-2450kv-2750kv.html)
- [KiCad Library Conventions](https://klc.kicad.org/)
- [KLC rule S6.2](https://klc.kicad.org/symbol/s6/s6.2.html)
- [KiCad forum: required symbol fields](https://forum.kicad.info/t/any-technical-reason-for-obligatory-fields-in-a-symbol/33591)
