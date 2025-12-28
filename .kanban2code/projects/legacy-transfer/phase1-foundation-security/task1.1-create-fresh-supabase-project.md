---
stage: plan
tags: [chore, p1]
agent: planner
contexts: [ai-guide, _context/skills/skill-supabase-ssr.md]
parent: roadmap-legacy-transfer
---

# Create Fresh Supabase Project

## Goal
New Supabase project created (delete old if same name) and project URL and keys retrieved. RLS enabled by default on all tables. Storage bucket "vehicle-images" created with public access.

## Definition of Done
- [ ] New Supabase project created
- [ ] Project URL and keys retrieved
- [ ] RLS enabled by default on all tables
- [ ] Storage bucket "vehicle-images" created with public access

## Files
- No code files - Supabase dashboard setup

## Tests
- [ ] Manual: Can access Supabase dashboard
- [ ] Manual: Project URL responds to health check

## Context
Phase 1: Foundation & Security
Supabase: Entirely new project (same name, delete and recreate from scratch)
