# Task 3: Data Fetching Architecture

**Status**: Pending
**Dependencies**: Task 1 (Database Schema)
**Estimated Effort**: 3-4 hours

---

## Objective

Create query functions using Drizzle ORM to fetch vehicle data from the database. Use Server Components for data fetching in Phase 1.

---

## Scope

### Query Functions to Create:

1. `getVehicleBySlug(slug)` - Single vehicle with all related data
2. `getVehicles(filters, pagination)` - List of vehicles with filtering/sorting
3. `getVehiclePricing(vehicleId)` - All pricing for a vehicle
4. `getOrganizations()` - List of organizations
5. `getBanks()` - List of banks for financing

---

## Implementation Steps

### 1. Create Query File Structure

**Location**: `lib/db/queries/`

Create the following files:
- `vehicles.ts` - Vehicle queries
- `organizations.ts` - Organization queries
- `banks.ts` - Bank queries

### 2. vehicles.ts Query Functions

**File**: `lib/db/queries/vehicles.ts`

```typescript
import { db } from '@/lib/db';
import { vehicles, vehicleSpecifications, vehicleImages, vehiclePricing } from '@/lib/db/schema';
import { organizations } from '@/lib/db/schema/organizations';
import { eq, and, gte, lte, inArray, sql, desc, asc } from 'drizzle-orm';

/**
 * Get a single vehicle by slug with all related data
 */
export async function getVehicleBySlug(slug: string) {
  // Fetch vehicle
  const vehicle = await db.query.vehicles.findFirst({
    where: eq(vehicles.slug, slug),
    with: {
      specifications: true,
    },
  });

  if (!vehicle) return null;

  // Fetch images
  const images = await db.query.vehicleImages.findMany({
    where: eq(vehicleImages.vehicleId, vehicle.id),
    orderBy: [asc(vehicleImages.displayOrder)],
  });

  // Fetch pricing with organizations
  const pricing = await db
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
      organization: {
        id: organizations.id,
        slug: organizations.slug,
        name: organizations.name,
        type: organizations.type,
        logoUrl: organizations.logoUrl,
        contact: organizations.contact,
        official: organizations.official,
        badges: organizations.badges,
      },
    })
    .from(vehiclePricing)
    .leftJoin(organizations, eq(vehiclePricing.organizationId, organizations.id))
    .where(
      and(
        eq(vehiclePricing.vehicleId, vehicle.id),
        eq(vehiclePricing.isActive, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder), asc(vehiclePricing.amount));

  // Build media object
  const heroImage = images.find((img) => img.isHero);
  const heroIndex = heroImage ? images.indexOf(heroImage) : 0;

  const media = {
    images: images.map((img) => ({
      url: img.storagePath,
      alt: img.altText || `${vehicle.brand} ${vehicle.model}`,
      isHero: img.isHero,
    })),
    heroIndex,
  };

  return {
    ...vehicle,
    media,
    pricing,
  };
}

/**
 * Vehicle list filters
 */
export interface VehicleFilters {
  brand?: string;
  bodyType?: string;
  priceMin?: number;
  priceMax?: number;
  rangeMin?: number;
  seatsMin?: number;
  sortBy?: 'price' | 'range' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get list of vehicles with filters and pagination
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
    sortBy = 'newest',
    sortOrder = 'desc',
  } = filters;

  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions = [eq(vehicles.isPublished, true)];

  if (brand) {
    whereConditions.push(eq(vehicles.brand, brand));
  }

  // Fetch vehicles with specifications
  let query = db
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
        batteryKwh: vehicleSpecifications.batteryKwh,
        acceleration0To100Sec: vehicleSpecifications.acceleration0To100Sec,
        seats: vehicleSpecifications.seats,
        bodyType: vehicleSpecifications.bodyType,
        powerKw: vehicleSpecifications.powerKw,
        powerHp: vehicleSpecifications.powerHp,
      },
    })
    .from(vehicles)
    .leftJoin(vehicleSpecifications, eq(vehicles.id, vehicleSpecifications.vehicleId))
    .where(and(...whereConditions));

  // Apply spec filters
  if (bodyType) {
    query = query.where(eq(vehicleSpecifications.bodyType, bodyType));
  }
  if (rangeMin) {
    query = query.where(gte(vehicleSpecifications.rangeKmCltc, rangeMin));
  }
  if (seatsMin) {
    query = query.where(gte(vehicleSpecifications.seats, seatsMin));
  }

  // Apply sorting
  if (sortBy === 'range') {
    query = query.orderBy(
      sortOrder === 'desc'
        ? desc(vehicleSpecifications.rangeKmCltc)
        : asc(vehicleSpecifications.rangeKmCltc)
    );
  } else if (sortBy === 'newest') {
    query = query.orderBy(desc(vehicles.createdAt));
  }

  // Apply pagination
  query = query.limit(limit).offset(offset);

  const results = await query;

  // For each vehicle, fetch hero image and min price
  const enrichedVehicles = await Promise.all(
    results.map(async (vehicle) => {
      // Fetch hero image
      const heroImage = await db.query.vehicleImages.findFirst({
        where: and(
          eq(vehicleImages.vehicleId, vehicle.id),
          eq(vehicleImages.isHero, true)
        ),
      });

      // Fetch min price
      const pricingData = await db
        .select({
          minPrice: sql<number>`MIN(${vehiclePricing.amount})`,
          sellerCount: sql<number>`COUNT(DISTINCT ${vehiclePricing.organizationId})`,
        })
        .from(vehiclePricing)
        .where(
          and(
            eq(vehiclePricing.vehicleId, vehicle.id),
            eq(vehiclePricing.isActive, true)
          )
        )
        .groupBy(vehiclePricing.vehicleId);

      const pricing = pricingData[0] || { minPrice: 0, sellerCount: 0 };

      return {
        ...vehicle,
        heroImage: heroImage
          ? {
              url: heroImage.storagePath,
              alt: heroImage.altText || `${vehicle.brand} ${vehicle.model}`,
            }
          : null,
        pricing: {
          minPrice: Number(pricing.minPrice),
          sellerCount: Number(pricing.sellerCount),
        },
      };
    })
  );

  // Apply price filtering (after fetching pricing data)
  let filteredVehicles = enrichedVehicles;
  if (priceMin !== undefined) {
    filteredVehicles = filteredVehicles.filter(
      (v) => v.pricing.minPrice >= priceMin
    );
  }
  if (priceMax !== undefined) {
    filteredVehicles = filteredVehicles.filter(
      (v) => v.pricing.minPrice <= priceMax
    );
  }

  // Apply price sorting (if requested)
  if (sortBy === 'price') {
    filteredVehicles.sort((a, b) => {
      return sortOrder === 'desc'
        ? b.pricing.minPrice - a.pricing.minPrice
        : a.pricing.minPrice - b.pricing.minPrice;
    });
  }

  return {
    vehicles: filteredVehicles,
    pagination: {
      page,
      limit,
      total: filteredVehicles.length,
      hasMore: filteredVehicles.length === limit,
    },
  };
}

/**
 * Get all pricing for a vehicle
 */
export async function getVehiclePricing(vehicleId: string) {
  return db
    .select({
      id: vehiclePricing.id,
      amount: vehiclePricing.amount,
      currency: vehiclePricing.currency,
      availability: vehiclePricing.availability,
      financing: vehiclePricing.financing,
      cta: vehiclePricing.cta,
      perks: vehiclePricing.perks,
      emphasis: vehiclePricing.emphasis,
      organization: {
        id: organizations.id,
        slug: organizations.slug,
        name: organizations.name,
        type: organizations.type,
        logoUrl: organizations.logoUrl,
        contact: organizations.contact,
        official: organizations.official,
        badges: organizations.badges,
      },
    })
    .from(vehiclePricing)
    .leftJoin(organizations, eq(vehiclePricing.organizationId, organizations.id))
    .where(
      and(
        eq(vehiclePricing.vehicleId, vehicleId),
        eq(vehiclePricing.isActive, true)
      )
    )
    .orderBy(asc(vehiclePricing.displayOrder), asc(vehiclePricing.amount));
}

/**
 * Get all unique brands
 */
export async function getBrands() {
  const result = await db
    .selectDistinct({ brand: vehicles.brand })
    .from(vehicles)
    .where(eq(vehicles.isPublished, true))
    .orderBy(asc(vehicles.brand));

  return result.map((r) => r.brand);
}
```

### 3. organizations.ts Query Functions

**File**: `lib/db/queries/organizations.ts`

```typescript
import { db } from '@/lib/db';
import { organizations } from '@/lib/db/schema/organizations';
import { eq, and } from 'drizzle-orm';

/**
 * Get all active organizations
 */
export async function getOrganizations() {
  return db.query.organizations.findMany({
    where: eq(organizations.isActive, true),
    orderBy: (orgs, { asc }) => [asc(orgs.name)],
  });
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string) {
  return db.query.organizations.findFirst({
    where: and(
      eq(organizations.slug, slug),
      eq(organizations.isActive, true)
    ),
  });
}

/**
 * Get organizations by type
 */
export async function getOrganizationsByType(
  type: 'AGENCY' | 'DEALER' | 'IMPORTER'
) {
  return db.query.organizations.findMany({
    where: and(
      eq(organizations.type, type),
      eq(organizations.isActive, true)
    ),
    orderBy: (orgs, { asc }) => [asc(orgs.name)],
  });
}
```

### 4. banks.ts Query Functions

**File**: `lib/db/queries/banks.ts`

```typescript
import { db } from '@/lib/db';
import { banks } from '@/lib/db/schema/banks';
import { eq, and } from 'drizzle-orm';

/**
 * Get all active banks
 */
export async function getBanks() {
  return db.query.banks.findMany({
    where: eq(banks.isActive, true),
    orderBy: (b, { desc, asc }) => [
      desc(b.isFeatured),
      asc(b.displayOrder),
      asc(b.name),
    ],
  });
}

/**
 * Get featured banks
 */
export async function getFeaturedBanks() {
  return db.query.banks.findMany({
    where: and(eq(banks.isFeatured, true), eq(banks.isActive, true)),
    orderBy: (b, { asc }) => [asc(b.displayOrder), asc(b.name)],
  });
}

/**
 * Get bank by slug
 */
export async function getBankBySlug(slug: string) {
  return db.query.banks.findFirst({
    where: and(eq(banks.slug, slug), eq(banks.isActive, true)),
  });
}
```

---

## Data Fetching Pattern

### Server Components (Recommended for Phase 1)

**Example**: Vehicle detail page

```typescript
// app/[locale]/vehicles/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getVehicleBySlug } from '@/lib/db/queries/vehicles';

export default async function VehicleDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params;

  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <div>
      {/* Render vehicle data */}
      <h1>{vehicle.brand} {vehicle.model}</h1>
      {/* ... */}
    </div>
  );
}
```

**Example**: Vehicle listings page

```typescript
// app/[locale]/vehicles/page.tsx

import { getVehicles, getBrands } from '@/lib/db/queries/vehicles';

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters = {
    brand: typeof params.brand === 'string' ? params.brand : undefined,
    bodyType: typeof params.bodyType === 'string' ? params.bodyType : undefined,
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
    rangeMin: params.rangeMin ? Number(params.rangeMin) : undefined,
    seatsMin: params.seatsMin ? Number(params.seatsMin) : undefined,
    sortBy: (params.sortBy as 'price' | 'range' | 'newest') || 'newest',
  };

  const { vehicles, pagination } = await getVehicles(filters);
  const brands = await getBrands();

  return (
    <div>
      {/* Render vehicles list with filters */}
    </div>
  );
}
```

---

## Caching Strategy (Phase 1)

For Phase 1 with frequent data updates during development:

```typescript
// Use Next.js dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching during development
```

For Phase 2+ (production with stable data):

```typescript
// Enable caching with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// Or use ISR (Incremental Static Regeneration)
export const dynamic = 'force-static';
export async function generateStaticParams() {
  // Return list of slugs to pre-render
  return [
    { slug: 'byd-seagull-freedom-2025' },
    { slug: 'tesla-model-3-long-range-2024' },
    // ...
  ];
}
```

---

## Testing Checklist

- [ ] Create all query files in `lib/db/queries/`
- [ ] Test `getVehicleBySlug()` with valid slug
- [ ] Test `getVehicleBySlug()` with invalid slug (should return null)
- [ ] Test `getVehicles()` with no filters
- [ ] Test `getVehicles()` with brand filter
- [ ] Test `getVehicles()` with price filter
- [ ] Test `getVehicles()` with range filter
- [ ] Test `getVehicles()` with sorting (price, range, newest)
- [ ] Test `getBrands()` returns unique list
- [ ] Test `getOrganizations()` returns only active orgs
- [ ] Test `getBanks()` returns featured banks first

---

## Performance Considerations

### Phase 1 (6 vehicles):
- ✅ Direct JOINs are fast enough
- ✅ `Promise.all` for parallel queries
- ✅ No need for materialized views yet

### Phase 2+ (50+ vehicles):
- ⏳ Consider enabling materialized views
- ⏳ Add database connection pooling
- ⏳ Implement query result caching (Redis)
- ⏳ Monitor query performance with logging

---

## Success Criteria

✅ All query functions implemented and working
✅ Data fetching works in Server Components
✅ Filters and sorting work correctly
✅ Queries return properly typed data
✅ Error handling (null checks, notFound())
✅ Performance is acceptable for 6 vehicles

---

## Next Steps

After completing this task, proceed to:
- **Task 4**: Vehicle Detail Page Implementation
- **Task 5**: Vehicle Listings Page Implementation
