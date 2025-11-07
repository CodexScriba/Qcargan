import { eq, and, asc } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { organizations } from "@/lib/db/schema/organizations"

/**
 * Get all active organizations ordered by name
 */
export async function getOrganizations() {
  return db
    .select()
    .from(organizations)
    .where(eq(organizations.isActive, true))
    .orderBy(asc(organizations.name))
}

/**
 * Get organization by slug
 * Returns null if not found or inactive
 */
export async function getOrganizationBySlug(slug: string) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.slug, slug), eq(organizations.isActive, true)))
    .limit(1)

  return organization || null
}

/**
 * Get organizations filtered by type (AGENCY, DEALER, IMPORTER)
 */
export async function getOrganizationsByType(
  type: "AGENCY" | "DEALER" | "IMPORTER"
) {
  return db
    .select()
    .from(organizations)
    .where(and(eq(organizations.type, type), eq(organizations.isActive, true)))
    .orderBy(asc(organizations.name))
}

/**
 * Get official organizations (verified/official dealers)
 */
export async function getOfficialOrganizations() {
  return db
    .select()
    .from(organizations)
    .where(
      and(eq(organizations.official, true), eq(organizations.isActive, true))
    )
    .orderBy(asc(organizations.name))
}

// Type exports for consumers
export type Organization = Awaited<ReturnType<typeof getOrganizationBySlug>>
export type OrganizationList = Awaited<ReturnType<typeof getOrganizations>>
