---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Configure Supabase Storage

## Goal
Storage helper functions created. getPublicImageUrl returns CDN URLs. Path structure follows convention: vehicles/{brand}/{model}-{variant}-{type}.jpg.

## Definition of Done
- [ ] Storage helper functions created
- [ ] getPublicImageUrl returns CDN URLs
- [ ] Path structure follows convention: vehicles/{brand}/{model}-{variant}-{type}.jpg

## Files
- `lib/supabase/storage.ts` - create - storage helpers

## Tests
- [ ] Unit: getPublicImageUrl generates correct URL format
- [ ] Integration: Can upload and retrieve test image

## Context
Phase 3: Database & Storage
Bucket "vehicle-images" must be created first in Task 1.1.
