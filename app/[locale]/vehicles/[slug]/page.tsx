import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getVehicleBySlug } from '@/lib/db/queries/vehicles'
import { getBanks } from '@/lib/db/queries/banks'
import { buildVehicleMetadata, buildVehicleStructuredData } from '@/lib/seo/vehicle'
import ProductTitle from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { ShowcaseCarousel, type ShowcaseItem } from '@/components/showcase'
import { SellerCard } from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import { CarActionButtons } from '@/components/product/hero-action-buttons'
import VehicleAllSpecs from '@/components/product/vehicle-all-specs'
import KeySpecification from '@/components/product/key-specification'
import { buildVehicleHeroSpecsInput } from '@/lib/vehicle/adapters'
import { toHeroSpecs } from '@/lib/vehicle/specs'
import { Navigation, Zap, Gauge, Timer, PlugZap, type LucideIcon } from 'lucide-react'
import { TrafficLightReviews } from '@/components/reviews'
import ServicesShowcase from '@/components/product/services-showcase'
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

  const vehicleData: VehicleDetail | null = await getVehicleBySlug(slug)

  if (!vehicleData) {
    notFound()
  }

  // Fetch banks for financing section
  const banksData = await getBanks()

  const t = await getTranslations({ locale, namespace: 'vehicle' })

  // Generate structured data for SEO
  const structuredData = buildVehicleStructuredData(vehicleData)

  const heroSpecsInput = buildVehicleHeroSpecsInput(vehicleData.specifications ?? null)
  const heroSpecs = toHeroSpecs(heroSpecsInput)
  const specIconMap: Record<string, LucideIcon> = {
    range: Navigation,
    battery: Zap,
    dc: PlugZap,
    zeroTo100: Timer,
    topSpeed: Gauge,
    power: Gauge,
  }

  // Transform pricing data to match the SellerCard props
  const allOffers = vehicleData.pricing
    .map((p) => {
      const financingData = p.financing ?? {}
      const termMonths = financingData.term_months ?? financingData.termMonths
      const emphasisValue = (p.emphasis ?? (p.organization.type === 'AGENCY' ? 'teal-border' : 'none')) as
        | 'none'
        | 'teal-border'
        | 'teal-glow'

      const financing =
        typeof termMonths === 'number' && termMonths > 0
          ? {
              showMonthly: true,
              termMonths,
              aprPercent: Number(
                financingData.apr_percent ??
                  financingData.aprPercent ??
                  0
              ),
              displayCurrency: (financingData.display_currency ??
                financingData.displayCurrency ??
                p.currency) as 'USD' | 'CRC',
            }
          : undefined

      return {
        type: p.organization.type,
        label: p.cta?.label,
        seller: {
          name: p.organization.name,
          official: p.organization.official,
          badges: p.organization.badges ?? [],
        },
        amount: Number(p.amount),
        currency: p.currency as 'USD' | 'CRC',
        availabilityBadge: p.availability?.label
          ? {
              label: p.availability.label,
              tone:
                p.availability.tone === 'danger'
                  ? 'warning'
                  : p.availability.tone === 'info' ||
                    p.availability.tone === 'success' ||
                    p.availability.tone === 'warning'
                  ? p.availability.tone
                  : 'neutral',
            } as const
          : undefined,
        financing,
        cta: {
          contactPath: p.cta?.href ?? null,
          detailsPath: null,
        },
        perks: p.perks ?? [],
        emphasis: emphasisValue,
      }
    })
    .sort((a, b) => {
      const typeOrder: Record<'AGENCY' | 'DEALER' | 'IMPORTER', number> = {
        AGENCY: 0,
        DEALER: 1,
        IMPORTER: 2,
      }
      return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99)
    })

  // Show only first 2 offers, rest accessible via "See All"
  const displayedOffers = allOffers.slice(0, 2)
  const totalOffers = allOffers.length

  // Use the vehicle data directly (it already has the correct structure from getVehicleBySlug)
  const vehicle = vehicleData

  // Accessories - empty for now until products table is implemented
  const accessories: ShowcaseItem[] = []

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
        {/* Primary Section - Minimalist Card */}
        <div className="card-container rounded-3xl overflow-hidden">
          <div className="space-y-6">
            <ProductTitle
              brand={vehicle.brand}
              model={vehicle.model}
              year={vehicle.year}
              variant={vehicle.variant}
              rangeKm={vehicle.specifications?.rangeKmWltp || vehicle.specifications?.rangeKmCltc}
              rangeCycle={vehicle.specifications?.rangeKmWltp ? 'WLTP' : 'CLTC'}
              batteryKwh={vehicle.specifications?.batteryKwh ? Number(vehicle.specifications.batteryKwh) : null}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Image Section - 2 columns */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden border border-[hsl(var(--border)/0.1)] dark:border-none">
                  <ImageCarousel
                    images={vehicle.media.images}
                    initialIndex={vehicle.media.heroIndex}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Pricing Section - 1 column */}
              <div className="space-y-4">
                {/* Action Buttons Row - Client Component */}
                <CarActionButtons />

                {displayedOffers.map((offer, idx) => (
                  <SellerCard
                    key={`${offer.seller?.name ?? offer.type}-${idx}`}
                    type={offer.type}
                    label={offer.label}
                    seller={offer.seller}
                    amount={offer.amount}
                    currency={offer.currency}
                    availabilityBadge={offer.availabilityBadge}
                    financing={offer.financing}
                    cta={offer.cta}
                    perks={offer.perks}
                    emphasis={offer.emphasis}
                  />
                ))}

                {/* See All Sellers Button */}
                <SeeAllSellersCard
                  href="/vehicles"
                  optionsCount={totalOffers}
                />

                {/* Financing Options - Below Sellers */}
                <div className="pt-4 border-t border-[hsl(var(--border)/0.2)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
                    <h3 className="text-lg font-bold tracking-tight">Financing Options</h3>
                  </div>
                  <FinancingTabs banks={banksData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Specifications - Horizontal Cards */}
        <section className="card-container rounded-3xl overflow-hidden space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight">Key Specifications</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {heroSpecs.map((spec) => {
              const Icon = specIconMap[spec.key] ?? Gauge
              return (
                <KeySpecification
                  key={spec.key}
                  icon={Icon}
                  title={spec.title}
                  value={spec.value}
                  ariaLabel={spec.ariaLabel}
                />
              )
            })}
          </div>
        </section>

        {/* Traffic Light Reviews - Streamlined */}
        <section className="card-container owner-reviews-shell rounded-3xl overflow-hidden space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight">Owner Reviews</h2>
          </div>
          <TrafficLightReviews />
        </section>

        {/* All Specs - Minimal Accordion */}
        <section className="card-container rounded-3xl overflow-hidden">
          <VehicleAllSpecs
            brand={vehicle.brand}
            model={vehicle.model}
            year={vehicle.year}
            variant={vehicle.variant}
            specifications={vehicle.specifications}
            detailedSpecs={vehicle.specs}
          />
        </section>

        {/* Related Accessories - Modern Carousel */}
        <section className="card-container rounded-3xl overflow-hidden space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight">Related Accessories</h2>
          </div>
          <ShowcaseCarousel title={null} items={accessories} />
        </section>

        {/* EV Services & Support */}
        <section className="card-container rounded-3xl overflow-hidden space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">EV Services & Support</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Prepare for ownership with trusted partners for maintenance, charging, detailing, and more.
                </p>
              </div>
            </div>
          </div>
          <ServicesShowcase />
        </section>
      </div>
    </>
  )
}
