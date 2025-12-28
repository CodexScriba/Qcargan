---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-routing-layouts.md]
parent: roadmap-legacy-transfer
---

# Build Admin Dashboard

## Goal
Protected admin route. Dashboard with key metrics. Navigation to CRUD sections.

## Definition of Done
- [ ] Protected admin route
- [ ] Dashboard with key metrics
- [ ] Navigation to CRUD sections

## Files
- `app/[locale]/admin/page.tsx` - create - admin dashboard
- `app/[locale]/admin/layout.tsx` - create - admin layout

## Tests
- [ ] Integration: Only authenticated admins can access
- [ ] Visual: Dashboard displays metrics

## Context
Phase 7: Admin & Polish
Route: `/admin`.
Must verify admin role/permissions via Supabase.
Legacy reference: `/legacy/app/[locale]/admin/`
