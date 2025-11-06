/**
 * Organization & Bank Query Functions
 */

import { db } from '../client'
import * as schema from '../../../drizzle/schema'
import { eq, and, desc, asc } from 'drizzle-orm'

/**
 * Get all active organizations
 */
export async function getOrganizations() {
  return await db
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.isActive, true))
    .orderBy(asc(schema.organizations.name))
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(slug: string) {
  const [organization] = await db
    .select()
    .from(schema.organizations)
    .where(and(
      eq(schema.organizations.slug, slug),
      eq(schema.organizations.isActive, true)
    ))
    .limit(1)

  return organization || null
}

/**
 * Get organizations by type
 */
export async function getOrganizationsByType(type: 'AGENCY' | 'DEALER' | 'IMPORTER') {
  return await db
    .select()
    .from(schema.organizations)
    .where(and(
      eq(schema.organizations.type, type),
      eq(schema.organizations.isActive, true)
    ))
    .orderBy(asc(schema.organizations.name))
}

/**
 * Get all active banks
 */
export async function getBanks() {
  return await db
    .select()
    .from(schema.banks)
    .where(eq(schema.banks.isActive, true))
    .orderBy(asc(schema.banks.displayOrder), asc(schema.banks.name))
}

/**
 * Get featured banks for financing display
 */
export async function getFeaturedBanks() {
  return await db
    .select()
    .from(schema.banks)
    .where(and(
      eq(schema.banks.isFeatured, true),
      eq(schema.banks.isActive, true)
    ))
    .orderBy(asc(schema.banks.displayOrder))
}

/**
 * Get bank by slug
 */
export async function getBankBySlug(slug: string) {
  const [bank] = await db
    .select()
    .from(schema.banks)
    .where(and(
      eq(schema.banks.slug, slug),
      eq(schema.banks.isActive, true)
    ))
    .limit(1)

  return bank || null
}
