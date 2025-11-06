import React from 'react'
import type { RangeTestMethod } from './product-title'

export interface VehicleSummary {
  brand: string
  model: string
  year: number
  bodyType?: string | null
}

export interface VehicleSpecificationsDisplay {
  rangeKm?: number | null
  rangeMethod?: RangeTestMethod | null
  batteryKwh?: number | null
  acceleration0100Sec?: number | null
  topSpeedKmh?: number | null
  powerKw?: number | null
  powerHp?: number | null
  chargingDcKw?: number | null
  chargingTimeDcMin?: number | null
  seats?: number | null
  weightKg?: number | null
}

export interface VehicleAllSpecsProps {
  vehicle: VehicleSummary
  specs?: VehicleSpecificationsDisplay | null
}

const specRows: Array<{
  key: keyof VehicleSpecificationsDisplay
  label: string
  format: (value: number) => string
}> = [
  {
    key: 'rangeKm',
    label: 'Autonomía',
    format: (value) => `${Math.round(value)} km`,
  },
  {
    key: 'batteryKwh',
    label: 'Batería',
    format: (value) => `${value} kWh`,
  },
  {
    key: 'acceleration0100Sec',
    label: '0 - 100 km/h',
    format: (value) => `${value.toFixed(1)} s`,
  },
  {
    key: 'topSpeedKmh',
    label: 'Velocidad Máx.',
    format: (value) => `${Math.round(value)} km/h`,
  },
  {
    key: 'powerKw',
    label: 'Potencia (kW)',
    format: (value) => `${Math.round(value)} kW`,
  },
  {
    key: 'powerHp',
    label: 'Potencia (HP)',
    format: (value) => `${Math.round(value)} hp`,
  },
  {
    key: 'chargingDcKw',
    label: 'Carga DC',
    format: (value) => `${Math.round(value)} kW`,
  },
  {
    key: 'chargingTimeDcMin',
    label: 'Tiempo de carga DC',
    format: (value) => `${Math.round(value)} min`,
  },
  {
    key: 'seats',
    label: 'Asientos',
    format: (value) => `${Math.round(value)}`,
  },
  {
    key: 'weightKg',
    label: 'Peso',
    format: (value) => `${Math.round(value)} kg`,
  },
]

export default function VehicleAllSpecs({ vehicle, specs }: VehicleAllSpecsProps) {
  const rows = specRows
    .map((row) => {
      const rawValue = specs?.[row.key]
      if (rawValue === undefined || rawValue === null) return null
      return {
        label: row.label,
        value: row.format(typeof rawValue === 'number' ? rawValue : Number(rawValue)),
      }
    })
    .filter(Boolean) as Array<{ label: string; value: string }>

  if (specs?.rangeMethod && rows.some((r) => r.label === 'Autonomía')) {
    const index = rows.findIndex((r) => r.label === 'Autonomía')
    if (index >= 0) {
      rows[index] = {
        label: rows[index]!.label,
        value: `${rows[index]!.value} (${specs.rangeMethod})`,
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Ficha técnica</h3>
        <p className="text-sm text-muted-foreground">
          {`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          {vehicle.bodyType ? ` · ${vehicle.bodyType}` : ''}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay especificaciones detalladas disponibles para este vehículo.
        </p>
      ) : (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="rounded-xl border bg-muted/40 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
