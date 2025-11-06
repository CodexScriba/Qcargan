import React from 'react'
import { Link } from '@/i18n/routing'

export interface SeeAllSellersCardProps {
  href: React.ComponentProps<typeof Link>['href']
  optionsCount: number
}

export function SeeAllSellersCard({ href, optionsCount }: SeeAllSellersCardProps) {
  return (
    <Link href={href} className="block p-4 border rounded-lg text-center hover:bg-accent">
      <p className="font-semibold">See All {optionsCount} Sellers</p>
    </Link>
  )
}
