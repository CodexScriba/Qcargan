# Task 3 Audit – Data Fetching Architecture

## Inputs Reviewed
- `docs/Phase 1/Task1.md` (schema + index contract) and `docs/architecture.md` (Next.js 16 + Drizzle data layer expectations)
- `docs/Phase 1/Task2.md` (i18n + SEO context for downstream consumers)
- `docs/Phase 1/Task3.md` (authoritative requirements for query functions)
- Implementation in `lib/db/queries/*.ts`
- Completion report `docs/Phase 1/hands-off/task3completed.md`

## High-Level Assessment
- ✅ Required query files (`vehicles.ts`, `organizations.ts`, `banks.ts`) exist and export the functions promised in the completion report.
- ✅ Auxiliary helpers (`getBrands`, `getBodyTypes`, organization/bank filters) align with future UI needs from Tasks 4–5.
- ⚠️ Several behaviours claimed as "complete" in `task3completed.md` do not match the Task 3 success criteria, mainly around filtering, pagination accuracy, and query efficiency. These gaps will surface immediately once the listings page begins relying on these utilities.

## Findings

1. **Filter chaining drops previously applied predicates**  
   - `getVehicles` builds a base `where(and(...whereConditions))` but then overwrites that predicate every time a spec filter is applied (`query = query.where(...)` at `lib/db/queries/vehicles.ts:205-245`). In Drizzle, `where` does not merge consecutively; later calls replace the earlier clause. As soon as a `bodyType`, `rangeMin`, or `seatsMin` filter is used, the mandatory `isPublished = true` and optional `brand` filters from Task 3 (`docs/Phase 1/Task3.md:142-169`) are discarded. This violates the "Filters and sorting work correctly" success criterion and risks leaking draft vehicles.  
   - **Fix**: accumulate all predicates in an array (including spec filters) and call `.where(and(...allConditions))` once, or explicitly wrap in `and(existingWhere, newPredicate)` as Drizzle recommends.

2. **Price filtering happens after pagination, producing incorrect slices**  
   - Lines `317-346` perform `priceMin/priceMax` filtering after the SQL query has already enforced `limit/offset`. When a price range is applied, vehicles beyond the first page never get considered, so users can receive fewer than `limit` results even though qualifying vehicles exist. Task 3 explicitly lists price-filter testing in the checklist (`docs/Phase 1/Task3.md:544-546`), implying it should work in combination with pagination.  
   - **Fix**: move price filtering into SQL by joining/sub-querying `vehicle_pricing` (leveraging the price indexes described in Task 1) or, at minimum, filter prior to applying pagination so the slice reflects the user’s constraints.

3. **`sortOrder` ignored for `sortBy = "newest"`**  
   - Task 3 exposes `sortOrder?: 'asc' | 'desc'` (`docs/Phase 1/Task3.md:122-134`). Implementation honours it for `price` and `range` but forces `desc` for the default "newest" path (`lib/db/queries/vehicles.ts:248-257`). This makes the API parameter misleading and prevents ascending chronology views that designers might request in Task 5.  
   - **Fix**: conditionally apply `asc(vehicles.createdAt)` when callers choose `sortOrder = 'asc'`.

4. **Pagination metadata is unreliable**  
   - The returned `total` and `hasMore` fields (`lib/db/queries/vehicles.ts:339-346`) are derived from the filtered page slice, not from the overall matching record count. After any price filtering (finding #2) the `total` shrinks to "number returned on this page" and `hasMore` flips to `false` even when additional matches remain. This breaks pagination controls planned for Task 5 and contradicts the "pagination" requirement in Task 3’s scope.  
   - **Fix**: compute a separate count (or reuse `totalRows` window function) before pagination, and base `hasMore` on whether `offset + filteredVehicles.length < totalMatches`.

5. **N+1 query pattern contradicts Phase 1 performance advice**  
   - Each vehicle triggers two additional queries (hero image + pricing summary) in the enrichment loop (`lib/db/queries/vehicles.ts:264-315`). Task 3’s performance notes say direct JOINs are “fast enough” for six vehicles and defer materialized views until Phase 2 (`docs/Phase 1/Task3.md:506-515`). With the current approach, even six vehicles require 13 SQL round trips (1 base + 12 per-row), which will regress further once pagination increases.  
   - **Fix**: fetch hero images and pricing summaries via LEFT JOINs or batched IN queries so Phase 1 stays within the single-query expectation and remains aligned with the architecture guidance on Server Component efficiency (`docs/architecture.md:1-60`).

## Recommendations
1. Refactor `getVehicles` to collect *all* filter predicates before invoking `.where` so Task 1’s published/index guarantees are preserved. 
2. Push price filtering/sorting into SQL (CTE or window function) and derive accurate pagination metadata using a matching COUNT query. 
3. Respect the caller-provided `sortOrder` for every `sortBy` mode to keep the API contract honest. 
4. Replace the per-vehicle enrichment loop with JOINs or grouped queries to meet the performance assumptions documented for Phase 1.  
5. After the fixes, update `docs/Phase 1/hands-off/task3completed.md` so it no longer overstates compliance (e.g., "filters and pagination work correctly").

## Audit Response (2025-11-06)

### Finding 1: Filter chaining drops predicates
**Status**: ✅ ACCEPTED
**Reasoning**: Correct - Drizzle's `.where()` replaces rather than merges conditions. This is a critical security bug that could leak unpublished vehicles.
**Action**: Accumulate all predicates in `whereConditions` array and call `.where(and(...))` once.

### Finding 2: Price filtering after pagination
**Status**: ✅ ACCEPTED
**Reasoning**: Correct - In-memory price filtering after SQL pagination produces incorrect result sets. Users miss qualifying vehicles on subsequent pages.
**Action**: Join `vehicle_pricing` table with MIN aggregate in SQL, apply price filters before pagination.

### Finding 3: sortOrder ignored for newest
**Status**: ✅ ACCEPTED
**Reasoning**: Correct - API promises `sortOrder` but hardcodes `desc` for "newest". This breaks the interface contract.
**Action**: Conditionally apply `asc` or `desc` based on `sortOrder` parameter for all sort modes.

### Finding 4: Pagination metadata unreliable
**Status**: ✅ ACCEPTED
**Reasoning**: Correct - `total` and `hasMore` calculated from filtered slice, not actual match count. This will break pagination controls.
**Action**: Add separate COUNT query to get accurate total before pagination. Calculate `hasMore` from total count.

### Finding 5: N+1 query pattern
**Status**: ✅ ACCEPTED
**Reasoning**: Correct - 13 queries for 6 vehicles contradicts "direct JOINs are fast enough" guidance from Task 3. This will get worse with more vehicles.
**Action**: Use LEFT JOINs with aggregation for hero images and pricing in single query.

## Implementation Plan

1. ✅ **DONE** - Rewrite `getVehicles` to accumulate all WHERE conditions
2. ✅ **DONE** - Add `vehicle_pricing` LEFT JOIN with MIN aggregate in main query
3. ✅ **DONE** - Move price filtering to SQL WHERE clause
4. ✅ **DONE** - Add COUNT query for accurate pagination metadata
5. ✅ **DONE** - Use batched query (inArray) for hero images to eliminate N+1
6. ✅ **DONE** - Honor `sortOrder` for all `sortBy` modes
7. ⏳ **PENDING** - Update `task3completed.md` with corrected performance claims

## Implementation Details (2025-11-06)

### Query Count Reduction

- **Before**: 13 queries for 6 vehicles (1 main + 2 per vehicle)
- **After**: 3 queries total (1 count + 1 main + 1 batched hero images)
- **Improvement**: 77% reduction in database round trips

### SQL Changes

- Added `pricingSubquery` as LEFT JOIN with GROUP BY for aggregation
- Moved price filters from JavaScript to SQL WHERE clause
- Added separate COUNT query with same conditions for accurate pagination
- Used `inArray()` for batched hero image fetching (1 query instead of N)

### Code Location

All fixes implemented in `lib/db/queries/vehicles.ts:176-374`

## Next Validation Steps
- Re-run the Task 3 testing checklist once the above issues are resolved, especially combination cases (brand + bodyType + price filters with pagination).
- Wire these queries into the Task 4/5 pages and smoke-test on seeded data to ensure the architecture described in `docs/architecture.md` holds up in Server Components.
