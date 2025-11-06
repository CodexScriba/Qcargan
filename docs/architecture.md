# Architecture Overview

This document summarizes the technical architecture for the **Qcargan** application and highlights considerations for the Next.js 16 runtime. The project is a Next.js App Router stack targeting edge-friendly deployments through Coolify, backed by Supabase and Drizzle ORM, and managed with Bun.

## Runtime & Core Framework
- **next** `^16.0.1` implements the App Router with the new `proxy` middleware convention and React Server Components enabled by default.
- **react** `19.2.0` and **react-dom** `19.2.0` provide concurrent rendering support required by Next.js 16.
- **typescript** `^5` supplies static typing across the full stack.

All core versions are aligned with the official Next.js 16 compatibility matrix.

## Data & Backend Layer
- **@supabase/supabase-js** `^2.79.0` and **@supabase/ssr** `^0.7.0` handle authentication, storage, and server-side session hydration.
- **drizzle-orm** `^0.44.7` orchestrates schema-safe access to the Supabase Postgres database via **postgres** `^3.4.7`.
- **drizzle-kit** `^0.31.6` and **dotenv** `^17.2.3` support migrations and environment management.
- Drizzle configuration lives in `drizzle.config.ts`, with schema and migration history under `drizzle/` and the runtime client exported from `lib/db/`.
- Supabase helpers follow the SSR guidance from Context7: server/browser clients in `lib/supabase/` and middleware session refresh wired through `proxy.ts`.

**✅ Task 1 Status**: Database schema implementation completed with 7 core tables, 21 indexes, and modular organization in `lib/db/schema/`.

These packages run on the Node.js runtime used by Next.js API routes and Server Actions and have no known conflicts with Next.js 16.


### Database Schema Organization

The database schema is organized in a modular structure under `lib/db/schema/`:

```
lib/db/schema/
├─ vehicles.ts          - Core vehicle data and specifications (vehicles, vehicle_specifications)
├─ organizations.ts     - Dealers, agencies, and importers (organizations)
├─ vehicle-pricing.ts   - Vehicle-organization pricing relationships (vehicle_pricing)
├─ vehicle-images.ts    - Image metadata and variants (vehicle_images, vehicle_image_variants)
├─ banks.ts             - Financing partners (banks)
└─ index.ts             - Barrel export for all schema tables
```

**Schema design principles:**
- **Modular organization**: Each domain entity in its own file for maintainability ✅
- **TypeScript-first**: All tables use proper TypeScript types with `$type<>` for enums ✅
- **JSONB for flexibility**: Complex/varying data structures (contact info, availability, financing, specs) use JSONB with documented examples ✅
- **Comprehensive indexing**: 21 indexes including composite indexes for common query patterns ✅
- **Referential integrity**: Foreign keys with cascade delete for automatic cleanup ✅
- **i18n-ready**: descriptionI18n and variantI18n fields for future localization ✅
- **Performance optimization**: Materialized views defined in `lib/db/migrations/materialized-views.sql` for Phase 2+ ✅

**Key tables (✅ All implemented)**:
- `vehicles` & `vehicle_specifications` (1:1) - Core vehicle data with multi-cycle range support (CLTC, WLTP, EPA, NEDC), JSONB specs, UUID primary keys, unique slugs, published status
- `organizations` - Seller entities (AGENCY, DEALER, IMPORTER) with JSONB contact info, official status, badges
- `vehicle_pricing` - Junction table with pricing, financing (JSONB), availability (JSONB), perks, emphasis styles
- `vehicle_images` & `vehicle_image_variants` - Normalized image metadata with responsive variant tracking, hero image support
- `banks` - Standalone financing partners with generic APR ranges, contact info, featured status

**Schema statistics**:
- **7 Core Tables**: All implemented with full TypeScript coverage
- **21 Indexes**: Including unique, composite, and conditional indexes
- **5 Foreign Keys**: All with cascade delete for data integrity
- **8 JSONB Fields**: Flexible data structures with documented examples
- **3 Array Fields**: Text arrays for badges/perks, integer arrays for financing terms

**Materialized views** (Phase 2+):
- `vehicles_with_media` - Denormalized vehicle+images for listing performance
- `vehicles_with_pricing` - Precomputed price ranges and seller counts

## Presentation Layer
- Component primitives come from **Radix UI** (`@radix-ui/*` packages) wrapped with **shadcn** `^3.5.0` generators for consistent UI patterns.
- Styling is powered by **tailwindcss** `^4`, **@tailwindcss/postcss** `^4`, **tailwind-merge** `^3.3.1`, and helpers such as **class-variance-authority**, **clsx**, and **next-themes** for theming.
- Interaction, feedback, and media widgets use **lucide-react**, **cmdk**, **sonner**, **vaul**, **input-otp**, **embla-carousel-react**, **react-resizable-panels**, **react-day-picker**, **date-fns**, and **recharts**.
- Global typography is supplied by the **Poppins** family through `next/font` (`app/[locale]/layout.tsx`), exposing a shared CSS variable (`--font-poppins`) consumed by Tailwind’s `font-sans` utility. The build currently downloads font files from Google Fonts; to support offline CI, self-host the `.woff2` variants under `public/fonts/` and switch to `next/font/local`.
- **Navbar composition** centralizes responsive navigation across breakpoints, surfacing localization, theming, and primary product entry points. The component tree and responsibilities are:

```
app/
├─ page.tsx – default-locale landing route that mounts <Navbar> above public marketing content.
└─ [locale]/layout.tsx – per-locale root layout that wraps children with NextIntl and renders <Navbar>.
components/layout/navbar/
├─ Navbar.tsx – client component that swaps desktop/tablet/mobile variants based on Tailwind viewport utilities.
├─ Logo.tsx – brand link that routes to the localized home page and shows the Qcargan logomark.
├─ variants/
│  ├─ DesktopNavbar.tsx – wide-screen nav with mega menus, global search, locale/theme controls, and auth CTAs.
│  ├─ TabletNavbar.tsx – condensed nav keeping key menus and switchers while shrinking CTAs for mid-width screens.
│  └─ MobileNavbar.tsx – stateful sheet menu that collapses navigation, search, and auth flows into a drawer UI.
└─ menus/
   ├─ NewCarsMenu.tsx – mega menu fed by `lib/content/navbar/new-cars` to showcase inventory categories and quick links.
   ├─ UsedCarsMenu.tsx – waitlist teaser for the secondary marketplace with conversion-focused messaging.
   ├─ ServicesMenu.tsx – services catalogue overview pulling structured copy from `lib/content/navbar/services`.
   ├─ TiendaMenu.tsx – commerce entry point backed by `lib/content/navbar/shop` cards and quick actions.
   └─ SearchBar.tsx – controlled search form exposing an optional `onSearch` callback for future query wiring.
components/layout/theme-switcher.tsx – control surfaced inside every variant to toggle the design system theme.
components/layout/language-switcher.tsx – locale selector wired to `next-intl` routing helpers and rendered in all breakpoints.
```

- **Product components** provide reusable UI primitives for showcasing vehicle inventory:

```
components/product/
├─ product-title.tsx – ProductTitle component that formats vehicle metadata (brand, model, year, variant) into a gradient headline with battery and range specs as supporting details. Accepts a vehicle object and renders a centered, responsive title block using clamp-based typography and theme-aware gradients.
├─ seller-card.tsx – SellerCard displays pricing offers from dealers, agencies, and importers with financing details, availability badges, perks, and CTAs. Supports emphasis styling for featured offers.
├─ see-all-sellers-card.tsx – SeeAllSellersCard link component that shows total available seller options and routes to the full sellers list.
├─ car-action-buttons.tsx – CarActionButtons client component providing primary actions (contact, share) for vehicle listings.
├─ vehicle-all-specs.tsx – VehicleAllSpecs displays comprehensive technical specifications in an organized layout, accepting a vehicle object with detailed spec data.
└─ index.ts – Barrel export for all product components.
```

- **Agency components** enable buyer engagement through favorites and comparisons:

```
components/agency/
├─ favorite-button.tsx – FavoriteButton client component with heart icon for adding/removing vehicles from favorites. Supports multiple sizes (default, compact, icon) and visual states. Backend integration pending Phase 3.
├─ compare-button.tsx – CompareButton client component with scale icon for adding/removing vehicles from comparison list (max 3-4). Backend integration pending Phase 3.
├─ agency-actions.tsx – AgencyActions container component that groups FavoriteButton and CompareButton with consistent spacing and positioning, typically overlaid on vehicle cards.
├─ agency-card.tsx – AgencyCard displays official dealer pricing with seller info, monthly financing preview, warranty badges, and expandable details section. Integrates AgencyActions for favorites/compare functionality.
└─ index.ts – Barrel export for all agency components and types.
```

- **UI components** extend the base component library with specialized widgets:

```
components/ui/
└─ image-carousel.tsx – ImageCarousel client component for browsing vehicle media galleries with navigation and initial index support.
```

- **Showcase components** handle content carousels for products and services:

```
components/showcase/
├─ showcase-carousel.tsx – ShowcaseCarousel displays items (accessories, services) in a responsive grid/carousel with images, badges, and CTAs.
└─ index.ts – Barrel export for showcase components and types.
```

- **Bank & financing components** manage financial product displays:

```
components/banks/
└─ FinancingTabs.tsx – FinancingTabs client component that displays available bank financing options with rates and terms.
```

- **Review components** aggregate and display user feedback:

```
components/reviews/
├─ TrafficLightReviews.tsx – TrafficLightReviews client component showing sentiment distribution (positive/neutral/negative) with visual indicators.
├─ TrafficLight.tsx – TrafficLight interactive widget with red/yellow/green lamps for filtering reviews by sentiment. Features glassmorphic design with animated glow effects on active state.
└─ index.ts – Barrel export for review components and types.
```

- **Cars page** (`app/[locale]/cars/`) is a comprehensive vehicle detail view integrating all product components:

```
app/[locale]/cars/
├─ page.tsx – Main vehicle detail page combining ProductTitle, ImageCarousel, seller pricing cards, key specs, reviews, full specs accordion, related accessories, and EV services showcase. Currently uses mock data placeholders for development.
├─ KeySpecification.tsx – KeySpecification displays individual spec metrics (range, battery, charging, performance) with icon, title, and value in a hover-animated card.
└─ ServicesShowcase.tsx – ServicesShowcase client component rendering EV service offerings (mechanics, charging installation, detailing, software, tires, insurance) via ShowcaseCarousel with predefined service data.
```

Radix 1.x and shadcn components render correctly under React 19; Tailwind 4 currently supports the Next.js compiler pipeline used in v16 (monitor release notes for postcss updates).

## Scripts & Utilities

- **Reference scripts** (`scripts/reference/`) contain patterns from the old quecargan project for guidance:

```
scripts/reference/
├─ migrate-profiles.ts – Reference implementation showing auth.users → profiles sync patterns with username uniqueness handling.
└─ check-profiles-unique.ts – Reference validation script demonstrating database constraint checks and error handling patterns.
```

- **Utility functions** (`scripts/utils/`) provide shared helpers for scripts:

```
scripts/utils/
└─ identifiers.ts – Slug generation (slugify) and stable UUID creation (stableUuid) utilities for consistent identifier patterns across data seeding and migration scripts.
```

**Note:** Reference scripts are for pattern guidance only. A new production-quality `seed-production-vehicles.ts` script will be created from scratch for Phase 0.

## Internationalization, Forms & Validation
- **next-intl** `^4.4.0` orchestrates routing-aware translations. Localization lives under `app/[locale]/`, where the per-locale layout loads Poppins, sets the HTML language attribute, and wraps descendants in `NextIntlClientProvider` alongside the shared `Navbar`.
- Routing is declared in `i18n/routing.ts` via `defineRouting`; Spanish (`es`) is the default locale with an as-needed prefix strategy and locale detection disabled. Marketing pages (`/`, `/precios`, `/test`) render without authentication while `/en`, `/en/prices`, and the localized `/auth/*` and `/protected/*` segments map to their English counterparts. Navigation helpers (`Link`, `redirect`, `useRouter`, etc.) are generated with `createNavigation(routing)`, and `publicLocalePaths` exposes the marketing surface for the Supabase proxy middleware.
- Request-scoped messages are served from `messages/{locale}.json` through `i18n/request.ts` and the `next-intl` plugin registered in `next.config.ts`.
- Edge routing is wired through `proxy.ts`, which replaces the legacy middleware entry point and delegates to `createMiddleware(routing)`; ensure new routes are covered by the matcher.
- **i18n flow:** `i18n.ts` defines the supported locales, default locale, and `getMessages` helper. `i18n/routing.ts` centralizes localized pathnames and exports navigation helpers consumed by UI code (`Link`, `redirect`, `useRouter`, `getPathname`). `i18n/request.ts` plugs into `next-intl`’s `getRequestConfig` to load message bundles during SSR, falling back to the default locale when necessary. `app/[locale]/layout.tsx` validates the `[locale]` segment, calls `setRequestLocale`, and wraps children in `NextIntlClientProvider`, while `app/page.tsx` mirrors that wiring for the default locale (`/`). Translations live in `messages/en.json` and `messages/es.json`; add new keys in both files to maintain parity. When creating new routes, place the UI under `app/[locale]/...`, reference strings with `useTranslations`/`getTranslations`, and link via the helpers exported from `i18n/routing.ts` so localized path rewrites remain consistent.
- **Auth redirects:** sign-up flows push to `/auth/sign-up-success` (localized automatically) so users receive email confirmation instructions, while successful logins use the navigation helper’s `router.push("/")` to land on the localized home page instead of the protected dashboard. Keep future auth redirects within the helpers provided by `createNavigation(routing)` so locale variants stay in sync.
- **react-hook-form** `^7.66.0`, **@hookform/resolvers** `^5.2.2`, and **zod** `^4.1.12` combine for type-safe forms with both client and server validation paths.

All of these libraries are actively tested against modern React and Next.js versions.

## Tooling & Developer Experience
- **eslint** `^9` and **eslint-config-next** `16.0.1` enforce framework-consistent linting rules.
- TypeScript type packages (**@types/node**, **@types/react**, **@types/react-dom**) match the runtime versions.
- **Bun** is the package manager and script runner (`bun add`, `bun run dev`, `bun run build`, etc.). When using Next.js codemods or CLI tasks that expect npm, prefer `npx` to avoid compatibility gaps.

## Environment Configuration
The application expects Supabase environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
DATABASE_URL=<supabase_database_url>
DIRECT_URL=<supabase_direct_url>
```

## Current Implementation Status

### ✅ Completed: Task 1 - Database Schema Implementation
- **7 Core Tables**: All implemented with proper relationships and constraints
- **21 Indexes**: Comprehensive indexing strategy for query performance
- **5 Foreign Keys**: Cascade delete relationships ensuring data integrity
- **8 JSONB Fields**: Flexible data structures with documented examples
- **Materialized Views**: SQL defined for Phase 2+ optimization
- **TypeScript Coverage**: Full type safety with `$type<>` enum assertions

**Files Created**:
- `lib/db/schema/vehicles.ts` - vehicles, vehicle_specifications
- `lib/db/schema/organizations.ts` - organizations
- `lib/db/schema/vehicle-pricing.ts` - vehicle_pricing
- `lib/db/schema/vehicle-images.ts` - vehicle_images, vehicle_image_variants
- `lib/db/schema/banks.ts` - banks
- `lib/db/schema/index.ts` - barrel export
- `lib/db/migrations/materialized-views.sql` - Phase 2+ optimization

**Database Deployment**: Pending environment configuration

### 🔄 Upcoming: Task 2 - i18n & SEO Strategy Implementation
**Type**: Backend configuration work (minimal frontend requirements)

**Key components**:
- Update `i18n/request.ts` for Next.js 16 compatibility
- Add comprehensive Spanish/English translation keys
- Create slug generation utility for SEO-friendly URLs
- Document SEO metadata patterns for dynamic page titles
- **Note**: Uses template translations, not real vehicle data

**Estimated effort**: 2-3 hours
**Dependencies**: Task 1 (database schema complete)

## Next.js 16 Specific Guidance
1. Middleware has been renamed to **proxy**; ensure files and exports adopt the new convention (`proxy.ts`, `export function proxy()`).
2. Update configuration flags such as `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.
3. Rely on `NextResponse.redirect` or `NextResponse.rewrite` rather than returning response bodies from proxy handlers.
4. Review Context7 documentation for the latest Next.js 16 changes before modifying framework-level code (see `AGENTS.MD` for the required workflow).

With the above versions and practices, all listed dependencies are compatible with Next.js 16 and ready for the ongoing migration from the legacy `quecargan` application.
