---
stage: plan
tags: [feature, p1]
agent: coder
contexts: []
---

# Create Translation Files Structure

## Goal
Set up Spanish and English translation files with matching structure.

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
Keep files under 500KB. Split into multiple files if needed.
