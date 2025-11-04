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

Radix 1.x and shadcn components render correctly under React 19; Tailwind 4 currently supports the Next.js compiler pipeline used in v16 (monitor release notes for postcss updates).

## Internationalization, Forms & Validation
- **next-intl** `^4.4.0` orchestrates routing-aware translations. Localization lives under `app/[locale]/`, where the per-locale layout loads Poppins, sets the HTML language attribute, and wraps descendants in `NextIntlClientProvider`.
- Routing is declared in `i18n/routing.ts` via `defineRouting`; Spanish (`es`) is the default locale with an as-needed prefix strategy, so `/precios` resolves Spanish content and `/en/precies` resolves English. Navigation helpers (`Link`, `redirect`, `useRouter`, etc.) are generated with `createNavigation(routing)`.
- Request-scoped messages are served from `messages/{locale}.json` through `i18n/request.ts` and the `next-intl` plugin registered in `next.config.ts`.
- Edge routing is wired through `proxy.ts`, which replaces the legacy middleware entry point and delegates to `createMiddleware(routing)`; ensure new routes are covered by the matcher.
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
