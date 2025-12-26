---
stage: completed
created: 2025-12-26T06:42:48.793Z
completed: 2025-12-26T07:03:12.297Z
agent: roadmapper
tags: [roadmap, p0, rebuild, security]
---

# Legacy-transfer

There is a folder called /home/cynic/workspace/Qcargan/legacy which contained an old codebase. We're staring from scratch, I need to create a list of things that are already done, and redo them better in a way that make sense, from fonts, i18n, supabase integration, authentication, page content

## Outcome

### Deliverables Created

1. **Roadmap Document**: `.kanban2code/projects/legacy-transfer/roadmap-legacy-transfer.md`
   - Comprehensive vision for the rebuild
   - 8 phases with 34 tasks
   - All features to rebuild documented
   - Decisions captured (Supabase, hosting, etc.)

2. **Architect Task**: `.kanban2code/projects/legacy-transfer/1766732592297-architecture-design.md`
   - Handoff to create ARCHITECTURE.md
   - Break down phases into individual tasks

### Key Decisions Made

- **Supabase**: Entirely new project (delete and recreate)
- **Database data**: Fresh start, re-enter later
- **PostHog**: Include, integrate at later stages
- **Hosting**: Coolify on Hostinger

### Legacy Analysis Summary

Explored and documented:
- Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui stack
- Poppins font (weights 400-800)
- next-intl with Spanish default, English secondary
- Supabase Auth (email/password), PostgreSQL via Drizzle, Storage
- 7 public pages, 6 auth pages, admin dashboard
- Glassmorphic design system with 170+ CSS variables
