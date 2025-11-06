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
  const vehicleTitle = {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    variant: 'Long Range',
    rangeKm: 500,
    rangeMethod: 'WLTP' as const,
    batteryKwh: 75,
  }

  const vehicleSummary = {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    bodyType: 'SEDAN',
  }

  const vehicleSpecs = {
    rangeKm: 500,
    rangeMethod: 'WLTP' as const,
    batteryKwh: 75,
    acceleration0100Sec: 4.4,
    topSpeedKmh: 233,
    powerKw: 261,
    powerHp: 350,
    chargingDcKw: 250,
    chargingTimeDcMin: 25,
    seats: 5,
    weightKg: 1844,
  }

  const carouselImages = [
    { url: '/placeholder-car.svg', alt: 'Tesla Model 3 front' },
    { url: '/placeholder-car.svg', alt: 'Tesla Model 3 interior' },
  ]

  const mockOffers = [
    {
      seller: {
        id: 'demo-seller',
        name: 'Tesla Store',
        type: 'AGENCY' as const,
        logoUrl: '/placeholder-car.svg',
        badges: ['Official dealer'],
        isOfficial: true,
      },
      pricing: {
        amount: 45000,
        currency: 'USD' as const,
        availability: { label: 'In Stock', tone: 'success' as const },
        financing: {
          downPayment: 9000,
          monthlyPayment: 650,
          termMonths: 60,
          currency: 'USD',
        },
        cta: { label: 'Contact Dealer', href: '#' },
        perks: ['Warranty', '1 Year Service'],
        emphasis: 'teal-border' as const,
      },
    },
  ]

  const mockBanks = [
    { id: 'bank1', name: 'Bank of America', rates: { apr: 3.5, term: 60 } },
  ]

  const mockAccessories: ShowcaseItem[] = [
    {
      id: 'acc1',
      name: 'Premium Floor Mats',
      description: 'All-weather protection',
      image: '/placeholder-acc-1.jpg',
      alt: 'Floor mats',
      ctaLabel: 'Shop Now',
      ctaHref: '#',
    },
  ]

  return (
    <div className="container mx-auto max-w-[1600px] space-y-6 px-4 py-6">
      <div className="card-container overflow-hidden rounded-3xl">
        <div className="space-y-6">
          <ProductTitle vehicle={vehicleTitle} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.1)] dark:border-none">
                <ImageCarousel images={carouselImages} className="w-full" />
              </div>
            </div>

            <div className="space-y-4">
              <CarActionButtons
                vehicleId="demo-vehicle"
                contactHref="#"
                contactLabel="Contact Dealer"
                shareLabel="Share"
                copiedLabel="Link copied"
              />

              {mockOffers.map((offer) => (
                <SellerCard key={offer.seller.id} seller={offer.seller} pricing={offer.pricing} />
              ))}

              <SeeAllSellersCard href="/vehicles" optionsCount={3} label="View all sellers" />

              <div className="border-t border-[hsl(var(--border)/0.2)] pt-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]" />
                  <h3 className="text-lg font-bold tracking-tight">Financing Options</h3>
                </div>
                <FinancingTabs banks={mockBanks} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card-container space-y-6 overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]" />
          <h2 className="text-2xl font-bold tracking-tight">Key Specifications</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <KeySpecification icon={Navigation} title="Range" value="500 km WLTP" />
          <KeySpecification icon={Zap} title="Battery" value="75 kWh" />
          <KeySpecification icon={PlugZap} title="DC Charging" value="250 kW" />
          <KeySpecification icon={Timer} title="0-100 km/h" value="4.4s" />
          <KeySpecification icon={Gauge} title="Top Speed" value="233 km/h" />
          <KeySpecification icon={Gauge} title="Power" value="350 hp" />
        </div>
      </section>

      <section className="card-container owner-reviews-shell space-y-6 overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]" />
          <h2 className="text-2xl font-bold tracking-tight">Owner Reviews</h2>
        </div>
        <TrafficLightReviews />
      </section>

      <section className="card-container overflow-hidden rounded-3xl">
        <VehicleAllSpecs vehicle={vehicleSummary} specs={vehicleSpecs} />
      </section>

      <section className="card-container space-y-6 overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]" />
          <h2 className="text-2xl font-bold tracking-tight">Related Accessories</h2>
        </div>
        <ShowcaseCarousel title={null} items={mockAccessories} />
      </section>

      <section className="card-container space-y-6 overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]" />
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
