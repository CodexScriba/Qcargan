# Architecture Overview

This document summarizes the technical architecture for the **Qcargan** application and highlights considerations for the Next.js 16 runtime. The project is a Next.js App Router stack targeting edge-friendly deployments through Coolify, backed by Supabase and Drizzle ORM, and managed with Bun.

## Runtime & Core Framework
- **next** `^16.0.1` implements the App Router with the new `proxy` middleware convention and React Server Components enabled by default.
- **react** `19.2.0` and **react-dom** `19.2.0` provide concurrent rendering support required by Next.js 16.
- **typescript** `^5` supplies static typing across the full stack.

All core versions are aligned with the official Next.js 16 compatibility matrix.

## Data & Backend Layer
- **@supabase/supabase-js** `^2.79.0` and **@supabase/ssr** `^0.7.0` handle authentication, storage, and server-side session hydration.
- **drizzle-orm** `^0.44.7` orchestrates schema-safe access to the Supabase Postgres database via **postgres** `^3.4.7`.
- **drizzle-kit** `^0.31.6` and **dotenv** `^17.2.3` support migrations and environment management.
- Drizzle configuration lives in `drizzle.config.ts`, with schema and migration history under `drizzle/` and the runtime client exported from `lib/db/`.
- Supabase helpers follow the SSR guidance from Context7: server/browser clients in `lib/supabase/` and middleware session refresh wired through `proxy.ts`.

These packages run on the Node.js runtime used by Next.js API routes and Server Actions and have no known conflicts with Next.js 16.

## Presentation Layer
- Component primitives come from **Radix UI** (`@radix-ui/*` packages) wrapped with **shadcn** `^3.5.0` generators for consistent UI patterns.
- Styling is powered by **tailwindcss** `^4`, **@tailwindcss/postcss** `^4`, **tailwind-merge** `^3.3.1`, and helpers such as **class-variance-authority**, **clsx**, and **next-themes** for theming.
- Interaction, feedback, and media widgets use **lucide-react**, **cmdk**, **sonner**, **vaul**, **input-otp**, **embla-carousel-react**, **react-resizable-panels**, **react-day-picker**, **date-fns**, and **recharts**.
- Global typography is supplied by the **Poppins** family through `next/font` (`app/[locale]/layout.tsx`), exposing a shared CSS variable (`--font-poppins`) consumed by Tailwind’s `font-sans` utility. The build currently downloads font files from Google Fonts; to support offline CI, self-host the `.woff2` variants under `public/fonts/` and switch to `next/font/local`.
- **Navbar composition** centralizes responsive navigation across breakpoints, surfacing localization, theming, and primary product entry points. The component tree and responsibilities are:

```
app/
├─ page.tsx – default-locale landing route that mounts <Navbar> above public marketing content.
└─ [locale]/layout.tsx – per-locale root layout that wraps children with NextIntl and renders <Navbar>.
components/layout/navbar/
├─ Navbar.tsx – client component that swaps desktop/tablet/mobile variants based on Tailwind viewport utilities.
├─ Logo.tsx – brand link that routes to the localized home page and shows the Qcargan logomark.
├─ variants/
│  ├─ DesktopNavbar.tsx – wide-screen nav with mega menus, global search, locale/theme controls, and auth CTAs.
│  ├─ TabletNavbar.tsx – condensed nav keeping key menus and switchers while shrinking CTAs for mid-width screens.
│  └─ MobileNavbar.tsx – stateful sheet menu that collapses navigation, search, and auth flows into a drawer UI.
└─ menus/
   ├─ NewCarsMenu.tsx – mega menu fed by `lib/content/navbar/new-cars` to showcase inventory categories and quick links.
   ├─ UsedCarsMenu.tsx – waitlist teaser for the secondary marketplace with conversion-focused messaging.
   ├─ ServicesMenu.tsx – services catalogue overview pulling structured copy from `lib/content/navbar/services`.
   ├─ TiendaMenu.tsx – commerce entry point backed by `lib/content/navbar/shop` cards and quick actions.
   └─ SearchBar.tsx – controlled search form exposing an optional `onSearch` callback for future query wiring.
components/layout/theme-switcher.tsx – control surfaced inside every variant to toggle the design system theme.
components/layout/language-switcher.tsx – locale selector wired to `next-intl` routing helpers and rendered in all breakpoints.
```

Radix 1.x and shadcn components render correctly under React 19; Tailwind 4 currently supports the Next.js compiler pipeline used in v16 (monitor release notes for postcss updates).

## Internationalization, Forms & Validation
- **next-intl** `^4.4.0` orchestrates routing-aware translations. Localization lives under `app/[locale]/`, where the per-locale layout loads Poppins, sets the HTML language attribute, and wraps descendants in `NextIntlClientProvider` alongside the shared `Navbar`.
- Routing is declared in `i18n/routing.ts` via `defineRouting`; Spanish (`es`) is the default locale with an as-needed prefix strategy and locale detection disabled. Marketing pages (`/`, `/precios`, `/test`) render without authentication while `/en`, `/en/prices`, and the localized `/auth/*` and `/protected/*` segments map to their English counterparts. Navigation helpers (`Link`, `redirect`, `useRouter`, etc.) are generated with `createNavigation(routing)`, and `publicLocalePaths` exposes the marketing surface for the Supabase proxy middleware.
- Request-scoped messages are served from `messages/{locale}.json` through `i18n/request.ts` and the `next-intl` plugin registered in `next.config.ts`.
- Edge routing is wired through `proxy.ts`, which replaces the legacy middleware entry point and delegates to `createMiddleware(routing)`; ensure new routes are covered by the matcher.
- **i18n flow:** `i18n.ts` defines the supported locales, default locale, and `getMessages` helper. `i18n/routing.ts` centralizes localized pathnames and exports navigation helpers consumed by UI code (`Link`, `redirect`, `useRouter`, `getPathname`). `i18n/request.ts` plugs into `next-intl`’s `getRequestConfig` to load message bundles during SSR, falling back to the default locale when necessary. `app/[locale]/layout.tsx` validates the `[locale]` segment, calls `setRequestLocale`, and wraps children in `NextIntlClientProvider`, while `app/page.tsx` mirrors that wiring for the default locale (`/`). Translations live in `messages/en.json` and `messages/es.json`; add new keys in both files to maintain parity. When creating new routes, place the UI under `app/[locale]/...`, reference strings with `useTranslations`/`getTranslations`, and link via the helpers exported from `i18n/routing.ts` so localized path rewrites remain consistent.
- **react-hook-form** `^7.66.0`, **@hookform/resolvers** `^5.2.2`, and **zod** `^4.1.12` combine for type-safe forms with both client and server validation paths.

All of these libraries are actively tested against modern React and Next.js versions.

## Tooling & Developer Experience
- **eslint** `^9` and **eslint-config-next** `16.0.1` enforce framework-consistent linting rules.
- TypeScript type packages (**@types/node**, **@types/react**, **@types/react-dom**) match the runtime versions.
- **Bun** is the package manager and script runner (`bun add`, `bun run dev`, `bun run build`, etc.). When using Next.js codemods or CLI tasks that expect npm, prefer `npx` to avoid compatibility gaps.

## Environment Configuration
The application expects Supabase environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
DATABASE_URL=<supabase_database_url>
DIRECT_URL=<supabase_direct_url>
```

## Next.js 16 Specific Guidance
1. Middleware has been renamed to **proxy**; ensure files and exports adopt the new convention (`proxy.ts`, `export function proxy()`).
2. Update configuration flags such as `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.
3. Rely on `NextResponse.redirect` or `NextResponse.rewrite` rather than returning response bodies from proxy handlers.
4. Review Context7 documentation for the latest Next.js 16 changes before modifying framework-level code (see `AGENTS.MD` for the required workflow).

With the above versions and practices, all listed dependencies are compatible with Next.js 16 and ready for the ongoing migration from the legacy `quecargan` application.
