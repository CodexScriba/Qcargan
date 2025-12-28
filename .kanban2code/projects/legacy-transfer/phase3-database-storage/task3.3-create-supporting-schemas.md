---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-drizzle-orm.md]
parent: roadmap-legacy-transfer
---

# Create Supporting Schemas

## Goal
organizations table (agencies, dealers, importers). vehicle_pricing table (price by organization). vehicle_images table with variants. banks table (financing partners). profiles table (user profiles).

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
Phase 3: Database & Storage
Legacy reference: `/legacy/lib/db/schema.ts`
Profiles table should map to Supabase auth users.
