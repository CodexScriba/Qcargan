---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/react-core-skills.md, _context/skills/skill-tailwindcss-v4.md]
parent: roadmap-legacy-transfer
---

# Implement Theme System

## Goal
next-themes provider configured. Light/dark CSS variables defined in globals.css. System preference detection working. Theme persists across sessions.

## Definition of Done
- [ ] next-themes provider configured
- [ ] Light/dark CSS variables defined in globals.css
- [ ] System preference detection working
- [ ] Theme persists across sessions

## Files
- `app/layout.tsx` - modify - add ThemeProvider wrapper
- `app/globals.css` - modify - ensure theme variables present
- `components/theme-provider.tsx` - create - ThemeProvider component

## Tests
- [ ] Unit: ThemeProvider renders without error
- [ ] Integration: Theme toggle changes CSS variables
- [ ] Integration: Theme persists in localStorage

## Context
Phase 1: Foundation & Security
Design tokens should be defined as CSS custom properties.
Legacy reference: `/legacy/app/layout.tsx`
