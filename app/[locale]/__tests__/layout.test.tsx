// @vitest-environment jsdom
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import LocaleLayout, { generateStaticParams } from "../layout"
import { notFound } from "next/navigation"

// Mock next-intl
vi.mock("next-intl", () => ({
  hasLocale: vi.fn((locales: string[], locale: string) => locales.includes(locale)),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="intl-provider">{children}</div>,
}))

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}))

vi.mock("@/i18n", () => ({
  getMessages: vi.fn(() => Promise.resolve({})),
}))

vi.mock("@/lib/i18n/routing", () => ({
  routing: {
    locales: ["es", "en"],
  },
}))

describe("LocaleLayout", () => {
  it("renders children when locale is valid", async () => {
    const params = Promise.resolve({ locale: "es" })
    const Layout = await LocaleLayout({
      children: <div data-testid="child">Child Content</div>,
      params,
    })

    render(Layout)

    expect(screen.getByTestId("intl-provider")).toBeInTheDocument()
    expect(screen.getByTestId("child")).toBeInTheDocument()
    expect(screen.getByText("Child Content")).toBeInTheDocument()
  })

  it("calls notFound when locale is invalid", async () => {
    const params = Promise.resolve({ locale: "fr" })
    
    await LocaleLayout({
      children: <div>Child Content</div>,
      params,
    })

    expect(notFound).toHaveBeenCalled()
  })
})

describe("generateStaticParams", () => {
  it("returns all locales from routing", () => {
    const params = generateStaticParams()
    expect(params).toEqual([{ locale: "es" }, { locale: "en" }])
  })
})
