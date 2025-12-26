---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Supabase Clients

## Goal
Create browser, server, and middleware Supabase clients using @supabase/ssr.

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
Always create fresh client instance in functions. Use @supabase/ssr exclusively.
