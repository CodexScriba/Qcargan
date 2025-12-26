---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Vehicles Listing Page

## Goal
Create vehicles listing page with grid, filters, and pagination.

## Definition of Done
- [ ] Vehicle grid with cards
- [ ] Filter sidebar (body type, range, price)
- [ ] Pagination
- [ ] Server-side data fetching

## Files
- `app/[locale]/vehiculos/page.tsx` - create - listing page
- `components/product/VehicleCard.tsx` - create - vehicle card
- `components/product/VehicleFilters.tsx` - create - filter sidebar

## Tests
- [ ] Integration: Vehicles load from database
- [ ] Integration: Filters update results
- [ ] Integration: Pagination works

## Context
Use Server Components for data fetching. Filters applied via URL params.
