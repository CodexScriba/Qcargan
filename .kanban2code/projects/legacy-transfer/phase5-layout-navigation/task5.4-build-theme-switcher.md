---
stage: plan
tags: [feature, p2]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Build Theme Switcher

## Goal
Toggle between light/dark modes. Icon changes based on current theme. Respects system preference initially.

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
Phase 5: Layout & Navigation
Legacy reference: `/legacy/components/layout/theme-switcher.tsx`
Ensure no hydration mismatch by using `mounted` state.