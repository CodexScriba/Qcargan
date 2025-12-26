---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Build Password Reset Flow

## Goal
Create forgot password and update password pages with proper validation.

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
Use Supabase resetPasswordForEmail and updateUserPassword methods.
