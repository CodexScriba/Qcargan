import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, integer, boolean, jsonb, timestamp, index, uniqueIndex, numeric } from 'drizzle-orm/pg-core';

export type VehicleSpecs = {
  torque?: { nm?: number; lbft?: number };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    wheelbase?: number;
  };
  features?: string[];
  warranty?: {
    vehicle?: string;
    battery?: string;
  };
  charging?: {
    ac?: { kW?: number; time?: string };
    dc?: { kW?: number; time?: string };
  };
  [key: string]: unknown;
};

export type LocalizedText = Record<string, string>;

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull(),

  // Basic Info
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  variant: text('variant'),

  // Display-only specs (JSONB)
  specs: jsonb('specs').default({}).$type<VehicleSpecs>().notNull(),
  /* Example specs JSONB structure:
  {
    "torque": { "nm": 310, "lbft": 229 },
    "dimensions": {
      "length": 4405,
      "width": 1783,
      "height": 1626,
      "wheelbase": 2610
    },
    "features": ["Autopilot", "Premium Audio", "Heated Seats"],
    "warranty": {
      "vehicle": "4 years / 80,000 km",
      "battery": "8 years / 160,000 km"
    },
    "charging": {
      "ac": { "kW": 11, "time": "8 hours" },
      "dc": { "kW": 150, "time": "30 min to 80%" }
    }
  }
  */

  // Metadata
  description: text('description'),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Future i18n support
  descriptionI18n: jsonb('description_i18n').$type<LocalizedText>(),
  variantI18n: jsonb('variant_i18n').$type<LocalizedText>(),
}, (table) => ({
  uniqueSlug: uniqueIndex('unique_slug').on(table.slug),
  uniqueVehicleIdentity: uniqueIndex('unique_vehicle_identity')
    .on(table.brand, table.model, table.year, sql`COALESCE(${table.variant}, '')`)
    .where(sql`${table.isPublished} = true`),
  brandIdx: index('idx_vehicles_brand').on(table.brand),
  yearIdx: index('idx_vehicles_year').on(table.year.desc()),
  publishedIdx: index('idx_vehicles_published').on(table.isPublished)
    .where(sql`${table.isPublished} = true`),
}));

export const vehicleSpecifications = pgTable('vehicle_specifications', {
  vehicleId: uuid('vehicle_id').primaryKey().references(() => vehicles.id, { onDelete: 'cascade' }),

  // Range (multi-cycle support)
  rangeKmCltc: integer('range_km_cltc'),              // DEFAULT: Chinese standard
  rangeKmWltp: integer('range_km_wltp'),              // European standard
  rangeKmEpa: integer('range_km_epa'),                // US standard (conservative)
  rangeKmNedc: integer('range_km_nedc'),              // Legacy European
  rangeKmClcReported: integer('range_km_clc_reported'), // FUTURE: User-reported LATAM

  // Battery & Power
  batteryKwh: numeric('battery_kwh', { precision: 5, scale: 1 }).$type<number>(),

  // Performance
  acceleration0To100Sec: numeric('acceleration_0_100_sec', { precision: 3, scale: 1 }).$type<number>(),
  topSpeedKmh: integer('top_speed_kmh'),
  powerKw: integer('power_kw'),
  powerHp: integer('power_hp'),

  // Charging
  chargingDcKw: integer('charging_dc_kw'),
  chargingTimeDcMin: integer('charging_time_dc_min'),

  // Physical
  seats: integer('seats'),
  weightKg: integer('weight_kg'),
  bodyType: text('body_type').notNull().$type<'SEDAN' | 'CITY' | 'SUV' | 'PICKUP_VAN'>(),

  // User Sentiment (computed, Phase 4+)
  sentimentPositivePercent: numeric('sentiment_positive_percent', { precision: 4, scale: 1 }).$type<number>(),
  sentimentNeutralPercent: numeric('sentiment_neutral_percent', { precision: 4, scale: 1 }).$type<number>(),
  sentimentNegativePercent: numeric('sentiment_negative_percent', { precision: 4, scale: 1 }).$type<number>(),

  // Metadata
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  rangeCltcIdx: index('idx_range_cltc').on(table.rangeKmCltc.desc()),
  batteryIdx: index('idx_battery').on(table.batteryKwh.desc()),
  bodyTypeIdx: index('idx_body_type').on(table.bodyType),
  seatsIdx: index('idx_seats').on(table.seats),
  sentimentIdx: index('idx_sentiment').on(table.sentimentPositivePercent.desc()),
  rangeBatteryIdx: index('idx_range_battery').on(table.rangeKmCltc.desc(), table.batteryKwh.desc()),
}));
