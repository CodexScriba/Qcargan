// REFERENCE DESIGN - From old quecargan project
// This is the original cars page implementation with real data integration
// Use as reference for Phase 1 when connecting to Supabase database

import React from 'react'
import ProductTitle from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { ShowcaseCarousel, type ShowcaseItem } from '@/components/showcase'
import { SellerCard } from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import db from '@/docs/fake/db.json'
import type { Bank } from '@/lib/banks'
import VehicleAllSpecs from '@/components/product/vehicle-all-specs'
import KeySpecification from './KeySpecification'
import { toHeroSpecs, type VehicleLike } from '@/lib/vehicle/specs'
import { Navigation, Zap, Gauge, Timer, PlugZap, type LucideIcon } from 'lucide-react'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import FinancingTabs from '@/components/banks/FinancingTabs'
import { TrafficLightReviews } from '@/components/reviews'
import ServicesShowcase from './ServicesShowcase'


const page = () => {
  const vehicle = db.vehicles[0]
  const allOffers = vehicle.prices
    .filter(p => ['agency', 'grey_market', 'import'].includes(p.type))
    .sort((a, b) => {
      const order = ['agency', 'grey_market', 'import']
      return order.indexOf(a.type) - order.indexOf(b.type)
    })

  // Show only first 2 offers (agency + grey_market), rest accessible via "See All"
  const displayedOffers = allOffers.slice(0, 2)
  const totalOffers = allOffers.length

  const accessories = ((db as { products?: ShowcaseItem[] }).products ?? []) as ShowcaseItem[]

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      {/* Hero Section - Minimalist Card */}
      <div className="card-container rounded-3xl overflow-hidden">
        <div className="space-y-6">
          <ProductTitle vehicle={vehicle} />

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

              {displayedOffers.map((p, idx) => {
                const typeMap = {
                  agency: 'AGENCY',
                  grey_market: 'DEALER',
                  import: 'IMPORTER'
                } as const
                const type = typeMap[p.type as keyof typeof typeMap]
                return (
                  <SellerCard
                    key={`${p.type}-${idx}`}
                    type={type}
                    label={p.label}
                    seller={p.seller}
                    amount={p.amount}
                    currency={p.currency as "USD"}
                    availabilityBadge={p.availabilityBadge as { label: string; tone?: 'neutral' | 'info' | 'success' | 'warning' } | undefined}
                    financing={p.financing ? { ...p.financing, displayCurrency: "USD" as const } : undefined}
                    cta={p.cta}
                    perks={p.perks}
                    emphasis={type === 'AGENCY' ? 'teal-border' : 'none'}
                  />
                )
              })}

              {/* See All Sellers Button */}
              <SeeAllSellersCard
                href="/sellers"
                optionsCount={totalOffers}
              />

              {/* Financing Options - Below Sellers */}
              <div className="pt-4 border-t border-[hsl(var(--border)/0.2)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
                  <h3 className="text-lg font-bold tracking-tight">Financing Options</h3>
                </div>
                <FinancingTabs banks={db.banks as Bank[]} />
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
          {(() => {
            const iconMap: Record<string, LucideIcon> = {
              range: Navigation,
              battery: Zap,
              dc: PlugZap,
              zeroTo100: Timer,
              topSpeed: Gauge,
              power: Gauge,
            }
            const specs = toHeroSpecs({
              ...vehicle.specs,
              range: vehicle.specs.range ? {
                ...vehicle.specs.range,
                method: vehicle.specs.range.method as 'CLTC' | 'WLTP' | 'EPA' | 'NEDC'
              } : undefined
            })
            return specs.map(s => {
              const Icon = iconMap[s.key] ?? Gauge
              return (
                <KeySpecification
                  key={s.key}
                  icon={Icon}
                  title={s.title}
                  value={s.value}
                  ariaLabel={s.ariaLabel}
                />
              )
            })
          })()}
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
        <VehicleAllSpecs vehicle={vehicle as VehicleLike} />
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
  )
}

export default page
