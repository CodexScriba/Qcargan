import { type FeaturedCard, type QuickLink, type ServiceCategory } from './types'

type ServicesQuickLink = Omit<QuickLink, 'icon'> & { icon: 'plug' | 'car' | 'package' | 'circleDollar' }

export const servicesMenuCopy = {
  trigger: 'Services',
  sectionHeading: 'Explore our partner services',
  viewAllButton: 'View All Services',
  viewAllHref: '/services'
}

export const servicesFeatured: FeaturedCard = {
  badge: 'Featured',
  title: 'Financing Guidance',
  description: 'Flexible financing options for every electric vehicle budget.',
  image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/finance.png',
  href: '/services/financing',
  cta: 'See financing partners'
}

export const servicesQuickLinks: ServicesQuickLink[] = [
  {
    title: 'Certified Electricians',
    description: 'Installation, maintenance and repair of home charging stations.',
    href: '/services/electricians',
    icon: 'plug',
    className: 'cursor-pointer'
  },
  {
    title: 'Mechanic Workshops',
    description: 'Professional repairs and maintenance tailored for EVs.',
    href: '/services/workshops',
    icon: 'car',
    className: 'cursor-pointer'
  },
  {
    title: 'Detailing Studios',
    description: 'Protective coatings and deep cleaning sessions for your vehicle.',
    href: '/services/detailing',
    icon: 'package',
    className: 'cursor-pointer'
  },
  {
    title: 'Insurance Partners',
    description: 'Quotes from insurers specialized in electric vehicles.',
    href: '/services/insurance',
    icon: 'circleDollar',
    className: 'cursor-pointer'
  }
]

export const serviceCategories: ServiceCategory[] = [
  {
    title: 'Financing',
    href: '/services/financing',
    description: 'Compare interest rates and pick the plan that fits your journey.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/finance.png'
  },
  {
    title: 'Electricians',
    href: '/services/electricians',
    description: 'Find certified EV electricians near you for safe charger installs.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/electrician.png'
  },
  {
    title: 'Mechanics',
    href: '/services/workshops',
    description: 'Diagnostics and maintenance from trusted EV technicians.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/mechanic.png'
  },
  {
    title: 'Detailing',
    href: '/services/detailing',
    description: 'Keep your car showroom fresh with curated detailing packages.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/detailing.png'
  },
  {
    title: 'Insurance',
    href: '/services/insurance',
    description: 'Protect your investment with coverage built for EV ownership.',
    image: 'https://mtbtaiffcxanyymfkkhk.supabase.co/storage/v1/object/public/que-cargan/navbar/Insurance.jpg'
  }
]
