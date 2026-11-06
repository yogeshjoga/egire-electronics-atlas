import type { ComponentType } from 'react'
import { AtomViz, BandsViz, CoulombViz, DriftViz, FieldViz, MassViz, QuarksViz, ScaleViz, StandardModelViz } from './matter'
import { BatteryViz, DividerViz, KirchhoffViz, OhmViz, RcViz, ResistorCodeViz, SeriesParallelViz, TheveninViz, WireViz } from './circuits'
import { EscViz, FilterViz, FourierViz, InductionViz, PhasorViz, RlcViz, TransformerViz } from './ac'
import { AdcViz, BjtViz, CmosViz, DopingViz, MosfetViz, OpampViz, PnViz, RectifierViz, RegulatorViz } from './semi'
import { ChargerViz, DeadTimeViz, MicrostripViz, PidViz, SerialViz, SupplyViz, ThermalViz, WaferViz } from './systems'
import { BinaryViz, BuckViz, FlipFlopViz, LogicViz, MultimeterViz, PwmViz, ScopeViz, TraceViz } from './bench'

export const VIZ: Record<string, ComponentType> = {
  scale: ScaleViz, mass: MassViz, atom: AtomViz, quarks: QuarksViz, 'standard-model': StandardModelViz, bands: BandsViz,
  coulomb: CoulombViz, field: FieldViz, drift: DriftViz,
  ohm: OhmViz, wire: WireViz, 'series-parallel': SeriesParallelViz, kirchhoff: KirchhoffViz, divider: DividerViz,
  thevenin: TheveninViz, 'resistor-code': ResistorCodeViz, battery: BatteryViz, rc: RcViz,
  phasor: PhasorViz, rlc: RlcViz, filter: FilterViz, fourier: FourierViz, induction: InductionViz, transformer: TransformerViz, esc: EscViz,
  doping: DopingViz, pn: PnViz, rectifier: RectifierViz, bjt: BjtViz, mosfet: MosfetViz, opamp: OpampViz, regulator: RegulatorViz, adc: AdcViz, cmos: CmosViz,
  binary: BinaryViz, logic: LogicViz, flipflop: FlipFlopViz, pwm: PwmViz, buck: BuckViz, multimeter: MultimeterViz, scope: ScopeViz, trace: TraceViz,
  deadtime: DeadTimeViz, thermal: ThermalViz, microstrip: MicrostripViz, serial: SerialViz, pid: PidViz, wafer: WaferViz, supply: SupplyViz, charger: ChargerViz,
}
