---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Install Missing Dependencies

## Goal
Install all required packages for the rebuild including Drizzle ORM, Supabase SSR, next-intl, and PostHog.

## Definition of Done
- [ ] All required packages installed
- [ ] No version conflicts
- [ ] TypeScript types available for all packages

## Files
- `package.json` - modify - add dependencies

## Tests
- [ ] `bun install` completes without errors
- [ ] `bun run build` compiles successfully

## Context
Required packages: drizzle-orm, postgres, @supabase/ssr, next-intl, posthog-js, posthog-node, dotenv
Dev dependencies: drizzle-kit
