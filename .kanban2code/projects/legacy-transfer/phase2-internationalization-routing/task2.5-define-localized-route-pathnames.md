---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md]
parent: roadmap-legacy-transfer
---

# Define Localized Route Pathnames

## Goal
All 40+ routes defined in pathnames object. Spanish paths use Spanish words (vehiculos, precios, etc.). Navigation helpers exported (Link, redirect, usePathname, useRouter).

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
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/i18n/routing.ts`
