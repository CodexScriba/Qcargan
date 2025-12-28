---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/nextjs-core-skills.md]
parent: roadmap-legacy-transfer
---

# Configure Poppins Font

## Goal
Poppins font loaded via next/font/google. Weights 400, 500, 600, 700, 800 available. Font applied to html element. No layout shift on load.

## Definition of Done
- [ ] Poppins font loaded via next/font/google
- [ ] Weights 400, 500, 600, 700, 800 available
- [ ] Font applied to html element
- [ ] No layout shift on load

## Files
- `app/layout.tsx` - modify - add Poppins font configuration

## Tests
- [ ] Visual: Poppins renders correctly in browser
- [ ] Performance: No CLS on font load

## Context
Phase 1: Foundation & Security
Legacy reference: `/legacy/app/layout.tsx`
