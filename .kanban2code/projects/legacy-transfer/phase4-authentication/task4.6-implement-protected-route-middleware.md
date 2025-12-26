---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Implement Protected Route Middleware

## Goal
Add route protection logic to middleware for authenticated-only pages.

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
Use matcher in middleware to specify which routes require authentication.
