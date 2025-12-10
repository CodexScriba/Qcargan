export type Cycle = 'CLTC' | 'WLTP' | 'EPA' | 'NEDC'

export interface VehicleSpecsRawRange {
  value?: number | null
  method?: Cycle | null
}

export interface VehicleSpecsRawCharge {
  acKw?: number | null
  dcPeakKw?: number | null
  dc10to80min?: number | null
}

export interface VehicleSpecsRawMotor {
  powerKw?: number | null
  torqueNm?: number | null
}

export interface VehicleSpecsRawPerformance {
  zeroTo100s?: number | null
  topSpeedKmh?: number | null
}

export interface VehicleSpecsRawBattery {
  kWh?: number | null
  usableKWh?: number | null
  chemistry?: string | null
}

const cyclePriority: Cycle[] = ['CLTC', 'WLTP', 'EPA', 'NEDC']

export function selectBestRangeCycle(raw: { range?: VehicleSpecsRawRange | null } | null):
  | { valueKm: number; cycle: Cycle }
  | null {
  if (!raw || !raw.range) return null
  const { value, method } = raw.range
  if (value == null || isNaN(value)) return null
  // If method is provided and valid, use it
  if (method && cyclePriority.includes(method)) {
    return { valueKm: Math.round(value), cycle: method }
  }
  // Fallback: treat as unknown method, assume lowest priority
  return { valueKm: Math.round(value), cycle: 'NEDC' }
}

export function formatKm(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  return `${Math.round(value)} km`
}

export function formatKmh(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  return `${Math.round(value)} km/h`
}

export function formatKWh(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  const v = Math.abs(value) < 10 ? Number(value.toFixed(1)) : Math.round(value)
  return `${v} kWh`
}

export function formatKW(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  const v = Math.abs(value) < 10 ? Number(value.toFixed(1)) : Math.round(value)
  return `${v} kW`
}

export function formatMinutes(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  return `${Math.round(value)} min`
}

export function formatSeconds(value: number | null | undefined): string {
  if (value == null) return '—'
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '—'
  const v = numeric >= 10 ? Math.round(numeric) : Number(numeric.toFixed(1))
  return `${v} s`
}

export function formatPowerKwHp(kw: number | null | undefined): string {
  if (kw == null || isNaN(kw)) return '—'
  const kwRounded = Math.abs(kw) < 10 ? Number(kw.toFixed(1)) : Math.round(kw)
  const hp = Math.round(kw * 1.341)
  return `${kwRounded} kW (≈${hp} hp)`
}

export function NA(label?: string): { text: '—'; tooltip: string } {
  return { text: '—', tooltip: label ? `${label}: Not available` : 'Not available' }
}
