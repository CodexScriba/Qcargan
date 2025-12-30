---
stage: plan
tags: [chore, p1]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/skill-http-security-headers.md]
parent: roadmap-legacy-transfer
---

# Security Audit

## Goal
All dependencies scanned for vulnerabilities. No secrets in codebase. RLS policies reviewed. Input validation on all forms.

## Definition of Done
- [ ] All dependencies scanned for vulnerabilities
- [ ] No secrets in codebase
- [ ] RLS policies reviewed
- [ ] Input validation on all forms

## Files
- No new files - review and audit

## Tests
- [ ] Manual: `bun audit` reports no critical issues
- [ ] Manual: .env files not in git history
- [ ] Manual: RLS policies active on all tables

## Context
Phase 7: Admin & Polish
Configure HTTP security headers in `next.config.ts`.
Define CSP baseline for the stack.
Review all Supabase RLS policies.