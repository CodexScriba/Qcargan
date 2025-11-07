import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient as createServerSupabaseClient } from "./server"

/**
 * Storage bucket configuration (server-only helper)
 */
const VEHICLE_IMAGES_BUCKET = "vehicle-images"
const DEFAULT_SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

type StorageDeps = {
  storageClient?: SupabaseClient
}

let cachedServiceClient: SupabaseClient | null = null
let storageClientOverride: (() => Promise<SupabaseClient>) | null = null

function assertStorageEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    )
  }

  return { url, serviceRoleKey }
}

async function resolveStorageClient(): Promise<SupabaseClient> {
  if (storageClientOverride) {
    return storageClientOverride()
  }

  try {
    return await createServerSupabaseClient()
  } catch (error) {
    // When running outside of Next.js request scope (scripts/tests), fall back to service role client
    if (!cachedServiceClient) {
      const { url, serviceRoleKey } = assertStorageEnv()
      cachedServiceClient = createSupabaseClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    }

    return cachedServiceClient
  }
}

/**
 * Test-only helper to override the storage client factory.
 */
export function __setStorageClientFactory(
  factory: (() => Promise<SupabaseClient>) | null
) {
  storageClientOverride = factory
}

/**
 * Get a browser-ready URL for an image stored in Supabase Storage
 *
 * Strategy:
 * 1. Try to generate a signed URL (works for both public and private buckets)
 * 2. If signed URL generation fails, fall back to public URL (public buckets only)
 * 3. Return empty string if both fail
 *
 * @param storagePath - The path to the file in Supabase storage (e.g., "vehicles/byd-seagull/hero.jpg")
 * @param bucket - The storage bucket name (defaults to vehicle-images)
 * @returns Browser-ready CDN URL or signed URL
 *
 * @example
 * ```ts
 * const url = await getPublicImageUrl("vehicles/byd-seagull/hero.jpg")
 * // Private bucket: https://xxx.supabase.co/storage/v1/object/sign/vehicle-images/vehicles/byd-seagull/hero.jpg?token=...
 * // Public bucket: https://xxx.supabase.co/storage/v1/object/public/vehicle-images/vehicles/byd-seagull/hero.jpg
 * ```
 */
export async function getPublicImageUrl(
  storagePath: string,
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {}
): Promise<string> {
  // Handle empty or invalid paths
  if (!storagePath || storagePath.trim() === "") {
    return ""
  }

  // If it's already an external URL (http/https), return it as-is
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath
  }

  const supabase =
    deps.storageClient ?? (await resolveStorageClient())

  // Try signed URL first (works for both public and private buckets)
  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, DEFAULT_SIGNED_URL_EXPIRY)

  if (!signedError && signedData?.signedUrl) {
    return signedData.signedUrl
  }

  // Fallback to public URL (only works if bucket is public)
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath)

  return publicData?.publicUrl || ""
}

/**
 * Get multiple browser-ready URLs in batch
 * Uses createSignedUrls for efficiency when dealing with private buckets
 *
 * @param storagePaths - Array of storage paths
 * @param bucket - The storage bucket name
 * @returns Array of browser-ready URLs in the same order as input
 */
export async function getPublicImageUrls(
  storagePaths: string[],
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {}
): Promise<string[]> {
  if (!storagePaths || storagePaths.length === 0) {
    return []
  }

  // Separate external URLs from storage paths
  const pathsWithInfo = storagePaths.map((path, index) => {
    const isExternal = path && (path.startsWith("http://") || path.startsWith("https://"))
    return { path, index, isExternal }
  })

  const externalUrls = pathsWithInfo.filter(p => p.isExternal)
  const storagePaths_internal = pathsWithInfo.filter(p => !p.isExternal && p.path && p.path.trim() !== "")

  // If all are external URLs, return them as-is
  if (storagePaths_internal.length === 0) {
    return pathsWithInfo.map(({ path, isExternal }) => 
      (isExternal && path) ? path : ""
    )
  }

  const supabase =
    deps.storageClient ?? (await resolveStorageClient())

  // Try batch signed URLs for internal paths (most efficient for private buckets)
  const { data: signedUrls, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(
      storagePaths_internal.map(({ path }) => path),
      DEFAULT_SIGNED_URL_EXPIRY
    )

  // Build result array preserving original order
  const result = new Array(storagePaths.length).fill("")
  
  // Fill in external URLs
  externalUrls.forEach(({ index, path }) => {
    result[index] = path
  })

  // Fill in signed URLs or fallback to public URLs
  if (!signedError && signedUrls && signedUrls.length === storagePaths_internal.length) {
    storagePaths_internal.forEach(({ index }, i) => {
      result[index] = signedUrls[i]?.signedUrl || ""
    })
  } else {
    // Fallback: individual public URLs (only works for public buckets)
    storagePaths_internal.forEach(({ path, index }) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      result[index] = data?.publicUrl || ""
    })
  }

  return result
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
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {}
): Promise<boolean> {
  if (!storagePath || storagePath.trim() === "") {
    return false
  }

  try {
    const supabase =
      deps.storageClient ?? (await resolveStorageClient())

    // Extract directory and filename
    const lastSlashIndex = storagePath.lastIndexOf("/")
    if (lastSlashIndex === -1) {
      // No directory structure, search in root
      const { data, error } = await supabase.storage
        .from(bucket)
        .list("", { search: storagePath })

      return !error && !!data && data.length > 0
    }

    const directory = storagePath.substring(0, lastSlashIndex)
    const filename = storagePath.substring(lastSlashIndex + 1)

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(directory, { search: filename })

    return !error && !!data && data.length > 0
  } catch {
    return false
  }
}
