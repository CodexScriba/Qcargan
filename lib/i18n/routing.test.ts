import { describe, expect, test } from "vitest"

import { routing } from "@/lib/i18n/routing"

describe("i18n routing", () => {
  test("includes es and en locales", () => {
    expect(routing.locales).toEqual(["es", "en"])
  })

  test("uses es as default locale", () => {
    expect(routing.defaultLocale).toBe("es")
  })
})
