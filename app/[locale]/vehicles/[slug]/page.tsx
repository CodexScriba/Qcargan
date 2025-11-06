import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getVehicleBySlug } from '@/lib/db/queries/vehicles'
import ProductTitle, { type ProductTitleVehicle } from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { SellerCard } from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import VehicleAllSpecs, { type VehicleSpecificationsDisplay } from '@/components/product/vehicle-all-specs'
import type { AppHref } from '@/i18n/routing'

interface PageProps {
  params: { locale: string; slug: string } | Promise<{ locale: string; slug: string }>
}

async function resolveParams<T>(value: T | Promise<T>): Promise<T> {
  return value && typeof (value as any).then === 'function'
    ? await (value as Promise<T>)
    : (value as T)
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await resolveParams(params)

  const vehicleData = await getVehicleBySlug(slug)
  if (!vehicleData) {
    return { title: 'Vehicle Not Found' }
  }

  const { vehicle, specifications } = vehicleData
  const t = await getTranslations({ locale, namespace: 'vehicle' })

  // Build title
  const variantText = vehicle.variant ? ` ${vehicle.variant}` : ''
  const title = `${vehicle.year} ${vehicle.brand} ${vehicle.model}${variantText} | QuéCargan`

  // Build description
  const description = locale === 'es'
    ? vehicle.description || `Explora el ${vehicle.brand} ${vehicle.model} eléctrico en Costa Rica. ${specifications?.rangeKmCltc ? `Autonomía de ${specifications.rangeKmCltc} km` : ''}.`
    : (vehicle.descriptionI18n as any)?.en || `Explore the electric ${vehicle.brand} ${vehicle.model} in Costa Rica. ${specifications?.rangeKmCltc ? `Range of ${specifications.rangeKmCltc} km` : ''}.`

  // Canonical paths
  const canonicalPath = locale === 'es'
    ? `/vehicles/${slug}`
    : `/en/vehicles/${slug}`

  // Get hero image
  const heroImage = (vehicle.media as any)?.images?.[0]?.url

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'es': `/vehicles/${slug}`,
        'en': `/en/vehicles/${slug}`,
      }
    },
    openGraph: {
      title,
      description,
      type: 'product' as const,
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      images: heroImage ? [{ url: heroImage }] : [],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: heroImage ? [heroImage] : [],
    }
  }
}

/**
 * Vehicle Detail Page
 */
export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await resolveParams(params)

  const vehicleData = await getVehicleBySlug(slug)
  if (!vehicleData) {
    notFound()
  }

  const { vehicle, specifications, images, pricing } = vehicleData
  const t = await getTranslations({ locale, namespace: 'vehicle' })
  const tAgency = await getTranslations({ locale, namespace: 'agencyCard' })

  const rangeTuple = (() => {
    if (!specifications) return null
    if (specifications.rangeKmWltp) return [Number(specifications.rangeKmWltp), 'WLTP'] as const
    if (specifications.rangeKmEpa) return [Number(specifications.rangeKmEpa), 'EPA'] as const
    if (specifications.rangeKmCltc) return [Number(specifications.rangeKmCltc), 'CLTC'] as const
    if (specifications.rangeKmNedc) return [Number(specifications.rangeKmNedc), 'NEDC'] as const
    return null
  })()

  const vehicleForTitle: ProductTitleVehicle = {
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    variant: vehicle.variant,
    rangeKm: rangeTuple?.[0],
    rangeMethod: rangeTuple?.[1] as ProductTitleVehicle['rangeMethod'],
    batteryKwh: specifications?.batteryKwh ? Number(specifications.batteryKwh) : undefined,
  }

  const carouselImages = images.length > 0
    ? images.map((img) => ({
        url: img.storagePath,
        alt: img.altText || `${vehicle.brand} ${vehicle.model}`,
      }))
    : Array.isArray((vehicle.media as any)?.images)
      ? ((vehicle.media as any).images as Array<{ url: string; alt?: string }>).map((img) => ({
          url: img.url,
          alt: img.alt || `${vehicle.brand} ${vehicle.model}`,
        }))
      : []

  const heroIndex = images.findIndex((img) => img.isHero)

  const specsData: VehicleSpecificationsDisplay | null = specifications
    ? {
        rangeKm: rangeTuple?.[0] ?? null,
        rangeMethod: rangeTuple?.[1] as VehicleSpecificationsDisplay['rangeMethod'],
        batteryKwh: specifications.batteryKwh ? Number(specifications.batteryKwh) : null,
        acceleration0100Sec: specifications.acceleration0100Sec ? Number(specifications.acceleration0100Sec) : null,
        topSpeedKmh: specifications.topSpeedKmh ?? null,
        powerKw: specifications.powerKw ?? null,
        powerHp: specifications.powerHp ?? null,
        chargingDcKw: specifications.chargingDcKw ?? null,
        chargingTimeDcMin: specifications.chargingTimeDcMin ?? null,
        seats: specifications.seats ?? null,
        weightKg: specifications.weightKg ?? null,
      }
    : null

  const seeAllSellersHref: AppHref = { pathname: '/vehicles' }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      {/* Hero Section */}
      <div className="rounded-3xl overflow-hidden bg-card">
        <div className="p-6 space-y-6">
          {/* Title */}
          <ProductTitle vehicle={vehicleForTitle} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Image Gallery - 2 columns on desktop */}
            <div className="lg:col-span-2">
              {carouselImages.length > 0 ? (
                <ImageCarousel
                  images={carouselImages}
                  initialIndex={heroIndex >= 0 ? heroIndex : 0}
                  className="w-full rounded-xl overflow-hidden"
                />
              ) : (
                <div className="w-full aspect-[16/9] bg-muted rounded-xl flex items-center justify-center">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </div>

            {/* Action Buttons & Quick Info - 1 column on desktop */}
            <div className="space-y-4">
              <CarActionButtons
                vehicleId={vehicle.id}
                contactHref={pricing[0]?.pricing.cta ? (pricing[0]?.pricing.cta as any).href : undefined}
                contactLabel={tAgency('contact')}
                shareText={`${vehicle.brand} ${vehicle.model}`}
                shareLabel={t('detail.share')}
                copiedLabel={t('detail.copyLinkConfirmation')}
              />

              {/* Key Specifications Cards */}
              {specifications && (
                <div className="grid grid-cols-2 gap-3">
                  {specifications.rangeKmCltc && (
                    <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                      <p className="text-xs text-muted-foreground">{t('specs.range')}</p>
                      <p className="text-lg font-semibold">{specifications.rangeKmCltc} km</p>
                      <p className="text-xs text-muted-foreground">CLTC</p>
                    </div>
                  )}

                  {specifications.batteryKwh && (
                    <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                      <p className="text-xs text-muted-foreground">{t('specs.battery')}</p>
                      <p className="text-lg font-semibold">{specifications.batteryKwh} kWh</p>
                    </div>
                  )}

                  {specifications.acceleration0100Sec && (
                    <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                      <p className="text-xs text-muted-foreground">{t('specs.acceleration')}</p>
                      <p className="text-lg font-semibold">{specifications.acceleration0100Sec} s</p>
                    </div>
                  )}

                  {specifications.seats && (
                    <div className="rounded-xl bg-muted/50 p-4 space-y-1">
                      <p className="text-xs text-muted-foreground">{t('specs.seats')}</p>
                      <p className="text-lg font-semibold">{specifications.seats}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {vehicle.description && (
        <div className="rounded-3xl overflow-hidden bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">{t('detail.overview')}</h2>
          <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
        </div>
      )}

      {/* Pricing & Sellers */}
      {pricing.length > 0 && (
        <div className="rounded-3xl overflow-hidden bg-card p-6">
          <h2 className="text-2xl font-bold mb-6">{t('detail.pricing')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pricing.map(({ pricing: pricingItem, organization }) => (
              <SellerCard
                key={pricingItem.id}
                seller={{
                  id: organization.id,
                  name: organization.name,
                  type: organization.type as any,
                  logoUrl: organization.logoUrl,
                  badges: organization.badges,
                  isOfficial: organization.official,
                }}
                pricing={{
                  amount: Number(pricingItem.amount),
                  currency: pricingItem.currency as 'USD' | 'CRC',
                  availability: pricingItem.availability
                    ? {
                        label: (pricingItem.availability as any).label,
                        tone: (pricingItem.availability as any).tone,
                      }
                    : undefined,
                  financing: pricingItem.financing
                    ? {
                        downPayment: (pricingItem.financing as any).downPayment ?? null,
                        monthlyPayment: (pricingItem.financing as any).monthlyPayment ?? null,
                        termMonths: (pricingItem.financing as any).termMonths ?? null,
                        currency: (pricingItem.financing as any).displayCurrency ?? pricingItem.currency,
                      }
                    : undefined,
                  cta: pricingItem.cta
                    ? {
                        label: (pricingItem.cta as any).label,
                        href: (pricingItem.cta as any).href,
                      }
                    : undefined,
                  perks: pricingItem.perks,
                  emphasis:
                    pricingItem.emphasis === 'teal-glow' || pricingItem.emphasis === 'teal-border'
                      ? (pricingItem.emphasis as 'teal-glow' | 'teal-border')
                      : undefined,
                }}
              />
            ))}

            {/* See All Sellers Card */}
            {pricing.length > 3 && (
              <SeeAllSellersCard
                href={seeAllSellersHref}
                optionsCount={pricing.length}
                label={t('detail.viewAllSellers')}
              />
            )}
          </div>
        </div>
      )}

      {/* Full Specifications */}
      {specifications && (
        <div className="rounded-3xl overflow-hidden bg-card p-6">
          <h2 className="text-2xl font-bold mb-6">{t('detail.specifications')}</h2>
          <VehicleAllSpecs
            vehicle={{
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              bodyType: specifications?.bodyType,
            }}
            specs={specsData}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Optional: Generate static params for seed vehicles
 * For Phase 1, return empty array for fully dynamic rendering
 */
export async function generateStaticParams() {
  // Phase 1: Fully dynamic - vehicles generated on-demand
  // Phase 2+: Pre-render seed vehicles at build time
  return []

  // Example for Phase 2+:
  // return [
  //   { locale: 'es', slug: 'byd-seagull-freedom-2025' },
  //   { locale: 'en', slug: 'byd-seagull-freedom-2025' },
  //   { locale: 'es', slug: 'tesla-model-3-long-range-2024' },
  //   { locale: 'en', slug: 'tesla-model-3-long-range-2024' },
  //   // ... more vehicles
  // ]
}
