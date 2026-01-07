---
stage: plan
tags:
  - decomposition
  - p0
agent: splitter
contexts:
  - ai-guide
  - architecture
parent: 1767766898832-architecture-car-listing-page
skills: []
---

# Split: Car Listing Page

## Goal

Generate individual task files from the roadmap. Create phase folders and task files for each task defined in the architecture.

## Input

Roadmap: `.kanban2code/projects/page-car-listing/car-listing-page-roadmap.md`

## Output

Create the following structure:

```
.kanban2code/projects/page-car-listing/
├── phase1-foundation/
│   ├── _context.md
│   ├── task1.1-verify-data-queries.md
│   ├── task1.2-page-container.md
│   └── task1.3-vehicle-header.md
├── phase2-visual-core/
│   ├── _context.md
│   ├── task2.1-vehicle-gallery.md
│   ├── task2.2-quick-specs.md
│   ├── task2.3-detailed-specs.md
│   └── task2.4-vehicle-description.md
├── phase3-pricing-sellers/
│   ├── _context.md
│   ├── task3.1-seller-card.md
│   └── task3.2-pricing-section.md
├── phase4-financing-reviews/
│   ├── _context.md
│   ├── task4.1-bank-card.md
│   ├── task4.2-financing-section.md
│   └── task4.3-review-summary.md
└── phase5-polish/
    ├── _context.md
    ├── task5.1-accessories-placeholder.md
    ├── task5.2-services-placeholder.md
    ├── task5.3-translations.md
    └── task5.4-accessibility.md
```

## Notes

- Each task file should have `stage: plan` and `agent: planner`
- Include Definition of Done, Files, Tests, and Skills from the roadmap
- Phase _context.md files should summarize phase goals and dependencies
- Tasks within a phase can be worked in parallel unless explicitly dependent
