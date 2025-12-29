---
stage: completed
tags:
  - feature
  - p2
agent: 06-✅auditor
contexts:
  - ai-guide
  - _context/skills/skill-next-intl.md
parent: roadmap-legacy-transfer
---

# Define Localized Route Pathnames

## Goal
All 40+ routes defined in pathnames object. Spanish paths use Spanish words (vehiculos, precios, etc.). Navigation helpers exported (Link, redirect, usePathname, useRouter).

## Definition of Done
- [x] All 40+ routes defined in pathnames object
- [x] Spanish paths use Spanish words (vehiculos, precios, etc.)
- [x] Navigation helpers exported (Link, redirect, usePathname, useRouter)

## Files
- `lib/i18n/routing.ts` - modify - add all pathnames

## Tests
- [x] Unit: getPathname returns correct localized path
- [x] Integration: Link component generates correct href

## Context
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/i18n/routing.ts`

## Refined Prompt
Objective: Migrate all 40+ routes from legacy routing.ts to lib/i18n/routing.ts with Spanish pathnames.

Implementation approach:
1. Copy all pathnames from legacy/i18n/routing.ts to lib/i18n/routing.ts
2. Ensure Spanish paths use Spanish words (vehiculos, precios, etc.)
3. Verify navigation helpers are exported from lib/i18n/navigation.ts

Key decisions:
- Keep routes without Spanish translations as-is (e.g., /cars, /services/*, /shop/*)
- Maintain the same structure and ordering as legacy file
- Use localePrefix: "as-needed" (already configured)

Edge cases:
- Dynamic routes with [slug] must preserve the bracket syntax in both locales
- Routes without Spanish translations should use the same path for both en and es (string literal)
- Admin route (/admin) exists in legacy pathnames but has no corresponding file in legacy/app/[locale]/ - verify if needed

## Context
### Relevant Code
- legacy/i18n/routing.ts:6-74 - Complete pathnames object with 40+ routes
- lib/i18n/routing.ts:1-13 - Current routing with only "/" defined
- lib/i18n/navigation.ts:1-6 - Navigation helpers already exported

### Patterns to Follow
- Use object syntax for localized routes: `"/path": { en: "/en-path", es: "/es-path" }`
- Use string literal for shared routes: `"/path": "/path"`
- Preserve dynamic route syntax: `"/vehicles/[slug]": { en: "/vehicles/[slug]", es: "/vehiculos/[slug]" }`

### Test Patterns
- Tests use vitest with @testing-library/react
- Mock next-intl functions in tests (see app/[locale]/__tests__/layout.test.tsx:8-30)
- Translation tests verify en and es have matching keys (messages/__tests__/translations.test.ts:32-40)

### Dependencies
- next-intl/routing - defineRouting
- next-intl/navigation - createNavigation (already used in navigation.ts)

### Gotchas
- Pathnames must be typed as const for TypeScript inference
- Dynamic routes with [slug] cannot be pre-computed in publicLocalePaths (legacy/i18n/routing.ts:95)
- Ensure pathnames object is properly typed for PathnameKey export if needed

## Audit
- lib/i18n/routing.ts
- lib/i18n/__tests__/routing.test.ts

---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
All pathnames have been correctly migrated from legacy to `lib/i18n/routing.ts`, preserving the structure and Spanish localizations (e.g., `/vehiculos`, `/precios`). Tests verify that `getPathname` resolves correctly for both locales.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] None

#### Medium Priority
- [ ] None

#### Low Priority / Nits
- [ ] None

### Test Assessment
- Coverage: Good. `lib/i18n/__tests__/routing.test.ts` covers key scenarios (localized paths, shared paths, prefixes).
- Missing tests: None.

### What's Good
- Complete migration of route definitions.
- Unit tests added to verify routing logic explicitly.

### Recommendations
- None.