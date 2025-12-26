---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Fresh Supabase Project

## Goal
Set up a new Supabase project with fresh credentials and configure basic infrastructure.

## Definition of Done
- [ ] New Supabase project created (delete old if same name)
- [ ] Project URL and keys retrieved
- [ ] RLS enabled by default on all tables
- [ ] Storage bucket "vehicle-images" created with public access

## Files
- No code files - Supabase dashboard setup

## Tests
- [ ] Manual: Can access Supabase dashboard
- [ ] Manual: Project URL responds to health check

## Context
This is the first step in the security-first rebuild. All credentials must be fresh and rotated from the legacy project.
