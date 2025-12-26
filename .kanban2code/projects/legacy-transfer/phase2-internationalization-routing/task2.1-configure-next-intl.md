---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Configure next-intl

## Goal
Set up next-intl with Spanish as default locale and English as secondary.

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
Use as-needed prefix strategy so Spanish has no URL prefix (/) while English has /en.
