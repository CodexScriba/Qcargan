# Legacy → New Transition Roadmap (Codex)

Source of truth: `legacy/` (old project)  
Target: repo root (current “new” project scaffold)

This roadmap lists what to bring over from `legacy/` and the order to do it so cross‑cutting concerns (routing/i18n/auth/styles/data) land first, then pages/features, then ops/testing.

---

## Phase 0 — Baseline alignment (before moving code)

1) **Decide what the “new” project keeps vs adopts from legacy**
- [x] **Font**: switch to `Poppins` (`app/layout.tsx`) and CSS var `--font-poppins`.
- [ ] **Theme system**: keep legacy `next-themes` + `ThemeProvider` (`legacy/app/layout.tsx`, `legacy/components/layout/theme-switcher.tsx`) and ensure `app/globals.css` supports `.dark`.
- [ ] **i18n routing shape**: keep legacy `app/[locale]/...` + default-locale root page (`legacy/app/page.tsx`, `legacy/app/[locale]/layout.tsx`) and `next-intl` routing (`legacy/i18n/routing.ts`).
- [ ] **Supabase auth strategy**: adopt legacy SSR approach (`legacy/lib/supabase/*`) instead of the current client-only `lib/supabaseClient.ts`.

2) **Merge dependencies + scripts (package-level foundation)**
- [ ] Copy/merge missing dependencies from `legacy/package.json` into root `package.json` (don’t forget peer-ish UI deps):
  - i18n: `next-intl`
  - theming: `next-themes`
  - supabase SSR: `@supabase/ssr` (keep `@supabase/supabase-js`)
  - forms/validation: `react-hook-form`, `@hookform/resolvers`, `zod`
  - database: `drizzle-orm`, `postgres`, plus dev `drizzle-kit`, `dotenv`
  - UI stack used by `legacy/components/ui/*`: Radix packages, `cmdk`, `sonner`, `vaul`, `embla-carousel-react`, `react-day-picker`, `input-otp`, `react-resizable-panels`, `recharts`, etc.
- [ ] Copy/merge scripts from `legacy/package.json` (drizzle + seeds):
  - `drizzle:introspect`, `drizzle:generate`, `drizzle:push`
  - `seed:production-vehicles`, `update:organizations`
- [ ] Re-generate `bun.lock` after dependency merge (source locks differ: `bun.lock` vs `legacy/bun.lock`).

3) **Bring over critical Next.js config**
- [ ] Replace/merge root `next.config.ts` with legacy settings from `legacy/next.config.ts`:
  - `next-intl` plugin: `createNextIntlPlugin("./i18n/request.ts")`
  - `images.remotePatterns` (Supabase storage + `imgcdn.zigwheels.ph`)
  - PostHog `rewrites()` for `/ingest/*`
  - `skipTrailingSlashRedirect`, `turbopack.root`
- [ ] Confirm `components.json` settings you want (baseColor differs: `legacy/components.json` uses `slate`, root uses `neutral`).

4) **Define env var contract (no secrets committed)**
- [ ] Document + provision env vars referenced by legacy code:
  - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` (or fallback `NEXT_PUBLIC_SUPABASE_ANON_KEY`), `SUPABASE_SERVICE_ROLE_KEY`
  - DB: `DATABASE_URL` and/or `DIRECT_URL` (used by `legacy/lib/db/client.ts`, `legacy/drizzle.config.ts`)
  - PostHog: `NEXT_PUBLIC_POSTHOG_KEY` (used by `legacy/instrumentation-client.ts`)
  - Deployment: `VERCEL_URL` (used in legacy metadata base, `legacy/app/layout.tsx`)

---

## Phase 1 — Internationalization (routing + messages) first

5) **Port i18n core files**
- [ ] Move/copy `legacy/i18n.ts` → `i18n.ts`
- [ ] Move/copy `legacy/i18n/*` → `i18n/*` (especially `i18n/request.ts`, `i18n/routing.ts`)
- [ ] Move/copy `legacy/messages/*` → `messages/*`
- [ ] Ensure imports remain valid with root alias `@/*` (tsconfig already matches legacy).

6) **Port app router structure for locales**
- [ ] Bring `legacy/app/[locale]/layout.tsx` → `app/[locale]/layout.tsx` (locale validation + `NextIntlClientProvider` + `Navbar`)
- [ ] Bring `legacy/app/page.tsx` → `app/page.tsx` (default locale entry that renders the localized home)
- [ ] Bring `legacy/app/[locale]/page.tsx` → `app/[locale]/page.tsx` (home content)
- [ ] Ensure `generateStaticParams()` stays in the locale layout.

7) **Reintroduce locale-aware navigation helpers**
- [ ] Keep `legacy/i18n/routing.ts` as the single source for localized pathnames + `createNavigation(routing)` exports.
- [ ] Update any imports that used `legacy/i18n/navigation.ts` vs `legacy/i18n/routing.ts` so the new tree is consistent.

---

## Phase 2 — Styling, fonts, and theming (so migrated UI renders correctly)

8) **Migrate global styles + design tokens**
- [ ] Merge legacy tokens + utility classes from `legacy/app/globals.css` into the root `app/globals.css`.
  - Legacy defines important app classes used across pages/components: `.btn-primary`, `.card-hover`, `.card-container`, `.owner-reviews-shell`, etc.
  - Root currently contains the shadcn Tailwind v4 baseline tokens; reconcile variable names (`--background`, `--foreground`, etc.) carefully.

9) **Migrate font strategy**
- [ ] If adopting legacy Poppins:
  - Bring `Poppins` setup from `legacy/app/layout.tsx` into root `app/layout.tsx`
  - Ensure `--font-sans` resolves to `--font-poppins` (legacy already does in CSS).
- [x] Font decision: use `--font-poppins` as the app sans font token.

10) **Restore theme toggling**
- [ ] Bring `next-themes` provider usage from `legacy/app/layout.tsx` into root `app/layout.tsx`.
- [ ] Bring `legacy/components/layout/theme-switcher.tsx` and ensure it works with the chosen CSS variables.

---

## Phase 3 — Supabase authentication + session middleware

11) **Replace the current Supabase client-only setup**
- [ ] Keep SSR pattern from legacy:
  - `legacy/lib/supabase/server.ts` → `lib/supabase/server.ts`
  - `legacy/lib/supabase/client.ts` → `lib/supabase/client.ts`
  - `legacy/lib/supabase/middleware.ts` → `lib/supabase/middleware.ts`
  - `legacy/lib/supabase/storage.ts` → `lib/supabase/storage.ts`
- [ ] Update/merge `lib/utils.ts` to include `hasEnvVars` (legacy `legacy/lib/utils.ts`) if you want middleware short-circuiting.
- [ ] Decide whether to keep or delete root `lib/supabaseClient.ts` once SSR clients land.

12) **Restore middleware/proxy chain (i18n + auth)**
- [ ] Bring `legacy/proxy.ts` → `proxy.ts` and confirm Next.js 16 runtime picks it up as intended in this project.
  - It composes `updateSession()` (Supabase) + `createMiddleware(routing)` (next-intl) and shares cookies/headers.
  - Validate matcher config: `matcher: ["/((?!api|trpc|_next|_vercel|ingest|.*\\..*).*)"]`.

13) **Port auth routes + UI**
- [ ] Pages:
  - `legacy/app/[locale]/auth/login/page.tsx`
  - `legacy/app/[locale]/auth/sign-up/page.tsx`
  - `legacy/app/[locale]/auth/forgot-password/page.tsx`
  - `legacy/app/[locale]/auth/update-password/page.tsx`
  - `legacy/app/[locale]/auth/sign-up-success/page.tsx`
  - `legacy/app/[locale]/auth/error/page.tsx`
  - `legacy/app/[locale]/auth/confirm/route.ts` (OTP verify)
- [ ] Components:
  - `legacy/components/auth/*` (login/sign-up/forgot/update forms, logout button)
  - `legacy/lib/validation/auth.ts` (zod schemas used by forms)
- [ ] Confirm redirects remain locale-safe (legacy uses `Link`/router helpers from `next-intl` navigation).

---

## Phase 4 — Database + Drizzle (schema, migrations, and runtime client)

14) **Port Drizzle + DB client**
- [ ] Bring configuration:
  - `legacy/drizzle.config.ts` → `drizzle.config.ts`
  - `legacy/drizzle/*` → `drizzle/*` (migration history + SQL files)
- [ ] Bring runtime DB layer:
  - `legacy/lib/db/*` → `lib/db/*` (client, schema, queries, migrations helper SQL)
- [ ] Bring domain types that depend on schema:
  - `legacy/types/*` → `types/*`

15) **Port scripts and datasets**
- [ ] Scripts:
  - `legacy/scripts/*` → `scripts/*` (seed + org updates + checks + reference patterns)
- [ ] Data files used by scripts:
  - `legacy/cardatasample.json` → `cardatasample.json`
  - `legacy/vehicle_specifications_cr.json` → `vehicle_specifications_cr.json`
- [ ] Confirm env requirements for scripts/tests (service role key, DB URL).

---

## Phase 5 — UI system + shared components (needed by pages)

16) **Create the missing top-level directories in the new project**
- [ ] `components/` (root currently doesn’t have it)
- [ ] `hooks/` (root currently doesn’t have it)
- [ ] `types/` (root currently doesn’t have it)

17) **Port shadcn/ui + shared components**
- [ ] `legacy/components/ui/*` → `components/ui/*`
- [ ] Shared components used across pages:
  - `legacy/components/layout/*` (navbar, language switcher, theme switcher)
  - `legacy/components/showcase/*`
  - `legacy/components/product/*`
  - `legacy/components/reviews/*`
  - `legacy/components/agency/*`
  - `legacy/components/banks/*`
- [ ] Port hooks:
  - `legacy/hooks/use-mobile.ts` → `hooks/use-mobile.ts`
- [ ] Port content helpers used by navbar menus:
  - `legacy/lib/content/navbar/*` → `lib/content/navbar/*`

---

## Phase 6 — App routes/features (move pages after foundations land)

18) **Port marketing and product routes**
- [ ] Marketing:
  - `legacy/app/[locale]/precios/page.tsx`
  - `legacy/app/[locale]/services/page.tsx`
  - `legacy/app/[locale]/shop/page.tsx`
  - `legacy/app/[locale]/used-cars/waitlist/page.tsx`
- [ ] Product detail:
  - `legacy/app/[locale]/vehicles/[slug]/page.tsx` (SEO + structured data)
  - `legacy/app/[locale]/cars/page.tsx` (featured vehicle page)
- [ ] Listing/placeholder routes to reconcile:
  - `legacy/app/[locale]/vehicles/page.tsx` (currently a placeholder; decide the real listing implementation)

19) **Port admin route + API**
- [ ] UI:
  - `legacy/app/[locale]/admin/page.tsx`
- [ ] API routes:
  - `legacy/app/api/admin/[table]/route.ts`
  - `legacy/app/api/admin/[table]/[id]/route.ts`
- [ ] Decide how admin access is protected (middleware redirect is currently broad; you may want explicit role checks).

20) **Port profile API (auth + DB)**
- [ ] `legacy/app/api/profile/display-name/route.ts`
- [ ] Ensure `profiles` table + RLS expectations are satisfied (see `legacy/lib/db/schema/profiles.ts` and reference scripts).

---

## Phase 7 — Analytics, assets, tests, deployment hardening

21) **Bring PostHog integration**
- [ ] `legacy/instrumentation-client.ts` → `instrumentation-client.ts`
- [ ] Ensure rewrites in `next.config.ts` exist (already in legacy config).

22) **Migrate public assets**
- [ ] Copy `legacy/public/Logo.jpg` → `public/Logo.jpg`
- [ ] Remove/replace create-next-app placeholder svgs in `public/*` if no longer used.

23) **Bring over tests (and add a root test script)**
- [ ] Port tests: `legacy/tests/*` → `tests/*`
- [ ] Add `test` script to root `package.json` if you want parity with legacy (`bun test`).

24) **Deployment config parity**
- [ ] If deploying via Coolify/Nixpacks, port:
  - `legacy/nixpacks.toml` → `nixpacks.toml`
  - `legacy/docs/coolify.md` → `docs/coolify.md` (optional but useful)

---

## Quick “what to copy” checklist (by folder)

- [ ] `legacy/app/` → `app/` (merge carefully: root has scaffold pages)
- [ ] `legacy/components/` → `components/`
- [ ] `legacy/hooks/` → `hooks/`
- [ ] `legacy/i18n.ts`, `legacy/i18n/`, `legacy/messages/` → root equivalents
- [ ] `legacy/lib/` → `lib/` (merge with existing `lib/utils.ts`, `lib/supabaseClient.ts`)
- [ ] `legacy/drizzle.config.ts`, `legacy/drizzle/` → root equivalents
- [ ] `legacy/scripts/` + data JSONs → root equivalents
- [ ] `legacy/tests/` → `tests/`
- [ ] `legacy/types/` → `types/`
- [ ] `legacy/proxy.ts`, `legacy/instrumentation-client.ts` → root equivalents
- [ ] `legacy/next.config.ts` settings → root `next.config.ts`

---

## Optional (non-runtime) artifacts to port or retire

- [ ] Docs (keep if still accurate): `legacy/docs/*` (notably `legacy/docs/architecture.md`, `legacy/docs/design.md`, `legacy/docs/Roadmap/*`)
- [ ] Planning/migration notes: `legacy/PLANNER.MD`, `legacy/layout-migration.md`, `legacy/task-manager.html`
- [ ] Local editor config (optional): `legacy/.vscode/`
- [ ] Package manager cleanup: decide whether to delete/ignore `legacy/package-lock.json` once Bun is the only supported workflow
