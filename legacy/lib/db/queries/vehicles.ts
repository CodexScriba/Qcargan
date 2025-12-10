import { eq, and, gte, lte, sql, desc, asc, inArray } from "drizzle-orm"
import { db } from "@/lib/db/client"
import {
  vehicleImages,
  vehicles,
  vehicleSpecifications,
  vehiclePricing,
  organizations,
} from "@/lib/db/schema"
import { getPublicImageUrls } from "@/lib/supabase/storage"

type VehicleQueryDeps = {
  dbClient?: typeof db
  storage?: {
    getPublicImageUrls: typeof getPublicImageUrls
  }
}

// ============================================================================
// TYPES
// ============================================================================

export type VehicleImageSummary = {
  id: string
  storagePath: string
  altText: string | null
  caption: string | null
  displayOrder: number
  isHero: boolean
}

export type VehicleWithImages = Awaited<ReturnType<typeof getVehicleBySlug>>

export interface VehicleFilters {
  brand?: string
  bodyType?: "SEDAN" | "CITY" | "SUV" | "PICKUP_VAN"
  priceMin?: number
  priceMax?: number
  rangeMin?: number
  seatsMin?: number
  sortBy?: "price" | "range" | "newest"
  sortOrder?: "asc" | "desc"
}

// ============================================================================
// SINGLE VEHICLE QUERIES
// ============================================================================

/**
 * Get a single vehicle by slug with all related data
 * Includes: specifications, images (ordered), and pricing with organizations
 * Only returns published vehicles with active organization pricing
 */
export async function getVehicleBySlug(
  slug: string,
  deps: VehicleQueryDeps = {}
) {
  const dbClient = deps.dbClient ?? db
  const storage = deps.storage ?? { getPublicImageUrls }

  const [vehicle] = await dbClient
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.slug, slug), eq(vehicles.isPublished, true)))
    .limit(1)

  if (!vehicle) return null
  if (!vehicle.isPublished) {
    return null
  }

  // Fetch specifications
  const [specifications] = await dbClient
    .select()
    .from(vehicleSpecifications)
    .where(eq(vehicleSpecifications.vehicleId, vehicle.id))
    .limit(1)

  // Fetch images
  const images = await dbClient
    .select({
      id: vehicleImages.id,
      storagePath: vehicleImages.storagePath,
      altText: vehicleImages.altText,
      caption: vehicleImages.caption,
      displayOrder: vehicleImages.displayOrder,
      isHero: vehicleImages.isHero,
    })
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicle.id))
    .orderBy(asc(vehicleImages.displayOrder))

  // Fetch pricing with organizations (only active organizations)
  const pricingResults = await dbClient
    .select({
      id: vehiclePricing.id,
      amount: vehiclePricing.amount,
      currency: vehiclePricing.currency,
      availability: vehiclePricing.availability,
      financing: vehiclePricing.financing,
      cta: vehiclePricing.cta,
      perks: vehiclePricing.perks,
      emphasis: vehiclePricing.emphasis,
      displayOrder: vehiclePricing.displayOrder,
      isActive: vehiclePricing.isActive,
      organization: {
        id: organizations.id,
        slug: organizations.slug,
        name: organizations.name,
        type: organizations.type,
        logoUrl: organizations.logoUrl,
        contact: organizations.contact,
        official: organizations.official,
        badges: organizations.badges,
        isActive: organizations.isActive,
      },
    })
    .from(vehiclePricing)
    .innerJoin(
      organizations,
      eq(vehiclePricing.organizationId, organizations.id)
    )
    .where(
      and(
        eq(vehiclePricing.vehicleId, vehicle.id),
        eq(vehiclePricing.isActive, true),
        eq(organizations.isActive, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder), asc(vehiclePricing.amount))

  // Convert numeric amount to number for each pricing entry
  const pricing = pricingResults
    .filter((entry) => entry.isActive && entry.organization?.isActive)
    .map((p) => ({
      ...p,
      amount: Number(p.amount),
    }))

  // Build media object with CDN-safe URLs
  const heroImage = images.find((img) => img.isHero)
  const heroIndex = heroImage ? images.indexOf(heroImage) : 0

  // Convert all storage paths to browser-ready signed/public URLs
  const storagePaths = images.map((img) => img.storagePath)
  const publicUrls = await storage.getPublicImageUrls(storagePaths)

  const media = {
    images: images.map((img, index) => ({
      id: img.id,
      url: publicUrls[index] || "",
      storagePath: img.storagePath,
      altText: img.altText,
      caption: img.caption,
      displayOrder: img.displayOrder,
      isHero: img.isHero,
    })),
    heroIndex,
  }

  return {
    ...vehicle,
    specifications: specifications || null,
    media,
    pricing,
  }
}

/**
 * Get all pricing for a specific vehicle
 * Only returns pricing for published vehicles and active organizations
 * Converts numeric amount to number for consistency
 */
export async function getVehiclePricing(
  vehicleId: string,
  deps: VehicleQueryDeps = {}
) {
  const dbClient = deps.dbClient ?? db

  const pricingResults = await dbClient
    .select({
      id: vehiclePricing.id,
      amount: vehiclePricing.amount,
      currency: vehiclePricing.currency,
      availability: vehiclePricing.availability,
      financing: vehiclePricing.financing,
      cta: vehiclePricing.cta,
      perks: vehiclePricing.perks,
      emphasis: vehiclePricing.emphasis,
      displayOrder: vehiclePricing.displayOrder,
      isActive: vehiclePricing.isActive,
      organization: {
        id: organizations.id,
        slug: organizations.slug,
        name: organizations.name,
        type: organizations.type,
        logoUrl: organizations.logoUrl,
        contact: organizations.contact,
        official: organizations.official,
        badges: organizations.badges,
        isActive: organizations.isActive,
      },
    })
    .from(vehiclePricing)
    .innerJoin(
      organizations,
      eq(vehiclePricing.organizationId, organizations.id)
    )
    .innerJoin(vehicles, eq(vehiclePricing.vehicleId, vehicles.id))
    .where(
      and(
        eq(vehiclePricing.vehicleId, vehicleId),
        eq(vehiclePricing.isActive, true),
        eq(organizations.isActive, true),
        eq(vehicles.isPublished, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder), asc(vehiclePricing.amount))

  // Convert numeric amount to number for each pricing entry
  return pricingResults
    .filter((entry) => entry.isActive && entry.organization?.isActive)
    .map((p) => ({
      ...p,
      amount: Number(p.amount),
    }))
}

// ============================================================================
// VEHICLE LISTING QUERIES
// ============================================================================

/**
 * Get list of vehicles with filters, sorting, and pagination
 * Returns vehicles with hero image and pricing summary
 *
 * FIXES (2025-11-06):
 * - Accumulates all WHERE conditions before applying (fixes filter chaining bug)
 * - Joins pricing table with MIN aggregate in SQL (fixes N+1 and price filtering)
 * - Honors sortOrder for all sortBy modes (fixes API contract)
 * - Calculates accurate total count before pagination (fixes pagination metadata)
 * - Batches hero image queries (reduces N+1 queries)
 */
export async function getVehicles(
  filters: VehicleFilters = {},
  pagination: { page?: number; limit?: number } = {}
) {
  const {
    brand,
    bodyType,
    priceMin,
    priceMax,
    rangeMin,
    seatsMin,
    sortBy = "newest",
    sortOrder = "desc",
  } = filters

  const { page = 1, limit = 12 } = pagination
  const offset = (page - 1) * limit

  // Build all WHERE conditions at once (FIX #1: no more chaining)
  const whereConditions = [eq(vehicles.isPublished, true)]

  if (brand) {
    whereConditions.push(eq(vehicles.brand, brand))
  }

  if (bodyType) {
    whereConditions.push(eq(vehicleSpecifications.bodyType, bodyType))
  }

  if (rangeMin) {
    whereConditions.push(gte(vehicleSpecifications.rangeKmCltc, rangeMin))
  }

  if (seatsMin) {
    whereConditions.push(gte(vehicleSpecifications.seats, seatsMin))
  }

  // Create pricing subquery for MIN price and seller count (FIX #5: eliminate N+1)
  const pricingSubquery = db
    .select({
      vehicleId: vehiclePricing.vehicleId,
      minPrice: sql<number>`MIN(${vehiclePricing.amount})`.as("min_price"),
      sellerCount: sql<number>`COUNT(DISTINCT ${vehiclePricing.organizationId})`.as(
        "seller_count"
      ),
    })
    .from(vehiclePricing)
    .where(eq(vehiclePricing.isActive, true))
    .groupBy(vehiclePricing.vehicleId)
    .as("pricing_summary")

  // FIX #2: Add price filters to WHERE conditions (before pagination)
  if (priceMin !== undefined) {
    whereConditions.push(gte(pricingSubquery.minPrice, priceMin))
  }
  if (priceMax !== undefined) {
    whereConditions.push(lte(pricingSubquery.minPrice, priceMax))
  }

  // FIX #4: Get accurate count before pagination
  const [countResult] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${vehicles.id})` })
    .from(vehicles)
    .leftJoin(
      vehicleSpecifications,
      eq(vehicles.id, vehicleSpecifications.vehicleId)
    )
    .leftJoin(pricingSubquery, eq(vehicles.id, pricingSubquery.vehicleId))
    .where(and(...whereConditions))

  const totalCount = Number(countResult?.count ?? 0)

  // Build main query with pricing JOIN
  const baseQuery = db
    .select({
      id: vehicles.id,
      slug: vehicles.slug,
      brand: vehicles.brand,
      model: vehicles.model,
      year: vehicles.year,
      variant: vehicles.variant,
      description: vehicles.description,
      specs: vehicles.specs,
      createdAt: vehicles.createdAt,
      specifications: {
        rangeKmCltc: vehicleSpecifications.rangeKmCltc,
        rangeKmWltp: vehicleSpecifications.rangeKmWltp,
        rangeKmEpa: vehicleSpecifications.rangeKmEpa,
        batteryKwh: vehicleSpecifications.batteryKwh,
        acceleration0To100Sec: vehicleSpecifications.acceleration0To100Sec,
        seats: vehicleSpecifications.seats,
        bodyType: vehicleSpecifications.bodyType,
        powerKw: vehicleSpecifications.powerKw,
        powerHp: vehicleSpecifications.powerHp,
        topSpeedKmh: vehicleSpecifications.topSpeedKmh,
      },
      minPrice: pricingSubquery.minPrice,
      sellerCount: pricingSubquery.sellerCount,
    })
    .from(vehicles)
    .leftJoin(
      vehicleSpecifications,
      eq(vehicles.id, vehicleSpecifications.vehicleId)
    )
    .leftJoin(pricingSubquery, eq(vehicles.id, pricingSubquery.vehicleId))
    .where(and(...whereConditions))

  // FIX #3: Honor sortOrder for all sort modes
  // Determine sort order based on parameters
  let orderByColumn
  if (sortBy === "range") {
    orderByColumn =
      sortOrder === "desc"
        ? desc(vehicleSpecifications.rangeKmCltc)
        : asc(vehicleSpecifications.rangeKmCltc)
  } else if (sortBy === "price") {
    orderByColumn =
      sortOrder === "desc"
        ? desc(pricingSubquery.minPrice)
        : asc(pricingSubquery.minPrice)
  } else {
    // sortBy === "newest"
    orderByColumn =
      sortOrder === "desc"
        ? desc(vehicles.createdAt)
        : asc(vehicles.createdAt)
  }

  // Apply ordering and pagination in a single chain
  const results = await baseQuery
    .orderBy(orderByColumn)
    .limit(limit)
    .offset(offset)

  // FIX #5: Batch fetch hero images for all vehicles (reduces N+1)
  const vehicleIds = results.map((v) => v.id)
  const heroImages =
    vehicleIds.length > 0
      ? await db
          .select({
            vehicleId: vehicleImages.vehicleId,
            url: vehicleImages.storagePath,
            alt: vehicleImages.altText,
          })
          .from(vehicleImages)
          .where(
            and(
              inArray(vehicleImages.vehicleId, vehicleIds),
              eq(vehicleImages.isHero, true)
            )
          )
      : []

  // Map hero images by vehicleId for O(1) lookup
  const heroImageMap = new Map(
    heroImages.map((img) => [img.vehicleId, img])
  )

  // Enrich vehicles with hero images
  const enrichedVehicles = results.map((vehicle) => {
    const heroImage = heroImageMap.get(vehicle.id)

    return {
      ...vehicle,
      heroImage: heroImage
        ? {
            url: heroImage.url,
            alt: heroImage.alt || `${vehicle.brand} ${vehicle.model}`,
          }
        : null,
      pricing: {
        minPrice: vehicle.minPrice ? Number(vehicle.minPrice) : 0,
        sellerCount: vehicle.sellerCount ? Number(vehicle.sellerCount) : 0,
      },
    }
  })

  // FIX #4: Calculate accurate pagination metadata
  return {
    vehicles: enrichedVehicles,
    pagination: {
      page,
      limit,
      total: totalCount,
      hasMore: offset + enrichedVehicles.length < totalCount,
    },
  }
}

/**
 * Get all unique brands from published vehicles
 */
export async function getBrands() {
  const result = await db
    .selectDistinct({ brand: vehicles.brand })
    .from(vehicles)
    .where(eq(vehicles.isPublished, true))
    .orderBy(asc(vehicles.brand))

  return result.map((r) => r.brand)
}

/**
 * Get all unique body types from published vehicles
 */
export async function getBodyTypes() {
  const result = await db
    .selectDistinct({ bodyType: vehicleSpecifications.bodyType })
    .from(vehicleSpecifications)
    .innerJoin(
      vehicles,
      eq(vehicleSpecifications.vehicleId, vehicles.id)
    )
    .where(eq(vehicles.isPublished, true))
    .orderBy(asc(vehicleSpecifications.bodyType))

  return result.map((r) => r.bodyType).filter(Boolean)
}
