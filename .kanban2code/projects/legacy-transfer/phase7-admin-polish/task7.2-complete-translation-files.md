---
stage: plan
tags: [chore, p2]
agent: 04-📋planner
contexts: [ai-guide, _context/skills/skill-next-intl.md]
parent: roadmap-legacy-transfer
---

# Complete Translation Files

## Goal
All UI strings translated to Spanish and English. No missing translation warnings in console. Consistent terminology across pages.

## Definition of Done
- [ ] All UI strings translated to Spanish and English
- [ ] No missing translation warnings in console
- [ ] Consistent terminology across pages

## Files
- `messages/es.json` - modify - complete translations
- `messages/en.json` - modify - complete translations

## Tests
- [ ] Manual: No missing translation warnings
- [ ] Manual: Both locales display correctly

## Context
Phase 7: Admin & Polish
Audit all components for hardcoded strings.
Legacy reference: `/legacy/messages/`