---
stage: completed
tags:
  - feature
  - p1
agent: auditor
contexts:
  - ai-guide
  - _context/skills/skill-drizzle-orm.md
parent: roadmap-legacy-transfer
---

# Configure Drizzle ORM

## Goal
Drizzle config file created. PostgreSQL driver configured with connection pooling. Database client exportable from lib/db.

## Definition of Done
- [x] Drizzle config file created
- [x] PostgreSQL driver configured with connection pooling
- [x] Database client exportable from lib/db

## Files
- `drizzle.config.ts` - modify - ensure proper configuration
- `lib/db/index.ts` - modify - replace postgres-js with pg.Pool

## Tests
- [x] Unit: Database client connects successfully
- [x] Unit: Connection pool configured correctly

## Context
Phase 3: Database & Storage
Use a shared `pg.Pool` and pass it to `drizzle({ client: pool })`.

## Refined Prompt
Objective: Replace postgres-js driver with pg.Pool connection pooling in lib/db/index.ts per skill-drizzle-orm.md requirements.

Implementation approach:
1. Replace `drizzle-orm/postgres-js` import with `drizzle-orm/node-postgres`
2. Replace `postgres` import with `Pool` from `pg`
3. Create shared Pool instance with connection limits (max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000)
4. Pass Pool to drizzle using `drizzle({ client: pool, schema })`
5. Ensure environment variable resolution handles both DATABASE_URL and DIRECT_URL
6. Export both db instance and pool for testing

Key decisions:
- Use pg.Pool over postgres-js: skill-drizzle-orm.md specifies pg.Pool pattern for connection pooling; postgres-js uses single connection (max: 1) which doesn't meet requirement
- Pool configuration: match legacy pattern with max: 10 connections, 30s idle timeout, 2s connection timeout
- Global pool singleton: reuse pool across requests in development (pattern from legacy lib/db/client.ts:64-75)
- Error handling: throw if neither DATABASE_URL nor DIRECT_URL is set

Edge cases:
- Missing DATABASE_URL and DIRECT_URL: throw descriptive error
- Pool connection failures: let Pool handle reconnection logic
- Development hot reload: use globalThis pattern to avoid multiple pool instances
- Production environment: create new pool on each module load (no caching)

## Context
### Relevant Code
- [`drizzle.config.ts:1-12`](drizzle.config.ts:1-12) - existing config with correct schema path and dialect
- [`lib/db/index.ts:1-24`](lib/db/index.ts:1-24) - current postgres-js implementation (needs replacement)
- [`legacy/lib/db/client.ts:1-75`](legacy/lib/db/client.ts:1-75) - reference implementation with Pool pattern and factory functions
- [`package.json:55-62`](package.json:55-62) - dependencies include drizzle-orm and postgres (need to add pg)
- [`.env.example:13-16`](.env.example:13-16) - DATABASE_URL and DIRECT_URL environment variables

### Patterns to Follow
Use legacy/lib/db/client.ts as reference:
- Lines 6-12: Environment variable resolution with error throwing
- Lines 18-21: DEFAULT_SQL_CONFIG with prepare: false, max: 1 (adapt to Pool config)
- Lines 23-25: createSqlClient factory function (optional for this task)
- Lines 27-29: createDrizzleClient factory function (optional for this task)
- Lines 59-75: Global pool singleton pattern for development

### Test Patterns
- [`lib/db/__tests__/client.test.ts:1-42`](lib/db/__tests__/client.test.ts:1-42) - existing test mocks postgres module; needs update to mock pg.Pool
- Mock pg.Pool with connect and end methods
- Test pool configuration (max, idleTimeout, connectionTimeout)
- Test environment variable resolution
- Test db instance export

### Dependencies
- `drizzle-orm`: currently using `drizzle-orm/postgres-js`, need `drizzle-orm/node-postgres`
- `postgres`: currently using postgres-js driver, need to add `pg` package
- `pg`: needs to be installed for Pool support

### Gotchas
- Skill-drizzle-orm.md specifies `drizzle-orm/node-postgres` + `pg.Pool`, not `drizzle-orm/postgres-js` + `postgres`
- Current implementation uses postgres-js with single connection (max: 1), which conflicts with skill requirement
- Legacy uses postgres-js but with factory functions; we need pg.Pool per skill
- Must install pg package: `bun add pg`
- Pool configuration differs from postgres-js (max connections vs max: 1)
- Global singleton pattern prevents multiple pool instances in development

## Audit
- lib/db/index.ts
- lib/db/__tests__/client.test.ts
- package.json

---

## Review

**Rating: 8/10**

**Verdict: ACCEPTED**

### Summary
Drizzle is configured to use `drizzle-orm/node-postgres` with a shared `pg.Pool`, and unit tests validate pool configuration and exports.

### Findings

#### Blockers
- [ ] None

#### High Priority
- [ ] Test fallback behavior via module import (not via `??` operator reimplementation) - `lib/db/__tests__/client.test.ts:83`

#### Medium Priority
- [ ] Avoid generic `globalThis.pool` key; use a namespaced global to prevent accidental collisions - `lib/db/index.ts:13`
- [ ] Avoid `!` in `drizzle.config.ts` for `dbCredentials.url`; throw a descriptive error if neither env var is set - `drizzle.config.ts:10`

#### Low Priority / Nits
- [ ] Consider clarifying (in docs or comments) the intended priority difference between runtime (`DATABASE_URL ?? DIRECT_URL`) and drizzle-kit config (`DIRECT_URL ?? DATABASE_URL`) - `lib/db/index.ts:6`

### Test Assessment
- Coverage: Adequate
- Missing tests: Import-based verification for `DIRECT_URL` fallback and global pool reuse across hot-reloads.

### What's Good
- Uses `pg.Pool` with sane defaults and exports `pool` for testability.
- Uses the recommended `drizzle({ client: pool, schema })` pattern.

### Recommendations
- Update the tests to clear the global pool between cases so the fallback logic can be verified through real imports.
