---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills, skills/skill-next-intl]
---

# Implement VehicleHeader Component

## Goal

Enhance the existing VehicleHeader component to display the vehicle title (year brand model), show body type badge, implement share button functionality (native share or clipboard fallback), and implement favorite button that toggles state with localStorage persistence.

## Definition of Done
- [ ] Displays vehicle title in format "YYYY Brand Model" (e.g., "2024 BYD Seagull")
- [ ] Shows body type badge (SEDAN, CITY, SUV, PICKUP_VAN) with appropriate styling
- [ ] Share button works (native share on mobile, clipboard fallback on desktop)
- [ ] Favorite button toggles state with localStorage persistence
- [ ] Component is a client component ('use client' directive)
- [ ] All text uses translation keys from vehicles namespace

## Files
- `components/vehicles/vehicle-header.tsx` - modify - enhance existing component
- `messages/en.json` - modify - verify translation keys exist
- `messages/es.json` - modify - add Spanish translations

## Tests
- [ ] Header renders correct title format
- [ ] Body type badge displays correctly
- [ ] Share copies URL to clipboard on desktop
- [ ] Share uses native share API on mobile
- [ ] Favorite state persists in localStorage across page reloads
- [ ] Component renders correctly in both English and Spanish

## Context

The VehicleHeader component should:
- Be a client component (needs useState for favorite and share functionality)
- Receive props: brand, model, year, variant, bodyType, vehicleId, shareUrl
- Display the vehicle title prominently
- Show a badge for body type if available
- Include share button that uses navigator.share() on mobile, falls back to clipboard on desktop
- Include favorite button that reads/writes to localStorage
- Use translation keys for all text
- Track share events with PostHog (event: vehicle_shared)

## Notes

- Use 'use client' directive at the top of the file
- Wrap localStorage access in useEffect or check typeof window to avoid SSR issues
- Use navigator.share() with fallback to navigator.clipboard.writeText()
- Store favoriteVehicleIds array in localStorage
- Track PostHog event when vehicle is shared: `posthog.capture('vehicle_shared', { vehicle_id, vehicle_slug, share_method })`
- Use existing translation keys or add new ones under vehicles namespace
- Follow existing component patterns from the codebase
