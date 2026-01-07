import { eq, and, asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  vehicles,
  vehicleSpecifications,
  vehiclePricing,
  vehicleImages,
  organizations,
  banks,
  type VehicleSpecs,
  type VehicleAvailability,
  type VehicleFinancing,
  type VehicleCta,
  type OrganizationContact
} from '@/lib/db/schema'

// Types for vehicle page data
export type VehicleImage = {
  id: string
  storagePath: string
  displayOrder: number
  isHero: boolean
  altText: string | null
  caption: string | null
}

export type VehicleOrganization = {
  id: string
  slug: string
  name: string
  type: 'AGENCY' | 'DEALER' | 'IMPORTER'
  logoUrl: string | null
  contact: OrganizationContact
  official: boolean
  badges: string[]
}

export type VehiclePricingWithOrg = {
  id: string
  amount: number
  currency: 'USD' | 'CRC'
  availability: VehicleAvailability
  financing: VehicleFinancing | null
  cta: VehicleCta | null
  perks: string[]
  emphasis: 'none' | 'teal-border' | 'teal-glow'
  displayOrder: number
  organization: VehicleOrganization
}

export type VehicleSpecsData = {
  rangeKmCltc: number | null
  rangeKmWltp: number | null
  rangeKmEpa: number | null
  batteryKwh: number | null
  acceleration0To100Sec: number | null
  topSpeedKmh: number | null
  powerKw: number | null
  powerHp: number | null
  chargingDcKw: number | null
  chargingTimeDcMin: number | null
  seats: number | null
  weightKg: number | null
  bodyType: 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'
  sentimentPositivePercent: number | null
  sentimentNeutralPercent: number | null
  sentimentNegativePercent: number | null
}

export type VehiclePageData = {
  // Basic info
  id: string
  slug: string
  brand: string
  model: string
  year: number
  variant: string | null
  description: string | null

  // Extended specs (JSONB)
  specs: VehicleSpecs

  // Structured specs
  specifications: VehicleSpecsData | null

  // Images
  images: VehicleImage[]

  // Pricing from sellers
  pricing: VehiclePricingWithOrg[]
}

export type BankData = {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  typicalAprMin: number | null
  typicalAprMax: number | null
  typicalTermMonths: number[] | null
  description: string | null
}

/**
 * Fetch a vehicle by slug with all related data for the listing page
 */
export async function getVehicleBySlug(
  slug: string
): Promise<VehiclePageData | null> {
  // Get the vehicle
  const vehicleResult = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.slug, slug), eq(vehicles.isPublished, true)))
    .limit(1)

  const vehicle = vehicleResult[0]
  if (!vehicle) return null

  // Get specifications
  const specsResult = await db
    .select()
    .from(vehicleSpecifications)
    .where(eq(vehicleSpecifications.vehicleId, vehicle.id))
    .limit(1)

  const specifications = specsResult[0] ?? null

  // Get images ordered by displayOrder
  const imagesResult = await db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicle.id))
    .orderBy(asc(vehicleImages.displayOrder))

  // Get pricing with organizations
  const pricingResult = await db
    .select({
      pricing: vehiclePricing,
      organization: organizations
    })
    .from(vehiclePricing)
    .innerJoin(organizations, eq(vehiclePricing.organizationId, organizations.id))
    .where(
      and(
        eq(vehiclePricing.vehicleId, vehicle.id),
        eq(vehiclePricing.isActive, true),
        eq(organizations.isActive, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder))

  return {
    id: vehicle.id,
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    variant: vehicle.variant,
    description: vehicle.description,
    specs: vehicle.specs,
    specifications: specifications
      ? {
          rangeKmCltc: specifications.rangeKmCltc,
          rangeKmWltp: specifications.rangeKmWltp,
          rangeKmEpa: specifications.rangeKmEpa,
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
          sentimentPositivePercent: specifications.sentimentPositivePercent,
          sentimentNeutralPercent: specifications.sentimentNeutralPercent,
          sentimentNegativePercent: specifications.sentimentNegativePercent
        }
      : null,
    images: imagesResult.map((img) => ({
      id: img.id,
      storagePath: img.storagePath,
      displayOrder: img.displayOrder,
      isHero: img.isHero,
      altText: img.altText,
      caption: img.caption
    })),
    pricing: pricingResult.map(({ pricing, organization }) => ({
      id: pricing.id,
      amount: pricing.amount,
      currency: pricing.currency as 'USD' | 'CRC',
      availability: pricing.availability,
      financing: pricing.financing,
      cta: pricing.cta,
      perks: pricing.perks,
      emphasis: pricing.emphasis as 'none' | 'teal-border' | 'teal-glow',
      displayOrder: pricing.displayOrder,
      organization: {
        id: organization.id,
        slug: organization.slug,
        name: organization.name,
        type: organization.type as 'AGENCY' | 'DEALER' | 'IMPORTER',
        logoUrl: organization.logoUrl,
        contact: organization.contact,
        official: organization.official,
        badges: organization.badges
      }
    }))
  }
}

/**
 * Fetch featured banks for financing section
 */
export async function getFeaturedBanks(): Promise<BankData[]> {
  const result = await db
    .select()
    .from(banks)
    .where(and(eq(banks.isActive, true), eq(banks.isFeatured, true)))
    .orderBy(asc(banks.displayOrder))

  return result.map((bank) => ({
    id: bank.id,
    slug: bank.slug,
    name: bank.name,
    logoUrl: bank.logoUrl,
    websiteUrl: bank.websiteUrl,
    typicalAprMin: bank.typicalAprMin,
    typicalAprMax: bank.typicalAprMax,
    typicalTermMonths: bank.typicalTermMonths,
    description: bank.description
  }))
}
