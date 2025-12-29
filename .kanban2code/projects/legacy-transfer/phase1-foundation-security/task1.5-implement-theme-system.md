---
stage: completed
tags:
  - feature
  - p1
agent: auditor
contexts:
  - ai-guide
  - _context/skills/react-core-skills.md
  - _context/skills/skill-tailwindcss-v4.md
parent: roadmap-legacy-transfer
---

# Implement Theme System

## Goal
next-themes provider configured. Light/dark CSS variables defined in globals.css. System preference detection working. Theme persists across sessions.

## Definition of Done
- [x] next-themes provider configured
- [x] Light/dark CSS variables defined in globals.css
- [x] System preference detection working
- [x] Theme persists across sessions

## Files
- `app/layout.tsx` - modify - add ThemeProvider wrapper
- `app/globals.css` - modify - ensure theme variables present
- `components/ThemeProvider.tsx` - create - ThemeProvider component

## Tests
- [x] Unit: ThemeProvider renders without error
- [x] Integration: Theme toggle changes CSS variables
- [x] Integration: Theme persists in localStorage

## Context
Phase 1: Foundation & Security
Design tokens should be defined as CSS custom properties.
Legacy reference: `/legacy/app/layout.tsx`

## Refined Prompt
Objective: Configure next-themes provider with system preference detection and CSS variable theming.

Implementation approach:
1. Create `components/ThemeProvider.tsx` client component wrapping next-themes provider
2. Configure ThemeProvider with `attribute="class"`, `enableSystem={true}`, `defaultTheme="system"`, and `suppressHydrationWarning`
3. Wrap children in `app/layout.tsx` with ThemeProvider, add `suppressHydrationWarning` to `<html>`
4. Verify light/dark CSS variables already exist in `globals.css` (they do: `:root` for light, `.dark` for dark)
5. Write unit and integration tests using Vitest

Key decisions:
- Use `attribute="class"` for theme switching: Tailwind v4 uses `.dark` class selector via `@custom-variant dark (&:is(.dark *));` already in `globals.css:4`
- Enable system preference: Set `enableSystem={true}` (legacy had `enableSystem={false}`, but task requires system preference detection)
- Default to system: Set `defaultTheme="system"` for automatic preference detection
- Separate ThemeProvider component: Follows React pattern of extracting "use client" components for server layouts

Edge cases:
- Hydration mismatch: Add `suppressHydrationWarning` to `<html>` element to prevent flash
- SSR rendering: next-themes handles SSR with script injection; no additional work needed
- localStorage unavailable: next-themes falls back gracefully to default theme

## Context
### Relevant Code
- `legacy/app/layout.tsx:34-41` - ThemeProvider configuration from legacy (uses `enableSystem={false}`, change to `true`)
- `legacy/components/layout/theme-switcher.tsx:1-85` - Theme toggle component pattern using `useTheme` hook (for reference)
- `app/layout.tsx:17-28` - Current layout without ThemeProvider (needs modification)
- `app/globals.css:4` - Custom dark variant: `@custom-variant dark (&:is(.dark *));`
- `app/globals.css:47-80` - Light theme variables in `:root`
- `app/globals.css:82-114` - Dark theme variables in `.dark`

### Patterns to Follow
- Client components use `"use client"` directive at top
- Component files use PascalCase: `ThemeProvider.tsx`
- Props interfaces use `{Component}Props` suffix
- Legacy ThemeProvider uses `disableTransitionOnChange` for smoother switching

### Test Patterns
- Tests use Vitest with `.test.ts` / `.test.tsx` extension
- Config at `vitest.config.ts` with `environment: "node"`
- No existing test files in project yet; create under `components/__tests__/`

### Dependencies
- `next-themes@^0.4.6`: Already installed, provides `ThemeProvider` and `useTheme` hook

### Gotchas
- Do not import `ThemeProvider` directly from `next-themes` in layout.tsx: Create wrapper client component instead
- `suppressHydrationWarning` must be on `<html>` element, not just the provider
- Tailwind v4 dark mode uses class strategy via `@custom-variant dark` (already configured)

## Audit
- app/layout.tsx
- components/ThemeProvider.tsx
- components/__tests__/ThemeProvider.test.tsx
- vitest.config.ts
- vitest.setup.ts
- package.json
- bun.lock
