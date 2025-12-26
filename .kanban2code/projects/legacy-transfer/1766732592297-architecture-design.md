---
stage: code
tags:
  - architecture
  - p0
agent: coder
contexts: []
parent: 1766731368789-legacy-transfer
---

# Architecture: QueCargan Legacy Transfer

## Goal

Create the ARCHITECTURE.md document and break down the rebuild into phases and tasks.

## Input

Roadmap: `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md`

## First Deliverable: ARCHITECTURE.md

Create `/ARCHITECTURE.md` at the project root containing:

1. **Project Northstar**
   - QueCargan: Electric vehicle marketplace for the Latin American market
   - Spanish-first with English support
   - Glassmorphic design aesthetic

2. **Tech Stack Reference**
   - Framework: Next.js 16+ with App Router and Turbopack
   - Language: TypeScript 5
   - Database: PostgreSQL via Supabase + Drizzle ORM
   - Authentication: Supabase Auth (email/password)
   - i18n: next-intl (es default, en secondary)
   - Styling: Tailwind CSS v4 + shadcn/ui + Radix UI
   - Forms: React Hook Form + Zod
   - Analytics: PostHog
   - Hosting: Coolify on Hostinger

3. **Target File Tree Structure**
   - Document the intended directory structure
   - Reference legacy structure but note improvements

4. **Integration Inventory**
   - Supabase (Auth, Database, Storage)
   - next-intl (routing, translations)
   - PostHog (analytics)
   - Drizzle ORM (database)
   - shadcn/ui components

5. **Deployment Architecture**
   - Coolify configuration
   - Environment variables needed
   - Database connection (pooler vs direct)

## Reference

Legacy codebase available at `/home/cynic/workspace/Qcargan/legacy/` for reference (do not copy, rewrite).
