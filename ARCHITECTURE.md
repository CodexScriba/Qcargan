# Architecture: QueCargan

## Project Northstar

**QueCargan** is an electric vehicle marketplace for the Latin American market, with Spanish as the primary language and English as secondary.

---

## Tech Stack Reference

### Core Framework
- **Next.js** `^16.0.10` - App Router with Turbopack, React Server Components enabled
- **React** `^19.2.3` - Latest React with concurrent rendering
- **TypeScript** `^5` - Static typing across the full stack

### Database & Backend
- **Supabase** `^2.87.1` - Auth, Database (PostgreSQL), Storage
- **@supabase/ssr** `^0.8.0` - Server-side session handling for Next.js
- **Drizzle ORM** `^0.45.1` - Type-safe database access with migrations
- **Drizzle Kit** `^0.31.8` - Migration tooling and studio
- **postgres** `^3.4.7` - PostgreSQL driver
- **PostgreSQL** - Primary database via Supabase

### Authentication
- **Supabase Auth** - Email/password authentication with session management
- **@supabase/ssr** - Server-side session handling for Next.js

### Internationalization
- **next-intl** `^4.6.1` - Routing-aware translations with locale proxy
- **Default Locale**: Spanish (es)
- **Secondary Locale**: English (en)

### Styling & UI
- **Tailwind CSS** `^4` - Utility-first CSS with new v4 features
- **shadcn/ui** `^3.5.0` - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **next-themes** - Theme management (light/dark mode)
- **lucide-react** `^0.562.0` - Icon library

### Forms & Validation
- **React Hook Form** `^7.68.0` - Form state management
- **Zod** `^4.1.13` - Schema validation
- **@hookform/resolvers** - Zod integration with React Hook Form

### Analytics
- **posthog-js** `^1.310.1` - Client-side product analytics
- **posthog-node** `^5.18.0` - Server-side analytics

### Testing
- **Vitest** `^4.0.16` - Unit and integration testing
- **@vitejs/plugin-react** `^5.1.2` - React plugin for Vitest
- **@playwright/test** `^1.57.0` - End-to-end testing

### Hosting & Deployment
- **Coolify** - Self-hosted deployment platform
- **Hostinger** - Infrastructure provider
- **Bun** - Package manager and script runner

---

## Target File Tree Structure

```
qcargan/
├── .kanban2code/              # Kanban2Code task management
├── app/                       # Next.js App Router
│   ├── [locale]/             # Localized routes
│   │   ├── layout.tsx        # Root layout with font/theme providers
│   │   ├── page.tsx          # Home page
│   │   ├── auth/             # Authentication pages
│   │   │   ├── ingresar/     # Login
│   │   │   ├── registrar/   # Sign up
│   │   │   ├── recuperar/    # Forgot password
│   │   │   └── actualizar-clave/ # Update password
│   │   ├── precios/         # Pricing page
│   │   ├── vehiculos/        # Vehicle pages (Spanish route)
│   │   │   ├── page.tsx      # Vehicle listing
│   │   │   └── [slug]/       # Vehicle detail
│   │   ├── servicios/        # Services page
│   │   ├── tienda/           # Shop page
│   │   ├── autos-usados/     # Used cars
│   │   │   └── lista-espera/ # Waitlist
│   │   └── admin/            # Admin dashboard
│   ├── favicon.ico
│   ├── globals.css          # Global styles + design tokens
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/               # Layout components
│   │   ├── navbar/
│   │   ├── language-switcher.tsx
│   │   └── theme-switcher.tsx
│   ├── auth/                 # Authentication components
│   │   ├── login-form.tsx
│   │   ├── sign-up-form.tsx
│   │   └── auth-image.tsx    # Theme-aware hero images
│   ├── product/              # Vehicle display components
│   └── agency/               # Agency/Dealer components
├── lib/
│   ├── db/                   # Database layer
│   │   ├── schema/           # Drizzle schema definitions
│   │   ├── queries/          # Database queries
│   │   └── index.ts          # Drizzle client export
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── storage.ts        # Storage helpers
│   ├── i18n/                 # Internationalization
│   │   ├── navigation.ts     # Locale-aware navigation helpers
│   │   ├── routing.ts        # next-intl routing config
│   │   └── request.ts        # Request config
│   └── utils.ts              # Shared utilities
├── messages/                  # Translation files
│   ├── es.json               # Spanish translations
│   └── en.json               # English translations
├── drizzle/                  # Drizzle ORM
│   ├── config.ts             # Drizzle configuration
│   └── migrations/           # Database migrations
├── scripts/                  # Utility scripts
├── public/                   # Static assets
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── tests/                    # E2E test files (Playwright)
│   └── *.spec.ts             # E2E test specs
├── .env                      # Environment variables (gitignored)
├── .env.local                # Local environment (gitignored)
├── .gitignore
├── bun.lock
├── components.json           # shadcn/ui configuration
├── drizzle.config.ts         # Drizzle ORM configuration
├── eslint.config.mjs
├── next.config.ts            # Next.js configuration
├── package.json
├── playwright.config.ts      # Playwright E2E test configuration
├── postcss.config.mjs
├── proxy.ts                  # Next.js 16 proxy (replaces middleware.ts)
├── tsconfig.json
├── vitest.config.ts          # Vitest unit/integration test configuration
└── ARCHITECTURE.md           # This file
```

---

## Integration Inventory

### Supabase
**Purpose**: Complete backend-as-a-service providing authentication, database, and storage.

**Components**:
- **Auth**: Email/password authentication with session management
- **Database**: PostgreSQL database with Row Level Security (RLS)
- **Storage**: Image storage for vehicle media

**Key Files**:
- `lib/supabase/client.ts` - Browser-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/storage.ts` - Storage helper functions
- `proxy.ts` - Middleware for session refresh

**Environment Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=<project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

### next-intl
**Purpose**: Internationalization with locale-aware routing.

**Components**:
- **Routing**: Locale-based URL routing with as-needed prefix strategy
- **Translations**: Message loading and interpolation
- **Navigation**: Locale-aware Link, redirect, useRouter helpers

**Key Files**:
- `i18n.ts` - Locale configuration and getMessages helper
- `lib/i18n/routing.ts` - Routing configuration with defineRouting
- `lib/i18n/navigation.ts` - Locale-aware navigation helpers (Link, useRouter, etc.)
- `lib/i18n/request.ts` - Request config for SSR
- `messages/es.json` - Spanish translations
- `messages/en.json` - English translations

**Configuration**:
- Default locale: `es` (Spanish)
- Secondary locale: `en` (English)
- Strategy: As-needed prefix (no prefix for Spanish)
- Locale detection: Disabled

### PostHog
**Purpose**: Product analytics and event tracking.

**Components**:
- **Client SDK**: Browser-side event tracking
- **Server SDK**: Server-side analytics

**Environment Variables**:
```bash
NEXT_PUBLIC_POSTHOG_KEY=<posthog_project_key>
NEXT_PUBLIC_POSTHOG_HOST=<posthog_host>
```

### Drizzle ORM
**Purpose**: Type-safe database access with migrations.

**Components**:
- **Schema**: TypeScript-first database schema definitions
- **Migrations**: Database version control
- **Queries**: Type-safe database queries

**Key Files**:
- `drizzle.config.ts` - Drizzle configuration
- `lib/db/schema/` - Schema definitions organized by domain
- `lib/db/queries/` - Reusable query functions
- `lib/db/index.ts` - Database client export

**Environment Variables**:
```bash
DATABASE_URL=<supabase_database_url>
DIRECT_URL=<supabase_direct_url>
```

### shadcn/ui
**Purpose**: Pre-built, accessible UI components based on Radix UI.

**Components**:
- **Base Components**: Button, Input, Form, Dialog, etc.
- **Composition**: Complex components built from primitives

**Key Files**:
- `components/ui/` - All shadcn/ui components
- `components.json` - Component configuration

---

## Deployment Architecture

### Coolify Configuration

**Deployment Target**: Coolify on Hostinger infrastructure

**Build Process**:
1. Install dependencies: `bun install`
2. Build application: `bun run build`
3. Start production server: `bun start`

**Environment Variables Required**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Database
DATABASE_URL=<supabase_database_url>
DIRECT_URL=<supabase_direct_url>

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=<posthog_project_key>
NEXT_PUBLIC_POSTHOG_HOST=<posthog_host>

# Application
NODE_ENV=production
```

### Database Connection Strategy

**Connection Pooling**:
- Use `DIRECT_URL` for direct connections during migrations and scripts
- Use `DATABASE_URL` (connection pooler) for application runtime
- Pooler reduces connection overhead and improves performance

**Connection Types**:
- **Direct Connection**: Used by Drizzle migrations and seed scripts
- **Pooled Connection**: Used by Next.js API routes and Server Actions

### Storage Strategy

**Supabase Storage**:
- **Bucket**: `vehicle-images`
- **Path Structure**: `vehicles/{brand}/{model}-{variant}-{type}.jpg`
- **Image Variants**: Hero images and responsive WebP variants
- **CDN**: Public URLs served through Supabase CDN

**Storage Helpers**:
- `getPublicImageUrl(path)` - Get public URL for single image
- `getPublicImageUrls(paths)` - Batch get public URLs
- Future: Signed URLs for protected images

---

## Database Schema Overview

### Core Tables

**Vehicles**:
- `vehicles` - Core vehicle data (brand, model, year, variant, slug)
- `vehicle_specifications` - Technical specs (range, battery, charging, performance)
- `vehicle_images` - Image metadata
- `vehicle_image_variants` - Responsive image variants
- `vehicle_pricing` - Pricing and availability by organization

**Organizations**:
- `organizations` - Sellers (AGENCY, DEALER, IMPORTER)

**Financing**:
- `banks` - Financing partners with APR ranges and terms

### Schema Design Principles

- **Modular Organization**: Each domain entity in its own file
- **TypeScript-First**: Proper types with `$type<>` for enums
- **JSONB Flexibility**: Complex data in JSONB fields
- **Comprehensive Indexing**: 21+ indexes for query optimization
- **Referential Integrity**: Foreign keys with cascade delete
- **i18n-Ready**: Fields for localized content

### Migration Strategy

- Use Drizzle Kit for schema migrations
- Version-controlled migration files in `drizzle/migrations/`
- **Database Schemas (2025-12-29)**: Ported core tables from legacy to Drizzle ORM with strict typing.
  - Files: `lib/db/schema/organizations.ts`, `lib/db/schema/vehicle-pricing.ts`, `lib/db/schema/vehicle-images.ts`, `lib/db/schema/banks.ts`, `lib/db/schema/profiles.ts`, `lib/db/schema/vehicles.ts`, `lib/db/schema/index.ts`.
  - Features: JSONB strict typing, Supabase `auth.users` linking, composite indexes.
- **Database Migrations (2025-12-29)**: Generated initial Drizzle migration for core schema.
  - Files: `drizzle/0000_overrated_kree.sql`.

---

## Security Considerations

### Authentication

- Cookie-based sessions via @supabase/ssr
- Secure, httpOnly cookies
- Session refresh on middleware
- Protected routes with server-side validation

### Data Validation

- Zod schemas for all user inputs
- Server-side validation for API routes
- Type-safe database operations via Drizzle

### Secrets Management

- Environment variables for all secrets
- Never commit .env files
- Rotate credentials regularly
- Use service role key only server-side

### Supabase RLS

- Enable Row Level Security on all tables
- Create policies for authenticated vs anonymous access
- Validate user permissions on all mutations

---

## Testing Strategy

### Test Stack

**Unit & Integration Tests (Vitest)**:
- File pattern: `*.test.ts` or `*.test.tsx` alongside source files
- Run: `bun test` or `bun test:ui` for interactive mode
- Coverage: `bun test:coverage`

**End-to-End Tests (Playwright)**:
- File pattern: `tests/*.spec.ts` in project root
- Run: `bun test:e2e` or `bun test:e2e:ui` for interactive mode
- Browser testing across Chromium, Firefox, WebKit

### Test Scripts

```bash
bun test              # Run Vitest unit/integration tests
bun test:ui           # Vitest with interactive UI
bun test:coverage     # Vitest with coverage report
bun test:e2e          # Run Playwright E2E tests
bun test:e2e:ui       # Playwright with interactive UI
```

### Testing Conventions

**Unit Tests**:
- Test files co-located with source: `Button.tsx` → `Button.test.tsx`
- Focus on component behavior, not implementation
- Mock external dependencies (Supabase, fetch, etc.)

**Integration Tests**:
- Test component interactions and data flow
- Mock Next.js request scope (cookies, headers) via `vi.mock`
- Test Server Actions with mocked database

**E2E Tests**:
- Test complete user flows (login, browse vehicles, etc.)
- Use Playwright's locator strategies for reliable selectors
- Test both locales (es/en) for i18n coverage

### Mocking Patterns

**Next.js Headers/Cookies**:
```typescript
vi.mock('next/headers', () => ({
  cookies: () => ({ get: vi.fn(), set: vi.fn() }),
  headers: () => new Headers(),
}))
```

**Supabase Client**:
```typescript
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
}))
```

---

## References

### Legacy Codebase
Location: `/legacy/` - Reference only, do not copy directly

Key Files for Reference:
- `legacy/app/[locale]/layout.tsx` - Font and theme setup
- `legacy/lib/supabase/` - Client configurations
- `legacy/i18n/` - Internationalization setup
- `legacy/lib/db/schema.ts` - Database schema
- `legacy/app/[locale]/` - Page structures

### Documentation
- Next.js 16 Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Drizzle ORM Documentation: https://orm.drizzle.team
- next-intl Documentation: https://next-intl-docs.vercel.app
- shadcn/ui Documentation: https://ui.shadcn.com
