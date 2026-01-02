---
stage: completed
agent: auditor
parent: roadmap-legacy-transfer
tags:
  - feature
  - p2
contexts:
  - ai-guide
skills:
  - nextjs-core-skills
  - react-core-skills
  - skill-server-actions-mutations
  - skill-supabase-ssr
  - skill-design-system
  - skill-next-intl
  - skill-routing-layouts
---

# Build Password Reset Flow

## Goal
Forgot password page sends reset email. Update password page handles reset token. Both pages have proper validation and feedback.

## Definition of Done
- [x] Forgot password page sends reset email
- [x] Update password page handles reset token
- [x] Both pages have proper validation and feedback

## Files
- `app/[locale]/auth/recuperar/page.tsx` - create - forgot password
- `app/[locale]/auth/actualizar-clave/page.tsx` - create - update password
- `app/[locale]/auth/error/page.tsx` - create - auth error page

## Tests
- [x] Integration: Reset email sends correctly
- [x] Integration: Password update with valid token succeeds
- [x] Integration: Expired token shows error

## Context
Phase 4: Authentication
Spanish routes: `/auth/recuperar`, `/auth/actualizar-clave`.
Legacy reference: `/legacy/app/[locale]/auth/forgot-password/` etc.

## Refined Prompt
Objective: Implement the full password reset flow using Supabase Auth (server actions) and Next.js App Router.

Implementation approach:
1.  **Server Actions (`app/[locale]/auth/actions.ts`):**
    -   Add `forgotPasswordAction` using `supabase.auth.resetPasswordForEmail`.
    -   Add `updatePasswordAction` using `supabase.auth.updateUser`.
    -   Use `ForgotPasswordSchema` and `UpdatePasswordSchema` from `@/lib/validation/auth` for validation.
    -   Return standardized error objects (same pattern as `loginAction`).

2.  **Forgot Password Page (`app/[locale]/auth/recuperar/page.tsx`):**
    -   Create client component form.
    -   Use `useActionState` to hook into `forgotPasswordAction`.
    -   Use standard UI components (`Input`, `Button`, `Label`) with existing styling (see `LoginForm`).
    -   On success, show a clear message (e.g., "Check your email").

3.  **Update Password Page (`app/[locale]/auth/actualizar-clave/page.tsx`):**
    -   This route handles the redirect from the email link.
    -   Supabase Auth exchanges the hash for a session automatically if `pkce` flow is set up correctly, or we might need to handle the `code` exchange in a middleware or callback.
    -   *Crucial:* Ensure `app/auth/callback/route.ts` or similar handles the code exchange and redirects to this page if needed. If standard Supabase reset flow sends a link with `token` (implicit) or `code` (PKCE), we need to ensure the user has a session *before* they can update the password.
    -   Typically: Link -> `/auth/callback?code=...&next=/auth/actualizar-clave` -> Exchanges code -> Session established -> Redirects to `/auth/actualizar-clave`.
    -   Create client component form (New Password + Confirm).
    -   Action: `updatePasswordAction`.

4.  **Error Page (`app/[locale]/auth/error/page.tsx`):**
    -   Simple error display for auth failures (e.g. invalid links).

5.  **Translations:**
    -   Add keys to `messages/en.json` and `messages/es.json` under `auth.forgotPassword` and `auth.updatePassword`.

Key decisions:
-   **Reuse Patterns:** Strictly follow the `LoginForm` pattern (zod resolver, react-hook-form, server action state).
-   **Routing:** Use Spanish URLs as specified (`recuperar`, `actualizar-clave`).

Edge cases:
-   **Invalid Email:** Supabase might not return an error for security (enumeration protection). We should show "If an account exists..." message.
-   **Expired Token:** The update password page might need to handle cases where the session is invalid (redirect to login).

## Context
### Relevant Code
-   `app/[locale]/auth/actions.ts`: Existing auth actions. Add new ones here.
-   `components/auth/login-form.tsx`: UI reference.
-   `lib/validation/auth.ts`: Zod schemas (already exists).

### Patterns to Follow
-   **Forms:** `useActionState`, `react-hook-form`, `zod`.
-   **UI:** Tailwind classes from `LoginForm` (e.g., specific input styling, rounded buttons).
-   **i18n:** `useTranslations("auth...")`.

### Dependencies
-   `@supabase/ssr`: For server-side auth.
-   `next-intl`: For translations.
-   `zod`: Validation.

## Skills System
### Available skills
-   `skills/nextjs-core-skills.md`
-   `skills/react-core-skills.md`
-   `skills/skill-routing-layouts.md`
-   `skills/skill-server-actions-mutations.md`
-   `skills/skill-supabase-ssr.md`
-   `skills/skill-next-intl.md`
-   `skills/skill-design-system.md`
-   `skills/skill-vitest-playwright-testing.md`

## Workflow
1.  Read the task.
2.  Check `_context/skills/` and identify relevant skills.
3.  Update task frontmatter to add skills to `contexts:` array.
4.  Locate related code, patterns, and tests.
5.  Update the prompt and edge cases.
6.  Append sections and update stage to `code` and agent to `coder`

## CRITICAL: Stage Transition

**You MUST update the task file frontmatter when done:**
```yaml
---
stage: code
agent: coder
---
```

## Audit
app/[locale]/auth/actions.ts
app/[locale]/auth/__tests__/actions.test.ts
app/[locale]/auth/recuperar/page.tsx
app/[locale]/auth/actualizar-clave/page.tsx
app/[locale]/auth/error/page.tsx
app/auth/callback/route.ts
components/auth/forgot-password-form.tsx
components/auth/update-password-form.tsx
components/auth/login-form.tsx
messages/en.json
messages/es.json

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
Solid implementation of password reset flow with proper server actions, validation, and i18n support. However, there are TypeScript errors that need fixing before this can be accepted.

### Findings

#### Blockers
- [ ] TypeScript error: Using `/auth/recuperar` instead of canonical pathname `/auth/forgot-password` in Link href - `components/auth/login-form.tsx:118`
- [ ] TypeScript error: Using `/auth/recuperar` instead of canonical pathname `/auth/forgot-password` in Link href - `components/auth/update-password-form.tsx:99`
- [ ] TypeScript error: Type casting `next as PathnameKey` is unsafe when `next` could include dynamic routes like `/vehicles/[slug]` - `app/auth/callback/route.ts:66`

#### High Priority
(None)

#### Medium Priority
(None)

#### Low Priority / Nits
- [ ] Consider adding `aria-live="polite"` to the success message containers for better screen reader announcements - `components/auth/forgot-password-form.tsx:77`

### Test Assessment
- Coverage: Adequate - all 18 tests pass covering validation, Supabase calls, and error handling
- Missing tests: None critical, but integration tests with actual page rendering would be beneficial

### What's Good
- Clean separation between server actions and client components
- Proper use of `useActionState` for form handling
- Good validation with Zod schemas and proper error state management
- Secure redirect URL handling using `getSiteUrl()` instead of request headers
- Proper i18n support with all keys in both en.json and es.json
- Session validation before password update
- Good UX with success states and loading indicators
- Consistent styling with existing auth forms

### Recommendations
- For the Link href issues, use the canonical pathname keys from routing.ts (e.g., `/auth/forgot-password` instead of `/auth/recuperar`) - the i18n system will handle localization
- For the callback route, consider using a type guard or filtering out dynamic routes when checking `next in routing.pathnames`

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
Password reset flow is functionally complete and aligned with Next-intl/Supabase patterns, but the callback redirect logic allows a scheme-relative open redirect that should be closed.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] Open redirect: `next` accepts scheme-relative URLs like `//evil.com`, which `new URL(next, origin)` will resolve off-site. Restrict `next` to same-origin paths (e.g., reject `//` or enforce `candidate.origin === origin`) - `app/auth/callback/route.ts:66`

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Needs improvement (tests not run; callback redirect sanitization not covered)
- Missing tests: Callback route should reject scheme-relative `next` values and still allow known internal paths.

### What's Good
- Canonical pathnames are used for localized links and redirects.
- Server actions validate with Zod and follow React 19 `useActionState` patterns.
- UI matches existing auth card styling and i18n keys are complete.

### Recommendations
- Add a small guard around `next` to prevent off-origin redirects and include a unit test for the sanitizer.

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Callback redirect handling now blocks scheme-relative open redirects, with a focused unit test covering the sanitizer. Overall reset flow remains consistent with existing auth patterns.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Adequate
- Missing tests: None critical; callback sanitizer is covered.

### What's Good
- Clear guard prevents off-origin redirects without breaking internal paths.
- Test is lightweight and focused on the regression.

### Recommendations
- Consider expanding callback tests to cover localized pathnames if regressions appear.
