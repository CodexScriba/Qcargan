# QuéCargan Development Roadmap v2

> **Status**: Building step-by-step

---

## What's Currently Working ✅

### Core Infrastructure
- **Next.js 16** with App Router and proxy middleware convention
- **React 19** with Server Components
- **Bun** as package manager and runtime
- **TypeScript 5** across the full stack

### Authentication & Authorization
- Email/password sign-up and login flows
- Forgot password and update password flows
- Localized auth pages (Spanish/English)
- Session management with Supabase SSR
- Protected routes with middleware
- Username system with availability checks
- Profile management (username, display name)

**Pending Auth Improvements:**
- Google OAuth one-click sign-on
- Facebook OAuth one-click sign-on
- Third-party authentication testing

### Database & Backend
- **Supabase** integration with SSR support
- **Drizzle ORM** with type-safe queries
- Multi-organization schema with RLS
  - Organizations table (agencies, dealers, importers, etc.)
  - Organization members with roles (owner, admin, staff, member)
  - Profiles table with user metadata
- Database migrations working
- Connection pooling configured

### Internationalization (i18n)
- **next-intl** fully configured
- Spanish (default) and English locales
- Localized routing with pathname translations
- Locale-aware navigation helpers
- Translation messages for auth flows
- `as-needed` locale prefixing working

### UI Components & Styling
- **Tailwind CSS v4** with design tokens
- **shadcn/ui** component library integrated
- **Radix UI** primitives
- **next-themes** for dark/light mode
- Poppins font family loaded via next/font

#### Layout Components
- Responsive navbar (desktop/tablet/mobile variants)
- Theme switcher
- Language switcher
- Logo component

#### Product Components

_(None currently migrated to new project)_

#### UI Components
- SectionTitle - reusable section headings
- ShowcaseCarousel - configurable card carousel
- FinancingTabs - bank financing display
- Form components with validation

### Pages Implemented
- Localized homepage (es/en)
- Auth pages (login, sign-up, forgot password, update password, success, error)
- Protected area with profile demo
- Storage demo page
- Vehicle detail showcase page (`/cars`)
- Test/pricing pages

---

## Phase 0: Migration from Old Project

### Components to Migrate (from `/home/cynic/workspace/quecargan`)

#### Product Components (`components/product/`)

- `product-title.tsx` - vehicle title display
- `agency-card.tsx` - pricing display for dealers
- `car-action-buttons.tsx` - favorite/compare buttons (UI ready, needs backend)
- `seller-card.tsx` - seller info card
- `see-all-sellers-card.tsx` - CTA card for seller directory
- `vehicle-all-specs.tsx` - full specifications display
- `index.ts` - barrel export

#### Review Components (`components/reviews/`)

- `TrafficLightReviews.tsx` - ratings aggregation & display
- `TrafficLight.tsx` - individual traffic light rating component

#### Showcase Components (`components/showcase/`)

- `showcase-carousel.tsx` - configurable card carousel (✅ migrated)
- `index.ts` - barrel export

#### Agency/Pricing Component (root `components/`)

- `agency-card.tsx` - standalone agency card (may be duplicate of product version)

#### Car Page Components (`app/[locale]/cars/`)

- `page.tsx` - main vehicle detail page
- `KeySpecification.tsx` - spec tile with icon
- `ServicesShowcase.tsx` - EV services display section

#### Scripts to Migrate/Reference (`scripts/`)

- `migrate-profiles.ts` - reference for auth.users → profiles sync
- `check-profiles-unique.ts` - reference for validation patterns
- `utils/` - shared utilities (may need adaptation)

**Note**: Will create NEW production-quality seeding script from scratch

### New Data Seeding Script (Production Quality)

**Create**: `scripts/seed-production-vehicles.ts`

#### Script Requirements

- Seed 6 complete vehicle records with real/realistic data
- Create 2 brand/organization records (dealers or importers)
- Upload vehicle images to Supabase Storage
- Link vehicles to organizations with pricing
- Include full specifications (battery, range, features, dimensions)
- Add bank financing options
- Ensure all data is production-ready (no "Lorem ipsum" or fake placeholders)

#### Data Quality Standards

- Real vehicle makes/models/years
- Accurate specifications and pricing
- Professional images or high-quality placeholders
- Proper slug generation for SEO-friendly URLs
- Complete metadata for all fields

#### Script Should Handle

- Idempotent operations (safe to re-run)
- Image upload with error handling
- Proper foreign key relationships
- Validation of required fields
- Clear console output showing progress

### Schema & Database Verification

- Compare Drizzle schemas between old and new projects
- Verify RLS policies match
- Ensure vehicle/pricing/organizations tables exist and match requirements
- Validate foreign key constraints
- Test data queries work with Drizzle ORM

---

## Phase 0: Detailed Task Breakdown

### Task Group 1: Database Schema & Setup

#### Task 1.1: Schema Audit
**Goal**: Ensure database schema supports all Phase 1 requirements

- [ ] Review old project's Drizzle schema files (`drizzle/schema.ts` or similar)
- [ ] Document all tables needed for vehicles: `vehicles`, `vehicle_pricing`, `vehicle_specifications`, `vehicle_images`
- [ ] Check if organizations/brands tables are complete
- [ ] Verify enums exist: `body_type`, `fuel_type`, `transmission_type`, etc.
- [ ] List any missing tables or columns

**Deliverable**: Document comparing old vs new schemas, list of gaps

#### Task 1.2: Schema Migration (if needed)
**Goal**: Add any missing tables/columns to new project

- [ ] Create Drizzle migration files for missing tables
- [ ] Add missing columns to existing tables
- [ ] Define proper indexes for query performance (slug, organization_id, etc.)
- [ ] Add foreign key constraints
- [ ] Run `drizzle-kit push` to apply to Supabase

**Deliverable**: Updated schema matching requirements, migration files in git

#### Task 1.3: RLS Policy Setup
**Goal**: Secure data access with Row Level Security

- [ ] Review RLS policies from old project
- [ ] Create/update policies for `vehicles` (public read, authenticated write for owners)
- [ ] Create/update policies for `organizations` (public read, member write)
- [ ] Create/update policies for `vehicle_pricing` (public read, org admin write)
- [ ] Test policies with different user roles

**Deliverable**: RLS policies documented and applied in Supabase

#### Task 1.4: Storage Bucket Setup
**Goal**: Prepare Supabase Storage for vehicle images

- [ ] Create `vehicle-images` bucket in Supabase Storage
- [ ] Set bucket to public read access
- [ ] Configure allowed file types (jpg, png, webp)
- [ ] Set file size limits (e.g., 5MB max)
- [ ] Test upload/read with sample image

**Deliverable**: Storage bucket ready, test upload successful

---

### Task Group 2: Component Migration

#### Task 2.1: Migrate Product Components
**Goal**: Copy and adapt product components from old project

**For each component:**
- [ ] `product-title.tsx` - Copy to `components/product/`, update imports for new project paths
- [ ] `agency-card.tsx` - Copy to `components/product/`, verify Supabase data types match
- [ ] `seller-card.tsx` - Copy to `components/product/`, update styling tokens if needed
- [ ] `see-all-sellers-card.tsx` - Copy to `components/product/`
- [ ] `vehicle-all-specs.tsx` - Copy to `components/product/`, ensure spec fields align with schema
- [ ] `car-action-buttons.tsx` - Copy to `components/product/`, mark backend integration as TODO

**Per component checklist:**
- Update import paths (`@/lib/...`, `@/components/...`)
- Verify TypeScript types compile
- Check CSS/design tokens work with Tailwind v4
- Test component renders in isolation (create test page if needed)

**Deliverable**: All product components migrated and compiling

#### Task 2.2: Migrate Review Components
**Goal**: Copy review/rating components

- [ ] `TrafficLightReviews.tsx` - Copy to `components/reviews/`
- [ ] `TrafficLight.tsx` - Copy to `components/reviews/`
- [ ] Update imports and types
- [ ] Verify components render (even with placeholder data)

**Deliverable**: Review components ready for Phase 1 integration

#### Task 2.3: Migrate Car Page Components
**Goal**: Copy page-specific components

- [ ] `KeySpecification.tsx` - Copy from old `/cars/` to new `components/product/` (promote to shared)
- [ ] `ServicesShowcase.tsx` - Copy from old `/cars/` to new `components/product/`
- [ ] Update imports and ensure they use design tokens
- [ ] Test rendering with sample data

**Deliverable**: Car page components available for use

#### Task 2.4: Create Component Index/Exports
**Goal**: Make components easy to import

- [ ] Create `components/product/index.ts` barrel export
- [ ] Create `components/reviews/index.ts` barrel export
- [ ] Update existing `components/showcase/index.ts` if needed
- [ ] Test imports work: `import { ProductTitle, AgencyCard } from '@/components/product'`

**Deliverable**: Clean import paths for all migrated components

---

### Task Group 3: Data Seeding Script

#### Task 3.1: Define Vehicle Data Structure
**Goal**: Plan the 6 vehicles and 2 brands with realistic data

- [ ] Choose 2 real brands (e.g., BYD, Tesla / Nissan, Hyundai)
- [ ] Select 3 vehicle models per brand (e.g., BYD Dolphin, Seal, Atto 3)
- [ ] Research and document accurate specs for each:
  - Make, model, year, trim
  - Price range
  - Battery capacity, range
  - Dimensions, weight
  - Features list
  - Body type, transmission, fuel type
- [ ] Source 3-5 images per vehicle (or note placeholder URLs)
- [ ] Define slugs (e.g., `byd-dolphin-2024`, `tesla-model-3-2024`)

**Deliverable**: JSON or markdown file with structured data for 6 vehicles

#### Task 3.2: Create Organizations/Brands Data
**Goal**: Define the 2 dealer/importer organizations

- [ ] Organization 1: Name, type (DEALER/IMPORTER), contact info, description
- [ ] Organization 2: Name, type, contact info, description
- [ ] Define capabilities for each (e.g., `SELL_VEHICLES`, `IMPORT_VEHICLES`)
- [ ] Prepare logo images or URLs
- [ ] Define slugs (e.g., `byd-ecuador`, `tesla-motors-ecuador`)

**Deliverable**: Organization data structured and ready for seeding

#### Task 3.3: Write Seeding Script Skeleton
**Goal**: Create `scripts/seed-production-vehicles.ts` structure

- [ ] Set up file with imports (Drizzle, Supabase client, schema)
- [ ] Create main async function
- [ ] Add command-line helpers (e.g., `--reset` flag to clear data first)
- [ ] Set up database connection using `lib/db` patterns
- [ ] Add error handling and logging utilities
- [ ] Structure script sections:
  - Organizations seeding
  - Vehicles seeding
  - Vehicle specifications seeding
  - Vehicle pricing seeding
  - Image uploads
  - Verification queries

**Deliverable**: Script skeleton ready to fill with logic

#### Task 3.4: Implement Organization Seeding
**Goal**: Seed 2 organizations into database

- [ ] Write upsert logic for organizations table (use slug as unique key)
- [ ] Handle existing organizations (update vs insert)
- [ ] Upload organization logos to Supabase Storage (if applicable)
- [ ] Log success/failure for each organization
- [ ] Return organization IDs for linking to vehicles

**Deliverable**: Organizations seed correctly when script runs

#### Task 3.5: Implement Vehicle Seeding
**Goal**: Seed 6 vehicles into database

- [ ] Write upsert logic for vehicles table (slug as unique key)
- [ ] Link each vehicle to correct organization
- [ ] Set fields: make, model, year, trim, body_type, etc.
- [ ] Generate SEO-friendly slugs programmatically (if not hardcoded)
- [ ] Log each vehicle creation
- [ ] Return vehicle IDs for linking specs/pricing/images

**Deliverable**: Vehicles seed correctly with basic data

#### Task 3.6: Implement Specifications Seeding
**Goal**: Add detailed specs for each vehicle

- [ ] Write insert logic for `vehicle_specifications` table
- [ ] Link specs to vehicle IDs
- [ ] Include: battery_capacity, range, charging_time, dimensions, weight, features
- [ ] Handle JSON fields if schema uses JSONB for flexible data
- [ ] Log spec creation per vehicle

**Deliverable**: Each vehicle has complete specifications

#### Task 3.7: Implement Pricing Seeding
**Goal**: Add pricing per organization/dealer

- [ ] Write insert logic for `vehicle_pricing` table
- [ ] Link pricing to both vehicle_id and organization_id
- [ ] Set base_price, discount pricing, currency
- [ ] Add availability status (in_stock, available, pre_order)
- [ ] Handle multiple pricing tiers if needed (base, premium, fully_loaded)
- [ ] Log pricing creation

**Deliverable**: Each vehicle has pricing from assigned dealer

#### Task 3.8: Implement Image Uploads
**Goal**: Upload vehicle images to Supabase Storage

- [ ] Fetch images from URLs or local files
- [ ] Upload to `vehicle-images` bucket with naming: `{slug}/{image-number}.jpg`
- [ ] Store public URLs in `vehicle_images` table
- [ ] Link images to vehicle_id
- [ ] Set image order (hero image = position 0)
- [ ] Handle upload errors gracefully (retry logic or skip)
- [ ] Log upload progress

**Deliverable**: All vehicles have images accessible via public URLs

#### Task 3.9: Add Verification & Summary
**Goal**: Script confirms data integrity after seeding

- [ ] Query organizations count (should be 2)
- [ ] Query vehicles count (should be 6)
- [ ] Query each vehicle to confirm: specs exist, pricing exists, images exist
- [ ] Print summary table to console
- [ ] Exit with success code if all checks pass

**Deliverable**: Script outputs clear success/failure summary

#### Task 3.10: Test & Document Script
**Goal**: Ensure script is production-ready

- [ ] Run script on clean database (test creation)
- [ ] Run script again (test idempotency - should not duplicate)
- [ ] Test `--reset` flag to clear and re-seed
- [ ] Add README or inline comments explaining usage
- [ ] Add to `package.json` scripts: `"seed:vehicles": "bun run scripts/seed-production-vehicles.ts"`

**Deliverable**: Working, documented script ready for team use

---

### Task Group 4: Validation & Testing

#### Task 4.1: Manual Data Verification
**Goal**: Confirm seeded data is correct

- [ ] Open Supabase dashboard, check `vehicles` table (6 rows)
- [ ] Check `organizations` table (2 rows)
- [ ] Check `vehicle_specifications` table (6 rows)
- [ ] Check `vehicle_pricing` table (6+ rows depending on org links)
- [ ] Check `vehicle_images` table (18-30 rows for 3-5 images per vehicle)
- [ ] Verify images are viewable via public URLs

**Deliverable**: Screenshot or checklist confirming all data present

#### Task 4.2: Test Drizzle Queries
**Goal**: Ensure Phase 1 data fetching will work

- [ ] Write test query: Fetch all vehicles with organization name (join)
- [ ] Write test query: Fetch single vehicle by slug with all specs, pricing, images
- [ ] Write test query: Fetch vehicles filtered by organization
- [ ] Write test query: Fetch vehicles sorted by price
- [ ] Confirm queries return expected data
- [ ] Document query patterns in `docs/` or inline comments

**Deliverable**: Confirmed Drizzle queries work for Phase 1 needs

#### Task 4.3: Component Smoke Tests
**Goal**: Verify migrated components render

- [ ] Create test page: `app/test-components/page.tsx`
- [ ] Import and render each product component with sample props
- [ ] Check for TypeScript errors
- [ ] Check for runtime errors in browser
- [ ] Verify styling looks correct (responsive, theme support)
- [ ] Delete or disable test page before Phase 1

**Deliverable**: All components render without errors

---

### Phase 0 Completion Checklist

**Before moving to Phase 1:**

- [ ] Database schema matches requirements (all tables, columns, indexes)
- [ ] RLS policies applied and tested
- [ ] Storage bucket configured and tested
- [ ] All product components migrated and compiling
- [ ] All review components migrated and compiling
- [ ] All car page components migrated and compiling
- [ ] Component exports/indexes created
- [ ] Seeding script created and tested
- [ ] 6 vehicles seeded with complete data
- [ ] 2 organizations seeded
- [ ] All images uploaded to Storage
- [ ] Drizzle queries tested and working
- [ ] Documentation updated (schema changes, script usage)

**Estimated Effort**: 3-5 days (depending on team size and schema complexity)

---

## Phase 1: Production-Ready Vehicle Pages (6 Cars, 2 Brands)

### Objective
Create production-ready vehicle detail pages displaying real data from Supabase for at least 6 cars from 2 brands.

### Data Requirements

#### Vehicles
- 6 vehicle records with complete data:
  - Basic info (make, model, year, trim, price)
  - Full specifications (engine, battery, range, dimensions, features)
  - Multiple images per vehicle (hero image + gallery)
  - Pricing details with agency/dealer associations

#### Brands/Organizations
- 2 organization records (dealers/importers)
  - Organization profile data
  - Contact information
  - Branding assets (logos, colors)

#### Supporting Data
- Bank financing options
- Service provider information (if applicable)
- Pricing tiers and availability

### Pages to Build

#### Vehicle Detail Page (`app/[locale]/vehicles/[slug]/page.tsx`)
- Dynamic route for individual vehicles
- Server-side data fetching from Supabase
- Displays:
  - ProductTitle component
  - Image gallery (ImageCarousel)
  - Key specifications (KeySpecification cards)
  - Pricing cards (AgencyCard/SellerCard)
  - Financing options (FinancingTabs)
  - Reviews placeholder (TrafficLightReviews)
  - Action buttons (favorites/compare)
  - Services showcase section

#### Vehicle Listings/Browse Page (`app/[locale]/vehicles/page.tsx`)
- Grid/list view of all 6 vehicles
- Basic filtering (by brand, price range)
- Card-based layout linking to detail pages
- Responsive design (desktop/tablet/mobile)

### Technical Implementation

#### Data Fetching
- Server Components for initial page load
- Drizzle ORM queries with proper joins
- Optimized queries for performance
- Proper error handling and loading states

#### Routing
- Localized routes (es/en)
- SEO-friendly slugs
- Metadata generation for each vehicle
- Proper 404 handling for invalid slugs

#### Images
- Supabase Storage integration
- Optimized Next.js Image component
- Responsive images with proper aspect ratios
- Lazy loading for galleries

#### Styling & UX
- Consistent with design system tokens
- Mobile-first responsive design
- Loading skeletons
- Smooth transitions and animations

### Success Criteria
- ✅ 6 unique vehicles with complete data in Supabase
- ✅ 2 brands/organizations properly linked
- ✅ All vehicle detail pages render with real data
- ✅ Listings page shows all vehicles
- ✅ Images load from Supabase Storage
- ✅ Pricing displays correctly per dealer
- ✅ Pages are localized (es/en)
- ✅ Mobile responsive
- ✅ No hardcoded data, everything from database

---

## Phase 2: Polish & Production Readiness (1-2 weeks)

### Objective
Make Phase 1 pages production-ready with proper error handling, SEO, and basic observability.

### Key Tasks

#### 2.1: Error Handling & Edge Cases
- [ ] Add 404 pages for invalid vehicle slugs (localized)
- [ ] Create error boundaries for component failures
- [ ] Add loading skeletons for vehicle pages
- [ ] Handle empty states (no vehicles, no pricing, no images)
- [ ] Add retry logic for failed data fetches
- [ ] Test with missing/corrupt data scenarios

**Deliverable**: Pages gracefully handle all error scenarios

#### 2.2: SEO Optimization
- [ ] Add `generateMetadata()` for vehicle detail pages (title, description, OG tags)
- [ ] Generate dynamic sitemaps for vehicles
- [ ] Add structured data (JSON-LD) for vehicles (Product schema)
- [ ] Optimize image `alt` tags with vehicle descriptions
- [ ] Add canonical URLs
- [ ] Test with Google Rich Results validator

**Deliverable**: Vehicle pages are SEO-optimized and discoverable

#### 2.3: Performance Optimization
- [ ] Implement image optimization (Next.js Image component with proper sizing)
- [ ] Add lazy loading for below-fold content
- [ ] Optimize Drizzle queries (select only needed fields, proper indexes)
- [ ] Add static generation for vehicle pages (`generateStaticParams`)
- [ ] Measure Core Web Vitals (LCP, CLS, FID)
- [ ] Achieve Lighthouse score > 90

**Deliverable**: Fast, performant pages meeting Web Vitals standards

#### 2.4: Basic Observability
- [ ] Set up Sentry project and configure error tracking
- [ ] Add Sentry to vehicle pages and data fetching
- [ ] Set up PostHog project for analytics
- [ ] Track basic events (page views, vehicle detail views, filter usage)
- [ ] Create PostHog dashboard for key metrics
- [ ] Set up alerts for error rate spikes

**Deliverable**: Error tracking and basic analytics operational

#### 2.5: Mobile & Accessibility
- [ ] Test all pages on mobile devices (iOS/Android)
- [ ] Fix responsive layout issues
- [ ] Add ARIA labels to interactive elements
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Fix contrast ratio issues

**Deliverable**: Fully accessible, mobile-responsive pages

### Success Criteria
- [ ] All error scenarios handled gracefully
- [ ] Vehicle pages rank in Google with proper rich results
- [ ] Lighthouse score > 90 on mobile and desktop
- [ ] Sentry capturing errors with proper context
- [ ] PostHog tracking core user journeys
- [ ] WCAG 2.1 AA compliance

---

## Phase 3: Buyer Engagement Features (2-3 weeks)

### Objective
Enable users to save favorites, compare vehicles, and return to saved searches.

### Database Schema

#### 3.1: Add Engagement Tables
- [ ] Create `user_favorites` table (user_id, vehicle_id, created_at)
- [ ] Create `user_comparisons` table (user_id, vehicle_id, position, created_at)
- [ ] Create `saved_searches` table (user_id, filters JSON, name, created_at)
- [ ] Add RLS policies (users can only access their own data)
- [ ] Add indexes for performance (user_id, vehicle_id)
- [ ] Run migrations

**Deliverable**: Database ready for engagement features

### API Endpoints

#### 3.2: Favorites API
- [ ] `POST /api/favorites` - Add vehicle to favorites
- [ ] `DELETE /api/favorites/[id]` - Remove from favorites
- [ ] `GET /api/favorites` - List user's favorites
- [ ] Add authentication checks (requires logged-in user)
- [ ] Add validation (vehicle exists, not already favorited)
- [ ] Add error handling and rate limiting

**Deliverable**: Working favorites API with authentication

#### 3.3: Comparisons API
- [ ] `POST /api/comparisons` - Add vehicle to comparison list (max 3-4)
- [ ] `DELETE /api/comparisons/[id]` - Remove from comparison
- [ ] `GET /api/comparisons` - Get comparison list with full vehicle data
- [ ] Add position ordering (users can reorder)
- [ ] Add max limit enforcement (3-4 vehicles)

**Deliverable**: Working comparisons API

#### 3.4: Saved Searches API
- [ ] `POST /api/searches` - Save current search filters
- [ ] `GET /api/searches` - List saved searches
- [ ] `DELETE /api/searches/[id]` - Delete saved search
- [ ] Store filter state as JSON (brand, price range, etc.)

**Deliverable**: Working saved searches API

### Frontend Components

#### 3.5: Favorites UI Integration
- [ ] Update `CarActionButtons` component with favorites logic
- [ ] Add optimistic UI updates (immediate feedback)
- [ ] Show filled heart icon for favorited vehicles
- [ ] Add toast notifications (added/removed)
- [ ] Handle authentication required state (redirect to login)

**Deliverable**: Functional favorites button on all vehicle cards

#### 3.6: Comparisons UI Integration
- [ ] Update `CarActionButtons` with compare logic
- [ ] Add comparison drawer/modal (bottom sheet with selected vehicles)
- [ ] Show selected count (e.g., "2/3 vehicles selected")
- [ ] Add "View Comparison" CTA when 2+ vehicles selected
- [ ] Handle max limit (disable button when full)

**Deliverable**: Functional compare button with selection UI

#### 3.7: Comparison Page
- [ ] Create `/[locale]/compare` page
- [ ] Display vehicles side-by-side in table format
- [ ] Show key specs for easy comparison (price, range, battery, etc.)
- [ ] Add "Remove" button per vehicle
- [ ] Make responsive (stack vertically on mobile)
- [ ] Add empty state ("Add vehicles to compare")

**Deliverable**: Full comparison page experience

### User Dashboard

#### 3.8: Dashboard Layout
- [ ] Create `/[locale]/dashboard` layout with navigation
- [ ] Add sidebar/tabs: Favorites, Comparisons, Saved Searches, Profile
- [ ] Protect routes (require authentication)
- [ ] Add breadcrumbs and page titles
- [ ] Style consistently with rest of app

**Deliverable**: Dashboard shell with navigation

#### 3.9: Favorites Dashboard
- [ ] Create `/[locale]/dashboard/favorites` page
- [ ] Display grid of favorited vehicles
- [ ] Add remove button per vehicle
- [ ] Add "View Details" link to vehicle page
- [ ] Show empty state (no favorites yet)
- [ ] Add filters/sorting (date added, price, etc.)

**Deliverable**: Favorites management page

#### 3.10: Saved Searches Dashboard
- [ ] Create `/[locale]/dashboard/searches` page
- [ ] List saved searches with name and filters summary
- [ ] Add "Run Search" button (redirects to listings with filters)
- [ ] Add edit/delete functionality
- [ ] Show empty state

**Deliverable**: Saved searches management page

### Success Criteria
- [ ] Users can favorite/unfavorite vehicles
- [ ] Users can add up to 3-4 vehicles to comparison
- [ ] Comparison page shows side-by-side specs
- [ ] Dashboard shows all saved data per user
- [ ] All features require authentication
- [ ] Optimistic UI provides instant feedback

---

## Phase 4: Trust & Social Proof (2-3 weeks)

### Objective
Help buyers evaluate vehicles and sellers through reviews, ratings, and organization profiles.

### Database Schema

#### 4.1: Reviews Tables
- [ ] Create `vehicle_reviews` table (vehicle_id, user_id, rating, comment, verified_purchase, created_at)
- [ ] Create `organization_reviews` table (organization_id, user_id, rating, comment, created_at)
- [ ] Add moderation fields (status: pending/approved/rejected, moderated_by, moderated_at)
- [ ] Add RLS policies (public read approved reviews, authenticated write)
- [ ] Add indexes for performance

**Deliverable**: Review schema ready

### Review Submission

#### 4.2: Review API
- [ ] `POST /api/reviews/vehicle` - Submit vehicle review
- [ ] `POST /api/reviews/organization` - Submit organization review
- [ ] `GET /api/reviews/vehicle/[id]` - Get vehicle reviews (approved only)
- [ ] Add authentication checks (logged-in users only)
- [ ] Add validation (rating 1-5, max comment length)
- [ ] All new reviews start as "pending" (moderation queue)

**Deliverable**: Review submission API with moderation

#### 4.3: Review Display Components
- [ ] Update `TrafficLightReviews` to show real aggregated data
- [ ] Add individual review cards (avatar, name, rating, comment, date)
- [ ] Add "Write a Review" CTA (authenticated users only)
- [ ] Add review form modal/page
- [ ] Show "verified purchase" badge if applicable
- [ ] Add pagination for many reviews

**Deliverable**: Review display UI with real data

#### 4.4: Ratings Aggregation
- [ ] Calculate average rating per vehicle
- [ ] Calculate rating distribution (5 stars: X%, 4 stars: Y%, etc.)
- [ ] Show total review count
- [ ] Update `TrafficLightReviews` with aggregated data
- [ ] Cache aggregated data (update on new review approval)

**Deliverable**: Real-time ratings aggregation

### Organization Profiles

#### 4.5: Organization Profile Pages
- [ ] Create `/[locale]/organizations/[slug]` page
- [ ] Display organization name, type, description
- [ ] Show contact information (phone, email, WhatsApp)
- [ ] Display organization logo and branding
- [ ] List vehicles sold by this organization
- [ ] Show organization reviews and rating
- [ ] Add "Contact Seller" CTA (WhatsApp link)

**Deliverable**: Public organization profile pages

#### 4.6: Organization Directory
- [ ] Create `/[locale]/organizations` page
- [ ] Display grid/list of all organizations
- [ ] Add filters (by type: dealer/importer, by location)
- [ ] Show preview card (logo, name, rating, vehicle count)
- [ ] Make cards link to organization profile
- [ ] Add search functionality

**Deliverable**: Organization directory with filtering

### Inquiry System

#### 4.7: Inquiry/Contact Features
- [ ] Add "Contact Seller" button on vehicle pages
- [ ] Generate WhatsApp deep link with pre-filled message
  - "Hi, I'm interested in [Vehicle Name] listed at [Price]"
- [ ] Open in new tab/window
- [ ] Log inquiry events in PostHog
- [ ] (Future) Create `inquiries` table for tracking

**Deliverable**: WhatsApp contact integration

### Success Criteria
- [ ] Users can submit vehicle and organization reviews
- [ ] Reviews go through moderation before appearing
- [ ] Vehicle pages show real aggregated ratings
- [ ] Organization profiles display info and reviews
- [ ] Organization directory helps discover sellers
- [ ] WhatsApp contact flow works smoothly

---

## Phase 5: Seller Operations (2-3 weeks)

### Objective
Enable sellers to manage their organization and vehicle listings.

### Seller Authentication & Permissions

#### 5.1: Seller Dashboard Access
- [ ] Create `/[locale]/seller` route (protected, org members only)
- [ ] Add middleware to check organization membership
- [ ] Verify user has OWNER/ADMIN role for write operations
- [ ] Redirect non-members to homepage
- [ ] Add "Seller Mode" toggle in navbar (if user is org member)

**Deliverable**: Protected seller area with role checks

### Seller Dashboard

#### 5.2: Seller Dashboard Layout
- [ ] Create `/[locale]/seller/dashboard` page
- [ ] Show sidebar navigation: Dashboard, Listings, Organization, Team
- [ ] Display key metrics (total listings, active, inquiries, views)
- [ ] Show recent activity feed
- [ ] Style consistently with buyer dashboard

**Deliverable**: Seller dashboard shell

### Listings Management

#### 5.3: Listings List Page
- [ ] Create `/[locale]/seller/listings` page
- [ ] Display table/grid of organization's vehicles
- [ ] Show status (active, draft, archived)
- [ ] Add filters (status, date, price)
- [ ] Add "Create Listing" CTA button
- [ ] Add quick actions (edit, archive, delete)

**Deliverable**: Listings management page

#### 5.4: Create Listing Page
- [ ] Create `/[locale]/seller/listings/new` page
- [ ] Multi-step form:
  - Step 1: Basic info (make, model, year, trim)
  - Step 2: Specifications (battery, range, features)
  - Step 3: Pricing (base price, currency, availability)
  - Step 4: Images (upload to Supabase Storage)
  - Step 5: Review and publish
- [ ] Add form validation (react-hook-form + zod)
- [ ] Generate slug automatically from make/model/year
- [ ] Save as draft functionality
- [ ] Add image uploader with preview

**Deliverable**: Full vehicle creation flow

#### 5.5: Edit Listing Page
- [ ] Create `/[locale]/seller/listings/[id]/edit` page
- [ ] Pre-fill form with existing data
- [ ] Allow updating all fields (basic info, specs, pricing, images)
- [ ] Add "Save Changes" and "Publish" buttons
- [ ] Add "Archive Listing" option
- [ ] Verify user has edit permissions (same org, OWNER/ADMIN role)

**Deliverable**: Listing editing capability

#### 5.6: Image Management
- [ ] Add image upload to Supabase Storage (`vehicle-images` bucket)
- [ ] Support multiple images per vehicle
- [ ] Add drag-and-drop reordering
- [ ] Set hero image (position 0)
- [ ] Add delete image functionality
- [ ] Compress/optimize images on upload

**Deliverable**: Full image management

### Organization Profile Management

#### 5.7: Organization Settings Page
- [ ] Create `/[locale]/seller/organization` page
- [ ] Allow editing org details (name, description, contact info)
- [ ] Add logo upload
- [ ] Add branding colors (if applicable)
- [ ] Add operating hours, location
- [ ] Require OWNER/ADMIN role for changes

**Deliverable**: Organization profile editor

#### 5.8: Team Management
- [ ] Create `/[locale]/seller/team` page
- [ ] List organization members with roles
- [ ] Add "Invite Member" flow (send invite link or email)
- [ ] Allow role changes (OWNER can promote/demote)
- [ ] Add "Remove Member" option
- [ ] Show pending invitations

**Deliverable**: Team management interface

### Success Criteria
- [ ] Sellers can access protected seller dashboard
- [ ] Sellers can create new vehicle listings
- [ ] Sellers can edit/archive existing listings
- [ ] Sellers can upload and manage vehicle images
- [ ] Sellers can update organization profile
- [ ] Organization owners can manage team members
- [ ] RLS enforces all permissions correctly

---

## Phase 6: Extended Catalog & Growth (3+ weeks)

### Objective
Expand marketplace with services, accessories, and additional features.

### Services Directory

#### 6.1: Services Schema
- [ ] Create `services` table (name, category, description, provider_id)
- [ ] Create `service_providers` table (name, contact, organization_id)
- [ ] Create `service_categories` enum (maintenance, insurance, financing, charging, etc.)
- [ ] Add RLS policies
- [ ] Seed sample services data

**Deliverable**: Services database ready

#### 6.2: Services Pages
- [ ] Create `/[locale]/services` page (directory of all services)
- [ ] Create `/[locale]/services/[category]` pages (per category)
- [ ] Display service cards (name, provider, description, contact)
- [ ] Add "Contact Provider" CTA (WhatsApp or email)
- [ ] Filter by category
- [ ] Update `ServicesShowcase` component to use real data

**Deliverable**: Services directory live

### Accessories Storefront

#### 6.3: Accessories Schema
- [ ] Create `accessories` table (name, category, price, images, description, seller_id)
- [ ] Create `accessory_categories` (car care, electronics, interior, exterior, etc.)
- [ ] Add RLS policies
- [ ] Seed sample accessories

**Deliverable**: Accessories database ready

#### 6.4: Accessories Pages
- [ ] Create `/[locale]/shop` page (main storefront)
- [ ] Create `/[locale]/shop/[category]` pages
- [ ] Create `/[locale]/shop/products/[slug]` detail pages
- [ ] Display product cards (image, name, price, CTA)
- [ ] Add "Buy Now" or "Contact Seller" buttons
- [ ] Add filters (category, price range)

**Deliverable**: Accessories storefront live

### Financing Integration

#### 6.5: Financing Data
- [ ] Research partner bank APIs (or manual data entry)
- [ ] Create `financing_options` table (bank_id, vehicle_id, rate, term, down_payment)
- [ ] Seed real financing rates
- [ ] Update `FinancingTabs` component with real data
- [ ] Add calculator widget (estimate monthly payment)

**Deliverable**: Real financing rates displayed

### Advanced Features

#### 6.6: Saved Search Alerts (Optional)
- [ ] Add email notification system
- [ ] Send weekly digest of new vehicles matching saved searches
- [ ] Add user preferences (email frequency)
- [ ] Integrate with email service (SendGrid, Resend, etc.)

#### 6.7: Admin Panel (Optional)
- [ ] Create `/[locale]/admin` area (super admin only)
- [ ] Add review moderation queue
- [ ] Add user management (ban, roles)
- [ ] Add content moderation tools
- [ ] Add analytics dashboard

### Success Criteria
- [ ] Services directory is populated and searchable
- [ ] Accessories storefront allows browsing and contact
- [ ] Financing options display real bank rates
- [ ] (Optional) Email alerts working for saved searches
- [ ] (Optional) Admin panel operational

---

## Future Roadmap (Post-Launch)

### Growth & Scale
- Expand vehicle inventory (100+ vehicles)
- Multi-region support (Ecuador, Colombia, Peru, etc.)
- Mobile app (React Native)
- Dealer kiosks (tablet mode)

### Marketplace Features
- Auctions for used vehicles
- Trade-in valuation tools
- Insurance integrations
- Test drive booking
- Vehicle history reports

### Operations
- Advanced admin moderation console
- Full messaging system (beyond WhatsApp)
- CRM for sellers
- Analytics and reporting dashboards
- A/B testing infrastructure

---

## Roadmap Summary

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| Phase 0 | 3-5 days | Migration & Setup | Components migrated, 6 vehicles seeded, database ready |
| Phase 1 | 1-2 weeks | Vehicle Pages | Detail pages, listings page, real data displayed |
| Phase 2 | 1-2 weeks | Polish | Error handling, SEO, performance, observability |
| Phase 3 | 2-3 weeks | Buyer Engagement | Favorites, comparisons, user dashboard |
| Phase 4 | 2-3 weeks | Trust & Social Proof | Reviews, ratings, organization profiles |
| Phase 5 | 2-3 weeks | Seller Operations | Seller dashboard, listing CRUD, team management |
| Phase 6 | 3+ weeks | Extended Catalog | Services, accessories, financing, growth features |

**Total Timeline**: ~3-4 months for core marketplace (Phases 0-5)

---

## Success Metrics

### User Acquisition
- Weekly new sign-ups
- Organic search traffic growth
- Referral rate

### Engagement
- Favorites created per user
- Comparison usage rate
- Time on site
- Pages per session

### Seller Success
- Listings created per organization
- Inquiry response rate
- Conversion rate (inquiry → sale, if trackable)

### Technical Health
- Page load time (p95 < 2s)
- Error rate < 1%
- Uptime ≥ 99.5%
- Core Web Vitals passing

**Track all metrics with PostHog dashboards. Review weekly.**

