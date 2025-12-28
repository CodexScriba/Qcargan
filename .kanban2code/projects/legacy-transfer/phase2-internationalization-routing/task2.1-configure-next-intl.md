---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md]
parent: roadmap-legacy-transfer
---

# Configure next-intl

## Goal
next-intl package configured. Locales defined: es (default), en. Locale prefix strategy: as-needed (no prefix for Spanish). Locale detection disabled.

## Definition of Done
- [ ] next-intl package configured
- [ ] Locales defined: es (default), en
- [ ] Locale prefix strategy: as-needed (no prefix for Spanish)
- [ ] Locale detection disabled

## Files
- `lib/i18n/routing.ts` - create - defineRouting configuration
- `lib/i18n/request.ts` - create - getRequestConfig for SSR
- `i18n.ts` - create - root i18n config with getMessages helper

## Tests
- [ ] Unit: routing.locales contains ["es", "en"]
- [ ] Unit: routing.defaultLocale equals "es"

## Context
Phase 2: Internationalization & Routing
Spanish is default, English secondary.
Legacy reference: `/legacy/i18n/`
