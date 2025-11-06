import React from 'react'

export type SellerType = 'AGENCY' | 'DEALER' | 'IMPORTER'

export interface SellerCardProps {
  type: SellerType
  label: string
  seller: {
    name: string
    logo?: string
  }
  amount: number
  currency: 'USD'
  availabilityBadge?: {
    label: string
    tone?: 'neutral' | 'info' | 'success' | 'warning'
  }
  financing?: {
    downPayment: number
    monthlyPayment: number
    termMonths: number
    displayCurrency: 'USD'
  }
  cta?: {
    label: string
    href: string
  }
  perks?: string[]
  emphasis?: 'teal-border' | 'none'
}

export function SellerCard({
  type,
  label,
  seller,
  amount,
  currency,
  availabilityBadge,
  financing,
  cta,
  perks,
  emphasis
}: SellerCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{type}</p>
      <p className="font-semibold">{label}</p>
      <p className="text-lg font-bold">{currency} ${amount.toLocaleString()}</p>
      {/* TODO: Implement full seller card UI */}
    </div>
  )
}
