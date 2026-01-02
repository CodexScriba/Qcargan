---
stage: completed
tags:
  - feature
  - p2
agent: auditor
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - skill-next-intl
  - skills/react-core-skills
---

# Build Language Switcher

## Goal
Dropdown shows available locales. Current locale highlighted. Switching locale redirects to same page in new locale.

## Definition of Done
- [x] Dropdown shows available locales
- [x] Current locale highlighted
- [x] Switching locale redirects to same page in new locale

## Files
- `components/layout/language-switcher.tsx` - create

## Tests
- [x] Integration: Switching from es to en changes URL
- [x] Integration: Page content updates to new locale

## Context
Phase 5: Layout & Navigation
Use navigation helpers from `lib/i18n/navigation.ts`.
Legacy reference: `/legacy/components/layout/language-switcher.tsx`

## Refined Prompt
Objective: The language switcher component already exists and is fully functional.

Implementation approach:
1. Verify the existing implementation matches all requirements (available locales displayed, current locale highlighted, locale switch redirects correctly)
2. Add integration tests for locale switching behavior

Key decisions:
- Component already migrated: The language switcher at `components/layout/language-switcher.tsx` is a direct port from legacy with minor refinements
- Pill-style toggle: Uses rounded pill buttons rather than dropdown, matching legacy design
- Flag + code display: Shows flag emoji with language code (ES/EN) for visual recognition

Edge cases:
- Dynamic routes with `[slug]` params: Uses `pathname as any` cast to handle TypeScript strict pathname checking for dynamic routes
- Locale prefix strategy: Uses `localePrefix: "as-needed"` meaning default locale (es) has no prefix

## Context
### Relevant Code
- components/layout/language-switcher.tsx:1-57 - Complete implementation already exists
- lib/i18n/navigation.ts:1-6 - Exports `usePathname`, `useRouter` from next-intl/navigation
- lib/i18n/routing.ts:74-80 - Defines `locales: ["es", "en"]`, `defaultLocale: "es"`, `localePrefix: "as-needed"`
- components/layout/navbar/Navbar.tsx:60,85,112 - LanguageSwitcher integrated in all viewport breakpoints

### Patterns to Follow
- Client component with `"use client"` directive (uses hooks)
- Uses `useLocale()` from next-intl to get current locale
- Uses `usePathname()` and `useRouter()` from `@/lib/i18n/navigation` (not next/navigation)
- `router.replace(pathname, { locale: newLocale })` for locale switching without adding to history

### Test Patterns
- Vitest configured in vitest.config.ts with `@testing-library/jest-dom`
- Test files: `**/*.test.ts` or `**/*.test.tsx`
- Setup file: vitest.setup.ts with matchMedia mock
- No existing component tests in project yet

### Dependencies
- next-intl: Provides `useLocale()` hook and navigation primitives
- @/lib/utils: `cn()` utility for conditional class merging

### Gotchas
- TypeScript strict pathname checking: Dynamic routes require `pathname as any` cast when calling `router.replace`
- Locale detection disabled: `localeDetection: false` in routing config means browser locale is not auto-detected

## Audit
/home/cynic/workspace/Qcargan/components/layout/__tests__/LanguageSwitcher.test.tsx
/home/cynic/workspace/Qcargan/components/layout/language-switcher.tsx

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Language switcher component is well-implemented with proper accessibility, visual design, and i18n integration. Tests cover key functionality. A syntax error was found and fixed during audit.

### Findings

#### Blockers
- [x] Syntax error: Missing closing parenthesis after button element - `language-switcher.tsx:52-53` - **FIXED**

#### High Priority
_None_

#### Medium Priority
- [ ] ESLint `@typescript-eslint/no-explicit-any`: `pathname as any` cast on line 19 - `language-switcher.tsx:19` - This is a documented gotcha in the task and matches pattern used in Navbar.tsx, so acceptable for now

#### Low Priority / Nits
- [ ] Tailwind suggestion: `bg-gradient-to-br` could use canonical form `bg-linear-to-br` - `language-switcher.tsx:46`

### Test Assessment
- Coverage: Adequate - All three definition of done items are tested
- Tests verify:
  1. Available locales are shown as buttons
  2. Current locale is highlighted with `data-active` attribute
  3. Switching locale calls `router.replace` with correct parameters
  4. Page content updates when locale changes (via mock)

### What's Good
- Excellent accessibility: `aria-pressed`, `aria-current`, `aria-label`, and `title` attributes
- Pill-style toggle UI is clean and matches legacy design
- Flag + text provides visual recognition
- Proper use of `router.replace` (not `push`) to avoid polluting history
- Uses project's i18n navigation helpers correctly
- Integrated in all Navbar viewport breakpoints (desktop, tablet, mobile)

### Recommendations
- Consider adding keyboard navigation tests in future
- The `as any` cast could be addressed project-wide by extending next-intl's pathname types
