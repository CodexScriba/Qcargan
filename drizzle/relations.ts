import { relations } from "drizzle-orm/relations";
import {
  organizations,
  organizationMembers,
  profiles,
  vehicles,
  vehiclePricing,
  organizationReviews,
  userFavorites,
  userComparisons,
  usersInAuth,
  vehicleSpecifications,
  vehicleImages,
} from "./schema";

export const organizationMembersRelations = relations(organizationMembers, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id]
	}),
	profile: one(profiles, {
		fields: [organizationMembers.profileId],
		references: [profiles.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	organizationMembers: many(organizationMembers),
	vehiclePricings: many(vehiclePricing),
	organizationReviews: many(organizationReviews),
}));

export const profilesRelations = relations(profiles, ({one, many}) => ({
	organizationMembers: many(organizationMembers),
	organizationReviews: many(organizationReviews),
	userFavorites: many(userFavorites),
	userComparisons: many(userComparisons),
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));

export const vehiclesRelations = relations(vehicles, ({many}) => ({
	specifications: many(vehicleSpecifications),
	images: many(vehicleImages),
	vehiclePricings: many(vehiclePricing),
	userFavorites: many(userFavorites),
}));

export const vehiclePricingRelations = relations(vehiclePricing, ({one}) => ({
	organization: one(organizations, {
		fields: [vehiclePricing.organizationId],
		references: [organizations.id]
	}),
	vehicle: one(vehicles, {
		fields: [vehiclePricing.vehicleId],
		references: [vehicles.id]
	}),
}));

export const vehicleSpecificationsRelations = relations(vehicleSpecifications, ({one}) => ({
	vehicle: one(vehicles, {
		fields: [vehicleSpecifications.vehicleId],
		references: [vehicles.id]
	}),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({one}) => ({
	vehicle: one(vehicles, {
		fields: [vehicleImages.vehicleId],
		references: [vehicles.id]
	}),
}));

export const organizationReviewsRelations = relations(organizationReviews, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationReviews.organizationId],
		references: [organizations.id]
	}),
	profile: one(profiles, {
		fields: [organizationReviews.userId],
		references: [profiles.id]
	}),
}));

export const userFavoritesRelations = relations(userFavorites, ({one}) => ({
	profile: one(profiles, {
		fields: [userFavorites.userId],
		references: [profiles.id]
	}),
	vehicle: one(vehicles, {
		fields: [userFavorites.vehicleId],
		references: [vehicles.id]
	}),
}));

export const userComparisonsRelations = relations(userComparisons, ({one}) => ({
	profile: one(profiles, {
		fields: [userComparisons.userId],
		references: [profiles.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));
