---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-supabase-ssr.md, _context/skills/skill-routing-layouts.md]
parent: roadmap-legacy-transfer
---

# Implement Protected Route Middleware

## Goal
Middleware checks session for protected routes. Unauthenticated users redirected to login. Session available in protected Server Components.

## Definition of Done
- [ ] Middleware checks session for protected routes
- [ ] Unauthenticated users redirected to login
- [ ] Session available in protected Server Components

## Files
- `proxy.ts` - modify - add protected route logic
- `lib/supabase/middleware.ts` - modify - add route protection

## Tests
- [ ] Integration: Unauthenticated request to /protected redirects
- [ ] Integration: Authenticated request to /protected succeeds

## Context
Phase 4: Authentication
Protected area usually starts with `/admin` or `/perfil`.
Legacy reference: `/legacy/proxy.ts`
