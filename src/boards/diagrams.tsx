import type { ReactNode } from 'react'
import { Arrow, C } from '../viz/kit'

// Small drawing kit for wiring diagrams on a 520-wide grid.
const Box = ({ x, y, w, h, t, s }: { x: number; y: number; w: number; h: number; t: string; s?: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill="#123f35" stroke={C.dim} strokeWidth={1.5} />
    <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.silk}>{t}</text>
    {s && <text x={x + w / 2} y={y + 35} textAnchor="middle" fontSize={11.5} fill={C.dim}>{s}</text>}
  </g>
)
const W = ({ d, c = C.gold, w = 2.4, dash }: { d: string; c?: string; w?: number; dash?: string }) =>
  <path d={d} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} strokeLinejoin="round" strokeLinecap="round" />
const P = ({ x, y, t, a = 'start', c = C.silk }: { x: number; y: number; t: string; a?: 'start' | 'end' | 'middle'; c?: string }) =>
  <text x={x} y={y - 5} fontSize={11.5} fontWeight={500} textAnchor={a} fill={c}>{t}</text>
const N = ({ x, y, t, a = 'start' }: { x: number; y: number; t: string; a?: 'start' | 'end' | 'middle' }) =>
  <text x={x} y={y} fontSize={12} textAnchor={a} fill={C.dim}>{t}</text>
const Dot = ({ x, y, c = C.gold }: { x: number; y: number; c?: string }) => <circle cx={x} cy={y} r={3.5} fill={c} />
// Vertical resistor, 36 units tall, starting at (x, y).
const R = ({ x, y, t, c = C.tin }: { x: number; y: number; t: string; c?: string }) => (
  <g>
    <path d={`M${x} ${y}v6l-6 3l12 6l-12 6l12 6l-6 3v6`} fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round" />
    <text x={x + 10} y={y + 22} fontSize={11} fill={C.silk}>{t}</text>
  </g>
)
// Vertical capacitor between y and y + 36.
const Cap = ({ x, y, t, left }: { x: number; y: number; t: string; left?: boolean }) => (
  <g stroke={C.tin} strokeWidth={2}>
    <line x1={x} x2={x} y1={y} y2={y + 15} /><line x1={x - 9} x2={x + 9} y1={y + 15} y2={y + 15} />
    <line x1={x - 9} x2={x + 9} y1={y + 21} y2={y + 21} /><line x1={x} x2={x} y1={y + 21} y2={y + 36} />
    <text x={left ? x - 12 : x + 12} y={y + 22} fontSize={11} fill={C.silk} stroke="none" textAnchor={left ? 'end' : 'start'}>{t}</text>
  </g>
)
const Gnd = ({ x, y }: { x: number; y: number }) => (
  <g stroke={C.dim} strokeWidth={2}><line x1={x - 9} x2={x + 9} y1={y} y2={y} /><line x1={x - 5} x2={x + 5} y1={y + 4} y2={y + 4} /><line x1={x - 2} x2={x + 2} y1={y + 8} y2={y + 8} /></g>
)
const Ant = ({ x, y }: { x: number; y: number }) => <W d={`M${x} ${y}v-22M${x - 10} ${y - 30}L${x} ${y - 20}L${x + 10} ${y - 30}`} c={C.tin} w={2} />

function Dia({ h, label, children }: { h: number; label: string; children: ReactNode }) {
  return <svg className="dia" viewBox={`0 0 520 ${h}`} role="img" aria-label={label}>{children}</svg>
}

// Two devices with crossed TX and RX, plus ground and an optional extra line.
function serialPair(left: [string, string?], right: [string, string?], extra?: ReactNode, h = 210) {
  return (
    <>
      <Box x={20} y={40} w={140} h={130} t={left[0]} s={left[1]} />
      <Box x={360} y={40} w={140} h={130} t={right[0]} s={right[1]} />
      <W d="M160 85 H230 L290 115 H360" />
      <W d="M160 115 H230 L290 85 H360" c={C.cyan} />
      <W d="M160 150 H360" c={C.dim} />
      <P x={166} y={85} t="TX" /><P x={166} y={115} t="RX" /><P x={166} y={150} t="GND" />
      <P x={354} y={85} t="TX" a="end" /><P x={354} y={115} t="RX" a="end" /><P x={354} y={150} t="GND" a="end" />
      {extra}
      <N x={260} y={h - 12} t="TX crosses to RX. Grounds are joined." a="middle" />
    </>
  )
}

export const DIAGRAMS: Record<string, ReactNode> = {
  uart: <Dia h={210} label="UART wiring between a microcontroller and a GPS module">{serialPair(['Microcontroller', '3.3 V logic'], ['GPS module', '3.3 V logic'])}</Dia>,

  i2c: (
    <Dia h={270} label="I2C bus with pull-up resistors and two devices">
      <Box x={20} y={45} w={120} h={120} t="MCU" s="3.3 V" />
      <W d="M200 24 H320" c={C.pink} /><N x={196} y={28} t="3V3" a="end" />
      <R x={230} y={24} t="4.7k" /><W d="M230 60 V75" c={C.tin} w={2} />
      <R x={290} y={24} t="4.7k" /><W d="M290 60 V105" c={C.tin} w={2} />
      <W d="M140 75 H500" /><W d="M140 105 H500" c={C.cyan} />
      <Dot x={230} y={75} /><Dot x={290} y={105} c={C.cyan} />
      <P x={146} y={75} t="SDA" /><P x={146} y={105} t="SCL" />
      <Box x={310} y={175} w={90} h={55} t="Barometer" s="Address 0x76" />
      <Box x={410} y={175} w={90} h={55} t="OLED" s="Address 0x3C" />
      <W d="M335 75 V175" /><W d="M365 105 V175" c={C.cyan} /><Dot x={335} y={75} /><Dot x={365} y={105} c={C.cyan} />
      <W d="M435 75 V175" /><W d="M465 105 V175" c={C.cyan} /><Dot x={435} y={75} /><Dot x={465} y={105} c={C.cyan} />
      <W d="M140 150 H240 V250 H455 M355 230 V250 M455 230 V250" c={C.dim} />
      <N x={20} y={210} t="One pull-up per line," /><N x={20} y={226} t="not one per device." />
    </Dia>
  ),

  spi: (
    <Dia h={270} label="SPI bus with shared clock and data lines and one chip select per device">
      <Box x={20} y={30} w={130} h={200} t="MCU" />
      <P x={156} y={60} t="SCK" /><P x={156} y={90} t="MOSI" /><P x={156} y={120} t="MISO" /><P x={156} y={160} t="CS1" /><P x={156} y={200} t="CS2" />
      <Box x={370} y={20} w={130} h={100} t="IMU" /><Box x={370} y={140} w={130} h={100} t="Flash" />
      <W d="M150 60 H240 M240 40 V160 M240 40 H370 M240 160 H370" c={C.cyan} /><Dot x={240} y={60} c={C.cyan} />
      <W d="M150 90 H262 M262 60 V180 M262 60 H370 M262 180 H370" /><Dot x={262} y={90} />
      <W d="M150 120 H284 M284 80 V200 M284 80 H370 M284 200 H370" c={C.silk} /><Dot x={284} y={120} c={C.silk} />
      <W d="M150 160 H320 V100 H370" c={C.copper} />
      <W d="M150 200 H205 V250 H345 V220 H370" c={C.copper} />
      <P x={364} y={40} t="SCK" a="end" /><P x={364} y={60} t="MOSI" a="end" /><P x={364} y={80} t="MISO" a="end" /><P x={364} y={100} t="CS" a="end" />
      <N x={20} y={262} t="SCK, MOSI and MISO are shared. Each device has its own CS, with a 10 kΩ pull-up." />
    </Dia>
  ),

  can: (
    <Dia h={260} label="CAN bus with termination resistors at both ends">
      <W d="M30 60 H490" c={C.cyan} /><W d="M30 96 H490" />
      <P x={150} y={60} t="CANH" /><P x={150} y={96} t="CANL" />
      <R x={40} y={60} t="120 Ω" /><R x={480} y={60} t="" /><text x={440} y={84} fontSize={11} fill={C.silk}>120 Ω</text>
      {[110, 230, 350].map((x, i) => (
        <g key={x}>
          <Box x={x} y={155} w={100} h={60} t={`Node ${i + 1}`} s="MCU + transceiver" />
          <W d={`M${x + 35} 60 V155`} c={C.cyan} /><Dot x={x + 35} y={60} c={C.cyan} />
          <W d={`M${x + 65} 96 V155`} /><Dot x={x + 65} y={96} />
        </g>
      ))}
      <N x={260} y={245} t="Twisted pair. 120 Ω at the two ends only: a meter reads 60 Ω across the bus." a="middle" />
    </Dia>
  ),

  usb: (
    <Dia h={250} label="USB-C device circuit with CC resistors and ESD protection">
      <Box x={20} y={40} w={110} h={150} t="Computer" s="USB host" />
      <rect x={200} y={20} width={300} height={205} rx={8} fill="none" stroke={C.dim} strokeDasharray="5 4" />
      <N x={210} y={38} t="Your board, USB-C" />
      <W d="M130 65 H400" c={C.pink} /><W d="M130 100 H400" /><W d="M130 125 H400" />
      <W d="M130 200 H470" c={C.dim} />
      <P x={136} y={65} t="VBUS" /><P x={136} y={100} t="D+" /><P x={136} y={125} t="D−" /><P x={136} y={200} t="GND" />
      <rect x={325} y={88} width={50} height={50} rx={4} fill="#123f35" stroke={C.cyan} />
      <text x={350} y={117} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.cyan}>ESD</text>
      <Box x={400} y={45} w={90} h={34} t="Regulator" />
      <Box x={400} y={90} w={90} h={45} t="MCU" s="USB pins" />
      <R x={230} y={150} t="5.1k" /><R x={275} y={150} t="5.1k" />
      <N x={222} y={146} t="CC1" a="end" /><N x={300} y={146} t="CC2" />
      <W d="M230 186 V200 M275 186 V200" c={C.dim} />
      <N x={260} y={242} t="D+ and D− run as a 90 Ω pair. 5.1 kΩ on each CC pin turns on the charger's 5 V." a="middle" />
    </Dia>
  ),

  rs485: (
    <Dia h={270} label="RS-485 bus with termination, bias resistors and two transceiver nodes">
      <W d="M30 70 H490" c={C.cyan} /><W d="M30 106 H490" />
      <P x={150} y={70} t="A" /><P x={150} y={106} t="B" />
      <R x={40} y={70} t="120 Ω" /><R x={480} y={70} t="" /><text x={440} y={94} fontSize={11} fill={C.silk}>120 Ω</text>
      <W d="M90 18 H125" c={C.pink} /><N x={86} y={22} t="+V" a="end" />
      <R x={100} y={18} t="680" /><W d="M100 54 V70" c={C.tin} w={2} /><Dot x={100} y={70} c={C.cyan} />
      <R x={125} y={106} t="680" /><Gnd x={125} y={142} />
      <Dot x={125} y={106} />
      {[200, 350].map((x, i) => (
        <g key={x}>
          <Box x={x} y={165} w={120} h={60} t={`Node ${i + 1}`} s="RS-485 transceiver" />
          <W d={`M${x + 40} 70 V165`} c={C.cyan} /><Dot x={x + 40} y={70} c={C.cyan} />
          <W d={`M${x + 80} 106 V165`} /><Dot x={x + 80} y={106} />
        </g>
      ))}
      <N x={260} y={248} t="MCU TX to DI, RO to MCU RX, and a GPIO drives DE and RE together." a="middle" />
      <N x={260} y={264} t="Bias resistors at one point, 120 Ω at both ends." a="middle" />
    </Dia>
  ),

  'pwm-protocol': (
    <Dia h={240} label="Servo wiring with a separate power supply">
      <Box x={20} y={40} w={130} h={120} t="Flight controller" s="or MCU" />
      <Box x={380} y={40} w={120} h={120} t="Servo" />
      <Box x={190} y={175} w={120} h={45} t="5 to 6 V BEC" s="sized for stall current" />
      <W d="M150 75 H380" /><P x={156} y={75} t="Signal" /><P x={388} y={75} t="Signal" />
      <W d="M310 192 H340 V110 H380" c={C.pink} /><P x={388} y={110} t="V+" />
      <W d="M150 145 H380 M250 145 V175" c={C.dim} /><Dot x={250} y={145} c={C.dim} />
      <P x={156} y={145} t="GND" /><P x={388} y={145} t="GND" />
      <Cap x={362} y={110} t="" /><N x={362} y={164} t="470 µF" a="middle" /><Dot x={362} y={110} c={C.pink} /><Dot x={362} y={145} c={C.dim} />
      <N x={20} y={210} t="Never power servos" /><N x={20} y={226} t="from the MCU's 5 V pin." />
    </Dia>
  ),

  'dshot-protocol': (
    <Dia h={230} label="DShot wiring from flight controller motor outputs to a 4-in-1 ESC">
      <Box x={20} y={30} w={130} h={170} t="Flight controller" />
      <Box x={370} y={30} w={130} h={170} t="4-in-1 ESC" />
      {[65, 95, 125, 155].map((y, i) => (
        <g key={y}><W d={`M150 ${y} H370`} /><P x={156} y={y} t={`M${i + 1}`} /><P x={364} y={y} t={`Motor ${i + 1}`} a="end" /></g>
      ))}
      <W d="M150 185 H370" c={C.dim} /><P x={156} y={185} t="GND" />
      <N x={260} y={220} t="Keep signal and ground together and short. The battery connects to the ESC only." a="middle" />
    </Dia>
  ),

  crsf: <Dia h={220} label="ELRS receiver wired to a flight controller UART">{serialPair(['ELRS receiver', 'CRSF output'], ['Flight controller', 'UART'], <>
    <Ant x={90} y={40} />
    <W d="M160 132 H360" c={C.pink} /><P x={166} y={132} t="5V" /><P x={354} y={132} t="5V" a="end" />
  </>, 220)}</Dia>,

  msp: <Dia h={210} label="MSP over a spare UART">{serialPair(['Flight controller', 'Spare UART'], ['Raspberry Pi', 'or OSD device'])}</Dia>,

  mavlink: (
    <Dia h={250} label="MAVLink link from a flight controller to a Raspberry Pi">
      {serialPair(['Flight controller', 'TELEM2 port'], ['Raspberry Pi', 'GPIO14 TX, GPIO15 RX'], <>
        <Box x={360} y={192} w={140} h={32} t="Own 5 V supply" />
        <W d="M430 192 V170" c={C.pink} />
      </>, 250)}
    </Dia>
  ),

  wifi: (
    <Dia h={250} label="ESP32 module power and antenna layout, with a Wi-Fi link to a router">
      <rect x={20} y={20} width={290} height={205} rx={8} fill="none" stroke={C.dim} strokeDasharray="5 4" />
      <rect x={170} y={28} width={120} height={34} fill="none" stroke={C.red} strokeDasharray="3 3" />
      <text x={230} y={50} textAnchor="middle" fontSize={11} fill={C.red}>Keep copper clear</text>
      <Box x={170} y={66} w={120} h={110} t="ESP32 module" s="antenna at top" />
      <Box x={35} y={75} w={90} h={45} t="3.3 V reg" s="500 mA peaks" />
      <W d="M125 97 H170" c={C.pink} /><Cap x={148} y={97} t="" /><Dot x={148} y={97} c={C.pink} />
      <N x={35} y={150} t="EN: 10 kΩ up, 1 µF down" /><N x={35} y={166} t="BOOT button" />
      <N x={35} y={182} t="10 µF + 100 nF close" />
      <Box x={390} y={90} w={110} h={60} t="Router" s="access point" />
      <W d="M295 100 Q342 70 390 105" c={C.cyan} dash="5 5" /><W d="M295 125 Q342 155 390 128" c={C.cyan} dash="5 5" />
      <N x={320} y={180} t="TCP/IP over Wi-Fi" />
    </Dia>
  ),

  ble: (
    <Dia h={220} label="BLE module powered by a coin cell, linked to a phone">
      <rect x={155} y={28} width={120} height={30} fill="none" stroke={C.red} strokeDasharray="3 3" />
      <text x={215} y={47} textAnchor="middle" fontSize={11} fill={C.red}>Antenna keep-out</text>
      <Box x={155} y={62} w={120} h={90} t="BLE module" s="nRF52 class" />
      <Box x={25} y={80} w={90} h={50} t="Coin cell" s="CR2032" />
      <W d="M115 100 H155" c={C.pink} /><Cap x={135} y={100} t="" /><Dot x={135} y={100} c={C.pink} />
      <Box x={390} y={55} w={110} h={110} t="Phone" s="app" />
      <W d="M280 95 Q335 70 390 95" c={C.cyan} dash="5 5" /><W d="M280 120 Q335 145 390 120" c={C.cyan} dash="5 5" />
      <N x={260} y={205} t="Add bulk capacitance: a coin cell can't supply radio bursts alone." a="middle" />
    </Dia>
  ),

  lora: (
    <Dia h={240} label="LoRa module wired to a microcontroller over SPI">
      <Box x={20} y={35} w={120} h={180} t="MCU" />
      <Box x={330} y={35} w={130} h={180} t="LoRa module" s="SX1276 or SX1262" />
      {[['SCK', 70], ['MOSI', 95], ['MISO', 120], ['NSS', 145], ['DIO0', 170], ['RESET', 195]].map(([t, y], i) => (
        <g key={t as string}>
          <W d={`M140 ${y} H330`} c={i < 4 ? C.gold : C.cyan} />
          <P x={146} y={y as number} t={t as string} /><P x={324} y={y as number} t={t as string} a="end" />
        </g>
      ))}
      <W d="M460 75 H490" c={C.tin} w={2} /><Ant x={490} y={75} />
      <N x={260} y={232} t="SPI plus an interrupt and a reset. Never transmit without the antenna." a="middle" />
    </Dia>
  ),

  ethernet: (
    <Dia h={190} label="Ethernet chain from MCU through PHY and magnetics to RJ45">
      <Box x={15} y={60} w={95} h={60} t="MCU" s="MAC" />
      <Box x={150} y={60} w={95} h={60} t="PHY" s="such as LAN8720" />
      <Box x={285} y={60} w={95} h={60} t="Magnetics" s="isolation" />
      <Box x={420} y={60} w={85} h={60} t="RJ45" />
      <Arrow x1={112} y1={90} x2={148} y2={90} /><Arrow x1={247} y1={90} x2={283} y2={90} /><Arrow x1={382} y1={90} x2={418} y2={90} />
      <N x={130} y={55} t="RMII" a="middle" /><N x={265} y={55} t="Pairs" a="middle" /><N x={400} y={55} t="100 Ω" a="middle" />
      <N x={197} y={140} t="50 MHz reference clock" a="middle" />
      <N x={260} y={176} t="Many RJ45 sockets have the magnetics built in." a="middle" />
    </Dia>
  ),

  mqtt: (
    <Dia h={240} label="MQTT devices publishing and subscribing through a broker">
      <Box x={200} y={90} w={120} h={60} t="Broker" s="Mosquitto" />
      <Box x={15} y={30} w={130} h={45} t="ESP32 sensor" /><Box x={15} y={165} w={130} h={45} t="Drone" />
      <Box x={375} y={30} w={130} h={45} t="Dashboard" /><Box x={375} y={165} w={130} h={45} t="Phone" />
      <Arrow x1={145} y1={55} x2={198} y2={100} /><Arrow x1={145} y1={185} x2={198} y2={140} />
      <Arrow x1={322} y1={100} x2={373} y2={55} color={C.cyan} /><Arrow x1={322} y1={140} x2={373} y2={185} color={C.cyan} />
      <N x={15} y={98} t="publish lab/temp" /><N x={15} y={155} t="publish drone/1/battery" />
      <N x={505} y={98} t="subscribe lab/#" a="end" /><N x={505} y={155} t="subscribe drone/+/battery" a="end" />
      <N x={260} y={232} t="Devices only talk to the broker, never to each other." a="middle" />
    </Dia>
  ),

  http: (
    <Dia h={210} label="HTTP requests and a WebSocket between a browser and an ESP32">
      <Box x={20} y={50} w={130} h={110} t="Browser" />
      <Box x={370} y={50} w={130} h={110} t="ESP32" s="web server" />
      <Arrow x1={152} y1={85} x2={368} y2={85} /><N x={260} y={78} t="GET /api/battery" a="middle" />
      <Arrow x1={368} y1={115} x2={152} y2={115} color={C.cyan} /><N x={260} y={108} t="200 OK with JSON" a="middle" />
      <W d="M152 145 H368" c={C.pink} dash="6 4" /><N x={260} y={138} t="WebSocket: either side sends any time" a="middle" />
      <N x={260} y={196} t="HTTP asks and answers. WebSocket stays open." a="middle" />
    </Dia>
  ),

  dds: (
    <Dia h={220} label="ROS 2 nodes on two computers communicating through DDS">
      <Box x={20} y={45} w={150} h={120} t="Raspberry Pi" s="robot nodes" />
      <Box x={350} y={45} w={150} h={120} t="Laptop" s="RViz, teleop" />
      <Arrow x1={172} y1={85} x2={348} y2={85} /><N x={260} y={78} t="/imu (best effort)" a="middle" />
      <Arrow x1={348} y1={115} x2={172} y2={115} color={C.cyan} /><N x={260} y={108} t="/cmd_vel (reliable)" a="middle" />
      <W d="M172 145 H348" c={C.dim} dash="4 4" /><N x={260} y={140} t="automatic discovery" a="middle" />
      <N x={260} y={205} t="Same network, compatible QoS, same ROS domain ID." a="middle" />
    </Dia>
  ),
}
