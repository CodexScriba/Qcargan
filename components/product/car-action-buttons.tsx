'use client'

import React from 'react'

export interface CarActionButtonsProps {
  vehicleId: string
  contactHref?: string
  contactLabel?: string
  shareUrl?: string
  shareText?: string
  shareLabel?: string
  copiedLabel?: string
}

export function CarActionButtons({
  contactHref,
  contactLabel = 'Contactar',
  shareUrl,
  shareText,
  shareLabel = 'Compartir',
  copiedLabel = 'Enlace copiado',
}: CarActionButtonsProps) {
  const [copied, setCopied] = React.useState(false)

  const urlToShare = shareUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined)
  const textToShare = shareText ?? 'Descubre este vehículo en QuéCargan'

  const handleShare = React.useCallback(async () => {
    if (!urlToShare) return

    try {
      if (navigator.share) {
        await navigator.share({ title: textToShare, url: urlToShare })
        return
      }

      await navigator.clipboard.writeText(urlToShare)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.warn('Failed to share vehicle', error)
    }
  }, [textToShare, urlToShare])

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <a
        href={contactHref ?? '#contact'}
        className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {contactLabel}
      </a>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
      >
        {copied ? copiedLabel : shareLabel}
      </button>
    </div>
  )
}
