import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

import {
  __setStorageClientFactory,
  buildVehicleImagePath,
  getPublicImageUrl,
  getPublicImageUrls,
  imageExists,
} from '@/lib/supabase/storage'

type StorageMockConfig = {
  signedUrls?: Record<string, string>
  failSigned?: boolean
  failBatch?: boolean
  existingFiles?: string[]
}

type CallTracker = {
  signedUrlCalls: string[]
  signedUrlsCalls: string[][]
  publicUrlCalls: string[]
  listCalls: string[]
}

const defaultSignedUrl = (path: string) =>
  `https://example.supabase.co/storage/v1/object/sign/vehicle-images/${path}?token=test`

function createTracker(): CallTracker {
  return {
    signedUrlCalls: [],
    signedUrlsCalls: [],
    publicUrlCalls: [],
    listCalls: [],
  }
}

function createMockClient(config: StorageMockConfig, tracker: CallTracker): SupabaseClient {
  return {
    storage: {
      from: () => ({
        createSignedUrl: async (path: string, expiresIn: number) => {
          tracker.signedUrlCalls.push(path)

          if (config.failSigned) {
            return {
              data: null,
              error: { message: 'signed error', name: 'StorageError' },
            }
          }

          const signedUrl =
            config.signedUrls?.[path] ?? `${defaultSignedUrl(path)}&exp=${expiresIn}`

          return { data: { signedUrl }, error: null }
        },
        createSignedUrls: async (paths: string[], _expiresIn: number) => {
          tracker.signedUrlsCalls.push(paths)

          if (config.failBatch) {
            return {
              data: null,
              error: { message: 'batch error', name: 'StorageError' },
            }
          }

          const data = paths.map((path) => ({
            signedUrl: config.signedUrls?.[path] ?? defaultSignedUrl(path),
          }))

          return { data, error: null }
        },
        getPublicUrl: (path: string) => {
          tracker.publicUrlCalls.push(path)
          return {
            data: {
              publicUrl: `https://example.supabase.co/storage/v1/object/public/vehicle-images/${path}`,
            },
          }
        },
        list: async (_dir: string, options?: { search?: string }) => {
          const filename = options?.search
          tracker.listCalls.push(filename ?? '')
          const exists = filename && config.existingFiles?.includes(filename)
          return {
            data: exists
              ? [
                  {
                    name: filename,
                    id: '1',
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    last_accessed_at: new Date().toISOString(),
                    metadata: {},
                  },
                ]
              : [],
            error: null,
          }
        },
      }),
    },
  } as unknown as SupabaseClient
}

let tracker: CallTracker
let config: StorageMockConfig

describe('storage helpers (unit)', () => {
  beforeEach(() => {
    tracker = createTracker()
    config = { signedUrls: {} }
    __setStorageClientFactory(async () => createMockClient(config, tracker))
  })

  afterEach(() => {
    __setStorageClientFactory(null)
  })

  it('returns signed URL when available', async () => {
    const url = await getPublicImageUrl('vehicles/hero.jpg')

    expect(url).toContain('/storage/v1/object/sign/vehicle-images/vehicles/hero.jpg')
    expect(tracker.signedUrlCalls).toEqual(['vehicles/hero.jpg'])
    expect(tracker.publicUrlCalls).toHaveLength(0)
  })

  it('falls back to public URL when signed URL fails', async () => {
    config.failSigned = true

    const url = await getPublicImageUrl('vehicles/hero.jpg')

    expect(url).toContain('/storage/v1/object/public/vehicle-images/vehicles/hero.jpg')
    expect(tracker.publicUrlCalls).toEqual(['vehicles/hero.jpg'])
  })

  it('batch helper prefers createSignedUrls', async () => {
    const urls = await getPublicImageUrls(['vehicles/one.jpg', 'vehicles/two.jpg'])

    expect(urls.every((url) => url.includes('/storage/v1/object/sign/'))).toBe(true)
    expect(tracker.signedUrlsCalls).toHaveLength(1)
    expect(tracker.publicUrlCalls).toHaveLength(0)
  })

  it('batch helper falls back to public URLs when batch fails', async () => {
    config.failBatch = true

    const urls = await getPublicImageUrls(['vehicles/one.jpg', 'vehicles/two.jpg'])

    expect(urls.every((url) => url.includes('/storage/v1/object/public/'))).toBe(true)
    expect(tracker.publicUrlCalls).toEqual(['vehicles/one.jpg', 'vehicles/two.jpg'])
  })

  it('passes through external URLs', async () => {
    const externalUrl = 'https://cdn.example.com/vehicles/hero.jpg'

    const url = await getPublicImageUrl(externalUrl)
    const urls = await getPublicImageUrls([externalUrl])

    expect(url).toBe(externalUrl)
    expect(urls).toEqual([externalUrl])
  })

  it('imageExists validates files', async () => {
    config.existingFiles = ['exists.jpg']

    const found = await imageExists('vehicles/exists.jpg')
    const missing = await imageExists('vehicles/missing.jpg')

    expect(found).toBe(true)
    expect(missing).toBe(false)
    expect(tracker.listCalls).toContain('exists.jpg')
  })

  it('handles empty inputs gracefully', async () => {
    const emptyUrl = await getPublicImageUrl('')
    const emptyBatch = await getPublicImageUrls([])

    expect(emptyUrl).toBe('')
    expect(emptyBatch).toEqual([])
  })

  it('builds vehicle image paths using the expected convention', () => {
    const path = buildVehicleImagePath({
      brand: 'BYD',
      model: 'Seagull',
      variant: 'Freedom',
      type: 'hero',
    })

    expect(path).toBe('vehicles/byd/seagull-freedom-hero.jpg')
  })
})

describe('storage helpers (integration)', () => {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const runIntegration = supabaseUrl && serviceRoleKey ? it : it.skip

  runIntegration('uploads and retrieves a test image', async () => {
    __setStorageClientFactory(null)

    const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    const bucket = 'vehicle-images'
    const storagePath = buildVehicleImagePath({
      brand: 'integration',
      model: 'testcar',
      variant: 'base',
      type: 'hero',
    })

    const payload = new Blob([Buffer.from('test')], { type: 'image/jpeg' })

    try {
      const upload = await supabase.storage
        .from(bucket)
        .upload(storagePath, payload, { upsert: true, contentType: 'image/jpeg' })

      expect(upload.error).toBeNull()

      const url = await getPublicImageUrl(storagePath, bucket, { storageClient: supabase })
      expect(url).toContain('/storage/v1/object/')
      expect(url).toContain(bucket)

      const exists = await imageExists(storagePath, bucket, { storageClient: supabase })
      expect(exists).toBe(true)
    } finally {
      await supabase.storage.from(bucket).remove([storagePath])
    }
  })
})
