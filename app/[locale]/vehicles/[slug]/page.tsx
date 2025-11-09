import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getVehicleBySlug } from '@/lib/db/queries/vehicles'
import { getBanks } from '@/lib/db/queries/banks'
import { buildVehicleMetadata, buildVehicleStructuredData } from '@/lib/seo/vehicle'
import ProductTitle from '@/components/product/product-title'
import { SellerCard } from '@/components/product/seller-card'
import VehicleAllSpecs from '@/components/product/vehicle-all-specs'
import TrafficLightReviews from '@/components/reviews/TrafficLightReviews'
import ServicesShowcase from '@/components/product/services-showcase'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import FinancingTabs from '@/components/banks/FinancingTabs'
import type { VehicleDetail } from '@/types/vehicle'

interface PageProps {
  params: Promise<{
    locale: 'es' | 'en'
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params
  
  const vehicle = await getVehicleBySlug(slug)
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | Qcargan',
      description: 'The requested vehicle could not be found.',
    }
  }

  const t = await getTranslations({ locale, namespace: 'seo.vehicleDetail' })
  
  return buildVehicleMetadata({
    vehicle,
    locale,
    translations: {
      titleTemplate: t.raw('titleTemplate') as string | undefined,
      descriptionTemplate: t.raw('descriptionTemplate') as string | undefined,
    },
  })
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  
  const vehicle: VehicleDetail | null = await getVehicleBySlug(slug)

  if (!vehicle) {
    notFound()
  }

  // Fetch banks for financing section
  const banks = await getBanks()

  const t = await getTranslations({ locale, namespace: 'vehicle' })
  
  const { brand, model, year, variant, specifications, media, pricing } = vehicle
  const primaryPricing = pricing[0] ?? null

  // Get primary range and cycle (prefer CLTC > WLTP > EPA)
  const rangeKm = specifications?.rangeKmCltc ?? specifications?.rangeKmWltp ?? specifications?.rangeKmEpa ?? null
  const rangeCycle = specifications?.rangeKmCltc ? 'CLTC' : specifications?.rangeKmWltp ? 'WLTP' : specifications?.rangeKmEpa ? 'EPA' : null

  // Generate structured data for SEO
  const structuredData = buildVehicleStructuredData(vehicle)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6">
          <ProductTitle
            brand={brand}
            model={model}
            year={year}
            variant={variant}
            rangeKm={rangeKm}
            rangeCycle={rangeCycle}
            batteryKwh={specifications?.batteryKwh}
          />

          {/* Image Carousel Placeholder */}
          <div className="rounded-3xl border border-border/60 bg-muted/30 overflow-hidden">
            {media.images.length > 0 ? (
              <div className="aspect-video relative">
                <img
                  src={media.images[media.heroIndex]?.url || media.images[0]?.url}
                  alt={media.images[media.heroIndex]?.altText || `${year} ${brand} ${model}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <CarActionButtons
            vehicleId={vehicle.id}
            vehicleSlug={vehicle.slug}
            brand={brand}
            model={model}
            year={year}
            variant={variant}
            primarySellerContact={primaryPricing?.organization.contact}
            primaryCta={primaryPricing?.cta ?? undefined}
          />
        </section>

        {/* Key Specifications - TODO: Add KeySpecification component integration */}
        {specifications && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card/95 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Range</p>
              <p className="text-2xl font-bold">{specifications.rangeKmCltc} km</p>
              <p className="text-xs text-muted-foreground">CLTC</p>
            </div>
            {specifications.batteryKwh && (
              <div className="rounded-xl border border-border/60 bg-card/95 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Battery</p>
                <p className="text-2xl font-bold">{specifications.batteryKwh} kWh</p>
              </div>
            )}
            {specifications.acceleration0To100Sec && (
              <div className="rounded-xl border border-border/60 bg-card/95 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">0-100 km/h</p>
                <p className="text-2xl font-bold">{specifications.acceleration0To100Sec}s</p>
              </div>
            )}
            {specifications.seats && (
              <div className="rounded-xl border border-border/60 bg-card/95 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Seats</p>
                <p className="text-2xl font-bold">{specifications.seats}</p>
              </div>
            )}
          </section>
        )}

        {/* Pricing Section */}
        {pricing.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {t('pricing.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('pricing.subtitle', { count: pricing.length })}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {pricing.map((priceEntry) => (
                <SellerCard
                  key={priceEntry.id}
                  seller={{
                    id: priceEntry.organization.id,
                    name: priceEntry.organization.name,
                    logo: priceEntry.organization.logoUrl,
                    type: priceEntry.organization.type,
                    official: priceEntry.organization.official,
                    badges: priceEntry.organization.badges,
                  }}
                  price={{
                    amount: priceEntry.amount,
                    currency: priceEntry.currency,
                  }}
                  availability={priceEntry.availability}
                  financing={priceEntry.financing}
                  cta={priceEntry.cta}
                  perks={priceEntry.perks}
                  emphasis={priceEntry.emphasis}
                />
              ))}
            </div>
          </section>
        )}

        {/* Financing Section */}
        {banks.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">
                {t('financing.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('financing.subtitle')}
              </p>
            </div>

            <FinancingTabs
              banks={banks.map((bank) => ({
                id: bank.id,
                name: bank.name,
                logo: bank.logoUrl,
                aprMin: bank.typicalAprMin,
                aprMax: bank.typicalAprMax,
                terms: bank.typicalTermMonths,
                websiteUrl: bank.websiteUrl,
                contactPhone: bank.contactPhone,
                contactEmail: bank.contactEmail,
                description: bank.description,
              }))}
            />
          </section>
        )}

        {/* Full Specifications */}
        {specifications && (
          <VehicleAllSpecs
            brand={brand}
            model={model}
            year={year}
            variant={variant}
            specifications={{
              rangeKmCltc: specifications.rangeKmCltc,
              rangeKmWltp: specifications.rangeKmWltp,
              rangeKmEpa: specifications.rangeKmEpa,
              rangeKmNedc: specifications.rangeKmNedc,
              batteryKwh: specifications.batteryKwh,
              acceleration0To100Sec: specifications.acceleration0To100Sec,
              topSpeedKmh: specifications.topSpeedKmh,
              powerKw: specifications.powerKw,
              powerHp: specifications.powerHp,
              chargingDcKw: specifications.chargingDcKw,
              chargingTimeDcMin: specifications.chargingTimeDcMin,
              seats: specifications.seats,
              weightKg: specifications.weightKg,
              bodyType: specifications.bodyType,
            }}
          />
        )}

        {/* Reviews Section */}
        <TrafficLightReviews
          placeholder
          positive={null}
          neutral={null}
          negative={null}
        />

        {/* Services Showcase */}
        <ServicesShowcase />
      </div>
    </>
  )
}
