---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Supporting Schemas

## Goal
Define organizations, pricing, images, banks, and profiles tables.

## Definition of Done
- [ ] organizations table (agencies, dealers, importers)
- [ ] vehicle_pricing table (price by organization)
- [ ] vehicle_images table with variants
- [ ] banks table (financing partners)
- [ ] profiles table (user profiles)

## Files
- `lib/db/schema/organizations.ts` - create
- `lib/db/schema/vehicle-pricing.ts` - create
- `lib/db/schema/vehicle-images.ts` - create
- `lib/db/schema/banks.ts` - create
- `lib/db/schema/profiles.ts` - create

## Tests
- [ ] Unit: All schemas compile
- [ ] Unit: Foreign key relationships correct

## Context
One file per domain entity for maintainability.
