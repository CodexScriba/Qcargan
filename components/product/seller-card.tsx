"use client"

import React from 'react'
import { CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import type {
  VehicleAvailability,
  VehicleFinancing,
  VehicleCta,
} from '@/lib/db/schema/vehicle-pricing'

export type SellerType = 'AGENCY' | 'DEALER' | 'IMPORTER'

export interface SellerSummary {
  id: string
  name: string
  logo?: string | null
  type: SellerType
  official?: boolean
  badges?: string[] | null
}

type AvailabilityLike = VehicleAvailability & {
  estimatedDeliveryDays?: number | null
}

type FinancingLike = VehicleFinancing & {
  downPayment?: number | null
  monthlyPayment?: number | null
  termMonths?: number | null
  aprPercent?: number | null
  displayCurrency?: VehicleFinancing['display_currency']
}

export interface SellerCardProps {
  seller: SellerSummary
  price: {
    amount: number
    currency: 'USD' | 'CRC'
    label?: string
  }
  availability?: AvailabilityLike | null
  financing?: FinancingLike | null
  cta?: VehicleCta | null
  perks?: string[] | null
  emphasis?: 'none' | 'teal-border' | 'teal-glow'
  className?: string
}

const availabilityToneMap: Record<
  NonNullable<VehicleAvailability['tone']> | 'neutral',
  string
> = {
  success: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  warning: 'text-amber-700 bg-amber-50 border-amber-200',
  info: 'text-sky-700 bg-sky-50 border-sky-200',
  danger: 'text-rose-700 bg-rose-50 border-rose-200',
  neutral: 'text-slate-600 bg-slate-100 border-slate-200',
}

const typeLabelMap: Record<SellerType, string> = {
  AGENCY: 'Official Agency',
  DEALER: 'Dealer',
  IMPORTER: 'Importer',
}

const emphasisClassMap: Record<NonNullable<SellerCardProps['emphasis']>, string> = {
  none: '',
  'teal-border': 'border-teal-300/80 shadow-[0px_10px_35px_rgba(45,212,191,0.25)]',
  'teal-glow':
    'border-teal-400 shadow-[0_20px_55px_rgba(45,212,191,0.3)] ring-2 ring-teal-300/60',
}

const currencyFormatters = new Map<string, Intl.NumberFormat>()

function formatCurrency(amount: number, currency: 'USD' | 'CRC') {
  if (!currencyFormatters.has(currency)) {
    currencyFormatters.set(
      currency,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'USD' ? 0 : 0,
        minimumFractionDigits: 0,
      })
    )
  }
  return currencyFormatters.get(currency)!.format(amount)
}

function normalizeFinancing(financing?: FinancingLike | null) {
  if (!financing) return null
  const {
    down_payment,
    monthly_payment,
    term_months,
    apr_percent,
    display_currency,
    downPayment,
    monthlyPayment,
    termMonths,
    aprPercent,
    displayCurrency,
  } = financing

  if (
    down_payment == null &&
    monthly_payment == null &&
    term_months == null &&
    apr_percent == null &&
    !display_currency &&
    downPayment == null &&
    monthlyPayment == null &&
    termMonths == null &&
    aprPercent == null &&
    !displayCurrency
  ) {
    return null
  }

  return {
    downPayment: (down_payment ?? downPayment) ?? undefined,
    monthlyPayment: (monthly_payment ?? monthlyPayment) ?? undefined,
    termMonths: (term_months ?? termMonths) ?? undefined,
    aprPercent: (apr_percent ?? aprPercent) ?? undefined,
    displayCurrency: (display_currency ?? displayCurrency) ?? undefined,
  }
}

function normalizeAvailability(availability?: AvailabilityLike | null) {
  if (!availability) return null
  const { label, tone, estimated_delivery_days, estimatedDeliveryDays } = availability
  const resolvedTone =
    (tone as keyof typeof availabilityToneMap | undefined) ?? 'info'
  const eta = estimated_delivery_days ?? estimatedDeliveryDays ?? null

  if (!label) return null

  return {
    label,
    tone: resolvedTone in availabilityToneMap ? resolvedTone : 'neutral',
    eta,
  }
}

function normalizePerks(perks?: string[] | null) {
  if (!perks?.length) return []
  return perks.filter(Boolean)
}

export function SellerCard({
  seller,
  price,
  availability,
  financing,
  cta,
  perks,
  emphasis = 'none',
  className,
}: SellerCardProps) {
  const normalizedFinancing = normalizeFinancing(financing)
  const normalizedAvailability = normalizeAvailability(availability)
  const perkList = normalizePerks(perks)

  return (
    <article
      data-slot="card"
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/95 p-5 shadow-sm transition-all',
        emphasisClassMap[emphasis],
        className
      )}
    >
      <header className="flex items-start gap-4">
        <Avatar className="size-12">
          {seller.logo ? (
            <AvatarImage src={seller.logo} alt={seller.name} />
          ) : (
            <AvatarFallback>{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold leading-tight">{seller.name}</p>
            {seller.official && (
              <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-[11px]">
                <ShieldCheck className="size-3 text-emerald-600" />
                Official
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="uppercase tracking-wide text-[10px]">
              {typeLabelMap[seller.type]}
            </Badge>
            {seller.badges?.map((badge) => (
              <span key={badge} className="rounded-full bg-muted px-2 py-0.5">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {price.label ?? 'Desde'}
          </p>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(price.amount, price.currency)}
          </p>
        </div>
        {normalizedAvailability && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
              availabilityToneMap[normalizedAvailability.tone ?? 'neutral']
            )}
          >
            {normalizedAvailability.label}
            {typeof normalizedAvailability.eta === 'number' && (
              <span className="text-xs font-normal text-muted-foreground">
                • {normalizedAvailability.eta} days
              </span>
            )}
          </span>
        )}
      </div>

      {normalizedFinancing && (
        <div className="rounded-xl border border-emerald-100/70 bg-emerald-50/70 p-4 text-sm text-emerald-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Financing preview
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            {typeof normalizedFinancing.monthlyPayment === 'number' && (
              <span className="text-base font-semibold">
                {formatCurrency(
                  normalizedFinancing.monthlyPayment,
                  (normalizedFinancing.displayCurrency as 'USD' | 'CRC') ?? price.currency
                )}
                <span className="text-sm font-normal"> /month</span>
              </span>
            )}
            {typeof normalizedFinancing.downPayment === 'number' && (
              <span className="text-sm text-emerald-800">
                Down {formatCurrency(normalizedFinancing.downPayment, price.currency)}
              </span>
            )}
            {typeof normalizedFinancing.termMonths === 'number' && (
              <span className="text-sm text-emerald-800">
                • {normalizedFinancing.termMonths} months
              </span>
            )}
            {typeof normalizedFinancing.aprPercent === 'number' && (
              <span className="text-sm text-emerald-800">
                • {normalizedFinancing.aprPercent}% APR
              </span>
            )}
          </div>
        </div>
      )}

      {perkList.length > 0 && (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {perkList.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      )}

      {cta?.href && (
        <Button asChild className="w-full">
          <a href={cta.href} target="_blank" rel="noreferrer">
            {cta.label ?? 'Contact seller'}
            <ArrowUpRight className="ml-1 size-4" />
          </a>
        </Button>
      )}
    </article>
  )
}

export default SellerCard
