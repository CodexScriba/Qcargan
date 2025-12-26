---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Vehicle Detail Page

## Goal
Create comprehensive vehicle detail page with all components.

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
Load vehicle data via Drizzle from Supabase PostgreSQL.
