import React from 'react'

export type RangeTestMethod = 'CLTC' | 'WLTP' | 'EPA' | 'NEDC'

export interface ProductTitleVehicle {
  brand: string
  model: string
  year: number
  variant?: string | null
  rangeKm?: number | null
  rangeMethod?: RangeTestMethod | null
  batteryKwh?: number | null
}

export interface ProductTitleProps {
  vehicle: ProductTitleVehicle
}

export default function ProductTitle({ vehicle }: ProductTitleProps) {
  const { brand, model, year, variant, rangeKm, rangeMethod, batteryKwh } = vehicle

  const subtitleParts = [
    variant?.trim() || undefined,
    typeof rangeKm === 'number' && rangeKm > 0
      ? `${Math.round(rangeKm)} km${rangeMethod ? ` ${rangeMethod}` : ''}`
      : undefined,
    typeof batteryKwh === 'number' && batteryKwh > 0
      ? `${batteryKwh} kWh`
      : undefined,
  ].filter(Boolean)

  return (
    <div className="relative flex flex-col items-center gap-2 text-center">
      <div className="relative flex flex-col items-center">
        <h1 className="relative text-[clamp(1.9rem,1.7rem+1vw,2.5rem)] font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))] bg-clip-text text-transparent">
          {`${year} ${brand} ${model}`}
        </h1>
      </div>
      {subtitleParts.length > 0 && (
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          {subtitleParts.join(' • ')}
        </p>
      )}
    </div>
  )
}
