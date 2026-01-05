import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/i18n/navigation", () => ({
  getPathname: () => "/",
}))

const routeModule = import("../route")

describe("isSafeNextPath", () => {
  it("accepts same-origin paths", async () => {
    const { isSafeNextPath } = await routeModule
    expect(isSafeNextPath("/dashboard")).toBe(true)
    expect(isSafeNextPath("/vehicles/tesla?tab=specs")).toBe(true)
  })

  it("rejects scheme-relative and absolute URLs", async () => {
    const { isSafeNextPath } = await routeModule
    expect(isSafeNextPath("//evil.com")).toBe(false)
    expect(isSafeNextPath("https://evil.com")).toBe(false)
  })
})
