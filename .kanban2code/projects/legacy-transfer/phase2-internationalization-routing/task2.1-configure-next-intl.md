---
stage: completed
created: 2025-12-28T00:00:00.000Z
agent: auditor
tags: [feature, p1]
contexts: [ai-guide, skills/skill-next-intl, skills/skill-vitest-playwright-testing]
---

# Configure next-intl

## Goal
next-intl package configured. Locales defined: es (default), en. Locale prefix strategy: as-needed (no prefix for Spanish). Locale detection disabled.

## Definition of Done
- [x] next-intl package configured
- [x] Locales defined: es (default), en
- [x] Locale prefix strategy: as-needed (no prefix for Spanish)
- [x] Locale detection disabled

## Files
- `lib/i18n/routing.ts` - create - defineRouting configuration
- `lib/i18n/request.ts` - create - getRequestConfig for SSR
- `i18n.ts` - create - root i18n config with getMessages helper

## Tests
- [x] Unit: routing.locales contains ["es", "en"]
- [x] Unit: routing.defaultLocale equals "es"

## Audit
- i18n.ts
- lib/i18n/navigation.ts
- lib/i18n/request.ts
- lib/i18n/routing.test.ts
- lib/i18n/routing.ts

## Context
Phase 2: Internationalization & Routing
Spanish is default, English secondary.
Legacy reference: `/legacy/i18n/`

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The next-intl configuration is correctly implemented according to the specifications. Locales are set up with 'es' as default and 'as-needed' prefixing.

### Findings

#### Blockers
None.

#### High Priority
None.

#### Medium Priority
None.

#### Low Priority / Nits
None.

### Test Assessment
- Coverage: Adequate. Unit tests cover routing configuration.
- Missing tests: None for this configuration-focused task.

### What's Good
- Clean separation of concerns with `navigation.ts`, `routing.ts`, and `request.ts`.
- Proper use of `hasLocale` for validation.
- Successfully integrates with legacy messages as a fallback/interim solution.

### Recommendations
None.


## Refined Prompt
Objective: Configure next-intl v4 with es default, en secondary, as-needed prefix, detection disabled.

Implementation approach:
1. Create `lib/i18n/routing.ts` with defineRouting config (locales: ["es", "en"], defaultLocale: "es", localePrefix: "as-needed", localeDetection: false)
2. Create `lib/i18n/navigation.ts` exporting Link, redirect, usePathname, useRouter, getPathname from createNavigation(routing)
3. Create `lib/i18n/request.ts` with getRequestConfig for SSR locale resolution
4. Create root `i18n.ts` exporting Locale type, defaultLocale, and getMessages helper

Key decisions:
- Use `lib/i18n/` folder to match task spec (not `src/i18n/`)
- Separate navigation.ts from routing.ts for cleaner imports (legacy combines them but separation is cleaner)
- Use hasLocale from next-intl for validation (modern pattern)
- Pathnames object left minimal (just "/" for now) since pathnames are defined in later tasks

Edge cases:
- Invalid locale in requestLocale falls back to "es" (defaultLocale)
- getMessages returns es.json for unknown locale fallback

## Context
### Relevant Code
- legacy/i18n/routing.ts:76-82 - defineRouting config with locales, defaultLocale, localePrefix, localeDetection
- legacy/i18n/routing.ts:84-85 - createNavigation exports
- legacy/i18n/request.ts:1-16 - getRequestConfig pattern with locale resolution
- legacy/i18n.ts:1-14 - Locale type and getMessages helper
- legacy/messages/en.json - English translations (migrate later)
- legacy/messages/es.json - Spanish translations (migrate later)

### Patterns to Follow
- Use `as const` for locales array to enable type inference
- Export `Locale` type derived from routing.locales
- Use hasLocale for locale validation in request.ts
- Import from `@/lib/i18n/routing` alias for internal imports

### Test Patterns
- Tests go in co-located `*.test.ts` files (see lib/env.test.ts:7-53)
- vitest.config.ts excludes legacy/** and node_modules
- Use describe/test/expect from vitest
- lib/i18n/routing.test.ts for unit tests on routing.locales and routing.defaultLocale

### Dependencies
- next-intl@4.6.1: defineRouting, createNavigation, getRequestConfig, hasLocale
- next@16.0.10: App Router with Promise-based params

### Gotchas
- Do not use createSharedPathnamesNavigation (deprecated in v4)
- Do not import from next-intl/client (deprecated)
- localeDetection: false is critical to prevent Accept-Language header sniffing
