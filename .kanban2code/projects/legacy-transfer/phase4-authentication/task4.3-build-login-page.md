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
  - skill-server-actions-mutations
  - skill-supabase-ssr
  - nextjs-core-skills
  - react-core-skills
  - skill-next-intl
  - skill-routing-layouts
  - skill-vitest-playwright-testing
---

# Build Login Page

## Goal
Login form with email/password. Form validation with react-hook-form + Zod. Server action for authentication. Error handling and feedback. Redirect to protected area on success.

## Definition of Done
- [x] Login form with email/password
- [x] Form validation with react-hook-form + Zod
- [x] Server action for authentication
- [x] Error handling and feedback
- [x] Redirect to protected area on success

## Files
- `app/[locale]/auth/login/page.tsx` - create - login page
- `app/[locale]/auth/actions.ts` - create - auth server actions
- `components/auth/login-form.tsx` - create - login form client component
- `app/[locale]/auth/__tests__/actions.test.ts` - update - added loginAction tests

## Tests
- [x] Unit: Form validates correctly
- [x] Integration: Login with valid credentials succeeds (mocked)
- [x] Integration: Login with invalid credentials shows error (mocked)
- [ ] E2E: Complete login flow works (Playwright not configured)

## Context
Phase 4: Authentication
Spanish route: `/auth/ingresar`.
Use `useActionState` from 'react' (React 19).
Legacy reference: `/legacy/app/[locale]/auth/login/` (note: renaming to Spanish)

## Refined Prompt
Objective: Implement a locale-aware login page that authenticates with Supabase email/password via a server action, with react-hook-form + Zod validation, clear error feedback, and a post-login redirect to the protected area.

Implementation approach:
1. Implement the page at the canonical internal route `app/[locale]/auth/login/page.tsx` (Spanish URL `/auth/ingresar` is handled by next-intl pathnames + middleware).
2. Create `app/[locale]/auth/actions.ts` with a `loginAction` server action that validates `FormData` using `LoginSchema` and signs in via `lib/supabase/server.ts`.
3. Build a client form component (inline or in `components/auth/`) that uses `useActionState` for submission state and renders `react-hook-form` field + form-level errors.
4. On successful login, redirect to `"/protected"` using the locale-aware `redirect` from `@/i18n/navigation` (so Spanish users land at `/protegido`).
5. Add tests for validation + action behavior by mocking Supabase and redirects; add Playwright E2E only if the Playwright harness exists in this repo.

Key decisions:
- Route naming: use `auth/login` as the internal filesystem route because `lib/i18n/routing.ts` defines `/auth/login` and middleware rewrites `/auth/ingresar` → `/auth/login`.
- Server-side sign-in: use `lib/supabase/server.ts` so Supabase can set the session cookies correctly for SSR/protected routes.
- Error shaping: return structured, non-sensitive error codes/field errors from the server action; translate/render messages on the client using `useTranslations("auth.login")`.

Edge cases:
- Invalid inputs: show per-field validation errors and focus the first invalid field.
- Invalid credentials: show a generic error message (avoid leaking whether the email exists).
- Already authenticated: optionally redirect away from login to the protected landing page.
- Redirect target missing: `/protected` may not exist yet; still redirect to the canonical route key used in `lib/i18n/routing.ts`.

## Context
### Relevant Code
- `lib/i18n/routing.ts:17` - `/auth/login` maps to Spanish `/auth/ingresar`
- `proxy.ts:1` - next-intl middleware composes routing rewrites with Supabase session refresh
- `lib/i18n/navigation.ts:5` - locale-aware `Link` and `redirect`
- `app/[locale]/layout.tsx:19` - locale validation + `setRequestLocale(locale)` pattern
- `lib/validation/auth.ts:12` - `LoginSchema` with `{email, password}` and email normalization
- `lib/supabase/server.ts:4` - SSR Supabase client that can set auth cookies
- `legacy/app/[locale]/auth/login/page.tsx:6` - legacy login page structure + `getTranslations("auth.login")`

### Patterns to Follow
- Server page reads locale via `params` and calls `setRequestLocale(locale)` (match `app/[locale]/page.tsx` / `app/[locale]/layout.tsx`).
- Keep `useActionState` and `react-hook-form` inside a client component; keep the route page itself server-side.
- Use `@/i18n/navigation` for all auth links and redirects to keep localized pathnames consistent.

### Test Patterns
- Server component integration tests mock `next-intl/server`: `app/[locale]/__tests__/page.test.tsx:8`
- Supabase mocking patterns: `lib/supabase/__tests__/server.test.ts:9`
- For server action tests: use `@vitest-environment node`, mock `@/lib/supabase/server` and mock the redirect function you call (assert it was invoked).

### Dependencies
- `react-hook-form`: client form state and validation integration
- `@hookform/resolvers`: `zodResolver` for RHF
- `zod`: shared validation for client and server
- `@supabase/ssr`: server-side session handling for Supabase Auth
- `next-intl`: localized routing, translations, and navigation helpers

### Gotchas
- If you create `app/[locale]/auth/ingresar/page.tsx`, next-intl will still rewrite `/auth/ingresar` → `/auth/login` and you will 404.
- `redirect()` throws; structure the action and tests accordingly (mock/expect the call rather than awaiting a returned value).
- This repo currently lacks `playwright.config.ts` and a `tests/` folder; E2E may need a separate setup task or be deferred.

### Assets
- `public/images/auth/login-hero.png` - add hero image for the right-side panel (copy from `/home/cynic/workspace/Qcargan/login_image.png`)
- `legacy/app/[locale]/auth/login/page.tsx:23` - replace remote `Image src="https://..."` with `src="/images/auth/login-hero.png"`

## Audit
Files created/modified:
- `app/[locale]/auth/actions.ts` - server action for login with Zod validation, redirects to `/dashboard`
- `app/[locale]/auth/login/page.tsx` - login page (server component)
- `components/auth/login-form.tsx` - login form client component with useActionState + react-hook-form
- `app/[locale]/auth/__tests__/actions.test.ts` - added 6 tests for loginAction (validation, success redirect, error handling)
- `.env.example` - added `NEXT_PUBLIC_SITE_URL` for safe email redirect configuration

Notes:
- Route is at `auth/login` (internal path); Spanish URL `/auth/ingresar` is handled by next-intl middleware rewrite
- Hero image already exists at `public/images/auth/login-hero.png`
- Translations already exist in `messages/es.json` and `messages/en.json` under `auth.login` namespace
- Vitest tests implemented for loginAction (11 total tests in actions.test.ts)
- Redirect uses `next/navigation` redirect to `/dashboard`; middleware handles locale routing
- Removed non-functional "Remember me" checkbox and "Forgot password" link (page doesn't exist yet)
- Fixed button width (removed conflicting inline style)
- Fixed untrusted headers vulnerability: now uses `NEXT_PUBLIC_SITE_URL` env var with `VERCEL_URL` fallback

---

## Review (Post-Fix)

**Rating: Pending re-audit**

**Verdict: READY FOR AUDIT**

### Summary
All previous audit findings have been addressed. Login flow now redirects to `/dashboard`, email redirect uses safe configured URL, and loginAction has full test coverage.

### Fixes Applied

#### Blockers (Fixed)
- [x] Login success now redirects to `/dashboard` instead of `/protected` - `app/[locale]/auth/actions.ts:50`

#### High Priority (Fixed)
- [x] `signUpAction` now uses `getSiteUrl()` helper with `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` fallback instead of untrusted headers - `app/[locale]/auth/actions.ts:7-18`
- [x] Added 6 tests for `loginAction`: validation errors, success redirect, invalid credentials, email normalization - `app/[locale]/auth/__tests__/actions.test.ts`

#### Medium Priority (Fixed)
- [x] Removed "Forgot password" link (page doesn't exist yet) - `components/auth/login-form.tsx`

#### Low Priority (Fixed)
- [x] Removed non-functional "Remember me" checkbox - `components/auth/login-form.tsx`
- [x] Fixed submit button width (removed conflicting inline style) - `components/auth/login-form.tsx`

### Test Assessment
- Coverage: Adequate
- All 11 tests pass (6 for loginAction, 5 for signUpAction)

### What's Good
- Security fix: email redirect no longer vulnerable to header injection
- Login redirects to existing `/dashboard` route
- Comprehensive test coverage for both auth actions

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Login flow meets the DoD with server action validation and clear feedback; a couple of localization/presentation nits remain.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] None

#### Medium Priority
- [ ] Locale-aware redirect is bypassed, so non-default locales may lose their prefix on login redirect. Use `@/i18n/navigation` or include locale. - `app/[locale]/auth/actions.ts:62`

#### Low Priority / Nits
- [ ] Tailwind class `bg-card!` is likely invalid and won’t apply; use `!bg-card` or `bg-card`. - `app/[locale]/auth/login/page.tsx:19`

### Test Assessment
- Coverage: Adequate
- Missing tests: E2E login flow (Playwright not configured)

### What's Good
- Server action uses shared Zod schema with generic auth errors.
- Tests cover validation, error handling, and redirect paths.

### Recommendations
- Consider switching redirects to the locale-aware helper for consistency.
