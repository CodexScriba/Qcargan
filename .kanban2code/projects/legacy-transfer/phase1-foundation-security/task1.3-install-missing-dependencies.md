---
stage: plan
tags: [chore, p1]
agent: planner
contexts: [ai-guide, _context/skills/nextjs-core-skills.md]
parent: roadmap-legacy-transfer
---

# Install Missing Dependencies

## Goal
All required packages installed. No version conflicts. TypeScript types available for all packages.

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
Phase 1: Foundation & Security
Required new packages: drizzle-orm postgres @supabase/ssr next-intl posthog-js posthog-node
Dev dependencies: drizzle-kit vitest @vitejs/plugin-react @playwright/test
