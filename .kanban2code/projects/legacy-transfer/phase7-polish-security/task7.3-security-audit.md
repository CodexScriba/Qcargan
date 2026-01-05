---
stage: plan
tags: [chore, p1]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/skill-http-security-headers.md]
parent: roadmap-legacy-transfer
---

# Security Audit

## Goal
Perform pre-production security audit. Scan dependencies, verify no secrets leaked, review RLS policies, and validate auth form inputs.

## Definition of Done
- [ ] All dependencies scanned for vulnerabilities with `bun audit`
- [ ] No secrets (.env files) in git history
- [ ] RLS policies active on all database tables
- [ ] Auth form inputs validated with Zod schemas
- [ ] HTTP security headers configured in next.config.ts
- [ ] Content Security Policy (CSP) baseline defined

## Files
- `next.config.ts` - modify - add security headers
- No new audit files - review and document findings

## Tests
- [ ] Manual: `bun audit` reports no critical or high issues
- [ ] Manual: `git log --all --full-history -- .env*` shows no secrets committed
- [ ] Manual: Supabase dashboard shows RLS enabled on all tables
- [ ] Manual: Auth forms reject invalid inputs (bad email, password mismatch, etc.)

## Context
Phase 7: Polish & Security
Focus on landing page and auth flows (production-ready).
Marketplace features (admin, CRUD) audited separately in Phase 9.

## Security Checklist
- [ ] Review dependencies with `bun audit`
- [ ] Check .env.example has no real values
- [ ] Verify .env.local not in git
- [ ] Test form validation (email, password, confirm password)
- [ ] Add HTTP security headers (X-Frame-Options, X-Content-Type-Options, CSP)
- [ ] Verify RLS on: users, profiles, vehicles (if present), orders (if present)