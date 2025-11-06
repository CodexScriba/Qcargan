'use client'

import React from 'react'

export interface Bank {
  id: string
  name: string
  logo?: string
  rates?: {
    apr: number
    term: number
  }
}

export interface FinancingTabsProps {
  banks: Bank[]
}

export default function FinancingTabs({ banks }: FinancingTabsProps) {
  return (
    <div className="space-y-2">
      {banks.map((bank) => (
        <div key={bank.id} className="p-3 border rounded-lg">
          <p className="font-medium">{bank.name}</p>
          {/* TODO: Implement full financing tabs UI */}
        </div>
      ))}
    </div>
  )
}
