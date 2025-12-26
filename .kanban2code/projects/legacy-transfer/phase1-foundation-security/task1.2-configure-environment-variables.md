---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Configure Environment Variables

## Goal
Set up environment configuration with fresh Supabase credentials and proper gitignore protection.

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
All secrets must be rotated from the legacy project. Never commit actual credentials.
