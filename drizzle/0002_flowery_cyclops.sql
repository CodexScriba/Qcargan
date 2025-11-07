DROP INDEX "unique_vehicle_identity";--> statement-breakpoint
DROP INDEX "idx_vehicles_published";--> statement-breakpoint
DROP INDEX "idx_organizations_active";--> statement-breakpoint
DROP INDEX "unique_active_pricing";--> statement-breakpoint
DROP INDEX "idx_vehicle_pricing_active";--> statement-breakpoint
DROP INDEX "idx_banks_featured";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_vehicle_identity" ON "vehicles" USING btree ("brand","model","year",COALESCE("variant", '')) WHERE "vehicles"."is_published" = true;--> statement-breakpoint
CREATE INDEX "idx_vehicles_published" ON "vehicles" USING btree ("is_published") WHERE "vehicles"."is_published" = true;--> statement-breakpoint
CREATE INDEX "idx_organizations_active" ON "organizations" USING btree ("is_active") WHERE "organizations"."is_active" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_pricing" ON "vehicle_pricing" USING btree ("vehicle_id","organization_id") WHERE "vehicle_pricing"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_vehicle_pricing_active" ON "vehicle_pricing" USING btree ("is_active") WHERE "vehicle_pricing"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_banks_featured" ON "banks" USING btree ("is_featured","display_order") WHERE "banks"."is_featured" = true;