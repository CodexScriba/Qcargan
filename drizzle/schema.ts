import { pgTable, pgSchema, uuid, text, timestamp, uniqueIndex, numeric, index, jsonb, integer, boolean, foreignKey, unique, pgPolicy, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const bodyType = pgEnum("body_type", ['SEDAN', 'SUV', 'CITY_CAR', 'PICKUP', 'VAN'])
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
	name: text().notNull(),
	whatsapp: text().notNull(),
	message: text().notNull(),
	blurb: text().notNull(),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).notNull(),
});

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
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	type: organizationType().notNull(),
	features: capability().array(),
	slug: text(),
	logoUrl: text("logo_url"),
	description: text(),
	badges: text().array(),
	email: text(),
	phone: text(),
	whatsapp: text(),
	website: text(),
	brandsCarried: text("brands_carried").array(),
	serviceAreas: text("service_areas").array(),
	locations: jsonb(),
	socialMedia: jsonb("social_media"),
	rating: numeric({ precision: 3, scale:  2 }),
	reviewCount: integer("review_count").default(0).notNull(),
	publicListed: boolean("public_listed").default(false).notNull(),
	reviewsEnabled: boolean("reviews_enabled").default(false).notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("organizations_public_listed_idx").using("btree", table.publicListed.asc().nullsLast().op("bool_ops")),
	index("organizations_rating_idx").using("btree", table.rating.asc().nullsLast().op("numeric_ops")),
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
	variant: text().notNull(),
	badges: text().array(),
	identityDisplay: text("identity_display").notNull(),
	organizationId: uuid("organization_id").notNull(),
	isNew: boolean("is_new").default(true).notNull(),
	bodyType: bodyType("body_type").notNull(),
	rangeKm: integer("range_km"),
	seats: integer(),
	priceMin: numeric("price_min", { precision: 10, scale:  2 }),
	specs: jsonb().notNull(),
	media: jsonb().notNull(),
	availability: jsonb(),
	reviews: jsonb(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("vehicles_body_type_idx").using("btree", table.bodyType.asc().nullsLast().op("enum_ops")),
	index("vehicles_brand_idx").using("btree", table.brand.asc().nullsLast().op("text_ops")),
	index("vehicles_brand_model_year_idx").using("btree", table.brand.asc().nullsLast().op("int4_ops"), table.model.asc().nullsLast().op("text_ops"), table.year.asc().nullsLast().op("int4_ops")),
	index("vehicles_organization_id_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("vehicles_price_min_idx").using("btree", table.priceMin.asc().nullsLast().op("numeric_ops")),
	index("vehicles_range_km_idx").using("btree", table.rangeKm.asc().nullsLast().op("int4_ops")),
	uniqueIndex("vehicles_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "vehicles_organization_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const vehiclePricing = pgTable("vehicle_pricing", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	vehicleId: uuid("vehicle_id").notNull(),
	organizationId: uuid("organization_id").notNull(),
	type: vehiclePricingType().notNull(),
	label: text().notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().notNull(),
	perks: text().array(),
	notes: text().array(),
	financing: jsonb(),
	cta: jsonb(),
	availabilityBadge: jsonb("availability_badge"),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("vehicle_pricing_organization_id_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("vehicle_pricing_vehicle_id_type_idx").using("btree", table.vehicleId.asc().nullsLast().op("uuid_ops"), table.type.asc().nullsLast().op("uuid_ops")),
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
