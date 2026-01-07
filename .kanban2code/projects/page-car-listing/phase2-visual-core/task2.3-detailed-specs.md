---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/skill-next-intl]
---

# Implement VehicleDetailedSpecs Component

## Goal

Create a full specifications display component that shows all specification fields in a grid/table layout, grouped by category (Performance, Battery, Physical), with proper handling of null values and expansion of the JSONB specs field for additional data.

## Definition of Done
- [ ] Grid/table displays all specification fields
- [ ] Specs grouped by category (Performance, Battery, Physical)
- [ ] Handles null values with "—" placeholder
- [ ] Expands JSONB specs field for additional data
- [ ] Component is a server component (no interactivity needed)
- [ ] All labels use translation keys from vehicles namespace
- [ ] Responsive layout (adapts to mobile/tablet/desktop)

## Files
- `components/vehicles/vehicle-detailed-specs.tsx` - create - full specs display

## Tests
- [ ] Renders all spec categories
- [ ] Handles partial data (some specs null)
- [ ] JSONB specs render correctly
- [ ] Translation keys render correctly in English and Spanish
- [ ] Layout is responsive across breakpoints

## Context

The VehicleDetailedSpecs component should:
- Be a server component (displays data, no interactivity)
- Receive props: specifications (VehicleSpecsData | null), specs (VehicleSpecs - JSONB extended specs)
- Display specifications in a grid or table layout
- Group specs by category: Performance, Battery, Physical
- Show "—" for null values
- Include additional specs from the JSONB specs field
- Use translation keys for all labels (e.g., vehicles.specs.wheelbase, vehicles.specs.cargoCapacity)
- Follow existing Shadcn UI patterns
- Use responsive design (grid columns adjust based on viewport)

## Notes

- Use a grid layout with responsive columns (e.g., grid-cols-2 md:grid-cols-3)
- Group specs with section headers for each category
- Include common specs: wheelbase, cargoCapacity, seatingCapacity, curbWeight, dragCoefficient, chargingTimeAC, chargingTimeDC, etc.
- Include additional specs from the JSONB specs field if present
- Use translation keys from vehicles namespace for all labels
- Format values appropriately (e.g., "2,700 mm", "400 L", "5 seats")
- Follow existing component patterns from the codebase
