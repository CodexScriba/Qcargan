---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Configure Poppins Font

## Goal
Set up Poppins font with weights 400-800 using next/font/google.

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
Use next/font/google for optimal performance and automatic font optimization.
