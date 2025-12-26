---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create App Locale Layout

## Goal
Create the locale-specific layout with NextIntlClientProvider.

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
Must call setRequestLocale before rendering to enable static generation.
