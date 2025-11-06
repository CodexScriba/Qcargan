import { eq, sql } from 'drizzle-orm';
import { pgTable, uuid, text, boolean, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export type OrganizationContact = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  [key: string]: unknown;
};

export type OrganizationLocalizedText = Record<string, string>;

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),

  // Basic Info
  name: text('name').notNull(),
  type: text('type').notNull().$type<'AGENCY' | 'DEALER' | 'IMPORTER'>(),

  // Branding
  logoUrl: text('logo_url'),

  // Contact (JSONB for flexibility)
  contact: jsonb('contact').default({}).$type<OrganizationContact>().notNull(),
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
  badges: text('badges').array().default(sql`'{}'::text[]`).notNull(),

  // Display
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Future i18n
  descriptionI18n: jsonb('description_i18n').$type<OrganizationLocalizedText>(),
}, (table) => ({
  slugIdx: index('idx_organizations_slug').on(table.slug),
  uniqueSlug: uniqueIndex('unique_organizations_slug').on(table.slug),
  typeIdx: index('idx_organizations_type').on(table.type),
  activeIdx: index('idx_organizations_active').on(table.isActive)
    .where(eq(table.isActive, true)),
}));
