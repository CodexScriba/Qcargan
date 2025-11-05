# QueCargan UI Patterns: Cards, Buttons, and Background Hierarchy

This note captures how the `app/[locale]/cars` page assembles UI solely with the primitives defined in `app/globals.css`. Future screens should reuse these same tokens and classes—avoid ad‑hoc styles or component‑scoped overrides.

## Background + Page Shell

- **Viewport background** is already handled globally via layered radial gradients on `body`. Avoid adding extra page-level backgrounds unless you need a masked gradient; instead, rely on spacing (`container mx-auto px-4 py-6 max-w-[1600px] space-y-6`) to frame content.
- When a section needs emphasis, wrap it in `.card-container`. This provides the frosted gradient backdrop, glass border, and internal blur. Do not nest additional background colors inside unless necessary for contrast.

## Card Hierarchy

1. **`.card-container`** — glassmorphism shell with generous radius and gradient. Use it to group related content blocks (hero, specs, accessories). Keep direct children spaced with `space-y-*` utilities and let the container handle depth; avoid adding extra borders or shadows.
2. **`[data-slot="card"]`** — lightweight content cards inside a container or grid. These carry the soft white/charcoal surface, hover elevation, and typography color rules. Use `data-slot="card"` on any element that should visually float above the container (e.g., SellerCard, review items).
3. **`.card-surface` / `.card-hover` helpers** — fallbacks when you need single-surface emphasis without the full container shell. Prefer `[data-slot="card"]` for anything interactive since it already wires hover transitions.

### Spacing + Grid

- Maintain `rounded-3xl overflow-hidden` on both container and inner media blocks to align curvature.
- Separate columns with Tailwind gap utilities and preserve `lg:grid-cols-*` patterns seen on the cars page. The hierarchy is: container → grid → individual cards/components.

## Button System (`.btn-primary`)

- Use `.btn-primary` for primary CTAs. It already handles:
  - Light mode gradient blend from `--primary` to `--brand` with white text.
  - Dark mode neon teal gradient, glow, and border accent.
  - Hover sweep animation via the `::before` pseudo-element.
- Apply only standard sizing utilities (`px-4 py-2`, `text-sm font-medium`) around the class; do **not** override colors, borders, or custom background images. The button relies on `var(--radius)` for curvature, so avoid adding conflicting radius classes.
- For secondary actions, prefer neutral surfaces (`[data-slot="card"]` buttons or `.icon` classes) rather than inventing new variants.

## Accent Details

- Vertical accent bars use `bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--brand))]` with fixed width/height for section headers. Reuse this pattern to signal section starts.
- Typography inside cards inherits `--card-foreground`; avoid hard-coded colors. For muted copy, use `text-[hsl(var(--muted-foreground))]`.

## Implementation Checklist

1. Wrap each major section in `.card-container` with the rounded treatment.
2. Place interactive/individual content in nodes marked with `[data-slot="card"]` (or components that render it internally).
3. Use `.btn-primary` for main CTAs; supplement with `.icon` utilities for icon-only actions.
4. Keep additional styling limited to spacing, layout, and text utilities from Tailwind; color and depth should always come from the globals tokens.
5. Respect light/dark adaptations—never introduce fixed hex values that bypass the CSS variables.

By adhering to this structure, new UIs will inherit the same glassy depth, teal gradients, and button interactions showcased on the cars page without diverging from the central theme defined in `globals.css`.
