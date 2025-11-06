"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { ArrowRight, ChevronDown, Shield, Calendar, Battery } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AgencyActions } from "@/components/agency"

interface AgencyCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  seller?: {
    name: string
    official?: boolean
    badges?: string[]
  }
  amount: number
  currency: 'USD'
  financing?: {
    showMonthly: boolean
    termMonths: number
    aprPercent: number
    displayCurrency: 'USD'
  }
  cta?: {
    contactPath: string | null
    detailsPath: string | null
  }
  emphasis?: 'teal-border' | 'teal-glow' | 'none'
}

const AgencyCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  AgencyCardProps
>(({ className, seller, amount, currency, financing, cta, emphasis = 'none', ...props }, ref) => {
  const t = useTranslations('agencyCard')
  const [isExpanded, setIsExpanded] = React.useState(false)

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

  const monthlyPayment = financing?.showMonthly && financing.termMonths > 0 
    ? Math.round(amount / financing.termMonths)
    : null

  const formattedMonthlyPayment = monthlyPayment 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: financing?.displayCurrency || 'USD',
        maximumFractionDigits: 0,
      }).format(monthlyPayment)
    : null

  const emphasisClass =
    emphasis === 'teal-border'
      ? 'border-2 border-teal-400/70 ring-2 ring-teal-300/40'
      : emphasis === 'teal-glow'
      ? 'ring-1 ring-teal-300/30 shadow-[0_10px_40px_-10px_rgba(13,148,136,0.35)]'
      : ''

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <AgencyActions />
      </div>
      
      <Card
        ref={ref}
        className={cn("w-full pt-4 pb-1 sm:pt-5 sm:pb-2 transition-shadow", emphasisClass, className)}
        {...props}
      >
      <CardContent className="space-y-2">
        {seller?.name && (
          <div>
            <h3 className="font-semibold leading-none text-sm truncate">{seller.name}</h3>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="text-xl sm:text-2xl font-bold leading-none tracking-tight text-[hsl(var(--primary))]">
            {formattedPrice}
          </div>
          {formattedMonthlyPayment && (
            <div className="text-[hsl(var(--muted-foreground))] text-xs sm:text-sm whitespace-nowrap">
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

        <div className="flex items-center gap-2 sm:justify-between flex-nowrap overflow-x-auto mt-5">
          <Badge
            variant="secondary"
            className="bg-[hsl(var(--primary))] text-white"
          >
            <Shield className="mr-1 size-3.5 text-[hsl(var(--accent))]" />
            Official agency
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--muted))] text-white">
            <Calendar className="mr-1 size-3.5 text-[hsl(var(--accent))]" />
            5y warranty
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--muted))] text-white">
            <Battery className="mr-1 size-3.5 text-[hsl(var(--success))]" />
            8y battery
          </Badge>
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
            <ChevronDown
              className={cn("transition-transform", isExpanded && "rotate-180")}
            />
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
    </div>
  )
})

AgencyCard.displayName = "AgencyCard"

export { AgencyCard }
