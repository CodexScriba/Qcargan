import { eq, and, asc, desc } from "drizzle-orm"
import { db } from "@/lib/db/client"
import { banks } from "@/lib/db/schema/banks"

/**
 * Get all active banks ordered by featured status, then display order, then name
 * Featured banks appear first
 */
export async function getBanks() {
  return db
    .select()
    .from(banks)
    .where(eq(banks.isActive, true))
    .orderBy(desc(banks.isFeatured), asc(banks.displayOrder), asc(banks.name))
}

/**
 * Get only featured banks
 * Useful for homepage or vehicle detail page highlights
 */
export async function getFeaturedBanks() {
  return db
    .select()
    .from(banks)
    .where(and(eq(banks.isFeatured, true), eq(banks.isActive, true)))
    .orderBy(asc(banks.displayOrder), asc(banks.name))
}

/**
 * Get bank by slug
 * Returns null if not found or inactive
 */
export async function getBankBySlug(slug: string) {
  const [bank] = await db
    .select()
    .from(banks)
    .where(and(eq(banks.slug, slug), eq(banks.isActive, true)))
    .limit(1)

  return bank || null
}

// Type exports for consumers
export type Bank = Awaited<ReturnType<typeof getBankBySlug>>
export type BankList = Awaited<ReturnType<typeof getBanks>>
