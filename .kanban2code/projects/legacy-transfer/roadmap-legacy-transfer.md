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

## Features to Rebuild

### Architecture Documentation
- [ ] ARCHITECTURE.md (project northstar, tech stack, file tree, integrations, deployment)

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
