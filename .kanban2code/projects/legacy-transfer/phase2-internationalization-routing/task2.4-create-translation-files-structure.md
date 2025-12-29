---
stage: completed
tags:
  - chore
  - p2
agent: 06-✅auditor
contexts:
  - ai-guide
  - _context/skills/skill-next-intl.md
parent: roadmap-legacy-transfer
---

# Create Translation Files Structure

## Goal
`messages/es.json` created with base structure. `messages/en.json` created with same structure. Common namespaces defined (common, auth, nav, vehicles).

## Definition of Done
- [x] `messages/es.json` created with base structure
- [x] `messages/en.json` created with same structure
- [x] Common namespaces defined (common, auth, nav, vehicles)

## Files
- `messages/es.json` - create - Spanish translations
- `messages/en.json` - create - English translations
- `i18n.ts` - modify - Update import path from `./legacy/messages/` to `./messages/`

## Tests
- [x] Unit: JSON files parse without errors
- [x] Unit: Both files have matching keys

## Context
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/messages/`

## Refined Prompt
Objective: Create root-level translation files with base structure and update import path

Implementation approach:
1. Create `messages/en.json` with base namespaces (common, auth, nav, vehicles) extracted from legacy structure
2. Create `messages/es.json` with identical structure and Spanish translations
3. Update [`i18n.ts:14`](i18n.ts:14) to import from `./messages/` instead of `./legacy/messages/`

Key decisions:
- Namespace structure: Use flat JSON with nested objects for organization (matches legacy pattern)
- Source of truth: Extract from [`legacy/messages/en.json`](legacy/messages/en.json:1) and [`legacy/messages/es.json`](legacy/messages/es.json:1)
- Import path change: Required to use new root-level messages directory

Edge cases:
- Missing translations in legacy files: Use empty string or English fallback
- Nested vs flat structure: Maintain nested object structure for readability
- Pluralization: Preserve ICU message format from legacy (e.g., `{count, plural, ...}`)

## Context
### Relevant Code
- [`legacy/messages/en.json`](legacy/messages/en.json:1) - Source for English translations with namespaces: Metadata, Navigation, Navbar, Home, Pricing, auth, vehicle, sellerCard, agencyCard, seo, common
- [`legacy/messages/es.json`](legacy/messages/es.json:1) - Source for Spanish translations with identical structure
- [`i18n.ts:14`](i18n.ts:14) - Currently imports from `./legacy/messages/${resolvedLocale}.json`
- [`lib/i18n/request.ts:15`](lib/i18n/request.ts:15) - Uses `getMessages()` to load translations
- [`lib/i18n/routing.ts:4`](lib/i18n/routing.ts:4) - Defines locales: ["es", "en"], defaultLocale: "es"

### Patterns to Follow
- Namespace organization: Use nested objects (e.g., `auth.login.title`)
- Key naming: camelCase for consistency (e.g., `displayNameHelp`, `submitting`)
- Pluralization: ICU format with `{count, plural, =0 {...} one {...} other {...}}`
- Error handling: Fallback to defaultLocale if locale not found (see [`i18n.ts:16-17`](i18n.ts:16-17))

### Test Patterns
- JSON validation: Ensure files parse without syntax errors
- Key matching: Verify both en.json and es.json have identical key structure
- No existing i18n test file in project - create new test file following pattern from [`legacy/tests/identifiers.test.ts`](legacy/tests/identifiers.test.ts:1)

### Dependencies
- next-intl: Used for i18n routing and message loading
- TypeScript: Type safety for locale resolution

### Gotchas
- Import path change: Must update both the dynamic import in [`i18n.ts:14`](i18n.ts:14) and fallback path at line 17
- Locale order: Default locale is "es" (Spanish), ensure Spanish file is complete
- ICU pluralization: Must preserve exact format from legacy files for proper plural handling
- File location: Create in root `messages/` directory, not `legacy/messages/`

## Audit
- messages/en.json
- messages/es.json
- i18n.ts
- messages/__tests__/translations.test.ts

---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The translation files have been successfully created and linked. Both English and Spanish files share the same structure and contain the required namespaces. Tests pass, confirming JSON validity and key parity.

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
- Coverage: Adequate. `messages/__tests__/translations.test.ts` validates parsing and key structure.
- Missing tests: None.

### What's Good
- Translation structure matches legacy while being correctly placed in the root `messages/` folder.
- `i18n.ts` updated to import from the correct location.
- Added tests prevent drift between locale files.

### Recommendations
- None.