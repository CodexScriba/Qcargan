---
name: Architecture
description: Codebase and project description
scope: global
created: '2025-12-17'
file_references:
  - docs/architecture.md
---

# Architecture Context

This context file links to the main architecture documentation. When the auditor accepts a task (rating 8+), they should update this file or the linked documentation to reflect any new files created.

See: [docs/architecture.md](docs/architecture.md) for the full architecture documentation including directory structure.

## Recent Updates
- task4.3-build-login-page: added login page (`app/[locale]/auth/login/page.tsx`), login form (`components/auth/login-form.tsx`), auth actions (`app/[locale]/auth/actions.ts`) | date: 2026-01-01
- task4.4-build-sign-up-page: added sign-up page (`app/[locale]/auth/sign-up/page.tsx`), success page (`app/[locale]/auth/sign-up-success/page.tsx`), sign-up form (`components/auth/sign-up-form.tsx`), sign-up action tests (`app/[locale]/auth/__tests__/actions.test.ts`) | date: 2026-01-01
- task4.6-implement-protected-route-middleware: added protected route logic to `lib/supabase/proxy.ts` with locale-aware authentication checks, tests in `lib/supabase/__tests__/proxy.test.ts` | date: 2026-01-02
- task4.5-build-password-reset-flow: added callback redirect safety test (`app/auth/callback/__tests__/route.test.ts`); hardened callback redirect handling in `app/auth/callback/route.ts` | date: 2026-01-01
- task5.1-create-root-layout-with-providers: configured root layout (`app/layout.tsx`) with ThemeProvider, Poppins font, and SEO metadata | date: 2026-01-02
