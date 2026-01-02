---
stage: completed
agent: auditor
contexts:
  - skills/react-core-skills
  - skills/nextjs-core-skills
  - skills/skill-tailwindcss-v4
  - skills/skill-next-intl
---

# Move and Refine Logo Component

## Goal
Move the existing Logo component from the navbar-specific folder to the general layout folder. Ensure it maintains its light/dark mode distinction, responsive sizing, and home page linking.

## Definition of Done
- [x] Existing `components/layout/navbar/Logo.tsx` moved to `components/layout/Logo.tsx`
- [x] Theme-aware logic (dark: `logo-dark.jpg`, light: `logo-light.png`) preserved and verified
- [x] Responsive text visibility preserved (`hidden` on mobile, `md:inline`)
- [x] Hydration safety (mounted state/skeleton) preserved
- [x] `components/layout/navbar/Navbar.tsx` updated to import Logo from `@/components/layout/Logo`
- [x] Unused `components/layout/navbar/Logo.tsx` deleted

## Files
- `components/layout/Logo.tsx` - create/move
- `components/layout/navbar/Navbar.tsx` - modify
- `components/layout/navbar/Logo.tsx` - delete

## Tests
- [x] Unit: Verify Logo renders correct source based on `resolvedTheme` (mocked)
- [x] Unit: Verify Logo text visibility classes are present
- [x] Visual: Confirm image path and size (40x40)

## Refined Prompt
Objective: Migrate the existing theme-aware Logo component to its final architectural home in `components/layout/Logo.tsx`.

Implementation approach:
1. Move the code from `components/layout/navbar/Logo.tsx` to `components/layout/Logo.tsx`.
2. Confirm the image sources remain: dark -> `/images/logo/logo-dark.jpg`, light -> `/images/logo/logo-light.png`.
3. Ensure the `mounted` state logic is intact to prevent hydration errors.
4. Update `components/layout/navbar/Navbar.tsx` to use the new import path.
5. Delete the original file in the `navbar` subdirectory.

Key decisions:
- Reuse existing logic: The current implementation in `components/layout/navbar/Logo.tsx` already meets the functional requirements (theme switching, responsiveness); we are simply aligning it with the project's folder structure.

Edge cases:
- Import paths: Ensure `@/lib/i18n/navigation` and other aliases are correct after the move.

## Context
### Relevant Code
- `components/layout/navbar/Logo.tsx` - Source of current logic.
- `components/layout/navbar/Navbar.tsx` - Consumer to be updated.

### Patterns to Follow
- Keep the `skeleton` fallback for the unmounted state to prevent layout shift.

### Gotchas
- Don't lose the `priority` prop on the `Image` component.
- Ensure the `Link` component remains locale-aware via `@/lib/i18n/navigation`.

## Audit
- `components/layout/Logo.tsx`
- `components/layout/__tests__/Logo.test.tsx`
- `components/layout/navbar/Navbar.tsx`

---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The `Logo` component was successfully moved to its new location and the old one was deleted. The consumer `Navbar` was updated correctly. Tests were added and verify the functionality.

### Findings

#### Blockers
- None

#### High Priority
- None

#### Medium Priority
- None

#### Low Priority / Nits
- None

### Test Assessment
- Coverage: Adequate. Covers theme switching and responsive visibility.
- Missing tests: None.

### What's Good
- Clean refactor.
- Preserved existing logic and safe guards (mounted check).
- Added comprehensive tests.

### Recommendations
- None