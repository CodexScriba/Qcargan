import React from 'react'
import { Link } from '@/i18n/routing'
import type { AppHref } from '@/i18n/routing'

export interface SeeAllSellersCardProps {
  href: AppHref
  optionsCount: number
  label: string
}

export function SeeAllSellersCard({ href, optionsCount, label }: SeeAllSellersCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-6 text-center transition-colors hover:border-primary hover:bg-muted/80"
    >
      <p className="text-lg font-semibold text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{optionsCount}</p>
    </Link>
  )
}
