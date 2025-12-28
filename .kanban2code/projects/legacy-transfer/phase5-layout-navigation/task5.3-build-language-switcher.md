---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md]
parent: roadmap-legacy-transfer
---

# Build Language Switcher

## Goal
Dropdown shows available locales. Current locale highlighted. Switching locale redirects to same page in new locale.

## Definition of Done
- [ ] Dropdown shows available locales
- [ ] Current locale highlighted
- [ ] Switching locale redirects to same page in new locale

## Files
- `components/layout/language-switcher.tsx` - create

## Tests
- [ ] Integration: Switching from es to en changes URL
- [ ] Integration: Page content updates to new locale

## Context
Phase 5: Layout & Navigation
Use navigation helpers from `lib/i18n/navigation.ts`.
Legacy reference: `/legacy/components/layout/language-switcher.tsx`
