---
stage: plan
tags: []
contexts:
  - _context/skills/nextjs-core-skills.md
  - _context/skills/react-core-skills.md
  - _context/skills/skill-next-intl.md
  - _context/skills/skill-supabase-ssr.md
  - _context/skills/skill-drizzle-orm.md
  - _context/skills/skill-tailwindcss-v4.md
  - _context/skills/skill-server-actions-mutations.md
  - _context/skills/skill-http-security-headers.md
  - _context/skills/skill-vitest-playwright-testing.md
  - _context/skills/skill-posthog-analytics.md
  - _context/skills/skill-routing-layouts.md
  - _context/skills/skill-metadata-seo.md
agent: "02-\U0001F3DB️architect"
---
# Legacy Transfer: QueCargan Rebuild

## Overview

Rebuild the QueCargan electric vehicle marketplace from scratch after a security incident (react2shell vulnerability). The goal is to recreate all existing functionality with a methodical, security-conscious approach where every line of code is understood and intentional.

This rebuild uses the same tech stack (Next.js, Supabase, Drizzle, next-intl, Tailwind v4, shadcn/ui) but with fresh credentials, improved code organization, and refined glassmorphic design leveraging current AI capabilities.

## Problem Statement

The original codebase was compromised due to a react2shell vulnerability, requiring a complete rebuild. Beyond security, the original development was too AI-dependent without sufficient human review, resulting in code the developer didn't fully understand. This rebuild prioritizes:

1. **Security**: Fresh credentials, rotated keys, reviewed dependencies
2. **Understanding**: Every component read and understood before integration
3. **Quality**: Improved design and code organization
4. **Methodology**: Using kanban2code for structured, traceable AI collaboration

## Goals

- Rotate all secrets and credentials (Supabase, database, API keys)
- Rebuild foundational systems (fonts, theming, i18n) with clean implementations
- Recreate authentication flows with full understanding of the code
- Restore database schema and Supabase integration
- Redesign all pages with improved glassmorphic aesthetics
- Maintain Spanish-first i18n with English support
- Ensure every piece of code is reviewed and understood

## Non-Goals (Out of Scope)

- Changing the core tech stack
- Adding new features not in the original (focus on parity first)
- OAuth providers (Google, Facebook) — were disabled in legacy anyway
- Used cars marketplace beyond waitlist page
- Mobile app or native implementations

> **Note:** Checkboxes track implementation progress. Checked items are complete; unchecked items are planned scope.

## Features to Rebuild

### Architecture Documentation
- [x] ARCHITECTURE.md (project northstar, tech stack, file tree, integrations, deployment)

### Foundation Layer
- [ ] Environment setup (.env with fresh Supabase keys)
- [ ] Poppins font configuration (weights 400-800)
- [ ] Tailwind v4 configuration with design tokens
- [ ] Light/dark theme system with CSS custom properties
- [ ] Glassmorphic design system (170+ variables)

### Internationalization
- [ ] next-intl configuration (Spanish default, English secondary)
- [ ] Locale routing (as-needed prefix strategy)
- [ ] Translation files structure (messages/es.json, messages/en.json)
- [ ] 40+ localized route paths
- [ ] Navigation helpers (Link, redirect, usePathname, useRouter)

### Database & Storage
- [ ] Drizzle ORM setup with PostgreSQL
- [ ] Database schema (vehicles, specs, images, pricing, organizations, banks, profiles)
- [ ] Migration system
- [ ] Supabase Storage integration (vehicle-images bucket)
- [ ] Storage helper functions (getPublicImageUrl, etc.)

### Authentication
- [ ] Supabase client setup (browser + server + middleware)
- [ ] Sign up flow with email confirmation
- [ ] Login flow with session management
- [ ] Password reset flow (forgot → email → update)
- [ ] Auth validation schemas (Zod)
- [ ] Protected route middleware

### Layout Components
- [ ] Root layout with font and theme providers
- [ ] Navbar (desktop, tablet, mobile variants)
- [ ] Language switcher
- [ ] Theme switcher (light/dark)
- [ ] Logo component

### Auth Pages
- [ ] Login page (`/auth/ingresar`)
- [ ] Sign up page (`/auth/registrar`)
- [ ] Forgot password page (`/auth/recuperar`)
- [ ] Update password page (`/auth/actualizar-clave`)
- [ ] Sign up success page
- [ ] Auth error page

### Public Pages
- [ ] Home page (hero, features, stats, CTAs)
- [ ] Pricing page (Starter/Growth tiers)
- [ ] Vehicles listing page (filters, pagination)
- [ ] Vehicle detail page (specs, pricing, financing, reviews)
- [ ] Services page (placeholder structure)
- [ ] Shop page (placeholder structure)
- [ ] Used cars waitlist page

### Product Components
- [ ] ProductTitle
- [ ] ImageCarousel
- [ ] SellerCard / SeeAllSellersCard
- [ ] VehicleKeySpecs / VehicleAllSpecs
- [ ] TrafficLightReviews
- [ ] FinancingTabs
- [ ] ServicesShowcase

### Admin
- [ ] Admin dashboard (protected)
- [ ] CRUD operations for database tables

### Analytics & Deployment
- [ ] PostHog integration (client + server)
- [ ] Coolify deployment configuration
- [ ] Environment variables for production

## Success Criteria

- [ ] All .env secrets are fresh (no legacy credentials)
- [ ] Application runs without errors on fresh clone + `bun install`
- [ ] Authentication flows work end-to-end
- [ ] Both locales (es/en) render correctly with proper translations
- [ ] Light/dark theme toggle works
- [ ] Vehicle listing and detail pages display data from Supabase
- [ ] All pages pass visual review for glassmorphic design
- [ ] Developer can explain every component's purpose and implementation

## Recommended Build Order

### Phase 0: Architecture Documentation
1. Create project architecture document (ARCHITECTURE.md)
   - Project northstar and vision
   - Complete tech stack reference
   - Target file tree structure
   - Integration inventory (everything being rebuilt)
   - Deployment architecture (Coolify/Hostinger)

### Phase 1: Security & Foundation
2. Create fresh Supabase project
3. Set up .env with new credentials
4. Configure fonts (Poppins)
5. Set up Tailwind v4 with design tokens
6. Implement theme system (light/dark)

### Phase 2: i18n & Routing
7. Configure next-intl
8. Set up locale routing
9. Create translation file structure
10. Implement navigation helpers

### Phase 3: Database
11. Set up Drizzle ORM
12. Define database schema
13. Run migrations
14. Configure Supabase Storage

### Phase 4: Authentication
15. Set up Supabase clients (browser/server)
16. Implement auth middleware
17. Build auth pages (login → signup → password reset)
18. Test complete auth flows

### Phase 5: Layout & Navigation
19. Build root layout
20. Build Navbar (all variants)
21. Add language/theme switchers

### Phase 6: Public Pages
22. Home page
23. Pricing page
24. Vehicles listing
25. Vehicle detail
26. Services/Shop placeholders
27. Used cars waitlist

### Phase 7: Admin & Polish
28. Admin dashboard
29. Final design review
30. Translation completion
31. Security audit

### Phase 8: Analytics & Deployment
32. PostHog integration
33. Coolify deployment configuration
34. Production environment setup

## Decisions Made

- **Supabase**: Entirely new project (same name, delete and recreate from scratch)
- **Database data**: All removed, re-entered at later stages (legacy available for reference)
- **PostHog**: Include in rebuild, but integrate at later stages
- **Hosting**: Coolify on Hostinger (not Vercel)

## Notes

### Security Considerations
- Never commit .env files
- Use Supabase RLS (Row Level Security) policies
- Validate all user inputs with Zod
- Review all dependencies for known vulnerabilities
- Use `@supabase/ssr` for secure cookie-based sessions

### HTTP Security Headers (post-incident priority)
Configure in `next.config.ts` headers:
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer leakage
- `Permissions-Policy` - Disable unused browser features
- `Content-Security-Policy` - Restrict resource loading (define script-src, style-src, img-src)

Example CSP baseline for this stack:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co *.posthog.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: *.supabase.co;
connect-src 'self' *.supabase.co *.posthog.com;
```

### Design System Reference (from legacy)
The legacy glassmorphic system used:
- Cool mist backgrounds (200° 62% 97%)
- Liquid Glass Lagoon brand color (188° 82% 45%)
- Deep Atlantic primary (208° 88% 38%)
- Frosted glass effects with blur
- Electric neon accents for dark mode
- Border radius baseline: 0.75rem

### Legacy File Reference
Key files to reference (but rewrite, don't copy):
- `/legacy/app/layout.tsx` — font and theme setup
- `/legacy/lib/supabase/` — client configurations
- `/legacy/i18n/` — internationalization setup
- `/legacy/messages/` — translation structure
- `/legacy/lib/db/schema.ts` — database schema
- `/legacy/app/[locale]/` — page structures

---

## Technical Architecture

### Overview

The QueCargan rebuild follows a **modular, security-first architecture** built on Next.js 16's App Router with React Server Components. The system uses Supabase as a complete backend-as-a-service (auth, database, storage), Drizzle ORM for type-safe database access, and next-intl for locale-aware routing.

**Key Architectural Decisions:**
1. **Server-first rendering** - RSC for data fetching, client components only when needed
2. **Cookie-based sessions** - @supabase/ssr for secure, httpOnly session management
3. **Locale-prefixed routing** - Spanish default (no prefix), English with `/en` prefix
4. **Design token system** - CSS custom properties for theming, not Tailwind config
5. **Modular schema** - One file per domain entity in Drizzle

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │ Theme      │  │ Language   │  │ Client Components      │ │
│  │ Provider   │  │ Provider   │  │ (Forms, Interactivity) │ │
│  └────────────┘  └────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                        │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │ Supabase Session    │  │ next-intl Locale Routing     │  │
│  │ Refresh             │  │ (handleI18nRouting)          │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ app/                                                    │ │
│  │ ├── [locale]/                                           │ │
│  │ │   ├── layout.tsx (NextIntlClientProvider)            │ │
│  │ │   ├── page.tsx (Home - RSC)                          │ │
│  │ │   ├── auth/ (Login, Signup, Password Reset)          │ │
│  │ │   ├── vehiculos/ (Listing, Detail - RSC)             │ │
│  │ │   └── admin/ (Protected Dashboard)                   │ │
│  │ └── layout.tsx (Root - ThemeProvider, Fonts)           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Supabase     │  │ Drizzle ORM  │  │ Supabase Storage │   │
│  │ Auth         │  │ (PostgreSQL) │  │ (Images)         │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow:**
   - User submits credentials → Server Action → Supabase Auth
   - Session cookie set (httpOnly, secure) → Middleware refreshes on each request
   - Protected routes check session in Server Components

2. **Vehicle Data Flow:**
   - RSC fetches from PostgreSQL via Drizzle → Rendered on server
   - Images fetched from Supabase Storage CDN → Public URLs
   - Filters applied via URL params → Server-side filtering

3. **i18n Flow:**
   - Middleware detects locale from URL → Sets request locale
   - Server Components load messages via `getMessages(locale)`
   - Client components receive messages via `NextIntlClientProvider`

### Dependencies (to install)

```bash
# Required new packages
bun add drizzle-orm postgres @supabase/ssr next-intl posthog-js posthog-node

# Dev dependencies (ORM tooling + testing)
bun add -D drizzle-kit vitest @vitejs/plugin-react @playwright/test
```

**Note:** `dotenv` is not needed - Next.js natively loads `.env*` files.

### Testing Stack

**Scripts to add to `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Configuration files:**
- `vitest.config.ts` - Vitest config with React plugin
- `playwright.config.ts` - Playwright config for E2E tests

**Test file conventions:**
- Unit/Integration: `*.test.ts` or `*.test.tsx` alongside source files
- E2E: `tests/*.spec.ts` in project root

### Constraints

1. **No client-side Supabase auth** - Must use @supabase/ssr exclusively
2. **Locale files under 500KB** - Split translations if needed
3. **No direct database access from client** - All queries through Server Components/Actions
4. **All secrets in .env** - Never hardcode credentials
5. **Drizzle schema must match Supabase RLS** - Tables need appropriate policies

---

## Implementation Phases

### Phase 1: Foundation & Security

**Objective:** Set up fresh credentials and foundational configuration that all other features depend on.

#### Task 1.1: Create Fresh Supabase Project
**Definition of Done:**
- [ ] New Supabase project created (delete old if same name)
- [ ] Project URL and keys retrieved
- [ ] RLS enabled by default on all tables
- [ ] Storage bucket "vehicle-images" created with public access

**Files:**
- No code files - Supabase dashboard setup

**Tests:**
- [ ] Manual: Can access Supabase dashboard
- [ ] Manual: Project URL responds to health check

---

#### Task 1.2: Configure Environment Variables
**Definition of Done:**
- [ ] `.env.local` created with all required variables
- [ ] `.env.example` created with placeholder values (for documentation)
- [ ] `.gitignore` confirms .env files are excluded

**Files:**
- `.env.local` - create - actual credentials (gitignored)
- `.env.example` - create - template for documentation

**Tests:**
- [ ] Unit: Environment variables load correctly in Next.js
- [ ] Manual: `process.env.NEXT_PUBLIC_SUPABASE_URL` returns value

---

#### Task 1.3: Install Missing Dependencies
**Definition of Done:**
- [ ] All required packages installed
- [ ] No version conflicts
- [ ] TypeScript types available for all packages

**Files:**
- `package.json` - modify - add dependencies

**Tests:**
- [ ] `bun install` completes without errors
- [ ] `bun run build` compiles successfully

---

#### Task 1.4: Configure Poppins Font
**Definition of Done:**
- [ ] Poppins font loaded via next/font/google
- [ ] Weights 400, 500, 600, 700, 800 available
- [ ] Font applied to html element
- [ ] No layout shift on load

**Files:**
- `app/layout.tsx` - modify - add Poppins font configuration

**Tests:**
- [ ] Visual: Poppins renders correctly in browser
- [ ] Performance: No CLS on font load

---

#### Task 1.5: Implement Theme System
**Definition of Done:**
- [ ] next-themes provider configured
- [ ] Light/dark CSS variables defined in globals.css
- [ ] System preference detection working
- [ ] Theme persists across sessions

**Files:**
- `app/layout.tsx` - modify - add ThemeProvider wrapper
- `app/globals.css` - modify - ensure theme variables present
- `components/theme-provider.tsx` - create - ThemeProvider component

**Tests:**
- [ ] Unit: ThemeProvider renders without error
- [ ] Integration: Theme toggle changes CSS variables
- [ ] Integration: Theme persists in localStorage

---

### Phase 2: Internationalization & Routing

**Objective:** Set up locale-aware routing with Spanish as default, English as secondary.

#### Task 2.1: Configure next-intl
**Definition of Done:**
- [ ] next-intl package configured
- [ ] Locales defined: es (default), en
- [ ] Locale prefix strategy: as-needed (no prefix for Spanish)
- [ ] Locale detection disabled

**Files:**
- `lib/i18n/routing.ts` - create - defineRouting configuration
- `lib/i18n/request.ts` - create - getRequestConfig for SSR
- `i18n.ts` - create - root i18n config with getMessages helper

**Tests:**
- [ ] Unit: routing.locales contains ["es", "en"]
- [ ] Unit: routing.defaultLocale equals "es"

---

#### Task 2.2: Create Proxy Middleware
**Definition of Done:**
- [ ] Middleware combines Supabase session + i18n routing
- [ ] Session cookies transferred between responses
- [ ] Locale detection from URL working

**Files:**
- `proxy.ts` - create - combined middleware handler (Next.js 16 convention, replaces deprecated middleware.ts)

**Note:** In Next.js 16, `proxy.ts` at project root is the standard request interception layer. No next.config.ts changes needed - Next.js auto-detects the file.

**Tests:**
- [ ] Integration: `/` routes to Spanish content
- [ ] Integration: `/en` routes to English content
- [ ] Integration: Session cookie preserved across requests

---

#### Task 2.3: Create App Locale Layout
**Definition of Done:**
- [ ] `app/[locale]/layout.tsx` created
- [ ] NextIntlClientProvider wraps children
- [ ] setRequestLocale called for static generation
- [ ] generateStaticParams exports all locales

**Files:**
- `app/[locale]/layout.tsx` - create - locale layout with provider
- `app/[locale]/page.tsx` - create - placeholder home page

**Tests:**
- [ ] Unit: Layout renders with valid locale
- [ ] Unit: Invalid locale triggers notFound()
- [ ] Integration: Messages available in client components

---

#### Task 2.4: Create Translation Files Structure
**Definition of Done:**
- [ ] `messages/es.json` created with base structure
- [ ] `messages/en.json` created with same structure
- [ ] Common namespaces defined (common, auth, nav, vehicles)

**Files:**
- `messages/es.json` - create - Spanish translations
- `messages/en.json` - create - English translations

**Tests:**
- [ ] Unit: JSON files parse without errors
- [ ] Unit: Both files have matching keys

---

#### Task 2.5: Define Localized Route Pathnames
**Definition of Done:**
- [ ] All 40+ routes defined in pathnames object
- [ ] Spanish paths use Spanish words (vehiculos, precios, etc.)
- [ ] Navigation helpers exported (Link, redirect, usePathname, useRouter)

**Files:**
- `lib/i18n/routing.ts` - modify - add all pathnames

**Tests:**
- [ ] Unit: getPathname returns correct localized path
- [ ] Integration: Link component generates correct href

---

### Phase 3: Database & Storage

**Objective:** Set up Drizzle ORM with the complete vehicle marketplace schema.

#### Task 3.1: Configure Drizzle ORM
**Definition of Done:**
- [ ] Drizzle config file created
- [ ] PostgreSQL driver configured with connection pooling
- [ ] Database client exportable from lib/db

**Files:**
- `drizzle.config.ts` - create - Drizzle configuration
- `lib/db/index.ts` - create - database client export

**Tests:**
- [ ] Unit: Database client connects successfully
- [ ] Unit: Connection pool configured correctly

---

#### Task 3.2: Create Vehicles Schema
**Definition of Done:**
- [ ] vehicles table with core fields (brand, model, year, variant, slug)
- [ ] vehicle_specifications table with range, battery, performance, etc.
- [ ] Proper indexes defined
- [ ] TypeScript types exported

**Files:**
- `lib/db/schema/vehicles.ts` - create - vehicle tables
- `lib/db/schema/index.ts` - create - barrel export

**Tests:**
- [ ] Unit: Schema compiles without TypeScript errors
- [ ] Unit: Types correctly infer from schema

---

#### Task 3.3: Create Supporting Schemas
**Definition of Done:**
- [ ] organizations table (agencies, dealers, importers)
- [ ] vehicle_pricing table (price by organization)
- [ ] vehicle_images table with variants
- [ ] banks table (financing partners)
- [ ] profiles table (user profiles)

**Files:**
- `lib/db/schema/organizations.ts` - create
- `lib/db/schema/vehicle-pricing.ts` - create
- `lib/db/schema/vehicle-images.ts` - create
- `lib/db/schema/banks.ts` - create
- `lib/db/schema/profiles.ts` - create

**Tests:**
- [ ] Unit: All schemas compile
- [ ] Unit: Foreign key relationships correct

---

#### Task 3.4: Run Database Migrations
**Definition of Done:**
- [ ] Migration files generated
- [ ] Migrations applied to Supabase database
- [ ] Tables visible in Supabase dashboard

**Files:**
- `drizzle/migrations/` - create - generated migration files
- `package.json` - modify - add db:push and db:generate scripts

**Tests:**
- [ ] Integration: All tables created in database
- [ ] Integration: Indexes visible in Supabase

---

#### Task 3.5: Configure Supabase Storage
**Definition of Done:**
- [ ] Storage helper functions created
- [ ] getPublicImageUrl returns CDN URLs
- [ ] Path structure follows convention: vehicles/{brand}/{model}-{variant}-{type}.jpg

**Files:**
- `lib/supabase/storage.ts` - create - storage helpers

**Tests:**
- [ ] Unit: getPublicImageUrl generates correct URL format
- [ ] Integration: Can upload and retrieve test image

---

### Phase 4: Authentication

**Objective:** Implement secure authentication with Supabase SSR.

#### Task 4.1: Create Supabase Clients
**Definition of Done:**
- [ ] Browser client using createBrowserClient
- [ ] Server client using createServerClient with cookies
- [ ] Middleware client for session refresh

**Files:**
- `lib/supabase/client.ts` - create - browser client
- `lib/supabase/server.ts` - create - server client
- `lib/supabase/middleware.ts` - create - updateSession function

**Tests:**
- [ ] Unit: Browser client instantiates without error
- [ ] Unit: Server client accesses cookies correctly
- [ ] Integration: Session refresh works in middleware

---

#### Task 4.2: Create Auth Validation Schemas
**Definition of Done:**
- [ ] Login schema (email, password)
- [ ] Sign up schema (email, password, confirmPassword)
- [ ] Forgot password schema (email)
- [ ] Update password schema (password, confirmPassword)

**Files:**
- `lib/validation/auth.ts` - create - Zod schemas

**Tests:**
- [ ] Unit: Valid data passes validation
- [ ] Unit: Invalid email rejected
- [ ] Unit: Password mismatch rejected

---

#### Task 4.3: Build Login Page
**Definition of Done:**
- [ ] Login form with email/password
- [ ] Form validation with react-hook-form + Zod
- [ ] Server action for authentication
- [ ] Error handling and feedback
- [ ] Redirect to protected area on success

**Files:**
- `app/[locale]/auth/ingresar/page.tsx` - create - login page
- `app/[locale]/auth/actions.ts` - create - auth server actions

**Tests:**
- [ ] Unit: Form validates correctly
- [ ] Integration: Login with valid credentials succeeds
- [ ] Integration: Login with invalid credentials shows error
- [ ] E2E: Complete login flow works

---

#### Task 4.4: Build Sign Up Page
**Definition of Done:**
- [ ] Sign up form with email, password, confirm password
- [ ] Server action sends confirmation email
- [ ] Redirect to success page after submission

**Files:**
- `app/[locale]/auth/registrar/page.tsx` - create - sign up page
- `app/[locale]/auth/sign-up-success/page.tsx` - create - success page

**Tests:**
- [ ] Unit: Form validates password match
- [ ] Integration: Sign up triggers confirmation email
- [ ] E2E: Complete sign up flow works

---

#### Task 4.5: Build Password Reset Flow
**Definition of Done:**
- [ ] Forgot password page sends reset email
- [ ] Update password page handles reset token
- [ ] Both pages have proper validation and feedback

**Files:**
- `app/[locale]/auth/recuperar/page.tsx` - create - forgot password
- `app/[locale]/auth/actualizar-clave/page.tsx` - create - update password
- `app/[locale]/auth/error/page.tsx` - create - auth error page

**Tests:**
- [ ] Integration: Reset email sends correctly
- [ ] Integration: Password update with valid token succeeds
- [ ] Integration: Expired token shows error

---

#### Task 4.6: Implement Protected Route Middleware
**Definition of Done:**
- [ ] Middleware checks session for protected routes
- [ ] Unauthenticated users redirected to login
- [ ] Session available in protected Server Components

**Files:**
- `proxy.ts` - modify - add protected route logic
- `lib/supabase/middleware.ts` - modify - add route protection

**Tests:**
- [ ] Integration: Unauthenticated request to /protected redirects
- [ ] Integration: Authenticated request to /protected succeeds

---

### Phase 5: Layout & Navigation

**Objective:** Build the shell layout with responsive navigation.

#### Task 5.1: Create Root Layout with Providers
**Definition of Done:**
- [ ] Root layout wraps app with ThemeProvider
- [ ] Font configuration applied
- [ ] Metadata configured (title, description)

**Files:**
- `app/layout.tsx` - modify - complete root layout

**Tests:**
- [ ] Visual: Layout renders without errors
- [ ] Integration: Theme switching works

---

#### Task 5.2: Build Navbar Component
**Definition of Done:**
- [ ] Desktop navbar with logo, nav links, theme/language switchers
- [ ] Tablet variant with condensed navigation
- [ ] Mobile variant with hamburger menu
- [ ] Glassmorphic styling applied

**Files:**
- `components/layout/navbar/Navbar.tsx` - create - main navbar
- `components/layout/navbar/MobileMenu.tsx` - create - mobile drawer
- `components/layout/navbar/NavLinks.tsx` - create - navigation links

**Tests:**
- [ ] Visual: Desktop layout correct
- [ ] Visual: Mobile menu opens/closes
- [ ] Integration: Links navigate correctly

---

#### Task 5.3: Build Language Switcher
**Definition of Done:**
- [ ] Dropdown shows available locales
- [ ] Current locale highlighted
- [ ] Switching locale redirects to same page in new locale

**Files:**
- `components/layout/language-switcher.tsx` - create

**Tests:**
- [ ] Integration: Switching from es to en changes URL
- [ ] Integration: Page content updates to new locale

---

#### Task 5.4: Build Theme Switcher
**Definition of Done:**
- [ ] Toggle between light/dark modes
- [ ] Icon changes based on current theme
- [ ] Respects system preference initially

**Files:**
- `components/layout/theme-switcher.tsx` - create

**Tests:**
- [ ] Integration: Click toggles theme
- [ ] Integration: Theme persists on refresh

---

#### Task 5.5: Create Logo Component
**Definition of Done:**
- [ ] Logo renders at correct size
- [ ] Links to home page
- [ ] Responsive sizing for mobile

**Files:**
- `components/layout/Logo.tsx` - create

**Tests:**
- [ ] Visual: Logo displays correctly
- [ ] Integration: Click navigates to home

---

### Phase 6: Public Pages

**Objective:** Build all public-facing pages with glassmorphic design.

#### Task 6.1: Build Home Page
**Definition of Done:**
- [ ] Hero section with headline, subhead, CTA
- [ ] Features section highlighting key benefits
- [ ] Stats section with marketplace numbers
- [ ] Final CTA section

**Files:**
- `app/[locale]/page.tsx` - modify - complete home page

**Tests:**
- [ ] Visual: All sections render correctly
- [ ] Visual: Glassmorphic effects visible
- [ ] Integration: CTAs link to correct pages

---

#### Task 6.2: Build Pricing Page
**Definition of Done:**
- [ ] Two tier cards (Starter, Growth)
- [ ] Feature comparison table
- [ ] CTA buttons for each tier

**Files:**
- `app/[locale]/precios/page.tsx` - create - pricing page

**Tests:**
- [ ] Visual: Pricing cards display correctly
- [ ] Integration: CTA buttons work

---

#### Task 6.3: Build Vehicles Listing Page
**Definition of Done:**
- [ ] Vehicle grid with cards
- [ ] Filter sidebar (body type, range, price)
- [ ] Pagination
- [ ] Server-side data fetching

**Files:**
- `app/[locale]/vehiculos/page.tsx` - create - listing page
- `components/product/VehicleCard.tsx` - create - vehicle card
- `components/product/VehicleFilters.tsx` - create - filter sidebar

**Tests:**
- [ ] Integration: Vehicles load from database
- [ ] Integration: Filters update results
- [ ] Integration: Pagination works

---

#### Task 6.4: Build Vehicle Detail Page
**Definition of Done:**
- [ ] Image carousel with hero + thumbnails
- [ ] Key specs display
- [ ] Full specs accordion
- [ ] Seller cards with pricing
- [ ] Financing calculator tabs

**Files:**
- `app/[locale]/vehiculos/[slug]/page.tsx` - create - detail page
- `components/product/ImageCarousel.tsx` - create
- `components/product/VehicleKeySpecs.tsx` - create
- `components/product/VehicleAllSpecs.tsx` - create
- `components/product/SellerCard.tsx` - create
- `components/product/FinancingTabs.tsx` - create

**Tests:**
- [ ] Integration: Vehicle data loads by slug
- [ ] Visual: Image carousel functional
- [ ] Integration: Financing calculations correct

---

#### Task 6.5: Build Placeholder Pages
**Definition of Done:**
- [ ] Services page with "Coming Soon" structure
- [ ] Shop page with "Coming Soon" structure
- [ ] Used cars waitlist page with email capture

**Files:**
- `app/[locale]/servicios/page.tsx` - create
- `app/[locale]/tienda/page.tsx` - create
- `app/[locale]/autos-usados/lista-espera/page.tsx` - create

**Tests:**
- [ ] Visual: Pages render correctly
- [ ] Integration: Waitlist form submits

---

### Phase 7: Admin & Polish

**Objective:** Build admin dashboard and complete polish pass.

#### Task 7.1: Build Admin Dashboard
**Definition of Done:**
- [ ] Protected admin route
- [ ] Dashboard with key metrics
- [ ] Navigation to CRUD sections

**Files:**
- `app/[locale]/admin/page.tsx` - create - admin dashboard
- `app/[locale]/admin/layout.tsx` - create - admin layout

**Tests:**
- [ ] Integration: Only authenticated admins can access
- [ ] Visual: Dashboard displays metrics

---

#### Task 7.2: Complete Translation Files
**Definition of Done:**
- [ ] All UI strings translated to Spanish and English
- [ ] No missing translation warnings in console
- [ ] Consistent terminology across pages

**Files:**
- `messages/es.json` - modify - complete translations
- `messages/en.json` - modify - complete translations

**Tests:**
- [ ] Manual: No missing translation warnings
- [ ] Manual: Both locales display correctly

---

#### Task 7.3: Security Audit
**Definition of Done:**
- [ ] All dependencies scanned for vulnerabilities
- [ ] No secrets in codebase
- [ ] RLS policies reviewed
- [ ] Input validation on all forms

**Files:**
- No new files - review and audit

**Tests:**
- [ ] Manual: `bun audit` reports no critical issues
- [ ] Manual: .env files not in git history
- [ ] Manual: RLS policies active on all tables

---

### Phase 8: Analytics & Deployment

**Objective:** Add analytics and deploy to production.

#### Task 8.1: Integrate PostHog
**Definition of Done:**
- [ ] PostHog client SDK configured
- [ ] Server-side tracking available
- [ ] Page views tracked automatically
- [ ] Key events defined (signup, login, vehicle_view)

**Files:**
- `lib/posthog/client.ts` - create - client provider
- `lib/posthog/server.ts` - create - server client
- `app/layout.tsx` - modify - add PostHog provider

**Tests:**
- [ ] Integration: Page views appear in PostHog
- [ ] Integration: Custom events tracked

---

#### Task 8.2: Configure Coolify Deployment
**Definition of Done:**
- [ ] Deployment configuration documented
- [ ] Environment variables set in Coolify
- [ ] Build and start commands verified

**Files:**
- No code files - Coolify dashboard configuration

**Tests:**
- [ ] Integration: Deploy succeeds
- [ ] Integration: Production site accessible

---

#### Task 8.3: Production Environment Setup
**Definition of Done:**
- [ ] All production env vars configured
- [ ] Database connection pooling verified
- [ ] Storage CDN working
- [ ] SSL/TLS configured

**Files:**
- No code files - infrastructure verification

**Tests:**
- [ ] Manual: All features work in production
- [ ] Manual: No console errors
- [ ] Manual: Performance acceptable

---

## Context

### Relevant Patterns from Legacy

1. **Supabase Client Pattern:**
   - Always create fresh client instance in functions (no global)
   - Use `createBrowserClient` for client, `createServerClient` for server
   - Handle cookie setting errors gracefully in Server Components

2. **i18n Routing Pattern:**
   - Use `defineRouting` with `localePrefix: "as-needed"`
   - Export navigation helpers from routing.ts
   - Call `setRequestLocale` in layout before rendering

3. **Proxy Pattern (proxy.ts):**
   - Combine Supabase session refresh with i18n routing in `proxy.ts`
   - Transfer cookies between response objects
   - Use matcher to skip static files
   - Note: Next.js 16 uses `proxy.ts` instead of deprecated `middleware.ts`

4. **Schema Pattern:**
   - One file per domain entity
   - Use `$type<>` for TypeScript enum types
   - Define indexes in table callback

### Related Files

- `legacy/app/[locale]/layout.tsx` - Locale layout with NextIntlClientProvider
- `legacy/lib/supabase/server.ts` - Server client with cookie handling
- `legacy/proxy.ts` - Combined middleware pattern
- `legacy/i18n/routing.ts` - Full pathnames configuration
- `legacy/lib/db/schema/vehicles.ts` - Complete vehicle schema with JSONB

### Gotchas

1. **Next.js 16 Params:** Route params are now `Promise<{ locale: string }>` - must await
2. **Supabase Cookie Errors:** `setAll` throws in Server Components - catch and ignore
3. **Drizzle Numeric:** Use `.$type<number>()` to override string inference
4. **next-intl Static Params:** Must export `generateStaticParams` in locale layout
5. **Tailwind v4:** No tailwind.config.js - use @theme in CSS
6. **PostHog SSR:** Initialize differently for server vs client
7. **Proxy Ordering:** In `proxy.ts`, Supabase session refresh MUST run before i18n routing

---

## Review

**Rating: 7/10**

**Verdict: NEEDS WORK**

### Summary
Comprehensive and well-structured roadmap with strong security intent, but a few execution-spec inaccuracies (middleware + route naming) and missing test tooling make it risky to treat as the source of truth without a quick polish pass.

### Findings

#### Blockers (must fix)
- [ ] Clarify the middleware approach: Task 2.2 references `proxy.ts` plus “enable middleware” in `next.config.ts`, but Next’s convention is `middleware.ts` at repo root (or document the indirection explicitly) - `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md:436`
- [ ] Align route/directory naming across docs: roadmap uses Spanish `/vehiculos` routes but `ARCHITECTURE.md`’s target tree uses `app/[locale]/vehicles/` - `ARCHITECTURE.md:67`

#### High Priority
- [ ] Define the testing stack and scripts (roadmap repeatedly calls for Unit/Integration/E2E checks, but the repo currently has no `test` script/runner) - `package.json:5`
- [ ] Sync roadmap progress with current repo state: `ARCHITECTURE.md` exists, but the “Architecture Documentation” checkbox is still unchecked - `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md:45`

#### Medium Priority
- [ ] Expand “Security Considerations” to include baseline HTTP security headers/CSP guidance (especially important post-incident) - `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md:197`
- [ ] Consider dropping `dotenv` from the “Required new packages” list unless there’s a concrete need (Next loads `.env*` natively) - `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md:303`

#### Low Priority / Nits
- [ ] Consider adding a brief “Docs are living” note explaining whether checkboxes represent current progress or planned scope (to avoid ambiguity when tasks complete) - `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md:42`

### Test Assessment
- Coverage: Needs improvement (no test harness defined yet)
- Missing tests: N/A for this document; define tooling first, then ensure each phase’s “Unit/Integration/E2E” items map to runnable commands

### What's Good
- Clear phased build order and parity-focused scope
- Security-first defaults (fresh credentials, RLS emphasis, input validation, dependency review)
- Useful “Gotchas” section that anticipates Next/Supabase/Drizzle pitfalls

### Recommendations
- Update Task 2.2 to match the intended middleware file/location and remove references to “enabling middleware” in `next.config.ts` unless you truly need config changes.
- Align the target route naming (`vehiculos`) consistently across the roadmap, architecture doc tree, and eventual `pathnames` mapping.
- Choose and document a test stack now (e.g., `vitest` for unit/integration + `@playwright/test` for E2E), add `test` scripts, then keep the roadmap test checklists tied to those scripts.
