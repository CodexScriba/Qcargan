---
stage: plan
tags: [feature, p2]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/skill-server-actions-mutations.md, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Build Password Reset Flow

## Goal
Forgot password page sends reset email. Update password page handles reset token. Both pages have proper validation and feedback.

## Definition of Done
- [ ] Forgot password page sends reset email
- [ ] Update password page handles reset token
- [ ] Both pages have proper validation and feedback

## Files
- `app/[locale]/auth/recuperar/page.tsx` - create - forgot password
- `app/[locale]/auth/actualizar-clave/page.tsx` - create - update password
- `app/[locale]/auth/error/page.tsx` - create - auth error page

## Tests
- [ ] Integration: Reset email sends correctly
- [ ] Integration: Password update with valid token succeeds
- [ ] Integration: Expired token shows error

## Context
Phase 4: Authentication
Spanish routes: `/auth/recuperar`, `/auth/actualizar-clave`.
Legacy reference: `/legacy/app/[locale]/auth/forgot-password/` etc.