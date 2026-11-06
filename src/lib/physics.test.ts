import { describe, expect, it } from 'vitest'
import * as p from './physics'

describe('physics used by the simulators', () => {
  it('fills copper as [Ar] 3d10 4s1', () => {
    const c = p.electronConfig(29)
    expect(c.find((o) => o.n === 4 && o.l === 's')!.e).toBe(1)
    expect(c.find((o) => o.n === 3 && o.l === 'd')!.e).toBe(10)
    expect(p.shells(29)).toEqual([2, 8, 18, 1])
  })
  it('gives silicon four valence electrons', () => expect(p.shells(14)).toEqual([2, 8, 4]))
  it('matches the lesson drift example', () => expect(p.driftVelocity(10, 2.5e-6) * 1000).toBeCloseTo(0.294, 2))
  it('matches the hydrogen Coulomb example', () => expect(p.coulombForce(p.E_CHARGE, p.E_CHARGE, 5.3e-11)).toBeCloseTo(8.2e-8, 8))
  it('parallel of two 10 ohm is 5', () => expect(p.parallel(10, 10)).toBeCloseTo(5))
  it('divider 10 V, 3k, 2k gives 4 V', () => expect(p.divider(10, 3000, 2000)).toBeCloseTo(4))
  it('RC reaches 63.2% at one tau', () => expect(p.rcCharge(1, 1, 1)).toBeCloseTo(0.632, 3))
  it('two-source node obeys KCL', () => {
    const s = p.twoSourceNode(12, 5, 100, 220, 150)
    expect(s.i1 + s.i3).toBeCloseTo(s.i2, 10)
  })
  it('series RLC at resonance is just R', () => {
    const f = p.resonance(10e-6, 100e-12)
    expect(f).toBeCloseTo(5.03e6, -4)
    expect(p.seriesRlcZ(50, 10e-6, 100e-12, f).mag).toBeCloseTo(50, 4)
  })
  it('low-pass is -3 dB at the corner', () => expect(20 * Math.log10(p.lowpassMag(1000, 1000))).toBeCloseTo(-3.01, 2))
  it('diode current rises 10x per ~60 mV', () => {
    expect(p.shockley(0.66) / p.shockley(0.6)).toBeGreaterThan(9)
    expect(p.shockley(0.66) / p.shockley(0.6)).toBeLessThan(11)
  })
  it('MOSFET is continuous at the saturation edge', () => {
    expect(p.mosfetId(3, 1, 2, 1)).toBeCloseTo(p.mosfetId(3, 1.0001, 2, 1), 3)
    expect(p.mosfetId(1, 5, 2, 1)).toBe(0)
  })
  it('IPC-2221 matches the lesson example', () => expect(p.traceWidthMm(5, 10, 1)).toBeCloseTo(2.77, 1))
  it('flight time matches the lesson example', () => expect(p.flightMinutes(111, 430.5)).toBeCloseTo(12.4, 1))
  it('900 Hz at 1 kHz sampling aliases to 100 Hz', () => expect(p.aliasOf(900, 1000)).toBe(100))
  it('12-bit LSB on 3.3 V is 0.81 mV', () => expect(p.adcLsb(3.3, 12) * 1000).toBeCloseTo(0.806, 2))
  it('formats engineering notation', () => {
    expect(p.si(0.0047, 'A')).toBe('4.7 mA')
    expect(p.si(4700, 'Ω')).toBe('4.7 kΩ')
    expect(p.si(1, 'V')).toBe('1 V')
  })
})

describe('bench tools', () => {
  it('holds voltage under the limit', () => expect(p.supplyOut(12, 1, 100)).toEqual({ v: 12, i: 0.12, mode: 'CV' }))
  it('matches the 50 ohm limit example', () => expect(p.supplyOut(12, 0.1, 50)).toEqual({ v: 5, i: 0.1, mode: 'CC' }))
  it('a short circuit gives near zero volts at the limit', () => {
    const o = p.supplyOut(12, 0.5, 0.01)
    expect(o.i).toBe(0.5)
    expect(o.v).toBeLessThan(0.01)
  })
  it('charging never passes 4.2 V and current tapers', () => {
    const c = p.chargeCurve(1.5, 1, 0.03)
    expect(Math.max(...c.map((x) => x.v))).toBeLessThanOrEqual(4.2001)
    expect(c[0].i).toBeCloseTo(1.5)
    expect(c.at(-1)!.i).toBeLessThan(0.1)
  })
  it('a 2C charge is not twice as fast as 1C', () => {
    const t = (r: number) => p.chargeCurve(1.5, r, 0.03).at(-1)!.t
    expect(t(2)).toBeGreaterThan(t(1) / 2)
  })
})

describe('physics for the later phases', () => {
  it('a tuned PID settles on the setpoint', () => {
    const pts = p.pidStep(20, 5, 6)
    expect(pts.at(-1)![1]).toBeCloseTo(1, 1)
  })
  it('loop delay makes the same gains ring harder', () => {
    const peak = (d: number) => Math.max(...p.pidStep(20, 5, 6, d).map((x) => x[1]))
    expect(peak(150)).toBeGreaterThan(peak(0) + 0.1)
  })
  it('microstrip example gives about 49 ohms', () => expect(p.microstripZ0(0.35, 0.2, 0.035, 4.3)).toBeCloseTo(48.6, 0))
  it('wafer example gives 640 gross dies', () => expect(p.diesPerWafer(300, 100)).toBe(640))
  it('1 cm² at 0.1 defects per cm² yields 90%', () => expect(p.poissonYield(0.1, 100)).toBeCloseTo(0.905, 3))
  it('thermal stack adds up', () => expect(p.junctionTemp(45, 3, 40)).toBe(165))
})
