import { type Cycle } from '@/lib/formatters/vehicle'
import type { VehicleSpecsRaw } from '@/lib/vehicle/specs'

const rangePriority: Array<{ key: RangeField; method: Cycle }> = [
  { key: 'rangeKmWltp', method: 'WLTP' },
  { key: 'rangeKmCltc', method: 'CLTC' },
  { key: 'rangeKmEpa', method: 'EPA' },
  { key: 'rangeKmNedc', method: 'NEDC' },
]

type RangeField = 'rangeKmWltp' | 'rangeKmCltc' | 'rangeKmEpa' | 'rangeKmNedc'

interface VehicleSpecificationsRow {
  rangeKmCltc?: number | null
  rangeKmWltp?: number | null
  rangeKmEpa?: number | null
  rangeKmNedc?: number | null
  batteryKwh?: number | null
  acceleration0To100Sec?: number | null
  topSpeedKmh?: number | null
  powerKw?: number | null
  powerHp?: number | null
  chargingDcKw?: number | null
  chargingTimeDcMin?: number | null
}

function pickBestRange(specs?: VehicleSpecificationsRow | null) {
  if (!specs) return undefined

  for (const candidate of rangePriority) {
    const value = specs[candidate.key]
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return {
        value,
        method: candidate.method,
      }
    }
  }

  return undefined
}

function hpToKw(hp?: number | null) {
  if (hp == null) return undefined
  return Math.round(hp * 0.7457)
}

export function buildVehicleHeroSpecsInput(specs?: VehicleSpecificationsRow | null): VehicleSpecsRaw {
  if (!specs) return {}

  const range = pickBestRange(specs)

  const batteryKwh = specs.batteryKwh
  const charge = { dcPeakKw: specs.chargingDcKw ?? undefined, dc10to80min: specs.chargingTimeDcMin ?? undefined }

  const performance = {
    zeroTo100s: specs.acceleration0To100Sec ?? undefined,
    topSpeedKmh: specs.topSpeedKmh ?? undefined,
  }

  const powerKw = specs.powerKw ?? hpToKw(specs.powerHp ?? undefined)

  const hero: VehicleSpecsRaw = {}

  if (range) {
    hero.range = range
  }

  if (batteryKwh != null) {
    hero.battery = { kWh: batteryKwh }
  }

  if (charge.dcPeakKw != null || charge.dc10to80min != null) {
    hero.charge = charge
  }

  if (performance.zeroTo100s != null || performance.topSpeedKmh != null) {
    hero.performance = performance
  }

  if (powerKw != null) {
    hero.motor = { powerKw }
  }

  return hero
}
