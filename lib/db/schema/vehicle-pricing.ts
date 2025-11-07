import { sql } from 'drizzle-orm';
import { pgTable, uuid, numeric, text, boolean, jsonb, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';
import { organizations } from './organizations';

export type VehicleAvailability = {
  label?: string;
  tone?: 'success' | 'warning' | 'info' | 'danger';
  estimated_delivery_days?: number;
  [key: string]: unknown;
};

export type VehicleFinancing = {
  down_payment?: number;
  monthly_payment?: number;
  term_months?: number;
  apr_percent?: number;
  display_currency?: string;
  [key: string]: unknown;
};

export type VehicleCta = {
  label: string;
  href: string;
  [key: string]: unknown;
};

export const vehiclePricing = pgTable('vehicle_pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),

  // Pricing
  amount: numeric('amount', { precision: 10, scale: 2 }).$type<number>().notNull(),
  currency: text('currency').default('USD').notNull().$type<'USD' | 'CRC'>(),

  // Availability (JSONB)
  availability: jsonb('availability').default({}).$type<VehicleAvailability>().notNull(),
  /* Example:
  {
    "label": "In Stock",
    "tone": "success",
    "estimated_delivery_days": 30
  }
  */

  // Financing (JSONB, optional per seller)
  financing: jsonb('financing').$type<VehicleFinancing>(),
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
  cta: jsonb('cta').$type<VehicleCta>(),
  /* Example:
  {
    "label": "Contact Dealer",
    "href": "https://wa.me/50612345678?text=Interested%20in%20BYD%20Seagull"
  }
  */

  // Perks/Benefits
  perks: text('perks').array().default(sql`'{}'::text[]`).notNull(),

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
    .where(sql`${table.isActive} = true`),
  vehicleIdx: index('idx_vehicle_pricing_vehicle').on(table.vehicleId, table.amount),
  orgIdx: index('idx_vehicle_pricing_org').on(table.organizationId),
  amountIdx: index('idx_vehicle_pricing_amount').on(table.amount),
  activeIdx: index('idx_vehicle_pricing_active').on(table.isActive)
    .where(sql`${table.isActive} = true`),
}));
