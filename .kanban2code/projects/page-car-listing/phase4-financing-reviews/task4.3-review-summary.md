---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills]
---

# Implement ReviewSummary Component

## Goal

Create a review sentiment display component that shows positive/neutral/negative percentages with color-coded bars, hidden when no sentiment data exists, and includes a placeholder message for no reviews.

## Definition of Done
- [ ] Displays positive/neutral/negative percentages
- [ ] Color-coded bars (green for positive, yellow for neutral, red for negative)
- [ ] Hidden when no sentiment data (all percentages null)
- [ ] Placeholder message for no reviews (e.g., "No reviews yet")
- [ ] Component is a server component (no interactivity needed)
- [ ] All text uses translation keys from vehicles namespace

## Files
- `components/vehicles/review-summary.tsx` - create - sentiment display

## Tests
- [ ] Percentages render correctly
- [ ] Colors match sentiment (green/yellow/red)
- [ ] Component hidden when all percentages null
- [ ] Translation keys render correctly in English and Spanish

## Context

The ReviewSummary component should:
- Be a server component (displays data, no interactivity)
- Receive props: positivePercent (number | null), neutralPercent (number | null), negativePercent (number | null)
- Display sentiment percentages with color-coded bars
- Use green for positive, yellow for neutral, red for negative
- Hide the entire component when all percentages are null
- Show a placeholder message when no reviews exist
- Use translation keys for all text

Note: This is a placeholder for the future review system. The review backend doesn't exist yet, so sentiment data will be null for now. When the review system is built, this component will display real sentiment data.

## Notes

- Use Progress or Bar component from Shadcn UI for percentage bars
- Use color variants for sentiment (green-500 for positive, yellow-500 for neutral, red-500 for negative)
- Format percentages appropriately (e.g., "75%", "15%", "10%")
- Hide component when all percentages are null
- Show placeholder message like "No reviews yet. Be the first to review this vehicle!"
- Use translation keys from vehicles namespace
- Follow existing component patterns from the codebase
