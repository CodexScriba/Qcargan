import { createClient } from "./server"

/**
 * Storage bucket configuration
 */
const VEHICLE_IMAGES_BUCKET = "vehicle-images"
const DEFAULT_SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Get a public or signed URL for an image stored in Supabase Storage
 *
 * @param storagePath - The path to the file in Supabase storage (e.g., "vehicles/byd-seagull/hero.jpg")
 * @param bucket - The storage bucket name (defaults to vehicle-images)
 * @returns Browser-ready CDN URL or signed URL
 *
 * @example
 * ```ts
 * const url = await getPublicImageUrl("vehicles/byd-seagull/hero.jpg")
 * // Returns: https://xxx.supabase.co/storage/v1/object/public/vehicle-images/vehicles/byd-seagull/hero.jpg
 * ```
 */
export async function getPublicImageUrl(
  storagePath: string,
  bucket: string = VEHICLE_IMAGES_BUCKET
): Promise<string> {
  // Handle empty or invalid paths
  if (!storagePath || storagePath.trim() === "") {
    return ""
  }

  const supabase = await createClient()

  // Get public URL (works for public buckets)
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)

  if (data?.publicUrl) {
    return data.publicUrl
  }

  // Fallback: try to get a signed URL (for private buckets)
  const { data: signedData } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, DEFAULT_SIGNED_URL_EXPIRY)

  return signedData?.signedUrl || ""
}

/**
 * Get multiple public/signed URLs in batch
 * More efficient than calling getPublicImageUrl multiple times
 *
 * @param storagePaths - Array of storage paths
 * @param bucket - The storage bucket name
 * @returns Array of browser-ready URLs in the same order as input
 */
export async function getPublicImageUrls(
  storagePaths: string[],
  bucket: string = VEHICLE_IMAGES_BUCKET
): Promise<string[]> {
  if (!storagePaths || storagePaths.length === 0) {
    return []
  }

  const supabase = await createClient()

  // For public buckets, we can batch get public URLs
  return storagePaths.map((path) => {
    if (!path || path.trim() === "") return ""
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data?.publicUrl || ""
  })
}

/**
 * Check if a storage path is valid and file exists
 *
 * @param storagePath - The path to check
 * @param bucket - The storage bucket name
 * @returns true if file exists, false otherwise
 */
export async function imageExists(
  storagePath: string,
  bucket: string = VEHICLE_IMAGES_BUCKET
): Promise<boolean> {
  if (!storagePath || storagePath.trim() === "") {
    return false
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(storagePath.substring(0, storagePath.lastIndexOf("/")), {
        search: storagePath.substring(storagePath.lastIndexOf("/") + 1),
      })

    return !error && !!data && data.length > 0
  } catch {
    return false
  }
}
