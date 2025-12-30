---
stage: completed
tags:
  - feature
  - p1
agent: auditor
contexts:
  - ai-guide
  - _context/skills/skill-supabase-ssr.md
parent: roadmap-legacy-transfer
---

# Create Supabase Clients

## Goal
Browser client using createBrowserClient. Server client using createServerClient with cookies. Middleware client for session refresh.

## Definition of Done
- [x] Browser client using createBrowserClient
- [x] Server client using createServerClient with cookies
- [x] Middleware client for session refresh

## Files
- `lib/supabase/client.ts` - create - browser client
- `lib/supabase/server.ts` - create - server client
- `lib/supabase/middleware.ts` - create - updateSession function

## Tests
- [x] Unit: Browser client instantiates without error
- [x] Unit: Server client accesses cookies correctly
- [x] Integration: Session refresh works in middleware

## Audit
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/supabase/middleware.ts
- proxy.ts
- lib/supabase/storage.ts
- lib/supabase/__tests__/client.test.ts
- lib/supabase/__tests__/server.test.ts
- lib/supabase/__tests__/middleware.test.ts
- lib/supabase/proxy.ts

## Context
Phase 4: Authentication
Always create fresh client instance in functions (no global).
Legacy reference: `/legacy/lib/supabase/`

## Refined Prompt
Objective: Replace singleton Supabase client with SSR-compatible clients using @supabase/ssr

Implementation approach:
1. Create `lib/supabase/client.ts` with `createBrowserClient` function
2. Create `lib/supabase/server.ts` with `createServerClient` function using cookies
3. Create `lib/supabase/middleware.ts` with `updateSession` function for middleware
4. Add unit tests for each client in `lib/supabase/__tests__/`

Key decisions:
- Use `@supabase/ssr` only: The legacy uses `@supabase/ssr` correctly; current code uses deprecated singleton pattern from `@supabase/supabase-js`
- Per-request clients: Always create fresh instances, never export global singletons
- Cookie fallback: Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ?? NEXT_PUBLIC_SUPABASE_ANON_KEY` for compatibility with legacy env vars
- Middleware compatibility: The new `lib/supabase/middleware.ts` should work with existing `proxy.ts` at root

Edge cases:
- Missing env vars: Should throw clear error message when Supabase URL or key is not set
- Server Component cookie writes: Wrap `cookies.setAll` in try/catch to handle runtime errors (Server Components cannot set cookies)
- Middleware session refresh: Must update both request.cookies and response.cookies to avoid session desync

## Context
### Relevant Code
- [`legacy/lib/supabase/client.ts`](legacy/lib/supabase/client.ts:1) - Reference for browser client with env var fallback
- [`legacy/lib/supabase/server.ts`](legacy/lib/supabase/server.ts:1) - Reference for server client with cookie handling and try/catch
- [`legacy/lib/supabase/middleware.ts`](legacy/lib/supabase/middleware.ts:1) - Reference for updateSession with auth redirect logic
- [`lib/supabaseClient.ts`](lib/supabaseClient.ts:1) - Current singleton implementation to replace
- [`lib/supabase/proxy.ts`](lib/supabase/proxy.ts:1) - Existing proxy.ts with updateSession (ensure compatibility)
- [`proxy.ts`](proxy.ts:1) - Root middleware that calls updateSession

### Patterns to Follow
- Export named `createClient` function from each file (not a singleton)
- Use `cookies()` from `next/headers` in server client
- Use `NextResponse.next({ request })` pattern in middleware
- Wrap `cookies.setAll` in try/catch for Server Component safety

### Test Patterns
- Tests go in `lib/supabase/__tests__/` subdirectory
- Use `@vitest-environment node` for server-side tests
- Mock `@supabase/ssr` and `next/headers` in tests
- Reference: [`lib/db/__tests__/client.test.ts`](lib/db/__tests__/client.test.ts:1) for mock patterns

### Dependencies
- `@supabase/ssr` (v0.8.0) - Use for all client creation
- `next/headers` - For cookies() in server client
- `next/server` - For NextRequest, NextResponse in middleware

### Gotchas
- Singleton anti-pattern: Current `lib/supabaseClient.ts` exports a global `supabase` const - this breaks SSR and must not be replicated
- Env var naming: Legacy uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` as primary fallback
- Middleware integration: Existing `proxy.ts` imports from `@/lib/supabase/proxy` - ensure new `middleware.ts` exports compatible `updateSession` function
- Cookie sync: Middleware must update both request.cookies and response.cookies to prevent session drift

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
SSR-compatible Supabase clients and middleware session refresh are in place with tests, and storage/proxy wiring now uses the new helpers.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] None

#### Medium Priority
- [ ] None

#### Low Priority / Nits
- [ ] Session refresh helper uses `getClaims`: it will not refresh sessions if this helper is reused. - `lib/supabase/proxy.ts:38`

### Test Assessment
- Coverage: Adequate
- Missing tests: `hasEnvVars` false early-return path in middleware

### What's Good
- Per-request clients follow `@supabase/ssr` patterns and cookie plumbing; middleware updates both request/response cookies.

### Recommendations
- Align `lib/supabase/proxy.ts` with `lib/supabase/middleware.ts` (or remove) to avoid drift.
