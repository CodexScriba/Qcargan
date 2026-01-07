---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/skill-tailwindcss-v4]
---

# Implement FinancingSection Layout

## Goal

Create a financing section component that displays bank cards in a horizontal scrollable row with a section header and description, hidden when no featured banks are available.

## Definition of Done
- [ ] Horizontal scrollable row of bank cards
- [ ] Section header with description (e.g., "Financing Partners")
- [ ] Hidden when no featured banks
- [ ] Responsive layout (scrollable on mobile, grid on desktop if preferred)
- [ ] All text uses translation keys from vehicles namespace

## Files
- `components/vehicles/financing-section.tsx` - create - bank cards container

## Tests
- [ ] Multiple banks display correctly
- [ ] Section hidden when no banks
- [ ] Horizontal scroll works on mobile
- [ ] Translation keys render correctly in English and Spanish

## Context

The FinancingSection component should:
- Be a server component (displays bank cards, no interactivity)
- Receive props: banks (array of BankData), vehicleInfo (brand, model, year)
- Display a section header with description
- Show bank cards in a horizontal scrollable row
- Hide the entire section when no banks are available
- Use translation keys for all text
- Map through banks array to render BankCard components
- Pass vehicleInfo to each BankCard

## Notes

- Use horizontal scroll with overflow-x-auto for mobile
- Consider using a grid layout on desktop for better visibility
- Use flexbox for horizontal layout
- Hide section when banks array is empty or null
- Use translation keys for section header and description
- Follow existing component patterns from the codebase
- Ensure scroll behavior is smooth and intuitive
