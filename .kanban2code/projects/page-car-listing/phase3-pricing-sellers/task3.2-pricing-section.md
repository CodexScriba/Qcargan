---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/skill-tailwindcss-v4]
---

# Implement PricingSection Layout

## Goal

Integrate SellerCard components into the page container with a right sidebar layout on desktop and stacked cards on mobile, including a section header with seller count and an empty state when no sellers.

## Definition of Done
- [ ] Right sidebar layout on desktop (1/3 width)
- [ ] Stacked cards on mobile (full width)
- [ ] Section header with seller count (e.g., "2 Sellers")
- [ ] Empty state shown when no pricing data
- [ ] Responsive layout adapts to breakpoints
- [ ] All text uses translation keys from vehicles namespace

## Files
- `app/[locale]/cars/[slug]/page.tsx` - modify - integrate SellerCard components

## Tests
- [ ] Multiple sellers display correctly in right sidebar
- [ ] Layout responsive across breakpoints (mobile/tablet/desktop)
- [ ] Empty state shown when no pricing data
- [ ] Section header displays correct seller count
- [ ] Translation keys render correctly in English and Spanish

## Context

The PricingSection should be integrated into the page container with:
- A two-column layout: left column (2/3 width) for vehicle info, right column (1/3 width) for seller cards
- Right sidebar on desktop containing SellerCard components stacked vertically
- Stacked layout on mobile (seller cards below vehicle info)
- Section header with seller count (e.g., "2 Sellers" or "Available from 2 sellers")
- Empty state when no pricing data (message like "No sellers currently offering this vehicle")
- Use translation keys for all text

## Notes

- Use grid or flexbox for two-column layout
- On desktop: left column (2/3 width), right column (1/3 width)
- On mobile: single column, seller cards below vehicle info
- Use responsive breakpoints (md or lg) for layout changes
- Map through vehicle.pricing array to render SellerCard components
- Pass vehicleInfo (brand, model, year) to each SellerCard
- Show empty state when pricing array is empty or null
- Use translation keys for section header and empty state
- Follow existing layout patterns from the codebase
