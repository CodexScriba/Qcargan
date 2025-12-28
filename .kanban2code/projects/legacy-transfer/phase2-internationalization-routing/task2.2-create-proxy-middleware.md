---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Create Proxy Middleware

## Goal
Middleware combines Supabase session + i18n routing. Session cookies transferred between responses. Locale detection from URL working.

## Definition of Done
- [ ] Middleware combines Supabase session + i18n routing
- [ ] Session cookies transferred between responses
- [ ] Locale detection from URL working

## Files
- `proxy.ts` - create - combined middleware handler (Next.js 16 convention, replaces deprecated middleware.ts)

## Tests
- [ ] Integration: `/` routes to Spanish content
- [ ] Integration: `/en` routes to English content
- [ ] Integration: Session cookie preserved across requests

## Context
Phase 2: Internationalization & Routing
Next.js 16 uses `proxy.ts` instead of deprecated `middleware.ts`.
Supabase session refresh MUST run before i18n routing.
Legacy reference: `/legacy/proxy.ts`
