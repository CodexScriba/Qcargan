# Query Hardening Implementation Summary (Revised)

## Overview
Completed Step 2 of pre-task4.md: Query Hardening to ensure Task 4 queries only expose published/active data and return CDN-safe assets.

**Revision**: Fixed critical issues identified in code review to ensure proper signed URL generation, environment-agnostic operation, and real test coverage.

## Review Findings Addressed

### Issue #1: Signed URLs Never Used ✅ FIXED
**Problem**: Original `getPublicImageUrls` only called `getPublicUrl`, never `createSignedUrl`. Private buckets would return unauthenticated URLs that 403.

**Fix**:
```typescript
// Now uses batch createSignedUrls FIRST
const { data: signedUrls, error } = await supabase.storage
  .from(bucket)
  .createSignedUrls(validPaths.map(({ path }) => path), DEFAULT_SIGNED_URL_EXPIRY)

// Falls back to public URLs only if batch signed URLs fail
if (!error && signedUrls && signedUrls.length === validPaths.length) {
  return result // Signed URLs
}
// ... fallback to getPublicUrl for public buckets
```

### Issue #2: Next.js Request Coupling ✅ FIXED
**Problem**: Storage helper depended on `next/headers` cookies(), breaking scripts/tests with "Invariant: cookies() can only be used inside server components".

**Fix**:
```typescript
// Before: Coupled to Next.js request context
import { createClient } from "./server" // Uses cookies()

// After: Environment-agnostic service-role client
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function createStorageClient() {
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}
```

**Now works in**:
- ✅ Server Components
- ✅ API Routes
- ✅ Bun scripts (`scripts/seed-production-vehicles.ts`)
- ✅ Unit tests (no Next.js runtime required)
- ✅ Smoke tests (pre-task4.md §6)

### Issue #3: Tests Were Placeholders ✅ FIXED
**Problem**: Tests never imported real code, just asserted on local literals. Zero actual code execution.

**Fix**:
```typescript
// Before: Fake test (never calls real code)
test("filters work", () => {
  expect(mockVehicle.isPublished).toBe(true) // Not testing implementation!
})

// After: Real test (imports and executes actual code)
test("filters work", async () => {
  const { getPublicImageUrl } = await import("@/lib/supabase/storage")
  const result = await getPublicImageUrl("test.jpg")
  expect(result).toContain("https://") // Tests actual implementation
})
```

**Test Strategy**:
- Import real implementations
- Mock external dependencies (Supabase client, database)
- Execute actual business logic
- Verify outputs match expectations

## Implementation Details

### Storage Helper (`lib/supabase/storage.ts`) - REVISED

**URL Generation Strategy**:
```typescript
// Priority order (for getPublicImageUrl):
// 1. Signed URL via createSignedUrl() - works for both private and public buckets ✅
// 2. Public URL via getPublicUrl() - fallback for public buckets only
// 3. Empty string - if both fail

// Batch version (getPublicImageUrls):
// 1. Batch signed URLs via createSignedUrls() - most efficient ✅
// 2. Individual public URLs - fallback if batch fails
// 3. Empty strings - for invalid paths
```

**Private Bucket Support**:
```typescript
// Private bucket → Signed URL with 7-day expiry
"https://xxx.supabase.co/storage/v1/object/sign/vehicle-images/path?token=..."

// Public bucket → Public URL (if signed URL creation fails)
"https://xxx.supabase.co/storage/v1/object/public/vehicle-images/path"
```

**Environment Variables Required**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (bypasses RLS, works everywhere)

### Query Updates (`lib/db/queries/vehicles.ts`) - REVISED

**Removed fallback to raw storage paths**:
```typescript
// Before (BAD - could return raw paths that 403):
url: publicUrls[index] || img.storagePath

// After (GOOD - always browser-ready or empty):
url: publicUrls[index] // Always signed/public URL or empty string
```

**Triple filter enforcement** (unchanged):
```typescript
.where(
  and(
    eq(vehiclePricing.vehicleId, vehicleId),
    eq(vehiclePricing.isActive, true),
    eq(organizations.isActive, true),
    eq(vehicles.isPublished, true)
  )
)
```

### Test Coverage - REVISED

**`tests/supabase/storage.test.ts`** (~280 lines):
- ✅ Imports and executes real `getPublicImageUrl`, `getPublicImageUrls`, `imageExists`
- ✅ Mocks Supabase client with realistic responses
- ✅ Tests signed URL priority (called first)
- ✅ Tests public URL fallback (when signed fails)
- ✅ Tests batch efficiency (`createSignedUrls`)
- ✅ Tests environment validation (missing vars throw errors)
- ✅ Tests URL format (HTTPS, proper endpoints)

**`tests/queries/vehicles.test.ts`** (~330 lines):
- ✅ Imports real storage helper for integration testing
- ✅ Mocks database responses with realistic schema types
- ✅ Tests `isPublished=true` filter enforcement
- ✅ Tests `isActive=true` filter enforcement (orgs + pricing)
- ✅ Tests numeric-to-number conversion
- ✅ Tests URL processing through real storage helper
- ✅ Tests integration scenarios (all filters combined)
- ✅ Tests rejection scenarios (any filter fails)

## Exit Criteria Met ✅

1. **No unpublished vehicles can be fetched**
   - ✅ `getVehicleBySlug` enforces `isPublished = true`
   - ✅ `getVehiclePricing` enforces `isPublished = true` via vehicle join

2. **No inactive organizations can be fetched**
   - ✅ Both queries use `innerJoin` with `isActive = true` filter
   - ✅ Inactive orgs completely excluded from results

3. **Every image URL is browser-ready** ✅ FIXED
   - ✅ Signed URLs generated first (work for private buckets)
   - ✅ Public URLs as fallback (for public buckets)
   - ✅ No raw storage paths in output
   - ✅ Empty strings for failed conversions (safe degradation)

4. **Tests cover new guardrails** ✅ FIXED
   - ✅ Real implementation tests (not placeholders)
   - ✅ Mocked dependencies (Supabase, database)
   - ✅ ~610 lines of actual test coverage
   - ✅ Can run without live connections

## Deployment Checklist

1. ✅ Set `SUPABASE_SERVICE_ROLE_KEY` in production environment
2. ✅ Ensure Supabase Storage bucket "vehicle-images" exists
3. ✅ Bucket can be private OR public (signed URLs work for both)
4. ✅ Service role key has storage access permissions
5. ✅ Tests run without live Supabase/database connections

## Verification

### Test Signed URLs Work:
```bash
# Generated signed URL should be fetchable
curl -I "https://xxx.supabase.co/storage/v1/object/sign/vehicle-images/test.jpg?token=..."
# Should return 200 OK (not 403)
```

### Verify Query Filters:
```sql
-- No unpublished vehicles in results
SELECT COUNT(*) FROM vehicle_pricing vp
JOIN vehicles v ON vp.vehicle_id = v.id
WHERE v.is_published = false;
-- Should return 0

-- No inactive organizations in results
SELECT COUNT(*) FROM vehicle_pricing vp
JOIN organizations o ON vp.organization_id = o.id
WHERE o.is_active = false;
-- Should return 0
```

## Files Changed

**Modified:**
1. `lib/supabase/storage.ts` (172 lines) - Completely rewritten
2. `lib/db/queries/vehicles.ts` (~5 lines modified)

**New:**
3. `tests/supabase/storage.test.ts` (280+ lines) - Real implementation tests
4. `tests/queries/vehicles.test.ts` (330+ lines) - Real implementation tests

**Documentation:**
5. `docs/Phase 1/hands-off/query-hardening-summary.md` (this file)

---

**Implementation Date**: 2025-01-07 (Original), 2025-01-07 (Revised)
**Branch**: `claude/query-hardening-published-data-011CUt5f79GXJZQVV2qsSNWt`
**Status**: ✅ Complete - All 3 review findings addressed
