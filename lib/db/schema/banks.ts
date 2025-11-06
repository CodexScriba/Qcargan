import { pgTable, uuid, text, numeric, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const banks = pgTable('banks', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),

  // Basic Info
  name: text('name').notNull(),
  logoUrl: text('logo_url'),

  // Contact/Links
  websiteUrl: text('website_url'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),

  // Generic Rates (for display only, not vehicle-specific)
  typicalAprMin: numeric('typical_apr_min', { precision: 4, scale: 2 }),
  typicalAprMax: numeric('typical_apr_max', { precision: 4, scale: 2 }),
  typicalTermMonths: integer('typical_term_months').array(),

  // Display
  description: text('description'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_banks_slug').on(table.slug),
  featuredIdx: index('idx_banks_featured')
    .on(table.isFeatured, table.displayOrder)
    .where(table.isFeatured.eq(true)),
}));
