import type { vehicles, vehicleSpecifications, vehiclePricing, vehicleImages } from '@/lib/db/schema'

/**
 * Core vehicle type from database schema
 */
export type Vehicle = typeof vehicles.$inferSelect

/**
 * Vehicle specifications type
 */
export type VehicleSpecifications = typeof vehicleSpecifications.$inferSelect

/**
 * Vehicle pricing entry with organization details
 */
export type VehiclePricing = typeof vehiclePricing.$inferSelect

/**
 * Vehicle image metadata
 */
export type VehicleImage = typeof vehicleImages.$inferSelect

/**
 * Vehicle media image with browser-ready URL
 */
export interface VehicleMediaImage {
  id: string
  url: string
  storagePath: string
  altText: string | null
  caption: string | null
  displayOrder: number
  isHero: boolean
}

/**
 * Vehicle media collection
 */
export interface VehicleMedia {
  images: VehicleMediaImage[]
  heroIndex: number
}

/**
 * Vehicle pricing with organization info
 */
export interface VehiclePricingWithOrg {
  id: string
  amount: number
  currency: 'USD' | 'CRC'
  availability: {
    label: string
    tone?: 'success' | 'warning' | 'info' | 'danger'
    estimated_delivery_days?: number | null
  } | null
  financing: {
    down_payment?: number | null
    monthly_payment?: number | null
    term_months?: number | null
    apr_percent?: number | null
    display_currency?: 'USD' | 'CRC' | null
  } | null
  cta: {
    href: string
    label?: string | null
  } | null
  perks: string[] | null
  emphasis: 'none' | 'teal-border' | 'teal-glow'
  displayOrder: number
  isActive: boolean
  organization: {
    id: string
    slug: string
    name: string
    type: 'AGENCY' | 'DEALER' | 'IMPORTER'
    logoUrl: string | null
    contact: {
      phone?: string
      whatsapp?: string
      email?: string
      address?: string
    } | null
    official: boolean
    badges: string[] | null
    isActive: boolean
  }
}

/**
 * Complete vehicle with all related data (from getVehicleBySlug)
 * Note: This is inferred from the actual query return type
 * Import the query type directly for the most accurate typing
 */
export type VehicleDetail = Awaited<ReturnType<typeof import('@/lib/db/queries/vehicles').getVehicleBySlug>>

/**
 * Vehicle card data for listings (from getVehicles)
 */
export interface VehicleCard {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  variant: string | null
  badge: string | null
  specifications: VehicleSpecifications | null
  heroImage: VehicleMediaImage | null
  pricing: {
    minPrice: number
    sellerCount: number
  }
}

/**
 * Vehicle body type enum
 */
export type VehicleBodyType = 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'

/**
 * Vehicle filters for listings
 */
export interface VehicleFilters {
  brand?: string
  bodyType?: VehicleBodyType
  priceMin?: number
  priceMax?: number
  rangeMin?: number
  seatsMin?: number
  sortBy?: 'price' | 'range' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

/**
 * Vehicle listing response
 */
export interface VehicleListingResult {
  vehicles: VehicleCard[]
  pagination: PaginationMeta
}
