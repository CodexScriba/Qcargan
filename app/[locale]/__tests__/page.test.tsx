// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import HomePage from "../page"

let currentMessages: Record<string, Record<string, string>> = {}

vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}))

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async (namespace: string) => (key: string) =>
    currentMessages[namespace]?.[key] ?? key,
}))

describe("HomePage Integration", () => {
  it("renders translated content from server translations", async () => {
    currentMessages = {
      Home: {
        heroBadge: "Badge",
        heroTitleStart: "Test Title",
        heroTitleEnd: "Test Suffix",
        heroSubtitle: "Test Subtitle",
        "cta.signup": "CTA",
        imageAlt: "Alt text",
        "stats.rangeLabel": "Range",
        "stats.rangeValue": "500 km+",
        "stats.accelerationLabel": "0-100 km/h",
        "stats.accelerationValue": "3.2s",
      },
    }

    const params = Promise.resolve({ locale: "es" })
    const ui = await HomePage({ params })

    render(ui)

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Suffix")).toBeInTheDocument()
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
    expect(screen.getByText("CTA")).toBeInTheDocument()
  })
})
