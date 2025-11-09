import {
  type Cycle,
  selectBestRangeCycle,
  formatKm,
  formatKmh,
  formatKWh,
  formatKW,
  formatMinutes,
  formatSeconds,
  formatPowerKwHp,
  NA,
} from '@/lib/formatters/vehicle'

export interface VehicleSpecsRaw {
  range?: { value?: number; method?: Cycle };
  battery?: { kWh?: number; usableKWh?: number; chemistry?: string };
  charge?: { acKw?: number; dcPeakKw?: number; dc10to80min?: number };
  performance?: { zeroTo100s?: number | null; topSpeedKmh?: number };
  motor?: { powerKw?: number; torqueNm?: number };
  dimensions?: {
    lengthMm?: number; widthMm?: number; heightMm?: number; wheelbaseMm?: number;
    groundClearanceMm?: number; turningRadiusM?: number; cargoVolumeL?: number; seats?: number
  };
  powertrain?: { drive?: string; energyConsumptionKwhPer100km?: number };
  charging?: { batteryType?: string; portsStandard?: string; ccsComb02Optional?: boolean; vehicleToLoadVTOL?: boolean };
  interior?: { screenIn?: number; instrumentClusterIn?: number; speakers?: number; wirelessPhoneCharging?: boolean; carplayAndroidAuto?: boolean };
  safety?: { airbagsTotal?: number; reverseCamera?: boolean; systems?: string[] };
  wheelsAndTires?: { wheelSizeIn?: number; tireSize?: string; wheelMaterial?: string };
  lighting?: { headlamps?: string; daytimeRunningLights?: string; rearFogLamp?: boolean; followMeHome?: boolean };
  exterior?: { wipers?: boolean; mirrors?: string };
  highlights?: string[]; colorsAvailable?: string[];
}

export interface VehicleLike {
  specs: VehicleSpecsRaw
  [k: string]: unknown
}

export type HeroKey = 'range'|'battery'|'dc'|'zeroTo100'|'topSpeed'|'power'

export interface HeroSpec {
  key: HeroKey
  title: string
  value: string
  missing?: boolean
  ariaLabel?: string
}

export function toHeroSpecs(raw: VehicleSpecsRaw): HeroSpec[] {
  const hero: HeroSpec[] = []

  // Range
  const bestRange = selectBestRangeCycle({ range: raw.range })
  if (bestRange) {
    const value = `${formatKm(bestRange.valueKm)} (${bestRange.cycle})`
    hero.push({ key: 'range', title: 'Range', value, ariaLabel: `Range: ${value}` })
  } else {
    const na = NA('Range')
    hero.push({ key: 'range', title: 'Range', value: na.text, missing: true, ariaLabel: `Range: ${na.tooltip}` })
  }

  // Battery
  const usable = raw.battery?.usableKWh
  const capacity = raw.battery?.kWh
  let batteryValue: string
  if (usable != null) batteryValue = formatKWh(usable)
  else if (capacity != null) batteryValue = formatKWh(capacity)
  else batteryValue = '—'
  hero.push({ key: 'battery', title: 'Battery', value: batteryValue, missing: batteryValue === '—', ariaLabel: `Battery: ${batteryValue === '—' ? 'Not available' : batteryValue}` })

  // DC charging
  const dcPeak = raw.charge?.dcPeakKw
  const dcTime = raw.charge?.dc10to80min
  let dcValue = '—'
  if (dcPeak != null && dcTime != null) dcValue = `Max ${formatKW(dcPeak)} • ${formatMinutes(dcTime)}`
  else if (dcPeak != null) dcValue = `Max ${formatKW(dcPeak)}`
  else if (dcTime != null) dcValue = formatMinutes(dcTime)
  hero.push({ key: 'dc', title: 'DC charging', value: dcValue, missing: dcValue === '—', ariaLabel: `DC charging: ${dcValue === '—' ? 'Not available' : dcValue}` })

  // 0–100 km/h
  const zeroTo100 = raw.performance?.zeroTo100s
  const zeroValue = zeroTo100 != null ? formatSeconds(zeroTo100) : '—'
  hero.push({ key: 'zeroTo100', title: '0–100 km/h', value: zeroValue, missing: zeroValue === '—', ariaLabel: `0–100 km/h: ${zeroValue === '—' ? 'Not available' : zeroValue}` })

  // Max speed
  const topSpeed = raw.performance?.topSpeedKmh
  const topValue = topSpeed != null ? formatKmh(topSpeed) : '—'
  hero.push({ key: 'topSpeed', title: 'Max speed', value: topValue, missing: topValue === '—', ariaLabel: `Max speed: ${topValue === '—' ? 'Not available' : topValue}` })

  // Motor power
  const powerKw = raw.motor?.powerKw
  const powerValue = powerKw != null ? formatPowerKwHp(powerKw) : '—'
  hero.push({ key: 'power', title: 'Motor power', value: powerValue, missing: powerValue === '—', ariaLabel: `Motor power: ${powerValue === '—' ? 'Not available' : powerValue}` })

  return hero
}

export interface SpecsTableSection {
  section: string
  rows: Array<{ spec: string; value: string }>
}

export function toAllSpecsTable(raw: VehicleSpecsRaw): SpecsTableSection[] {
  const sections: SpecsTableSection[] = []

  // Declare common variables first
  const pt = raw.powertrain || {}
  const m = raw.motor || {}
  const d = raw.dimensions || {}
  const ch = raw.charge || {}
  const chg = raw.charging || {}
  const b = raw.battery || {}

  // Battery & Charging (moved to top)
  const bcRows: SpecsTableSection['rows'] = []
  if (chg.batteryType) bcRows.push({ spec: 'Battery type', value: chg.batteryType })
  if (b.kWh != null || b.usableKWh != null) bcRows.push({ spec: 'Capacity', value: b.usableKWh != null ? formatKWh(b.usableKWh!) : formatKWh(b.kWh!) })
  if (chg.portsStandard) bcRows.push({ spec: 'Ports/standard', value: chg.portsStandard })
  if (typeof chg.ccsComb02Optional === 'boolean') bcRows.push({ spec: 'CCS Combo 2', value: chg.ccsComb02Optional ? 'Optional' : 'No' })
  if (typeof chg.vehicleToLoadVTOL === 'boolean') bcRows.push({ spec: 'Vehicle-to-Load (V2L)', value: chg.vehicleToLoadVTOL ? 'Yes' : 'No' })
  if (pt.energyConsumptionKwhPer100km != null) bcRows.push({ spec: 'Consumption', value: `${Number(pt.energyConsumptionKwhPer100km!.toFixed(1))} kWh/100 km` })
  if (ch.acKw != null) bcRows.push({ spec: 'AC OBC', value: formatKW(ch.acKw!) })
  if (ch.dcPeakKw != null) bcRows.push({ spec: 'DC peak', value: formatKW(ch.dcPeakKw!) })
  if (ch.dc10to80min != null) bcRows.push({ spec: '10–80%', value: formatMinutes(ch.dc10to80min!) })
  if (bcRows.length) sections.push({ section: 'Battery & Charging', rows: bcRows })

  // Powertrain
  const ptRows: SpecsTableSection['rows'] = []
  if (pt.drive) ptRows.push({ spec: 'Drive', value: pt.drive })
  if (m.powerKw != null) ptRows.push({ spec: 'Motor power', value: formatPowerKwHp(m.powerKw!) })
  if (m.torqueNm != null) ptRows.push({ spec: 'Torque', value: `${Math.round(m.torqueNm!)} Nm` })
  if (raw.performance?.topSpeedKmh != null) ptRows.push({ spec: 'Top speed', value: formatKmh(raw.performance.topSpeedKmh!) })
  if (ptRows.length) sections.push({ section: 'Powertrain', rows: ptRows })

  // Dimensions
  const dimRows: SpecsTableSection['rows'] = []
  if (d.lengthMm) dimRows.push({ spec: 'Length', value: `${Math.round(d.lengthMm)} mm` })
  if (d.widthMm) dimRows.push({ spec: 'Width', value: `${Math.round(d.widthMm)} mm` })
  if (d.heightMm) dimRows.push({ spec: 'Height', value: `${Math.round(d.heightMm)} mm` })
  if (d.wheelbaseMm) dimRows.push({ spec: 'Wheelbase', value: `${Math.round(d.wheelbaseMm)} mm` })
  if (d.groundClearanceMm) dimRows.push({ spec: 'Ground clearance', value: `${Math.round(d.groundClearanceMm)} mm` })
  if (d.turningRadiusM) dimRows.push({ spec: 'Turning radius', value: `${Number(d.turningRadiusM.toFixed(2))} m` })
  if (d.cargoVolumeL) dimRows.push({ spec: 'Cargo volume', value: `${Math.round(d.cargoVolumeL)} L` })
  if (d.seats) dimRows.push({ spec: 'Seats', value: String(d.seats) })
  if (dimRows.length) sections.push({ section: 'Dimensions', rows: dimRows })

  // Interior & Infotainment
  const i = raw.interior || {}
  const inRows: SpecsTableSection['rows'] = []
  if (i.screenIn != null) inRows.push({ spec: 'Center screen', value: `${Number(i.screenIn.toFixed(1))} in` })
  if (i.instrumentClusterIn != null) inRows.push({ spec: 'Instrument cluster', value: `${Number(i.instrumentClusterIn.toFixed(1))} in` })
  if (i.speakers != null) inRows.push({ spec: 'Speakers', value: String(i.speakers) })
  if (typeof i.wirelessPhoneCharging === 'boolean') inRows.push({ spec: 'Wireless phone charging', value: i.wirelessPhoneCharging ? 'Yes' : 'No' })
  if (typeof i.carplayAndroidAuto === 'boolean') inRows.push({ spec: 'CarPlay / Android Auto', value: i.carplayAndroidAuto ? 'Yes' : 'No' })
  if (inRows.length) sections.push({ section: 'Interior & Infotainment', rows: inRows })

  // Safety/ADAS
  const s = raw.safety || {}
  const sRows: SpecsTableSection['rows'] = []
  if (s.airbagsTotal != null) sRows.push({ spec: 'Airbags', value: String(s.airbagsTotal) })
  if (typeof s.reverseCamera === 'boolean') sRows.push({ spec: 'Reverse camera', value: s.reverseCamera ? 'Yes' : 'No' })
  if (s.systems?.length) sRows.push({ spec: 'Key systems', value: s.systems.join(', ') })
  if (sRows.length) sections.push({ section: 'Safety/ADAS', rows: sRows })

  // Wheels & Tires
  const wt = raw.wheelsAndTires || {}
  const wtRows: SpecsTableSection['rows'] = []
  if (wt.wheelSizeIn != null) wtRows.push({ spec: 'Wheel size', value: `${Number(wt.wheelSizeIn.toFixed(1))} in` })
  if (wt.tireSize) wtRows.push({ spec: 'Tire size', value: wt.tireSize })
  if (wt.wheelMaterial) wtRows.push({ spec: 'Wheel material', value: wt.wheelMaterial })
  if (wtRows.length) sections.push({ section: 'Wheels & Tires', rows: wtRows })

  // Exterior & Lighting
  const l = raw.lighting || {}
  const e = raw.exterior || {}
  const elRows: SpecsTableSection['rows'] = []
  if (l.headlamps) elRows.push({ spec: 'Headlamps', value: l.headlamps })
  if (l.daytimeRunningLights) elRows.push({ spec: 'DRL', value: l.daytimeRunningLights })
  if (typeof l.rearFogLamp === 'boolean') elRows.push({ spec: 'Rear fog lamp', value: l.rearFogLamp ? 'Yes' : 'No' })
  if (typeof l.followMeHome === 'boolean') elRows.push({ spec: 'Follow-me-home', value: l.followMeHome ? 'Yes' : 'No' })
  if (typeof e.wipers === 'boolean') elRows.push({ spec: 'Wipers', value: e.wipers ? 'Yes' : 'No' })
  if (e.mirrors) elRows.push({ spec: 'Mirrors', value: e.mirrors })
  if (elRows.length) sections.push({ section: 'Exterior & Lighting', rows: elRows })

  // Colors & Highlights
  const chRows: SpecsTableSection['rows'] = []
  if (raw.colorsAvailable?.length) chRows.push({ spec: 'Colors', value: raw.colorsAvailable.join(', ') })
  if (raw.highlights?.length) chRows.push({ spec: 'Highlights', value: raw.highlights.join(', ') })
  if (chRows.length) sections.push({ section: 'Colors & Highlights', rows: chRows })

  return sections
}

