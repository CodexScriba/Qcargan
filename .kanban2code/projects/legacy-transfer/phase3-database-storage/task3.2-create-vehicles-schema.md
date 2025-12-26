---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Vehicles Schema

## Goal
Define vehicles and vehicle_specifications tables with proper indexes.

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
Use $type<>() for TypeScript enum types. Define indexes in table callback.
