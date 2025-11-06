# Car Page Design Reference

This folder contains the **original car detail page implementation** from the old quecargan project for reference purposes.

## Purpose

This is a **design reference only** - not meant to be used directly in the new Qcargan project. The actual implementation is in `app/[locale]/cars/page.tsx`.

## Key Differences

### Old Design (This Reference)
- Uses `db.json` fake data file
- Direct data access: `db.vehicles[0]`
- Has helper utilities like `toHeroSpecs` from `@/lib/vehicle/specs`
- Complex price filtering and sorting logic
- Type casting for database types

### New Implementation (`app/[locale]/cars/page.tsx`)
- Uses **mock data** inline (Phase 0)
- Will be updated to use **Supabase + Drizzle ORM** in Phase 1
- Simplified structure ready for database queries
- TypeScript types aligned with new schema

## What to Learn From This

When implementing Phase 1 (real database integration), reference this file for:

1. **Data Structure**: How vehicle data is shaped and accessed
2. **Price Filtering**: Logic for sorting offers (agency, grey_market, import)
3. **Specs Display**: The `toHeroSpecs` helper pattern for key specifications
4. **Icon Mapping**: How lucide icons are mapped to spec keys
5. **Section Layout**: The overall page structure and responsive grid patterns

## Phase 1 Implementation Checklist

When converting to real Supabase data:

- [ ] Create Drizzle query to fetch vehicle by slug
- [ ] Include related data (pricing, specifications, images, organization)
- [ ] Implement `toHeroSpecs` equivalent or inline logic
- [ ] Map database enums to UI constants
- [ ] Handle loading and error states
- [ ] Add `generateMetadata` for SEO
- [ ] Add `generateStaticParams` for static generation

## Files in This Reference

- `page.tsx` - Main vehicle detail page
- `KeySpecification.tsx` - (Not copied, already in `app/[locale]/cars/`)
- `ServicesShowcase.tsx` - (Not copied, already in `app/[locale]/cars/`)

## Related Documentation

- See `docs/roadmap.md` Phase 1 for database integration plan
- See `docs/architecture.md` for component documentation
