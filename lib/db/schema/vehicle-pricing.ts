import { pgTable, uuid, numeric, text, boolean, jsonb, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';
import { organizations } from './organizations';

export const vehiclePricing = pgTable('vehicle_pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),

  // Pricing
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull().$type<'USD' | 'CRC'>(),

  // Availability (JSONB)
  availability: jsonb('availability').default({}).notNull(),
  /* Example:
  {
    "label": "In Stock",
    "tone": "success",
    "estimated_delivery_days": 30
  }
  */

  // Financing (JSONB, optional per seller)
  financing: jsonb('financing'),
  /* Example:
  {
    "down_payment": 9000.00,
    "monthly_payment": 650.00,
    "term_months": 60,
    "apr_percent": 3.5,
    "display_currency": "USD"
  }
  */

  // Call to Action
  cta: jsonb('cta'),
  /* Example:
  {
    "label": "Contact Dealer",
    "href": "https://wa.me/50612345678?text=Interested%20in%20BYD%20Seagull"
  }
  */

  // Perks/Benefits
  perks: text('perks').array().default([]).notNull(),

  // Display
  emphasis: text('emphasis').default('none').notNull().$type<'none' | 'teal-border' | 'teal-glow'>(),
  displayOrder: integer('display_order').default(0).notNull(),

  // Status
  isActive: boolean('is_active').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueActivePricing: uniqueIndex('unique_active_pricing')
    .on(table.vehicleId, table.organizationId)
    .where(table.isActive.eq(true)),
  vehicleIdx: index('idx_vehicle_pricing_vehicle').on(table.vehicleId, table.amount),
  orgIdx: index('idx_vehicle_pricing_org').on(table.organizationId),
  amountIdx: index('idx_vehicle_pricing_amount').on(table.amount),
  activeIdx: index('idx_vehicle_pricing_active').on(table.isActive)
    .where(table.isActive.eq(true)),
}));
