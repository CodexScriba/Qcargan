// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest"

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"
process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"

const signUpMock = vi.fn()
const signInWithPasswordMock = vi.fn()

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
    })
  ),
}))

const redirectMock = vi.fn()
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url)
    throw new Error("NEXT_REDIRECT")
  },
}))

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      signUp: signUpMock,
      signInWithPassword: signInWithPasswordMock,
    },
  })),
}))

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redirectMock.mockClear()
  })

  it("returns field error for invalid email", async () => {
    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "not-an-email")
    formData.set("password", "123456")

    const result = await loginAction({}, formData)

    expect(result.fieldErrors?.email).toBeDefined()
    expect(signInWithPasswordMock).not.toHaveBeenCalled()
  })

  it("returns field error for missing password", async () => {
    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "")

    const result = await loginAction({}, formData)

    expect(result.fieldErrors?.password).toBeDefined()
    expect(signInWithPasswordMock).not.toHaveBeenCalled()
  })

  it("calls supabase signInWithPassword with correct data when validation passes", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: null })

    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "password123")

    try {
      await loginAction({}, formData)
    } catch {
      // redirect throws, expected
    }

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
  })

  it("redirects to /dashboard on successful login", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: null })

    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "password123")

    try {
      await loginAction({}, formData)
    } catch {
      // redirect throws, expected
    }

    expect(redirectMock).toHaveBeenCalledWith("/dashboard")
  })

  it("returns generic error when credentials are invalid", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      error: new Error("Invalid login credentials"),
    })

    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "test@example.com")
    formData.set("password", "wrongpassword")

    const result = await loginAction({}, formData)

    expect(result.error).toBe("invalidCredentials")
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it("normalizes email to lowercase", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: null })

    const { loginAction } = await import("../actions")

    const formData = new FormData()
    formData.set("email", "TEST@EXAMPLE.COM")
    formData.set("password", "password123")

    try {
      await loginAction({}, formData)
    } catch {
      // redirect throws, expected
    }

    expect(signInWithPasswordMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
      })
    )
  })
})

describe("signUpAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    redirectMock.mockClear()
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
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
