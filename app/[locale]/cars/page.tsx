import React from 'react'
import ProductTitle from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { ShowcaseCarousel, type ShowcaseItem } from '@/components/showcase'
import { SellerCard } from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import VehicleAllSpecs from '@/components/product/vehicle-all-specs'
import KeySpecification from './KeySpecification'
import { Navigation, Zap, Gauge, Timer, PlugZap } from 'lucide-react'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import FinancingTabs from '@/components/banks/FinancingTabs'
import { TrafficLightReviews } from '@/components/reviews'
import ServicesShowcase from './ServicesShowcase'

const page = () => {
  // TODO: Replace with actual data fetching
  const mockVehicle = {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    variant: 'Long Range',
    specs: {
      range: { value: 500, method: 'WLTP' },
      battery: { kWh: 75 },
      power: { hp: 350, kW: 261 },
      zeroTo100: 4.4,
      topSpeed: 233,
      charging: {
        dc: { kW: 250, time: '25 min' }
      }
    },
    media: {
      images: ['/placeholder-car-1.jpg', '/placeholder-car-2.jpg'],
      heroIndex: 0
    }
  }

  const mockOffers = [
    {
      type: 'agency' as const,
      label: 'Official Dealer',
      seller: { name: 'Tesla Store' },
      amount: 45000,
      currency: 'USD' as const,
      availabilityBadge: { label: 'In Stock', tone: 'success' as const },
      financing: {
        downPayment: 9000,
        monthlyPayment: 650,
        termMonths: 60,
        displayCurrency: 'USD' as const
      },
      cta: { label: 'Contact Dealer', href: '#' },
      perks: ['Warranty', '1 Year Service']
    }
  ]

  const mockBanks = [
    { id: 'bank1', name: 'Bank of America', rates: { apr: 3.5, term: 60 } }
  ]

  const mockAccessories: ShowcaseItem[] = [
    {
      id: 'acc1',
      name: 'Premium Floor Mats',
      description: 'All-weather protection',
      image: '/placeholder-acc-1.jpg',
      alt: 'Floor mats',
      ctaLabel: 'Shop Now',
      ctaHref: '#'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1600px] space-y-6">
      {/* Hero Section */}
      <div className="card-container rounded-3xl overflow-hidden">
        <div className="space-y-6">
          <ProductTitle vehicle={mockVehicle} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-[hsl(var(--border)/0.1)] dark:border-none">
                <ImageCarousel
                  images={mockVehicle.media.images}
                  initialIndex={mockVehicle.media.heroIndex}
                  className="w-full"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <CarActionButtons />

              {mockOffers.map((p, idx) => (
                <SellerCard
                  key={`${p.type}-${idx}`}
                  type="AGENCY"
                  label={p.label}
                  seller={p.seller}
                  amount={p.amount}
                  currency={p.currency}
                  availabilityBadge={p.availabilityBadge}
                  financing={p.financing}
                  cta={p.cta}
                  perks={p.perks}
                  emphasis="teal-border"
                />
              ))}

              <SeeAllSellersCard href="/sellers" optionsCount={3} />

              {/* Financing Options */}
              <div className="pt-4 border-t border-[hsl(var(--border)/0.2)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
                  <h3 className="text-lg font-bold tracking-tight">Financing Options</h3>
                </div>
                <FinancingTabs banks={mockBanks} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Specifications */}
      <section className="card-container rounded-3xl overflow-hidden space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight">Key Specifications</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KeySpecification icon={Navigation} title="Range" value="500 km WLTP" />
          <KeySpecification icon={Zap} title="Battery" value="75 kWh" />
          <KeySpecification icon={PlugZap} title="DC Charging" value="250 kW" />
          <KeySpecification icon={Timer} title="0-100 km/h" value="4.4s" />
          <KeySpecification icon={Gauge} title="Top Speed" value="233 km/h" />
          <KeySpecification icon={Gauge} title="Power" value="350 hp" />
        </div>
      </section>

      {/* Owner Reviews */}
      <section className="card-container owner-reviews-shell rounded-3xl overflow-hidden space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight">Owner Reviews</h2>
        </div>
        <TrafficLightReviews />
      </section>

      {/* All Specs */}
      <section className="card-container rounded-3xl overflow-hidden">
        <VehicleAllSpecs vehicle={mockVehicle} />
      </section>

      {/* Related Accessories */}
      <section className="card-container rounded-3xl overflow-hidden space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight">Related Accessories</h2>
        </div>
        <ShowcaseCarousel title={null} items={mockAccessories} />
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
