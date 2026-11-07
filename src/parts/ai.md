# What AI adds to a drone
A flight controller keeps the drone stable. A separate **companion computer** handles vision and decisions, such as recognising objects or avoiding obstacles.

Keep the two separate. If the AI computer crashes, the flight controller must keep flying safely. See [[failsafe]].

The chain looks like this: camera, then AI computer, then a high-level command to the flight controller, then motors.

# AI compute options
TOPS means trillions of operations per second. It is a peak figure, usually at INT8, and it depends on the power mode. Compare real frame rates, not TOPS.

| Option | Vendor-stated AI | Power | Best for |
|---|---|---|---|
| NVIDIA Jetson Orin Nano | Up to 67 TOPS | 7 to 25 W | Vision on larger drones |
| NVIDIA Jetson Orin NX | Up to 157 TOPS | 10 to 40 W | Heavy multi-camera work |
| Raspberry Pi 5 with Hailo-8L | 13 TOPS | Check the kit | Low-cost development |
| Raspberry Pi 5 with Hailo-8 | 26 TOPS | Check the kit | More capable low-cost builds |
| Google Coral Edge TPU | 4 TOPS | Low | Small quantised models |
| RK3588-based boards | Check the datasheet | Check the board | Low-cost Linux with an NPU |

Jetson figures apply to the top power mode, and lower modes deliver less.

# Parts of an AI board
| Component | Job | What to check |
|---|---|---|
| SoC or module | CPU, GPU and NPU | Software support matters most |
| LPDDR memory | Holds models and images | Capacity, bandwidth |
| NVMe or eMMC storage | Operating system and logs | Vibration, temperature |
| PMIC and buck regulators | High-current, low-voltage rails | Sequencing, transient load |
| MIPI CSI connectors | Cameras | Lanes, cable length |
| USB, PCIe, Ethernet | Fast peripherals | Impedance control |
| UART or CAN to the FC | Talks to the flight controller | Protocol, such as MAVLink |
| Heatsink and fan | Keeps the chip cool | Sustained load, not peak |

Theory: [[ai-board]], [[npu]], [[soc-architecture]], [[usb-interface]], [[differential-pairs]].

# Cameras for AI
| Type | Why choose it | Watch out |
|---|---|---|
| Global shutter | No motion distortion | Usually lower resolution |
| Rolling shutter | Cheap, high resolution | Warps under fast motion |
| Stereo pair | Depth from two views | Needs calibration, texture |
| Depth camera | Ready-made depth | Active IR weakens in sunlight |
| Thermal camera | Heat cues | Low resolution, cost |
| Event camera | Very fast motion | Research-grade |

Synchronise cameras in hardware. A few milliseconds of offset ruins stereo depth during fast flight.

# Sensors for autonomy
| Sensor | Gives you | Weakness |
|---|---|---|
| IMU | Fast motion | Drifts on its own |
| GNSS | Global position | Weak indoors, can be blocked |
| Barometer | Altitude | Drifts with weather |
| Optical flow | Ground velocity | Needs texture and light |
| ToF or LiDAR | Direct distance | Narrow view, surface effects |
| Radar | Works in dust or fog | Low detail, RF rules |

No single sensor should be your only collision safeguard. The Choosing sensors tab has recommended sets.

# Power and weight
| Item | Why it matters |
|---|---|
| Regulator | AI boards draw fast current spikes, so size it for peak load |
| Isolation from motor noise | Filter its supply, and keep cables apart |
| Weight | Every gram shortens flight time |
| Thermal path | Airflow stops on the ground |
| Vibration | Use soft mounts and locking connectors |

Example: a 25 W computer through a 90% buck regulator draws about 28 W. On a 111 Wh pack, that costs real flight time. See [[system-budget]].

# Learning path
- Run an object detection model on a Raspberry Pi with a camera.
- Add an accelerator, and measure frame rate and power.
- Connect to a flight controller over UART, using MAVLink.
- Test on a bench with props removed.
- Fly with a pilot ready to take over, in a controlled area.

# Sources
- [NVIDIA Jetson modules](https://developer.nvidia.com/embedded/Jetson-modules)
- [NVIDIA Jetson Orin](https://nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin)
- [Full Stack CV: edge deployment](https://fullstackcv.github.io/playbook/edge/)
- [Think Robotics: Jetson Orin Nano Super review](https://thinkrobotics.com/blogs/product-reviews-buying-guides/nvidia-jetson-orin-nano-super-developer-kit-review-is-it-the-best-edge-ai-board-in-2025)
