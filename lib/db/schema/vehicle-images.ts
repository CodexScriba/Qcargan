import { pgTable, uuid, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';

export const vehicleImages = pgTable('vehicle_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),

  // Storage
  storagePath: text('storage_path').notNull(),       // "cars/byd/seagull/hero.jpg"

  // Display
  displayOrder: integer('display_order').default(0).notNull(),
  isHero: boolean('is_hero').default(false).notNull(),

  // Metadata
  altText: text('alt_text'),
  caption: text('caption'),

  // Timestamps
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  compositeIdx: index('idx_vehicle_images_composite')
    .on(table.vehicleId, table.isHero, table.displayOrder),
}));

export const vehicleImageVariants = pgTable('vehicle_image_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceImageId: uuid('source_image_id').notNull().references(() => vehicleImages.id, { onDelete: 'cascade' }),

  // Variant info
  variantType: text('variant_type').notNull(),       // "thumbnail", "webp", "2x", "mobile"
  storagePath: text('storage_path').notNull(),       // "cars/byd/seagull/hero-thumbnail.webp"

  // Dimensions
  width: integer('width'),
  height: integer('height'),
  format: text('format'),                            // "webp", "avif", "jpg"

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  sourceVariantIdx: index('idx_image_variants_source')
    .on(table.sourceImageId, table.variantType),
}));
