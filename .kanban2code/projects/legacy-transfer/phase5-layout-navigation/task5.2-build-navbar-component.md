---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Navbar Component

## Goal
Create responsive navbar with desktop, tablet, and mobile variants.

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
Use glassmorphic design with blur effects from the design system.
