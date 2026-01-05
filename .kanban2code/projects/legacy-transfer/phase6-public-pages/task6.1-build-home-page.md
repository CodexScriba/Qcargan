---
stage: completed
tags:
  - feature
  - p1
  - shipped
agent: "06-✅auditor"
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - react-core-skills
  - skill-tailwindcss-v4
---

# Build Landing Page

## Goal
Simple hero section with headline, subheading, and dual CTAs (Sign up / Login). MVP landing page to validate infrastructure before building marketplace features.

## Definition of Done
- [x] Hero section with headline and subheading
- [x] Two CTAs: Sign up (primary) and Login (secondary)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Translations in Spanish and English
- [x] Builds and runs without errors

## Files
- `app/[locale]/page.tsx` - modify - hero landing page
- `messages/es.json` - modify - add Home translations
- `messages/en.json` - modify - add Home translations

## Tests
- [x] Visual: Hero section renders correctly
- [x] Integration: Sign up CTA links to `/auth/sign-up`
- [x] Integration: Login CTA links to `/auth/login`
- [x] Build: `bun run build` succeeds
- [ ] Manual: Test both Spanish (/es) and English (/en) locales

## Context
Phase 6: Public Pages (Simplified MVP)
This is a minimal landing page focused on getting to production quickly. Full marketplace features deferred to separate roadmap (Phase 9).

## Implementation Notes
- Hero uses gradient text and simple layout for visual impact
- Buttons use shadcn/ui Button component with i18n Link navigation
- Translations use Home.heroTitle, Home.heroSubtitle, Home.cta.signup, Home.cta.login keys
- Spanish paths: `/` (home), `/auth/registrar` (sign up), `/auth/ingresar` (login)
- English paths: `/en` (home), `/en/auth/sign-up` (sign up), `/en/auth/login` (login)
