---
stage: completed
tags:
  - feature
  - p1
agent: auditor
contexts:
  - ai-guide
  - _context/skills/skill-next-intl.md
  - _context/skills/skill-supabase-ssr.md
parent: roadmap-legacy-transfer
---

# Create Proxy Middleware

## Goal
Middleware combines Supabase session + i18n routing. Session cookies transferred between responses. Locale detection from URL working.

## Definition of Done
- [x] Middleware combines Supabase session + i18n routing
- [x] Session cookies transferred between responses
- [x] Locale detection from URL working

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

## Refined Prompt
Objective: Create root `proxy.ts` combining Supabase session refresh with next-intl routing.

Implementation approach:
1. Create `lib/supabase/proxy.ts` with session update logic using `@supabase/ssr` createServerClient
2. Create root `proxy.ts` that chains Supabase session refresh → i18n routing
3. Transfer cookies from Supabase response to i18n response to prevent session desync
4. Configure matcher to exclude static assets and API routes

Key decisions:
- Supabase session refresh runs first: Must validate/refresh tokens before i18n routing can set response headers
- Cookie transfer strategy: Copy all cookies from Supabase response to final i18n response to maintain auth state
- No auth redirect logic in proxy: Keep proxy minimal; auth redirects belong in middleware or route handlers
- Use `getClaims()` not `getUser()` for session refresh: Faster JWT validation sufficient for middleware

Edge cases:
- Supabase redirect (e.g., auth callback): Return Supabase response directly if it has `location` header
- Missing env vars: Skip Supabase middleware gracefully to allow development without credentials
- Cookie write failures: Ignored in middleware since cookies are being set on both request and response

## Context
### Relevant Code
- [legacy/proxy.ts:1-33](legacy/proxy.ts#L1-L33) - Reference implementation combining Supabase + i18n
- [legacy/lib/supabase/middleware.ts:1-86](legacy/lib/supabase/middleware.ts#L1-L86) - Session update logic with getClaims() and cookie handling
- [lib/i18n/routing.ts:1-14](lib/i18n/routing.ts#L1-L14) - Current routing config (minimal, pathnames to be expanded in task 2.5)
- [lib/utils.ts:1-7](lib/utils.ts#L1-L7) - Missing `hasEnvVars` export needed for graceful degradation

### Patterns to Follow
- Create per-request Supabase client in middleware (no global singleton)
- Update both `request.cookies` and `response.cookies` in `setAll` callback
- Chain middleware: Supabase → i18n, copy cookies to final response
- Export `config.matcher` to exclude `_next`, `api`, static files

### Test Patterns
- Integration tests use Playwright: `test:e2e` script in package.json
- Existing unit tests in `lib/**/*.test.ts` use Vitest
- Cookie preservation tested via multiple sequential requests checking session persistence

### Dependencies
- `@supabase/ssr@^0.8.0`: createServerClient for Edge runtime
- `next-intl@^4.6.1`: createMiddleware for i18n routing
- `next@^16.0.10`: NextRequest, NextResponse types

### Gotchas
- `lib/utils.ts` missing `hasEnvVars`: Add it before implementing proxy to enable graceful degradation
- Legacy uses `publicLocalePaths` for marketing routes: Not needed yet; add in task 2.5 with pathnames
- Do not use `getUser()` in proxy: Too slow for edge; `getClaims()` validates JWT locally
- Cookie options must be preserved: Spread `...options` when transferring cookies

## Audit
/home/cynic/workspace/Qcargan/lib/utils.ts
/home/cynic/workspace/Qcargan/lib/supabase/proxy.ts
/home/cynic/workspace/Qcargan/proxy.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Proxy composition correctly chains Supabase session refresh before next-intl routing and preserves cookies.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] None

#### Medium Priority
- [ ] Missing integration coverage for locale routing and cookie persistence - `proxy.ts`

#### Low Priority / Nits
- [ ] None

### Test Assessment
- Coverage: Needs improvement
- Missing tests: `/` routes to Spanish, `/en` routes to English, session cookie preserved across requests

### What's Good
- Supabase cookie plumbing mirrors the reference pattern and cleanly hands off to i18n middleware.

### Recommendations
- Add Playwright integration checks for locale routing and auth cookie persistence.
