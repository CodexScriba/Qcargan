-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."body_type" AS ENUM('SEDAN', 'SUV', 'CITY_CAR', 'PICKUP', 'VAN');--> statement-breakpoint
CREATE TYPE "public"."capability" AS ENUM('SELL_VEHICLES', 'SELL_ACCESSORIES', 'OFFER_SERVICES', 'IMPORT_VEHICLES', 'PRIORITY_LISTINGS');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('OWNER', 'ADMIN', 'STAFF', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('AGENCY', 'DEALER', 'IMPORTER', 'SERVICE_PROVIDER', 'ACCESSORY_SELLER', 'INDIVIDUAL_SELLER');--> statement-breakpoint
CREATE TYPE "public"."range_test_method" AS ENUM('CLTC', 'WLTP', 'EPA', 'NEDC');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');--> statement-breakpoint
CREATE TYPE "public"."vehicle_pricing_type" AS ENUM('AGENCY', 'GREY_MARKET', 'IMPORT');
*/