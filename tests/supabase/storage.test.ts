import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import type { SupabaseClient } from "@supabase/supabase-js"

import {
  __setStorageClientFactory,
  getPublicImageUrl,
  getPublicImageUrls,
  imageExists,
} from "@/lib/supabase/storage"

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

function createMockClient(
  config: StorageMockConfig,
  tracker: CallTracker
): SupabaseClient {
  return {
    storage: {
      from: () => ({
        createSignedUrl: async (path: string, expiresIn: number) => {
          tracker.signedUrlCalls.push(path)

          if (config.failSigned) {
            return {
              data: null,
              error: { message: "signed error", name: "StorageError" },
            }
          }

          const signedUrl =
            config.signedUrls?.[path] ?? defaultSignedUrl(path) + `&exp=${expiresIn}`

          return { data: { signedUrl }, error: null }
        },
        createSignedUrls: async (paths: string[], expiresIn: number) => {
          tracker.signedUrlsCalls.push(paths)

          if (config.failBatch) {
            return {
              data: null,
              error: { message: "batch error", name: "StorageError" },
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
          tracker.listCalls.push(filename ?? "")
          const exists = filename && config.existingFiles?.includes(filename)
          return {
            data: exists
              ? [{
                  name: filename,
                  id: "1",
                  updated_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  last_accessed_at: new Date().toISOString(),
                  metadata: {},
                }]
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

beforeEach(() => {
  tracker = createTracker()
  config = { signedUrls: {} }
  __setStorageClientFactory(async () => createMockClient(config, tracker))
})

afterEach(() => {
  __setStorageClientFactory(null)
})

describe("storage helper", () => {
  test("returns signed URL when available", async () => {
    const url = await getPublicImageUrl("vehicles/hero.jpg")

    expect(url).toContain("sign")
    expect(tracker.signedUrlCalls).toEqual(["vehicles/hero.jpg"])
    expect(tracker.publicUrlCalls).toHaveLength(0)
  })

  test("falls back to public URL when signed URL fails", async () => {
    config.failSigned = true

    const url = await getPublicImageUrl("vehicles/hero.jpg")

    expect(url).toContain("public")
    expect(tracker.publicUrlCalls).toEqual(["vehicles/hero.jpg"])
  })

  test("batch helper prefers createSignedUrls", async () => {
    const urls = await getPublicImageUrls([
      "vehicles/one.jpg",
      "vehicles/two.jpg",
    ])

    expect(urls.every((url) => url.includes("sign"))).toBe(true)
    expect(tracker.signedUrlsCalls).toHaveLength(1)
    expect(tracker.publicUrlCalls).toHaveLength(0)
  })

  test("batch helper falls back to public URLs when batch fails", async () => {
    config.failBatch = true

    const urls = await getPublicImageUrls([
      "vehicles/one.jpg",
      "vehicles/two.jpg",
    ])

    expect(urls.every((url) => url.includes("public"))).toBe(true)
    expect(tracker.publicUrlCalls).toEqual([
      "vehicles/one.jpg",
      "vehicles/two.jpg",
    ])
  })

  test("imageExists validates files", async () => {
    config.existingFiles = ["exists.jpg"]

    const found = await imageExists("vehicles/exists.jpg")
    const missing = await imageExists("vehicles/missing.jpg")

    expect(found).toBe(true)
    expect(missing).toBe(false)
    expect(tracker.listCalls).toContain("exists.jpg")
  })

  test("handles empty inputs gracefully", async () => {
    const emptyUrl = await getPublicImageUrl("")
    const emptyBatch = await getPublicImageUrls([])

    expect(emptyUrl).toBe("")
    expect(emptyBatch).toEqual([])
  })
})
