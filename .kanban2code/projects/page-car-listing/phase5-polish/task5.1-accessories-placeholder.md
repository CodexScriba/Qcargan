---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills]
---

# Implement AccessoriesSection Placeholder

## Goal

Create a placeholder accessories section that shows 4 placeholder accessory cards linking to the /shop page with a section header explaining "Related Accessories".

## Definition of Done
- [ ] Shows 4 placeholder accessory cards
- [ ] Cards link to /shop page
- [ ] Section header explains "Related Accessories"
- [ ] Component is a server component (no interactivity needed)
- [ ] All text uses translation keys from vehicles namespace
- [ ] Placeholder cards have realistic accessory names (e.g., "Home Charger", "Portable Charger", "Charging Cable", "Wall Mount")

## Files
- `components/vehicles/accessories-section.tsx` - create - placeholder grid

## Tests
- [ ] Placeholder cards render correctly
- [ ] Links navigate to /shop
- [ ] Translation keys render correctly in English and Spanish
- [ ] Section displays with 4 cards

## Context

The AccessoriesSection component should:
- Be a server component (displays placeholder cards, no interactivity)
- Display a section header with "Related Accessories" text
- Show 4 placeholder cards in a grid layout
- Each card should have:
  - Accessory name (e.g., "Home Charger", "Portable Charger")
  - Placeholder icon or image
  - Link to /shop page
- Use translation keys for all text
- This is a placeholder for future real data from an accessories table

Note: This is a placeholder section. The accessories data model doesn't exist yet, so we're showing static placeholder cards that link to the /shop page. In the future, this will be replaced with real data from an accessories table.

## Notes

- Use Card component from Shadcn UI for each accessory card
- Use a grid layout (e.g., grid-cols-2 md:grid-cols-4)
- Use lucide-react icons for placeholder icons
- Link each card to /shop page using Link component from next-intl
- Use translation keys for section header and card content
- Keep it simple - no real data, just placeholder content
- Follow existing component patterns from the codebase
