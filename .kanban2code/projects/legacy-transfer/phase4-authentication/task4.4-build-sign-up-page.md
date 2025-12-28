---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-server-actions-mutations.md, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Build Sign Up Page

## Goal
Sign up form with email, password, confirm password. Server action sends confirmation email. Redirect to success page after submission.

## Definition of Done
- [ ] Sign up form with email, password, confirm password
- [ ] Server action sends confirmation email
- [ ] Redirect to success page after submission

## Files
- `app/[locale]/auth/registrar/page.tsx` - create - sign up page
- `app/[locale]/auth/sign-up-success/page.tsx` - create - success page

## Tests
- [ ] Unit: Form validates password match
- [ ] Integration: Sign up triggers confirmation email
- [ ] E2E: Complete sign up flow works

## Context
Phase 4: Authentication
Spanish route: `/auth/registrar`.
Legacy reference: `/legacy/app/[locale]/auth/register/` (note: renaming to Spanish)
