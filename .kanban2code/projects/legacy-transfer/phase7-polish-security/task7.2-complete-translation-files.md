---
stage: completed
tags:
  - chore
  - p2
agent: auditor
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - skill-next-intl
---

# Complete Translation Files

## Goal
All UI strings for landing page and auth flows translated to Spanish and English. No missing translation warnings in console. Consistent terminology across pages.

## Definition of Done
- [x] Landing page translations (Home.heroTitle, heroSubtitle, cta.signup, cta.login)
- [x] Auth page translations (login, signup, password reset, etc.)
- [x] No missing translation warnings in console
- [x] Consistent terminology across pages

## Files
- `messages/es.json` - modify - complete translations for landing + auth
- `messages/en.json` - modify - complete translations for landing + auth

## Tests
- [ ] Manual: No missing translation warnings when visiting landing page
- [ ] Manual: Spanish locale (/es) displays correctly
- [ ] Manual: English locale (/en) displays correctly
- [ ] Manual: All auth pages render in both locales

## Context
Phase 7: Polish & Security
Scope limited to landing page and auth flows (marketplace features deferred).
Legacy reference: `/legacy/messages/`

## Audit
app/[locale]/page.tsx
app/[locale]/__tests__/page.test.tsx
messages/en.json
messages/es.json
