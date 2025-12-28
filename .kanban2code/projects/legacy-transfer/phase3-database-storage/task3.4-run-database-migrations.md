---
stage: plan
tags: [chore, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-drizzle-orm.md]
parent: roadmap-legacy-transfer
---

# Run Database Migrations

## Goal
Migration files generated. Migrations applied to Supabase database. Tables visible in Supabase dashboard.

## Definition of Done
- [ ] Migration files generated
- [ ] Migrations applied to Supabase database
- [ ] Tables visible in Supabase dashboard

## Files
- `drizzle/migrations/` - create - generated migration files
- `package.json` - modify - add db:push and db:generate scripts

## Tests
- [ ] Integration: All tables created in database
- [ ] Integration: Indexes visible in Supabase

## Context
Phase 3: Database & Storage
Dev: `db:push`. Prod: `db:generate` + `db:migrate`.
RLS must be configured in Supabase after tables are created.
