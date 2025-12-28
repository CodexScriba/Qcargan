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

# Install Missing Dependencies

## Goal
All required packages installed. No version conflicts. TypeScript types available for all packages.

## Definition of Done
- [x] All required packages installed
- [x] No version conflicts
- [x] TypeScript types available for all packages

## Files
- `package.json` - modify - add dependencies

## Tests
- [x] `bun install` completes without errors
- [x] `bun run build` compiles successfully

## Context
Phase 1: Foundation & Security
Required new packages: drizzle-orm postgres @supabase/ssr next-intl posthog-js posthog-node
Dev dependencies: drizzle-kit vitest @vitejs/plugin-react @playwright/test

## Audit
.kanban2code/projects/legacy-transfer/phase1-foundation-security/task1.3-install-missing-dependencies.md
package.json
bun.lock
tsconfig.json
