"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpRight, PercentCircle, Wallet } from 'lucide-react'

export interface BankTab {
  id: string
  name: string
  logo?: string | null
  aprMin?: number | null
  aprMax?: number | null
  terms?: number[] | null
  websiteUrl?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  description?: string | null
}

export interface FinancingTabsProps {
  banks: BankTab[]
  defaultValue?: string
  isLoading?: boolean
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

function formatAprRange(min?: number | null, max?: number | null) {
  if (typeof min === 'number' && typeof max === 'number') {
    if (min === max) return `${percentFormatter.format(min)}% APR`
    return `${percentFormatter.format(min)}% – ${percentFormatter.format(max)}% APR`
  }
  if (typeof min === 'number') return `${percentFormatter.format(min)}% APR`
  if (typeof max === 'number') return `${percentFormatter.format(max)}% APR`
  return null
}

function formatTerms(terms?: number[] | null) {
  if (!terms?.length) return null
  const sorted = [...terms].sort((a, b) => a - b)
  if (sorted.length === 1) return `${sorted[0]} months`
  return `${sorted[0]} – ${sorted[sorted.length - 1]} months`
}

export default function FinancingTabs({
  banks,
  defaultValue,
  isLoading,
}: FinancingTabsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    )
  }

  if (!banks?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        Financing partners will appear here once they are added to Supabase.
      </div>
    )
  }

  const initialValue = defaultValue ?? banks[0]?.id

  return (
    <Tabs defaultValue={initialValue} className="space-y-3">
      <TabsList>
        {banks.map((bank) => (
          <TabsTrigger key={bank.id} value={bank.id} className="gap-2 px-3">
            <Avatar className="size-6">
              {bank.logo ? (
                <AvatarImage src={bank.logo} alt={bank.name} />
              ) : (
                <AvatarFallback>{bank.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs font-medium uppercase tracking-wide">
              {bank.name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {banks.map((bank) => {
        const apr = formatAprRange(bank.aprMin, bank.aprMax)
        const terms = formatTerms(bank.terms)
        return (
          <TabsContent key={bank.id} value={bank.id} className="rounded-2xl border border-border/60 bg-card/95 p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {bank.logo ? (
                      <AvatarImage src={bank.logo} alt={bank.name} />
                    ) : (
                      <AvatarFallback>{bank.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold leading-tight">{bank.name}</p>
                    {bank.description && (
                      <p className="text-sm text-muted-foreground">{bank.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  {apr && (
                    <Badge variant="secondary" className="gap-1">
                      <PercentCircle className="size-4" />
                      {apr}
                    </Badge>
                  )}
                  {terms && (
                    <Badge variant="outline" className="gap-1">
                      <Wallet className="size-4" />
                      {terms}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                <p>
                  Speak with this bank to get pre-approved financing tailored to your EV purchase. Typical APR and term ranges are shown, but final offers depend on credit approval.
                </p>
                <div className="flex flex-wrap gap-2">
                  {bank.websiteUrl && (
                    <Button asChild size="sm">
                      <a href={bank.websiteUrl} target="_blank" rel="noreferrer">
                        Visit site
                        <ArrowUpRight className="ml-1 size-4" />
                      </a>
                    </Button>
                  )}
                  {bank.contactPhone && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`tel:${bank.contactPhone}`}>
                        Call {bank.contactPhone}
                      </a>
                    </Button>
                  )}
                  {bank.contactEmail && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`mailto:${bank.contactEmail}`}>
                        Email advisor
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
