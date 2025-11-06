# Task 1: Database Schema Implementation

**Status**: Pending
**Dependencies**: None
**Estimated Effort**: 3-4 hours

---

## Objective

Implement all database tables, indexes, constraints, and relationships using Drizzle ORM to support the vehicle marketplace.

---

## Scope

### Tables to Implement (7 Core Tables):

1. ✅ `vehicles` - Core vehicle data
2. ✅ `vehicle_specifications` - Filterable/sortable specs
3. ✅ `organizations` - Dealers, agencies, importers
4. ✅ `vehicle_pricing` - Junction table (vehicles ↔ organizations)
5. ✅ `vehicle_images` - Normalized image metadata
6. ⏳ `vehicle_image_variants` - Optional (Phase 2+)
7. ✅ `banks` - Standalone financing partners

### Materialized Views (2):
1. `vehicles_with_media` - Denormalized images (define but don't use in Phase 1)
2. `vehicles_with_pricing` - Denormalized pricing (define but don't use in Phase 1)

---

## Implementation Steps

### 1. Create Drizzle Schema Files

**Location**: `lib/db/schema/`

Create the following schema files:
- `vehicles.ts` - vehicles and vehicle_specifications tables
- `organizations.ts` - organizations table
- `vehicle-pricing.ts` - vehicle_pricing junction table
- `vehicle-images.ts` - vehicle_images and vehicle_image_variants tables
- `banks.ts` - banks table

### 2. vehicles.ts Schema

```typescript
import { pgTable, uuid, text, integer, boolean, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),

  // Basic Info
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  variant: text('variant'),

  // Display-only specs (JSONB)
  specs: jsonb('specs').default({}).notNull(),
  /* Example specs JSONB structure:
  {
    "torque": { "nm": 310, "lbft": 229 },
    "dimensions": {
      "length": 4405,
      "width": 1783,
      "height": 1626,
      "wheelbase": 2610
    },
    "features": ["Autopilot", "Premium Audio", "Heated Seats"],
    "warranty": {
      "vehicle": "4 years / 80,000 km",
      "battery": "8 years / 160,000 km"
    },
    "charging": {
      "ac": { "kW": 11, "time": "8 hours" },
      "dc": { "kW": 150, "time": "30 min to 80%" }
    }
  }
  */

  // Metadata
  description: text('description'),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Future i18n support
  descriptionI18n: jsonb('description_i18n'),
  variantI18n: jsonb('variant_i18n'),
}, (table) => ({
  uniqueSlug: uniqueIndex('unique_slug').on(table.slug),
  uniqueVehicleIdentity: uniqueIndex('unique_vehicle_identity')
    .on(table.brand, table.model, table.year, table.variant)
    .where(table.isPublished.eq(true)),
  brandIdx: index('idx_vehicles_brand').on(table.brand),
  yearIdx: index('idx_vehicles_year').on(table.year.desc()),
  publishedIdx: index('idx_vehicles_published').on(table.isPublished)
    .where(table.isPublished.eq(true)),
}));

export const vehicleSpecifications = pgTable('vehicle_specifications', {
  vehicleId: uuid('vehicle_id').primaryKey().references(() => vehicles.id, { onDelete: 'cascade' }),

  // Range (multi-cycle support)
  rangeKmCltc: integer('range_km_cltc'),              // DEFAULT: Chinese standard
  rangeKmWltp: integer('range_km_wltp'),              // European standard
  rangeKmEpa: integer('range_km_epa'),                // US standard (conservative)
  rangeKmNedc: integer('range_km_nedc'),              // Legacy European
  rangeKmClcReported: integer('range_km_clc_reported'), // FUTURE: User-reported LATAM

  // Battery & Power
  batteryKwh: numeric('battery_kwh', { precision: 5, scale: 1 }),

  // Performance
  acceleration0To100Sec: numeric('acceleration_0_100_sec', { precision: 3, scale: 1 }),
  topSpeedKmh: integer('top_speed_kmh'),
  powerKw: integer('power_kw'),
  powerHp: integer('power_hp'),

  // Charging
  chargingDcKw: integer('charging_dc_kw'),
  chargingTimeDcMin: integer('charging_time_dc_min'),

  // Physical
  seats: integer('seats'),
  weightKg: integer('weight_kg'),
  bodyType: text('body_type').notNull().$type<'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'>(),

  // User Sentiment (computed, Phase 4+)
  sentimentPositivePercent: numeric('sentiment_positive_percent', { precision: 4, scale: 1 }),
  sentimentNeutralPercent: numeric('sentiment_neutral_percent', { precision: 4, scale: 1 }),
  sentimentNegativePercent: numeric('sentiment_negative_percent', { precision: 4, scale: 1 }),

  // Metadata
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  rangeCltcIdx: index('idx_range_cltc').on(table.rangeKmCltc.desc()),
  batteryIdx: index('idx_battery').on(table.batteryKwh.desc()),
  bodyTypeIdx: index('idx_body_type').on(table.bodyType),
  seatsIdx: index('idx_seats').on(table.seats),
  sentimentIdx: index('idx_sentiment').on(table.sentimentPositivePercent.desc()),
  rangeBatteryIdx: index('idx_range_battery').on(table.rangeKmCltc.desc(), table.batteryKwh.desc()),
}));
```

### 3. organizations.ts Schema

```typescript
import { pgTable, uuid, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),

  // Basic Info
  name: text('name').notNull(),
  type: text('type').notNull().$type<'AGENCY' | 'DEALER' | 'IMPORTER'>(),

  // Branding
  logoUrl: text('logo_url'),

  // Contact (JSONB for flexibility)
  contact: jsonb('contact').default({}).notNull(),
  /* Example:
  {
    "phone": "+506-1234-5678",
    "email": "ventas@byd.cr",
    "whatsapp": "+506-8765-4321",
    "address": "San José, Costa Rica"
  }
  */

  // Status/Badges
  official: boolean('official').default(false).notNull(),
  badges: text('badges').array().default([]).notNull(),

  // Display
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Future i18n
  descriptionI18n: jsonb('description_i18n'),
}, (table) => ({
  slugIdx: index('idx_organizations_slug').on(table.slug),
  typeIdx: index('idx_organizations_type').on(table.type),
  activeIdx: index('idx_organizations_active').on(table.isActive)
    .where(table.isActive.eq(true)),
}));
```

### 4. vehicle-pricing.ts Schema

```typescript
import { pgTable, uuid, numeric, text, boolean, jsonb, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';
import { organizations } from './organizations';

export const vehiclePricing = pgTable('vehicle_pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),

  // Pricing
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull().$type<'USD' | 'CRC'>(),

  // Availability (JSONB)
  availability: jsonb('availability').default({}).notNull(),
  /* Example:
  {
    "label": "In Stock",
    "tone": "success",
    "estimated_delivery_days": 30
  }
  */

  // Financing (JSONB, optional per seller)
  financing: jsonb('financing'),
  /* Example:
  {
    "down_payment": 9000.00,
    "monthly_payment": 650.00,
    "term_months": 60,
    "apr_percent": 3.5,
    "display_currency": "USD"
  }
  */

  // Call to Action
  cta: jsonb('cta'),
  /* Example:
  {
    "label": "Contact Dealer",
    "href": "https://wa.me/50612345678?text=Interested%20in%20BYD%20Seagull"
  }
  */

  // Perks/Benefits
  perks: text('perks').array().default([]).notNull(),

  // Display
  emphasis: text('emphasis').default('none').notNull().$type<'none' | 'teal-border' | 'teal-glow'>(),
  displayOrder: integer('display_order').default(0).notNull(),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueActivePricing: uniqueIndex('unique_active_pricing')
    .on(table.vehicleId, table.organizationId)
    .where(table.isActive.eq(true)),
  vehicleIdx: index('idx_vehicle_pricing_vehicle').on(table.vehicleId, table.amount),
  orgIdx: index('idx_vehicle_pricing_org').on(table.organizationId),
  amountIdx: index('idx_vehicle_pricing_amount').on(table.amount),
  activeIdx: index('idx_vehicle_pricing_active').on(table.isActive)
    .where(table.isActive.eq(true)),
}));
```

### 5. vehicle-images.ts Schema

```typescript
import { pgTable, uuid, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';

export const vehicleImages = pgTable('vehicle_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),

  // Storage
  storagePath: text('storage_path').notNull(),       // "cars/byd/seagull/hero.jpg"

  // Display
  displayOrder: integer('display_order').default(0).notNull(),
  isHero: boolean('is_hero').default(false).notNull(),

  // Metadata
  altText: text('alt_text'),
  caption: text('caption'),

  // Timestamps
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  compositeIdx: index('idx_vehicle_images_composite')
    .on(table.vehicleId, table.isHero, table.displayOrder),
}));

export const vehicleImageVariants = pgTable('vehicle_image_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceImageId: uuid('source_image_id').notNull().references(() => vehicleImages.id, { onDelete: 'cascade' }),

  // Variant info
  variantType: text('variant_type').notNull(),       // "thumbnail", "webp", "2x", "mobile"
  storagePath: text('storage_path').notNull(),       // "cars/byd/seagull/hero-thumbnail.webp"

  // Dimensions
  width: integer('width'),
  height: integer('height'),
  format: text('format'),                            // "webp", "avif", "jpg"

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sourceVariantIdx: index('idx_image_variants_source')
    .on(table.sourceImageId, table.variantType),
}));
```

### 6. banks.ts Schema

```typescript
import { pgTable, uuid, text, numeric, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const banks = pgTable('banks', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),

  // Basic Info
  name: text('name').notNull(),
  logoUrl: text('logo_url'),

  // Contact/Links
  websiteUrl: text('website_url'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),

  // Generic Rates (for display only, not vehicle-specific)
  typicalAprMin: numeric('typical_apr_min', { precision: 4, scale: 2 }),
  typicalAprMax: numeric('typical_apr_max', { precision: 4, scale: 2 }),
  typicalTermMonths: integer('typical_term_months').array(),

  // Display
  description: text('description'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_banks_slug').on(table.slug),
  featuredIdx: index('idx_banks_featured')
    .on(table.isFeatured, table.displayOrder)
    .where(table.isFeatured.eq(true)),
}));
```

### 7. Create Materialized Views (SQL)

**Note**: These are defined for future use but NOT queried in Phase 1.

Create file: `lib/db/migrations/materialized-views.sql`

```sql
-- vehicles_with_media materialized view
CREATE MATERIALIZED VIEW vehicles_with_media AS
SELECT
  v.*,
  jsonb_build_object(
    'images', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'url', storage_path,
            'alt', COALESCE(alt_text, v.brand || ' ' || v.model),
            'isHero', is_hero
          ) ORDER BY display_order
        )
        FROM vehicle_images vi
        WHERE vi.vehicle_id = v.id
      ),
      '[]'::jsonb
    ),
    'heroIndex', COALESCE(
      (
        SELECT display_order
        FROM vehicle_images
        WHERE vehicle_id = v.id AND is_hero = true
        LIMIT 1
      ),
      0
    )
  ) as media
FROM vehicles v
WHERE v.is_published = true;

CREATE UNIQUE INDEX idx_vehicles_with_media_id ON vehicles_with_media(id);
CREATE INDEX idx_vehicles_with_media_slug ON vehicles_with_media(slug);

-- vehicles_with_pricing materialized view
CREATE MATERIALIZED VIEW vehicles_with_pricing AS
SELECT
  v.id,
  v.slug,
  v.brand,
  v.model,
  v.year,
  v.variant,
  MIN(vp.amount) as price_min,
  MAX(vp.amount) as price_max,
  COUNT(DISTINCT vp.organization_id) as seller_count,
  (
    SELECT jsonb_build_object(
      'amount', vp2.amount,
      'organization_id', vp2.organization_id,
      'organization_name', o.name
    )
    FROM vehicle_pricing vp2
    JOIN organizations o ON o.id = vp2.organization_id
    WHERE vp2.vehicle_id = v.id
      AND vp2.is_active = true
    ORDER BY vp2.amount ASC
    LIMIT 1
  ) as cheapest_offer
FROM vehicles v
LEFT JOIN vehicle_pricing vp ON vp.vehicle_id = v.id AND vp.is_active = true
WHERE v.is_published = true
GROUP BY v.id;

CREATE UNIQUE INDEX idx_vehicles_with_pricing_id ON vehicles_with_pricing(id);
CREATE INDEX idx_vehicles_with_pricing_price ON vehicles_with_pricing(price_min);
```

---

## Testing Checklist

- [ ] Run `npm run db:generate` to generate migrations
- [ ] Run `npm run db:migrate` to apply migrations
- [ ] Verify all tables created in Supabase dashboard
- [ ] Verify all indexes created
- [ ] Test unique constraints (try inserting duplicate slugs)
- [ ] Test foreign key cascades (delete vehicle, verify pricing deleted)
- [ ] Verify JSONB fields accept valid JSON
- [ ] Test timestamp defaults (should auto-populate on insert)

---

## Success Criteria

✅ All 7 tables created in database
✅ All indexes and constraints working
✅ Foreign key relationships enforced
✅ Materialized views defined (but not used yet)
✅ Drizzle schema generates without errors
✅ Database migrations run successfully

---

## Next Steps

After completing this task, proceed to:
- **Task 2**: i18n & SEO Strategy Implementation
- **Task 3**: Data Fetching Architecture
