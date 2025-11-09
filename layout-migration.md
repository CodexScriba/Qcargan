# Layout Migration Plan

## Objective
- Lift the polished `/cars` experience currently running on the demo server (port `3001`) into the production app (port `3000`) so that both the layout and every supporting component render identically.
- Ensure the migration aligns with the architecture guardrails documented in `docs/architecture.md` (Next.js App Router + edge-friendly composition, modular Drizzle queries, SSR-ready components).

## Source of Truth
- Demo implementation: `app/[locale]/cars/page.tsx` plus the product component suite in `components/product`, `components/showcase`, and `components/banks/FinancingTabs.tsx`.
- Data contracts: `getVehicleBySlug` and `getBanks` in `lib/db/queries`.
- Theming + utility classes: `app/globals.css`, Tailwind v4 tokens, and `card-container` utilities defined there.

## Workstreams & Tasks

### 1. Entry Route & Data Loading
- Verify which route should serve the production experience (likely `app/[locale]/vehicles/[slug]/page.tsx` per `docs/Roadmap/Phase 1/tasks/Task4.md`). If it does not exist yet, scaffold it and hook it into the locale-aware router.
- Ensure the route’s data loader mirrors the demo: fetch a concrete slug via `getVehicleBySlug`, bail out with `notFound()` when absent, and fetch banks via `getBanks`.
- Normalize the pricing transformation logic (sorting, emphasis styling, CTA/perks mapping) into a shared utility to avoid duplication between `/cars` and `/vehicles/[slug]`.
- Define a fallback slug selection strategy (config, query param, or first published vehicle) to prevent 500s while the CMS is empty.

### 2. Layout Shell Parity
- Apply the same container sizing (`container mx-auto px-4 py-6 max-w-[1600px] space-y-6`) and `card-container` wrappers around each major section.
- Port the gradient dividers (the 1px neon accent bars) and the consistent rounded-3xl shells to match the demo visuals.
- Reuse the CSS helpers from `app/globals.css` (glass surface gradients, neon glows). Audit production-only overrides to ensure they do not conflict; remove or update any obsolete utility classes.

### 3. Hero Module & Media Carousel
- Drop in the `ProductTitle`, `ImageCarousel`, and the 3-column grid layout exactly as implemented on the demo page.
- Confirm `ImageCarousel` receives `vehicle.media.images` (public URLs) and `vehicle.media.heroIndex`. Add loading states/Skeletons while the query resolves.
- Ensure responsive behavior matches demo (two columns collapse to single column on small screens).

### 4. Seller Stack & CTAs
- Embed `CarActionButtons` with the correct locale-aware share URLs and contact fallbacks. Validate that favorites/compare buttons do not throw when auth is unauthenticated (graceful no-op).
- Render seller cards by slicing `vehicle.pricing`, sorting by organization type (Agency → Dealer → Importer), and limiting to two cards before the “See All Sellers” CTA.
- Port `SellerCard` and `SeeAllSellersCard` styles verbatim (glass border, emphasis ring). Ensure data like badges/perks survive translation between locales.

### Component-Level Parity Audit
- `HeroActionButtons` (demo CarActionButtons) drives the two-pill “Add to favorites / compare” row; replace the advanced share widget on `/cars` with this lightweight toggle so the hero actions match the screenshot exactly while keeping the existing `CarActionButtons` (or an advanced variant) for `vehicles/[slug]`.
- `SellerCard` must float with the same gradient stroke, badge layout, and “View more details” toggles. Port the demo implementation as-is and adapt the Supabase pricing payload so `amount`, `currency`, `availability`, `financing`, `cta`, `perks`, and `emphasis` all map into the new interface without losing data (perks from Supabase, CTA URLs for the contact button, etc.).
- `KeySpecification` needs to reuse the hero spec helper (`toHeroSpecs`) to guarantee the same six metrics in the same order; build a `buildVehicleHeroSpecsInput` helper that converts `vehicleSpecifications` (range columns, battery, charging, performance, powerKw/HP) into `VehicleSpecsRaw` before rendering with `Navigation`, `Zap`, `PlugZap`, `Timer`, and `Gauge` icons.
- Shared utilities: carry over `lib/formatters/vehicle.ts` and `lib/vehicle/specs.ts` from the demo project so all spec formatting (km, kW, rounding rules) and `HeroSpec` data stay synchronized with the source of truth.

### 5. Financing Area
- Reuse `FinancingTabs` from `components/banks/FinancingTabs.tsx`. Confirm the prop contract (`banks: BankTab[]`) matches the output from `getBanks()`. Add guard rails for missing APR/terms.
- Challenge: Tabs currently assume `Avatar` logos exist; handle cases where production banks lack imagery by falling back to initials and preventing layout shifts.
- Ensure the gradient heading (“Financing Options”) plus border separators match the demo, and the tabs mount only after seller cards (same order as demo).

### 6. Specs, Reviews, Accessories & Services
- `KeySpecification` grid: conditionally render each metric, add icons from `lucide-react`, keep the 6-column responsive grid.
- `TrafficLightReviews`: embed the component and confirm styles align with dark-theme tokens; if placeholder data differs between builds, isolate mock data to avoid hydration warnings.
- `VehicleAllSpecs`: ensure the accordion receives both `specifications` and `detailedSpecs`. Validate localization of labels.
- `ShowcaseCarousel` + `ServicesShowcase`: include the same empty-state accessories array and services grid as the demo.

### 7. Shared Utilities & i18n
- Centralize repeated formatting helpers (price, range, CTA copy) so both demo and production routes stay in sync.
- Review translations namespaced under `vehicle.*` and `seo.vehicleDetail.*` to guarantee new UI strings exist in both `messages/es.json` and `messages/en.json`.
- Confirm `CarActionButtons` toast copy (`t('share.*')`, `t('contact.*')`) is available for both locales to avoid runtime errors.

### 8. QA & Regression Strategy
- Visual QA: run Playwright against `http://localhost:3000/cars` (or `/[locale]/vehicles/[slug]`) and `http://localhost:3001/cars`, taking full-page screenshots to diff layouts.
- Interaction QA: verify carousel navigation, tabs switching, seller CTA buttons, and share action under both light and dark themes.
- Data QA: seed DB via `scripts/seed-production-vehicles.ts`, confirm the page renders when multiple sellers/banks are missing to ensure empty states look intentional.
- Performance QA: ensure Suspense boundaries or skeletons cover every async component to avoid layout shifts on slower SSR responses.

## Anticipated Challenges & Breaking Changes
- **FinancingTabs Data Shape**: Production banks may not yet expose `aprMin`, `aprMax`, or `terms`. Without guards the component could render “undefined% APR”. Add defensive formatting and tests.
- **Server vs Client Component Boundaries**: `CarActionButtons` and `ImageCarousel` are client components embedded in a server page. Any new data dependencies must be serializable; avoid passing functions or Dates directly from the server component.
- **Auth Redirects**: `/cars` currently redirects to `/auth/ingresar` in production. Investigate middleware or guard logic so anonymous users can view the page.
- **Styling Tokens Drift**: Global CSS might include overrides that break the demo visuals (e.g., legacy `.card` classes). Audit and clean up conflicting styles before merging.
- **Hydration Mismatch Risk**: Placeholder accessories array (`[]`) means `ShowcaseCarousel` renders nothing; ensure both demo and prod supply the same props to avoid hydration warnings.

## Deliverables
- Updated route (likely `app/[locale]/vehicles/[slug]/page.tsx`) rendering the demo layout end-to-end.
- Supporting component tweaks (SellerCard, FinancingTabs, KeySpecification, CarActionButtons) to guarantee parity.
- Visual/interaction QA artifacts (screenshots or notes) demonstrating that port `3000` matches port `3001`.

## Next Steps
1. Verify routing + auth guards so `/cars` (or `/vehicles/[slug]`) is publicly reachable.
2. Begin applying the layout shell changes section by section, starting with the hero module.
3. Address FinancingTabs resiliency, then move on to seller cards and the remaining sections.
