/**
 * Normalizes arbitrary text into a lowercase, hyphenated slug.
 * We keep this helper in `lib` so both runtime code and scripts share the logic.
 */
export function slugify(input: string): string {
  let result = input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // Strip diacritics

  result = result.replace(/™|®|©/gi, "") // Remove trademark symbols
  result = result.replace(/(?<=\w)-?tm\b/gi, "") // Strip trailing TM artifacts after normalization

  return result
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Collapse non-alphanumeric chunks
    .replace(/^-+|-+$/g, "") // Trim leading/trailing separators
    .replace(/-{2,}/g, "-") // Collapse duplicate separators
    .trim()
}

/**
 * Generates a URL-friendly slug for a vehicle.
 * Format: brand-model-[variant-]year (all lowercase, hyphenated).
 */
export function generateVehicleSlug(
  brand: string,
  model: string,
  year: number,
  variant?: string | null,
): string {
  const parts = [brand, model, variant ?? "", year.toString()].filter(Boolean)
  return slugify(parts.join(" "))
}

/**
 * Validates that a slug matches the expected format:
 * lowercase letters, numbers, and hyphens only.
 */
export function isValidVehicleSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

/**
 * Canonical example slugs used by docs/tests.
 */
export const EXAMPLE_SLUGS = {
  withVariant: "byd-seagull-freedom-2025",
  withoutVariant: "nissan-leaf-2023",
  multiWordVariant: "tesla-model-3-long-range-2024",
  multiWordModel: "ford-f-150-lightning-2024",
} as const
