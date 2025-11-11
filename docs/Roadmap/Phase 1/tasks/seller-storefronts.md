# Seller Storefronts Implementation

## Overview
Enable sellers to have dedicated storefront pages showcasing their organization profile and vehicle inventory. This feature helps build trust with buyers and provides sellers with a professional presence on the platform.

---

## Phase 1: Backend + UI Foundation ✅ (Current Phase)

### Objective
Prepare the backend infrastructure and update UI components to support seller storefronts without building the full storefront pages yet.

### Tasks

#### ✅ Task 1.1: Add Database Query for Organization Vehicles
**File**: `lib/db/queries/organizations.ts`

**Implementation**:
- Add `getOrganizationVehicles(organizationId)` function
- Join `vehicle_pricing` → `vehicles` → `vehicle_specifications` → `vehicle_images`
- Filter by active pricing and published vehicles only
- Return vehicle cards data (slug, brand, model, year, hero image, specs, pricing)
- Convert storage paths to public CDN URLs
- Order by `displayOrder` ASC, then `year` DESC

**Type export**: `OrganizationVehicle`

**Dependencies**: Uses existing schema and `getPublicImageUrls` from storage helper

---

#### ✅ Task 1.2: Update SellerCard Component
**File**: `components/product/seller-card.tsx`

**Changes**:
1. Add `slug: string` to `SellerInfo` interface (required field)
2. Remove "See more details" dropdown completely:
   - Remove `isExpanded` state
   - Remove `ChevronDown` icon import
   - Delete entire `CardFooter` dropdown section (or keep empty footer)
3. Make seller name clickable:
   - Wrap name in `Link` component (`/sellers/[slug]`)
   - Add hover underline effect
   - Add tooltip "Visit storefront" on hover
   - Use `text-primary` hover color
   - Add proper focus states for accessibility

**Translation keys used**:
- `sellerCard.viewSellerStorefront` - ARIA label
- `sellerCard.viewStorefront` - Hover tooltip text

---

#### ✅ Task 1.3: Update Vehicle Detail Page
**File**: `app/[locale]/vehicles/[slug]/page.tsx`

**Change**:
- Pass `slug: p.organization.slug` to SellerCard's `seller` prop (line ~112)

---

#### ✅ Task 1.4: Add Translation Keys
**Files**: `messages/en.json`, `messages/es.json`

**New keys**:
```json
{
  "sellerCard": {
    "contact": "Contact / Contactar",
    "viewSellerStorefront": "View {{name}}'s storefront / Ver tienda de {{name}}",
    "viewStorefront": "Visit storefront / Visitar tienda"
  }
}
```

---

#### ✅ Task 1.5: Testing
- Verify seller name is clickable with underline on hover
- Verify tooltip appears on hover
- Verify link navigates to `/sellers/[slug]` (404 expected until Phase 2)
- Verify dropdown is completely removed
- Test mobile responsiveness
- Run TypeScript and build checks

---

## Phase 2: Seller Storefront Pages (Future - After Phase 1 Task 4)

### Objective
Build complete seller storefront pages where buyers can learn about sellers, view their inventory, and contact them directly.

### Pages to Build

#### Page 2.1: Seller Storefront Detail Page
**Route**: `app/[locale]/sellers/[slug]/page.tsx`

**Layout**:
1. **Breadcrumbs**: Home > Sellers > [Seller Name]
2. **Seller Header** (new component):
   - Organization name (large heading)
   - Type badge (Agency/Dealer/Importer)
   - Official dealer badge (if applicable)
   - Description text
   - Contact buttons (Phone, WhatsApp, Email)
   - Location/address (if available)
   - Additional badges (certifications, awards)
3. **Vehicle Inventory Section**:
   - "Available Vehicles" heading
   - Grid of vehicle cards (new `VehicleInventoryCard` component)
   - Empty state if no vehicles: "This seller currently has no vehicles listed. Contact them directly for information."
4. **(Future)** Reviews section for organization reviews

**Data fetching**:
- `getOrganizationBySlug(slug)` - already exists ✅
- `getOrganizationVehicles(organization.id)` - Phase 1 Task 1.1 ✅
- Handle 404 if organization not found

**Metadata**:
- Dynamic title: `{Organization Name} - Qcargan`
- Description: `Browse electric vehicles from {Organization Name}`
- OpenGraph tags

---

#### Page 2.2: Sellers Directory (Optional)
**Route**: `app/[locale]/sellers/page.tsx`

**Purpose**: List all active sellers for discovery

**Layout**:
- Page title "Electric Vehicle Sellers"
- Grid of seller cards (name, type, logo, vehicle count, rating)
- Filter by type (Agency/Dealer/Importer)
- Search by name

**Data fetching**:
- `getOrganizations()` - already exists ✅
- Optionally add vehicle count per organization

---

### Components to Build

#### Component 2.1: SellerHeader
**File**: `components/sellers/seller-header.tsx`

**Props**:
```typescript
interface SellerHeaderProps {
  organization: NonNullable<Organization>
}
```

**Layout**:
- Top row: Name + Type badge + Official badge
- Description paragraph
- Contact buttons row (Phone, WhatsApp, Email with icons)
- Location with MapPin icon
- Additional badges at bottom (if any)

**Styling**: Card with border, padding, responsive flex layout

---

#### Component 2.2: VehicleInventoryCard
**File**: `components/product/vehicle-inventory-card.tsx`

**Purpose**: Display a vehicle from the seller's inventory with link to vehicle detail page

**Props**:
```typescript
interface VehicleInventoryCardProps {
  vehicle: OrganizationVehicle // from Phase 1 query
}
```

**Layout**:
- Hero image (aspect ratio 16:10)
- Vehicle title (Brand Model Variant)
- Year below title
- Key specs row (Range, Battery, Seats with icons)
- Price (large, bold, primary color)
- Perks badges (first 2 only)
- "View Details" button (full width)

**Interactions**:
- Image and title link to `/vehicles/[slug]`
- Button links to `/vehicles/[slug]`
- Hover effects on card

---

#### Component 2.3: Breadcrumbs
**File**: `components/layout/breadcrumbs.tsx`

**Props**:
```typescript
interface BreadcrumbsProps {
  items: Array<{
    label: string
    href?: string // optional for last item
  }>
  className?: string
}
```

**Layout**:
- Horizontal list with ChevronRight separators
- Clickable links for all except last item
- Last item is bold text (current page)
- Muted foreground color
- Hover effect on links

---

### Translation Keys to Add (Phase 2)

**English**:
```json
{
  "common": {
    "home": "Home"
  },
  "sellers": {
    "title": "Sellers",
    "header": {
      "officialBadge": "Official Dealer",
      "type": {
        "agency": "Official Agency",
        "dealer": "Dealer",
        "importer": "Importer"
      },
      "callButton": "Call",
      "emailButton": "Email"
    },
    "inventory": {
      "title": "Available Vehicles",
      "empty": "This seller currently has no vehicles listed.",
      "contactForInfo": "Contact them directly for information about available inventory."
    },
    "index": {
      "title": "Electric Vehicle Sellers",
      "subtitle": "Browse trusted dealers, agencies, and importers"
    },
    "meta": {
      "title": "Electric Vehicle Sellers | Qcargan",
      "description": "Find trusted electric vehicle dealers and importers in Costa Rica"
    }
  },
  "vehicleInventoryCard": {
    "noImage": "No image available",
    "viewDetails": "View Details"
  }
}
```

**Spanish** (equivalent translations)

---

### Technical Implementation Notes

#### Routing
- Use Next.js App Router with localized routes: `[locale]/sellers/[slug]`
- Generate metadata dynamically per organization
- Handle 404 for invalid slugs with `notFound()`

#### Performance
- Server-side rendering for storefront pages (SEO benefit)
- Use `getPublicImageUrls` batch query for hero images
- Consider adding `revalidate` for ISR if traffic grows

#### SEO
- Add structured data (Organization schema) with JSON-LD
- Proper meta tags (title, description, OG image)
- Canonical URLs
- Sitemap generation for seller pages

#### Accessibility
- Proper heading hierarchy (h1 for org name, h2 for sections)
- ARIA labels on contact buttons
- Keyboard navigation support
- Screen reader friendly breadcrumbs

---

### Success Criteria (Phase 2)

- [ ] Sellers have functional storefront pages at `/sellers/[slug]`
- [ ] SellerHeader displays all organization info with contact buttons
- [ ] Vehicle inventory grid shows all vehicles from that seller
- [ ] Empty state displays when seller has no vehicles
- [ ] VehicleInventoryCard links correctly to vehicle detail pages
- [ ] Breadcrumbs work on all storefront pages
- [ ] All pages are localized (Spanish/English)
- [ ] Mobile responsive on all screen sizes
- [ ] Contact buttons open phone/WhatsApp/email correctly
- [ ] TypeScript compiles with no errors
- [ ] Lighthouse score > 90

---

### Future Enhancements (Phase 3+)

#### Reviews & Ratings
- Add `organization_reviews` table
- Display aggregated rating in SellerHeader
- Show individual reviews below inventory
- "Write a Review" CTA for authenticated users

#### Advanced Features
- Seller logo display in header
- Business hours display
- Multiple location support (branches)
- Seller analytics dashboard (views, clicks, inquiries)
- Vehicle filtering on storefront (by price, range, type)
- Seller comparison tool

#### Admin Features
- Seller verification flow
- Badge management (featured, certified, etc.)
- Seller performance metrics

---

## Database Schema (Already Supported)

The current schema in `lib/db/schema/organizations.ts` already supports storefronts:

```typescript
organizations {
  id: uuid (PK)
  slug: text (unique) ✅ for routing
  name: text ✅
  type: 'AGENCY' | 'DEALER' | 'IMPORTER' ✅
  logoUrl: text (optional) ✅ for header
  contact: jsonb ✅ (phone, email, whatsapp, address)
  official: boolean ✅ for badge
  badges: text[] ✅ for certifications
  description: text ✅ for about section
  isActive: boolean ✅ for filtering
  descriptionI18n: jsonb (future localization)
}
```

**No schema changes needed** ✅

---

## File Structure (Phase 2)

```
app/[locale]/sellers/
├── page.tsx                     # Sellers directory (optional)
└── [slug]/
    └── page.tsx                 # Individual seller storefront

components/sellers/
├── seller-header.tsx            # Organization profile header
└── index.ts                     # Barrel export

components/product/
├── vehicle-inventory-card.tsx   # Vehicle card for storefront
└── index.ts                     # Update barrel export

components/layout/
├── breadcrumbs.tsx              # Navigation breadcrumbs
└── index.ts                     # Update barrel export

lib/db/queries/
└── organizations.ts             # getOrganizationVehicles ✅ (Phase 1)

messages/
├── en.json                      # Add seller translations
└── es.json                      # Add seller translations
```

---

## Testing Plan (Phase 2)

### Manual Testing
1. Navigate to `/sellers/volvo-car-cr` (use existing org slug)
2. Verify header displays name, type, contact info
3. Click phone/WhatsApp/email buttons - verify they work
4. Verify vehicle grid displays correctly
5. Click vehicle card - navigate to vehicle detail
6. Test empty state (create org with no vehicles)
7. Test breadcrumbs navigation
8. Switch language - verify translations
9. Test mobile layout on phone
10. Test keyboard navigation and screen reader

### Automated Testing (Optional)
- E2E tests with Playwright for storefront flow
- Component tests for SellerHeader, VehicleInventoryCard, Breadcrumbs
- Query tests for `getOrganizationVehicles`

---

## Estimated Effort

**Phase 1** (Backend + UI changes): **2-3 hours**
- Database query: 30 min
- SellerCard updates: 1 hour
- Vehicle page update: 15 min
- Translations: 15 min
- Testing: 1 hour

**Phase 2** (Full storefront implementation): **1-2 days**
- Seller storefront page: 3 hours
- SellerHeader component: 2 hours
- VehicleInventoryCard component: 2 hours
- Breadcrumbs component: 1 hour
- Translations: 30 min
- Testing: 2 hours
- Polish & mobile: 2 hours

---

## Implementation Order

1. ✅ **Phase 1** (this document) - Complete all backend queries and UI prep
2. **Phase 2** - Build storefront pages after Phase 1 Task 4 completion
3. **Phase 3+** - Reviews, advanced features, seller dashboard

---

## Notes

- Seller storefronts are critical for gaining seller traction on the platform
- Empty storefronts (no vehicles) are acceptable - shows professionalism
- Contact buttons should use external links (phone:, mailto:, wa.me:)
- Breadcrumbs pattern: Home > Sellers > [Seller Name]
- Vehicle cards show pricing from that specific seller
- Future: Allow sellers to customize their storefront (colors, banner, description)
