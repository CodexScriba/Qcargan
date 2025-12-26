---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Run Database Migrations

## Goal
Generate and apply database migrations to Supabase.

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
Use drizzle-kit push for development, generate for production migrations.
