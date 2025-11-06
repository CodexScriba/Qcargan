import { createHash } from 'crypto'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .trim()
}

export function stableUuid(namespace: string, value: string): string {
  const hash = createHash('sha256')
    .update(namespace)
    .update(':')
    .update(value)
    .digest('hex')

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`
}

/**
 * Generate a vehicle slug following the pattern: brand-model-variant-year
 * Example: "byd-seagull-freedom-2025" or "nissan-leaf-2023" (no variant)
 */
export function generateVehicleSlug(
  brand: string,
  model: string,
  year: number,
  variant?: string | null
): string {
  const parts = [
    brand,
    model,
    variant || '',
    year.toString()
  ].filter(Boolean);

  return parts
    .join('-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[™®©]/g, '')            // Remove symbols
    .replace(/[^\w\s-]/g, '')         // Remove special chars
    .replace(/\s+/g, '-')             // Spaces to hyphens
    .replace(/-+/g, '-')              // Collapse multiple hyphens
    .replace(/^-|-$/g, '');           // Trim hyphens
}
