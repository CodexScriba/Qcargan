---
stage: plan
tags: [feature, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-posthog-analytics.md]
parent: roadmap-legacy-transfer
---

# Integrate PostHog

## Goal
PostHog client SDK configured. Server-side tracking available. Page views tracked automatically. Key events defined (signup, login, vehicle_view).

## Definition of Done
- [ ] PostHog client SDK configured
- [ ] Server-side tracking available
- [ ] Page views tracked automatically
- [ ] Key events defined (signup, login, vehicle_view)

## Files
- `lib/posthog/client.ts` - create - client provider
- `lib/posthog/server.ts` - create - server client
- `app/layout.tsx` - modify - add PostHog provider

## Tests
- [ ] Integration: Page views appear in PostHog
- [ ] Integration: Custom events tracked

## Context
Phase 8: Analytics & Deployment
Strictly separate client tracking from server tracking.
Flush server events in short-lived runtimes.
Legacy reference: `/legacy/instrumentation-client.ts` (if relevant)
