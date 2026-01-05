---
stage: completed
agent: auditor
tags:
  - feature
  - p1
contexts:
  - architecture
  - ai-guide
skills:
  - nextjs-core-skills
  - skill-design-system
  - skill-next-intl
---

# Create landing page

It must be a single hero section. 
it must use @globals.css 
It must have a single CTA to sing-up
It must include an image, you must provide a description of image so I can generate it. 

## Definition of Done
- [x] `app/[locale]/page.tsx` renders a single hero section using `card-container` and `btn-primary`
- [x] Hero includes a single CTA linking to `/auth/sign-up` via `@/lib/i18n/navigation`
- [x] Hero includes a right-side image (hidden on mobile) with accessible alt text
- [x] English + Spanish translations exist for hero content
- [x] `bun run test` and `bun run build` pass

## Refined Prompt
Objective: Create a landing page at `app/[locale]/page.tsx` with a single hero section promoting the QueCargan EV platform.

Implementation approach:
1. Create `app/[locale]/page.tsx` as a server component with async params
2. Use design system's visual hierarchy: background → card-container → content
3. Implement a hero section with:
   - Headline and subheadline using `getTranslations` from next-intl/server
   - Single CTA button linking to `/auth/sign-up` using `Link` from `@/lib/i18n/navigation`
   - Hero image on the right side (hidden on mobile)
4. Add translation keys to `messages/en.json` and `messages/es.json` for hero content
5. Provide an image description for AI generation (EV charging station or futuristic EV scene)

Key decisions:
- Use card-container pattern for hero section to maintain design system consistency
- Hero image should be right-aligned on desktop, hidden on mobile (similar to auth page pattern)
- CTA button should use `btn-primary` class with gradient styling
- Dark mode is primary design target (as per design system)

Edge cases:
- Mobile responsiveness: image should be hidden on small screens, text should be centered
- Ensure proper contrast for accessibility (WCAG AA minimum)
- Handle both English and Spanish translations

## Questions
- What specific EV-related imagery should be featured? (e.g., charging station, modern EV, futuristic cityscape)
- Should hero include any social proof elements (e.g., "Trusted by 10,000+ EV owners") or keep it minimal?

## Context
### Relevant Code
- [`app/[locale]/auth/sign-up/page.tsx`](app/[locale]/auth/sign-up/page.tsx:1) - Reference for layout pattern (left content, right image)
- [`app/globals.css`](app/globals.css:1) - Design system with card-container, btn-primary, and color variables
- [`components/layout/navbar/Navbar.tsx`](components/layout/navbar/Navbar.tsx:1) - Shows Link usage from `@/lib/i18n/navigation`
- [`lib/i18n/routing.ts`](lib/i18n/routing.ts:1) - Routing configuration with locales (es, en)
- [`messages/en.json`](messages/en.json:1) - Existing translation structure (add Home.hero keys)

### Patterns to Follow
- Server component pattern: `export default async function Page({ params }: { params: Promise<{ locale: string }> })`
- Use `setRequestLocale(locale)` before translations
- Use `getTranslations('Home.hero')` for hero content
- Card container with glassmorphism: `<div className="card-container rounded-3xl">`
- Button pattern: `<Button className="btn-primary">` with Link wrapper

### Test Patterns
- Look at `components/__tests__/` for component testing patterns
- Use Vitest/Playwright for testing (see `skill-vitest-playwright-testing.md`)

### Dependencies
- next-intl: For i18n translations (`getTranslations` from `next-intl/server`)
- @/lib/i18n/navigation: For localized Link component
- Lucide React: For icons (if needed, e.g., ArrowRight in CTA)
- globals.css: For design system classes (card-container, btn-primary)

### Gotchas
- Next.js 16: params must be typed as `Promise<{ locale: string }>` and awaited
- Always call `setRequestLocale(locale)` before using `getTranslations`
- Use `Link` from `@/lib/i18n/navigation`, not `next/link`, for localized routes
- Dark mode is default - ensure colors work in dark mode first, then test light mode
- Card-container requires proper padding and border-radius for glassmorphism effect

## Image Description for AI Generation
**Subject:** A sleek, modern electric vehicle (SUV or sedan) parked at a futuristic charging station.
**Setting:** Dusk or "blue hour" with a blurred smart city skyline in the background.
**Lighting:** Cool ambient lighting (cyan, teal, electric blue) matching the "Liquid Glass Lagoon" palette. Soft glow from the charging port and station.
**Style:** Photorealistic, high definition, cinematic composition.
**Mood:** Clean, sustainable, premium, high-tech.
**Composition:** Right-aligned subject to allow space for text on the left.

## Audit
- app/[locale]/page.tsx
- app/[locale]/__tests__/page.test.tsx
- app/auth/callback/__tests__/route.test.ts
- lib/supabase/client.ts
- messages/en.json
- messages/es.json
- vitest.config.ts
