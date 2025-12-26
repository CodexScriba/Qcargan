---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Proxy Middleware

## Goal
Create combined middleware that handles Supabase session refresh and i18n routing.

## Definition of Done
- [ ] Middleware combines Supabase session + i18n routing
- [ ] Session cookies transferred between responses
- [ ] Locale detection from URL working

## Files
- `proxy.ts` - create - combined middleware handler
- `next.config.ts` - modify - enable middleware

## Tests
- [ ] Integration: `/` routes to Spanish content
- [ ] Integration: `/en` routes to English content
- [ ] Integration: Session cookie preserved across requests

## Context
Supabase session refresh MUST run before i18n routing. Use matcher to skip static files.
