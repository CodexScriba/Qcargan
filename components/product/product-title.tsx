import React from 'react'
import { cn } from '@/lib/utils'

const rangeFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const batteryFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

export interface ProductTitleProps {
  brand: string
  model: string
  year: number
  variant?: string | null
  rangeKm?: number | null
  rangeCycle?: 'CLTC' | 'WLTP' | 'EPA' | 'NEDC' | string | null
  batteryKwh?: number | null
  subtitle?: string | null
  className?: string
}

export default function ProductTitle({
  brand,
  model,
  year,
  variant,
  rangeKm,
  rangeCycle,
  batteryKwh,
  subtitle,
  className,
}: ProductTitleProps) {
  const mainTitle = `${year} ${brand} ${model}`.trim()

  const specLine: string[] = []
  if (variant) specLine.push(variant)

  if (typeof rangeKm === 'number') {
    const rangeValue = `${rangeFormatter.format(rangeKm)} km${
      rangeCycle ? ` ${rangeCycle.toUpperCase()}` : ''
    }`
    specLine.push(rangeValue.trim())
  }

  if (typeof batteryKwh === 'number') {
    specLine.push(`${batteryFormatter.format(batteryKwh)} kWh`)
  }

  if (subtitle) {
    specLine.push(subtitle)
  }

  const subtitleText = specLine.join(' • ')

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2 text-center',
        className
      )}
    >
      <div className="relative flex flex-col items-center">
        <h1 className="relative text-[clamp(1.9rem,1.7rem+1vw,2.5rem)] font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))] bg-clip-text text-transparent">
          {mainTitle}
        </h1>
      </div>
      {subtitleText && (
        <p className="text-[0.75rem] font-semibold tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          {subtitleText}
        </p>
      )}
    </div>
  )
}
