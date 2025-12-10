export interface VehicleCategory {
  title: string
  description: string
  href: string
  image: string
  className?: string
}

export interface QuickLink {
  title: string
  description: string
  href: string
  icon: 'clock' | 'dollar' | 'star' | 'plug' | 'package' | 'circleDollar' | 'car' | 'tag'
  className?: string
}

export interface FeaturedCard {
  badge: string
  title: string
  description: string
  image: string
  href: string
  cta: string
}

export interface ServiceCategory {
  title: string
  href: string
  description: string
  image: string
}

export interface ShopCard {
  title: string
  description: string
  image: string
  href: string
}
