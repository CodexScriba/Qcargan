---
stage: plan
tags: [feature, p1]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-drizzle-orm.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Build Vehicle Detail Page

## Goal
Image carousel with hero + thumbnails. Key specs display. Full specs accordion. Seller cards with pricing. Financing calculator tabs.

## Definition of Done
- [ ] Image carousel with hero + thumbnails
- [ ] Key specs display
- [ ] Full specs accordion
- [ ] Seller cards with pricing
- [ ] Financing calculator tabs

## Files
- `app/[locale]/vehiculos/[slug]/page.tsx` - create - detail page
- `components/product/ImageCarousel.tsx` - create
- `components/product/VehicleKeySpecs.tsx` - create
- `components/product/VehicleAllSpecs.tsx` - create
- `components/product/SellerCard.tsx` - create
- `components/product/FinancingTabs.tsx` - create

## Tests
- [ ] Integration: Vehicle data loads by slug
- [ ] Visual: Image carousel functional
- [ ] Integration: Financing calculations correct

## Context
Phase 6: Public Pages
Spanish route: `/vehiculos/[slug]`.
Legacy reference: `/legacy/app/[locale]/vehicles/[slug]/`
Must handle dynamic params correctly (await params).