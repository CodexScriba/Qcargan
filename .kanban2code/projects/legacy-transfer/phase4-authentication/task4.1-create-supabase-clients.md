---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Create Supabase Clients

## Goal
Browser client using createBrowserClient. Server client using createServerClient with cookies. Middleware client for session refresh.

## Definition of Done
- [ ] Browser client using createBrowserClient
- [ ] Server client using createServerClient with cookies
- [ ] Middleware client for session refresh

## Files
- `lib/supabase/client.ts` - create - browser client
- `lib/supabase/server.ts` - create - server client
- `lib/supabase/middleware.ts` - create - updateSession function

## Tests
- [ ] Unit: Browser client instantiates without error
- [ ] Unit: Server client accesses cookies correctly
- [ ] Integration: Session refresh works in middleware

## Context
Phase 4: Authentication
Always create fresh client instance in functions (no global).
Legacy reference: `/legacy/lib/supabase/`
