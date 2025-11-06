import { pgTable, pgSchema, uuid, text, timestamp, uniqueIndex, numeric, index, jsonb, integer, boolean, foreignKey, unique, pgPolicy, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bodyType = pgEnum("body_type", ['SEDAN', 'CITY', 'SUV', 'PICKUP_VAN'])
export const capability = pgEnum("capability", ['SELL_VEHICLES', 'SELL_ACCESSORIES', 'OFFER_SERVICES', 'IMPORT_VEHICLES', 'PRIORITY_LISTINGS'])
export const membershipRole = pgEnum("membership_role", ['OWNER', 'ADMIN', 'STAFF', 'MEMBER'])
export const organizationType = pgEnum("organization_type", ['AGENCY', 'DEALER', 'IMPORTER', 'SERVICE_PROVIDER', 'ACCESSORY_SELLER', 'INDIVIDUAL_SELLER'])
export const rangeTestMethod = pgEnum("range_test_method", ['CLTC', 'WLTP', 'EPA', 'NEDC'])
export const reviewStatus = pgEnum("review_status", ['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN'])
export const vehiclePricingType = pgEnum("vehicle_pricing_type", ['AGENCY', 'GREY_MARKET', 'IMPORT'])


const authSchema = pgSchema("auth")

// Manual adjustment: include minimal auth.users representation for profile foreign key lookups.
export const usersInAuth = authSchema.table("users", {
	id: uuid().primaryKey().notNull()
})


export const banks = pgTable("banks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	logoUrl: text("logo_url"),
	websiteUrl: text("website_url"),
	contactPhone: text("contact_phone"),
	contactEmail: text("contact_email"),
	typicalAprMin: numeric("typical_apr_min", { precision: 4, scale: 2 }),
	typicalAprMax: numeric("typical_apr_max", { precision: 4, scale: 2 }),
	typicalTermMonths: integer("typical_term_months").array(),
	description: text(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("banks_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("banks_featured_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops"), table.displayOrder.asc().nullsLast().op("int4_ops")).where(sql`${table.isFeatured} = true`),
]);

export const products = pgTable("products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	category: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().notNull(),
	image: text().notNull(),
	alt: text().notNull(),
	ctaLabel: text("cta_label").notNull(),
	description: text().notNull(),
	badges: text().array(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("products_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const organizations = pgTable("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	type: organizationType().notNull(),
	logoUrl: text("logo_url"),
	contact: jsonb().default('{}'),
	official: boolean().default(false).notNull(),
	badges: text().array().default(sql`'{}'`),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("organizations_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("organizations_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	index("organizations_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")).where(sql`${table.isActive} = true`),
	uniqueIndex("organizations_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const organizationMembers = pgTable("organization_members", {
	id: uuid().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	profileId: uuid("profile_id").notNull(),
	role: membershipRole().default('MEMBER').notNull(),
	tags: text().array(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("org_member_unique").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.profileId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_members_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "organization_members_profile_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const vehicles = pgTable("vehicles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	brand: text().notNull(),
	model: text().notNull(),
	year: integer().notNull(),
	variant: text(),
	badges: text().array(),
	description: text(),
	descriptionI18n: jsonb("description_i18n"),
	variantI18n: jsonb("variant_i18n"),
	isPublished: boolean("is_published").default(false).notNull(),
	specs: jsonb().default('{}').notNull(),
	media: jsonb().notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("vehicles_brand_idx").using("btree", table.brand.asc().nullsLast().op("text_ops")),
	index("vehicles_year_idx").using("btree", table.year.desc().nullsLast().op("int4_ops")),
	index("vehicles_published_idx").using("btree", table.isPublished.asc().nullsLast().op("bool_ops")).where(sql`${table.isPublished} = true`),
	uniqueIndex("vehicles_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const vehicleSpecifications = pgTable("vehicle_specifications", {
	vehicleId: uuid("vehicle_id").primaryKey().notNull(),
	// Range (multi-cycle support)
	rangeKmCltc: integer("range_km_cltc"),
	rangeKmWltp: integer("range_km_wltp"),
	rangeKmEpa: integer("range_km_epa"),
	rangeKmNedc: integer("range_km_nedc"),
	rangeKmClcReported: integer("range_km_clc_reported"),
	// Battery & Power
	batteryKwh: numeric("battery_kwh", { precision: 5, scale: 1 }),
	// Performance
	acceleration0100Sec: numeric("acceleration_0_100_sec", { precision: 3, scale: 1 }),
	topSpeedKmh: integer("top_speed_kmh"),
	powerKw: integer("power_kw"),
	powerHp: integer("power_hp"),
	// Charging
	chargingDcKw: integer("charging_dc_kw"),
	chargingTimeDcMin: integer("charging_time_dc_min"),
	// Physical
	seats: integer(),
	weightKg: integer("weight_kg"),
	bodyType: bodyType("body_type").notNull(),
	// User Sentiment (computed, Phase 4+)
	sentimentPositivePercent: numeric("sentiment_positive_percent", { precision: 4, scale: 1 }),
	sentimentNeutralPercent: numeric("sentiment_neutral_percent", { precision: 4, scale: 1 }),
	sentimentNegativePercent: numeric("sentiment_negative_percent", { precision: 4, scale: 1 }),
	// Metadata
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.vehicleId],
		foreignColumns: [vehicles.id],
		name: "vehicle_specifications_vehicle_id_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	index("vehicle_specifications_range_cltc_idx").using("btree", table.rangeKmCltc.desc().nullsLast().op("int4_ops")),
	index("vehicle_specifications_battery_idx").using("btree", table.batteryKwh.desc().nullsLast().op("numeric_ops")),
	index("vehicle_specifications_body_type_idx").using("btree", table.bodyType.asc().nullsLast().op("enum_ops")),
	index("vehicle_specifications_seats_idx").using("btree", table.seats.asc().nullsLast().op("int4_ops")),
	index("vehicle_specifications_sentiment_idx").using("btree", table.sentimentPositivePercent.desc().nullsLast().op("numeric_ops")),
	index("vehicle_specifications_range_battery_idx").using("btree", table.rangeKmCltc.desc().nullsLast().op("int4_ops"), table.batteryKwh.desc().nullsLast().op("numeric_ops")),
]);

export const vehicleImages = pgTable("vehicle_images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	vehicleId: uuid("vehicle_id").notNull(),
	storagePath: text("storage_path").notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	isHero: boolean("is_hero").default(false).notNull(),
	altText: text("alt_text"),
	caption: text(),
	uploadedAt: timestamp("uploaded_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.vehicleId],
		foreignColumns: [vehicles.id],
		name: "vehicle_images_vehicle_id_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	index("vehicle_images_composite_idx").using("btree", table.vehicleId.asc().nullsLast().op("uuid_ops"), table.isHero.asc().nullsLast().op("bool_ops"), table.displayOrder.asc().nullsLast().op("int4_ops")),
]);

export const vehiclePricing = pgTable("vehicle_pricing", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	vehicleId: uuid("vehicle_id").notNull(),
	organizationId: uuid("organization_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().default('USD').notNull(),
	availability: jsonb().default('{}'),
	financing: jsonb(),
	cta: jsonb(),
	perks: text().array().default(sql`'{}'`),
	emphasis: text().default('none').notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("vehicle_pricing_vehicle_idx").using("btree", table.vehicleId.asc().nullsLast().op("uuid_ops"), table.amount.asc().nullsLast().op("numeric_ops")),
	index("vehicle_pricing_organization_id_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("vehicle_pricing_amount_idx").using("btree", table.amount.asc().nullsLast().op("numeric_ops")),
	index("vehicle_pricing_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")).where(sql`${table.isActive} = true`),
	uniqueIndex("vehicle_pricing_unique_active").using("btree", table.vehicleId.asc().nullsLast().op("uuid_ops"), table.organizationId.asc().nullsLast().op("uuid_ops")).where(sql`${table.isActive} = true`),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "vehicle_pricing_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehicles.id],
			name: "vehicle_pricing_vehicle_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const organizationReviews = pgTable("organization_reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	userId: uuid("user_id").notNull(),
	rating: integer().notNull(),
	title: text(),
	comment: text().notNull(),
	verifiedPurchase: boolean("verified_purchase").default(false).notNull(),
	helpfulCount: integer("helpful_count").default(0).notNull(),
	status: reviewStatus().default('PENDING').notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("organization_reviews_organization_id_status_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.status.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("organization_reviews_organization_id_user_id_key").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.userId.asc().nullsLast().op("uuid_ops")),
	index("organization_reviews_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_reviews_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "organization_reviews_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userFavorites = pgTable("user_favorites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	vehicleId: uuid("vehicle_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("user_favorites_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("user_favorites_user_id_vehicle_id_key").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.vehicleId.asc().nullsLast().op("uuid_ops")),
	index("user_favorites_vehicle_id_idx").using("btree", table.vehicleId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_favorites_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.vehicleId],
			foreignColumns: [vehicles.id],
			name: "user_favorites_vehicle_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userComparisons = pgTable("user_comparisons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	vehicleIds: uuid("vehicle_ids").array(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("user_comparisons_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [profiles.id],
			name: "user_comparisons_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	username: text().notNull(),
	displayName: text("display_name"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
		foreignColumns: [usersInAuth.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	unique("profiles_username_key").on(table.username),
	pgPolicy("profiles_update_own", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = id)` }),
	pgPolicy("profiles_insert_own", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.uid() = id)` }),
	pgPolicy("profiles_select_own", { as: "permissive", for: "select", to: ["public"] }),
]);
