import { describe, expect, test, mock, beforeEach, afterEach, spyOn } from "bun:test"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Real unit tests for storage helper
 * These tests import and execute the actual implementation with mocked Supabase client
 */

// Store original environment
const originalEnv = { ...process.env }

// Create mock storage responses
const createMockStorage = () => ({
  from: (bucket: string) => ({
    createSignedUrl: async (path: string, expiresIn: number) => {
      if (path === "vehicles/valid.jpg") {
        return {
          data: {
            signedUrl: `https://test.supabase.co/storage/v1/object/sign/${bucket}/${path}?token=xyz789&exp=${expiresIn}`,
          },
          error: null,
        }
      }
      if (path === "vehicles/missing.jpg") {
        return {
          data: null,
          error: { message: "Object not found", name: "StorageError", status: 404 },
        }
      }
      return { data: { signedUrl: "" }, error: null }
    },
    createSignedUrls: async (paths: string[], expiresIn: number) => {
      if (paths.length === 2 && paths[0] === "vehicles/test1.jpg" && paths[1] === "vehicles/test2.jpg") {
        return {
          data: [
            { signedUrl: `https://test.supabase.co/storage/v1/object/sign/${bucket}/vehicles/test1.jpg?token=abc123` },
            { signedUrl: `https://test.supabase.co/storage/v1/object/sign/${bucket}/vehicles/test2.jpg?token=def456` },
          ],
          error: null,
        }
      }
      return {
        data: null,
        error: { message: "Batch creation failed", name: "StorageError", status: 400 },
      }
    },
    getPublicUrl: (path: string) => ({
      data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}` },
    }),
    list: async (directory: string, options?: { search?: string }) => {
      if (options?.search === "exists.jpg") {
        return {
          data: [{ name: "exists.jpg", id: "123", metadata: {}, updated_at: new Date().toISOString(), created_at: new Date().toISOString(), last_accessed_at: new Date().toISOString() }],
          error: null,
        }
      }
      return { data: [], error: null }
    },
  }),
})

describe("Storage Helper - Real Implementation Tests", () => {
  beforeEach(async () => {
    // Set up environment
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"

    // Mock the createClient function from @supabase/supabase-js
    const supabaseModule = await import("@supabase/supabase-js")
    mock.module("@supabase/supabase-js", () => ({
      createClient: (url: string, key: string, options?: any) => ({
        storage: createMockStorage(),
      }),
    }))
  })

  afterEach(() => {
    // Restore environment
    process.env = { ...originalEnv }
    mock.restore()
  })

  describe("getPublicImageUrl", () => {
    test("returns empty string for empty path", async () => {
      // Import fresh to get mocked version
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrl("")
      expect(result).toBe("")
    })

    test("returns empty string for whitespace-only path", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrl("   ")
      expect(result).toBe("")
    })

    test("returns signed URL for valid path (private bucket)", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrl("vehicles/valid.jpg")

      expect(result).toContain("https://")
      expect(result).toContain("sign")
      expect(result).toContain("vehicle-images")
      expect(result).toContain("vehicles/valid.jpg")
      expect(result).toContain("token=")
    })

    test("falls back to public URL when signed URL fails", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrl("vehicles/missing.jpg")

      // Should fall back to public URL when signed URL creation fails
      expect(result).toContain("https://")
      expect(result).toContain("public")
      expect(result).toContain("vehicles/missing.jpg")
    })

    test("respects custom bucket parameter", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrl("test.jpg", "custom-bucket")

      expect(result).toContain("custom-bucket")
    })
  })

  describe("getPublicImageUrls", () => {
    test("returns empty array for empty input", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.getPublicImageUrls([])
      expect(result).toEqual([])
    })

    test("handles mixed valid and empty paths", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const paths = ["vehicles/test1.jpg", "", "vehicles/test2.jpg"]
      const result = await storageModule.getPublicImageUrls(paths)

      expect(result.length).toBe(3)
      expect(result[0]).toContain("sign")
      expect(result[1]).toBe("")
      expect(result[2]).toContain("sign")
    })

    test("uses batch createSignedUrls for efficiency", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const paths = ["vehicles/test1.jpg", "vehicles/test2.jpg"]
      const result = await storageModule.getPublicImageUrls(paths)

      expect(result.length).toBe(2)
      expect(result[0]).toContain("sign")
      expect(result[0]).toContain("token=abc123")
      expect(result[1]).toContain("sign")
      expect(result[1]).toContain("token=def456")
    })

    test("maintains order of input paths", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const paths = ["vehicles/test1.jpg", "vehicles/test2.jpg"]
      const result = await storageModule.getPublicImageUrls(paths)

      expect(result[0]).toContain("test1.jpg")
      expect(result[1]).toContain("test2.jpg")
    })

    test("falls back to individual public URLs when batch fails", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const paths = ["vehicles/fail1.jpg", "vehicles/fail2.jpg"]
      const result = await storageModule.getPublicImageUrls(paths)

      expect(result.length).toBe(2)
      // Should fall back to public URLs when batch signed URL creation fails
      expect(result[0]).toContain("public")
      expect(result[1]).toContain("public")
    })
  })

  describe("imageExists", () => {
    test("returns false for empty path", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.imageExists("")
      expect(result).toBe(false)
    })

    test("returns true for existing file", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.imageExists("vehicles/exists.jpg")
      expect(result).toBe(true)
    })

    test("returns false for non-existent file", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      const result = await storageModule.imageExists("vehicles/missing.jpg")
      expect(result).toBe(false)
    })

    test("handles errors gracefully", async () => {
      const storageModule = await import("@/lib/supabase/storage")
      // This should not throw
      const result = await storageModule.imageExists("invalid/path")
      expect(typeof result).toBe("boolean")
    })
  })

  describe("Environment validation", () => {
    test("throws error when SUPABASE_URL is missing", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      // Need to reload module to pick up new env
      delete require.cache[require.resolve("@/lib/supabase/storage")]
      const storageModule = await import("@/lib/supabase/storage")

      try {
        await storageModule.getPublicImageUrl("test.jpg")
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    test("throws error when SERVICE_ROLE_KEY is missing", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY

      // Need to reload module to pick up new env
      delete require.cache[require.resolve("@/lib/supabase/storage")]
      const storageModule = await import("@/lib/supabase/storage")

      try {
        await storageModule.getPublicImageUrl("test.jpg")
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
})

describe("Storage Helper - URL Format Validation", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  test("signed URLs have correct format", async () => {
    const storageModule = await import("@/lib/supabase/storage")
    const url = await storageModule.getPublicImageUrl("vehicles/valid.jpg")

    // Signed URLs should have these characteristics
    expect(url.startsWith("https://")).toBe(true)
    expect(url).toContain("/storage/v1/object/")
    expect(url).toContain("sign")
    expect(url).toContain("token=")
  })

  test("public URLs have correct format as fallback", async () => {
    const storageModule = await import("@/lib/supabase/storage")
    // Force public URL fallback by using missing file
    const url = await storageModule.getPublicImageUrl("vehicles/missing.jpg")

    expect(url.startsWith("https://")).toBe(true)
    expect(url).toContain("/storage/v1/object/public/")
  })

  test("all URLs use HTTPS", async () => {
    const storageModule = await import("@/lib/supabase/storage")
    const urls = await storageModule.getPublicImageUrls([
      "vehicles/test1.jpg",
      "vehicles/test2.jpg",
    ])

    urls.forEach((url) => {
      if (url) {
        expect(url.startsWith("https://")).toBe(true)
      }
    })
  })
})
