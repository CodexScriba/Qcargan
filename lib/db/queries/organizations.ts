import { eq, and, asc, desc } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { organizations } from "@/lib/db/schema/organizations"
import { vehicles, vehicleSpecifications, vehicleImages, vehiclePricing } from "@/lib/db/schema"
import { getPublicImageUrls } from "@/lib/supabase/storage"

type VehicleQueryDeps = {
  dbClient?: typeof db
  storage?: {
    getPublicImageUrls: typeof getPublicImageUrls
  }
}

/**
 * Get all active organizations ordered by name
 */
export async function getOrganizations() {
  return db
    .select()
    .from(organizations)
    .where(eq(organizations.isActive, true))
    .orderBy(asc(organizations.name))
}

/**
 * Get organization by slug
 * Returns null if not found or inactive
 */
export async function getOrganizationBySlug(slug: string) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.slug, slug), eq(organizations.isActive, true)))
    .limit(1)

  return organization || null
}

/**
 * Get organizations filtered by type (AGENCY, DEALER, IMPORTER)
 */
export async function getOrganizationsByType(
  type: "AGENCY" | "DEALER" | "IMPORTER"
) {
  return db
    .select()
    .from(organizations)
    .where(and(eq(organizations.type, type), eq(organizations.isActive, true)))
    .orderBy(asc(organizations.name))
}

/**
 * Get official organizations (verified/official dealers)
 */
export async function getOfficialOrganizations() {
  return db
    .select()
    .from(organizations)
    .where(
      and(eq(organizations.official, true), eq(organizations.isActive, true))
    )
    .orderBy(asc(organizations.name))
}

/**
 * Get all vehicles sold by a specific organization
 * Returns vehicles with hero image, pricing details, and specifications
 * Only includes published vehicles with active pricing
 */
export async function getOrganizationVehicles(
  organizationId: string,
  deps: VehicleQueryDeps = {}
) {
  const dbClient = deps.dbClient ?? db
  const storage = deps.storage ?? { getPublicImageUrls }

  // Query structure
  const results = await dbClient
    .select({
      vehicleId: vehicles.id,
      slug: vehicles.slug,
      brand: vehicles.brand,
      model: vehicles.model,
      year: vehicles.year,
      variant: vehicles.variant,
      // Hero image
      heroImagePath: vehicleImages.storagePath,
      heroImageAlt: vehicleImages.altText,
      // Specifications
      rangeKmCltc: vehicleSpecifications.rangeKmCltc,
      rangeKmWltp: vehicleSpecifications.rangeKmWltp,
      rangeKmEpa: vehicleSpecifications.rangeKmEpa,
      batteryKwh: vehicleSpecifications.batteryKwh,
      seats: vehicleSpecifications.seats,
      bodyType: vehicleSpecifications.bodyType,
      // Pricing
      amount: vehiclePricing.amount,
      currency: vehiclePricing.currency,
      availability: vehiclePricing.availability,
      perks: vehiclePricing.perks,
      displayOrder: vehiclePricing.displayOrder,
    })
    .from(vehiclePricing)
    .innerJoin(vehicles, eq(vehiclePricing.vehicleId, vehicles.id))
    .leftJoin(vehicleSpecifications, eq(vehicles.id, vehicleSpecifications.vehicleId))
    .leftJoin(
      vehicleImages,
      and(
        eq(vehicleImages.vehicleId, vehicles.id),
        eq(vehicleImages.isHero, true)
      )
    )
    .where(
      and(
        eq(vehiclePricing.organizationId, organizationId),
        eq(vehiclePricing.isActive, true),
        eq(vehicles.isPublished, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder), desc(vehicles.year))

  // Convert storage paths to public URLs
  const heroImagePaths = results
    .map((r) => r.heroImagePath)
    .filter(Boolean) as string[]
  const publicUrls = await storage.getPublicImageUrls(heroImagePaths)
  const urlMap = new Map(
    heroImagePaths.map((path, idx) => [path, publicUrls[idx]])
  )

  // Transform results
  return results.map((r) => ({
    vehicleId: r.vehicleId,
    slug: r.slug,
    brand: r.brand,
    model: r.model,
    year: r.year,
    variant: r.variant,
    heroImage: r.heroImagePath
      ? {
          url: urlMap.get(r.heroImagePath) || '',
          alt: r.heroImageAlt || `${r.brand} ${r.model}`,
        }
      : null,
    specifications: {
      rangeKmCltc: r.rangeKmCltc,
      rangeKmWltp: r.rangeKmWltp,
      rangeKmEpa: r.rangeKmEpa,
      batteryKwh: r.batteryKwh ? Number(r.batteryKwh) : null,
      seats: r.seats,
      bodyType: r.bodyType,
    },
    pricing: {
      amount: Number(r.amount),
      currency: r.currency as 'USD' | 'CRC',
      availability: r.availability,
      perks: r.perks ?? [],
    },
  }))
}

// Type exports for consumers
export type Organization = Awaited<ReturnType<typeof getOrganizationBySlug>>
export type OrganizationList = Awaited<ReturnType<typeof getOrganizations>>
export type OrganizationVehicle = Awaited<ReturnType<typeof getOrganizationVehicles>>[number]
