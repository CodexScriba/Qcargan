---
stage: completed
tags:
  - architecture
  - p0
  - architecture-complete
agent: architect
contexts:
  - ai-guide
  - architecture
parent: 1767766898831-car-listing-page
skills: []
---

# Architecture: Car Listing Page

## Goal

Add technical design, phases, and task breakdown to the Car Listing Page roadmap. Define the component structure, data flow, and implementation order.

## Input

Roadmap: `.kanban2code/projects/page-car-listing/car-listing-page-roadmap.md`

## Key Decisions Needed

1. **Component architecture**: Define the exact component tree and props interface for each section
2. **Data fetching strategy**: Server components vs. client components, query structure
3. **Accessories/Services schema**: Determine if new tables are needed or if existing schema can be extended
4. **Phase breakdown**: Order of implementation (which components first, dependencies)
5. **PostHog event schema**: Define the tracking events for contact actions

## Notes

- Some code files were prematurely created in `lib/db/queries/vehicles.ts` and `app/[locale]/cars/[slug]/page.tsx`—review and incorporate or replace as needed
- A `VehicleHeader` component was started at `components/vehicles/vehicle-header.tsx`—review for alignment with architecture decisions
- Reference image at `car_page_example.png` for visual design

# Car Listing Page

## Overview

The Car Listing Page is a comprehensive vehicle detail page that serves as the central hub for EV buyers in Costa Rica. When a user navigates to `/cars/[slug]`, they see everything they need to make an informed purchase decision: vehicle specifications, pricing from multiple sellers, financing options from partner banks, user reviews, related accessories, and EV services.

This page embodies QuéCargan's core value proposition: connecting buyers with sellers, banks, and service providers while providing the most complete and transparent EV information in Costa Rica. It's not a sales page—it's an information and connection hub.

The page pulls real data from Supabase (schema already exists) and tracks user engagement via PostHog to measure which connections (seller contacts, bank inquiries, service requests) are most valuable.

## Problem Statement

EV buyers in Costa Rica lack a single source of truth for vehicle information. They must visit multiple dealer sites, call banks individually, and search for accessories and services separately. This fragmented experience leads to incomplete information, missed opportunities, and buyer frustration.

QuéCargan solves this by aggregating all relevant information and connections on one page, making the EV buying journey transparent and efficient.

## Goals

- Display comprehensive vehicle information (specs, images, description) from Supabase
- Show pricing and availability from multiple sellers with direct contact options
- Present financing partners (banks) with easy contact flow
- Display user review sentiment (placeholder until review system is built)
- Showcase related accessories from accessory sellers
- Highlight relevant EV services and support providers
- Track all contact/connection events via PostHog for conversion insights
- Support full i18n (Spanish/English) using existing `next-intl` setup

## Non-Goals (Out of Scope)

- Review submission UI (review backend doesn't exist yet—will be a separate project)
- Vehicle comparison page (separate feature, different route)
- Financing calculator with custom inputs (banks are contact-only for now)
- Seller dashboard or inventory management
- E-commerce checkout for accessories (contact flow only)

## User Stories

### Vehicle Information
- As a buyer, I want to see high-quality images of the vehicle so that I can evaluate its appearance
- As a buyer, I want to see key specs at a glance (range, battery, acceleration) so that I can quickly assess if the vehicle meets my needs
- As a buyer, I want to see detailed specifications so that I can make an informed technical comparison
- As a buyer, I want to read a description of the vehicle so that I understand its features and positioning

### Pricing & Sellers
- As a buyer, I want to see prices from multiple sellers so that I can find the best deal
- As a buyer, I want to see availability status (in stock, pre-order, coming soon) so that I know when I can get the vehicle
- As a buyer, I want to contact a seller via WhatsApp or email so that I can inquire about purchase
- As a buyer, I want to see if a seller is an official importer so that I can trust the source

### Financing
- As a buyer, I want to see financing partner banks so that I know my loan options
- As a buyer, I want to contact a bank easily so that I can start my financing application

### Reviews
- As a buyer, I want to see overall user sentiment (positive/neutral/negative) so that I understand the community consensus
- As a buyer, I want to see this even if detailed reviews aren't available yet (placeholder with explanation)

### Accessories & Services
- As a buyer, I want to see relevant accessories (chargers, tires) so that I can plan my complete purchase
- As a buyer, I want to see EV service providers (electricians, mechanics, detailing, insurance) so that I know support is available
- As a buyer, I want to contact accessory sellers and service providers so that I can get quotes

### Engagement
- As a buyer, I want to share the vehicle page so that I can show it to family/friends
- As a buyer, I want to save the vehicle to favorites so that I can compare later

## Success Criteria

- Page loads vehicle data from Supabase (not hardcoded JSON files)
- All text is translatable via `next-intl` message keys
- Contact buttons (WhatsApp, email) fire PostHog tracking events
- Page renders correctly on mobile, tablet, and desktop
- Hero image and gallery display vehicle images from Supabase storage
- Multiple sellers displayed with their respective pricing
- Bank cards display with contact functionality
- Accessories and services sections populated (can be placeholder data initially)
- Share and favorite functionality works (favorite can use local storage initially)
- Page passes Core Web Vitals (LCP < 2.5s)

## Open Questions

1. **Accessories data model**: Do accessories and services have their own Supabase tables, or should they be added? What's the relationship to vehicles (category-based, manual curation, or tags)?

2. **Image storage**: Are vehicle images already in Supabase storage with the expected path structure, or does the upload flow need to be built?

3. **Seller contact templates**: Should WhatsApp/email messages include vehicle details automatically (year, model, price, URL)?

4. **Favorites persistence**: Local storage for anonymous users, or require login? If login required, does the profiles table need a favorites relation?

5. **Review placeholder**: What should the reviews section show when no reviews exist? "Be the first to review" CTA, or hide the section entirely?

## Notes

### Technical Constraints
- Supabase schema exists: `vehicles`, `vehicle_specifications`, `vehicle_pricing`, `vehicle_images`, `organizations`, `banks`
- Use Drizzle ORM for queries (see `lib/db/`)
- PostHog is already integrated (though there are some pre-existing build issues in `lib/posthog/client.ts`)
- Translations go in `messages/en.json` and `messages/es.json` under the `vehicles` namespace (many keys already exist)

### Design Reference
- Visual design based on `car_page_example.png` in project root
- Use existing Shadcn UI components (`Card`, `Button`, etc.)
- Follow existing patterns from homepage and auth pages

### Data Flow
- Server component fetches data via Drizzle queries
- Client components for interactive elements (gallery, share, favorite)
- No client-side data fetching—all data passed as props from server

### Dependencies
- Review system backend (future project—use placeholder for now)
- Accessories/services data model (may need schema additions)
