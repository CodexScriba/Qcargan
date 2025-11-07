import type { banks } from '@/lib/db/schema'

/**
 * Bank type from database schema
 */
export type Bank = typeof banks.$inferSelect

/**
 * Bank summary for financing displays
 */
export interface BankSummary {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  aprMin: number | null
  aprMax: number | null
  termMonths: number[] | null
  isFeatured: boolean
  isActive: boolean
}

/**
 * Complete bank with all details
 */
export interface BankDetail extends BankSummary {
  description: string | null
  contact: {
    phone?: string
    whatsapp?: string
    email?: string
    website?: string
  } | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Financing option display
 */
export interface FinancingOption {
  bank: BankSummary
  downPayment?: number
  monthlyPayment?: number
  termMonths?: number
  aprPercent?: number
  totalAmount?: number
}
