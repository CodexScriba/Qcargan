'use client'

import { useState } from 'react'
import { Share2, Heart, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type VehicleHeaderProps = {
  brand: string
  model: string
  year: number
  variant?: string | null
  bodyType?: 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'
  shareUrl?: string
}

export function VehicleHeader({
  brand,
  model,
  year,
  variant,
  bodyType,
  shareUrl
}: VehicleHeaderProps) {
  const t = useTranslations('vehicles')
  const tShare = useTranslations('vehicles.share')
  const tBodyType = useTranslations('vehicles.bodyType')

  const [isFavorite, setIsFavorite] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const vehicleTitle = `${year} ${brand} ${model}`
  const fullTitle = variant ? `${vehicleTitle} ${variant}` : vehicleTitle

  async function handleShare() {
    const url = shareUrl ?? window.location.href
    const shareText = tShare('text', { brand, model, year: year.toString() })

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: fullTitle,
          text: shareText,
          url
        })
        setShareStatus('copied')
        setTimeout(() => setShareStatus('idle'), 2000)
      } catch (err) {
        // User cancelled or error - fall back to clipboard
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(url)
        }
      }
    } else {
      // Fallback to clipboard
      await copyToClipboard(url)
    }
  }

  async function copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch {
      setShareStatus('error')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }

  function handleFavorite() {
    setIsFavorite(!isFavorite)
    // TODO: Persist favorite to user preferences / local storage
  }

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        {/* Body type badge */}
        {bodyType && (
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {tBodyType(bodyType)}
          </span>
        )}

        {/* Main title */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {vehicleTitle}
        </h1>

        {/* Variant subtitle */}
        {variant && (
          <p className="text-lg text-muted-foreground">{variant}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          {shareStatus === 'copied' ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="hidden sm:inline">{tShare('copiedToClipboard')}</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('actions.share')}</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFavorite}
          className={cn(
            'gap-2',
            isFavorite && 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900'
          )}
        >
          <Heart
            className={cn('h-4 w-4', isFavorite && 'fill-current')}
          />
          <span className="hidden sm:inline">
            {isFavorite
              ? t('actions.removeFromFavorites')
              : t('actions.addToFavorites')}
          </span>
        </Button>
      </div>
    </header>
  )
}
