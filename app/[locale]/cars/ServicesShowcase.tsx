'use client'

import { ShowcaseCarousel, type ShowcaseItem } from '@/components/showcase'
import { Cable, CircleDot, Cpu, ShieldCheck, Sparkle, Wrench } from 'lucide-react'

const servicesCarouselItems: ShowcaseItem[] = [
  {
    id: 'service-mechanics',
    name: 'Mechanics & Diagnostics',
    eyebrow: 'Maintenance',
    description: 'Certified EV technicians for maintenance, diagnostics, and repairs tailored to electric vehicles.',
    image: '/placeholder-service-1.jpg',
    alt: 'Certified EV mechanic inspecting the battery of an electric vehicle inside a modern workshop',
    badges: ['Battery care', 'High-voltage safe'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Mechanics%20support',
    metaLabel: 'Certified partner network',
    icon: Wrench
  },
  {
    id: 'service-electricians',
    name: 'Charging Installation',
    eyebrow: 'Charging',
    description: 'Licensed electricians for home and commercial chargers with permitting support.',
    image: '/placeholder-service-2.jpg',
    alt: 'Electrician installing a wall-mounted EV charger in a modern garage',
    badges: ['Level 2 & 3', 'Licensed installs'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Charging%20installation',
    metaLabel: 'Licensed installers',
    icon: Cable
  },
  {
    id: 'service-detailing',
    name: 'Detailing & Wraps',
    eyebrow: 'Care',
    description: 'Premium detailing studios for ceramic coatings, wraps, and paint protection tuned for EV finishes.',
    image: '/placeholder-service-3.jpg',
    alt: 'Detailing specialist applying protective film to a sleek electric vehicle',
    badges: ['Ceramic coats', 'PPF experts'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Detailing%20inquiry',
    metaLabel: 'Premium detailing studios',
    icon: Sparkle
  },
  {
    id: 'service-software',
    name: 'Firmware & Software',
    eyebrow: 'Software',
    description: 'Secure firmware updates, performance tuning, and OTA fleet management for the latest EV platforms.',
    image: '/placeholder-service-4.jpg',
    alt: 'Close-up of an EV dashboard displaying a software update progress interface',
    badges: ['OTA ready', 'Performance tuning'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Software%20support',
    metaLabel: 'Secure OTA partners',
    icon: Cpu
  },
  {
    id: 'service-tires',
    name: 'Tires & Alignment',
    eyebrow: 'Handling',
    description: 'EV-optimized tire fitting, rotation, and alignment services focused on range and low rolling resistance.',
    image: '/placeholder-service-5.jpg',
    alt: 'Technician aligning a performance tire on an electric vehicle wheel',
    badges: ['EV compounds', 'Precision fitting'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Tire%20service',
    metaLabel: 'EV tire specialists',
    icon: CircleDot
  },
  {
    id: 'service-insurance',
    name: 'EV Insurance Advisors',
    eyebrow: 'Protection',
    description: 'Specialized EV insurance guidance with comprehensive coverage packages and claims concierge support.',
    image: '/placeholder-service-6.jpg',
    alt: 'Insurance advisor reviewing coverage options with an electric vehicle visible outside the office window',
    badges: ['Tailored plans', 'Claims concierge'],
    ctaLabel: 'View Providers',
    ctaHref: 'mailto:services@quecargan.com?subject=Insurance%20quote',
    metaLabel: 'Tailored coverage plans',
    icon: ShieldCheck
  }
]

export default function ServicesShowcase () {
  return (
    <ShowcaseCarousel
      title={null}
      descriptionFallback='Premium EV specialists on demand.'
      items={servicesCarouselItems}
    />
  )
}
