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
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"variant" text,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description_i18n" jsonb,
	"variant_i18n" jsonb
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"logo_url" text,
	"contact" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"official" boolean DEFAULT false NOT NULL,
	"badges" text[] DEFAULT '{}'::text[] NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description_i18n" jsonb
);
--> statement-breakpoint
CREATE TABLE "vehicle_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"availability" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"financing" jsonb,
	"cta" jsonb,
	"perks" text[] DEFAULT '{}'::text[] NOT NULL,
	"emphasis" text DEFAULT 'none' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
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
CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"website_url" text,
	"contact_phone" text,
	"contact_email" text,
	"typical_apr_min" numeric(4, 2),
	"typical_apr_max" numeric(4, 2),
	"typical_term_months" integer[],
	"description" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicle_specifications" ADD CONSTRAINT "vehicle_specifications_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD CONSTRAINT "vehicle_pricing_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_pricing" ADD CONSTRAINT "vehicle_pricing_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_image_variants" ADD CONSTRAINT "vehicle_image_variants_source_image_id_vehicle_images_id_fk" FOREIGN KEY ("source_image_id") REFERENCES "public"."vehicle_images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_range_cltc" ON "vehicle_specifications" USING btree ("range_km_cltc" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_battery" ON "vehicle_specifications" USING btree ("battery_kwh" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_body_type" ON "vehicle_specifications" USING btree ("body_type");--> statement-breakpoint
CREATE INDEX "idx_seats" ON "vehicle_specifications" USING btree ("seats");--> statement-breakpoint
CREATE INDEX "idx_sentiment" ON "vehicle_specifications" USING btree ("sentiment_positive_percent" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_range_battery" ON "vehicle_specifications" USING btree ("range_km_cltc" DESC NULLS LAST,"battery_kwh" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "unique_slug" ON "vehicles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_vehicle_identity" ON "vehicles" USING btree ("brand","model","year",COALESCE("variant", '')) WHERE "vehicles"."is_published" = true;--> statement-breakpoint
CREATE INDEX "idx_vehicles_brand" ON "vehicles" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "idx_vehicles_year" ON "vehicles" USING btree ("year" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_vehicles_published" ON "vehicles" USING btree ("is_published") WHERE "vehicles"."is_published" = true;--> statement-breakpoint
CREATE INDEX "idx_organizations_slug" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_organizations_slug" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_organizations_type" ON "organizations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_organizations_active" ON "organizations" USING btree ("is_active") WHERE "organizations"."is_active" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_pricing" ON "vehicle_pricing" USING btree ("vehicle_id","organization_id") WHERE "vehicle_pricing"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_vehicle" ON "vehicle_pricing" USING btree ("vehicle_id","amount");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_org" ON "vehicle_pricing" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_amount" ON "vehicle_pricing" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_active" ON "vehicle_pricing" USING btree ("is_active") WHERE "vehicle_pricing"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_image_variants_source" ON "vehicle_image_variants" USING btree ("source_image_id","variant_type");--> statement-breakpoint
CREATE INDEX "idx_vehicle_images_composite" ON "vehicle_images" USING btree ("vehicle_id","is_hero","display_order");--> statement-breakpoint
CREATE INDEX "idx_banks_slug" ON "banks" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_banks_slug" ON "banks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_banks_featured" ON "banks" USING btree ("is_featured","display_order") WHERE "banks"."is_featured" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username");