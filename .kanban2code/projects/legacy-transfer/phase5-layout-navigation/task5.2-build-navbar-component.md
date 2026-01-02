---
stage: code
tags:
  - feature
  - p1
agent: coder
contexts:
  - ai-guide
parent: roadmap-legacy-transfer
skills:
  - react-core-skills
  - skill-tailwindcss-v4
  - skill-design-system
  - skill-next-intl
---

# Build Navbar Component

## Goal
Desktop navbar with logo, nav links, theme/language switchers. Tablet variant with condensed navigation. Mobile variant with hamburger menu. Glassmorphic styling applied.

## Definition of Done
- [ ] Desktop navbar with logo, nav links, theme/language switchers
- [ ] Tablet variant with condensed navigation
- [ ] Mobile variant with hamburger menu
- [ ] Glassmorphic styling applied

## Files
- `components/layout/navbar/Navbar.tsx` - create - main navbar
- `components/layout/navbar/MobileMenu.tsx` - create - mobile drawer
- `components/layout/navbar/NavLinks.tsx` - create - navigation links

## Tests
- [ ] Visual: Desktop layout correct
- [ ] Visual: Mobile menu opens/closes
- [ ] Integration: Links navigate correctly

## Context
Phase 5: Layout & Navigation
Glassmorphic baseline: 200° 62% 97% mist, Liquid Glass Lagoon brand.
Legacy reference: `/legacy/components/layout/navbar/`

## Refined Prompt
Objective: Build a responsive navbar with three breakpoint variants (desktop/tablet/mobile), glassmorphic styling, and integrated theme/language switchers.

Implementation approach:
1. Create main `Navbar.tsx` with ResizeObserver to track `--navbar-height` CSS variable, render three breakpoint variants using Tailwind visibility classes (`hidden lg:block`, etc.)
2. Create `NavLinks.tsx` shared component for navigation items using `next-intl` translations from the `nav` namespace
3. Create `MobileMenu.tsx` using the shadcn Sheet component with slide-right animation and hamburger trigger
4. Create `Logo.tsx` component with theme-aware image switching using `next-themes` (dark: `/images/logo/logo-dark.jpg`, light: `/images/logo/logo-light.png`), Next.js Image, and locale-aware Link
5. Integrate existing `ThemeSwitcher` from `components/layout/theme-switcher.tsx` and port `LanguageSwitcher` from legacy
6. Apply glassmorphic styling: `backdrop-blur`, semi-transparent backgrounds, soft shadows per design system

Key decisions:
- Use three separate variant layouts (Desktop/Tablet/Mobile) rather than a single responsive component for cleaner code and easier maintenance
- Reuse existing `ThemeSwitcher` from new components; port `LanguageSwitcher` from legacy with matching glassmorphic pill styling
- Use Sheet component from shadcn for mobile menu (right-side slide-out)
- Track navbar height with ResizeObserver for dynamic spacing in page layouts
- Use `next-intl` `useTranslations('nav')` for all navigation labels

Edge cases:
- Handle SSR hydration for theme switcher and logo (mounted state check before rendering theme-dependent content)
- Logo must show skeleton/placeholder until mounted to prevent hydration mismatch
- Sheet should close on navigation (onClick handler sets open to false)
- Logo text hidden on mobile, shown on md+ screens
- Auth buttons in mobile menu placed at bottom with `mt-auto`

## Context
### Relevant Code
- [legacy/components/layout/navbar/Navbar.tsx](legacy/components/layout/navbar/Navbar.tsx) - Main navbar structure with ResizeObserver pattern
- [legacy/components/layout/navbar/variants/DesktopNavbar.tsx](legacy/components/layout/navbar/variants/DesktopNavbar.tsx):16-53 - Desktop layout with logo, menus, search, auth buttons
- [legacy/components/layout/navbar/variants/TabletNavbar.tsx](legacy/components/layout/navbar/variants/TabletNavbar.tsx):15-46 - Condensed tablet layout with size="sm" buttons
- [legacy/components/layout/navbar/variants/MobileNavbar.tsx](legacy/components/layout/navbar/variants/MobileNavbar.tsx):14-78 - Mobile with Sheet hamburger menu
- [legacy/components/layout/navbar/Logo.tsx](legacy/components/layout/navbar/Logo.tsx) - Logo component with image and text
- [legacy/components/layout/theme-switcher.tsx](legacy/components/layout/theme-switcher.tsx) - Glassmorphic pill toggle
- [legacy/components/layout/language-switcher.tsx](legacy/components/layout/language-switcher.tsx) - Locale switching with flags
- [components/layout/theme-switcher.tsx](components/layout/theme-switcher.tsx) - Current theme switcher (simpler style)
- [components/ui/sheet.tsx](components/ui/sheet.tsx) - Sheet component for mobile menu

### Patterns to Follow
- Glassmorphic container: `bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-muted/20 border-border/60 shadow-[0_6px_20px_-15px_rgba(15,23,42,0.4)]`
- Active button state: `bg-[hsl(var(--primary))] text-white shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)]`
- Hover transitions: `transition-all duration-300 hover:-translate-y-[1px]`
- Navbar heights: Desktop h-20 (80px), Tablet h-16 (64px), Mobile h-14 (56px)
- Sticky header: `sticky top-0 z-50 border-b border-[hsl(var(--border))]`

### Test Patterns
Visual testing via Storybook or manual browser inspection at breakpoints:
- Desktop: 1280px+ (lg:)
- Tablet: 768px-1279px (md:)
- Mobile: <768px

### Dependencies
- `next-themes`: Theme detection and switching
- `next-intl`: Translations and locale routing (`useTranslations`, `useLocale`, `useRouter`, `usePathname`)
- `@/i18n/routing`: Locale-aware Link component
- `lucide-react`: Icons (Menu, LogIn, ArrowRight, Sun, Moon)
- shadcn components: Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger

### Gotchas
- Cast dynamic route paths as `any` when using locale Link: `href={'/auth/login' as any}`
- Use `useLayoutEffect` for ResizeObserver to avoid flash
- Always check `mounted` state before rendering theme-dependent content (logo, theme switcher)
- Logo images: dark mode uses `/images/logo/logo-dark.jpg`, light mode uses `/images/logo/logo-light.png`
- Sheet `side='right'` for mobile menu consistency
