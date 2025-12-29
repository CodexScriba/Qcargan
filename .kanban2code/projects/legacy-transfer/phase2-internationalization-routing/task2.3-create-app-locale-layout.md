---
stage: completed
tags:
  - feature
  - p1
agent: 06-✅auditor
contexts:
  - ai-guide
  - _context/skills/skill-next-intl.md
  - _context/skills/skill-routing-layouts.md
parent: roadmap-legacy-transfer
---

# Create App Locale Layout

## Goal
`app/[locale]/layout.tsx` created. NextIntlClientProvider wraps children. setRequestLocale called for static generation. generateStaticParams exports all locales.

## Definition of Done
- [x] `app/[locale]/layout.tsx` created
- [x] NextIntlClientProvider wraps children
- [x] setRequestLocale called for static generation
- [x] generateStaticParams exports all locales

## Files
- `app/[locale]/layout.tsx` - create - locale layout with provider
- `app/[locale]/page.tsx` - create - placeholder home page

## Tests
- [x] Unit: Layout renders with valid locale
- [x] Unit: Invalid locale triggers notFound()
- [x] Integration: Messages available in client components

## Context
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/app/[locale]/layout.tsx`

## Refined Prompt
Objective: Create locale-aware layout with NextIntlClientProvider for Next.js 16 App Router

Implementation approach:
1. Create `app/[locale]/layout.tsx` following legacy pattern with async params
2. Add `generateStaticParams()` to export all locales from routing
3. Validate locale using `hasLocale()` from next-intl, call `notFound()` on invalid
4. Call `setRequestLocale(locale)` before fetching messages
5. Wrap children with `NextIntlClientProvider` passing locale and messages
6. Preserve existing root layout structure (ThemeProvider, Poppins font) by nesting appropriately
7. Create `app/[locale]/page.tsx` placeholder with useTranslations hook

Key decisions:
- Use `Promise<{ locale: string }>` type for params: Next.js 16 params are Promises
- Use `hasLocale()` for validation instead of direct array includes: more robust type checking
- Preserve ThemeProvider from root layout: ThemeProvider should remain in root, locale layout wraps children
- Import messages from `@/i18n/getMessages`: centralized message loading function

Edge cases:
- Invalid locale parameter should trigger notFound() with 404
- Missing locale in params should be handled by awaiting params first
- Messages import failure should fall back to defaultLocale messages

## Context
### Relevant Code
- `legacy/app/[locale]/layout.tsx:1-38` - Reference implementation with NextIntlClientProvider, setRequestLocale, generateStaticParams
- `lib/i18n/routing.ts:3-11` - Routing configuration with locales ["es", "en"], defaultLocale "es"
- `lib/i18n/request.ts:7-16` - Request config pattern using hasLocale for validation
- `i18n.ts:8-22` - getMessages function imports from legacy/messages, handles fallback
- `app/layout.tsx:18-36` - Root layout with ThemeProvider and Poppins font to preserve

### Patterns to Follow
- Async params: Type params as `Promise<{ locale: string }>` and await before use
- Locale validation: Use `hasLocale(routing.locales, locale)` from next-intl
- Static params: Return array of objects `[{ locale }]` from generateStaticParams
- Provider wrapping: NextIntlClientProvider receives locale and messages props
- notFound() usage: Call when locale validation fails

### Test Patterns
- Unit tests in `components/__tests__/` use Vitest with @testing-library/react
- Test rendering with valid locale: render layout and check children present
- Test invalid locale: mock params with invalid locale, verify notFound called
- Integration test: create client component using useTranslations, verify messages available

### Dependencies
- next-intl: NextIntlClientProvider, setRequestLocale, getMessages, hasLocale
- next/navigation: notFound for invalid locale handling
- @/i18n: getMessages function for message loading
- @/lib/i18n/routing: routing.locales for generateStaticParams

### Gotchas
- Next.js 16 params are Promises: must await before accessing locale property
- hasLocale() vs includes(): hasLocale is type-safe, includes may bypass type checking
- ThemeProvider placement: keep in root layout, don't duplicate in locale layout
- generateStaticParams return format: must return array of objects, not array of strings
- setRequestLocale timing: must call before any server-side translation or getMessages

## Audit
- app/[locale]/page.tsx
- app/[locale]/__tests__/page.test.tsx

---

## Review

**Rating: 6/10**

**Verdict: NEEDS WORK**

### Summary
Locale layout wiring looks correct, but the client home page uses `use()` with params, which will likely throw at runtime.

### Findings

#### Blockers
- [ ] Client page calls `use(params)` where `params` is not a supported thenable/context in the browser; Next passes resolved params to client components, so this can crash at runtime - `app/[locale]/page.tsx:11`

#### High Priority
- [ ] None

#### Medium Priority
- [ ] None

#### Low Priority / Nits
- [ ] None

### Test Assessment
- Coverage: Adequate for layout behavior; page test mocks `use()` but doesn't reflect runtime behavior
- Missing tests: None required for this fix, but an integration render of the client page would catch the params issue

### What's Good
- `setRequestLocale` is called before messages are loaded, and `hasLocale` + `notFound` are used correctly in the layout.

### Recommendations
- Convert `app/[locale]/page.tsx` to a server component that awaits params and calls `setRequestLocale`, or keep it client and accept `params` as a plain object without `use()`.

---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The issues identified in the previous review have been resolved. `app/[locale]/page.tsx` is now a Server Component that correctly awaits `params`, calls `setRequestLocale`, and uses translations. Missing "Home" translations were added to message files.

### Findings

#### Blockers
- [x] Client page calls `use(params)` - Fixed: Converted to Server Component and awaits params.

#### High Priority
- [ ] None

#### Medium Priority
- [ ] None

#### Low Priority / Nits
- [ ] None

### Test Assessment
- Coverage: Adequate.
- Missing tests: None.

### What's Good
- Correct use of Server Components patterns for Next.js 16.
- Added missing translations to ensure clean rendering.

### Recommendations
- None.