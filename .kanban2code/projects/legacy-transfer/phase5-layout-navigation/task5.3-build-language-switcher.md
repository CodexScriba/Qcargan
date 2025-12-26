---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Language Switcher

## Goal
Create dropdown component for switching between Spanish and English.

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
Use next-intl's Link component for locale-aware navigation.
