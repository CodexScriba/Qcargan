import { describe, expect, it } from "vitest"

import { isSafeNextPath } from "../route"

describe("isSafeNextPath", () => {
  it("accepts same-origin paths", () => {
    expect(isSafeNextPath("/dashboard")).toBe(true)
    expect(isSafeNextPath("/vehicles/tesla?tab=specs")).toBe(true)
  })

  it("rejects scheme-relative and absolute URLs", () => {
    expect(isSafeNextPath("//evil.com")).toBe(false)
    expect(isSafeNextPath("https://evil.com")).toBe(false)
  })
})
