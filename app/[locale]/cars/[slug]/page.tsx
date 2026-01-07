import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getVehicleBySlug, getFeaturedBanks } from '@/lib/db/queries/vehicles'

// Components will be imported as we build them
// import { VehicleHeader } from '@/components/vehicles/vehicle-header'
// import { VehicleGallery } from '@/components/vehicles/vehicle-gallery'
// import { VehicleQuickSpecs } from '@/components/vehicles/vehicle-quick-specs'
// import { VehicleDetailedSpecs } from '@/components/vehicles/vehicle-detailed-specs'
// import { PricingCard } from '@/components/vehicles/pricing-card'
// import { SellerCard } from '@/components/vehicles/seller-card'
// import { FinancingSection } from '@/components/vehicles/financing-section'
// import { ReviewSummary } from '@/components/vehicles/review-summary'
// import { VehicleDescription } from '@/components/vehicles/vehicle-description'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found'
    }
  }

  const title = `${vehicle.year} ${vehicle.brand} ${vehicle.model}${vehicle.variant ? ` ${vehicle.variant}` : ''}`

  return {
    title,
    description: vehicle.description ?? `Explore the ${title} - specifications, pricing, and availability.`,
    openGraph: {
      title,
      description: vehicle.description ?? undefined,
      type: 'website'
    }
  }
}

export default async function CarListingPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('vehicles')

  // Fetch vehicle data and featured banks in parallel
  const [vehicle, featuredBanks] = await Promise.all([
    getVehicleBySlug(slug),
    getFeaturedBanks()
  ])

  if (!vehicle) {
    notFound()
  }

  const vehicleTitle = `${vehicle.year} ${vehicle.brand} ${vehicle.model}${vehicle.variant ? ` ${vehicle.variant}` : ''}`

  return (
    <main className="min-h-screen bg-background">
      {/* Page Container - max-w-7xl centered with responsive padding */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* TODO: Components will be integrated here as we build them */}

        {/* Temporary: Display vehicle data for verification */}
        <div className="space-y-8">
          {/* Header placeholder */}
          <section className="rounded-lg border bg-card p-6">
            <h1 className="text-3xl font-bold">{vehicleTitle}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('bodyType', { type: vehicle.specifications?.bodyType ?? '' })}
            </p>
          </section>

          {/* Two column layout for desktop */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Gallery, Specs, Description (2/3 width) */}
            <div className="space-y-8 lg:col-span-2">
              {/* Gallery placeholder */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Gallery</h2>
                <p className="text-muted-foreground">
                  {vehicle.images.length} images available
                </p>
              </section>

              {/* Quick Specs placeholder */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Quick Specs</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {vehicle.specifications?.rangeKmCltc ?? '—'} km
                    </p>
                    <p className="text-sm text-muted-foreground">{t('specs.range')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {vehicle.specifications?.batteryKwh ?? '—'} kWh
                    </p>
                    <p className="text-sm text-muted-foreground">{t('specs.battery')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {vehicle.specifications?.acceleration0To100Sec ?? '—'}s
                    </p>
                    <p className="text-sm text-muted-foreground">{t('specs.acceleration')}</p>
                  </div>
                </div>
              </section>

              {/* Detailed Specs placeholder */}
              <section className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Detailed Specifications</h2>
                <pre className="overflow-auto text-xs text-muted-foreground">
                  {JSON.stringify(vehicle.specifications, null, 2)}
                </pre>
              </section>

              {/* Description placeholder */}
              {vehicle.description && (
                <section className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Description</h2>
                  <p className="text-muted-foreground">{vehicle.description}</p>
                </section>
              )}
            </div>

            {/* Right column - Pricing, Sellers (1/3 width) */}
            <div className="space-y-6">
              {/* Pricing header */}
              <div>
                <h2 className="text-lg font-semibold">{t('pricing.title')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('pricing.subtitle', { count: vehicle.pricing.length })}
                </p>
              </div>

              {/* Seller cards placeholder */}
              {vehicle.pricing.map((pricing) => (
                <section
                  key={pricing.id}
                  className="rounded-lg border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pricing.organization.name}</span>
                    {pricing.organization.official && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Official
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    ${pricing.amount.toLocaleString()} {pricing.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pricing.availability.label ?? t('availability.contactForAvailability')}
                  </p>
                </section>
              ))}

              {vehicle.pricing.length === 0 && (
                <section className="rounded-lg border bg-card p-6 text-center">
                  <p className="text-muted-foreground">
                    {t('pricing.subtitle', { count: 0 })}
                  </p>
                </section>
              )}
            </div>
          </div>

          {/* Financing Section placeholder */}
          {featuredBanks.length > 0 && (
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">{t('financing.title')}</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('financing.subtitle')}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredBanks.map((bank) => (
                  <div key={bank.id} className="rounded-lg border p-4">
                    <p className="font-medium">{bank.name}</p>
                    <p className="text-sm text-muted-foreground">
                      APR: {bank.typicalAprMin}% - {bank.typicalAprMax}%
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews placeholder */}
          {vehicle.specifications?.sentimentPositivePercent !== null && (
            <section className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">{t('reviews.title')}</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {vehicle.specifications?.sentimentPositivePercent ?? 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">{t('reviews.positive')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">
                    {vehicle.specifications?.sentimentNeutralPercent ?? 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">{t('reviews.neutral')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {vehicle.specifications?.sentimentNegativePercent ?? 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">{t('reviews.negative')}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
