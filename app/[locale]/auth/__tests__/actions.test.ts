// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest"

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

const signUpMock = vi.fn()

vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn((name: string) => {
        if (name === "origin") return "https://example.com"
        if (name === "x-forwarded-proto") return "https"
        return null
      }),
    })
  ),
  cookies: vi.fn(() =>
    Promise.resolve({
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
    })
  ),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      signUp: signUpMock,
      signInWithPassword: vi.fn(),
    },
  })),
}))

describe("signUpAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns field error for password mismatch", async () => {
    const { signUpAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "123456")
    formData.set("confirmPassword", "654321")

    const result = await signUpAction({}, formData)

    expect(result.fieldErrors?.confirmPassword).toBeDefined()
    expect(signUpMock).not.toHaveBeenCalled()
  })

  it("returns field error for invalid email", async () => {
    const { signUpAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "not-an-email")
    formData.set("password", "123456")
    formData.set("confirmPassword", "123456")

    const result = await signUpAction({}, formData)

    expect(result.fieldErrors?.email).toBeDefined()
    expect(signUpMock).not.toHaveBeenCalled()
  })

  it("calls supabase signUp with correct data when validation passes", async () => {
    signUpMock.mockResolvedValueOnce({ error: null })

    const { signUpAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "123456")
    formData.set("confirmPassword", "123456")

    const result = await signUpAction({}, formData)

    expect(signUpMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
      options: {
        emailRedirectTo: "https://example.com/auth/callback",
      },
    })
    expect(result.success).toBe(true)
  })

  it("returns generic error when supabase signUp fails", async () => {
    signUpMock.mockResolvedValueOnce({
      error: new Error("User already exists"),
    })

    const { signUpAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "existing@example.com")
    formData.set("password", "123456")
    formData.set("confirmPassword", "123456")

    const result = await signUpAction({}, formData)

    expect(result.error).toBe("signUpFailed")
    expect(result.success).toBeUndefined()
  })

  it("normalizes email to lowercase", async () => {
    signUpMock.mockResolvedValueOnce({ error: null })

    const { signUpAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "TEST@EXAMPLE.COM")
    formData.set("password", "123456")
    formData.set("confirmPassword", "123456")

    await signUpAction({}, formData)

    expect(signUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
      })
    )
  })
})
