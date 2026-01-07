---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills]
---

# Implement ServicesSection Placeholder

## Goal

Create a placeholder services section that shows 4 placeholder service cards linking to /services page with a section header explaining "EV Services".

## Definition of Done
- [ ] Shows 4 placeholder service cards
- [ ] Cards link to /services page
- [ ] Section header explains "EV Services"
- [ ] Component is a server component (no interactivity needed)
- [ ] All text uses translation keys from vehicles namespace
- [ ] Placeholder cards have realistic service names (e.g., "Electrician", "Mechanic", "Detailing", "Insurance")

## Files
- `components/vehicles/services-section.tsx` - create - placeholder grid

## Tests
- [ ] Placeholder cards render correctly
- [ ] Links navigate to /services
- [ ] Translation keys render correctly in English and Spanish
- [ ] Section displays with 4 cards

## Context

The ServicesSection component should:
- Be a server component (displays placeholder cards, no interactivity)
- Display a section header with "EV Services" text
- Show 4 placeholder cards in a grid layout
- Each card should have:
  - Service name (e.g., "Electrician", "Mechanic", "Detailing", "Insurance")
  - Placeholder icon or image
  - Link to /services page
- Use translation keys for all text
- This is a placeholder for future real data from a services table

Note: This is a placeholder section. The services data model doesn't exist yet, so we're showing static placeholder cards that link to /services page. In the future, this will be replaced with real data from a services table.

## Notes

- Use Card component from Shadcn UI for each service card
- Use a grid layout (e.g., grid-cols-2 md:grid-cols-4)
- Use lucide-react icons for placeholder icons
- Link each card to /services page using Link component from next-intl
- Use translation keys for section header and card content
- Keep it simple - no real data, just placeholder content
- Follow existing component patterns from the codebase
