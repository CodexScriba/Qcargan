---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Sign Up Page

## Goal
Create sign up page with email confirmation flow.

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
Supabase sends confirmation email automatically on signUp.
