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
  - react-core-skills
  - skill-tailwindcss-v4
  - skill-vitest-playwright-testing
---

# Build Theme Switcher

## Goal
Toggle between light/dark modes. Icon changes based on current theme. Respects system preference initially.

## Definition of Done
- [x] Toggle between light/dark modes
- [x] Icon changes based on current theme
- [x] Respects system preference initially

## Files
- `components/layout/theme-switcher.tsx` - create

## Tests
- [x] Integration: Click toggles theme
- [x] Integration: Theme persists on refresh

## Context
Phase 5: Layout & Navigation
Legacy reference: `/legacy/components/layout/theme-switcher.tsx`
Ensure no hydration mismatch by using `mounted` state.

## Refined Prompt
Objective: Implement a theme switcher component that toggles between light/dark modes with proper hydration handling and system preference detection.

Implementation approach:
1. Review existing [`components/layout/theme-switcher.tsx`](components/layout/theme-switcher.tsx:1) implementation
2. Compare with legacy reference [`legacy/components/layout/theme-switcher.tsx`](legacy/components/layout/theme-switcher.tsx:1) to identify any missing features
3. Ensure [`mounted`](components/layout/theme-switcher.tsx:9) state prevents hydration mismatch
4. Verify icon switching logic using [`resolvedTheme`](components/layout/theme-switcher.tsx:10) from `next-themes`
5. Create integration tests for click toggle and persistence

Key decisions:
- Use `mounted` state pattern: Prevents hydration mismatch by rendering skeleton before client hydration completes
- Use `resolvedTheme` over `theme`: Ensures correct theme detection when theme is "system"
- Skeleton placeholder: Returns pulsing placeholder during SSR/hydration to maintain layout stability

Edge cases:
- SSR/hydration mismatch: Component must not render theme-dependent UI until mounted
- System preference changes: `resolvedTheme` handles system preference updates automatically
- Theme persistence: `next-themes` stores theme in localStorage automatically via [`ThemeProvider`](app/layout.tsx:37)

## Context
### Relevant Code
- [`components/layout/theme-switcher.tsx`](components/layout/theme-switcher.tsx:1) - Current implementation with mounted state and resolvedTheme
- [`components/ThemeProvider.tsx`](components/ThemeProvider.tsx:1) - Wraps next-themes provider
- [`app/layout.tsx`](app/layout.tsx:37) - Root layout with ThemeProvider configuration (attribute="class", defaultTheme="system", enableSystem)
- [`legacy/components/layout/theme-switcher.tsx`](legacy/components/layout/theme-switcher.tsx:1) - Legacy reference with dual-button toggle design

### Patterns to Follow
- Client component with `"use client"` directive
- Mounted state pattern: `const [mounted, setMounted] = useState(false)` with `useEffect(() => setMounted(true), [])`
- Skeleton placeholder during hydration: Return loading state if `!mounted`
- Icon switching based on `resolvedTheme`: `const isDark = resolvedTheme === "dark"`
- Accessibility: `aria-label` with dynamic text based on current theme

### Test Patterns
- Test structure follows [`components/__tests__/ThemeProvider.test.tsx`](components/__tests__/ThemeProvider.test.tsx:1) pattern
- Use `@testing-library/react` with `render`, `screen`, `fireEvent`, `waitFor`
- Wrap tests in `ThemeProvider` for context
- Mock localStorage in `beforeEach`: `localStorage.clear()`
- Test integration: Click toggles theme, theme persists on remount

### Dependencies
- `next-themes`: Theme management via [`useTheme`](components/layout/theme-switcher.tsx:10) hook
- `lucide-react`: Icons [`Moon`](components/layout/theme-switcher.tsx:4) and [`Sun`](components/layout/theme-switcher.tsx:4)
- `@/lib/utils`: [`cn`](components/layout/theme-switcher.tsx:3) utility for className merging

### Gotchas
- Hydration mismatch: Never render theme-dependent content before `mounted` is true
- SSR rendering: Component returns skeleton during SSR to prevent mismatch
- System theme: `theme` may be "system", always use `resolvedTheme` for actual theme value
- Accessibility: Provide descriptive `aria-label` for screen readers

## Audit
- components/__tests__/ThemeSwitcher.test.tsx

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Theme switching behaves correctly, avoids hydration mismatch with the mounted guard, and includes integration coverage for toggle + persistence.

### Findings

#### Blockers
- [ ] None.

#### High Priority
- [ ] None.

#### Medium Priority
- [ ] None.

#### Low Priority / Nits
- [ ] None.

### Test Assessment
- Coverage: Adequate
- Missing tests: None noted.

### What&apos;s Good
- Clear mounted-state handling prevents hydration mismatch while keeping UI responsive.

### Recommendations
- Consider adding `aria-pressed` to convey toggle state to assistive tech, if you want stricter accessibility semantics.
