# How to choose a sensor
The best design is not the one with the most sensors. It is the smallest reliable set that covers how the vehicle operates, with independent cross-checks and safe fallback behaviour.

- Define the physical quantity, and the decision the system must make.
- Set range, accuracy, resolution, update rate and latency.
- Check the environment: vibration, shock, temperature, humidity, dust, sunlight, EMI and water.
- Check electrical fit: supply, peak current, and interface such as I²C, SPI, UART, CAN, ADC, PWM, USB, MIPI or Ethernet.
- Check mechanical fit: size, mass, mounting, connector, lens, cables and heat.
- Review calibration, drift, cross-sensitivity, diagnostics, lifecycle and datasheet quality.
- Prototype, log raw data, compare with a trusted reference, then test failure modes.

# Flight stabilisation
**Recommended:** a high-quality 6-axis IMU (consider two), a barometer, and optionally a magnetometer away from current loops. Add board temperature monitoring.

**Why:** fuse gyro and accelerometer. Use a magnetometer only where the magnetic environment is clean. Provide redundancy and plausibility checks.

**Evaluate:** BMI088-class and ICM-42688-P-class IMUs, DPS310 or BMP390-class barometers, and LIS3MDL or RM3100-class magnetometers.

# Indoor autonomous flight
**Recommended:** stereo or global-shutter camera or a visual-inertial module, downward optical flow with a ToF rangefinder, and an IMU. UWB anchors are optional for test halls.

**Why:** vision gives scene context, optical flow gives ground-relative velocity, and range gives scale and height. No single sensor should be the only collision safeguard.

**Evaluate:** a global-shutter stereo pair, PMW3901-class flow with VL53L1X or TFmini-class range, and UWB tags.

# Outdoor autonomous FPV
**Recommended:** IMU, GNSS, barometer, forward stereo or depth camera. RTK GNSS, radar or LiDAR are optional, depending on mass and power.

**Why:** GNSS gives global position, the IMU bridges fast motion, the barometer supports altitude, and stereo gives local obstacle geometry. RTK helps precision landing, but doesn't replace collision sensing.

# Obstacle avoidance
**Recommended:** synchronised stereo or global-shutter camera with onboard AI compute. Add ToF or LiDAR for an independent near-field range, and radar for poor visibility experiments.

**Why:** AI recognises objects, stereo estimates geometry, and ToF or LiDAR gives an independent check. Radar helps in dust and fog, usually with less detail.

# Propulsion and power health
**Recommended:** pack voltage and current, per-cell voltage, battery temperature, ESC telemetry and motor temperature. Use RPM and vibration tools during development.

**Why:** detects low voltage, overcurrent, weak cells, early signs of thermal runaway, and propulsion imbalance.

**Evaluate:** INA228 or INA238-class power monitors, a cell-monitor or BMS IC, NTCs and ESC telemetry.

# Airframe and propulsion R&D
**Recommended:** load cell or thrust stand, RPM sensor, strain gauges, vibration accelerometer, thermocouples or RTDs, and a torque sensor where relevant.

**Why:** measure thrust, efficiency, arm flex, resonance and motor temperature, rather than relying on how a flight feels. Use guarded fixtures for spinning propellers.

# AI CCTV and ground robotics
**Recommended:** RGB or global-shutter camera, depth or stereo camera, LiDAR for mapping, thermal for heat inspection. Use a microphone only for defined acoustic tasks.

**Why:** select by use case, not by maximum sensor count. Use privacy-by-design and local processing where appropriate.

# Environmental and field robotics
**Recommended:** temperature, humidity, pressure, rain, wind, soil moisture, particulate matter, and gas sensors only for target pollutants.

**Why:** gas sensors need cross-sensitivity review and calibration. Hobby modules are not safety alarms.

# Suggested development phases
| Phase | Build and validate | Evidence to move on |
|---|---|---|
| 1. Reliable flight core | IMU, barometer, GNSS, voltage, current, battery temperature, ESC telemetry | Stable logs, calibrated sensors, safe manual flight, sensor-failure alerts |
| 2. Indoor position hold | Optical flow and range, visual-inertial or stereo, optional UWB | Repeatable hover in defined lighting and floor conditions |
| 3. Obstacle perception | Global-shutter stereo with AI compute, independent ToF, optional radar or LiDAR | Measured detection distance, latency, missed detections, fallback tests |
| 4. Propulsion R&D | Thrust, RPM, current, voltage, strain, vibration and thermal probes | Repeatable efficiency curves, vibration maps, thermal limits |
| 5. Productization | Reduced production sensor set, diagnostics, redundancy, connectors | Environmental tests, fault injection, calibration procedure, safety case |

# Key design warnings
- Don't pick sensors by headline range or resolution alone.
- Autonomous flight needs independent state estimation, sensor-health monitoring, watchdogs, geofencing, and a pilot override. A sensor reading isn't proof that a path is clear.
- Stereo depth depends on calibration, synchronisation, texture, exposure and baseline. Active IR depth can degrade in sunlight.
- GNSS can be jammed or blocked. Barometers drift with weather. Magnetometers suffer near motors and steel. Optical flow needs texture and light.
- LiPo work and propulsion tests are hazardous. Use fire-safe charging, propeller guards, and conservative limits.
- Cheap gas, smoke and flame modules are generally not certified safety devices. Never use them as the only protection for people.
- Validate every sensor on a bench and in its real environment.

# Sources
From your EgireRobotics 300-Sensor Engineering Catalogue. It cites these references:

- [PX4: sensor hardware and setup](https://docs.px4.io/main/en/sensor/)
- [ArduPilot: proximity sensors](https://en.ardupilot.org/copter/docs/common-proximity-landingpage.html)
- [Bosch Sensortec: BMI088](https://www.bosch-sensortec.com/en/products/motion-sensors/imus/bmi088)
- [Bosch Sensortec: sensors for drones](https://www.bosch-sensortec.com/en/applications-solutions/drones)
- [ArduPilot: peripheral hardware](https://software.ardupilot.org/plane/docs/common-optional-hardware.html)
