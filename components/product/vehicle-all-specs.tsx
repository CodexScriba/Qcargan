import React from 'react'
import type { VehicleSpecs } from '@/lib/db/schema/vehicles'
import { cn } from '@/lib/utils'

export interface VehicleStructuredSpecs {
  rangeKmCltc?: number | null
  rangeKmWltp?: number | null
  rangeKmEpa?: number | null
  rangeKmNedc?: number | null
  rangeKmClcReported?: number | null
  batteryKwh?: number | null
  acceleration0To100Sec?: number | null
  topSpeedKmh?: number | null
  powerKw?: number | null
  powerHp?: number | null
  chargingDcKw?: number | null
  chargingTimeDcMin?: number | null
  seats?: number | null
  weightKg?: number | null
  bodyType?: 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'
}

export interface VehicleAllSpecsProps {
  brand: string
  model: string
  year?: number | null
  variant?: string | null
  specifications?: VehicleStructuredSpecs | null
  detailedSpecs?: VehicleSpecs | null
  className?: string
}

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

function formatMeasurement(value?: number | null, suffix = '', formatter = integer) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  const formatted = formatter.format(value)
  return suffix ? `${formatted} ${suffix}` : formatted
}

function formatAcceleration(value?: number | null) {
  if (typeof value !== 'number') return null
  return `${decimal.format(value)} s`
}

function formatTorque(specs?: VehicleSpecs['torque']) {
  if (!specs) return null
  if (specs.nm && specs.lbft) {
    return `${integer.format(specs.nm)} Nm / ${integer.format(specs.lbft)} lb·ft`
  }
  if (specs.nm) {
    return `${integer.format(specs.nm)} Nm`
  }
  if (specs.lbft) {
    return `${integer.format(specs.lbft)} lb·ft`
  }
  return null
}

function formatDimensions(dimensions?: VehicleSpecs['dimensions']) {
  if (!dimensions) return null
  const { length, width, height, wheelbase } = dimensions
  const parts = [
    length ? `${integer.format(length)} mm (L)` : null,
    width ? `${integer.format(width)} mm (W)` : null,
    height ? `${integer.format(height)} mm (H)` : null,
  ].filter(Boolean)
  const summary = parts.join(' • ')
  if (summary) return summary
  if (wheelbase) return `${integer.format(wheelbase)} mm wheelbase`
  return null
}

function formatBodyType(bodyType?: VehicleStructuredSpecs['bodyType']) {
  if (!bodyType) return null
  return bodyType
    .split('_')
    .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
    .join(' / ')
}

export default function VehicleAllSpecs({
  brand,
  model,
  year,
  variant,
  specifications,
  detailedSpecs,
  className,
}: VehicleAllSpecsProps) {
  const structured = specifications ?? {}
  const extra = detailedSpecs ?? {}

  const sections = [
    {
      title: 'Range & Battery',
      items: [
        { label: 'CLTC range', value: formatMeasurement(structured.rangeKmCltc, 'km') },
        { label: 'WLTP range', value: formatMeasurement(structured.rangeKmWltp, 'km') },
        { label: 'EPA range', value: formatMeasurement(structured.rangeKmEpa, 'km') },
        { label: 'Battery capacity', value: formatMeasurement(structured.batteryKwh, 'kWh', decimal) },
      ],
    },
    {
      title: 'Performance',
      items: [
        { label: '0-100 km/h', value: formatAcceleration(structured.acceleration0To100Sec) },
        { label: 'Top speed', value: formatMeasurement(structured.topSpeedKmh, 'km/h') },
        { label: 'Power', value: structured.powerHp ? `${integer.format(structured.powerHp)} hp${structured.powerKw ? ` / ${integer.format(structured.powerKw)} kW` : ''}` : structured.powerKw ? `${integer.format(structured.powerKw)} kW` : null },
        { label: 'Torque', value: formatTorque(extra.torque) },
      ],
    },
    {
      title: 'Charging',
      items: [
        { label: 'DC fast charge', value: formatMeasurement(structured.chargingDcKw, 'kW') },
        { label: 'DC to 80%', value: formatMeasurement(structured.chargingTimeDcMin, 'min') },
        { label: 'AC charging', value: formatMeasurement(extra.charging?.ac?.kW, 'kW') },
        { label: 'AC time', value: extra.charging?.ac?.time ?? null },
      ],
    },
    {
      title: 'Dimensions & Capacity',
      items: [
        { label: 'Seating', value: structured.seats ? `${structured.seats} seats` : null },
        { label: 'Weight', value: formatMeasurement(structured.weightKg, 'kg') },
        { label: 'Body type', value: formatBodyType(structured.bodyType) },
        { label: 'Dimensions', value: formatDimensions(extra.dimensions) },
        { label: 'Wheelbase', value: extra.dimensions?.wheelbase ? `${integer.format(extra.dimensions.wheelbase)} mm` : null },
      ],
    },
  ].filter((section) => section.items.some((item) => !!item.value))

  return (
    <section className={cn('space-y-6', className)}>
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Full specifications
        </p>
        <h3 className="text-2xl font-semibold tracking-tight">
          {brand} {model} {year ?? ''}
        </h3>
        {variant && <p className="text-sm text-muted-foreground">{variant}</p>}
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm"
          >
            <h4 className="text-base font-semibold">{section.title}</h4>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.items.map((item) => (
                item.value ? (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/40 bg-background/60 p-3"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-lg font-semibold text-foreground">
                      {item.value}
                    </dd>
                  </div>
                ) : null
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
