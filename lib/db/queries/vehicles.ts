/**
 * Vehicle Query Functions
 *
 * Server-side data fetching for vehicle pages.
 * Uses Drizzle ORM with manual JOINs (Phase 1).
 * Materialized views deferred to Phase 2+.
 */

import { db } from '../client'
import * as schema from '../../../drizzle/schema'
import { eq, and, desc, asc, gte, lte, inArray, sql } from 'drizzle-orm'

export interface VehicleFilters {
  brand?: string
  bodyType?: string
  priceMin?: number
  priceMax?: number
  rangeMin?: number
  seatsMin?: number
}

export interface VehicleWithDetails {
  vehicle: typeof schema.vehicles.$inferSelect
  specifications: typeof schema.vehicleSpecifications.$inferSelect | null
  images: Array<typeof schema.vehicleImages.$inferSelect>
  pricing: Array<{
    pricing: typeof schema.vehiclePricing.$inferSelect
    organization: typeof schema.organizations.$inferSelect
  }>
}

/**
 * Get a single vehicle by slug with all related data
 */
export async function getVehicleBySlug(slug: string): Promise<VehicleWithDetails | null> {
  // Get the vehicle
  const [vehicle] = await db
    .select()
    .from(schema.vehicles)
    .where(and(
      eq(schema.vehicles.slug, slug),
      eq(schema.vehicles.isPublished, true)
    ))
    .limit(1)

  if (!vehicle) return null

  // Get all related data in parallel
  const [specifications, images, pricingData] = await Promise.all([
    // Get specifications
    db
      .select()
      .from(schema.vehicleSpecifications)
      .where(eq(schema.vehicleSpecifications.vehicleId, vehicle.id))
      .limit(1)
      .then(rows => rows[0] || null),

    // Get images ordered by display_order
    db
      .select()
      .from(schema.vehicleImages)
      .where(eq(schema.vehicleImages.vehicleId, vehicle.id))
      .orderBy(asc(schema.vehicleImages.displayOrder)),

    // Get pricing with organization details
    db
      .select({
        pricing: schema.vehiclePricing,
        organization: schema.organizations
      })
      .from(schema.vehiclePricing)
      .innerJoin(
        schema.organizations,
        eq(schema.vehiclePricing.organizationId, schema.organizations.id)
      )
      .where(and(
        eq(schema.vehiclePricing.vehicleId, vehicle.id),
        eq(schema.vehiclePricing.isActive, true)
      ))
      .orderBy(asc(schema.vehiclePricing.displayOrder), asc(schema.vehiclePricing.amount))
  ])

  return {
    vehicle,
    specifications,
    images,
    pricing: pricingData
  }
}

/**
 * Get all published vehicles with optional filters
 */
export async function getVehicles(filters?: VehicleFilters) {
  let query = db
    .select({
      vehicle: schema.vehicles,
      specifications: schema.vehicleSpecifications
    })
    .from(schema.vehicles)
    .leftJoin(
      schema.vehicleSpecifications,
      eq(schema.vehicles.id, schema.vehicleSpecifications.vehicleId)
    )
    .where(eq(schema.vehicles.isPublished, true))
    .$dynamic()

  // Apply filters
  const conditions = [eq(schema.vehicles.isPublished, true)]

  if (filters?.brand) {
    conditions.push(eq(schema.vehicles.brand, filters.brand))
  }

  if (filters?.bodyType) {
    conditions.push(eq(schema.vehicleSpecifications.bodyType, filters.bodyType as any))
  }

  if (filters?.rangeMin) {
    conditions.push(gte(schema.vehicleSpecifications.rangeKmCltc, filters.rangeMin))
  }

  if (filters?.seatsMin) {
    conditions.push(gte(schema.vehicleSpecifications.seats, filters.seatsMin))
  }

  query = query.where(and(...conditions))

  // Order by year desc, brand asc
  const results = await query.orderBy(
    desc(schema.vehicles.year),
    asc(schema.vehicles.brand),
    asc(schema.vehicles.model)
  )

  // Get pricing for price filters (if needed)
  const vehicleIds = results.map(r => r.vehicle.id)

  if (vehicleIds.length === 0) {
    return []
  }

  // Get minimum pricing for each vehicle
  const pricingData = await db
    .select({
      vehicleId: schema.vehiclePricing.vehicleId,
      minPrice: sql<string>`MIN(${schema.vehiclePricing.amount})`.as('min_price'),
      maxPrice: sql<string>`MAX(${schema.vehiclePricing.amount})`.as('max_price'),
      sellerCount: sql<number>`COUNT(DISTINCT ${schema.vehiclePricing.organizationId})`.as('seller_count')
    })
    .from(schema.vehiclePricing)
    .where(and(
      inArray(schema.vehiclePricing.vehicleId, vehicleIds),
      eq(schema.vehiclePricing.isActive, true)
    ))
    .groupBy(schema.vehiclePricing.vehicleId)

  // Create pricing map for easy lookup
  const pricingMap = new Map(
    pricingData.map(p => [p.vehicleId, p])
  )

  // Apply price filters and enrich results
  let enrichedResults = results.map(r => ({
    ...r,
    pricing: pricingMap.get(r.vehicle.id) || { minPrice: null, maxPrice: null, sellerCount: 0 }
  }))

  // Filter by price if specified
  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    enrichedResults = enrichedResults.filter(r => {
      const minPrice = r.pricing.minPrice ? parseFloat(r.pricing.minPrice) : null
      if (minPrice === null) return false

      if (filters.priceMin !== undefined && minPrice < filters.priceMin) return false
      if (filters.priceMax !== undefined && minPrice > filters.priceMax) return false

      return true
    })
  }

  return enrichedResults
}

/**
 * Get vehicles by brand
 */
export async function getVehiclesByBrand(brand: string) {
  return getVehicles({ brand })
}

/**
 * Get vehicles by body type
 */
export async function getVehiclesByBodyType(bodyType: string) {
  return getVehicles({ bodyType })
}

/**
 * Get available brands (unique list)
 */
export async function getAvailableBrands(): Promise<string[]> {
  const results = await db
    .selectDistinct({ brand: schema.vehicles.brand })
    .from(schema.vehicles)
    .where(eq(schema.vehicles.isPublished, true))
    .orderBy(asc(schema.vehicles.brand))

  return results.map(r => r.brand)
}

/**
 * Get vehicle count by filters
 */
export async function getVehicleCount(filters?: VehicleFilters): Promise<number> {
  const conditions = [eq(schema.vehicles.isPublished, true)]

  if (filters?.brand) {
    conditions.push(eq(schema.vehicles.brand, filters.brand))
  }

  if (filters?.bodyType) {
    conditions.push(eq(schema.vehicleSpecifications.bodyType, filters.bodyType as any))
  }

  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.vehicles)
    .leftJoin(
      schema.vehicleSpecifications,
      eq(schema.vehicles.id, schema.vehicleSpecifications.vehicleId)
    )
    .where(and(...conditions))

  return result?.count || 0
}

/**
 * Get recently added vehicles
 */
export async function getRecentVehicles(limit: number = 6) {
  const results = await db
    .select({
      vehicle: schema.vehicles,
      specifications: schema.vehicleSpecifications
    })
    .from(schema.vehicles)
    .leftJoin(
      schema.vehicleSpecifications,
      eq(schema.vehicles.id, schema.vehicleSpecifications.vehicleId)
    )
    .where(eq(schema.vehicles.isPublished, true))
    .orderBy(desc(schema.vehicles.createdAt))
    .limit(limit)

  // Get pricing for each vehicle
  const vehicleIds = results.map(r => r.vehicle.id)
  const pricingData = await db
    .select({
      vehicleId: schema.vehiclePricing.vehicleId,
      minPrice: sql<string>`MIN(${schema.vehiclePricing.amount})`.as('min_price')
    })
    .from(schema.vehiclePricing)
    .where(and(
      inArray(schema.vehiclePricing.vehicleId, vehicleIds),
      eq(schema.vehiclePricing.isActive, true)
    ))
    .groupBy(schema.vehiclePricing.vehicleId)

  const pricingMap = new Map(pricingData.map(p => [p.vehicleId, p]))

  return results.map(r => ({
    ...r,
    pricing: pricingMap.get(r.vehicle.id) || { minPrice: null }
  }))
}

/**
 * Search vehicles by keyword (searches brand, model, variant)
 */
export async function searchVehicles(keyword: string, limit: number = 10) {
  const searchTerm = `%${keyword.toLowerCase()}%`

  const results = await db
    .select({
      vehicle: schema.vehicles,
      specifications: schema.vehicleSpecifications
    })
    .from(schema.vehicles)
    .leftJoin(
      schema.vehicleSpecifications,
      eq(schema.vehicles.id, schema.vehicleSpecifications.vehicleId)
    )
    .where(and(
      eq(schema.vehicles.isPublished, true),
      sql`(
        LOWER(${schema.vehicles.brand}) LIKE ${searchTerm} OR
        LOWER(${schema.vehicles.model}) LIKE ${searchTerm} OR
        LOWER(${schema.vehicles.variant}) LIKE ${searchTerm}
      )`
    ))
    .orderBy(
      desc(schema.vehicles.year),
      asc(schema.vehicles.brand)
    )
    .limit(limit)

  return results
}
