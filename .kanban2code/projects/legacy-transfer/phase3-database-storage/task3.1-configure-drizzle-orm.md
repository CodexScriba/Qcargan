---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-drizzle-orm.md]
parent: roadmap-legacy-transfer
---

# Configure Drizzle ORM

## Goal
Drizzle config file created. PostgreSQL driver configured with connection pooling. Database client exportable from lib/db.

## Definition of Done
- [ ] Drizzle config file created
- [ ] PostgreSQL driver configured with connection pooling
- [ ] Database client exportable from lib/db

## Files
- `drizzle.config.ts` - create - Drizzle configuration
- `lib/db/index.ts` - create - database client export

## Tests
- [ ] Unit: Database client connects successfully
- [ ] Unit: Connection pool configured correctly

## Context
Phase 3: Database & Storage
Use a shared `pg.Pool` and pass it to `drizzle({ client: pool })`.
