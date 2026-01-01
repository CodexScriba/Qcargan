---
skill_name: skill-design-system
version: "1.0"
framework: QueCargan Design System
last_verified: "2026-01-01"
always_attach: true
priority: 10
triggers:
  - design
  - styling
  - colors
  - theme
  - dark mode
  - light mode
  - card
  - card-container
  - glassmorphism
  - button
  - ui component
  - layout
  - auth page
  - form page
---

<!--
LLM INSTRUCTION: Use this skill for ALL UI/styling decisions in QueCargan.
Dark mode is DEFAULT. Light mode is secondary/future option.
Always follow the hierarchy: background → card-container → card → content.
If no inner cards needed: background → card-container → content.
Use Lucide React for icons. Never use other icon libraries.
Always verify contrast for accessibility (WCAG AA minimum).
-->

# QueCargan Design System

> **Target:** QueCargan EV Platform | **Last Verified:** 2026-01-01

## 1. Design Philosophy

- **Clean, modern, futuristic** (EV-focused aesthetic)
- **Soft shadows**, no hard lines
- **Subtle glassmorphism** with backdrop blur
- **Cool mist backgrounds** with ambient gradients
- **Teal/Blue brand colors** - electric, premium feel

## 2. Visual Hierarchy (Top to Bottom)

```
┌─────────────────────────────────────────────────────────┐
│  1. BACKGROUND                                          │
│     Page base - cool mist with ambient gradients        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  2. CARD-CONTAINER                                │  │
│  │     Section wrappers - glassmorphism              │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  3. CARD (optional)                         │  │  │
│  │  │     Content cards                           │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │  4. CONTENT                           │  │  │  │
│  │  │  │     Text, forms, inputs               │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### When to Use Each Pattern

| Pattern | Use Case |
|---------|----------|
| `background → card-container → card → content` | Multiple content sections, dashboards, lists |
| `background → card-container → content` | Single-purpose pages (auth, forms, settings) |
| `background → Card (shadcn) → content` | Auth pages, modal-like full-page forms |

## 3. Color System

### 3.1 Dark Mode (DEFAULT)

```css
/* Base - Deep Navy Blue */
--background: 222 47% 5%;            /* #070b14 - Deep navy */
--foreground: 210 30% 94%;           /* #e8edf2 - Soft white-blue */

/* Electric Accents */
--neon-teal: 197 100% 63%;           /* #41c1ff - Electric cyan */
--neon-teal-light: 197 100% 70%;
--neon-purple: 262 100% 77%;         /* #a88bff - Soft purple */
--neon-charge: 68 100% 62%;          /* Charging indicator green */

/* Brand / Primary */
--brand: 197 100% 63%;               /* Electric cyan */
--primary: 210 100% 55%;             /* #1a8cff - Vibrant blue */
--primary-foreground: 0 0% 100%;     /* White */

/* Accent */
--accent: 197 100% 63%;              /* Same as brand */
--accent-foreground: 222 47% 5%;     /* Deep navy */

/* Secondary & Muted */
--secondary: 220 40% 14%;            /* #141c2e */
--secondary-foreground: 210 30% 94%;
--muted: 220 35% 18%;                /* #1e2738 */
--muted-foreground: 215 25% 65%;     /* #8a9bb3 */

/* Structural Surfaces */
--card: 222 45% 10%;                 /* #0d1422 - Dark navy card */
--card-foreground: 210 30% 94%;
--surface: 222 42% 12%;              /* #111928 */
--popover: 222 45% 10%;
--popover-foreground: 210 30% 94%;

/* Borders */
--border: 210 30% 80% / 0.10;        /* Subtle blue-white */
--border-subtle: 210 30% 80% / 0.06;
--border-neon: 197 100% 63% / 0.40;  /* Accent border on hover */
--input: 222 40% 14%;
--ring: 197 100% 63%;                /* Focus ring */

/* Destructive */
--destructive: 0 84% 60%;            /* #f04848 */
--destructive-foreground: 0 0% 100%;

/* Typography */
--dark-blue: 217 68% 24%;            /* Deep blue for headings */
--title-blue: 197 100% 63%;          /* Electric cyan for titles */
```

### 3.2 Light Mode (Secondary)

```css
/* Base - Cool Blue Mist */
--background: 210 45% 97%;           /* #f3f6f9 - Subtle blue-white */
--foreground: 220 35% 14%;           /* #1e2a3b - Deep blue-gray */

/* Brand / Accent - Electric Cyan */
--brand: 197 90% 45%;                /* Matches dark mode feel */
--brand-foreground: 220 35% 14%;

/* Primary */
--primary: 210 90% 42%;              /* #0d6ecc - Rich blue */
--primary-foreground: 0 0% 100%;

/* Secondary & Muted */
--secondary: 210 40% 95%;            /* #edf2f7 */
--secondary-foreground: 220 30% 22%;
--muted: 210 35% 93%;                /* #e5ecf2 */
--muted-foreground: 220 20% 42%;     /* #566272 */

/* Accent */
--accent: 197 90% 45%;               /* Electric teal */
--accent-foreground: 220 35% 14%;

/* Structural Surfaces */
--card: 0 0% 100% / 0.80;            /* Semi-transparent white */
--card-foreground: 220 30% 16%;
--surface: 210 45% 97% / 0.70;
--popover: 0 0% 100% / 0.90;
--popover-foreground: 220 35% 14%;

/* Borders & Inputs */
--border: 210 35% 88%;               /* #d4dde6 */
--border-subtle: 210 30% 92%;
--input: 0 0% 100%;
--ring: 197 90% 50%;

/* Destructive */
--destructive: 4 84% 58%;            /* #ef4444 */
--destructive-foreground: 0 0% 100%;

/* Typography */
--dark-blue: 215 70% 28%;            /* #154a7e - Headings */
--title-blue: 215 65% 32%;           /* #1a5490 - Titles */
```

## 4. Typography Colors

### Dark Mode Text Colors

| Element | Variable | Color | Usage |
|---------|----------|-------|-------|
| Body text | `--foreground` | `hsl(210 30% 94%)` | Default readable text |
| Titles | `--title-blue` | `hsl(197 100% 63%)` | Page titles, hero text |
| Headings | `text-foreground` | Same as body | Section headings |
| Muted text | `--muted-foreground` | `hsl(215 25% 65%)` | Descriptions, labels |
| Links | `--accent` | `hsl(197 100% 63%)` | Interactive text |

### Light Mode Text Colors

| Element | Variable | Color | Usage |
|---------|----------|-------|-------|
| Body text | `--foreground` | `hsl(220 35% 14%)` | Default readable text |
| Titles | `--dark-blue` | `hsl(215 70% 28%)` | Page titles |
| Headings | `text-[hsl(var(--dark-blue))]` | Deep blue | Section headings |
| Muted text | `--muted-foreground` | `hsl(220 20% 42%)` | Descriptions, labels |
| Links | `--primary` | `hsl(210 90% 42%)` | Interactive text |

## 5. Contrast Assessment

### ⚠️ Potential Issues to Monitor

| Combination | Ratio | Status | Notes |
|-------------|-------|--------|-------|
| Light: muted-foreground on background | ~4.7:1 | ⚠️ AA | Borderline for small text, safe for 14px+ |
| Dark: muted-foreground on card | ~5.8:1 | ✅ AAA | Good contrast |
| Dark: neon-teal on background | ~8.2:1 | ✅ AAA | Excellent |
| Light: dark-blue on background | ~8.5:1 | ✅ AAA | Excellent |

### ✅ Safe Combinations

- **Dark mode body text**: `foreground` on `background` or `card` - Excellent
- **Light mode body text**: `foreground` on `background` or `card` - Excellent
- **All button text**: `primary-foreground` (white) on `primary` - Excellent
- **Destructive**: White on red - Excellent

### Recommendations

1. **Avoid using `muted-foreground` for text smaller than 14px** in light mode
2. **High-saturation cyan** (`--neon-teal`) may cause eye strain on prolonged reading - use for accents only
3. **Test with color blindness simulators** - deuteranopia may have difficulty with teal/cyan distinctions

## 6. Glassmorphism Effects

### Card Container (Dark Mode)
```css
.dark .card-container {
  background: linear-gradient(
    180deg,
    hsl(210 50% 90% / 0.06) 0%,
    hsl(220 50% 80% / 0.02) 100%
  );
  border: 1px solid hsl(210 40% 80% / 0.10);
  box-shadow: 0 10px 30px hsl(222 60% 3% / 0.50);
  backdrop-filter: blur(8px);
}
```

### Card Container (Light Mode)
```css
.card-container {
  background: linear-gradient(
    135deg,
    hsl(210 50% 100% / 0.85) 0%,
    hsl(0 0% 100% / 0.82) 45%,
    hsl(210 60% 97% / 0.65) 100%
  );
  border: 1px solid hsl(210 40% 88% / 0.50);
  box-shadow:
    0 20px 48px hsl(220 50% 25% / 0.08),
    0 2px 12px hsl(var(--foreground) / 0.08),
    inset 0 1px 0 hsl(0 0% 100% / 0.6);
  backdrop-filter: blur(26px) saturate(180%);
}
```

## 7. Icon System

**Library:** Lucide React (ONLY)

```tsx
import { UserPlus, Mail, Lock, Eye, EyeOff } from "lucide-react"
```

### Icon Sizing

| Context | Size | Class |
|---------|------|-------|
| Header icon (in circle) | 24px | `size-6` |
| Button icon | 16-20px | `size-4` or `size-5` |
| Input icon | 16px | `size-4` |
| Nav icon | 20px | `size-5` |

### Icon Container Pattern (Auth Pages)
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
  <UserPlus className="size-6" />
</div>
```

## 8. Auth Page Pattern

### Structure
```tsx
<Card className="w-full max-w-[1380px] overflow-hidden border border-border rounded-[26px] shadow-[...] p-0 bg-card!">
  <div className="grid md:grid-cols-2 h-full">
    {/* Left: Form */}
    <div className="px-10 py-10 flex flex-col justify-center min-h-[672px]">
      <header className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-6" />
          </div>
          <h1 className="text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-[hsl(var(--dark-blue))]">
            {title}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-[52px]">
          {description}
        </p>
      </header>
      <Form />
    </div>
    {/* Right: Image */}
    <div className="relative hidden md:block overflow-hidden">
      <AuthImage />
    </div>
  </div>
</Card>
```

### Auth Card Shadow
```css
shadow-[0_10px_25px_rgba(2,0,68,.08),0_2px_6px_rgba(2,0,68,.06)]
hover:shadow-[0_18px_32px_rgba(2,0,68,.12),0_4px_10px_rgba(2,0,68,.08)]
```

## 9. Button System

### Primary Button
```css
/* Light */
.btn-primary {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--brand)) 100%);
  color: white;
  box-shadow: 0 4px 14px hsl(var(--shadow-soft));
}

/* Dark */
.dark .btn-primary {
  background: linear-gradient(180deg, hsl(210 100% 60%) 0%, hsl(210 100% 45%) 100%);
  border: 1px solid hsl(210 100% 50% / 0.5);
  box-shadow: 0 10px 24px hsl(210 100% 50% / 0.35);
}
```

### Button Variants
- `btn-primary` - Main CTA, gradient blue
- `btn-secondary` - Secondary actions, muted background
- `btn-ghost` - Tertiary actions, transparent
- `btn-destructive` - Dangerous actions, red

## 10. Checklist for New Pages/Components

- [ ] Follow hierarchy: background → card-container → (card) → content
- [ ] Use Lucide React icons only
- [ ] Apply correct text colors per theme
- [ ] Card shadows use design system variables
- [ ] Buttons use correct variant classes
- [ ] Test contrast for accessibility (WCAG AA minimum)
- [ ] Dark mode is primary design target
- [ ] Glassmorphism effects applied to containers
- [ ] Form inputs follow input styling pattern
- [ ] Responsive breakpoints follow auth page pattern

## 11. Common Mistakes

### ❌ DON'T
- Don't use hardcoded colors - always use CSS variables
- Don't use icon libraries other than Lucide React
- Don't skip the card-container wrapper for main content
- Don't use `muted-foreground` for important text smaller than 14px
- Don't apply glassmorphism to everything - use sparingly
- Don't forget hover states on interactive elements

### ✅ DO
- Use `hsl(var(--variable))` syntax for all colors
- Follow the visual hierarchy strictly
- Apply `transition-smooth` for animations
- Use semantic color names (primary, muted, destructive)
- Test both dark and light modes
- Verify contrast ratios for text
