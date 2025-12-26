---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Implement Theme System

## Goal
Set up light/dark theme system with next-themes and CSS custom properties.

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
Use next-themes for client-side theme management with system preference detection.
