---
stage: completed
tags:
  - feature
  - p2
agent: auditor
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - skill-posthog-analytics
---

# Integrate PostHog

## Goal
PostHog client SDK configured. Server-side tracking available. Page views tracked automatically. Key events defined (signup, login, vehicle_view).

## Definition of Done
- [x] PostHog client SDK configured
- [x] Server-side tracking available
- [x] Page views tracked automatically
- [x] Key events defined (signup, login, vehicle_view)

## Files
- `lib/posthog/client.ts` - create - client provider
- `lib/posthog/server.ts` - create - server client
- `app/layout.tsx` - modify - add PostHog provider

## Tests
- [ ] Integration: Page views appear in PostHog
- [ ] Integration: Custom events tracked

## Audit
- .env.example
- app/[locale]/auth/actions.ts
- app/[locale]/shop/page.tsx
- app/[locale]/shop/vehicle-view-tracker.tsx
- app/layout.tsx
- lib/posthog/client.ts
- lib/posthog/server.ts

## Context
Phase 8: Analytics & Deployment
Strictly separate client tracking from server tracking.
Flush server events in short-lived runtimes.
Legacy reference: `/legacy/instrumentation-client.ts` (if relevant)

## Refined Prompt
Objective: Configure PostHog analytics with strict client/server separation and track key user events

Implementation approach:
1. Add missing server-side environment variables to `.env.example`
2. Create client PostHog provider with `'use client'` directive
3. Create server PostHog client with `'server-only'` directive and flush configuration
4. Wrap app with PostHog provider in root layout
5. Track signup event in `signUpAction` (server-side)
6. Track login event in `loginAction` (server-side)
7. Establish pattern for vehicle_view tracking (client-side in shop page)

Key decisions:
- Client provider in `lib/posthog/client.ts`: Use `posthog-js` + `@posthog/react` with SPA auto-tracking enabled
- Server client in `lib/posthog/server.ts`: Use `posthog-node` with `flushAt: 1`, `flushInterval: 0`, and `export const runtime = 'nodejs'`
- Provider placement: Add to `app/layout.tsx` after ThemeProvider to avoid forcing full client rendering
- Event naming: Use `[object] [verb]` pattern (e.g., `user signed up`, `user logged in`, `vehicle viewed`)
- Event properties: Include `source: 'client' | 'server'`, `app: 'web'`, `router: 'app'` on all custom events

Edge cases:
- PostHog keys not configured: Client should gracefully handle missing env vars (no-op)
- Server actions failing: PostHog tracking should not break auth flow (wrap in try/catch, await shutdown in finally)
- Edge runtime conflicts: Server client must explicitly set `export const runtime = 'nodejs'`

## Context
### Relevant Code
- `app/layout.tsx:36-44` - Root layout with ThemeProvider, PostHog provider should wrap children
- `app/[locale]/auth/actions.ts:33-69` - `loginAction` - server action where login event should be tracked
- `app/[locale]/auth/actions.ts:81-124` - `signUpAction` - server action where signup event should be tracked
- `app/[locale]/shop/page.tsx:1-85` - Shop page placeholder for vehicle_view tracking pattern
- `package.json:64-65` - PostHog dependencies already installed: `posthog-js: ^1.310.1`, `posthog-node: ^5.18.0`
- `.env.example:15-17` - Client PostHog vars exist, server vars missing

### Patterns to Follow
- Client components use `'use client'` directive at top of file
- Server modules use `'server-only'` directive at top of file
- Server actions use `'use server'` directive and can import server-only modules
- Environment variables accessed via `process.env.VAR_NAME`
- Server actions return state objects with `success`, `error`, `fieldErrors` properties

### Test Patterns
- Tests located in `__tests__/` directories alongside components
- Vitest for unit tests, Playwright for e2e tests
- Integration tests verify external service interactions (PostHog events)
- See `app/[locale]/auth/__tests__/actions.test.ts` for server action test patterns

### Dependencies
- `posthog-js`: Client-side tracking library
- `@posthog/react`: React provider for PostHog client
- `posthog-node`: Server-side tracking library
- `next-intl`: Already integrated, events should include locale context

### Gotchas
- Cross-imports: Never import `posthog-node` into client components (bundle issues)
- Runtime conflicts: Server PostHog requires Node runtime, not Edge
- Event duplication: Use SPA auto-tracking for pageviews, avoid manual `$pageview` capture
- Event flushing: Server events must be flushed with `await posthog.shutdown()` in finally blocks
- Environment variables: Server keys must not be prefixed with `NEXT_PUBLIC_` to avoid leaking to client

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
PostHog integration is correctly implemented with proper client/server separation, graceful error handling, and consistent event tracking patterns.

### Findings

#### Blockers
None.

#### High Priority
None.

#### Medium Priority
None.

#### Low Priority / Nits
- [x] `useMemo` for `isConfigured` in [client.ts:16-19](lib/posthog/client.ts#L16-L19) is unnecessary - env vars are replaced at build time, not reactive — **Fixed**: moved to module-level constant
- [ ] Server events in [actions.ts:70-78](app/[locale]/auth/actions.ts#L70-L78) don't include `locale` for consistency with client events — **Deferred**: requires passing locale through form hidden fields

### Test Assessment
- Coverage: Adequate for unit testing
- Missing tests: Integration tests (Page views appear in PostHog, Custom events tracked) are marked unchecked, but these require a live PostHog instance and are appropriate for manual verification

### What's Good
- Clean client/server separation using `client-only` and `server-only` directives
- Graceful degradation when env vars are missing (returns null/no-op)
- Proper error handling with try/catch wrapping analytics calls
- Correct `await posthog.shutdown()` in finally blocks for server events
- Consistent event naming following `[object] [verb]` pattern
- Consistent event properties (`source`, `app`, `router`) on all custom events
- Explicit `runtime = "nodejs"` export to prevent Edge runtime conflicts
- Module-level `posthogInitialized` flag prevents double initialization
- `.env.example` documents both client and server PostHog variables
- Existing unit tests continue to pass (PostHog gracefully handles missing env vars)

### Recommendations
- Consider adding `locale` to server-side auth events for analytics consistency
- The `useMemo` is harmless but could be simplified to a direct check
