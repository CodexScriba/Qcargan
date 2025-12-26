---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Integrate PostHog

## Goal
Set up PostHog analytics for client and server-side tracking.

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
Initialize differently for server vs client. Track key user actions.
