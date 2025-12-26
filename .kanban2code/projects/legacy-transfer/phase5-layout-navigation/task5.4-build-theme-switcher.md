---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Theme Switcher

## Goal
Create toggle component for switching between light and dark modes.

## Definition of Done
- [ ] Toggle between light/dark modes
- [ ] Icon changes based on current theme
- [ ] Respects system preference initially

## Files
- `components/layout/theme-switcher.tsx` - create

## Tests
- [ ] Integration: Click toggles theme
- [ ] Integration: Theme persists on refresh

## Context
Use next-themes' useTheme hook for theme management.
