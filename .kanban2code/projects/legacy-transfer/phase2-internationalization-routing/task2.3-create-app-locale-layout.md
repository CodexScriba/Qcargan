---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md, _context/skills/skill-routing-layouts.md]
parent: roadmap-legacy-transfer
---

# Create App Locale Layout

## Goal
`app/[locale]/layout.tsx` created. NextIntlClientProvider wraps children. setRequestLocale called for static generation. generateStaticParams exports all locales.

## Definition of Done
- [ ] `app/[locale]/layout.tsx` created
- [ ] NextIntlClientProvider wraps children
- [ ] setRequestLocale called for static generation
- [ ] generateStaticParams exports all locales

## Files
- `app/[locale]/layout.tsx` - create - locale layout with provider
- `app/[locale]/page.tsx` - create - placeholder home page

## Tests
- [ ] Unit: Layout renders with valid locale
- [ ] Unit: Invalid locale triggers notFound()
- [ ] Integration: Messages available in client components

## Context
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/app/[locale]/layout.tsx`
