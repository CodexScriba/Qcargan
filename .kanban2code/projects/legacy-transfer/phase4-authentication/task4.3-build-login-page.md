---
stage: plan
tags:
  - feature
  - p1
agent: 04-📋planner
contexts:
  - ai-guide
  - _context/skills/skill-server-actions-mutations.md
  - _context/skills/skill-supabase-ssr.md
parent: roadmap-legacy-transfer
---

# Build Login Page

## Goal
Login form with email/password. Form validation with react-hook-form + Zod. Server action for authentication. Error handling and feedback. Redirect to protected area on success.

## Definition of Done
- [ ] Login form with email/password
- [ ] Form validation with react-hook-form + Zod
- [ ] Server action for authentication
- [ ] Error handling and feedback
- [ ] Redirect to protected area on success

## Files
- `app/[locale]/auth/ingresar/page.tsx` - create - login page
- `app/[locale]/auth/actions.ts` - create - auth server actions

## Tests
- [ ] Unit: Form validates correctly
- [ ] Integration: Login with valid credentials succeeds
- [ ] Integration: Login with invalid credentials shows error
- [ ] E2E: Complete login flow works

## Context
Phase 4: Authentication
Spanish route: `/auth/ingresar`.
Use `useActionState` from 'react' (React 19).
Legacy reference: `/legacy/app/[locale]/auth/login/` (note: renaming to Spanish)