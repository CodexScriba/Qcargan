// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

const getClaimsMock = vi.fn()
const getUserMock = vi.fn()
const createServerClientMock = vi.fn()

vi.mock("next/server", () => {
  class MockResponse {
    headers: Headers
    cookies: {
      set: (name: string, value: string, options?: Record<string, unknown>) => void
      getAll: () => Array<{ name: string; value: string } & Record<string, unknown>>
    }
    private cookieStore: Array<
      { name: string; value: string } & Record<string, unknown>
    >

    constructor(location?: string) {
      this.headers = new Headers()
      this.cookieStore = []

      if (location) {
        this.headers.set("location", location)
      }

      this.cookies = {
        set: (name, value, options = {}) => {
          this.cookieStore.push({ name, value, ...options })
        },
        getAll: () => this.cookieStore,
      }
    }
  }

  return {
    NextResponse: {
      next: () => new MockResponse(),
      redirect: (url: string | URL) => new MockResponse(url.toString()),
    },
  }
})

vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: any[]) => {
    createServerClientMock(...args)
    return {
      auth: {
        getClaims: getClaimsMock,
        getUser: getUserMock,
      },
    }
  },
}))

function makeRequest(url: string) {
  return {
    nextUrl: new URL(url),
    cookies: {
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
    },
  } as any
}

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects unauthenticated users on protected routes", async () => {
    getClaimsMock.mockResolvedValueOnce({ data: { claims: null } })
    getUserMock.mockResolvedValueOnce({ data: { user: null } })

    const { updateSession } = await import("../proxy")
    const response = await updateSession(
      makeRequest("https://example.com/protected"),
    )

    const location = response.headers.get("location")
    expect(location).toBeTruthy()

    const redirectUrl = new URL(location!)
    expect(redirectUrl.pathname).toBe("/auth/ingresar")
    expect(redirectUrl.searchParams.get("redirectTo")).toBe("/protected")
  })

  it("allows authenticated users on protected routes", async () => {
    getClaimsMock.mockResolvedValueOnce({ data: { claims: { sub: "1" } } })
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "1" } } })

    const { updateSession } = await import("../proxy")
    const response = await updateSession(
      makeRequest("https://example.com/protected"),
    )

    expect(response.headers.get("location")).toBeNull()
  })
})
