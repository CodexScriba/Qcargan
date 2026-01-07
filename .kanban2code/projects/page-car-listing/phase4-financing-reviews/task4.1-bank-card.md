---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills, skills/skill-posthog-analytics]
---

# Implement BankCard Component

## Goal

Create a financing partner card component that displays bank name, logo, typical APR range, and provides a contact button with PostHog tracking.

## Definition of Done
- [ ] Displays bank name and logo
- [ ] Shows typical APR range (e.g., "8% - 12%")
- [ ] Contact button (website or phone)
- [ ] PostHog tracks contact clicks (event: bank_contact_clicked)
- [ ] Component is a client component ('use client' directive)
- [ ] All text uses translation keys from vehicles namespace

## Files
- `components/vehicles/bank-card.tsx` - create - financing partner card

## Tests
- [ ] Card renders bank info correctly
- [ ] Contact link works (website or phone)
- [ ] PostHog event fires on contact click
- [ ] APR range displays correctly
- [ ] Translation keys render correctly in English and Spanish

## Context

The BankCard component should:
- Be a client component (needs click handler for contact button)
- Receive props: bank (BankData), vehicleInfo (brand, model, year)
- Display bank name and logo (if available)
- Show typical APR range (from bank data)
- Provide contact button (link to website or phone number)
- Track PostHog event on contact click
- Use translation keys for all text

Contact button behavior:
- If bank has website, link to website
- If bank has phone, link to tel:{phone}
- Track PostHog event: `posthog.capture('bank_contact_clicked', { bank_id, bank_name, contact_type, vehicle_id, vehicle_slug })`

## Notes

- Use 'use client' directive at the top of the file
- Use lucide-react icon for contact button
- Format APR range appropriately (e.g., "8% - 12%")
- Use Card component from Shadcn UI
- Use Button component for contact action
- Track PostHog event on contact button click
- Use translation keys from vehicles namespace
- Follow existing component patterns from the codebase
