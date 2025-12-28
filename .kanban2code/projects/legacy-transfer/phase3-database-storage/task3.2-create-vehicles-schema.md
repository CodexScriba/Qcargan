---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-drizzle-orm.md]
parent: roadmap-legacy-transfer
---

# Create Vehicles Schema

## Goal
vehicles table with core fields (brand, model, year, variant, slug). vehicle_specifications table with range, battery, performance, etc. Proper indexes defined. TypeScript types exported.

## Definition of Done
- [ ] vehicles table with core fields (brand, model, year, variant, slug)
- [ ] vehicle_specifications table with range, battery, performance, etc.
- [ ] Proper indexes defined
- [ ] TypeScript types exported

## Files
- `lib/db/schema/vehicles.ts` - create - vehicle tables
- `lib/db/schema/index.ts` - create - barrel export

## Tests
- [ ] Unit: Schema compiles without TypeScript errors
- [ ] Unit: Types correctly infer from schema

## Context
Phase 3: Database & Storage
Legacy reference: `/legacy/lib/db/schema/vehicles.ts`
One file per domain entity in Drizzle.
