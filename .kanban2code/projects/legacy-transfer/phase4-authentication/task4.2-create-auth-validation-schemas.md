---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Auth Validation Schemas

## Goal
Define Zod schemas for all authentication forms.

## Definition of Done
- [ ] Login schema (email, password)
- [ ] Sign up schema (email, password, confirmPassword)
- [ ] Forgot password schema (email)
- [ ] Update password schema (password, confirmPassword)

## Files
- `lib/validation/auth.ts` - create - Zod schemas

## Tests
- [ ] Unit: Valid data passes validation
- [ ] Unit: Invalid email rejected
- [ ] Unit: Password mismatch rejected

## Context
Use Zod for runtime validation and TypeScript type inference.
