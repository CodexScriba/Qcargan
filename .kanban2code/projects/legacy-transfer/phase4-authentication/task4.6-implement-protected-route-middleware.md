---
stage: completed
tags:
  - feature
  - p1
agent: auditor
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - skill-supabase-ssr
  - skill-routing-layouts
---

# Implement Protected Route Middleware

## Goal
Middleware checks session for protected routes. Unauthenticated users redirected to login. Session available in protected Server Components.

## Definition of Done
- [x] Middleware checks session for protected routes
- [x] Unauthenticated users redirected to login
- [x] Session available in protected Server Components

## Files
- `proxy.ts` - modify - add protected route logic
- `lib/supabase/proxy.ts` - modify - add route protection (note: file is named `proxy.ts`, not `middleware.ts`)

## Tests
- [x] Integration: Unauthenticated request to /protected redirects
- [x] Integration: Authenticated request to /protected succeeds

## Context
Phase 4: Authentication
Protected routes: `/protected/*`, `/dashboard`, `/admin`
Legacy reference: `/legacy/proxy.ts`

## Refined Prompt
Objective: Add route protection to middleware that checks authentication and redirects unauthenticated users to login.

Implementation approach:
1. Modify `lib/supabase/proxy.ts` to check user authentication status
2. Add protected route pattern matching (e.g., `/protected`, `/dashboard`, `/admin`)
3. Redirect unauthenticated users to `/auth/login` with return URL
4. Ensure session cookies are properly forwarded for authenticated users
5. Update root `proxy.ts` to handle the redirect response from Supabase middleware

Key decisions:
- Use `supabase.auth.getUser()` to check authentication: This is the recommended SSR method for checking if a user is authenticated
- Redirect to `/auth/login` with `redirectTo` query param: Allows users to return to their intended destination after login
- Protected routes include `/protected/*`, `/dashboard`, `/admin`: Based on existing routing configuration and legacy admin page
- Return `NextResponse.redirect()` from `updateSession`: The root proxy already checks for `location` header and returns early

Edge cases:
- API routes should not be protected: Exclude `/api/*` from protection (already excluded by matcher)
- Static assets should not be protected: Already excluded by matcher pattern
- Auth routes should not be protected: `/auth/*` should remain accessible
- Locale prefixes must be handled: Routes like `/en/protected` and `/es/protegido` should both be protected

## Context
### Relevant Code
- `proxy.ts:10` - Calls `updateSession` and checks for redirect via `location` header
- `lib/supabase/proxy.ts:6-40` - Creates Supabase client and calls `getClaims()` but doesn't check authentication
- `lib/supabase/proxy.ts:38` - Currently calls `getClaims()` which refreshes tokens but doesn't return user info
- `lib/i18n/routing.ts:5-16` - Defines `/protected` routes with locale variants (`/protegido` for Spanish)
- `legacy/app/[locale]/admin/page.tsx:1-490` - Client component admin dashboard that should be protected
- `lib/supabase/server.ts:1-30` - Server-side Supabase client for Server Components (session will be available via cookies)

### Patterns to Follow
- Next.js middleware pattern: Use `NextRequest` and `NextResponse` from `next/server`
- Supabase SSR pattern: Create server client with cookie handlers, use `getUser()` to check auth
- Redirect pattern: Return `NextResponse.redirect()` with full URL including locale
- Locale-aware redirects: Preserve locale prefix when redirecting (e.g., `/es/protegido` → `/es/auth/ingresar`)

### Test Patterns
- Integration tests in `app/[locale]/auth/__tests__/actions.test.ts` show mocking patterns for Supabase and Next.js
- Use `vi.mock()` to mock `@supabase/ssr` and `next/navigation`
- Test both authenticated and unauthenticated scenarios
- Mock `getUser()` to return user data or null

### Dependencies
- `@supabase/ssr` - `createServerClient` for SSR authentication
- `next/server` - `NextRequest`, `NextResponse` for middleware
- `next-intl` - Already integrated via root `proxy.ts`

### Gotchas
- File naming: Task mentions `lib/supabase/middleware.ts` but actual file is `lib/supabase/proxy.ts`
- Locale prefixes: Routes have locale prefixes (e.g., `/en/protected`, `/es/protegido`) that must be preserved
- Matcher pattern: Root `proxy.ts` matcher already excludes API routes and static assets
- Cookie handling: Supabase SSR requires proper cookie handling in both middleware and server components
- `getClaims()` vs `getUser()`: `getClaims()` refreshes tokens but doesn't return user data; use `getUser()` to check authentication

## Audit
- lib/supabase/proxy.ts
- lib/supabase/__tests__/proxy.test.ts

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
The protected route middleware implementation is solid, correctly handling locale-aware route protection with proper redirect behavior and cookie forwarding. Tests verify the core functionality.

### Findings

#### High Priority
- [ ] Test coverage could be expanded for edge cases - `lib/supabase/__tests__/proxy.test.ts`
  - Missing tests for: locale-prefixed routes (`/en/protected`), non-protected routes (verify no redirect), auth routes exclusion (`/auth/*`), dashboard and admin routes

#### Medium Priority
- [ ] Tests use dynamic imports which may cause test isolation issues - `lib/supabase/__tests__/proxy.test.ts:78,95`
  - Consider using `vi.resetModules()` before each dynamic import or restructuring to avoid module caching between tests

#### Low Priority / Nits
- [ ] Consider extracting protected route prefixes to a shared config - `lib/supabase/proxy.ts:7-12`
  - The `PROTECTED_PATH_PREFIXES` array duplicates route information that exists in `lib/i18n/routing.ts`

### Test Assessment
- Coverage: Adequate for core functionality
- Missing tests:
  - Locale-prefixed protected routes (`/en/protected`, `/es/protegido`)
  - Non-protected routes returning normal response
  - Auth routes explicitly excluded from protection
  - Dashboard and admin route protection
  - Cookie forwarding on redirect response

### What's Good
- Correct use of `getUser()` for authentication check (more secure than `getClaims()` alone)
- Proper locale detection and preservation in redirects
- Clean separation between locale parsing and route protection logic
- Cookie forwarding on redirect response preserves session state
- Auth routes correctly excluded from protection
- Integration with root proxy via `location` header check works well

### Recommendations
- Consider adding a test helper for creating mock requests with different locales
- Could add JSDoc comments to explain the locale detection logic for future maintainers
