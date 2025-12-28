---
stage: completed
tags:
  - chore
  - p1
agent: 06-✅auditor
contexts:
  - ai-guide
  - _context/skills/nextjs-core-skills.md
parent: roadmap-legacy-transfer
---

# Configure Environment Variables

## Goal
`.env.local` created with all required variables. `.env.example` created with placeholder values. `.gitignore` confirms .env files are excluded.

## Definition of Done
- [ ] `.env.local` created with all required variables
- [ ] `.env.example` created with placeholder values (for documentation)
- [ ] `.gitignore` confirms .env files are excluded

## Files
- `.env.local` - create - actual credentials (gitignored)
- `.env.example` - create - template for documentation

## Tests
- [ ] Unit: Environment variables load correctly in Next.js
- [ ] Manual: `process.env.NEXT_PUBLIC_SUPABASE_URL` returns value

## Context
Phase 1: Foundation & Security
Never commit .env files
