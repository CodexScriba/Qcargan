---
stage: plan
tags: [refactor, p1]
agent: planner
contexts: [ai-guide, architecture, skills/skill-drizzle-orm]
---

# Verify and Enhance Data Queries

## Goal

Ensure the `getVehicleBySlug` query returns all required fields for the car listing page, handles missing specifications gracefully, and exports complete TypeScript types.

## Definition of Done
- [ ] `getVehicleBySlug` returns all required fields (vehicle, specs, images, pricing with organizations)
- [ ] Query handles missing specifications gracefully (null values don't break the query)
- [ ] TypeScript types are complete and exported
- [ ] Query excludes unpublished vehicles (where `published = false`)

## Files
- `lib/db/queries/vehicles.ts` - modify - verify and enhance existing query

## Tests
- [ ] Query returns correct data shape for existing vehicle
- [ ] Query returns null for non-existent slug
- [ ] Query excludes unpublished vehicles
- [ ] TypeScript types match returned data structure

## Context

The car listing page needs comprehensive vehicle data including:
- Basic vehicle info (brand, model, year, variant, bodyType, description, slug, published)
- Vehicle specifications (rangeKm, batteryKwh, acceleration0To100, plus JSONB specs field)
- Vehicle images (storagePath, altText, sortOrder)
- Vehicle pricing with organization details (price, currency, availability, org name/logo)
- All data fetched via Drizzle ORM with proper joins

## Notes

- Use existing Drizzle schema from `lib/db/schema/`
- Export types for use in component props
- Ensure query is performant (use proper indexes if needed)
- Handle null values gracefully in the query logic
