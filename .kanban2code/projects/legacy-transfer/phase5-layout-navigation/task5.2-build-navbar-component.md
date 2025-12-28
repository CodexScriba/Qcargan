---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Build Navbar Component

## Goal
Desktop navbar with logo, nav links, theme/language switchers. Tablet variant with condensed navigation. Mobile variant with hamburger menu. Glassmorphic styling applied.

## Definition of Done
- [ ] Desktop navbar with logo, nav links, theme/language switchers
- [ ] Tablet variant with condensed navigation
- [ ] Mobile variant with hamburger menu
- [ ] Glassmorphic styling applied

## Files
- `components/layout/navbar/Navbar.tsx` - create - main navbar
- `components/layout/navbar/MobileMenu.tsx` - create - mobile drawer
- `components/layout/navbar/NavLinks.tsx` - create - navigation links

## Tests
- [ ] Visual: Desktop layout correct
- [ ] Visual: Mobile menu opens/closes
- [ ] Integration: Links navigate correctly

## Context
Phase 5: Layout & Navigation
Glassmorphic baseline: 200° 62% 97% mist, Liquid Glass Lagoon brand.
Legacy reference: `/legacy/components/layout/navbar/`
