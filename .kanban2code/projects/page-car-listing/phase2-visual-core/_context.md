# Phase 2: Visual Core Components

## Goals

Build the gallery and specifications display components that form the visual core of the car listing page. These components showcase the vehicle's images and technical specifications.

## Current State

- Phase 1 completed: page container, data fetching, and header component are in place
- Vehicle data includes images, specifications, and description
- Shadcn UI components (Card, Button, etc.) are available
- embla-carousel-react is available for image carousel

## Dependencies

- Vehicle data fetched via `getVehicleBySlug(slug)` includes images and specs
- VehicleHeader component exists and displays title
- Page container is set up to receive and pass vehicle data

## Decisions

- VehicleGallery is a client component (needs state for active image and carousel navigation)
- VehicleQuickSpecs is a server component (displays data, no interactivity)
- VehicleDetailedSpecs is a server component (displays data, no interactivity)
- VehicleDescription is a server component (displays text, no interactivity)
- Use embla-carousel-react for image carousel with swipe support

## What Next Tasks Should Assume

- VehicleGallery receives images array and vehicleTitle as props
- VehicleQuickSpecs receives rangeKm, batteryKwh, acceleration0To100 as props
- VehicleDetailedSpecs receives specifications and specs (JSONB) as props
- VehicleDescription receives description text as props
- All components use translation keys from vehicles namespace
- Components follow existing Shadcn UI patterns
