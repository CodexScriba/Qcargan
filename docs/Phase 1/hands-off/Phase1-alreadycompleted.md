# Phase 1 - Already Completed (Planning & Analysis)

## Planning Session Started: 2025-11-06

**Objective**: Create production-ready vehicle detail pages displaying real data from Supabase for at least 6 cars from 2 brands.

---

## Planning Status ✅

* [x] Component TypeScript analysis complete
* [x] Architectural decisions finalized
* [x] vehicle_specifications schema defined
* [x] Remaining table schemas defined (vehicles, organizations, pricing, images, banks)
* [x] i18n & SEO strategy defined
* [x] Schema constraints and indexes refined (unique constraints, composite indexes)

---

## Component Analysis Complete ✅

We analyzed all 11 migrated components to extract their TypeScript prop interfaces. This analysis determined the exact data structure requirements for our database schema.

### Components Analyzed:
1. ProductTitle
2. VehicleAllSpecs
3. CarActionButtons
4. SellerCard
5. AgencyCard
6. SeeAllSellersCard
7. FinancingTabs
8. TrafficLightReviews
9. ImageCarousel
10. KeySpecification cards
11. ServicesShowcase

### Key Entities Identified:
- **Vehicle** (20+ fields including specs, media, basic info)
- **Organization** (8+ fields including branding, contact, type)
- **Vehicle Pricing** (Junction table with 10+ fields)
- **Banks** (Simple entity with 4 fields)
- **Reviews** (Placeholder for Phase 4 - deferred)

---

## Architectural Decisions Made ✅

### 1. Images Storage: Three-Tier Architecture
**Decision**: Storage → Normalized Metadata → Denormalized JSON for App

- **Storage Layer**: Supabase Storage bucket `cars/{brand}/{model}/`
  - Handles CDN, compression, on-the-fly transformations

- **Data Layer**: Normalized Postgres tables
  ```sql
  vehicle_images (id, vehicle_id, storage_path, display_order, is_hero, alt_text, caption)
  vehicle_image_variants (id, source_image_id, variant_type, storage_path, width, height, format)
  ```

- **App Layer**: Denormalized JSON via materialized view
  ```typescript
  vehicle.media = {
    images: [{ url, alt, isHero }, ...],
    heroIndex: 0
  }
  ```

**Rationale**: Professional architecture balancing flexibility, performance, and maintainability.

---

### 2. Specs Storage: Hybrid Approach
**Decision**: Separate table for filterable/sortable specs + JSONB for display-only data

- **Structured columns** in `vehicle_specifications` table:
  - Fields users filter/sort by (range, battery, acceleration, price, seats, body_type)
  - Indexed for fast queries

- **JSONB column** in `vehicles` table:
  - Display-only data (dimensions, features, warranty, torque)
  - Flexible schema evolution

**Rationale**: Best of both worlds - query performance where needed, flexibility everywhere else.

---

### 3. Banks: Standalone Entity
**Decision**: No direct FK to vehicles

- Banks table with contact info, website URL, generic rate ranges
- Relationship is: `Bank → Generic Products → User applies for vehicle loan`
- NOT: `Bank → Specific rate for Vehicle X`

**Rationale**: Banks aren't vehicle-specific in marketplace model. Rates depend on user credit, not vehicle.

---

### 4. Organization Contact: JSONB
**Decision**: Store contact info as JSONB for MVP

```sql
contact jsonb  -- { phone, email, whatsapp, address }
```

**Rationale**: Simple for MVP, easy to evolve. Normalize later if needed (Phase 4+).

---

## Key Specifications for Filtering/Sorting ✅

### Context: Costa Rica Market
- Default range testing cycle: **CLTC (China Light-Duty Vehicle Test Cycle)**
- Future: User-reported **CLC (Ciclo Latinoamericano)** based on real-world self-reporting
- Schema must support multiple cycles without future rewrites

### Finalized Filterable Specifications:

1. **Range (Multi-Cycle Support)** ⭐⭐⭐ CRITICAL
   - Separate columns for each testing cycle (CLTC, WLTP, EPA, NEDC, CLC)

2. **Battery Capacity** ⭐⭐⭐ CRITICAL
   - Simple, essential filtering

3. **Acceleration (0-100 km/h)** ⭐⭐ NICE TO HAVE
   - Important for enthusiasts but not majority

4. **Price** ⭐⭐⭐ CRITICAL
   - Stays in vehicle_pricing table (not duplicated)

5. **Seats** ⭐⭐ IMPORTANT
   - Common filter: "5-seater SUVs", "7-seater family EVs"

6. **User Sentiment (Traffic Light)** ⭐⭐⭐ DIFFERENTIATOR
   - Three-percentage approach (positive/neutral/negative)

7. **Body Type (User-Centric Taxonomy)** ⭐⭐⭐ CRITICAL
   - 4 broad categories: SEDAN, CITY, SUV, PICKUP_VAN
   - Optimized for real user behavior

---

## Database Relationships Mapped ✅

```
vehicles (1) ──→ (1) vehicle_specifications
vehicles (1) ──→ (many) vehicle_images
vehicles (1) ──→ (many) vehicle_pricing (many) ──→ (1) organizations

banks (standalone, no FK)
```

---

## i18n Strategy Defined ✅

### Approach: Spanish-First + JSONB for Future

- Store Spanish as primary content
- Add optional JSONB columns for translations later (`description_i18n`, `variant_i18n`)
- Use next-intl for UI labels only

### URL Structure (next-intl configured):
```
Spanish (default, no locale prefix):
  /vehiculos                             → Listings page
  /vehiculos/byd-seagull-freedom-2025    → Vehicle detail

English (with /en/ prefix):
  /en/vehicles                           → Listings page
  /en/vehicles/byd-seagull-freedom-2025  → Vehicle detail (same slug!)
```

### Slug Format: `brand-model-variant-year`
- Examples:
  - `byd-seagull-freedom-2025`
  - `tesla-model-3-long-range-2024`
  - `nissan-leaf-2023` (no variant)

---

## Schema Constraints & Indexes Refined ✅

### Unique Constraints:
```sql
CONSTRAINT unique_slug UNIQUE (slug)
CONSTRAINT unique_vehicle_identity UNIQUE (brand, model, year, variant) WHERE is_published = true
CONSTRAINT unique_active_pricing UNIQUE (vehicle_id, organization_id) WHERE is_active = true
```

### Composite Indexes:
```sql
-- For "best range EVs with big batteries"
CREATE INDEX idx_range_battery ON vehicle_specifications(range_km_cltc DESC, battery_kwh DESC)

-- For vehicle images ordered display
CREATE INDEX idx_vehicle_images_composite ON vehicle_images(vehicle_id, is_hero, display_order)

-- For pricing queries
CREATE INDEX idx_vehicle_pricing_vehicle ON vehicle_pricing(vehicle_id, amount)
```

---

## Materialized Views Strategy ✅

**Decision for Phase 1**: Define views in schema but DON'T query them directly

**Rationale**:
- Phase 1 involves frequent data updates (seeding, testing, corrections)
- Manual `REFRESH MATERIALIZED VIEW` calls are error-prone during rapid iteration
- JOINs are fast enough for 6 vehicles
- Switch to materialized views in Phase 2+ when dataset grows beyond 50 vehicles

**Views Defined** (for future use):
1. `vehicles_with_media` - Denormalized images as JSON
2. `vehicles_with_pricing` - Denormalized pricing aggregates

---

## Document Status: Planning Complete ✅

**Last Updated**: 2025-11-06

**All planning and architectural decisions are complete and approved.** 🎉

The remaining work is implementation (see Task1.md through Task5.md).
