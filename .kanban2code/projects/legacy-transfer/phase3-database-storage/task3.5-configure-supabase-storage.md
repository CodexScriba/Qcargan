---
stage: completed
tags:
  - feature
  - p2
agent: auditor
contexts:
  - ai-guide
  - _context/skills/skill-supabase-ssr.md
parent: roadmap-legacy-transfer
---

# Configure Supabase Storage

## Goal
Storage helper functions created. getPublicImageUrl returns CDN URLs. Path structure follows convention: vehicles/{brand}/{model}-{variant}-{type}.jpg.

## Definition of Done
- [x] Storage helper functions created
- [x] getPublicImageUrl returns CDN URLs
- [x] Path structure follows convention: vehicles/{brand}/{model}-{variant}-{type}.jpg

## Files
- `lib/supabase/storage.ts` - create - storage helpers

## Tests
- [x] Unit: getPublicImageUrl generates correct URL format
- [x] Integration: Can upload and retrieve test image

## Context
Phase 3: Database & Storage
Bucket "vehicle-images" must be created first in Task 1.1.

## Refined Prompt
Objective: Create Supabase Storage helper functions for vehicle image URL generation.

Implementation approach:
1. Create `lib/supabase/storage.ts` with helper functions
2. Implement `getPublicImageUrl()` for single image URL generation
3. Implement `getPublicImageUrls()` for batch URL generation
4. Implement `imageExists()` for file existence checking
5. Add test coverage for all functions

Key decisions:
- Use `@supabase/supabase-js` client: The project uses `@supabase/supabase-js` (see [`lib/supabaseClient.ts`](lib/supabaseClient.ts:1)) rather than SSR client for storage operations
- Fallback to service role: Use `SUPABASE_SERVICE_ROLE_KEY` for storage operations outside Next.js request context (scripts/tests)
- Signed URL first: Try signed URLs first (works for both public/private buckets), fall back to public URLs
- External URL passthrough: Return URLs as-is if they already start with `http://` or `https://`
- Bucket constant: Use `"vehicle-images"` as the default bucket name

Edge cases:
- Empty or whitespace-only storage paths: Return empty string
- External URLs already in storage_path field: Return as-is without modification
- Signed URL generation failures: Fall back to public URL
- Missing files: `imageExists()` should return false gracefully

## Context
### Relevant Code
- [`legacy/lib/supabase/storage.ts`](legacy/lib/supabase/storage.ts:1) - Reference implementation with all helper functions
- [`legacy/lib/supabase/server.ts`](legacy/lib/supabase/server.ts:1) - Server client pattern with cookie handling
- [`lib/supabase/proxy.ts`](lib/supabase/proxy.ts:1) - Session update middleware using `@supabase/ssr`
- [`lib/supabaseClient.ts`](lib/supabaseClient.ts:1) - Current Supabase client singleton using `@supabase/supabase-js`
- [`lib/db/schema/vehicle-images.ts`](lib/db/schema/vehicle-images.ts:17) - Schema defines `storagePath` column for image paths
- [`scripts/verify-supabase-storage.ts`](scripts/verify-supabase-storage.ts:59) - Script verifies bucket "vehicle-images" exists and is public

### Patterns to Follow
- Use dependency injection pattern with `StorageDeps` type for testability (see [`legacy/lib/supabase/storage.ts:11-13`](legacy/lib/supabase/storage.ts:11))
- Implement `__setStorageClientFactory()` for test overrides (see [`legacy/lib/supabase/storage.ts:57-61`](legacy/lib/supabase/storage.ts:57))
- Use `SUPABASE_SERVICE_ROLE_KEY` for storage operations outside Next.js context
- Separate external URL handling from storage path processing

### Test Patterns
- Tests use vitest framework (see [`lib/db/__tests__/schema.test.ts`](lib/db/__tests__/schema.test.ts:1))
- Mock Supabase client using factory pattern (see [`legacy/tests/supabase/storage.test.ts:37-104`](legacy/tests/supabase/storage.test.ts:37))
- Track method calls with `CallTracker` for assertion verification (see [`legacy/tests/supabase/storage.test.ts:18-35`](legacy/tests/supabase/storage.test.ts:18))
- Use `beforeEach`/`afterEach` for test isolation (see [`legacy/tests/supabase/storage.test.ts:109-117`](legacy/tests/supabase/storage.test.ts:109))

### Dependencies
- `@supabase/supabase-js`: v2.87.1 - For storage client operations
- `@supabase/ssr`: v0.8.0 - For server-side auth (not used for storage operations)

### Gotchas
- Don't use SSR client for storage: Storage operations should use `@supabase/supabase-js` client, not `@supabase/ssr` createServerClient
- Service role key required: Storage operations need `SUPABASE_SERVICE_ROLE_KEY` when running outside Next.js request context
- Cookie errors in Server Components: When using SSR client, wrap `cookies.setAll()` in try/catch (see [`legacy/lib/supabase/server.ts:26-34`](legacy/lib/supabase/server.ts:26))
- Path convention: Follow `vehicles/{brand}/{model}-{variant}-{type}.jpg` format for storage paths

## Audit
lib/supabase/storage.ts
lib/supabase/__tests__/storage.test.ts
