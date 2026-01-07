---
stage: plan
tags: [docs, p2]
agent: planner
contexts: [ai-guide, architecture, skills/skill-next-intl]
---

# Add Missing Translations

## Goal

Ensure all new UI text has translation keys and Spanish translations are complete, with no hardcoded strings in components.

## Definition of Done
- [ ] All new UI text has translation keys
- [ ] Spanish translations complete for all new keys
- [ ] No hardcoded strings in components
- [ ] Translation keys follow vehicles namespace pattern
- [ ] Both English and Spanish messages files are updated

## Files
- `messages/en.json` - modify - add new keys
- `messages/es.json` - modify - add Spanish translations

## Tests
- [ ] Page renders in Spanish without missing keys
- [ ] Page renders in English without missing keys
- [ ] No console warnings for missing translations
- [ ] All UI text is translatable

## Context

This task ensures complete i18n support for the car listing page. All new UI text from the previous phases must have translation keys in both English and Spanish.

Translation key pattern:
- Use `vehicles.` namespace prefix for all vehicle-related keys
- Use nested structure for organization (e.g., `vehicles.specs.range`, `vehicles.contact.whatsappMessage`)
- Follow existing patterns in messages files

Areas needing translation:
- VehicleHeader: title format, body type labels, share/favorite button text
- VehicleGallery: alt text placeholders
- VehicleQuickSpecs: spec labels (range, battery, acceleration)
- VehicleDetailedSpecs: spec category labels and field labels
- VehicleDescription: section header
- SellerCard: labels, availability status, contact button text, WhatsApp/email templates
- PricingSection: section header, empty state
- BankCard: labels, contact button text
- FinancingSection: section header, description
- ReviewSummary: section header, sentiment labels, placeholder message
- AccessoriesSection: section header, card titles
- ServicesSection: section header, card titles

## Notes

- Review all components created in previous phases
- Identify any hardcoded strings
- Add translation keys to messages/en.json
- Add Spanish translations to messages/es.json
- Use consistent naming conventions
- Test both English and Spanish locales
- Use existing translation keys where available
- Follow the existing pattern in messages files
