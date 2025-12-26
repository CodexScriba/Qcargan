---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Admin Dashboard

## Goal
Create protected admin dashboard with metrics and navigation.

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
Use middleware for route protection. Metrics fetched from database.
