---
stage: plan
tags: [feature, p1]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-drizzle-orm.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Build Vehicles Listing Page

## Goal
Vehicle grid with cards. Filter sidebar (body type, range, price). Pagination. Server-side data fetching.

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
Phase 6: Public Pages
Spanish route: `/vehiculos`.
Legacy reference: `/legacy/app/[locale]/vehicles/` (note: renaming to Spanish)
Use Drizzle for server-side data fetching.