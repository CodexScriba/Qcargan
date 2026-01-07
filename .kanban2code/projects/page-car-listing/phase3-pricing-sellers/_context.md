# Phase 3: Pricing & Seller Components

## Goals

Build seller cards with contact functionality and PostHog tracking. This phase enables users to see pricing from multiple sellers and contact them directly.

## Current State

- Phase 1 and 2 completed: page container, data fetching, header, gallery, and specs components are in place
- Vehicle data includes pricing with organization details
- PostHog is integrated (though there are some pre-existing build issues)
- Translation keys exist for contact functionality

## Dependencies

- Vehicle data fetched via `getVehicleBySlug(slug)` includes pricing with organizations
- Page container is set up to receive and pass vehicle data
- PostHog client is available for tracking

## Decisions

- SellerCard is a client component (needs click handlers for contact buttons)
- PricingSection is part of the page container (right sidebar layout)
- WhatsApp messages include vehicle details automatically
- Email messages include vehicle details automatically
- PostHog tracks all contact clicks

## What Next Tasks Should Assume

- SellerCard receives pricing (VehiclePricingWithOrg) and vehicleInfo as props
- WhatsApp link includes pre-filled message with vehicle details
- Email mailto includes subject and body with vehicle details
- PostHog event tracking helper functions exist
- Availability status is color-coded (green for in stock, yellow for pre-order, etc.)
- Official importer badge is shown when organization is official
