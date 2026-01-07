# Phase 4: Financing & Reviews

## Goals

Build bank cards and review sentiment display. This phase enables users to see financing partner banks and understand user review sentiment.

## Current State

- Phase 1-3 completed: page container, data fetching, header, gallery, specs, and seller components are in place
- Bank data is available in the database
- Review sentiment data structure is defined (though backend doesn't exist yet)
- PostHog event tracking helpers are available

## Dependencies

- Bank data fetched via `getFeaturedBanks()` or similar query
- Page container is set up to receive and pass bank data
- PostHog client is available for tracking

## Decisions

- BankCard is a client component (needs click handlers for contact buttons)
- FinancingSection is a server component (displays bank cards)
- ReviewSummary is a server component (displays sentiment data)
- ReviewSummary is hidden when no sentiment data exists (placeholder for future review system)
- Bank cards show typical APR range (from bank data)

## What Next Tasks Should Assume

- BankCard receives bank data and vehicleInfo as props
- Contact button links to bank website or phone number
- PostHog tracks bank contact clicks
- ReviewSummary receives sentiment percentages as props
- ReviewSummary is hidden when all percentages are null
- FinancingSection is a horizontal scrollable row of bank cards
