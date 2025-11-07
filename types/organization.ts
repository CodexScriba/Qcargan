import type { organizations } from '@/lib/db/schema'

/**
 * Organization type from database schema
 */
export type Organization = typeof organizations.$inferSelect

/**
 * Organization type enum
 */
export type OrganizationType = 'AGENCY' | 'DEALER' | 'IMPORTER'

/**
 * Organization contact information
 */
export interface OrganizationContact {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  website?: string
}

/**
 * Organization summary for display
 */
export interface OrganizationSummary {
  id: string
  slug: string
  name: string
  type: OrganizationType
  logoUrl: string | null
  official: boolean
  badges: string[] | null
  isActive: boolean
}

/**
 * Complete organization with all details
 */
export interface OrganizationDetail extends OrganizationSummary {
  description: string | null
  contact: OrganizationContact | null
  createdAt: Date
  updatedAt: Date
}
