---
stage: plan
tags: [feature, p2]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Build Placeholder Pages

## Goal
Create "Coming Soon" placeholder pages for Services, Shop, and Used Cars Waitlist. These pages provide route navigation structure and collect waitlist signups.

## Definition of Done
- [ ] Services page with "Coming Soon" structure and email capture
- [ ] Shop page with "Coming Soon" structure and email capture
- [ ] Used cars waitlist page with email capture form
- [ ] All pages properly localized (Spanish/English)

## Files
- `app/[locale]/servicios/page.tsx` - create - services placeholder
- `app/[locale]/tienda/page.tsx` - create - shop placeholder
- `app/[locale]/autos-usados/lista-espera/page.tsx` - create - used cars waitlist

## Tests
- [ ] Visual: All pages render correctly
- [ ] Integration: Email capture forms submit without error
- [ ] Navigation: Links accessible from navbar

## Context
Phase 6: Public Pages (Placeholders)
These are temporary pages to establish routing and collect early interest.
Full implementations deferred to Phase 9 (Directory Roadmap).

## Routes
- Spanish: `/servicios`, `/tienda`, `/autos-usados/lista-espera`
- English: `/en/services`, `/en/shop`, `/en/used-cars/waitlist`