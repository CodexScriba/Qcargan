---
stage: plan
tags: [chore, p1]
agent: coder
contexts: []
---

# Security Audit

## Goal
Perform comprehensive security review of the rebuilt application.

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
Use Supabase RLS, validate inputs with Zod, review all dependencies.
