# p01-blink: 1. Blink, button and debounce
level: Beginner
boards: arduino-uno, rp2040
stacks: arduino, micropython
protocols: uart
lessons: gpio, led, resistor, ohms-law, switches-relays
parts: LED, 330 Ω resistor, push button, breadboard
> Your first program: light an LED, and read a button reliably.

## Goal
Make an LED blink, then toggle it with a button. Print each press over serial.

## Skills you use
Ohm's law to size the LED resistor, pull-up resistors for the button, and debouncing, because contacts bounce.

## Steps
- Calculate the LED resistor for 5 V and 10 mA, and pick a standard value.
- Blink the LED at 1 Hz.
- Add a button with the internal pull-up enabled.
- Print "pressed" over serial on each press.
- Notice repeated presses from bounce, then fix it in software.
- Measure the LED current with your multimeter.

## Stretch
Use an interrupt for the button, rather than checking it in the loop.

# p02-battery: 2. Battery voltage monitor
level: Beginner
boards: arduino-uno, esp32
stacks: arduino
protocols: uart
lessons: voltage-divider, adc, adc-peripheral, lipo
parts: Resistors, 100 nF capacitor, 2S or 3S LiPo with balance lead, multimeter
> Read pack voltage safely, the same way a flight controller does.

## Goal
Measure a LiPo's voltage with the ADC, and warn when it's low.

## Steps
- Design a divider that brings full charge below the ADC's maximum voltage.
- Add 100 nF at the ADC pin.
- Convert ADC counts back to battery volts in code.
- Compare your reading with a multimeter, and correct the scale factor.
- Light a warning LED below 3.5 V per cell.

## Safety
Double-check the divider before connecting the battery. A wrong resistor can put full pack voltage on the ADC pin.

# p03-pwm-motor: 3. Motor speed with PWM and a MOSFET
level: Beginner
boards: arduino-uno, stm32
stacks: arduino, stm32cube
protocols: pwm-protocol
lessons: pwm, mosfet-switch, inductor, dc-motor, body-diode
parts: Small brushed motor, logic-level N-MOSFET, flyback diode, 10 kΩ gate pull-down, bench supply
> Control a motor's speed, and see why a flyback diode matters.

## Steps
- Drive the MOSFET gate from a PWM pin through a small resistor, with a pull-down.
- Fit the flyback diode across the motor.
- Sweep duty from 0 to 100%, and measure speed or current.
- View the drain on an oscilloscope. Carefully compare with and without the diode, at low voltage.
- Feel the MOSFET temperature at full load.

# p04-imu: 4. IMU attitude display
level: Intermediate
boards: esp32, stm32
stacks: arduino, platformio
protocols: spi, i2c, uart
lessons: imu-sensors, spi, i2c, sampling
parts: IMU breakout such as an ICM-42688-P or BMI088 board, jumper wires
> Read a gyro and accelerometer, and fuse them into a stable angle.

## Steps
- Read the IMU's ID register over SPI or I²C.
- Stream raw gyro and accelerometer data over serial at 200 Hz or faster.
- Calculate tilt from the accelerometer alone, and notice the noise.
- Integrate the gyro alone, and notice the drift.
- Combine them with a complementary filter, and plot the result.

## Stretch
Tap the table and watch vibration appear, then add a low-pass filter.

# p05-stm32-hal: 5. STM32 with CubeMX: timers, interrupts and DMA
level: Intermediate
boards: stm32
stacks: stm32cube, freertos
protocols: uart
lessons: stm32, clock-tree, timers, interrupts-dma, swd-debug, rtos
parts: Nucleo-F401RE or similar
> Learn professional embedded workflow on real STM32 hardware.

## Steps
- Configure a UART, a timer and an LED pin in CubeMX.
- Generate code and print a message.
- Use a timer interrupt to toggle the LED at exactly 1 kHz, and check it on a scope.
- Send UART data with DMA so the CPU stays free.
- Set a breakpoint over SWD, and inspect variables.
- Split the work into two FreeRTOS tasks.

# p06-mqtt: 6. Wireless telemetry with MQTT
level: Intermediate
boards: esp32, raspberry-pi
stacks: esp-idf, arduino, mqtt-broker, python-stack
protocols: wifi, mqtt
lessons: radio-link, uart, current-sensing
parts: ESP32, INA219 or INA226 current sensor module, Raspberry Pi or PC
> Send voltage and current to a live dashboard over Wi-Fi.

## Steps
- Install Mosquitto on a Raspberry Pi or PC.
- Read voltage and current from the sensor over I²C.
- Publish them to `bench/power/voltage` and `bench/power/current` once per second.
- Subscribe with a terminal client, and check the values arrive.
- Build a simple dashboard, for example Node-RED or a small Python script.
- Unplug the ESP32 and add reconnect logic.

# p07-thrust: 7. Motor thrust stand
level: Intermediate
boards: esp32, stm32
stacks: arduino, python-stack
protocols: dshot-protocol, uart
lessons: instrumentation-amp, current-sensing, esc, bldc, efficiency
parts: Load cell and HX711 amplifier, current sensor, ESC, brushless motor and propeller, rigid guarded frame
> Measure thrust, current and efficiency, instead of guessing.

## Steps
- Calibrate the load cell with known weights.
- Log thrust, voltage and current together.
- Command the ESC in small throttle steps.
- Plot grams per watt against throttle.

## Safety
Spinning propellers cause serious injuries. Use a guarded rig, clamp it down, stand clear of the propeller's plane, and arm only when ready.

# p08-pio: 8. Custom protocols with RP2040 PIO
level: Intermediate
boards: rp2040
stacks: pico-sdk, micropython
protocols: dshot-protocol, uart
lessons: timers, counters, logic-analyzer
parts: Raspberry Pi Pico, addressable LED strip, logic analyser
> Generate exact digital waveforms in hardware.

## Steps
- Drive an addressable LED strip with a PIO program.
- Capture it on a logic analyser, and measure the bit timing.
- Write a PIO program for an extra UART.
- Compare CPU load with and without PIO.

# p09-vision: 9. Camera object detection on Raspberry Pi
level: Advanced
boards: raspberry-pi
stacks: linux, python-stack, mqtt-broker
protocols: mqtt, usb
lessons: ai-board, npu, sampling
parts: Raspberry Pi 5, camera module, optional Hailo AI kit, heatsink and fan
> Detect objects in live video, and publish events.

## Steps
- Show live camera frames with OpenCV.
- Run a small pretrained detection model, and measure frames per second.
- Add an accelerator if available, and compare speed and power.
- Publish detections as MQTT messages.
- Measure temperature during a 10-minute run.

# p10-ros2-rover: 10. ROS 2 rover with micro-ROS
level: Advanced
boards: raspberry-pi, esp32
stacks: ros2, linux, esp-idf, docker
protocols: dds, uart, wifi
lessons: control-loop, h-bridge, imu-sensors, rtos
parts: Small two-motor chassis, motor driver, wheel encoders, IMU, Raspberry Pi, ESP32, battery
> Build a robot the way professional robots are built.

## Steps
- Install ROS 2 on the Raspberry Pi.
- Run micro-ROS on the ESP32, and publish wheel encoder ticks.
- Subscribe to velocity commands on the ESP32, and drive the motors.
- Add speed PID control on the ESP32.
- Drive the rover with a ROS 2 teleop node.
- View the data in RViz.

## Stretch
Add a LiDAR and try SLAM mapping.

# p11-companion: 11. Companion computer with MAVLink
level: Advanced
boards: raspberry-pi, jetson, flight-controller-board
stacks: ardupilot, python-stack, linux
protocols: mavlink, uart
lessons: flight-controller, failsafe, nav-sensors
parts: Flight controller running ArduPilot or PX4, Raspberry Pi or Jetson, USB-UART adapter
> Let a Linux computer talk to an autopilot.

## Steps
- Fly a virtual drone in ArduPilot or PX4 SITL on your PC.
- Read heartbeat and attitude over MAVLink with a Python library.
- Send a mode change and a short guided move in simulation.
- Connect a real flight controller over UART, with propellers removed.
- Read live attitude, then test the failsafe when the link drops.

## Safety
Never send commands to a drone with propellers fitted until everything has been proven in simulation and on the bench.

# p12-jetson-avoid: 12. Jetson obstacle detection pipeline
level: Advanced
boards: jetson
stacks: jetpack, python-stack, ros2
protocols: mavlink, usb, ethernet
lessons: ai-board, npu, nav-sensors, failsafe
parts: Jetson Orin Nano, stereo or depth camera, cooling
> Detect obstacles fast enough to matter.

## Steps
- Capture synchronised depth and colour images.
- Run a detection model with TensorRT, and measure end-to-end latency.
- Combine detections with depth to estimate distance.
- Publish the result as a ROS 2 topic.
- Test only on the bench, or in simulation, before any flight.

# p13-own-board: 13. Design your own STM32 board
level: Advanced
boards: stm32
stacks: stm32cube
protocols: usb, spi, uart
lessons: schematic-capture, footprints, decoupling, routing, bringup, power-tree
parts: KiCad, STM32 chip, IMU, regulator, USB-C connector, PCB fab and assembly service
> Turn everything you've learned into a board you designed.

## Steps
- Plan pins in CubeMX before drawing anything.
- Draw the schematic in KiCad, following the reference design.
- Lay out a 4-layer board, with short decoupling paths and a solid ground.
- Run ERC and DRC, then review Gerbers.
- Order a few boards.
- Bring up the board step by step: rails, clock, SWD, then peripherals.
