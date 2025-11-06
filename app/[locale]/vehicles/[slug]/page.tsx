import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getVehicleBySlug } from '@/lib/db/queries/vehicles'
import ProductTitle from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { SellerCard } from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import { VehicleAllSpecs } from '@/components/product/vehicle-all-specs'

// Next.js 15/16: params is now a Promise
interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params

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
  const { locale, slug } = await params

  const vehicleData = await getVehicleBySlug(slug)
  if (!vehicleData) {
    notFound()
  }

  const { vehicle, specifications, images, pricing } = vehicleData
  const t = await getTranslations({ locale, namespace: 'vehicle' })
  const tAgency = await getTranslations({ locale, namespace: 'agencyCard' })

  // Transform vehicle data for ProductTitle component
  const vehicleForTitle = {
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    variant: vehicle.variant || '',
    range: specifications?.rangeKmCltc || null,
    rangeMethod: 'CLTC' as const,
    battery: specifications?.batteryKwh ? parseFloat(specifications.batteryKwh as string) : null,
  }

  // Transform images for ImageCarousel
  const carouselImages = images.length > 0
    ? images.map(img => ({
        url: img.storagePath,
        alt: img.altText || `${vehicle.brand} ${vehicle.model}`,
      }))
    : (vehicle.media as any)?.images || []

  const heroIndex = images.findIndex(img => img.isHero)

  // Transform specs for VehicleAllSpecs component
  const specsData = specifications ? {
    range: specifications.rangeKmCltc || undefined,
    rangeMethod: 'CLTC' as const,
    battery: specifications.batteryKwh ? parseFloat(specifications.batteryKwh as string) : undefined,
    acceleration: specifications.acceleration0100Sec ? parseFloat(specifications.acceleration0100Sec as string) : undefined,
    topSpeed: specifications.topSpeedKmh || undefined,
    power: specifications.powerHp || undefined,
    chargingDC: specifications.chargingDcKw || undefined,
    chargingTimeDC: specifications.chargingTimeDcMin || undefined,
    seats: specifications.seats || undefined,
    weight: specifications.weightKg || undefined,
  } : {}

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
              <CarActionButtons vehicleId={vehicle.id} />

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
            {pricing.map(({ pricing: pricingItem, organization }) => {
              const pricingData = {
                id: organization.id,
                name: organization.name,
                logo: organization.logoUrl,
                price: {
                  amount: parseFloat(pricingItem.amount as string),
                  currency: pricingItem.currency as 'USD' | 'CRC',
                },
                financing: pricingItem.financing ? {
                  downPayment: (pricingItem.financing as any).downPayment,
                  monthlyPayment: (pricingItem.financing as any).monthlyPayment,
                  termMonths: (pricingItem.financing as any).termMonths,
                  currency: (pricingItem.financing as any).displayCurrency,
                } : undefined,
                availability: pricingItem.availability ? {
                  label: (pricingItem.availability as any).label || 'Available',
                  tone: (pricingItem.availability as any).tone as 'neutral' | 'info' | 'success' | 'warning' || 'neutral',
                } : undefined,
                perks: pricingItem.perks || [],
                cta: pricingItem.cta ? {
                  label: (pricingItem.cta as any).label,
                  href: (pricingItem.cta as any).href,
                } : undefined,
                badges: organization.badges || [],
                isOfficial: organization.official || false,
                emphasis: (pricingItem.emphasis === 'teal-glow' || pricingItem.emphasis === 'teal-border')
                  ? pricingItem.emphasis as 'teal-glow' | 'teal-border'
                  : undefined,
              }

              return (
                <SellerCard
                  key={pricingItem.id}
                  seller={pricingData}
                />
              )
            })}

            {/* See All Sellers Card */}
            {pricing.length > 3 && (
              <SeeAllSellersCard
                count={pricing.length}
                vehicleSlug={slug}
              />
            )}
          </div>
        </div>
      )}

      {/* Full Specifications */}
      {specifications && (
        <div className="rounded-3xl overflow-hidden bg-card p-6">
          <h2 className="text-2xl font-bold mb-6">{t('detail.specifications')}</h2>
          <VehicleAllSpecs specs={specsData} vehicle={vehicle as any} />
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
