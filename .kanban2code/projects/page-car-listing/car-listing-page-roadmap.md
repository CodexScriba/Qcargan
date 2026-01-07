# Car Listing Page

## Overview

The Car Listing Page is a comprehensive vehicle detail page that serves as the central hub for EV buyers in Costa Rica. When a user navigates to `/cars/[slug]`, they see everything they need to make an informed purchase decision: vehicle specifications, pricing from multiple sellers, financing options from partner banks, user reviews, related accessories, and EV services.

This page embodies QuéCargan's core value proposition: connecting buyers with sellers, banks, and service providers while providing the most complete and transparent EV information in Costa Rica. It's not a sales page—it's an information and connection hub.

The page pulls real data from Supabase (schema already exists) and tracks user engagement via PostHog to measure which connections (seller contacts, bank inquiries, service requests) are most valuable.

## Problem Statement

EV buyers in Costa Rica lack a single source of truth for vehicle information. They must visit multiple dealer sites, call banks individually, and search for accessories and services separately. This fragmented experience leads to incomplete information, missed opportunities, and buyer frustration.

QuéCargan solves this by aggregating all relevant information and connections on one page, making the EV buying journey transparent and efficient.

## Goals

- Display comprehensive vehicle information (specs, images, description) from Supabase
- Show pricing and availability from multiple sellers with direct contact options
- Present financing partners (banks) with easy contact flow
- Display user review sentiment (placeholder until review system is built)
- Showcase related accessories from accessory sellers
- Highlight relevant EV services and support providers
- Track all contact/connection events via PostHog for conversion insights
- Support full i18n (Spanish/English) using existing `next-intl` setup

## Non-Goals (Out of Scope)

- Review submission UI (review backend doesn't exist yet—will be a separate project)
- Vehicle comparison page (separate feature, different route)
- Financing calculator with custom inputs (banks are contact-only for now)
- Seller dashboard or inventory management
- E-commerce checkout for accessories (contact flow only)

## User Stories

### Vehicle Information
- As a buyer, I want to see high-quality images of the vehicle so that I can evaluate its appearance
- As a buyer, I want to see key specs at a glance (range, battery, acceleration) so that I can quickly assess if the vehicle meets my needs
- As a buyer, I want to see detailed specifications so that I can make an informed technical comparison
- As a buyer, I want to read a description of the vehicle so that I understand its features and positioning

### Pricing & Sellers
- As a buyer, I want to see prices from multiple sellers so that I can find the best deal
- As a buyer, I want to see availability status (in stock, pre-order, coming soon) so that I know when I can get the vehicle
- As a buyer, I want to contact a seller via WhatsApp or email so that I can inquire about purchase
- As a buyer, I want to see if a seller is an official importer so that I can trust the source

### Financing
- As a buyer, I want to see financing partner banks so that I know my loan options
- As a buyer, I want to contact a bank easily so that I can start my financing application

### Reviews
- As a buyer, I want to see overall user sentiment (positive/neutral/negative) so that I understand the community consensus
- As a buyer, I want to see this even if detailed reviews aren't available yet (placeholder with explanation)

### Accessories & Services
- As a buyer, I want to see relevant accessories (chargers, tires) so that I can plan my complete purchase
- As a buyer, I want to see EV service providers (electricians, mechanics, detailing, insurance) so that I know support is available
- As a buyer, I want to contact accessory sellers and service providers so that I can get quotes

### Engagement
- As a buyer, I want to share the vehicle page so that I can show it to family/friends
- As a buyer, I want to save the vehicle to favorites so that I can compare later

## Success Criteria

- Page loads vehicle data from Supabase (not hardcoded JSON files)
- All text is translatable via `next-intl` message keys
- Contact buttons (WhatsApp, email) fire PostHog tracking events
- Page renders correctly on mobile, tablet, and desktop
- Hero image and gallery display vehicle images from Supabase storage
- Multiple sellers displayed with their respective pricing
- Bank cards display with contact functionality
- Accessories and services sections populated (can be placeholder data initially)
- Share and favorite functionality works (favorite can use local storage initially)
- Page passes Core Web Vitals (LCP < 2.5s)

## Open Questions

1. **Accessories data model**: Do accessories and services have their own Supabase tables, or should they be added? What's the relationship to vehicles (category-based, manual curation, or tags)?

2. **Image storage**: Are vehicle images already in Supabase storage with the expected path structure, or does the upload flow need to be built?

3. **Seller contact templates**: Should WhatsApp/email messages include vehicle details automatically (year, model, price, URL)?

4. **Favorites persistence**: Local storage for anonymous users, or require login? If login required, does the profiles table need a favorites relation?

5. **Review placeholder**: What should the reviews section show when no reviews exist? "Be the first to review" CTA, or hide the section entirely?

## Notes

### Technical Constraints
- Supabase schema exists: `vehicles`, `vehicle_specifications`, `vehicle_pricing`, `vehicle_images`, `organizations`, `banks`
- Use Drizzle ORM for queries (see `lib/db/`)
- PostHog is already integrated (though there are some pre-existing build issues in `lib/posthog/client.ts`)
- Translations go in `messages/en.json` and `messages/es.json` under the `vehicles` namespace (many keys already exist)

### Design Reference
- Visual design based on `car_page_example.png` in project root
- Use existing Shadcn UI components (`Card`, `Button`, etc.)
- Follow existing patterns from homepage and auth pages

### Data Flow
- Server component fetches data via Drizzle queries
- Client components for interactive elements (gallery, share, favorite)
- No client-side data fetching—all data passed as props from server

### Dependencies
- Review system backend (future project—use placeholder for now)
- Accessories/services data model (may need schema additions)

---

## Technical Architecture

### Overview

The Car Listing Page uses Next.js 16 App Router with a **server-first** architecture. The page container (`app/[locale]/cars/[slug]/page.tsx`) is an async server component that fetches all data via Drizzle ORM queries, then passes data as props to child components. Interactive elements (gallery navigation, share/favorite buttons, contact tracking) are client components.

**Key architectural decisions:**
- **Server components by default** — all data fetching happens on the server
- **Client components only for interactivity** — gallery carousel, share/favorite state, PostHog tracking
- **Props drilling over context** — data flows from server → client via props, no client-side fetching
- **Colocation** — vehicle-specific components live in `components/vehicles/`

### Component Tree

```
CarListingPage (server) ──────────────────────────────────────────────────
├── VehicleHeader (client) ─────────── title, year, share/favorite buttons
├── <two-column layout>
│   ├── LEFT COLUMN (2/3 width)
│   │   ├── VehicleGallery (client) ─── image carousel with thumbnails
│   │   ├── VehicleQuickSpecs (server) ── range/battery/acceleration bar
│   │   ├── VehicleDetailedSpecs (server) ── full specs table/grid
│   │   └── VehicleDescription (server) ── description text block
│   └── RIGHT COLUMN (1/3 width)
│       └── SellerCard[] (client) ──── per-seller pricing + contact buttons
├── FinancingSection (server)
│   └── BankCard[] (client) ─────────── bank logo + contact button
├── ReviewSummary (server) ──────────── sentiment percentages (placeholder)
├── AccessoriesSection (server) ─────── placeholder grid (future: real data)
└── ServicesSection (server) ────────── placeholder grid (future: real data)
```

### Component Props Interfaces

```typescript
// VehicleHeader (client)
type VehicleHeaderProps = {
  brand: string
  model: string
  year: number
  variant?: string | null
  bodyType?: 'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'
  vehicleId: string  // for favorite tracking
  shareUrl?: string
}

// VehicleGallery (client)
type VehicleGalleryProps = {
  images: VehicleImage[]  // from getVehicleBySlug
  vehicleTitle: string    // for alt text fallback
}

// VehicleQuickSpecs (server)
type VehicleQuickSpecsProps = {
  rangeKm: number | null
  batteryKwh: number | null
  acceleration0To100: number | null
}

// VehicleDetailedSpecs (server)
type VehicleDetailedSpecsProps = {
  specifications: VehicleSpecsData | null
  specs: VehicleSpecs  // JSONB extended specs
}

// SellerCard (client)
type SellerCardProps = {
  pricing: VehiclePricingWithOrg
  vehicleInfo: { brand: string; model: string; year: number }
}

// BankCard (client)
type BankCardProps = {
  bank: BankData
  vehicleInfo: { brand: string; model: string; year: number }
}

// ReviewSummary (server)
type ReviewSummaryProps = {
  positivePercent: number | null
  neutralPercent: number | null
  negativePercent: number | null
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  REQUEST: /es/cars/byd-seagull-2024                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SERVER: CarListingPage (async server component)                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  const [vehicle, banks] = await Promise.all([                      │ │
│  │    getVehicleBySlug(slug),   // → vehicles + specs + images + pricing │
│  │    getFeaturedBanks()        // → banks                            │ │
│  │  ])                                                                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ props
┌─────────────────────────────────────────────────────────────────────────┐
│  CLIENT: Interactive components receive data as props                    │
│  - VehicleHeader: { brand, model, year, vehicleId }                     │
│  - VehicleGallery: { images }                                           │
│  - SellerCard[]: { pricing, vehicleInfo }                               │
│  - BankCard[]: { bank, vehicleInfo }                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ user interaction
┌─────────────────────────────────────────────────────────────────────────┐
│  POSTHOG: Track contact/engagement events (client-side)                 │
│  - seller_contact_clicked: { seller_id, contact_type, vehicle_id }      │
│  - bank_contact_clicked: { bank_id, contact_type, vehicle_id }          │
│  - vehicle_shared: { vehicle_id, share_method }                         │
│  - vehicle_favorited: { vehicle_id, action: 'add' | 'remove' }          │
└─────────────────────────────────────────────────────────────────────────┘
```

### PostHog Event Schema

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `seller_contact_clicked` | User clicks WhatsApp/email on seller card | `seller_id`, `seller_name`, `contact_type` (whatsapp/email), `vehicle_id`, `vehicle_slug`, `price_amount`, `price_currency` |
| `bank_contact_clicked` | User clicks contact on bank card | `bank_id`, `bank_name`, `contact_type` (website/phone/email), `vehicle_id`, `vehicle_slug` |
| `vehicle_shared` | User shares vehicle page | `vehicle_id`, `vehicle_slug`, `share_method` (native/clipboard) |
| `vehicle_favorited` | User toggles favorite | `vehicle_id`, `vehicle_slug`, `action` (add/remove) |

### Dependencies (External)

| Dependency | Version | Purpose |
|------------|---------|---------|
| `embla-carousel-react` | ^8.x | Image carousel (already in deps) |
| `posthog-js` | existing | Client-side analytics |
| `next-intl` | existing | i18n translations |
| `drizzle-orm` | existing | Database queries |
| `lucide-react` | existing | Icons |

### Constraints

1. **No client-side data fetching** — all data comes from server props
2. **No new database tables for MVP** — accessories/services use placeholders
3. **No review submission** — display sentiment only, link to future review page
4. **Favorites in localStorage** — no user account required for MVP
5. **Contact templates** — WhatsApp/email include vehicle details automatically

---

## Resolved Questions

1. **Accessories data model**: **Placeholder for MVP.** Show static placeholder cards linking to `/shop` page. Future: add `accessories` and `services` tables with category-based filtering.

2. **Image storage**: Images use `storagePath` from `vehicle_images` table. Construct full URL: `{SUPABASE_URL}/storage/v1/object/public/vehicles/{storagePath}`. Verify images exist for test vehicle.

3. **Seller contact templates**: **Yes, include vehicle details.** WhatsApp message template: `"Hi! I'm interested in the {year} {brand} {model}. More info: {url}"` (key already exists: `vehicles.contact.whatsappMessage`)

4. **Favorites persistence**: **Local storage for MVP.** Store `favoriteVehicleIds: string[]` in localStorage. No login required. Future: sync to user profile when logged in.

5. **Review placeholder**: **Show sentiment when available, otherwise hide.** If `sentimentPositivePercent` is null, don't render ReviewSummary. When backend exists, show "Be the first to review" CTA.

---

## Phases

### Phase 1: Foundation & Data Layer

Establish page container, data fetching, and header component.

#### Task 1.1: Verify and Enhance Data Queries

**Definition of Done:**
- [ ] `getVehicleBySlug` returns all required fields
- [ ] Query handles missing specifications gracefully
- [ ] TypeScript types are complete and exported

**Files:**
- `lib/db/queries/vehicles.ts` - modify - verify and enhance existing query

**Tests:**
- [ ] Query returns correct data shape for existing vehicle
- [ ] Query returns null for non-existent slug
- [ ] Query excludes unpublished vehicles

**Skills:**
- `skills/skill-drizzle-orm` - Database queries with Drizzle

#### Task 1.2: Set Up Page Container

**Definition of Done:**
- [ ] Page loads at `/[locale]/cars/[slug]`
- [ ] Vehicle data fetched and passed to placeholder sections
- [ ] 404 shown for invalid slugs
- [ ] Metadata generated correctly

**Files:**
- `app/[locale]/cars/[slug]/page.tsx` - modify - update existing scaffold

**Tests:**
- [ ] Page renders with valid slug
- [ ] Page shows 404 for invalid slug
- [ ] Page title includes vehicle name

**Skills:**
- `skills/nextjs-core-skills` - App Router patterns
- `skills/skill-next-intl` - i18n setup

#### Task 1.3: Implement VehicleHeader Component

**Definition of Done:**
- [ ] Displays vehicle title (year brand model)
- [ ] Shows body type badge
- [ ] Share button works (native share or clipboard fallback)
- [ ] Favorite button toggles state with localStorage

**Files:**
- `components/vehicles/vehicle-header.tsx` - modify - enhance existing component
- `messages/en.json` - modify - verify translation keys exist
- `messages/es.json` - modify - add Spanish translations

**Tests:**
- [ ] Header renders correct title format
- [ ] Share copies URL to clipboard
- [ ] Favorite state persists in localStorage

**Skills:**
- `skills/react-core-skills` - React component patterns
- `skills/skill-next-intl` - useTranslations hook

---

### Phase 2: Visual Core Components

Build the gallery and specifications display components.

#### Task 2.1: Implement VehicleGallery Component

**Definition of Done:**
- [ ] Hero image displays prominently
- [ ] Thumbnail strip shows all images
- [ ] Click thumbnail changes main image
- [ ] Keyboard navigation works (left/right arrows)
- [ ] Mobile-friendly with swipe support

**Files:**
- `components/vehicles/vehicle-gallery.tsx` - create - image carousel component

**Tests:**
- [ ] Gallery renders with multiple images
- [ ] Gallery handles single image gracefully
- [ ] Gallery handles zero images (placeholder shown)
- [ ] Thumbnail click changes active image

**Skills:**
- `skills/react-core-skills` - Client component with state
- `skills/skill-design-system` - Shadcn UI integration

#### Task 2.2: Implement VehicleQuickSpecs Component

**Definition of Done:**
- [ ] Displays range, battery, acceleration in horizontal bar
- [ ] Missing values show "—" placeholder
- [ ] Responsive layout (stacks on mobile)

**Files:**
- `components/vehicles/vehicle-quick-specs.tsx` - create - specs summary bar

**Tests:**
- [ ] Renders all three specs when available
- [ ] Handles null values gracefully
- [ ] Layout adapts to mobile viewport

**Skills:**
- `skills/skill-tailwindcss-v4` - Responsive styling

#### Task 2.3: Implement VehicleDetailedSpecs Component

**Definition of Done:**
- [ ] Grid/table displays all specification fields
- [ ] Groups specs by category (Performance, Battery, Physical)
- [ ] Handles null values with "—"
- [ ] Expands JSONB specs field for additional data

**Files:**
- `components/vehicles/vehicle-detailed-specs.tsx` - create - full specs display

**Tests:**
- [ ] Renders all spec categories
- [ ] Handles partial data
- [ ] JSONB specs render correctly

**Skills:**
- `skills/skill-next-intl` - Spec label translations

#### Task 2.4: Implement VehicleDescription Component

**Definition of Done:**
- [ ] Displays description text with proper formatting
- [ ] Handles null description (component not rendered)
- [ ] Supports markdown-style line breaks

**Files:**
- `components/vehicles/vehicle-description.tsx` - create - description text block

**Tests:**
- [ ] Renders description text
- [ ] Component hidden when description is null

**Skills:**
- `skills/react-core-skills` - Server component

---

### Phase 3: Pricing & Seller Components

Build seller cards with contact functionality and PostHog tracking.

#### Task 3.1: Implement SellerCard Component

**Definition of Done:**
- [ ] Displays seller name, logo, official badge
- [ ] Shows price and currency
- [ ] Shows availability status with color coding
- [ ] WhatsApp button opens pre-filled message
- [ ] Email button opens pre-filled email
- [ ] PostHog tracks contact clicks

**Files:**
- `components/vehicles/seller-card.tsx` - create - seller pricing card
- `lib/posthog/events.ts` - create - event tracking helpers

**Tests:**
- [ ] Card renders seller info correctly
- [ ] WhatsApp link includes vehicle details
- [ ] Email mailto includes subject and body
- [ ] PostHog event fires on click

**Skills:**
- `skills/react-core-skills` - Client component
- `skills/skill-posthog-analytics` - Event tracking

#### Task 3.2: Implement PricingSection Layout

**Definition of Done:**
- [ ] Right sidebar layout on desktop
- [ ] Stacked cards on mobile
- [ ] Section header with seller count
- [ ] Empty state when no sellers

**Files:**
- `app/[locale]/cars/[slug]/page.tsx` - modify - integrate SellerCard components

**Tests:**
- [ ] Multiple sellers display correctly
- [ ] Layout responsive across breakpoints
- [ ] Empty state shown when no pricing data

**Skills:**
- `skills/skill-tailwindcss-v4` - Grid layout

---

### Phase 4: Financing & Reviews

Build bank cards and review sentiment display.

#### Task 4.1: Implement BankCard Component

**Definition of Done:**
- [ ] Displays bank name and logo
- [ ] Shows typical APR range
- [ ] Contact button (website or phone)
- [ ] PostHog tracks contact clicks

**Files:**
- `components/vehicles/bank-card.tsx` - create - financing partner card

**Tests:**
- [ ] Card renders bank info correctly
- [ ] Contact link works
- [ ] PostHog event fires on click

**Skills:**
- `skills/react-core-skills` - Client component
- `skills/skill-posthog-analytics` - Event tracking

#### Task 4.2: Implement FinancingSection Layout

**Definition of Done:**
- [ ] Horizontal scrollable row of bank cards
- [ ] Section header with description
- [ ] Hidden when no featured banks

**Files:**
- `components/vehicles/financing-section.tsx` - create - bank cards container

**Tests:**
- [ ] Multiple banks display correctly
- [ ] Section hidden when no banks
- [ ] Horizontal scroll works on mobile

**Skills:**
- `skills/skill-tailwindcss-v4` - Horizontal scroll

#### Task 4.3: Implement ReviewSummary Component

**Definition of Done:**
- [ ] Displays positive/neutral/negative percentages
- [ ] Color-coded bars (green/yellow/red)
- [ ] Hidden when no sentiment data
- [ ] Placeholder message for no reviews

**Files:**
- `components/vehicles/review-summary.tsx` - create - sentiment display

**Tests:**
- [ ] Percentages render correctly
- [ ] Colors match sentiment
- [ ] Component hidden when all percentages null

**Skills:**
- `skills/react-core-skills` - Server component

---

### Phase 5: Polish & Placeholders

Add placeholder sections for future features and final polish.

#### Task 5.1: Implement AccessoriesSection Placeholder

**Definition of Done:**
- [ ] Shows 4 placeholder accessory cards
- [ ] Cards link to /shop page
- [ ] Section header explains "Related Accessories"

**Files:**
- `components/vehicles/accessories-section.tsx` - create - placeholder grid

**Tests:**
- [ ] Placeholder cards render
- [ ] Links navigate to /shop

**Skills:**
- `skills/react-core-skills` - Server component

#### Task 5.2: Implement ServicesSection Placeholder

**Definition of Done:**
- [ ] Shows 4 placeholder service cards
- [ ] Cards link to /services page
- [ ] Section header explains "EV Services"

**Files:**
- `components/vehicles/services-section.tsx` - create - placeholder grid

**Tests:**
- [ ] Placeholder cards render
- [ ] Links navigate to /services

**Skills:**
- `skills/react-core-skills` - Server component

#### Task 5.3: Add Missing Translations

**Definition of Done:**
- [ ] All new UI text has translation keys
- [ ] Spanish translations complete
- [ ] No hardcoded strings in components

**Files:**
- `messages/en.json` - modify - add new keys
- `messages/es.json` - modify - add Spanish translations

**Tests:**
- [ ] Page renders in Spanish without missing keys
- [ ] Page renders in English without missing keys

**Skills:**
- `skills/skill-next-intl` - Translation keys

#### Task 5.4: Responsive Polish & Accessibility

**Definition of Done:**
- [ ] All components pass mobile/tablet/desktop breakpoints
- [ ] Focus states visible for keyboard navigation
- [ ] Alt text on all images
- [ ] Semantic HTML (header, main, section, article)

**Files:**
- All component files - modify - accessibility review

**Tests:**
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Keyboard navigation through all interactive elements
- [ ] Screen reader announces all content

**Skills:**
- `skills/skill-tailwindcss-v4` - Responsive design

---

## Context

### Relevant Patterns

**Server/Client Component Split:**
```tsx
// Server component (default) - fetches data
export default async function Page({ params }) {
  const data = await fetchData()
  return <ClientComponent data={data} />
}

// Client component - handles interactivity
'use client'
export function ClientComponent({ data }) {
  const [state, setState] = useState()
  // ...
}
```

**Translation Pattern:**
```tsx
// Server component
const t = await getTranslations('vehicles')

// Client component
const t = useTranslations('vehicles')
```

**PostHog Tracking Pattern:**
```tsx
import { usePostHog } from '@posthog/react'

function Component() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('event_name', { property: 'value' })
  }
}
```

### Related Files

- `app/[locale]/page.tsx` - Homepage pattern reference
- `components/ui/card.tsx` - Card component to use
- `components/ui/button.tsx` - Button component to use
- `lib/db/index.ts` - Database client
- `lib/i18n/navigation.ts` - Localized Link component

### Gotchas

1. **Next.js 16 params are Promises** — always `await params` before destructuring
2. **PostHog client vs server** — use `@posthog/react` hook in client components only
3. **Image URLs** — construct from `storagePath`, don't store full URLs
4. **localStorage SSR** — wrap localStorage access in `useEffect` or check `typeof window`
5. **Translation keys** — use `vehicles.` namespace prefix for all vehicle-related keys
6. **Drizzle numeric types** — `$type<number>()` is compile-time only, values come as strings from Postgres
