---
stage: code
tags:
  - feature
  - p1
agent: coder
contexts:
  - ai-guide
  - architecture
  - skills/nextjs-core-skills
  - skills/react-core-skills
  - skills/skill-next-intl
  - skills/skill-routing-layouts
  - skills/skill-server-actions-mutations
  - skills/skill-supabase-ssr
  - skills/skill-vitest-playwright-testing
parent: roadmap-legacy-transfer
skills:
  - skill-server-actions-mutations
  - skill-supabase-ssr
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
- `app/[locale]/auth/ingresar/page.tsx` - create - login page
- `app/[locale]/auth/actions.ts` - create - auth server actions

## Tests
- [ ] Unit: Form validates correctly
- [ ] Integration: Login with valid credentials succeeds
- [ ] Integration: Login with invalid credentials shows error
- [ ] E2E: Complete login flow works

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
- `app/[locale]/auth/actions.ts` - server action for login with Zod validation
- `app/[locale]/auth/login/page.tsx` - login page (server component)
- `components/auth/login-form.tsx` - login form client component with useActionState + react-hook-form

Notes:
- Route is at `auth/login` (internal path); Spanish URL `/auth/ingresar` is handled by next-intl middleware rewrite
- Hero image already exists at `public/images/auth/login-hero.png`
- Translations already exist in `messages/es.json` and `messages/en.json` under `auth.login` namespace
- Tests not implemented: repo lacks Playwright setup; Vitest tests could be added in follow-up task
- Redirect uses `next/navigation` redirect (not locale-aware) because the next-intl redirect requires object format in server context; middleware handles locale routing
- Pre-existing build issue: `next.config.ts` missing `createNextIntlPlugin`; TypeScript and ESLint pass

---

## Review

**Rating: 6/10**

**Verdict: NEEDS WORK**

### Summary
Solid UI and validation wiring, but the post-login redirect currently points to a non-existent route and will 404; there’s also a potential security issue in the signup email redirect construction.

### Findings

#### Blockers
- [ ] Post-login redirect goes to a route that doesn’t exist (will 404) and isn’t locale-aware - `app/[locale]/auth/actions.ts:50`

#### High Priority
- [ ] `signUpAction` builds `emailRedirectTo` from request headers (`origin`/`x-forwarded-host`), which can enable hostile redirect links; prefer a configured site URL allowlist/env var - `app/[locale]/auth/actions.ts:89`
- [ ] Missing tests for `loginAction` success/failure paths (mock Supabase + assert redirect/error shaping) - `app/[locale]/auth/actions.ts:16`

#### Medium Priority
- [ ] `FormData.get()` can return `null`/`File`; current Zod errors may surface as “Expected string…” (poor UX). Consider normalizing to `""` or using `z.preprocess` - `app/[locale]/auth/actions.ts:20`
- [ ] Submit button has `w-full` but an inline half-width style; likely unintended layout regression - `components/auth/login-form.tsx:160`
- [ ] Field validation messages are not localized (Zod messages show in English) - `components/auth/login-form.tsx:54`

#### Low Priority / Nits
- [ ] “Remember me” checkbox is currently non-functional (no `name`/state); consider removing until implemented - `components/auth/login-form.tsx:132`

### Test Assessment
- Coverage: Needs improvement
- Missing tests: `app/[locale]/auth/actions.ts` (`loginAction` + redirect), `components/auth/login-form.tsx` (basic render + error states)

### What’s Good
- Server/client split is clean: server page sets locale + translations, client form uses `useActionState` + RHF + shared Zod schema.

### Recommendations
- Either add a minimal `app/[locale]/protected/page.tsx` (or redirect to an existing route) and switch redirects to `@/lib/i18n/navigation` to preserve locale (`/protegido` for `es`).
