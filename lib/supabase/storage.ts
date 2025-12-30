import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const VEHICLE_IMAGES_BUCKET = 'vehicle-images'
const DEFAULT_SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7

export type StorageDeps = {
  storageClient?: SupabaseClient
}

type VehicleImagePathInput = {
  brand: string
  model: string
  type: string
  variant?: string | null
  extension?: string
}

let cachedServiceClient: SupabaseClient | null = null
let storageClientOverride: (() => Promise<SupabaseClient>) | null = null

function assertStorageEnv() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY environment variables',
    )
  }

  return { url, serviceRoleKey }
}

function createServiceRoleClient(): SupabaseClient {
  if (!cachedServiceClient) {
    const { url, serviceRoleKey } = assertStorageEnv()
    cachedServiceClient = createSupabaseClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  }

  return cachedServiceClient
}

async function resolveStorageClient(): Promise<SupabaseClient> {
  if (storageClientOverride) {
    return storageClientOverride()
  }

  if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createServiceRoleClient()
  }

  const { createClient } = await import('@/lib/supabase/client')
  return createClient()
}

function isExternalUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://')
}

function normalizeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .trim()
}

/**
 * Test-only helper to override the storage client factory.
 */
export function __setStorageClientFactory(
  factory: (() => Promise<SupabaseClient>) | null,
) {
  storageClientOverride = factory
}

export function buildVehicleImagePath({
  brand,
  model,
  variant,
  type,
  extension = 'jpg',
}: VehicleImagePathInput): string {
  if (!brand?.trim() || !model?.trim() || !type?.trim()) {
    return ''
  }

  const safeExtension = extension.trim().replace(/^\./, '') || 'jpg'
  const brandSegment = normalizeSegment(brand)
  const modelSegment = normalizeSegment(model)
  const variantSegment = variant ? normalizeSegment(variant) : ''
  const typeSegment = normalizeSegment(type)

  if (!brandSegment || !modelSegment || !typeSegment) {
    return ''
  }

  const filenameParts = [modelSegment, variantSegment, typeSegment].filter(Boolean)

  return `vehicles/${brandSegment}/${filenameParts.join('-')}.${safeExtension}`
}

export async function getPublicImageUrl(
  storagePath: string,
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {},
): Promise<string> {
  if (!storagePath || storagePath.trim() === '') {
    return ''
  }

  if (isExternalUrl(storagePath)) {
    return storagePath
  }

  const supabase = deps.storageClient ?? (await resolveStorageClient())

  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, DEFAULT_SIGNED_URL_EXPIRY)

  if (!signedError && signedData?.signedUrl) {
    return signedData.signedUrl
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(storagePath)

  return publicData?.publicUrl || ''
}

export async function getPublicImageUrls(
  storagePaths: string[],
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {},
): Promise<string[]> {
  if (!storagePaths || storagePaths.length === 0) {
    return []
  }

  const pathsWithInfo = storagePaths.map((path, index) => {
    const trimmed = path?.trim() ?? ''
    const isExternal = !!trimmed && isExternalUrl(trimmed)
    return { path: trimmed, index, isExternal }
  })

  const externalUrls = pathsWithInfo.filter((entry) => entry.isExternal)
  const internalPaths = pathsWithInfo.filter(
    (entry) => !entry.isExternal && entry.path !== '',
  )

  if (internalPaths.length === 0) {
    return pathsWithInfo.map(({ path, isExternal }) => (isExternal ? path : ''))
  }

  const supabase = deps.storageClient ?? (await resolveStorageClient())

  const { data: signedUrls, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(
      internalPaths.map(({ path }) => path),
      DEFAULT_SIGNED_URL_EXPIRY,
    )

  const result = new Array(storagePaths.length).fill('')

  externalUrls.forEach(({ index, path }) => {
    result[index] = path
  })

  if (!signedError && signedUrls && signedUrls.length === internalPaths.length) {
    internalPaths.forEach(({ index }, i) => {
      result[index] = signedUrls[i]?.signedUrl || ''
    })
  } else {
    internalPaths.forEach(({ path, index }) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      result[index] = data?.publicUrl || ''
    })
  }

  return result
}

export async function imageExists(
  storagePath: string,
  bucket: string = VEHICLE_IMAGES_BUCKET,
  deps: StorageDeps = {},
): Promise<boolean> {
  if (!storagePath || storagePath.trim() === '') {
    return false
  }

  try {
    const supabase = deps.storageClient ?? (await resolveStorageClient())

    const lastSlashIndex = storagePath.lastIndexOf('/')
    if (lastSlashIndex === -1) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', { search: storagePath })

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
