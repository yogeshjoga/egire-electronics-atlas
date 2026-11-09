# arduino: Arduino framework and IDE
group: Microcontroller frameworks
lessons: gpio, mcu
> The simplest way to write microcontroller code, with thousands of libraries.

## What it is
A set of easy functions, such as `digitalWrite`, `analogRead` and `Serial.print`, on top of each chip's real hardware code. The Arduino IDE edits, builds and uploads in one window. The same framework runs on Uno, ESP32, Pico, Teensy and some STM32 boards.

## How it works
Your sketch has two functions: `setup()` runs once at start-up, and `loop()` runs forever. Behind the scenes, a "core" for each chip turns simple calls into register operations.

```
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

## When to use it
Learning, quick prototypes, and testing a sensor in minutes.

## When to move on
`delay()` stops everything else, and the simple functions hide timing details. For serious products, use the chip vendor's SDK or an RTOS, as you'll need full control of timers, DMA and interrupts.

# platformio: PlatformIO
group: IDEs and tools
lessons: mcu
> A VS Code extension that builds for hundreds of boards and frameworks.

## What it is
A build system and library manager for embedded code. It supports Arduino, ESP-IDF, STM32Cube, Zephyr and more, and Betaflight-style projects use similar tooling.

## Why use it
One editor for every board, with proper code completion, version control and repeatable builds from a `platformio.ini` file. It's a big step up from the Arduino IDE once projects grow.

## When to use it
When you have more than one file, use Git, or switch between boards.

# stm32cube: STM32CubeMX, CubeIDE and HAL
group: Vendor SDKs
lessons: stm32, clock-tree, timers, interrupts-dma, swd-debug
> ST's official tools: graphical configuration, code generation and a debugging IDE.

## What it is
- **STM32CubeMX:** a graphical tool where you set pins, clocks and peripherals. It checks conflicts and generates start-up code.
- **STM32CubeIDE:** an Eclipse-based IDE that includes CubeMX, a compiler and a debugger for the ST-Link.
- **HAL and LL libraries:** HAL gives easy, portable functions. LL (low-layer) is closer to the registers, and faster.

## How it works
1. In CubeMX, choose your chip, assign pins (UART, SPI, timers) and set the clock tree.
2. Generate code. It sets everything up for you.
3. Write your own code between the `USER CODE BEGIN` and `USER CODE END` markers, so it survives regeneration.
4. Build, flash and debug with breakpoints over SWD.

```
HAL_UART_Transmit(&huart2, (uint8_t*)"hello\r\n", 7, 100);
HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
```

## When to use it
Any STM32 project you'd want to take further: flight controllers, motor controllers, your own boards. It's also how you plan pin assignments before drawing a schematic.

## Watch out
Code written outside the USER CODE markers is deleted when you regenerate.

# esp-idf: ESP-IDF
group: Vendor SDKs
lessons: mcu, rtos, radio-link
> Espressif's official framework for ESP32, built on FreeRTOS.

## What it is
The full SDK for ESP32 chips. It includes FreeRTOS, Wi-Fi, Bluetooth, MQTT, HTTP, over-the-air updates and power management. You configure it with `menuconfig` and build with `idf.py`.

## When to use it
For reliable ESP32 products: proper tasks, low power, secure updates, and full control of the radio. Arduino on ESP32 is actually built on top of ESP-IDF.

# pico-sdk: Raspberry Pi Pico SDK
group: Vendor SDKs
lessons: mcu, timers
> The official C and C++ SDK for RP2040 and RP2350.

## What it is
C libraries for every peripheral, including PIO programs, built with CMake. Use it when MicroPython is too slow or you need exact timing.

# micropython: MicroPython and CircuitPython
group: Microcontroller frameworks
lessons: mcu
> Python running directly on a microcontroller.

## What it is
A small Python interpreter for chips like the RP2040 and ESP32. You type commands into a live prompt, and changes run instantly, with no compile step.

```
from machine import Pin
import time
led = Pin(25, Pin.OUT)
while True:
    led.toggle()
    time.sleep(0.5)
```

## When to use it
Learning, quick sensor tests and teaching. It's slower and less precise in timing than C, so don't use it for motor control or flight loops.

# freertos: FreeRTOS
group: Real-time operating systems
lessons: rtos, interrupts-dma
> A small real-time OS that lets one microcontroller run several tasks.

## What it is
A scheduler, plus queues, semaphores and timers. Each job becomes a task with a priority. The highest-priority task that's ready always runs.

## How it works
A timer interrupt ticks, typically 1000 times per second. At each tick, or when a task waits, the scheduler switches to the most important ready task. Tasks pass data through queues, not shared variables.

## When to use it
When you have several jobs with different timing: read a sensor at 1 kHz, send telemetry at 10 Hz, and update a display. It's built into ESP-IDF and available in STM32Cube.

## Watch out
Shared data needs protection, and too little stack space for a task causes crashes that look random.

# zephyr: Zephyr RTOS
group: Real-time operating systems
lessons: rtos, mcu
> A larger, Linux-style RTOS that supports hundreds of boards.

## What it is
An open-source RTOS from the Linux Foundation, with drivers, networking, Bluetooth and a device-tree hardware description. Nordic's nRF Connect SDK is built on it.

## When to use it
Products that need networking, Bluetooth and portability across chips. It's heavier to learn than FreeRTOS.

# linux: Embedded Linux
group: Linux and AI
lessons: soc-architecture, memory
> A full operating system for boards with an application processor.

## What it is
Raspberry Pi OS, Ubuntu and similar systems provide files, networking, users, drivers and thousands of packages. Hardware is reached through drivers: `/dev/ttyAMA0` for UART, `/dev/i2c-1` for I²C, `/dev/spidev0.0` for SPI.

## When to use it
Cameras, AI, databases, web servers and ROS 2. Not for hard real-time control, as timing can jitter by milliseconds.

# python-stack: Python, OpenCV and AI libraries
group: Linux and AI
lessons: ai-board, npu
> The everyday tools for vision and AI on Linux boards.

## What it is
- **Python:** the glue language for robotics and AI.
- **OpenCV:** image processing and classic computer vision.
- **PyTorch and TensorFlow:** train neural networks, usually on a PC.
- **ONNX:** a common format to move a trained model to another runtime.
- **pyserial and paho-mqtt:** talk UART and MQTT from Python.

## How it fits
Train on a PC with a GPU, export to ONNX, then optimise and run it on the target, such as with TensorRT on Jetson or the Hailo tools on a Raspberry Pi.

# jetpack: NVIDIA JetPack, CUDA and TensorRT
group: Linux and AI
lessons: ai-board, npu
> NVIDIA's software for Jetson boards.

## What it is
JetPack bundles Ubuntu-based Linux with CUDA (GPU programming), cuDNN, TensorRT (fast inference), and multimedia and camera APIs. DeepStream builds video analytics pipelines.

## When to use it
Any AI work on a Jetson. TensorRT can make models run several times faster than running them unoptimised.

## Watch out
The JetPack version is tied to the board. The original Jetson Nano is stuck on an older JetPack, which limits newer libraries.

# docker: Docker containers
group: Linux and AI
lessons: soc-architecture
> Packages software with its dependencies, so it runs the same everywhere.

## Why use it
Robotics and AI stacks depend on exact library versions. A container keeps a working ROS 2 or AI setup reproducible, and easy to move between PC and robot.

# ros2: ROS 2
group: Robotics middleware
lessons: soc-architecture, rtos
protocols: dds, uart
> The standard framework for building robot software from connected parts.

## What it is
ROS 2 (Robot Operating System 2) isn't an operating system. It's a framework that runs on Linux. Your robot software becomes many small programs called **nodes**, which communicate through:

- **Topics:** streams of messages, such as camera images or IMU data. Publish and subscribe.
- **Services:** a request and a reply.
- **Actions:** long tasks with feedback, such as "drive to this point".
- **Parameters:** settings for each node.

Communication uses DDS, so nodes find each other automatically on a network.

## Why use it
You reuse proven packages for mapping (SLAM), navigation (Nav2), visualisation (RViz) and simulation (Gazebo). You write only the parts that make your robot special.

## Versions
Use a long-term-support release, such as **Humble** on Ubuntu 22.04 or **Jazzy** on Ubuntu 24.04. ROS 1 is end of life, so start new work with ROS 2.

## micro-ROS
micro-ROS brings ROS 2 to microcontrollers like ESP32 and STM32, so a motor controller can appear as a ROS 2 node over serial or Wi-Fi.

## Check
Q: What is a ROS 2 topic?
+ A named stream of messages that nodes publish and subscribe to
- A file on disk
- A type of microcontroller
W: Topics carry data like sensor readings between nodes.

# ros1: ROS 1 (Noetic)
group: Robotics middleware
lessons: soc-architecture
> The original Robot Operating System. Learn it only to read older projects.

## What it is
ROS 1 used a central master process, unlike ROS 2's DDS discovery. Its final release, Noetic, has reached end of life. Many older tutorials and robots still use it, so it helps to recognise it.

# betaflight: Betaflight and INAV
group: Flight stacks
lessons: flight-controller, control-loop, dshot
protocols: crsf, msp, dshot-protocol
> Flight-controller firmware for FPV racing and freestyle (Betaflight) and navigation (INAV).

## What it is
Firmware for STM32 and AT32 flight controllers, focused on fast, tight control. You configure it from a desktop app. INAV adds GPS navigation features.

## When to use it
FPV flying, tuning and blackbox analysis. Not designed for complex autonomy.

# ardupilot: ArduPilot and PX4
group: Flight stacks
lessons: flight-controller, nav-sensors, failsafe
protocols: mavlink, uart, can
> Autopilot firmware for autonomous drones, planes, rovers and boats.

## What it is
Full autopilots with GPS missions, failsafes, many sensors, logging, and a companion computer interface. Both talk **MAVLink** and have **SITL**, software-in-the-loop simulation, so you can fly a virtual drone on a PC.

## When to use it
Autonomous flight, mapping, and connecting an AI computer. PX4 integrates closely with ROS 2.

## Check
Q: What should you do before flying new autonomy code?
+ Test it in SITL simulation
- Fly it straight away
- Skip logging
W: Simulation finds logic errors without risking hardware.

# mqtt-broker: Mosquitto MQTT broker
group: Linux and AI
lessons: radio-link
protocols: mqtt
> A small server that passes MQTT messages between devices.

## What it is
Eclipse Mosquitto runs on a PC or Raspberry Pi. Devices publish to it and subscribe through it, so they never need to know each other's addresses.

## When to use it
Telemetry dashboards, smart sensors and home or lab automation.
