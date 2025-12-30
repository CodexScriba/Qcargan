---
stage: code
tags: [feature, p1]
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
---

# Build Sign Up Page

## Goal
Sign up form with email, password, confirm password. Server action sends confirmation email. Redirect to success page after submission.

## Definition of Done
- [ ] Sign up form with email, password, confirm password
- [ ] Server action sends confirmation email
- [ ] Redirect to success page after submission

## Files
- `app/[locale]/auth/registrar/page.tsx` - create - sign up page
- `app/[locale]/auth/sign-up-success/page.tsx` - create - success page

## Tests
- [ ] Unit: Form validates password match
- [ ] Integration: Sign up triggers confirmation email
- [ ] E2E: Complete sign up flow works

## Context
Phase 4: Authentication
Spanish route: `/auth/registrar`.
Legacy reference: `/legacy/app/[locale]/auth/register/` (note: renaming to Spanish)

## Refined Prompt
Objective: Implement a locale-aware sign-up page and success page, using a server action with Zod validation to create a Supabase Auth user and trigger the confirmation email flow, then redirecting to the success page on submission.

Implementation approach:
1. Implement the sign-up page at the canonical internal route `app/[locale]/auth/sign-up/page.tsx` (Spanish URL `/auth/registrar` is handled by next-intl pathnames + middleware).
2. Implement `app/[locale]/auth/sign-up-success/page.tsx` using `getTranslations("auth.signUpSuccess")` and locale-aware navigation links.
3. Create/extend `app/[locale]/auth/actions.ts` with a `signUpAction` server action that validates `FormData` with `SignUpSchema` and calls `supabase.auth.signUp`.
4. Build a client form component that uses `react-hook-form` + `zodResolver(SignUpSchema)` for client-side validation and `useActionState` to submit to `signUpAction`, rendering field errors + a non-sensitive form error on failure.
5. Add Vitest tests for Zod mismatch validation and server action behavior (Supabase mocked); add Playwright E2E only if Playwright config exists in this repo.

Key decisions:
- Route naming: use `auth/sign-up` as the internal filesystem route because `lib/i18n/routing.ts` defines `/auth/sign-up` and middleware rewrites `/auth/registrar` → `/auth/sign-up`.
- Email confirmation flow: rely on Supabase `signUp()` to send confirmation email; redirect users to the success page after submission (no immediate session required).
- `emailRedirectTo`: compute from request origin (via `next/headers`) so the confirmation link returns to this app; avoid hardcoding localhost.

Edge cases:
- Password mismatch: show field-level error for `confirmPassword` (use `SignUpSchema` refine message) and prevent submission.
- Existing email / rate limits: show a generic error message (avoid account enumeration).
- Missing origin in server action (tests/edge runtimes): fall back to a safe configured base URL if present.

## Context
### Relevant Code
- `lib/i18n/routing.ts:21` - `/auth/sign-up` maps to Spanish `/auth/registrar`
- `proxy.ts:1` - next-intl middleware composes routing rewrites with Supabase session refresh
- `lib/i18n/navigation.ts:5` - locale-aware `Link` and `redirect`
- `lib/validation/auth.ts:19` - `SignUpSchema` with `confirmPassword` match validation
- `lib/supabase/server.ts:4` - SSR Supabase client used by server actions to set cookies if needed
- `legacy/app/[locale]/auth/sign-up/page.tsx:6` - legacy sign-up page layout + translation usage
- `legacy/app/[locale]/auth/sign-up-success/page.tsx:4` - legacy success page content structure
- `legacy/components/auth/sign-up-form.tsx:57` - legacy client sign-up flow using `supabase.auth.signUp` and `router.push("/auth/sign-up-success")`

### Patterns to Follow
- Server page reads locale via `params` and calls `setRequestLocale(locale)` (match `app/[locale]/page.tsx` / `app/[locale]/layout.tsx`).
- Keep `useActionState` and `react-hook-form` inside a client component; keep the route pages server-side.
- Use `@/i18n/navigation` for links/redirects so localized pathnames stay consistent.

### Test Patterns
- Zod schema tests already exist for auth: `lib/validation/__tests__/auth.test.ts:1`
- Server component integration tests mock `next-intl/server`: `app/[locale]/__tests__/page.test.tsx:8`
- Supabase mocking patterns: `lib/supabase/__tests__/server.test.ts:9`

### Dependencies
- `react-hook-form` + `@hookform/resolvers` + `zod`: client/server validation alignment
- `@supabase/ssr`: server-side Supabase Auth calls
- `next-intl`: localized routing + translations

### Gotchas
- If you create `app/[locale]/auth/registrar/page.tsx`, next-intl will still rewrite `/auth/registrar` → `/auth/sign-up` and you will 404.
- This repo currently lacks `playwright.config.ts` and a `tests/` folder; E2E may need a separate setup task or be deferred.

### Assets
- `public/images/auth/login-hero.png` - reuse this hero image for the sign-up page right-side panel for now (until a dedicated sign-up hero is provided)
- `legacy/app/[locale]/auth/sign-up/page.tsx:23` - legacy uses a remote `Image src="https://..."`; replace with `src="/images/auth/login-hero.png"`
