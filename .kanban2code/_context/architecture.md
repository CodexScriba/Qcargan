---
name: Architecture
description: Codebase and project description
scope: global
created: '2025-12-17'
file_references:
  - docs/architecture.md
---

# Architecture Context

This context file links to the main architecture documentation.

See: [ARCHITECTURE.md](../../ARCHITECTURE.md) for the full architecture documentation including directory structure.

## Recent Updates
- **Internationalization (2025-12-28)**: Core `next-intl` configuration implemented.
  - Locales: `es` (default), `en`.
  - Prefix strategy: `as-needed`.
  - Locale detection disabled.
  - Files: `i18n.ts`, `lib/i18n/routing.ts`, `lib/i18n/navigation.ts`, `lib/i18n/request.ts`.
- **Proxy middleware (2025-12-29)**: Supabase session refresh chained with i18n routing.
  - Files: `proxy.ts`, `lib/supabase/proxy.ts`.
  - Added `hasEnvVars` guard in `lib/utils.ts` for missing Supabase credentials.
- **Locale Layout (2025-12-29)**: Implemented localized app layout and home page using Next.js 16 Server Components.
  - Files: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`.
- **Translations Structure (2025-12-29)**: Created root-level translation files with shared keys.
  - Files: `messages/es.json`, `messages/en.json`.
  - Validation: Added tests to ensure key parity between locales.
- **Route Pathnames (2025-12-29)**: Defined all 40+ localized route paths in `lib/i18n/routing.ts`.
  - Validated Spanish localization for paths like `/auth/ingresar` and `/vehiculos`.
- **Database Client (2025-12-29)**: Configured Drizzle to use `drizzle-orm/node-postgres` with a shared `pg.Pool`.
  - Files: `drizzle.config.ts`, `lib/db/index.ts`, `lib/db/__tests__/client.test.ts`, `package.json`.
