# Phase 1: Foundation & Data Layer

## Goals

Establish the page container, data fetching layer, and header component. This phase creates the foundation that all subsequent components will build upon.

## Current State

- Page scaffold exists at `app/[locale]/cars/[slug]/page.tsx`
- Vehicle query function exists at `lib/db/queries/vehicles.ts`
- VehicleHeader component exists at `components/vehicles/vehicle-header.tsx`
- Supabase schema is in place (vehicles, vehicle_specifications, vehicle_pricing, vehicle_images, organizations, banks)

## Dependencies

- Drizzle ORM queries must return complete data shape
- Server component pattern for data fetching
- i18n translation keys for vehicles namespace

## Decisions

- Server-first architecture: all data fetched on server, passed as props
- No client-side data fetching in this phase
- TypeScript types exported from query functions for type safety

## What Next Tasks Should Assume

- Page container fetches vehicle data via `getVehicleBySlug(slug)`
- Vehicle data includes: specs, images, pricing, and organization info
- Header component receives vehicle data as props
- Translation keys exist for all vehicle-related text
