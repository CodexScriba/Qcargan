---
stage: plan
tags: [chore, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-server-actions-mutations.md]
parent: roadmap-legacy-transfer
---

# Create Auth Validation Schemas

## Goal
Login schema (email, password). Sign up schema (email, password, confirmPassword). Forgot password schema (email). Update password schema (password, confirmPassword).

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
Phase 4: Authentication
Validate ALL input with Zod.
Legacy reference: `/legacy/lib/utils/validation.ts` (if exists)
