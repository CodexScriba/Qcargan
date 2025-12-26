---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Define Localized Route Pathnames

## Goal
Define all 40+ localized routes with Spanish and English paths.

## Definition of Done
- [ ] All 40+ routes defined in pathnames object
- [ ] Spanish paths use Spanish words (vehiculos, precios, etc.)
- [ ] Navigation helpers exported (Link, redirect, usePathname, useRouter)

## Files
- `lib/i18n/routing.ts` - modify - add all pathnames

## Tests
- [ ] Unit: getPathname returns correct localized path
- [ ] Integration: Link component generates correct href

## Context
Export all navigation helpers from routing.ts for use throughout the app.
