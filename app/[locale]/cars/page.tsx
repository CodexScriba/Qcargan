import React from 'react'
import ProductTitle from '@/components/product/product-title'
import ImageCarousel from '@/components/ui/image-carousel'
import { ShowcaseCarousel, type ShowcaseItem } from '@/components/showcase'
import SellerCard from '@/components/product/seller-card'
import { SeeAllSellersCard } from '@/components/product/see-all-sellers-card'
import VehicleAllSpecs from '@/components/product/vehicle-all-specs'
import KeySpecification from '@/components/product/key-specification'
import { Navigation, Zap, Gauge, Timer, PlugZap } from 'lucide-react'
import { CarActionButtons } from '@/components/product/car-action-buttons'
import FinancingTabs from '@/components/banks/FinancingTabs'
import TrafficLightReviews from '@/components/product/traffic-light-reviews'
import ServicesShowcase from '@/components/product/services-showcase'

const page = () => {
  // TODO: Replace with actual data fetching
  const mockVehicle = {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    variant: 'Long Range',
    specifications: {
      rangeKmWltp: 513,
      batteryKwh: 75,
      acceleration0To100Sec: 4.4,
      topSpeedKmh: 233,
      powerHp: 350,
      powerKw: 261,
      chargingDcKw: 250,
      chargingTimeDcMin: 25,
      seats: 5,
      weightKg: 1880,
      bodyType: 'SEDAN' as const
    },
    specs: {
      torque: { nm: 420, lbft: 310 },
      dimensions: { length: 4694, width: 1933, height: 1443, wheelbase: 2875 },
      charging: { ac: { kW: 11, time: '8 h to 100%' } }
    },
    media: {
      images: ['/placeholder-car-1.jpg', '/placeholder-car-2.jpg'],
      heroIndex: 0
    }
  }

  const mockOffers = [
    {
      seller: {
        id: 'org_1',
        name: 'Tesla Store Costa Rica',
        logo: '/placeholder-logo.png',
        type: 'AGENCY' as const,
        official: true,
        badges: ['Factory warranty']
      },
      price: { amount: 45000, currency: 'USD' as const },
      availability: { label: 'In Stock', tone: 'success' as const, estimated_delivery_days: 21 },
      financing: {
        down_payment: 9000,
        monthly_payment: 650,
        term_months: 60,
        apr_percent: 4.1,
        display_currency: 'USD'
      },
      cta: { label: 'Contact Dealer', href: 'https://wa.me/50688887777' },
      perks: ['Warranty', '1 Year Service'],
      emphasis: 'teal-border' as const
    }
  ]

  const mockBanks = [
    {
      id: 'bank1',
      name: 'Banco EV',
      aprMin: 3.5,
      aprMax: 4.8,
      terms: [48, 60, 72],
      websiteUrl: 'https://example-bank.test/ev',
      contactPhone: '+506 2222 3333',
      contactEmail: 'ev@bancoev.com',
      description: 'Specialists in EV financing for Costa Rica.'
    }
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
          <ProductTitle
            brand={mockVehicle.brand}
            model={mockVehicle.model}
            year={mockVehicle.year}
            variant={mockVehicle.variant}
            rangeKm={mockVehicle.specifications.rangeKmWltp}
            rangeCycle="WLTP"
            batteryKwh={mockVehicle.specifications.batteryKwh}
          />

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

              {mockOffers.map((offer) => (
                <SellerCard
                  key={offer.seller.id}
                  seller={offer.seller}
                  price={offer.price}
                  availability={offer.availability}
                  financing={offer.financing}
                  cta={offer.cta}
                  perks={offer.perks}
                  emphasis={offer.emphasis}
                />
              ))}

              <SeeAllSellersCard href="/vehicles" optionsCount={3} />

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
          <KeySpecification
            icon={Navigation}
            title="Range"
            value={`${mockVehicle.specifications.rangeKmWltp} km WLTP`}
          />
          <KeySpecification
            icon={Zap}
            title="Battery"
            value={`${mockVehicle.specifications.batteryKwh} kWh`}
          />
          <KeySpecification icon={PlugZap} title="DC Charging" value="250 kW" />
          <KeySpecification
            icon={Timer}
            title="0-100 km/h"
            value={`${mockVehicle.specifications.acceleration0To100Sec}s`}
          />
          <KeySpecification
            icon={Gauge}
            title="Top Speed"
            value={`${mockVehicle.specifications.topSpeedKmh} km/h`}
          />
          <KeySpecification icon={Gauge} title="Power" value="350 hp" />
        </div>
      </section>

      {/* Owner Reviews */}
      <section className="card-container owner-reviews-shell rounded-3xl overflow-hidden space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))] rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight">Owner Reviews</h2>
        </div>
        <TrafficLightReviews positive={72} neutral={18} negative={10} placeholder />
      </section>

      {/* All Specs */}
      <section className="card-container rounded-3xl overflow-hidden">
        <VehicleAllSpecs
          brand={mockVehicle.brand}
          model={mockVehicle.model}
          year={mockVehicle.year}
          variant={mockVehicle.variant}
          specifications={mockVehicle.specifications}
          detailedSpecs={mockVehicle.specs}
        />
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
