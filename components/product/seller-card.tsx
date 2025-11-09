"use client"

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, ChevronDown, Shield, Calendar, Battery } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SellerInfo {
  name: string
  official?: boolean
  badges?: string[]
}

type SellerType = 'AGENCY' | 'DEALER' | 'IMPORTER'

interface SellerBadge {
  label: string
  tone?: 'neutral' | 'info' | 'success' | 'warning'
}

interface Financing {
  showMonthly: boolean
  termMonths: number
  aprPercent: number
  displayCurrency: 'USD'
}

interface SellerCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  type: SellerType
  label?: string
  seller?: SellerInfo
  amount: number
  currency: 'USD'
  availabilityBadge?: SellerBadge
  financing?: Financing
  cta?: {
    contactPath: string | null
    detailsPath: string | null
  }
  perks?: string[]
  // Visual emphasis for priority placements
  emphasis?: 'teal-border' | 'teal-glow' | 'none'
}

const DEFAULT_PERKS = ['Verified', '5y warranty', '8y battery']

const SellerCard = React.forwardRef<React.ElementRef<typeof Card>, SellerCardProps>(
  (
    {
      className,
      type: _type, // reserved for future variant behavior
      label: _label, // eslint-disable-line @typescript-eslint/no-unused-vars
      seller,
      amount,
      currency,
      availabilityBadge,
      financing,
      cta,
      perks,
      emphasis = 'none',
      ...props
    },
    ref
  ) => {
    const t = useTranslations('sellerCard')
    const [isExpanded, setIsExpanded] = React.useState(false)

    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount)

    const monthlyPayment = financing?.showMonthly && financing.termMonths > 0
      ? Math.round(amount / financing.termMonths)
      : null

    const formattedMonthlyPayment = monthlyPayment
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: financing?.displayCurrency || 'USD',
          maximumFractionDigits: 0
        }).format(monthlyPayment)
      : null

    const isAgency = _type === 'AGENCY'
    const defaultPerks = isAgency
      ? ['Official agency', '5y warranty', '8y battery']
      : DEFAULT_PERKS
    const perkItems = (perks?.length ? perks : defaultPerks).slice(0, 3)

    const emphasisClass =
      emphasis === 'teal-border'
        ? 'border-2 border-[hsl(var(--brand)/0.75)] ring-2 ring-[hsl(var(--brand)/0.35)] shadow-[0_0_0_1px_hsl(var(--brand)/0.25)]'
        : emphasis === 'teal-glow'
        ? 'ring-1 ring-[hsl(var(--accent)/0.38)] shadow-[0_24px_48px_-20px_hsl(var(--primary)/0.35)]'
        : ''

    return (
      <Card ref={ref} className={cn('w-full pt-4 pb-1 sm:pt-5 sm:pb-2 transition-shadow', emphasisClass, className)} {...props}>
        <CardContent className="space-y-2">
          {/* Seller name + availability */}
          {(seller?.name || availabilityBadge?.label) && (
            <div className="flex items-center gap-2">
              {seller?.name && (
                <h3 className="font-semibold leading-none text-sm truncate">{seller.name}</h3>
              )}
              {availabilityBadge?.label && (
                <Badge variant="secondary" className="ml-auto bg-[hsl(var(--badge-secondary-bg))] text-[hsl(var(--foreground))]">
                  {availabilityBadge.label}
                </Badge>
              )}
            </div>
          )}

          {/* Price + monthly + contact CTA */}
          <div className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold leading-none tracking-tight text-[hsl(var(--price-primary))] drop-shadow-[0_0_12px_hsl(var(--price-glow))]">
              {formattedPrice}
            </div>
            {formattedMonthlyPayment && (
              <div className="text-[hsl(var(--price-accent))] text-xs sm:text-sm whitespace-nowrap font-medium">
                {formattedMonthlyPayment}/month
              </div>
            )}
            {cta?.contactPath && (
              <Button size="sm" className="ml-auto bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" asChild>
                <a href={cta.contactPath} aria-label={t('contact')} className="inline-flex items-center gap-1.5">
                  {t('contact')}
                  <span className="inline-flex items-center justify-center size-5 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--primary))]">
                    <ArrowRight className="size-3.5" />
                  </span>
                </a>
              </Button>
            )}
          </div>

          {/* Perks */}
          <div className="flex flex-wrap items-center gap-2 sm:justify-between mt-5">
            {perkItems.map((p, idx) => {
              const isPrimaryPerk = idx === 0 && isAgency
              const badgeClass = isPrimaryPerk
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'bg-[hsl(var(--badge-secondary-bg))] text-[hsl(var(--foreground))]'
              const iconColor = isPrimaryPerk
                ? 'text-[hsl(var(--neon-charge))]'
                : 'text-[hsl(var(--price-accent))]'
              return (
                <Badge key={idx} variant="secondary" className={cn(badgeClass, 'whitespace-nowrap')}>
                  {idx === 0 && <Shield className={cn('mr-1 size-3.5', iconColor)} />}
                  {idx === 1 && <Calendar className={cn('mr-1 size-3.5', iconColor)} />}
                  {idx === 2 && <Battery className={cn('mr-1 size-3.5', iconColor)} />}
                  {p}
                </Badge>
              )
            })}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-start gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              aria-expanded={isExpanded}
            >
              {t('details')}
              <ChevronDown className={cn('transition-transform', isExpanded && 'rotate-180')} />
            </Button>
          </div>

          {isExpanded && (
            <div className="pt-2 border-t text-muted-foreground">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>✓ 0 km delivery</div>
                <div>✓ Official warranty</div>
                <div>✓ Service & parts</div>
                <div>✓ Bank financing</div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    )
  }
)

SellerCard.displayName = 'SellerCard'

export { SellerCard }
