---
stage: plan
tags: [chore, p2]
agent: planner
contexts: [ai-guide, _context/skills/skill-next-intl.md]
parent: roadmap-legacy-transfer
---

# Create Translation Files Structure

## Goal
`messages/es.json` created with base structure. `messages/en.json` created with same structure. Common namespaces defined (common, auth, nav, vehicles).

## Definition of Done
- [ ] `messages/es.json` created with base structure
- [ ] `messages/en.json` created with same structure
- [ ] Common namespaces defined (common, auth, nav, vehicles)

## Files
- `messages/es.json` - create - Spanish translations
- `messages/en.json` - create - English translations

## Tests
- [ ] Unit: JSON files parse without errors
- [ ] Unit: Both files have matching keys

## Context
Phase 2: Internationalization & Routing
Legacy reference: `/legacy/messages/`
