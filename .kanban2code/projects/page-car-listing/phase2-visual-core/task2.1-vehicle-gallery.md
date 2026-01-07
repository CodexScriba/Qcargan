---
stage: plan
tags: [feature, p1]
agent: planner
contexts: [ai-guide, architecture, skills/react-core-skills, skills/skill-design-system]
---

# Implement VehicleGallery Component

## Goal

Create an image carousel component that displays the vehicle's images with a hero image, thumbnail strip, click navigation, keyboard navigation (left/right arrows), and mobile-friendly swipe support.

## Definition of Done
- [ ] Hero image displays prominently
- [ ] Thumbnail strip shows all images below the hero
- [ ] Click thumbnail changes main image
- [ ] Keyboard navigation works (left/right arrows)
- [ ] Mobile-friendly with swipe support
- [ ] Component is a client component ('use client' directive)
- [ ] Handles single image gracefully (no thumbnails shown)
- [ ] Handles zero images (placeholder shown)
- [ ] Alt text on all images (from altText field or fallback to vehicleTitle)

## Files
- `components/vehicles/vehicle-gallery.tsx` - create - image carousel component

## Tests
- [ ] Gallery renders with multiple images
- [ ] Gallery handles single image gracefully
- [ ] Gallery handles zero images (placeholder shown)
- [ ] Thumbnail click changes active image
- [ ] Left/right arrow keys navigate through images
- [ ] Swipe gestures work on mobile
- [ ] Alt text is present on all images

## Context

The VehicleGallery component should:
- Be a client component (needs state for active image)
- Receive props: images (array of VehicleImage), vehicleTitle (for alt text fallback)
- Use embla-carousel-react for carousel functionality
- Display hero image prominently (larger size)
- Show thumbnail strip below hero
- Support click navigation (click thumbnail to change active image)
- Support keyboard navigation (left/right arrows)
- Support swipe gestures on mobile
- Handle edge cases: single image, zero images
- Use proper alt text for accessibility
- Construct image URLs from storagePath: `{SUPABASE_URL}/storage/v1/object/public/vehicles/{storagePath}`

## Notes

- Use 'use client' directive at the top of the file
- Use embla-carousel-react for carousel and swipe support
- Construct image URLs using the Supabase storage URL pattern
- Use altText from image data, fallback to vehicleTitle
- For zero images, show a placeholder with vehicle name
- For single image, don't show thumbnail strip
- Follow existing Shadcn UI patterns
- Use Next.js Image component for optimization
