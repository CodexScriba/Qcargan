---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills, skills/skill-posthog-analytics]
---

# Implement SellerCard Component

## Goal

Create a seller pricing card component that displays seller information, pricing, availability status, and provides WhatsApp and email contact buttons with PostHog tracking.

## Definition of Done
- [ ] Displays seller name, logo, and official importer badge
- [ ] Shows price and currency (formatted appropriately)
- [ ] Shows availability status with color coding (green for in stock, yellow for pre-order, etc.)
- [ ] WhatsApp button opens pre-filled message with vehicle details
- [ ] Email button opens pre-filled email with subject and body
- [ ] PostHog tracks contact clicks (event: seller_contact_clicked)
- [ ] Component is a client component ('use client' directive)
- [ ] All text uses translation keys from vehicles namespace

## Files
- `components/vehicles/seller-card.tsx` - create - seller pricing card
- `lib/posthog/events.ts` - create - event tracking helpers

## Tests
- [ ] Card renders seller info correctly
- [ ] WhatsApp link includes vehicle details (year, brand, model, URL)
- [ ] Email mailto includes subject and body with vehicle details
- [ ] PostHog event fires on WhatsApp click
- [ ] PostHog event fires on email click
- [ ] Availability status is color-coded correctly
- [ ] Official importer badge is shown when appropriate

## Context

The SellerCard component should:
- Be a client component (needs click handlers for contact buttons)
- Receive props: pricing (VehiclePricingWithOrg), vehicleInfo (brand, model, year)
- Display seller name, logo (if available), and official importer badge
- Show price with currency formatting (e.g., "$25,000 USD")
- Show availability status with appropriate color coding
- Provide WhatsApp button with pre-filled message
- Provide email button with pre-filled subject and body
- Track PostHog events on contact clicks
- Use translation keys for all text

WhatsApp message template (from translation key vehicles.contact.whatsappMessage):
"Hi! I'm interested in the {year} {brand} {model}. More info: {url}"

Email template:
Subject: "Inquiry about {year} {brand} {model}"
Body: "Hi! I'm interested in the {year} {brand} {model}. More info: {url}"

## Notes

- Use 'use client' directive at the top of the file
- Use lucide-react icons for WhatsApp and email buttons
- Format price with appropriate locale and currency
- Use Badge component for availability status with color variants
- Use Badge component for official importer badge
- WhatsApp link format: https://wa.me/{phone}?text={encoded_message}
- Email mailto format: mailto:{email}?subject={encoded_subject}&body={encoded_body}
- Track PostHog event: `posthog.capture('seller_contact_clicked', { seller_id, seller_name, contact_type, vehicle_id, vehicle_slug, price_amount, price_currency })`
- Create helper functions in lib/posthog/events.ts for consistent event tracking
- Use translation keys from vehicles namespace
