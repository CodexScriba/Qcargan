---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Configure Supabase Storage

## Goal
Create storage helper functions for vehicle images.

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
Use the vehicle-images bucket created in Task 1.1.
