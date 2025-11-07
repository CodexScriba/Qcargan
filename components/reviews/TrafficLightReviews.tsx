"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { TrafficLight, type SentimentColor } from './TrafficLight'

export interface TrafficLightReviewsProps {
  positive?: number | null
  neutral?: number | null
  negative?: number | null
  total?: number | null
  placeholder?: boolean
  isLoading?: boolean
  updatedAt?: string | Date | null
  className?: string
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

export function TrafficLightReviews({
  positive,
  neutral,
  negative,
  total,
  placeholder,
  isLoading,
  updatedAt,
  className,
}: TrafficLightReviewsProps) {
  const [activeLamp, setActiveLamp] = React.useState<SentimentColor>('green')

  const counts = {
    positive: Math.max(0, positive ?? 0),
    neutral: Math.max(0, neutral ?? 0),
    negative: Math.max(0, negative ?? 0),
  }

  const computedTotal =
    typeof total === 'number'
      ? total
      : counts.positive + counts.neutral + counts.negative

  const hasData = computedTotal > 0
  const showSkeleton = isLoading || (!placeholder && !hasData)

  const sentiments = [
    {
      key: 'positive' as const,
      label: 'Positive',
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      border: 'border-emerald-200/70',
      accent: 'text-emerald-600',
    },
    {
      key: 'neutral' as const,
      label: 'Neutral',
      gradient: 'from-amber-300 via-amber-400 to-amber-500',
      border: 'border-amber-200/70',
      accent: 'text-amber-600',
    },
    {
      key: 'negative' as const,
      label: 'Negative',
      gradient: 'from-rose-400 via-rose-500 to-rose-600',
      border: 'border-rose-200/70',
      accent: 'text-rose-600',
    },
  ]

  const summaryText = showSkeleton
    ? 'Sentiment data is being prepared.'
    : placeholder
      ? 'Verified owner reviews are coming soon.'
      : hasData
        ? `Based on ${computedTotal} owner review${computedTotal === 1 ? '' : 's'}.`
        : 'Sentiment data is not available for this vehicle yet.'

  return (
    <section
      className={cn(
        'grid gap-6 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-sm lg:grid-cols-[2fr_1fr]',
        className
      )}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Owner sentiment</h3>
        <p className="text-sm text-muted-foreground">{summaryText}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {sentiments.map((sentiment) => {
            const percent = hasData
              ? Math.min(
                  100,
                  (counts[sentiment.key] / computedTotal) * 100
                )
              : 0
            return (
              <div
                key={sentiment.key}
                className={cn(
                  'flex flex-col gap-2 rounded-2xl border bg-gradient-to-b p-4 text-sm text-white',
                  sentiment.gradient,
                  sentiment.border
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  {sentiment.label}
                </p>
                {showSkeleton ? (
                  <Skeleton className="h-7 w-16 bg-white/40" />
                ) : (
                  <p className="text-2xl font-bold leading-none">
                    {hasData ? `${percentFormatter.format(percent)}%` : '--'}
                  </p>
                )}
                <div className="h-1.5 w-full rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white/90 transition-all"
                    style={{ width: `${showSkeleton ? 0 : percent}%` }}
                  />
                </div>
                {!showSkeleton && hasData && (
                  <span className="text-xs opacity-80">
                    {counts[sentiment.key]} reviews
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/70 p-4">
        <TrafficLight activeColor={activeLamp} onChange={setActiveLamp} />
        <p className="text-center text-sm text-muted-foreground">
          {placeholder
            ? 'We are gathering the first verified owner stories for this model.'
            : hasData
              ? `Tap a color to explore ${activeLamp} feedback once reviews launch.`
              : 'Traffic light filters activate once reviews are published.'}
        </p>
        {updatedAt && !placeholder && (
          <p className="text-xs text-muted-foreground">
            Last updated {new Date(updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </section>
  )
}

export default TrafficLightReviews
