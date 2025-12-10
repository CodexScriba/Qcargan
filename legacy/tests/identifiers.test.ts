import { describe, expect, test } from "bun:test"
import {
  EXAMPLE_SLUGS,
  generateVehicleSlug,
  isValidVehicleSlug,
} from "@/lib/utils/identifiers"

describe("generateVehicleSlug", () => {
  test("builds slug with variant", () => {
    expect(generateVehicleSlug("BYD", "Seagull", 2025, "Freedom")).toBe(
      EXAMPLE_SLUGS.withVariant,
    )
  })

  test("omits variant when not provided", () => {
    expect(generateVehicleSlug("Nissan", "Leaf", 2023)).toBe(
      EXAMPLE_SLUGS.withoutVariant,
    )
  })

  test("normalizes diacritics and trademark symbols", () => {
    expect(
      generateVehicleSlug("Peugeot®", "E-208 GT™", 2024, "Édition Première"),
    ).toBe("peugeot-e-208-gt-edition-premiere-2024")
  })

  test("collapses whitespace and punctuation", () => {
    expect(generateVehicleSlug("Tesla", "Model 3", 2024, "Long Range")).toBe(
      EXAMPLE_SLUGS.multiWordVariant,
    )
  })

  test("handles multi-word model without variant", () => {
    expect(generateVehicleSlug("Ford", "F-150 Lightning", 2024, null)).toBe(
      EXAMPLE_SLUGS.multiWordModel,
    )
  })
})

describe("isValidVehicleSlug", () => {
  test("accepts valid slug", () => {
    expect(isValidVehicleSlug(EXAMPLE_SLUGS.withVariant)).toBe(true)
  })

  test("rejects slug with uppercase or invalid characters", () => {
    expect(isValidVehicleSlug("Invalid_Slug")).toBe(false)
    expect(isValidVehicleSlug("bad slug!")).toBe(false)
  })
})
