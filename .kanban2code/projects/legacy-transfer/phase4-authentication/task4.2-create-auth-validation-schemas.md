---
stage: completed
tags:
  - chore
  - p2
agent: auditor
contexts:
  - ai-guide
  - _context/skills/skill-server-actions-mutations.md
  - _context/skills/skill-vitest-playwright-testing.md
  - _context/skills/skill-typescript-config.md
parent: roadmap-legacy-transfer
---

# Create Auth Validation Schemas

## Goal
Login schema (email, password). Sign up schema (email, password, confirmPassword). Forgot password schema (email). Update password schema (password, confirmPassword).

## Definition of Done
- [x] Login schema (email, password)
- [x] Sign up schema (email, password, confirmPassword)
- [x] Forgot password schema (email)
- [x] Update password schema (password, confirmPassword)

## Files
- `lib/validation/auth.ts` - create - Zod schemas

## Tests
- [x] Unit: Valid data passes validation
- [x] Unit: Invalid email rejected
- [x] Unit: Password mismatch rejected

## Context
Phase 4: Authentication
Validate ALL input with Zod.
Legacy reference: `/legacy/lib/utils/validation.ts` (if exists)

## Refined Prompt
Objective: Create Zod validation schemas for all authentication forms.

Implementation approach:
1. Create `lib/validation/auth.ts` with four exported schemas
2. Define `LoginSchema` with email (trimmed, lowercased) and password (min 6 chars)
3. Define `SignUpSchema` extending login with confirmPassword and `.refine()` for match validation
4. Define `ForgotPasswordSchema` with email only
5. Define `UpdatePasswordSchema` with password and confirmPassword with match validation
6. Export inferred TypeScript types for each schema
7. Create `lib/validation/__tests__/auth.test.ts` with unit tests

Key decisions:
- Use Zod v4 (installed as `^4.1.13`): import via `import { z } from 'zod'`
- Email normalization: trim and lowercase via `.transform()` for consistency with legacy
- Password minimum: 6 characters (matches legacy `LoginSchema`)
- Confirm password: use `.refine()` for cross-field validation

Edge cases:
- Whitespace-only email should fail validation
- Password exactly 6 characters should pass (boundary)
- Empty confirmPassword with valid password should fail match

## Context
### Relevant Code
- [legacy/lib/validation/auth.ts:1-17](legacy/lib/validation/auth.ts#L1-L17) - existing LoginSchema pattern with email transform
- [lib/db/schema/profiles.ts:17-34](lib/db/schema/profiles.ts#L17-L34) - profiles table linked to auth.users

### Patterns to Follow
- Use `z.object()` for schema definition
- Use `.transform()` for email normalization (trim + lowercase)
- Use `.refine()` for cross-field validation (password confirmation)
- Export both schema and inferred type: `export type LoginValues = z.infer<typeof LoginSchema>`

### Test Patterns
- Location: `lib/validation/__tests__/auth.test.ts`
- Use Vitest: `import { describe, expect, it } from 'vitest'`
- Test structure: describe block per schema, it blocks for valid/invalid cases
- Use `.safeParse()` for testing to check success/error states
- Reference: [lib/db/__tests__/schema.test.ts](lib/db/__tests__/schema.test.ts) for project test style

### Dependencies
- `zod`: `^4.1.13` - validation library (already installed)
- `vitest`: `^4.0.16` - test runner (already installed)

### Gotchas
- Zod v4 import is still `import { z } from 'zod'` (not `zod/v4`)
- `.refine()` runs after all field validations pass; use for cross-field checks
- Create `lib/validation/` directory (does not exist yet)

## Audit
lib/validation/auth.ts
lib/validation/__tests__/auth.test.ts
.kanban2code/projects/legacy-transfer/phase4-authentication/task4.2-create-auth-validation-schemas.md

---

## Review

**Rating: 9/10**

**Verdict: ACCEPTED**

### Summary
Auth form schemas are implemented with Zod v4 (including email normalization and password confirmation), with passing unit tests covering the key validation paths.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] None

#### Medium Priority
- [ ] None

#### Low Priority / Nits
- [ ] Add “happy path” tests for `SignUpSchema` and `UpdatePasswordSchema` (matching passwords) to complement mismatch coverage - `lib/validation/__tests__/auth.test.ts:1`

### Test Assessment
- Coverage: Adequate
- Missing tests: Positive match cases for `SignUpSchema` and `UpdatePasswordSchema`

### What's Good
- Email normalization (`trim` + lowercase) is centralized and reused consistently across schemas.

### Recommendations
- Consider adding explicit error messages for `.email()` and password `.min(6)` for more user-friendly form feedback.
