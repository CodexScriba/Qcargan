// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import HomePage from "../page"

let currentMessages: Record<string, Record<string, string>> = {}

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: string) => (key: string) =>
    currentMessages[namespace]?.[key] ?? key,
}))

describe("HomePage Integration", () => {
  it("renders translated content from server translations", async () => {
    currentMessages = {
      Home: {
        heroTitle: "Test Title",
        heroDescription: "Test Description",
      },
    }

    const params = Promise.resolve({ locale: "es" })
    const ui = await HomePage({ params })

    render(ui)

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
    expect(screen.getByText("Locale: es")).toBeInTheDocument()
  })
})
