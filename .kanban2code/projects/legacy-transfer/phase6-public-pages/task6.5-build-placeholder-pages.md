---
stage: plan
tags: [feature, p3]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/react-core-skills.md]
parent: roadmap-legacy-transfer
---

# Build Placeholder Pages

## Goal
Services page with "Coming Soon" structure. Shop page with "Coming Soon" structure. Used cars waitlist page with email capture.

## Definition of Done
- [ ] Services page with "Coming Soon" structure
- [ ] Shop page with "Coming Soon" structure
- [ ] Used cars waitlist page with email capture

## Files
- `app/[locale]/servicios/page.tsx` - create
- `app/[locale]/tienda/page.tsx` - create
- `app/[locale]/autos-usados/lista-espera/page.tsx` - create

## Tests
- [ ] Visual: Pages render correctly
- [ ] Integration: Waitlist form submits

## Context
Phase 6: Public Pages
Spanish routes: `/servicios`, `/tienda`, `/autos-usados/lista-espera`.
Legacy reference: `/legacy/app/[locale]/services/` etc.