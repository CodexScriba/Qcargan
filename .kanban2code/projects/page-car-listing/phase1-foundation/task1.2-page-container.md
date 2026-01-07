---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/nextjs-core-skills, skills/skill-next-intl]
---

# Set Up Page Container

## Goal

Update the existing page scaffold at `/[locale]/cars/[slug]/page.tsx` to fetch vehicle data, pass it to placeholder sections, handle 404 for invalid slugs, and generate correct metadata.

## Definition of Done
- [ ] Page loads at `/[locale]/cars/[slug]`
- [ ] Vehicle data fetched via `getVehicleBySlug(slug)` and passed to placeholder sections
- [ ] 404 page shown for invalid slugs (when vehicle is null)
- [ ] Metadata generated correctly (title, description, open graph)
- [ ] Page is a server component (async function)

## Files
- `app/[locale]/cars/[slug]/page.tsx` - modify - update existing scaffold

## Tests
- [ ] Page renders with valid slug
- [ ] Page shows 404 for invalid slug
- [ ] Page title includes vehicle name (e.g., "2024 BYD Seagull")
- [ ] Metadata includes vehicle description for SEO
- [ ] Page is accessible in both English and Spanish

## Context

The page container is the entry point for the car listing page. It should:
- Be an async server component
- Await params (Next.js 16 requires this)
- Fetch vehicle data using `getVehicleBySlug(slug)`
- Return notFound() if vehicle is null
- Generate metadata using the vehicle data
- Render placeholder sections that will be filled in later phases
- Support i18n via next-intl

## Notes

- Use `await params` before destructuring in Next.js 16
- Use `notFound()` from `next/navigation` for 404 handling
- Generate metadata using the Metadata API
- Create placeholder sections for: VehicleHeader, VehicleGallery, VehicleQuickSpecs, VehicleDetailedSpecs, VehicleDescription, SellerCard[], FinancingSection, ReviewSummary, AccessoriesSection, ServicesSection
- Use existing translation pattern from other pages
