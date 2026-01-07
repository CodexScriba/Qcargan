---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills]
---

# Implement VehicleDescription Component

## Goal

Create a description text block component that displays the vehicle's description with proper formatting and handles null description (component not rendered).

## Definition of Done
- [ ] Displays description text with proper formatting
- [ ] Handles null description (component not rendered)
- [ ] Supports markdown-style line breaks (newlines become paragraphs)
- [ ] Component is a server component (no interactivity needed)
- [ ] Uses appropriate typography for readability

## Files
- `components/vehicles/vehicle-description.tsx` - create - description text block

## Tests
- [ ] Renders description text
- [ ] Component hidden when description is null
- [ ] Line breaks are preserved and formatted correctly
- [ ] Text is readable with appropriate spacing and typography

## Context

The VehicleDescription component should:
- Be a server component (displays text, no interactivity)
- Receive props: description (string | null)
- Render the description text with proper formatting
- Support markdown-style line breaks (convert newlines to paragraphs)
- Not render anything if description is null
- Use appropriate typography for readability (line-height, spacing)
- Follow existing Shadcn UI patterns

## Notes

- Use a simple approach for line breaks: split by newline and render each as a paragraph
- Use appropriate CSS for typography (line-height, max-width, spacing)
- Don't render the component if description is null or empty string
- Use semantic HTML (e.g., <p> tags for paragraphs)
- Follow existing component patterns from the codebase
- Keep it simple - no full markdown parser needed, just line break handling
