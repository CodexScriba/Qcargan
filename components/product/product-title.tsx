import React from 'react'

interface Vehicle {
  brand: string
  model: string
  year: number
  variant: string
  specs: {
    range: { value: number; method: string }
    battery: { kWh: number | null }
  }
}

interface ProductTitleProps {
  vehicle: Vehicle
}

export default function ProductTitle({ vehicle }: ProductTitleProps) {
  const { brand, model, year, variant, specs } = vehicle
  const { range, battery } = specs

  // Futuristic yet minimal headline with specs relegated to a single supporting line
  const mainTitle = `${year} ${brand} ${model}`

  const subtitleParts = [
    variant,
    `${range.value} km ${range.method}`,
    battery.kWh ? `${battery.kWh} kWh` : undefined,
  ].filter(Boolean)

  const subtitle = subtitleParts.join(' • ')

  return (
    <div className="relative flex flex-col items-center gap-2 text-center">
      <div className="relative flex flex-col items-center">
        <h1 className="relative text-[clamp(1.9rem,1.7rem+1vw,2.5rem)] font-bold leading-tight tracking-tight bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))] bg-clip-text text-transparent">
          {mainTitle}
        </h1>
      </div>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
        {subtitle}
      </p>
    </div>
  )
}
