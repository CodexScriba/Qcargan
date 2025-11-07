CREATE TABLE "vehicle_specifications" (
	"vehicle_id" uuid PRIMARY KEY NOT NULL,
	"range_km_cltc" integer,
	"range_km_wltp" integer,
	"range_km_epa" integer,
	"range_km_nedc" integer,
	"range_km_clc_reported" integer,
	"battery_kwh" numeric(5, 1),
	"acceleration_0_100_sec" numeric(3, 1),
	"top_speed_kmh" integer,
	"power_kw" integer,
	"power_hp" integer,
	"charging_dc_kw" integer,
	"charging_time_dc_min" integer,
	"seats" integer,
	"weight_kg" integer,
	"body_type" text NOT NULL,
	"sentiment_positive_percent" numeric(4, 1),
	"sentiment_neutral_percent" numeric(4, 1),
	"sentiment_negative_percent" numeric(4, 1),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_image_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_image_id" uuid NOT NULL,
	"variant_type" text NOT NULL,
	"storage_path" text NOT NULL,
	"width" integer,
	"height" integer,
	"format" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_hero" boolean DEFAULT false NOT NULL,
	"alt_text" text,
	"caption" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization_reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_comparisons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_favorites" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "organization_members" CASCADE;--> statement-breakpoint
DROP TABLE "organization_reviews" CASCADE;--> statement-breakpoint
DROP TABLE "products" CASCADE;--> statement-breakpoint
DROP TABLE "user_comparisons" CASCADE;--> statement-breakpoint
DROP TABLE "user_favorites" CASCADE;--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_username_key";--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP CONSTRAINT "vehicle_pricing_organization_id_fkey";
--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP CONSTRAINT "vehicle_pricing_vehicle_id_fkey";
--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_organization_id_fkey";
--> statement-breakpoint
DROP INDEX "organizations_public_listed_idx";--> statement-breakpoint
DROP INDEX "organizations_rating_idx";--> statement-breakpoint
DROP INDEX "organizations_slug_key";--> statement-breakpoint
DROP INDEX "vehicle_pricing_organization_id_idx";--> statement-breakpoint
DROP INDEX "vehicle_pricing_vehicle_id_type_idx";--> statement-breakpoint
DROP INDEX "vehicles_body_type_idx";--> statement-breakpoint
DROP INDEX "vehicles_brand_idx";--> statement-breakpoint
DROP INDEX "vehicles_brand_model_year_idx";--> statement-breakpoint
DROP INDEX "vehicles_organization_id_idx";--> statement-breakpoint
DROP INDEX "vehicles_price_min_idx";--> statement-breakpoint
DROP INDEX "vehicles_range_km_idx";--> statement-breakpoint
DROP INDEX "vehicles_slug_key";--> statement-breakpoint
ALTER TABLE "banks" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "banks" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "banks" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "banks" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "badges" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "badges" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "currency" SET DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "perks" SET DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "perks" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "variant" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "specs" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "typical_apr_min" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "typical_apr_max" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "typical_term_months" integer[];--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "official" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "description_i18n" jsonb;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD COLUMN "availability" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD COLUMN "emphasis" text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "description_i18n" jsonb;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "variant_i18n" jsonb;--> statement-breakpoint
ALTER TABLE "vehicle_specifications" ADD CONSTRAINT "vehicle_specifications_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_image_variants" ADD CONSTRAINT "vehicle_image_variants_source_image_id_vehicle_images_id_fk" FOREIGN KEY ("source_image_id") REFERENCES "public"."vehicle_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_range_cltc" ON "vehicle_specifications" USING btree ("range_km_cltc" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_battery" ON "vehicle_specifications" USING btree ("battery_kwh" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_body_type" ON "vehicle_specifications" USING btree ("body_type");--> statement-breakpoint
CREATE INDEX "idx_seats" ON "vehicle_specifications" USING btree ("seats");--> statement-breakpoint
CREATE INDEX "idx_sentiment" ON "vehicle_specifications" USING btree ("sentiment_positive_percent" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_range_battery" ON "vehicle_specifications" USING btree ("range_km_cltc" DESC NULLS LAST,"battery_kwh" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_image_variants_source" ON "vehicle_image_variants" USING btree ("source_image_id","variant_type");--> statement-breakpoint
CREATE INDEX "idx_vehicle_images_composite" ON "vehicle_images" USING btree ("vehicle_id","is_hero","display_order");--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD CONSTRAINT "vehicle_pricing_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD CONSTRAINT "vehicle_pricing_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_banks_slug" ON "banks" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_banks_slug" ON "banks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_banks_featured" ON "banks" USING btree ("is_featured","display_order") WHERE "banks"."is_featured" = $1;--> statement-breakpoint
CREATE INDEX "idx_organizations_slug" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_organizations_slug" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_organizations_type" ON "organizations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_organizations_active" ON "organizations" USING btree ("is_active") WHERE "organizations"."is_active" = $1;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_pricing" ON "vehicle_pricing" USING btree ("vehicle_id","organization_id") WHERE "vehicle_pricing"."is_active" = $1;--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_vehicle" ON "vehicle_pricing" USING btree ("vehicle_id","amount");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_org" ON "vehicle_pricing" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_amount" ON "vehicle_pricing" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_active" ON "vehicle_pricing" USING btree ("is_active") WHERE "vehicle_pricing"."is_active" = $1;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_slug" ON "vehicles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_vehicle_identity" ON "vehicles" USING btree ("brand","model","year",COALESCE("variant", '')) WHERE "vehicles"."is_published" = $1;--> statement-breakpoint
CREATE INDEX "idx_vehicles_brand" ON "vehicles" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "idx_vehicles_year" ON "vehicles" USING btree ("year" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_vehicles_published" ON "vehicles" USING btree ("is_published") WHERE "vehicles"."is_published" = $1;--> statement-breakpoint
ALTER TABLE "banks" DROP COLUMN "whatsapp";--> statement-breakpoint
ALTER TABLE "banks" DROP COLUMN "message";--> statement-breakpoint
ALTER TABLE "banks" DROP COLUMN "blurb";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "features";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "whatsapp";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "brands_carried";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "service_areas";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "locations";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "social_media";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "review_count";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "public_listed";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "reviews_enabled";--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP COLUMN "label";--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "vehicle_pricing" DROP COLUMN "availability_badge";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "badges";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "identity_display";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "is_new";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "body_type";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "range_km";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "seats";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "price_min";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "media";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "availability";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "reviews";--> statement-breakpoint
DROP POLICY "profiles_update_own" ON "profiles" CASCADE;--> statement-breakpoint
DROP POLICY "profiles_insert_own" ON "profiles" CASCADE;--> statement-breakpoint
DROP POLICY "profiles_select_own" ON "profiles" CASCADE;--> statement-breakpoint
DROP TYPE "public"."body_type";--> statement-breakpoint
DROP TYPE "public"."capability";--> statement-breakpoint
DROP TYPE "public"."membership_role";--> statement-breakpoint
DROP TYPE "public"."organization_type";--> statement-breakpoint
DROP TYPE "public"."range_test_method";--> statement-breakpoint
DROP TYPE "public"."review_status";--> statement-breakpoint
DROP TYPE "public"."vehicle_pricing_type";