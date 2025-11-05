# QuéCargan Development Roadmap

> **Planning Status**: 🚧 Work in Progress - Building collaboratively
>
> This document tracks pending work and upcoming features. We're building this step-by-step based on current gaps and priorities.

---

## Current State Analysis

### What's Working ✅

**Pages**
- Localized auth flows (login, sign-up, forgot/update password)
- Protected area with profile, username, and storage demos
- Vehicle detail showcase (`/cars/page.tsx`) with static data

**Components**
- Vehicle presentation: ProductTitle, ImageCarousel, KeySpecification cards
- Engagement UI: CarActionButtons (UI only), TrafficLightReviews (structure), FinancingTabs (mock data)
- Platform chrome: responsive navbar, theme switcher, language switcher
- Discovery helpers: ShowcaseCarousel, ServicesShowcase (mock content)

**Backend & Data**
- Supabase + Drizzle ORM wired into Bun-powered Next.js
- Multi-organization schema with RLS (organizations, organization_members, profiles)
- Username availability and profile update APIs
- Seed scripts for organizations, vehicles, and pricing samples

### What's Incomplete ⚠️

**Architecture gaps**
- Missing vehicle discovery (listings, search, filters)
- No public organization/seller profiles or directories
- No buyer dashboard (favorites, comparisons, saved searches)
- No seller tooling (listing management, org profile editing)
- Reviews, inquiries/messaging, and accessories/services data are placeholders

**Operational gaps**
- CI secrets not configured
- Rollback and backup drills outstanding
- Integration test coverage limited

**Component follow-ups**
- CarActionButtons need favorite/compare logic
- TrafficLightReviews needs real ratings data
- ServicesShowcase should read from database
- KeySpecification reuse should be centralized under `components/product/`

---

## Pending Work - Needs Prioritization

### Pages That Don't Exist Yet
1. Vehicle listings grid/search (`/vehicles`, `/vehicles/new`, `/vehicles/used`)
2. Organization directory (`/sellers`, `/agencies`, `/dealers`, `/importers`)
3. Organization profile (`/sellers/[slug]`)
4. Buyer dashboard (`/dashboard`, `/dashboard/favorites`, `/dashboard/comparisons`)
5. Seller dashboard (`/seller/dashboard`, `/seller/listings`, `/seller/listings/new`)
6. Accessories storefront (`/shop`, `/shop/[category]`, `/shop/products/[slug]`)
7. Services directory (`/services`, `/services/[category]`)
8. Admin panel (`/admin/*`)

### Components Requiring Backend Logic
1. CarActionButtons – favorites / compare mutations & state
2. TrafficLightReviews – ratings aggregation & display
3. FinancingTabs – bank rate ingestion and display rules

### API Endpoints Needed
1. `GET /api/vehicles` – listings with filters/sort/pagination
2. `GET /api/vehicles/[slug]` – single vehicle detail
3. `POST/DELETE /api/user/favorites` – toggle favorites
4. `GET /api/user/favorites` – retrieval for dashboard & UI state
5. `POST/DELETE /api/user/comparisons` and list endpoint
6. `GET /api/organizations` – directory feed (+ filters)
7. `GET /api/organizations/[slug]` – organization profile
8. `POST /api/inquiries` – send buyer inquiries (initially via WhatsApp fallback)
9. `POST /api/reviews` – capture reviews with moderation queue
10. Seller APIs – listings CRUD, team management, asset uploads

### Database Tables Needed
1. `user_favorites`
2. `user_comparisons`
3. `saved_searches`
4. `inquiries` and `inquiry_messages`
5. `vehicle_reviews` and `organization_reviews`
6. `notifications`
7. `services` and `service_providers`
8. Stretch: `flagged_content`, `audit_log`

### Infrastructure & Operations
1. Configure GitHub secrets for CI (Supabase keys, PostHog, Sentry)
2. Run rollback drill (staging) and document playbook
3. Perform backup restore test
4. Set up performance monitoring (Vercel analytics, Lighthouse budget)
5. Enable error monitoring (Sentry) and product analytics (PostHog)

---

## Next: Let's Prioritize Together

Roadmap phases follow a "buyer first" approach: unlock discovery, deepen engagement, build trust, empower sellers, then extend the catalog. Each phase should end with runnable features, updated docs, and smoke-tested flows.

---

## Phase 1 – Discovery Foundation (Week 1)

**Objectives**
- Launch a usable listings browse experience and baseline observability.

**Detailed Tasks**
1. Finalize listings information architecture (filters, sorting, metadata).
2. Implement listings grid page with responsive layout and basic filters.
3. Connect listings page to Drizzle queries and Supabase data sources.
4. Deliver vehicle detail data pipeline (server loaders, metadata enrichment).
5. Establish persistent storage plan for favorites and comparisons scaffolding.
6. Configure Sentry and PostHog, verify events for key buyer interactions.
7. Set up CI secrets and monitor deployments for regressions.

## Phase 2 – Buyer Engagement (Weeks 2–3)

**Objectives**
- Deepen buyer retention through saved actions and dashboards.

**Detailed Tasks**
1. Design dashboard IA covering favorites, comparisons, and saved searches.
2. Build dashboard layout with localized routes and access control checks.
3. Implement API flows for creating, updating, and removing favorites.
4. Implement comparison list lifecycle, including add, reorder, and remove actions.
5. Ship saved searches storage with configurable alert preferences.
6. Draft notification strategy for saved searches (email, SMS, push backlog).
7. Extend integration tests to cover primary buyer journeys end to end.

## Phase 3 – Trust & Social Proof (Weeks 3–4)

**Objectives**
- Help buyers evaluate sellers and vehicles with transparent signals.

**Detailed Tasks**
1. Define organization profile content strategy (hero, stats, contact options).
2. Create organization directory navigation with filters by type and location.
3. Develop review collection workflow (submission, moderation, publishing).
4. Build ratings aggregation model and surface visual summaries on listings.
5. Integrate real review data into TrafficLightReviews and related UI.
6. Launch first inquiry pathway with WhatsApp deep links and fallback logging.
7. Document moderation policy and escalation process for flagged reviews.

## Phase 4 – Seller Operations (Weeks 4–5)

**Objectives**
- Empower sellers to manage inventory within multi-organization guardrails.

**Detailed Tasks**
1. Map seller dashboard personas (owner, admin, staff) and permissions.
2. Implement listings management views with create, edit, publish, and archive flows.
3. Build organization profile editor covering branding, contact, and services.
4. Provide media upload workflow aligned with Supabase Storage policies.
5. Enforce RLS behavior for multi-organization memberships across dashboards.
6. Schedule and execute rollback drill, capturing runbook learnings.
7. Schedule and execute backup restore test, updating operational documentation.

## Phase 5 – Extended Catalog (Week 5 + buffer)

**Objectives**
- Expand marketplace coverage with services and accessories while refining insights.

**Detailed Tasks**
1. Finalize taxonomy for services and accessories (categories, tags, provider mapping).
2. Build services directory pages with filtering and provider detail views.
3. Build accessories storefront browse and product detail experiences.
4. Connect ServicesShowcase and related homepage sections to live catalog data.
5. Decide and implement financing data ingestion approach (manual or partner API).
6. Enhance dashboards with analytics snapshots and engagement KPIs.
7. Validate data quality and establish routines for catalog updates.

---

## Final Deliverables Summary

**Core Features**
- Real listings & detail pages with engagement loops (favorites, comparisons, saved searches)
- Seller experiences (org profiles, dashboards, listing management)
- Social proof (reviews, ratings) and inquiry flows
- Services & accessories catalog extensions

**Technical Infrastructure**
- Monitoring & analytics live (Sentry, PostHog)
- Drizzle migrations + RLS hardened for multi-org access patterns
- API surface documented with schema + expected responses
- Tests covering buyer/seller happy paths and critical regressions

**User Journeys**
1. Buyer: browse → filter → favorite/compare → vet seller → contact
2. Seller: sign in → manage organization → publish listings → monitor activity
3. Services/Accessories: browse curated directories → follow CTAs to providers

---

## Post-Launch (Future Phases)
- Admin moderation console
- Full inquiry messaging inbox (beyond WhatsApp)
- Notifications + saved search alerts (email/push)
- Accessories cart/checkout and seller tooling
- Advanced analytics dashboards & reporting
- Mobile experiences (React Native) and dealership kiosks
- Auctions, trade-in valuation, insurance integrations

---

## Success Metrics Tracking

**Acquisition & Engagement**
- Weekly net new sign-ups
- Favorites/comparisons created per user cohort
- Review submission rate

**Seller Activation**
- Listings published per org type
- Response time to inquiries
- Org profile completeness

**Performance & Reliability**
- Page load (p95 < 2s), API latency (p95 < 500ms)
- Error rate < 1%
- Uptime ≥ 99.5%

Instrument metrics with PostHog dashboards and Sentry alerts; review weekly.

---

## Timeline Recap

| Week | Phase | Focus | Deliverable |
|------|-------|-------|-------------|
| 0 | Pre-work | Monitoring setup | Sentry + PostHog live |
| 1 | Phase 1 | Discovery Foundation | Listings grid + telemetry |
| 2–3 | Phase 2 | Buyer Engagement | Dashboard + engagement APIs |
| 3–4 | Phase 3 | Trust & Social Proof | Reviews + org profiles |
| 4–5 | Phase 4 | Seller Operations | Seller dashboard + RLS drills |
| 5 | Phase 5 | Extended Catalog | Services & accessories directories |

🎉 **Roadmap Updated!** We now have a concise plan that keeps the original structure while focusing on outcome-driven milestones.
`````````
