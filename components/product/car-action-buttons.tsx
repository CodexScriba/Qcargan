'use client'

import { useCallback, useMemo, useState } from 'react'
import { PhoneCall, Share2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/agency/favorite-button'
import { CompareButton } from '@/components/agency/compare-button'

type SellerContact = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
}

type PrimaryCta = {
  href: string
  label?: string | null
}

export interface CarActionButtonsProps {
  vehicleId: string
  vehicleSlug: string
  brand: string
  model: string
  year: number
  variant?: string | null
  primarySellerContact?: SellerContact | null
  primaryCta?: PrimaryCta | null
  showFavorites?: boolean
  showCompare?: boolean
  showShare?: boolean
  className?: string
  onContactSeller?: (vehicleId: string) => void
  onShareSuccess?: (method: 'native' | 'clipboard') => void
  onShareError?: (error: Error) => void
}

const sanitizeDialString = (value?: string | null) => {
  if (!value) return null
  const cleaned = value.replace(/[^+\d]/g, '')
  return cleaned.length ? cleaned : null
}

const formatWhatsAppNumber = (value?: string | null) => {
  if (!value) return null
  const cleaned = value.replace(/\D/g, '')
  return cleaned.length ? cleaned : null
}

const buildMailtoLink = (
  email: string | null | undefined,
  subject: string,
  body: string
) => {
  const recipient = email ?? ''
  return `mailto:${recipient}?subject=${subject}&body=${body}`
}

const copyTextToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined') {
    throw new Error('Clipboard unavailable')
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard unavailable')
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function CarActionButtons({
  vehicleId,
  vehicleSlug,
  brand,
  model,
  year,
  variant,
  primarySellerContact,
  primaryCta,
  showFavorites = true,
  showCompare = true,
  showShare = true,
  className,
  onContactSeller,
  onShareSuccess,
  onShareError,
}: CarActionButtonsProps) {
  const locale = useLocale()
  const t = useTranslations('vehicle')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isComparing, setIsComparing] = useState(false)

  const localizedVehiclePath = useMemo(() => {
    // Build localized vehicle path manually to avoid getPathname type complexity
    return locale === 'es'
      ? `/vehiculos/${vehicleSlug}`
      : `/en/vehicles/${vehicleSlug}`
  }, [locale, vehicleSlug])

  const vehicleDisplayName = useMemo(() => {
    const parts = [year, brand, model, variant].filter(Boolean)
    return parts.join(' ')
  }, [brand, model, variant, year])

  const buildShareUrl = useCallback(() => {
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}${localizedVehiclePath}`
    }
    return localizedVehiclePath
  }, [localizedVehiclePath])

  const handleShare = useCallback(async () => {
    try {
      const shareUrl = buildShareUrl()
      const shareText = t('share.text', { brand, model, year })
      const shareTitle = vehicleDisplayName

      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          })
          toast.success(t('share.success'))
          onShareSuccess?.('native')
          return
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            return
          }
          throw error
        }
      }

      await copyTextToClipboard(shareUrl)
      toast.success(t('share.copiedToClipboard'))
      onShareSuccess?.('clipboard')
    } catch (error) {
      toast.error(t('share.error'))
      if (error instanceof Error) {
        onShareError?.(error)
      } else {
        onShareError?.(new Error('Share failed'))
      }
    }
  }, [brand, buildShareUrl, model, onShareError, onShareSuccess, t, vehicleDisplayName, year])

  const handleContactSeller = useCallback(() => {
    if (typeof window === 'undefined') return

    const shareUrl = buildShareUrl()
    const whatsappMessage = t('contact.whatsappMessage', {
      brand,
      model,
      year,
      url: shareUrl,
    })
    const emailSubject = encodeURIComponent(
      t('contact.emailSubject', { brand, model, year })
    )
    const emailBody = encodeURIComponent(
      t('contact.emailBody', { brand, model, year, url: shareUrl })
    )

    const whatsappNumber =
      formatWhatsAppNumber(primarySellerContact?.whatsapp) ??
      formatWhatsAppNumber(primarySellerContact?.phone)
    const phoneNumber = sanitizeDialString(primarySellerContact?.phone)

    let targetUrl = primaryCta?.href?.trim()

    if (!targetUrl && whatsappNumber) {
      targetUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    } else if (!targetUrl && phoneNumber) {
      targetUrl = `tel:${phoneNumber}`
    } else if (!targetUrl) {
      targetUrl = buildMailtoLink(
        primarySellerContact?.email,
        emailSubject,
        emailBody
      )
    }

    if (!targetUrl) return

    if (targetUrl.startsWith('http')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = targetUrl
    }

    onContactSeller?.(vehicleId)
  }, [
    brand,
    buildShareUrl,
    model,
    onContactSeller,
    primaryCta,
    primarySellerContact,
    t,
    vehicleId,
    year,
  ])

  const hasSecondaryActions = showFavorites || showCompare

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/70',
        className
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          size="lg"
          className="flex-1 h-12 text-base font-semibold"
          onClick={handleContactSeller}
        >
          <PhoneCall className="size-4" aria-hidden="true" />
          <span>{primaryCta?.label ?? t('actions.contactSeller')}</span>
        </Button>

        {showShare && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-12 flex-1 border-border/70 text-foreground sm:w-auto"
            onClick={handleShare}
          >
            <Share2 className="size-4" aria-hidden="true" />
            <span>{t('actions.share')}</span>
          </Button>
        )}
      </div>

      {hasSecondaryActions && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {showFavorites && (
            <FavoriteButton
              className="flex-1"
              isActive={isFavorite}
              onToggle={() => setIsFavorite((prev) => !prev)}
            />
          )}

          {showCompare && (
            <CompareButton
              className="flex-1"
              isActive={isComparing}
              onToggle={() => setIsComparing((prev) => !prev)}
            />
          )}
        </div>
      )}
    </div>
  )
}
