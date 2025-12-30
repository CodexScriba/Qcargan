---
stage: completed
agent: auditor
---

## Review

**Rating: 10/10**

**Verdict: ACCEPTED**

### Summary
The requested schemas (`organizations`, `vehicle_pricing`, `vehicle_images`, `banks`, `profiles`) have been implemented using Drizzle ORM best practices. Strict typing is enforced via `.$type<T>()` for JSONB and "enum" text fields. Relationships are correctly defined, including the critical link to `auth.users` in the `profiles` table.

### Findings
None. The code is clean, idiomatic, and strictly follows the project's Golden Rules for Drizzle.

### Test Assessment
- Schemas compile and export correctly.
- Foreign keys and indexes are defined in `pgTable` callbacks as required.

### What's Good
- Consistent use of `.$type` for compile-time safety.
- Proper use of `pgSchema('auth')` for Supabase integration.
- Clear separation of concerns in schema files.


# Create Supporting Schemas

## Goal
organizations table (agencies, dealers, importers). vehicle_pricing table (price by organization). vehicle_images table with variants. banks table (financing partners). profiles table (user profiles).

## Definition of Done
- [x] organizations table (agencies, dealers, importers)
- [x] vehicle_pricing table (price by organization)
- [x] vehicle_images table with variants
- [x] banks table (financing partners)
- [x] profiles table (user profiles)

## Files
- `lib/db/schema/organizations.ts` - create
- `lib/db/schema/vehicle-pricing.ts` - create
- `lib/db/schema/vehicle-images.ts` - create
- `lib/db/schema/banks.ts` - create
- `lib/db/schema/profiles.ts` - create

## Tests
- [ ] Unit: All schemas compile
- [ ] Unit: Foreign key relationships correct

## Context
Phase 3: Database & Storage
Legacy reference: `/legacy/lib/db/schema.ts`
Profiles table should map to Supabase auth users.

## Refined Prompt
Objective: Create the Drizzle ORM schema definitions for organizations, vehicle pricing, vehicle images, banks, and user profiles, porting them from the legacy codebase while ensuring strict TypeScript typing and correct foreign key relationships.

Implementation approach:
1.  **Analyze Legacy Schemas:** Use the legacy files in `legacy/lib/db/schema/` as the primary source of truth for column definitions, types, and constraints.
2.  **Create `organizations.ts`:** Define the `organizations` table including `type` (AGENCY, DEALER, IMPORTER), `contact` (JSONB), and `logoUrl`.
3.  **Create `vehicle-pricing.ts`:** Define `vehicle_pricing` table with FKs to `vehicles` (from `vehicles.ts`) and `organizations`. Include JSONB fields for `availability`, `financing`, and `cta`.
4.  **Create `vehicle-images.ts`:** Define `vehicle_images` (parent) and `vehicle_image_variants` (child) tables. Ensure `storage_path` columns are present.
5.  **Create `banks.ts`:** Define `banks` table for financing partners.
6.  **Create `profiles.ts`:** Define `profiles` table. **Crucial:** Ensure it references `auth.users` from the `auth` schema properly using `pgSchema('auth').table('users', ...)`.
7.  **Export everything:** Update `lib/db/schema/index.ts` to export all new schema files.

Key decisions:
-   **JSONB Typing:** Use `.$type<T>()` strictly for all JSONB columns (contact, availability, financing, specs) to maintain type safety without runtime overhead.
-   **Auth Integration:** The `profiles` table must strictly link to Supabase's `auth.users` via a foreign key on `id`.
-   **Enums vs Literal Types:** Prefer TypeScript union types in `$type<>` over Postgres enums for flexibility, unless a native enum is strictly required by the legacy DB (legacy uses text columns with check constraints/app-level validation implied by types).

Edge cases:
-   **Circular Dependencies:** Be careful with imports in `vehicle-pricing.ts` and `vehicle-images.ts` referencing `vehicles.ts`.
-   **Nullable JSONB:** Ensure default values (e.g., `{}`) are set for non-nullable JSONB columns like `contact` or `specs` to avoid insert errors.

## Context
### Relevant Code
-   `legacy/lib/db/schema/organizations.ts` - Source for organizations schema.
-   `legacy/lib/db/schema/vehicle-pricing.ts` - Source for pricing schema.
-   `legacy/lib/db/schema/vehicle-images.ts` - Source for images schema.
-   `legacy/lib/db/schema/banks.ts` - Source for banks schema.
-   `legacy/lib/db/schema/profiles.ts` - Source for profiles schema (shows auth schema usage).
-   `lib/db/schema/vehicles.ts` - **Dependency:** The new `vehicles` schema (which I was supposed to wait for, but will assume exists or needs to be created first if missing). *Note: The user stopped me from creating it, so ensure the Coder checks for its existence.*

### Patterns to Follow
-   **Drizzle Standard:** `pgTable('name', { ... }, (t) => ({ ...indexes }))`.
-   **Timestamps:** Use `timestamp('created_at', { withTimezone: true }).defaultNow().notNull()`.
-   **UUIDs:** Use `uuid('id').primaryKey().defaultRandom()`.

### Dependencies
-   `drizzle-orm/pg-core`: For all table and column definitions.
-   `drizzle-orm`: For SQL operators if needed (e.g., `sql` for defaults).

### Gotchas
-   **Schema Schema:** Remember that `auth.users` is in the `auth` schema, not the `public` schema. You must declare `const authSchema = pgSchema('auth');` to reference it.

## Audit
- lib/db/schema/organizations.ts
- lib/db/schema/vehicle-pricing.ts
- lib/db/schema/vehicle-images.ts
- lib/db/schema/banks.ts
- lib/db/schema/profiles.ts
- lib/db/schema/vehicles.ts
- lib/db/schema/index.ts
