# Pre-Task 4 Checklist

The goal of this checklist is to finish every backend and shared-component prerequisite before touching the UI work in Task 4. Each section contains: **objective**, **required files**, **exit criteria**, and **notes** so you can track progress without hunting through other docs.

---
## 1. Environment & Data Readiness
- **Objective**: unblock Drizzle/Supabase operations and load the minimum dataset.
- **Required files**: `.env.local`, `drizzle.config.ts`, `scripts/seed-production-vehicles.ts` (new), `package.json` scripts.
- **Tasks**:
  1. Add Supabase credentials to `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`).
  2. Run `bun run drizzle:generate` + `bun run drizzle:push` and commit generated SQL under `drizzle/`.
  3. Write `scripts/seed-production-vehicles.ts` that inserts at least **6 vehicles** (2+ brands), specs, images, organizations, pricing, and banks using the new schema helpers.
  4. Execute the seed script locally (Bun) and verify tables inside Supabase.
- **Exit criteria**: running `bun test` passes, `drizzle` directory contains the up-to-date migration, Supabase tables show seeded data, and `scripts/seed-production-vehicles.ts` can be re-run idempotently.

---
## 2. Query Hardening
- **Objective**: guarantee Task 4 queries only expose published/active data and return CDN-safe assets.
- **Required files**: `lib/db/queries/vehicles.ts`, `lib/db/queries/organizations.ts`, `lib/db/queries/banks.ts`, `lib/supabase/storage.ts` (new helper).
- **Tasks**:
  1. Update `getVehicleBySlug` to enforce `vehicles.isPublished = true` and ignore inactive sellers (`organizations.isActive = true`).
  2. Normalize `vehicle.media.images[].url` to signed/CDN URLs via a shared storage helper (e.g., `getPublicImageUrl(storagePath)`), including Open Graph metadata usage.
  3. Extend `getVehiclePricing` to apply the same active/published filters and convert `amount` from `numeric` to number before returning.
  4. Add lightweight unit tests covering the filters and URL conversion logic (mock `db` + storage helper).
- **Exit criteria**: No unpublished vehicle or inactive organization can be fetched, every image URL is browser-ready, and tests cover the new guardrails.

---
## 3. Component Migration & Completion
- **Objective**: move all vehicle-detail primitives into `components/product/` and finish their APIs before Task 4 consumes them.
- **Required files**: `components/product/`, `app/[locale]/cars/KeySpecification.tsx`, `app/[locale]/cars/ServicesShowcase.tsx`, `components/banks/FinancingTabs.tsx`, `components/reviews/TrafficLightReviews.tsx`, `components/product/seller-card.tsx`, `components/product/product-title.tsx`, `components/product/vehicle-all-specs.tsx`.
- **Tasks**:
  1. Move `KeySpecification` and `ServicesShowcase` from `app/[locale]/cars/` into `components/product/` and update exports.
  2. Finish `ProductTitle` so it accepts discrete props (`brand`, `model`, `year`, `variant`, range/battery numbers) instead of the mock `vehicle` object.
  3. Rebuild `SellerCard` to match the Agency/Seller requirements (badge colors, CTA, perks, availability) using the data contract documented in Task 4.
  4. Flesh out `FinancingTabs` with tabs per bank, rate display, and optional APR/term chips.
  5. Replace the placeholder `TrafficLightReviews` with a component that takes positive/neutral/negative counts and renders skeleton copy when data is missing.
  6. Implement `VehicleAllSpecs` to read from the Drizzle spec shape (range, battery, charging, dimensions) and render in sections.
- **Exit criteria**: Every component is importable from `components/product`, exports TypeScript props aligned with Task 4’s pseudocode, and no TODO placeholders remain.

---
## 4. Shared Types & Utilities
- **Objective**: centralize vehicle/organization/bank shapes to avoid ad-hoc typing in Task 4.
- **Required files**: `types/vehicle.ts` (new), `types/organization.ts` (optional), `types/bank.ts` (optional), `lib/utils/identifiers.ts`, `scripts/utils/identifiers.ts`, related tests.
- **Tasks**:
  1. Create `types/vehicle.ts` exporting `Vehicle`, `VehicleSpecifications`, `VehiclePricing`, and `VehicleMediaImage` interfaces that mirror the query outputs.
  2. Update queries and components to import these types instead of inline `Awaited<ReturnType<...>>` helpers.
  3. Extend `tests/identifiers.test.ts` (or add new tests) for any new slug/id helpers you create while wiring Task 4 (e.g., WhatsApp CTA builders).
- **Exit criteria**: All vehicle-related files consume the shared types, and TypeScript no longer infers anonymous shapes from query functions.

---
## 5. Routing & Metadata Helpers
- **Objective**: ensure locale-aware paths and metadata utilities exist before building the page.
- **Required files**: `i18n/routing.ts`, `lib/seo/vehicle.ts` (new helper), `docs/Phase 1/Task4.md` checklist.
- **Tasks**:
  1. Confirm `/vehiculos/[slug]` and `/vehicles/[slug]` entries exist in `i18n/routing.ts` (already present) and add helper functions (`getVehicleCanonical(locale, slug)`).
  2. Extract the metadata logic from Task 4’s spec into `lib/seo/vehicle.ts` so the page component only calls `buildVehicleMetadata(vehicle, locale)`.
  3. Unit-test the metadata helper for Spanish/English descriptions and hero image fallbacks.
- **Exit criteria**: Metadata generation is reusable/tested, and routing helpers are ready for both locales.

---
## 6. Page Scaffolding Smoke Test
- **Objective**: prove that the data layer + components can render before implementing the final UI polish.
- **Required files**: `app/[locale]/vehicles/[slug]/page.tsx` (new), `app/[locale]/vehicles/page.tsx` (listing stub), `tests/` for potential integration tests.
- **Tasks**:
  1. Create the basic `/[locale]/vehicles/[slug]` page that fetches `getVehicleBySlug`, guards 404, and renders minimal debug output (brand/model + seller count) to validate data flows.
  2. Update `app/[locale]/vehicles/page.tsx` to call `getVehicles` with pagination and log results (even if UI is simple), ensuring listing filters don’t crash.
  3. Add a Playwright-lite smoke test (or Bun test + mock db) verifying the page compiles without environment variables (mock db in tests).
- **Exit criteria**: Running `bun run dev` shows a functioning (unstyled) detail page backed by real data, giving confidence before UI layering.

---
## Tracking Tips
- Make sure you don't introduce breaking changes for nextjs 16, sixteen the newest version
- Avoid using any except if you are working with routes. 
- Output a file to hands-off with a summary of all files changes or edits you have done. 
- 
