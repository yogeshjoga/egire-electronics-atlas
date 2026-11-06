// Pure calculations behind the simulators. Tested in physics.test.ts.

export const E_CHARGE = 1.602176634e-19
export const K_COULOMB = 8.988e9
export const N_COPPER = 8.5e28
export const VT = 0.02585

export const ELEMENTS = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr']
export const ELEMENT_NAMES = ['Hydrogen','Helium','Lithium','Beryllium','Boron','Carbon','Nitrogen','Oxygen','Fluorine','Neon','Sodium','Magnesium','Aluminium','Silicon','Phosphorus','Sulfur','Chlorine','Argon','Potassium','Calcium','Scandium','Titanium','Vanadium','Chromium','Manganese','Iron','Cobalt','Nickel','Copper','Zinc','Gallium','Germanium','Arsenic','Selenium','Bromine','Krypton']

const ORDER: [number, string, number][] = [[1,'s',2],[2,'s',2],[2,'p',6],[3,'s',2],[3,'p',6],[4,'s',2],[3,'d',10],[4,'p',6]]

/** Ground-state subshell filling, including the Cr and Cu exceptions. */
export function electronConfig(z: number): { n: number; l: string; e: number }[] {
  let left = z
  const out: { n: number; l: string; e: number }[] = []
  for (const [n, l, cap] of ORDER) {
    if (left <= 0) break
    const e = Math.min(cap, left)
    out.push({ n, l, e })
    left -= e
  }
  if (z === 24 || z === 29) {
    const s = out.find((o) => o.n === 4 && o.l === 's')!
    const d = out.find((o) => o.n === 3 && o.l === 'd')!
    s.e -= 1
    d.e += 1
  }
  return out
}

export function shells(z: number): number[] {
  const s = [0, 0, 0, 0]
  for (const o of electronConfig(z)) s[o.n - 1] += o.e
  return s.filter((x) => x > 0)
}

export const coulombForce = (q1: number, q2: number, r: number) => (K_COULOMB * Math.abs(q1 * q2)) / (r * r)
export const driftVelocity = (i: number, area: number, n = N_COPPER) => i / (n * area * E_CHARGE)
export const wireResistance = (rho: number, l: number, a: number) => (rho * l) / a
export const parallel = (...r: number[]) => 1 / r.reduce((s, x) => s + 1 / x, 0)
export const series = (...r: number[]) => r.reduce((s, x) => s + x, 0)
export const divider = (vin: number, r1: number, r2: number) => (vin * r2) / (r1 + r2)
export const rcCharge = (vs: number, t: number, tau: number) => vs * (1 - Math.exp(-t / tau))

/** Two sources feeding a shared node through R1 and R3, with R2 to ground. */
export function twoSourceNode(v1: number, v2: number, r1: number, r2: number, r3: number) {
  const va = (v1 / r1 + v2 / r3) / (1 / r1 + 1 / r2 + 1 / r3)
  return { va, i1: (v1 - va) / r1, i2: va / r2, i3: (v2 - va) / r3 }
}

export const seriesRlcZ = (r: number, l: number, c: number, f: number) => {
  const x = 2 * Math.PI * f * l - 1 / (2 * Math.PI * f * c)
  return { mag: Math.hypot(r, x), phase: (Math.atan2(x, r) * 180) / Math.PI, x }
}
export const resonance = (l: number, c: number) => 1 / (2 * Math.PI * Math.sqrt(l * c))
export const lowpassMag = (f: number, fc: number) => 1 / Math.sqrt(1 + (f / fc) ** 2)

export const shockley = (v: number, is = 1e-12, n = 1) => is * (Math.exp(v / (n * VT)) - 1)

export function mosfetId(vgs: number, vds: number, vth: number, k: number) {
  const ov = vgs - vth
  if (ov <= 0) return 0
  return vds < ov ? k * (ov * vds - (vds * vds) / 2) : 0.5 * k * ov * ov
}

/** IPC-2221 trace width in mm, outer or inner layer. */
export function traceWidthMm(i: number, riseC: number, oz: number, outer = true) {
  const k = outer ? 0.048 : 0.024
  const areaMil2 = (i / (k * riseC ** 0.44)) ** (1 / 0.725)
  return ((areaMil2 / (1.378 * oz)) * 25.4) / 1000
}

export const flightMinutes = (wh: number, watts: number, usable = 0.8) => ((wh * usable) / watts) * 60
export const aliasOf = (f: number, fs: number) => Math.abs(f - Math.round(f / fs) * fs)
export const adcLsb = (vref: number, bits: number) => vref / 2 ** bits
export const buckRipple = (vin: number, vout: number, l: number, f: number) => ((vin - vout) * (vout / vin)) / (l * f)
export const depletionNm = (vbi: number, v: number) => 300 * Math.sqrt(Math.max(vbi - v, 0.01) / vbi)

/** Engineering notation: 0.0047 -> 4.7 m */
export function si(v: number, unit = '', digits = 3): string {
  if (!isFinite(v)) return '∞ ' + unit
  if (v === 0) return '0 ' + unit
  const units: [number, string][] = [[1e9,'G'],[1e6,'M'],[1e3,'k'],[1,''],[1e-3,'m'],[1e-6,'µ'],[1e-9,'n'],[1e-12,'p'],[1e-15,'f']]
  const a = Math.abs(v)
  const [m, p] = units.find(([x]) => a >= x * 0.9995) ?? units[units.length - 1]
  return `${Number((v / m).toPrecision(digits))} ${p}${unit}`
}

/** Drone-axis model: J·θ'' = u − b·θ', driven by PID with a loop delay. Returns [t, θ] pairs. */
export function pidStep(kp: number, ki: number, kd: number, delayMs = 0, seconds = 3, gust = 0) {
  const dt = 0.001, J = 1, b = 0.5, limit = 60
  const lag = Math.round(delayMs)
  const hist: number[] = new Array(lag + 1).fill(0)
  let th = 0, w = 0, integ = 0, prev = 0
  const pts: [number, number][] = []
  for (let i = 0; i < seconds / dt; i++) {
    const t = i * dt
    const meas = hist[0]
    const e = 1 - meas
    integ = Math.max(-20, Math.min(20, integ + e * dt))
    const u = Math.max(-limit, Math.min(limit, kp * e + ki * integ - kd * ((meas - prev) / dt)))
    prev = meas
    const d = t > seconds / 2 ? gust : 0
    w += ((u + d - b * w) / J) * dt
    th += w * dt
    hist.push(th)
    hist.shift()
    if (i % 10 === 0) pts.push([t, th])
  }
  return pts
}

/** IPC-2141 surface microstrip. Lengths in any one unit. */
export function microstripZ0(w: number, h: number, t: number, er: number) {
  return (87 / Math.sqrt(er + 1.41)) * Math.log((5.98 * h) / (0.8 * w + t))
}
export const microstripEeff = (w: number, h: number, er: number) => (er + 1) / 2 + (er - 1) / 2 / Math.sqrt(1 + (12 * h) / w)

/** Gross dies on a wafer, with edge loss. Diameter in mm, die area in mm². */
export const diesPerWafer = (d: number, a: number) => Math.floor((Math.PI * (d / 2) ** 2) / a - (Math.PI * d) / Math.sqrt(2 * a))
export const poissonYield = (d0PerCm2: number, aMm2: number) => Math.exp(-d0PerCm2 * (aMm2 / 100))
export const junctionTemp = (ta: number, p: number, ...theta: number[]) => ta + p * theta.reduce((s, x) => s + x, 0)

/** A bench supply: constant voltage until the current limit, then constant current. */
export function supplyOut(vset: number, ilim: number, r: number) {
  const i = vset / r
  return i > ilim ? { v: ilim * r, i: ilim, mode: 'CC' as const } : { v: vset, i, mode: 'CV' as const }
}

/** Simple CC/CV charge of one lithium cell. Time in minutes. */
export function chargeCurve(ah: number, cRate: number, r: number) {
  const icc = ah * cRate
  const vmax = 4.2
  const stop = ah * 0.05
  const dt = 0.25 / 60   // hours
  let soc = 0.02
  const pts: { t: number; v: number; i: number }[] = []
  for (let n = 0; n < 20000; n++) {
    const ocv = 3.4 + 0.8 * soc
    const i = Math.min(icc, (vmax - ocv) / r)
    if (i < stop) break
    pts.push({ t: n * dt * 60, v: ocv + i * r, i })
    soc = Math.min(1, soc + (i * dt) / ah)
  }
  return pts
}
