---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Login Page

## Goal
Create login page with form validation and server action authentication.

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
Use Server Actions for authentication to avoid exposing Supabase client to browser.
