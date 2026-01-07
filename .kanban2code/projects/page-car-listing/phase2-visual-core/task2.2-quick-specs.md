---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/skill-tailwindcss-v4]
---

# Implement VehicleQuickSpecs Component

## Goal

Create a specs summary bar component that displays range, battery, and acceleration in a horizontal layout with proper handling of missing values and responsive design.

## Definition of Done
- [ ] Displays range (in km), battery (in kWh), and acceleration (0-100 in seconds) in horizontal bar
- [ ] Missing values show "—" placeholder
- [ ] Responsive layout (stacks on mobile, horizontal on desktop)
- [ ] Component is a server component (no interactivity needed)
- [ ] All labels use translation keys from vehicles namespace
- [ ] Icons for each spec (range, battery, acceleration)

## Files
- `components/vehicles/vehicle-quick-specs.tsx` - create - specs summary bar

## Tests
- [ ] Renders all three specs when available
- [ ] Handles null values gracefully (shows "—")
- [ ] Layout adapts to mobile viewport (stacks vertically)
- [ ] Layout adapts to desktop viewport (horizontal bar)
- [ ] Translation keys render correctly in English and Spanish

## Context

The VehicleQuickSpecs component should:
- Be a server component (displays data, no interactivity)
- Receive props: rangeKm (number | null), batteryKwh (number | null), acceleration0To100 (number | null)
- Display the three key specs in a horizontal bar on desktop
- Stack vertically on mobile for better readability
- Show "—" for missing values instead of hiding the spec
- Use icons for visual clarity (range icon, battery icon, acceleration icon)
- Use translation keys for labels (e.g., vehicles.specs.range, vehicles.specs.battery, vehicles.specs.acceleration)
- Follow existing Shadcn UI patterns

## Notes

- Use lucide-react icons for each spec type
- Format numbers appropriately (e.g., "450 km", "60 kWh", "7.5 s")
- Use flexbox for horizontal layout on desktop
- Use flex-col for vertical stacking on mobile
- Use responsive breakpoints (md or lg) for layout changes
- Use translation keys from vehicles namespace
- Follow existing component patterns from the codebase
