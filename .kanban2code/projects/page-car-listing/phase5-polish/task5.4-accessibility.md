---
stage: plan
tags: [refactor, p2]
agent: planner
contexts: [ai-guide, architecture, skills/skill-tailwindcss-v4]
---

# Responsive Polish & Accessibility

## Goal

Ensure all components pass mobile/tablet/desktop breakpoints, have visible focus states for keyboard navigation, proper alt text on all images, and use semantic HTML (header, main, section, article).

## Definition of Done
- [ ] All components pass mobile/tablet/desktop breakpoints
- [ ] Focus states visible for keyboard navigation
- [ ] Alt text on all images
- [ ] Semantic HTML (header, main, section, article)
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Keyboard navigation through all interactive elements
- [ ] Screen reader announces all content

## Files
- All component files - modify - accessibility review

## Tests
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Keyboard navigation through all interactive elements
- [ ] Screen reader announces all content
- [ ] Focus states visible on all interactive elements
- [ ] All images have alt text
- [ ] Semantic HTML structure is correct

## Context

This task ensures the car listing page is fully accessible and responsive. All components created in previous phases need to be reviewed for accessibility and responsiveness.

Accessibility checklist:
- **Focus states**: All interactive elements (buttons, links, inputs) have visible focus states
- **Alt text**: All images have descriptive alt text (or empty alt text for decorative images)
- **Semantic HTML**: Use proper HTML5 elements (header, main, section, article, nav, etc.)
- **Keyboard navigation**: All interactive elements are accessible via keyboard
- **ARIA labels**: Use ARIA labels where needed for screen readers
- **Color contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text)
- **Form labels**: All form inputs have associated labels

Responsiveness checklist:
- **Mobile**: All components render correctly on mobile viewport (< 640px)
- **Tablet**: All components render correctly on tablet viewport (640px - 1024px)
- **Desktop**: All components render correctly on desktop viewport (> 1024px)
- **Breakpoints**: Use appropriate breakpoints (sm, md, lg, xl)
- **Touch targets**: Buttons and links are at least 44x44 pixels on mobile

## Notes

- Review all components created in previous phases
- Use Tailwind CSS focus utilities (focus-visible, focus-ring)
- Add alt text to all images (use vehicle data for meaningful descriptions)
- Use semantic HTML5 elements instead of div where appropriate
- Test keyboard navigation (Tab, Enter, Space, Arrow keys)
- Use Lighthouse audit to measure accessibility score
- Ensure touch targets are large enough on mobile (min 44x44px)
- Use ARIA attributes where needed (aria-label, aria-describedby, etc.)
- Test with screen reader (if available)
- Follow WCAG 2.1 AA guidelines
