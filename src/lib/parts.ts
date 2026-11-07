// Links each sensor category to the lessons that explain how it works.
export const SENSOR_LESSONS: Record<string, string[]> = {
  'Motion, inertial and orientation': ['imu-sensors', 'motion', 'magnetic-field'],
  'Distance, proximity and ranging': ['waves', 'photon'],
  'Radar, RF and radio sensing': ['em-waves', 'antenna', 'radio-link'],
  'Environmental and weather': ['nav-sensors', 'heat-temperature'],
  'Optical, light and imaging sensors': ['photodiode', 'photon'],
  'Advanced imaging and optical measurement': ['photodiode', 'ai-board'],
  'Force, load, strain and tactile': ['force', 'instrumentation-amp'],
  'Position, displacement and encoders': ['hall-effect', 'counters'],
  'GNSS, navigation and localization': ['nav-sensors', 'radio-link'],
  'Electrical power and battery sensing': ['current-sensing', 'bms', 'lipo'],
  'Acoustic and ultrasonic': ['waves', 'sampling'],
  'Industrial, machine and structural health': ['fourier', 'sampling'],
  'Magnetic and field sensors': ['hall-effect', 'faraday-law', 'magnetic-field'],
  'Touch, human interface and gesture': ['capacitor'],
  'Radiation, nuclear and particle': ['photon', 'atom'],
  'Drone and robotics specialized sensing': ['imu-sensors', 'nav-sensors', 'failsafe'],
  'Robotics perception and localization': ['ai-board', 'imu-sensors'],
  'Temperature, thermal and heat-transfer': ['heat-temperature', 'thermoelectric', 'temp-coefficient'],
  'Position and motion switches / speed': ['hall-effect', 'switches-relays'],
  'Miscellaneous electronic and smart sensing': ['mcu', 'adc'],
}

export const DRONE_CATEGORIES = [
  'Motion, inertial and orientation',
  'Distance, proximity and ranging',
  'GNSS, navigation and localization',
  'Electrical power and battery sensing',
  'Drone and robotics specialized sensing',
  'Robotics perception and localization',
]
