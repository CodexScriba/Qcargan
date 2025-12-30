---
stage: completed
project: legacy-transfer
phase: phase3-database-storage
agent: auditor
parent: roadmap-legacy-transfer
tags:
  - feature
  - p1
contexts:
  - ai-guide
  - _context/skills/skill-drizzle-orm.md
---

# Create Vehicles Schema

## Goal
vehicles table with core fields (brand, model, year, variant, slug). vehicle_specifications table with range, battery, performance, etc. Proper indexes defined. TypeScript types exported.

## Definition of Done
- [x] vehicles table with core fields (brand, model, year, variant, slug)
- [x] vehicle_specifications table with range, battery, performance, etc.
- [x] Proper indexes defined
- [x] TypeScript types exported

## Files
- `lib/db/schema/vehicles.ts` - create/verify - vehicle tables
- `lib/db/schema/index.ts` - verify - barrel export
- `lib/db/__tests__/schema.test.ts` - create - schema tests

## Tests
- [x] Unit: Schema compiles without TypeScript errors
- [x] Unit: Types correctly infer from schema

## Audit
lib/db/__tests__/schema.test.ts

## Refined Prompt
Objective: Verify and finalize the `vehicles` and `vehicle_specifications` schema implementation in Drizzle ORM, ensuring strict typing and comprehensive tests.

Implementation approach:
1.  **Verify Schema**: Check `lib/db/schema/vehicles.ts`. Ensure it matches the legacy structure (`legacy/lib/db/schema/vehicles.ts`) but adheres to the new Drizzle patterns (e.g., proper imports, `pgTable`).
    *   Verify `unique_vehicle_identity` uses `sql` for `COALESCE` on variant to handle uniqueness correctly.
    *   Verify JSONB columns use `.$type<T>()`.
2.  **Verify Exports**: Ensure `lib/db/schema/index.ts` properly exports `* from './vehicles'`.
3.  **Add Tests**: Create `lib/db/__tests__/schema.test.ts` (or add to it if it exists, or specific `vehicles.test.ts`) to:
    *   Import the schema.
    *   Verify that `vehicles` and `vehicle_specifications` are valid Drizzle table objects.
    *   Assert that inferred types match expected interfaces (static check).

Key decisions:
-   **Strict Typing**: Use `.$type<VehicleSpecs>()` for the `specs` JSONB column.
-   **Numeric Handling**: Use `numeric` for precise values like `battery_kwh` but cast to `number` for TS convenience.
-   **Indexes**: replicate the legacy indexes exactly to maintain query performance.

Edge cases:
-   **Variant Uniqueness**: The `unique_vehicle_identity` index must handle `variant` being null. The `COALESCE(variant, '')` pattern in the legacy code handles this; ensure it is preserved.
-   **JSON Defaults**: Ensure `specs` defaults to `{}` so it's never null.

## Context
### Relevant Code
-   `legacy/lib/db/schema/vehicles.ts`: Source of truth for schema definition.
-   `lib/db/schema/vehicles.ts`: Current implementation (check for drift).
-   `lib/db/client.ts`: Database client instance.

### Patterns to Follow
-   Use `pgTable` from `drizzle-orm/pg-core`.
-   Use `sql` operator for complex index definitions.

### Dependencies
-   `drizzle-orm`
-   `drizzle-kit` (for generating migrations later, though not part of this specific task step)

### Gotchas
-   Drizzle's `numeric` returns a string by default in runtime (because of JS number precision limits). Using `.$type<number>()` only changes the TS type; ensure the app logic handles string-to-number conversion if needed, or accept it as string if precision is critical. (The legacy schema used `.$type<number>()`, so we stick with that).

---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The schema for `vehicles` and `vehicle_specifications` is correctly implemented using Drizzle ORM, adhering to strict typing requirements and replicating complex indexes from the legacy system.

### Findings
None.

### Test Assessment
- Coverage: Adequate. Tests verify schema export and type inference.
- Missing tests: None.

### What's Good
- Correct use of `pgTable`, `jsonb`, and `numeric` types.
- Strict typing with `.$type<T>()`.
- Complex indexes (e.g., `unique_vehicle_identity`) implemented correctly using `sql` and `COALESCE`.
- Proper barrel exports.
