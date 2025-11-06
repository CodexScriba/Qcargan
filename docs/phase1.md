# Phase 1 Planning: Production-Ready Vehicle Pages

## Planning Session Started: 2025-11-06

**Objective**: Create production-ready vehicle detail pages displaying real data from Supabase for at least 6 cars from 2 brands.

---

## Planning Status

* [x] Component TypeScript analysis complete
* [x] Architectural decisions finalized
* [x] vehicle_specifications schema defined
* [ ] Remaining table schemas defined (vehicles, organizations, pricing, images, banks)
* [ ] Data fetching patterns defined
* [ ] Vehicle detail page specifications complete
* [ ] Vehicle listings page specifications complete
* [ ] Component integration plan complete

**Note**: Phase 0 will document needed changes without implementing them. All schema implementations happen in Phase 1 development.

---

## Planning Notes

**Approach**: We're planning Phase 1 first to determine schema requirements, then will loop back to complete Phase 0 with the correct database structure.

---

## 1. Database Schema Requirements

### Component Analysis Complete ✅

I analyzed all migrated components to extract their TypeScript prop interfaces. Here's what the schema needs to support:

---

### Core Entity: **Vehicle**

**Based on**: `ProductTitle`, `VehicleAllSpecs`, `CarActionButtons`

```typescript
// Minimum fields needed by components:
{
  id: string                    // Primary key
  slug: string                  // URL-friendly identifier (e.g., "tesla-model-3-2024")
  brand: string                 // Make/brand name
  model: string                 // Model name
  year: number                  // Model year
  variant: string               // Trim/variant name (e.g., "Long Range", "Performance")

  // Specifications (nested structure)
  specs: {
    // Range & Battery
    range?: {
      value: number             // Range in km
      method: string            // Testing method (WLTP, EPA, NEDC)
    }
    battery?: {
      kWh: number | null        // Battery capacity in kilowatt-hours
    }

    // Performance
    power?: {
      hp: number                // Horsepower
      kW: number                // Kilowatts
    }
    torque?: {
      nm: number                // Newton-meters
      lbft: number              // Pound-feet
    }
    zeroTo100?: number          // 0-100 km/h acceleration (seconds)
    topSpeed?: number           // Maximum speed (km/h)

    // Charging
    charging?: {
      dc?: {
        kW: number              // DC fast charging power
        time: string            // Time to charge (e.g., "25 min")
      }
      ac?: {
        kW: number              // AC charging power
        time: string            // Time to full charge
      }
    }

    // Physical Dimensions
    dimensions?: {
      length: number            // mm
      width: number             // mm
      height: number            // mm
      wheelbase: number         // mm
    }
    weight?: number             // kg
  }

  // Media
  media: {
    images: string[]            // Array of image URLs
    heroIndex: number           // Index of the hero/primary image
  }

  // Timestamps
  created_at: timestamp
  updated_at: timestamp
}
```

---

### Entity: **Organization** (Sellers/Agencies/Dealers)

**Based on**: `SellerCard`, `AgencyCard`, `SeeAllSellersCard`

```typescript
{
  id: string                    // Primary key
  slug: string                  // URL-friendly identifier
  name: string                  // Organization name
  type: 'AGENCY' | 'DEALER' | 'IMPORTER'

  // Branding
  logo?: string                 // Logo URL from Supabase Storage

  // Badges/certifications
  official?: boolean            // Is this an official dealer/agency?
  badges?: string[]             // Array of badge labels (e.g., "Authorized Dealer")

  // Contact (for future use)
  contact?: {
    phone?: string
    email?: string
    whatsapp?: string
  }

  // Timestamps
  created_at: timestamp
  updated_at: timestamp
}
```

---

### Entity: **Vehicle Pricing** (Junction Table)

**Based on**: `SellerCard`, `AgencyCard`

```typescript
{
  id: string                    // Primary key
  vehicle_id: string            // FK -> vehicles.id
  organization_id: string       // FK -> organizations.id

  // Pricing
  amount: number                // Base price
  currency: 'USD'               // Currency code

  // Availability
  availability_badge?: {
    label: string               // "In Stock", "Pre-Order", "Available Soon"
    tone: 'neutral' | 'info' | 'success' | 'warning'
  }

  // Financing (optional, per seller)
  financing?: {
    down_payment: number        // Down payment amount
    monthly_payment: number     // Estimated monthly payment
    term_months: number         // Loan term in months (e.g., 60)
    apr_percent?: number        // APR if known
    display_currency: 'USD'
  }

  // Call to Action
  cta?: {
    label: string               // Button text (e.g., "Contact Dealer")
    href: string                // Link or WhatsApp deep link
  }

  // Perks/benefits
  perks?: string[]              // Array of perk descriptions (e.g., "Warranty", "Free Service")

  // Display emphasis
  emphasis?: 'teal-border' | 'teal-glow' | 'none'

  // Timestamps
  created_at: timestamp
  updated_at: timestamp
}
```

---

### Entity: **Banks / Financing Options**

**Based on**: `FinancingTabs`

```typescript
{
  id: string                    // Primary key
  name: string                  // Bank name
  logo?: string                 // Bank logo URL

  // Financing rates (could be junction table in production)
  rates?: {
    apr: number                 // Annual percentage rate
    term: number                // Term length in months
  }

  // Timestamps
  created_at: timestamp
  updated_at: timestamp
}
```

---

### Entity: **Reviews** (Placeholder for Phase 4)

**Based on**: `TrafficLightReviews`

```typescript
// Note: Component currently shows hardcoded percentages
// Schema needed for Phase 4:
{
  id: string
  vehicle_id: string            // FK -> vehicles.id
  user_id: string               // FK -> profiles.id
  rating: number                // 1-5 stars
  sentiment: 'positive' | 'neutral' | 'negative'
  comment: string
  verified_purchase: boolean
  created_at: timestamp
}

// Aggregated view needed:
{
  vehicle_id: string
  total_reviews: number
  positive_percent: number      // Calculated
  neutral_percent: number       // Calculated
  negative_percent: number      // Calculated
  average_rating: number        // 1-5
}
```

---

### Supporting Entity: **Accessories/Products** (Phase 6)

**Based on**: `ShowcaseCarousel` usage in `/cars/page.tsx`

```typescript
{
  id: string
  name: string
  description: string
  image: string                 // Image URL
  alt: string                   // Alt text for accessibility
  cta_label: string             // "Shop Now", "Learn More"
  cta_href: string              // Product link
  // ... additional fields TBD in Phase 6
}
```

---

## Database Schema Design

### Tables Needed for Phase 1:

1. **`vehicles`** - Core vehicle data
2. **`organizations`** - Dealers, agencies, importers
3. **`vehicle_pricing`** - Pricing per organization/vehicle (many-to-many junction)
4. **`banks`** - Financing partners
5. **`vehicle_images`** (optional normalized table, or keep as JSON array in vehicles)

### Key Relationships:

```
vehicles (1) ←→ (many) vehicle_pricing (many) ←→ (1) organizations
vehicles (1) ←→ (many) vehicle_images (if normalized)
```

### Schema Notes:

1. **Specs as JSONB**: The `specs` field is deeply nested and optional. Best stored as JSONB in Postgres for flexibility.
2. **Images**: Can be stored as:
   - JSON array in `vehicles.media` (simpler, good for MVP)
   - Separate `vehicle_images` table (more normalized, better for many images)
3. **Pricing as Junction**: `vehicle_pricing` is a junction table linking vehicles to organizations with pricing data.
4. **Currency**: Currently hardcoded to USD. Could be made flexible later.
5. **Availability Badge**: Stored as JSON object in `vehicle_pricing` for flexibility.

---

### Queries Needed for Phase 1:

#### Vehicle Detail Page:
```sql
-- Get vehicle with all pricing/sellers
SELECT v.*,
       json_agg(vp.*) as pricing,
       json_agg(o.*) as organizations
FROM vehicles v
LEFT JOIN vehicle_pricing vp ON v.id = vp.vehicle_id
LEFT JOIN organizations o ON vp.organization_id = o.id
WHERE v.slug = $1
GROUP BY v.id;
```

#### Vehicle Listings Page:
```sql
-- Get all vehicles with primary pricing
SELECT v.*,
       MIN(vp.amount) as min_price,
       COUNT(DISTINCT vp.organization_id) as seller_count
FROM vehicles v
LEFT JOIN vehicle_pricing vp ON v.id = vp.vehicle_id
GROUP BY v.id
ORDER BY v.created_at DESC;
```

#### Filter by Brand:
```sql
SELECT * FROM vehicles
WHERE brand = $1
ORDER BY year DESC, model ASC;
```

#### Filter by Price Range:
```sql
SELECT DISTINCT v.*
FROM vehicles v
JOIN vehicle_pricing vp ON v.id = vp.vehicle_id
WHERE vp.amount BETWEEN $1 AND $2
ORDER BY vp.amount ASC;
```

---

## 2. Vehicle Detail Page (`app/[locale]/vehicles/[slug]/page.tsx`)

### Components to Integrate:
- ProductTitle
- ImageCarousel
- KeySpecification cards
- AgencyCard/SellerCard
- FinancingTabs
- TrafficLightReviews
- CarActionButtons
- ServicesShowcase

### Data Requirements:
*(To be defined)*

### Page Structure:
*(To be defined)*

---

## 3. Vehicle Listings Page (`app/[locale]/vehicles/page.tsx`)

### Features:
- Grid/list view
- Filtering by brand, price range
- Card-based layout
- Responsive design

### Data Requirements:
*(To be defined)*

---

## 4. Technical Implementation Details

### Data Fetching:
*(To be defined)*

### Routing:
*(To be defined)*

### Images:
*(To be defined)*

---

## Next Steps

1. Analyze migrated components to determine data structure requirements
2. Define complete database schema
3. Plan API/data fetching layer
4. Specify page layouts and component integration
5. Return to Phase 0 to implement schema and seeding

---

## Key Findings Summary

### ✅ Step 1: Analyzed TypeScript Props
- Examined all 11 migrated components
- Extracted complete data structure requirements
- Identified all relationships between entities

### ✅ Step 2: Identified Data Fields
- **Vehicle**: 20+ fields including specs, media, basic info
- **Organization**: 8+ fields including branding, contact, type
- **Vehicle Pricing**: Junction table with 10+ fields
- **Banks**: Simple entity with 4 fields
- **Reviews**: Placeholder for Phase 4 (deferred)

### ✅ Step 3: Mapped Relationships
- Vehicles ←→ Organizations (many-to-many via `vehicle_pricing`)
- Vehicles → Images (one-to-many or embedded JSON)
- Organizations → Pricing (one-to-many)
- Banks → Standalone entity (no FK yet)

### ✅ Architectural Decisions Made:

#### 1. **Images Storage: Three-Tier Architecture**
**Decision**: Storage → Normalized Metadata → Denormalized JSON for App

- **Storage Layer**: Supabase Storage bucket `cars/{brand}/{model}/`
  - Handles CDN, compression, on-the-fly transformations
  - Example: `cars/byd/seagull/hero.jpg`

- **Data Layer**: Normalized Postgres tables
  ```sql
  vehicle_images (id, vehicle_id, storage_path, display_order, is_hero, alt_text, caption)
  vehicle_image_variants (id, source_image_id, variant_type, storage_path, width, height, format)
  ```
  - Easy authoring, querying, future variants (webp, thumbnails)

- **App Layer**: Denormalized JSON via materialized view
  ```typescript
  vehicle.media = {
    images: [{ url, alt, isHero }, ...],
    heroIndex: 0
  }
  ```
  - Fast reads, matches component expectations
  - Refresh view on image changes

**Rationale**: Professional architecture balancing flexibility, performance, and maintainability.

---

#### 2. **Specs Storage: Hybrid Approach**
**Decision**: Separate table for filterable/sortable specs + JSONB for display-only data

- **Structured columns** in `vehicle_specifications` table:
  - Fields users filter/sort by (range, battery, acceleration, price, seats, body_type)
  - Indexed for fast queries
  - Strongly typed

- **JSONB column** in `vehicles` table:
  - Display-only data (dimensions, features, warranty, torque)
  - Flexible schema evolution
  - No migrations needed for new fields

**Rationale**: Best of both worlds - query performance where needed, flexibility everywhere else.

---

#### 3. **Banks: Standalone Entity**
**Decision**: No direct FK to vehicles

- Banks table with contact info, website URL, generic rate ranges
- Relationship is: `Bank → Generic Products → User applies for vehicle loan`
- NOT: `Bank → Specific rate for Vehicle X`
- Sellers estimate financing using generic bank rates

**Rationale**: Banks aren't vehicle-specific in marketplace model. Rates depend on user credit, not vehicle. Reduces coupling.

---

#### 4. **Organization Contact: JSONB**
**Decision**: Store contact info as JSONB for MVP

```sql
contact jsonb  -- { phone, email, whatsapp, address }
```

**Rationale**: Simple for MVP, easy to evolve. Normalize later if needed (Phase 4+) for multiple contacts, verification, regional queries.

---

## 🎯 Key Specifications for Filtering/Sorting

### Context: Costa Rica Market
- Default range testing cycle: **CLTC (China Light-Duty Vehicle Test Cycle)**
- Future: User-reported **CLC (Ciclo Latinoamericano)** based on real-world self-reporting
- Schema must support multiple cycles without future rewrites (WLTP, EPA, NEDC, user-reported CLC)

### ✅ Finalized Filterable Specifications:

#### **1. Range (Multi-Cycle Support)** ⭐⭐⭐ CRITICAL
**Decision**: Separate columns for each testing cycle

```sql
range_km_cltc int,              -- DEFAULT: Chinese standard (most complete dataset)
range_km_wltp int,              -- European standard
range_km_epa int,               -- US standard (most conservative)
range_km_nedc int,              -- Legacy European
range_km_clc_reported int,      -- FUTURE: User self-reported Latin American cycle
```

**Rationale**:
- CLTC has best coverage for international vehicles (especially Chinese EVs)
- Leaves room for user-reported CLC without schema rewrites
- Each cycle independently filterable/sortable
- Handles incomplete data gracefully (not all vehicles have all cycles)

**Primary Index**: `CREATE INDEX idx_range_cltc ON vehicle_specifications(range_km_cltc DESC)`

---

#### **2. Battery Capacity** ⭐⭐⭐ CRITICAL
```sql
battery_kwh numeric(5,1),       -- e.g., 75.5 kWh
```
Simple, essential. Indexed for filtering "50+ kWh batteries"

---

#### **3. Acceleration (0-100 km/h)** ⭐⭐ NICE TO HAVE
```sql
acceleration_0_100_sec numeric(3,1),  -- e.g., 4.4 seconds
```
Important for enthusiasts but not majority of buyers. Sortable but rarely filtered.

---

#### **4. Price** ⭐⭐⭐ CRITICAL
**Decision**: Price stays in `vehicle_pricing` table (not duplicated)

**Rationale**:
- Same vehicle has different prices per seller
- Price changes over time
- Filtering requires JOIN but that's acceptable for accuracy

**Implementation**: Use materialized view with computed `price_min` for fast filtering:
```sql
CREATE INDEX idx_pricing_vehicle ON vehicle_pricing(vehicle_id, amount);
```

---

#### **5. Seats** ⭐⭐ IMPORTANT
```sql
seats int,                      -- 2, 4, 5, 7, etc.
```
Common filter: "5-seater SUVs", "7-seater family EVs"

---

#### **6. User Review Count** ❌ REMOVED
**Decision**: Remove from filterable specs

**Rationale**: Redundant with sentiment metrics. Review count displayed on vehicle detail page but not a primary filter.

---

#### **7. User Sentiment (Traffic Light)** ⭐⭐⭐ DIFFERENTIATOR
**Decision**: Three-percentage approach (matches TrafficLight component)

```sql
sentiment_positive_percent numeric(4,1),   -- e.g., 75.5
sentiment_neutral_percent numeric(4,1),    -- e.g., 20.0
sentiment_negative_percent numeric(4,1),   -- e.g., 4.5
```

**Use Cases**:
- Filter: "Show cars with >70% positive sentiment"
- Sort: "Most loved EVs first"
- Badge: "⭐ 85% Recommended by owners"

**Implementation**: Computed via materialized view from `vehicle_reviews` table (Phase 4)

**Index**: `CREATE INDEX idx_sentiment ON vehicle_specifications(sentiment_positive_percent DESC)`

---

#### **8. Body Type (User-Centric Taxonomy)** ⭐⭐⭐ CRITICAL

**Decision**: 4 broad categories optimized for real user behavior

```sql
body_type text CHECK (body_type IN (
  'SEDAN',
  'CITY',           -- Small urban cars (Seagull, e-Up, Spark)
  'SUV',            -- Includes crossovers, compact SUVs, full-size SUVs
  'PICKUP_VAN'      -- Pickups & vans combined
)),
INDEX idx_body_type ON vehicle_specifications(body_type);
```

**Rationale (User Research-Driven)**:
- ✅ "SUV" includes crossovers → most users don't distinguish, prefer seeing more options
- ✅ "City" instead of "hatchback" → clearer intent (urban driving, parking, efficiency)
- ✅ "Pickup & Van" combined → both serve commercial/cargo use cases
- ✅ Avoids missing sales from overly-technical taxonomy
- ✅ Knowledgeable users understand broader categories include subtypes

**Example Mapping**:
- Tesla Model Y → SUV (even though technically "crossover")
- BYD Seagull → CITY
- Ford F-150 Lightning → PICKUP_VAN
- Nissan e-NV200 → PICKUP_VAN
- Tesla Model 3 → SEDAN

**Real-world lesson**: Better to show more results with broad categories than lose buyers to narrow technical distinctions.

---

### Final Schema for `vehicle_specifications`

```sql
CREATE TABLE vehicle_specifications (
  vehicle_id uuid PRIMARY KEY REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Range (multi-cycle support, space for future additions)
  range_km_cltc int,              -- DEFAULT cycle (best coverage)
  range_km_wltp int,              -- European
  range_km_epa int,               -- US (conservative)
  range_km_nedc int,              -- Legacy European
  range_km_clc_reported int,      -- FUTURE: User-reported LATAM cycle

  -- Battery & Power
  battery_kwh numeric(5,1),       -- CRITICAL filter

  -- Performance
  acceleration_0_100_sec numeric(3,1),  -- Nice to have
  top_speed_kmh int,              -- Display only (JSONB candidate)
  power_kw int,                   -- Display only (JSONB candidate)
  power_hp int,                   -- Display only (JSONB candidate)

  -- Charging (important for EVs)
  charging_dc_kw int,             -- Fast charging capability
  charging_time_dc_min int,       -- Time to 80% (DC fast charge)

  -- Physical
  seats int,                      -- IMPORTANT filter
  weight_kg int,                  -- Display only (JSONB candidate)
  body_type text NOT NULL,        -- CRITICAL filter (4 categories)

  -- User Sentiment (computed, Phase 4+)
  sentiment_positive_percent numeric(4,1) DEFAULT NULL,
  sentiment_neutral_percent numeric(4,1) DEFAULT NULL,
  sentiment_negative_percent numeric(4,1) DEFAULT NULL,

  -- Metadata
  updated_at timestamptz DEFAULT now(),

  -- Indexes for filtering/sorting
  CREATE INDEX idx_range_cltc ON vehicle_specifications(range_km_cltc DESC),
  CREATE INDEX idx_battery ON vehicle_specifications(battery_kwh DESC),
  CREATE INDEX idx_body_type ON vehicle_specifications(body_type),
  CREATE INDEX idx_seats ON vehicle_specifications(seats),
  CREATE INDEX idx_sentiment ON vehicle_specifications(sentiment_positive_percent DESC),
  CREATE INDEX idx_range_battery ON vehicle_specifications(range_km_cltc DESC, battery_kwh DESC)  -- Composite for "best range EVs with big batteries"
);
```

**Notes**:
- Fields marked "Display only (JSONB candidate)" could move to `vehicles.specs` JSONB column if not needed for filtering
- Start with columns for Phase 1, optimize/migrate to JSONB later if needed
- `sentiment_*` fields will be NULL until Phase 4 (reviews implementation)
- `range_km_clc_reported` will be NULL until user reporting feature is built

---

## 📦 Remaining Table Schemas

Now let's define the rest of the database structure to complete our Phase 1 architecture.

### 1. `vehicles` Table (Core Entity)

```sql
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,           -- URL-friendly: "byd-seagull-2024"

  -- Basic Info
  brand text NOT NULL,                 -- "BYD", "Tesla", "Nissan"
  model text NOT NULL,                 -- "Seagull", "Model 3", "Leaf"
  year int NOT NULL,                   -- 2024, 2025
  variant text,                        -- "Long Range", "Performance", "GL"

  -- Display-only specs (JSONB)
  specs jsonb DEFAULT '{}'::jsonb,     -- Flexible nested object:
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

  -- Metadata
  description text,                    -- Marketing description
  is_published boolean DEFAULT false,  -- Draft vs published
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints & Indexes
  CONSTRAINT unique_slug UNIQUE (slug),
  CONSTRAINT unique_vehicle_identity UNIQUE (brand, model, year, variant) WHERE is_published = true,
  
  INDEX idx_vehicles_brand (brand),
  INDEX idx_vehicles_year (year DESC),
  INDEX idx_vehicles_published (is_published) WHERE is_published = true
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Relationship**: One vehicle → One vehicle_specifications row (1:1)

---

### 2. `organizations` Table (Dealers, Agencies, Importers)

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,           -- "byd-ecuador", "tesla-costa-rica"

  -- Basic Info
  name text NOT NULL,                  -- "BYD Ecuador", "Tesla Costa Rica"
  type text NOT NULL CHECK (type IN ('AGENCY', 'DEALER', 'IMPORTER')),

  -- Branding
  logo_url text,                       -- Supabase Storage URL

  -- Contact (JSONB for flexibility)
  contact jsonb DEFAULT '{}'::jsonb,   -- { phone, email, whatsapp, address }
  /* Example:
  {
    "phone": "+506-1234-5678",
    "email": "ventas@byd.cr",
    "whatsapp": "+506-8765-4321",
    "address": "San José, Costa Rica"
  }
  */

  -- Status/Badges
  official boolean DEFAULT false,      -- Official authorized dealer?
  badges text[] DEFAULT '{}',          -- ["Authorized Dealer", "5-Star Service"]

  -- Display
  description text,                    -- About the organization
  is_active boolean DEFAULT true,      -- Can be disabled without deleting

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Indexes
  CREATE INDEX idx_organizations_slug ON organizations(slug),
  CREATE INDEX idx_organizations_type ON organizations(type),
  CREATE INDEX idx_organizations_active ON organizations(is_active) WHERE is_active = true
);
```

---

### 3. `vehicle_pricing` Table (Junction: Vehicles ↔ Organizations)

```sql
CREATE TABLE vehicle_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Pricing
  amount numeric(10,2) NOT NULL,       -- Base price: 45000.00
  currency text DEFAULT 'USD' CHECK (currency IN ('USD', 'CRC')),

  -- Availability (JSONB for flexibility)
  availability jsonb DEFAULT '{}'::jsonb,
  /* Example:
  {
    "label": "In Stock",
    "tone": "success",
    "estimated_delivery_days": 30
  }
  */

  -- Financing (JSONB, optional per seller)
  financing jsonb DEFAULT NULL,
  /* Example:
  {
    "down_payment": 9000.00,
    "monthly_payment": 650.00,
    "term_months": 60,
    "apr_percent": 3.5,
    "display_currency": "USD"
  }
  */

  -- Call to Action
  cta jsonb DEFAULT NULL,
  /* Example:
  {
    "label": "Contact Dealer",
    "href": "https://wa.me/50612345678?text=Interested%20in%20BYD%20Seagull"
  }
  */

  -- Perks/Benefits
  perks text[] DEFAULT '{}',           -- ["Warranty", "Free Service", "0 km delivery"]

  -- Display
  emphasis text DEFAULT 'none' CHECK (emphasis IN ('none', 'teal-border', 'teal-glow')),
  display_order int DEFAULT 0,         -- For sorting offers (featured first)

  -- Status
  is_active boolean DEFAULT true,      -- Can be disabled without deleting

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_active_pricing UNIQUE (vehicle_id, organization_id) WHERE is_active = true,

  -- Indexes
  INDEX idx_vehicle_pricing_vehicle (vehicle_id, amount),
  INDEX idx_vehicle_pricing_org (organization_id),
  INDEX idx_vehicle_pricing_amount (amount),
  INDEX idx_vehicle_pricing_active (is_active) WHERE is_active = true
);
```

**Key Insight**: This junction table holds all the pricing variations. Same vehicle can have different prices from different sellers.

---

### 4. `vehicle_images` Table (Normalized Image Metadata)

```sql
CREATE TABLE vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

  -- Storage
  storage_path text NOT NULL,          -- "cars/byd/seagull/hero.jpg"

  -- Display
  display_order int NOT NULL DEFAULT 0,
  is_hero boolean DEFAULT false,       -- Primary/hero image

  -- Metadata
  alt_text text,                       -- "BYD Seagull exterior front view"
  caption text,                        -- "Sleek urban design"

  -- Timestamps
  uploaded_at timestamptz DEFAULT now(),

  -- Indexes
  INDEX idx_vehicle_images_composite (vehicle_id, is_hero, display_order)
);
```

**Storage Path Pattern**: `cars/{brand}/{model}/{filename}`
- Example: `cars/byd/seagull/hero.jpg`
- Example: `cars/tesla/model-3/interior-dashboard.jpg`

**Full URL**: Constructed as `https://{supabase-url}/storage/v1/object/public/vehicles/{storage_path}`

---

### 5. `vehicle_image_variants` Table (Optional, Future-Proofing)

```sql
CREATE TABLE vehicle_image_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_image_id uuid NOT NULL REFERENCES vehicle_images(id) ON DELETE CASCADE,

  -- Variant info
  variant_type text NOT NULL,          -- "thumbnail", "webp", "2x", "mobile"
  storage_path text NOT NULL,          -- "cars/byd/seagull/hero-thumbnail.webp"

  -- Dimensions
  width int,                           -- 800
  height int,                          -- 600
  format text,                         -- "webp", "avif", "jpg"

  -- Timestamps
  created_at timestamptz DEFAULT now(),

  -- Indexes
  CREATE INDEX idx_image_variants_source ON vehicle_image_variants(source_image_id, variant_type)
);
```

**Note**: This table is **optional for Phase 1**. Can be added later when we implement responsive image optimization.

---

### 6. `banks` Table (Standalone Financing Partners)

```sql
CREATE TABLE banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,           -- "banco-nacional-cr", "bac-credomatic"

  -- Basic Info
  name text NOT NULL,                  -- "Banco Nacional de Costa Rica"
  logo_url text,                       -- Bank logo from Supabase Storage

  -- Contact/Links
  website_url text,                    -- "https://www.bncr.fi.cr"
  contact_phone text,
  contact_email text,

  -- Generic Rates (for display only, not vehicle-specific)
  typical_apr_min numeric(4,2),       -- 3.50
  typical_apr_max numeric(4,2),       -- 7.99
  typical_term_months int[],          -- [36, 48, 60, 72]

  -- Display
  description text,                    -- "Costa Rica's leading public bank"
  is_featured boolean DEFAULT false,   -- Show in featured section
  display_order int DEFAULT 0,

  -- Status
  is_active boolean DEFAULT true,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Indexes
  CREATE INDEX idx_banks_slug ON banks(slug),
  CREATE INDEX idx_banks_featured ON banks(is_featured, display_order) WHERE is_featured = true
);
```

**Important**: Banks are **not** linked to vehicles via FK. The `vehicle_pricing.financing` JSONB field contains seller estimates using generic bank rates.

---

## 🔄 Materialized Views (Denormalized for Performance)

### View 1: `vehicles_with_media` (Denormalized Images)

```sql
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

-- Indexes on materialized view
CREATE UNIQUE INDEX idx_vehicles_with_media_id ON vehicles_with_media(id);
CREATE INDEX idx_vehicles_with_media_slug ON vehicles_with_media(slug);

-- Refresh function (call after image uploads or vehicle updates)
CREATE FUNCTION refresh_vehicles_with_media()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY vehicles_with_media;
END;
$$ LANGUAGE plpgsql;
```

**Usage in Drizzle**: Query this view instead of `vehicles` when you need image data.

---

### View 2: `vehicles_with_pricing` (Denormalized Pricing)

```sql
CREATE MATERIALIZED VIEW vehicles_with_pricing AS
SELECT
  v.id,
  v.slug,
  v.brand,
  v.model,
  v.year,
  v.variant,
  -- Price aggregates
  MIN(vp.amount) as price_min,
  MAX(vp.amount) as price_max,
  COUNT(DISTINCT vp.organization_id) as seller_count,
  -- Cheapest offer details
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

-- Indexes
CREATE UNIQUE INDEX idx_vehicles_with_pricing_id ON vehicles_with_pricing(id);
CREATE INDEX idx_vehicles_with_pricing_price ON vehicles_with_pricing(price_min);
```

**Usage**: For listings page with price filters and sorting.

---

## 📊 Schema Summary

### Core Tables (7):
1. ✅ `vehicles` - Core vehicle data
2. ✅ `vehicle_specifications` - Filterable/sortable specs (already defined)
3. ✅ `organizations` - Dealers, agencies, importers
4. ✅ `vehicle_pricing` - Junction: vehicles ↔ organizations with pricing
5. ✅ `vehicle_images` - Normalized image metadata
6. ⏳ `vehicle_image_variants` - Optional, Phase 2+
7. ✅ `banks` - Standalone financing partners

### Materialized Views (2):
1. ✅ `vehicles_with_media` - Denormalized images as JSON
2. ✅ `vehicles_with_pricing` - Denormalized pricing aggregates

### Relationships:
```
vehicles (1) ──→ (1) vehicle_specifications
vehicles (1) ──→ (many) vehicle_images
vehicles (1) ──→ (many) vehicle_pricing (many) ──→ (1) organizations

banks (standalone, no FK)
```

---

## Conversation Log

**User**: Let's do phase 1 to determine things about the schema first, and then we go back to complete phase 0. Create a file name phase1.md to keep our conversation going.

**Agent**: File created. Ready to start planning Phase 1 to determine schema requirements.

**User**: Excellent instincts, let's start by analyzing current component to understand typescript props since they're vital for the schema. Complete your first 1 2 3 steps. You can do all 3 at in order in any way you want report back your findings.

**Agent**: ✅ Completed analysis of 11 components. Extracted complete TypeScript interfaces and data requirements. Updated phase1.md with detailed schema design including entities, relationships, and queries.
