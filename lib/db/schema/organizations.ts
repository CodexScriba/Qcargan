import { pgTable, uuid, text, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),

  // Basic Info
  name: text('name').notNull(),
  type: text('type').notNull().$type<'AGENCY' | 'DEALER' | 'IMPORTER'>(),

  // Branding
  logoUrl: text('logo_url'),

  // Contact (JSONB for flexibility)
  contact: jsonb('contact').default({}).notNull(),
  /* Example:
  {
    "phone": "+506-1234-5678",
    "email": "ventas@byd.cr",
    "whatsapp": "+506-8765-4321",
    "address": "San José, Costa Rica"
  }
  */

  // Status/Badges
  official: boolean('official').default(false).notNull(),
  badges: text('badges').array().default([]).notNull(),

  // Display
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Future i18n
  descriptionI18n: jsonb('description_i18n'),
}, (table) => ({
  slugIdx: index('idx_organizations_slug').on(table.slug),
  typeIdx: index('idx_organizations_type').on(table.type),
  activeIdx: index('idx_organizations_active').on(table.isActive)
    .where(table.isActive.eq(true)),
}));
