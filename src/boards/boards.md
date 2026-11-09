# arduino-uno: Arduino Uno
group: Microcontroller boards
level: Start here
lessons: gpio, adc, pwm, uart, logic-levels
stacks: arduino, platformio
protocols: uart, i2c, spi, pwm-protocol
> The classic first board. Simple, forgiving, and backed by huge amounts of examples.

## What it is
The Uno R3 uses an ATmega328P, an 8-bit microcontroller at 16 MHz, with 32 KB of flash and 2 KB of RAM. It runs at **5 V logic**. The newer Uno R4 uses a 32-bit Renesas RA4M1, an Arm Cortex-M4 at 48 MHz, and keeps the same board shape.

## Why use it
You plug it in, open the Arduino IDE, and an LED blinks in two minutes. Almost every sensor module has an Arduino example. That makes it the fastest way to learn [[gpio|GPIO]], [[adc|ADC]] and [[pwm|PWM]] on real hardware.

## When not to use it
It is slow, has very little RAM, and has no wireless. It can't run a flight controller or any AI. 5 V logic can also damage 3.3 V sensors, so you need [[level-shifting|level shifting]].

## Key facts
| Item | Uno R3 |
|---|---|
| Chip | ATmega328P, 8-bit |
| Clock | 16 MHz |
| Flash and RAM | 32 KB and 2 KB |
| Logic level | 5 V |
| Analog inputs | 6, 10-bit |
| Programming | USB, Arduino IDE |

## Check
Q: What's the main risk connecting an Uno R3 to a 3.3 V sensor?
+ Its 5 V outputs can damage the sensor
- It's too fast for the sensor
- It has no ground pin
W: Check logic levels, and use a level shifter where needed.

# esp32: ESP32 family
group: Microcontroller boards
level: Start here
lessons: mcu, uart, radio-link, antenna, power-tree
stacks: esp-idf, arduino, platformio, micropython, freertos
protocols: wifi, ble, mqtt, http, uart, i2c, spi
> A cheap microcontroller with built-in Wi-Fi and Bluetooth. Ideal for connected projects.

## What it is
Espressif's ESP32 chips combine a fast microcontroller with radio. The original ESP32 has two Xtensa cores up to 240 MHz, Wi-Fi and Bluetooth. Variants matter:

| Variant | Notable |
|---|---|
| ESP32 | Dual core, Wi-Fi and Bluetooth Classic and LE |
| ESP32-S3 | Dual core, vector instructions for small AI, USB |
| ESP32-C3 | Single RISC-V core, low cost |
| ESP32-C6 | Adds Wi-Fi 6 and 802.15.4 |

All use **3.3 V logic**.

## Why use it
It puts a sensor online in an afternoon. It's the natural choice for telemetry, MQTT dashboards, smart sensors and remote control. ExpressLRS receivers also run on ESP chips.

## When not to use it
Wi-Fi draws current peaks of a few hundred milliamps, so it needs a solid supply and good decoupling. It's weaker than an STM32 at precise, low-jitter motor control.

## Check
Q: What does an ESP32 add that an Arduino Uno lacks?
+ Built-in Wi-Fi and Bluetooth
- 5 V logic
- A Linux operating system
W: That radio is why ESP32 is the go-to for IoT.

# rp2040: Raspberry Pi Pico (RP2040 and RP2350)
group: Microcontroller boards
level: Start here
lessons: mcu, timers, counters, pwm
stacks: pico-sdk, micropython, arduino
protocols: uart, i2c, spi, pwm-protocol
> A low-cost microcontroller board with unique PIO blocks for custom digital protocols.

## What it is
The Pico uses Raspberry Pi's RP2040: two Arm Cortex-M0+ cores at up to 133 MHz, 264 KB RAM and **PIO**, small state machines that generate or read almost any digital signal. The Pico 2 uses the faster RP2350.

## Why use it
PIO lets you create protocols in hardware, such as LED strips, extra UARTs or DShot, without loading the CPU. It also runs MicroPython very well, which is great for learning.

## When not to use it
No built-in radio on the basic Pico (the Pico W adds Wi-Fi). Fewer analog inputs and less mature motor-control tooling than STM32.

## Check
Q: What makes the RP2040 unusual?
+ PIO blocks that generate custom digital signals
- A built-in GPU
- 5 V logic
W: PIO is a small programmable I/O engine.

# stm32: STM32 Nucleo and Blue Pill
group: Microcontroller boards
level: Core skill
lessons: stm32, clock-tree, timers, interrupts-dma, swd-debug, reset-boot
stacks: stm32cube, platformio, freertos, zephyr
protocols: uart, i2c, spi, can, usb, pwm-protocol
> Professional Arm microcontrollers. The family inside most flight controllers.

## What it is
ST's STM32 range runs from tiny Cortex-M0 parts to fast Cortex-M7 chips. **Nucleo** boards are official development boards with a built-in ST-Link debugger, so you can step through your code. The cheap "Blue Pill" uses an STM32F103, but many sold are clones with unreliable chips.

## Why use it
It's what real products and flight controllers use. You learn clocks, timers, DMA and interrupts at register level. The skills move directly to designing your own board.

## When not to use it
The learning curve is steeper than Arduino. No built-in Wi-Fi.

## Which one to start with
A Nucleo-F401RE or Nucleo-F411RE is a good first step: Cortex-M4 with a floating-point unit, an onboard debugger, and Arduino-style headers. Move to an F7 or H7 later for flight-controller-class work.

## Check
Q: Why prefer a Nucleo over a cheap Blue Pill?
+ It has an official chip and a built-in debugger
- It's smaller
- It has Wi-Fi
W: Many Blue Pills carry clone chips, and debugging is the real skill.

# teensy: Teensy 4.x
group: Microcontroller boards
level: Core skill
lessons: mcu, sampling, dac
stacks: arduino, platformio
protocols: uart, i2c, spi, can, usb
> A very fast microcontroller with Arduino compatibility.

## What it is
Teensy 4.0 and 4.1 use an NXP i.MX RT1062, an Arm Cortex-M7 at 600 MHz, programmed through the Arduino environment.

## Why use it
When an Arduino is too slow but you want its simplicity: audio, fast data logging, many serial ports, CAN.

## When not to use it
It has no wireless, and costs more than an ESP32 or Pico.

# nrf52: Nordic nRF52 boards
group: Microcontroller boards
level: Core skill
lessons: radio-link, mcu
stacks: zephyr, arduino
protocols: ble, uart, i2c, spi
> Low-power Bluetooth microcontrollers for wearables and battery sensors.

## What it is
Nordic's nRF52 chips, such as the nRF52840, combine an Arm Cortex-M4 with a Bluetooth LE radio designed for very low power. Nordic's current SDK is built on Zephyr.

## Why use it
Battery-powered sensors that run for months, phone-connected gadgets, and BLE remote controls.

## When not to use it
No Wi-Fi. For heavy compute, choose something else.

# raspberry-pi: Raspberry Pi 4 and 5
group: Linux computers
level: Core skill
lessons: soc-architecture, usb-interface, power-tree, thermal-design
stacks: linux, python-stack, ros2, mqtt-broker, docker
protocols: ethernet, wifi, mqtt, http, uart, i2c, spi, usb
> A full Linux computer the size of a credit card.

## What it is
The Raspberry Pi 5 has a quad-core Arm Cortex-A76 at 2.4 GHz, up to 16 GB RAM, USB 3, Ethernet, Wi-Fi, two camera connectors and a PCIe connector for an NVMe drive or AI accelerator. It runs Raspberry Pi OS, a Linux.

## Why use it
It runs Python, OpenCV, databases, web servers and ROS 2. It's the natural hub for a robot: it thinks, while a microcontroller handles the real-time work. With a Hailo AI kit it can also run vision models.

## When not to use it
Linux isn't real-time, so it shouldn't drive motors directly or close a flight-control loop. It needs a good 5 V supply, boots in seconds, and can corrupt its SD card if the power is cut.

## Microcontroller or Linux computer?
| Need | Choose |
|---|---|
| Microsecond timing, low power, instant start | Microcontroller |
| Cameras, AI, networking, files, many libraries | Linux computer |
| Both | Use both, linked by UART, USB or CAN |

## Check
Q: Why shouldn't a Raspberry Pi run a drone's rate loop directly?
+ Linux doesn't guarantee timing
- It has too little memory
- It can't do maths
W: A late update can crash a drone. Let a microcontroller handle it.

# jetson: NVIDIA Jetson (Nano and Orin)
group: Linux computers
level: Advanced
lessons: ai-board, npu, thermal-design, power-tree
stacks: jetpack, linux, python-stack, ros2, docker
protocols: ethernet, usb, uart, i2c, mavlink
> Linux computers with NVIDIA GPUs for running AI at the edge.

## What it is
The original **Jetson Nano** (2019) has a 128-core Maxwell GPU. It's an older board, limited to older JetPack software. The current **Jetson Orin Nano** is far more capable, rated by NVIDIA at up to 67 TOPS. The **Orin NX** goes further. They all run JetPack, NVIDIA's Linux with CUDA and TensorRT.

## Why use it
For real-time object detection, depth processing and running several camera streams on a robot or drone. It uses the same CUDA tools as desktop AI.

## When not to use it
It's heavy and power-hungry for small drones, from about 7 W to 25 W or more, and needs real cooling. For simple vision, a Raspberry Pi with an accelerator may be enough.

## Check
Q: What should you compare when picking AI boards?
+ Real frame rate on your model, at your power limit
- Only the TOPS number
- The board's colour
W: TOPS is a peak figure. Your model, power mode and software decide real speed.

# flight-controller-board: Flight controller as a dev board
group: Drone hardware
level: Core skill
lessons: flight-controller, imu-sensors, dshot, control-loop
stacks: betaflight, ardupilot, platformio
protocols: crsf, msp, mavlink, dshot-protocol, uart
> A commercial flight controller is an STM32 board with an IMU already fitted.

## What it is
Betaflight, INAV, ArduPilot and PX4 all run on STM32-based boards. You can flash your own firmware on one too, using its USB port and DFU bootloader.

## Why use it
It's a ready-made, well-tested IMU board for experiments, and studying its schematic teaches you board design.

## When not to use it
Never test your own firmware with propellers fitted. Begin with a bench setup and simulation.

## Check
Q: What's the safest way to test custom flight firmware?
+ On the bench with propellers removed, after simulation
- In a park
- Indoors with props fitted
W: Firmware bugs can spin motors at full power.
