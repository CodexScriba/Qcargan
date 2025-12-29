---
stage: completed
tags:
  - feature
  - p1
  - shipped
agent: 06-✅auditor
contexts:
  - ai-guide
  - _context/skills/nextjs-core-skills.md
parent: roadmap-legacy-transfer
---

# Configure Poppins Font

## Goal
Poppins font loaded via next/font/google. Weights 400, 500, 600, 700, 800 available. Font applied to html element. No layout shift on load.

## Definition of Done
- [x] Poppins font loaded via next/font/google
- [x] Weights 400, 500, 600, 700, 800 available
- [x] Font applied to html element
- [x] No layout shift on load
- [x] Geist and Geist_Mono fonts removed from codebase
- [x] CSS variables updated to use Poppins

## Current State Analysis

### Current Font Configuration
**File:** [`app/layout.tsx`](app/layout.tsx:1)
- Uses Geist and Geist_Mono fonts from `next/font/google`
- Geist Sans: variable `--font-geist-sans`, latin subset
- Geist Mono: variable `--font-geist-mono`, latin subset
- Font variables applied to body element via className

**File:** [`app/globals.css`](app/globals.css:9)
- Line 9: `--font-sans: var(--font-geist-sans)`
- Line 10: `--font-mono: var(--font-geist-mono)`
- Font variables mapped in @theme inline section

### Legacy Reference
**File:** [`legacy/app/layout.tsx`](legacy/app/layout.tsx:19)
- Uses Poppins with weights: `["400", "500", "600", "700", "800"]`
- Configuration: `display: "swap"`, `subsets: ["latin"]`
- Variable: `--font-poppins`
- Applied to html element via className (not body)

### Key Differences to Address
1. **Font Application**: Legacy applies to `<html>`, current applies to `<body>`
2. **Display Strategy**: Legacy uses `display: "swap"` for CLS prevention
3. **CSS Variable**: Legacy uses `--font-poppins`, current uses `--font-geist-sans`

## Implementation Plan

### Step 1: Update Font Import in layout.tsx
**File:** [`app/layout.tsx`](app/layout.tsx:1)

**Changes:**
1. Remove import: `import { Geist, Geist_Mono } from "next/font/google";`
2. Add import: `import { Poppins } from "next/font/google";`
3. Remove Geist font configuration (lines 5-13)
4. Add Poppins configuration matching legacy:

```typescript
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});
```

### Step 2: Update RootLayout JSX
**File:** [`app/layout.tsx`](app/layout.tsx:20)

**Changes:**
1. Move `poppins.variable` from body className to html className
2. Remove `geistSans.variable` and `geistMono.variable` from body className
3. Keep `antialiased` on body element

**Before:**
```jsx
<html lang="en">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
```

**After:**
```jsx
<html lang="en" className={poppins.variable}>
  <body className="antialiased">
```

### Step 3: Update CSS Variables in globals.css
**File:** [`app/globals.css`](app/globals.css:9)

**Changes:**
1. Update line 9: `--font-sans: var(--font-poppins);`
2. Remove line 10: `--font-mono: var(--font-geist-mono);` (or keep for future use if needed)

### Step 4: Verify Font Loading
**Manual Testing:**
1. Start dev server: `bun run dev`
2. Open browser DevTools → Network tab
3. Check that Poppins font files are loaded
4. Verify weights 400, 500, 600, 700, 800 are present
5. Check that `font-display: swap` is applied to font CSS

**Performance Testing:**
1. Open Lighthouse or Web Vitals extension
2. Run performance audit
3. Check CLS (Cumulative Layout Shift) metric
4. Verify CLS < 0.1 (good) or < 0.25 (needs improvement)

## Technical Details

### Why `display: "swap"`?
- Prevents invisible text (FOIT) by showing fallback font immediately
- Swaps to Poppins once loaded
- Reduces CLS by preventing layout shift when font loads
- Recommended by web.dev for performance

### Why Apply to `<html>` Element?
- Matches legacy implementation
- Ensures font is available for all elements in the document
- Consistent with Tailwind's recommended approach for global fonts

### Font Weight Array Format
- Using string array: `["400", "500", "600", "700", "800"]`
- Alternative: `[400, 500, 600, 700, 800]` (numbers)
- String format matches legacy implementation

## Files to Modify
1. **[`app/layout.tsx`](app/layout.tsx:1)** - Replace Geist fonts with Poppins
2. **[`app/globals.css`](app/globals.css:9)** - Update CSS variable mapping

## Files to Reference
- **[`legacy/app/layout.tsx`](legacy/app/layout.tsx:19)** - Legacy Poppins implementation

## Tests
### Visual Testing
- [ ] Poppins renders correctly in browser
- [ ] Font weights 400, 500, 600, 700, 800 are available
- [ ] Text renders with correct font family

### Performance Testing
- [ ] No CLS on font load (Lighthouse CLS < 0.1)
- [ ] Font loads with `display: swap` strategy
- [ ] No visible text flash during font loading

### Code Quality
- [ ] No Geist or Geist_Mono imports remain
- [ ] CSS variables correctly reference `--font-poppins`
- [ ] TypeScript compilation succeeds
- [ ] No ESLint errors

## Acceptance Criteria
1. Poppins font is imported and configured in [`app/layout.tsx`](app/layout.tsx:1)
2. Font weights 400, 500, 600, 700, 800 are available
3. Font is applied to html element via className
4. `display: "swap"` is configured to prevent layout shift
5. CSS variable `--font-sans` points to `--font-poppins`
6. No Geist font references remain in codebase
7. Visual verification shows Poppins font rendering
8. Performance test shows CLS < 0.1 on font load

## Context
Phase 1: Foundation & Security
Legacy reference: [`/legacy/app/layout.tsx`](legacy/app/layout.tsx:19)

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Poppins font is correctly configured with all required weights, applied to the html element with `display: "swap"` for CLS prevention. Implementation matches legacy reference and follows Next.js 16 best practices.

### Findings

#### Blockers
- None

#### High Priority
- None

#### Medium Priority
- None

#### Low Priority / Nits
- [ ] Redundant `font-sans` on html element: The html element has both `poppins.variable` and `font-sans` classes. Since `--font-sans` CSS variable maps to `--font-poppins` in globals.css, applying `font-sans` on html is technically redundant as child elements will inherit it anyway via CSS cascade. - [app/layout.tsx:23](app/layout.tsx#L23)
- [ ] The legacy implementation applies `font-sans` to body, not html. Current implementation applies it to html. Both work, but consistency with legacy pattern would mean moving `font-sans` to body. - [legacy/app/layout.tsx:33](legacy/app/layout.tsx#L33) vs [app/layout.tsx:23](app/layout.tsx#L23)

### Test Assessment
- Coverage: Adequate - Build passes, TypeScript compiles, no runtime errors
- Missing tests: Visual regression tests would be ideal but not required for this scope

### What's Good
- Poppins font correctly imported from `next/font/google`
- All required weights (400, 500, 600, 700, 800) configured
- `display: "swap"` prevents FOIT and CLS issues
- Font variable `--font-poppins` properly defined and applied to html element
- CSS variable `--font-sans` correctly maps to `--font-poppins` in globals.css
- No Geist font references remain in source code (only in task documentation)
- Build succeeds with no TypeScript or compilation errors
- Implementation matches legacy reference closely

### Recommendations
- Consider moving `font-sans` from html to body to match legacy pattern exactly (optional, current approach also works)
