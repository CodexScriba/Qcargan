import React from 'react'

export interface VehicleLike {
  brand: string
  model: string
  year: number
  specs: {
    range?: { value: number; method: string }
    battery?: { kWh: number | null }
    power?: { hp: number; kW: number }
    torque?: { nm: number; lbft: number }
    zeroTo100?: number
    topSpeed?: number
    charging?: {
      dc?: { kW: number; time: string }
      ac?: { kW: number; time: string }
    }
    dimensions?: {
      length: number
      width: number
      height: number
      wheelbase: number
    }
    weight?: number
  }
}

export interface VehicleAllSpecsProps {
  vehicle: VehicleLike
}

export default function VehicleAllSpecs({ vehicle }: VehicleAllSpecsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Technical Specifications</h3>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Brand</span>
          <span className="font-medium">{vehicle.brand}</span>
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{vehicle.model}</span>
          <span className="text-muted-foreground">Year</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        {/* TODO: Implement full specs accordion UI */}
      </div>
    </div>
  )
}
