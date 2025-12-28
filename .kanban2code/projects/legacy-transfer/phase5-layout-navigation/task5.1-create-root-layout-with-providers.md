---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Create Root Layout with Providers

## Goal
Root layout wraps app with ThemeProvider. Font configuration applied. Metadata configured (title, description).

## Definition of Done
- [ ] Root layout wraps app with ThemeProvider
- [ ] Font configuration applied
- [ ] Metadata configured (title, description)

## Files
- `app/layout.tsx` - modify - complete root layout

## Tests
- [ ] Visual: Layout renders without errors
- [ ] Integration: Theme switching works

## Context
Phase 5: Layout & Navigation
Legacy reference: `/legacy/app/layout.tsx`
Ensure metadata is properly configured for SEO.
