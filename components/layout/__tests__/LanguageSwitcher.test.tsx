// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { useLocale } from "next-intl"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LanguageSwitcher } from "@/components/layout/language-switcher"

let currentLocale = "es"
const pathname = "/vehicles"
const replaceSpy = vi.fn()

vi.mock("next-intl", () => ({
  useLocale: () => currentLocale,
}))

vi.mock("@/lib/i18n/navigation", () => ({
  useRouter: () => ({ replace: replaceSpy }),
  usePathname: () => pathname,
}))

function LocaleEcho() {
  const locale = useLocale()
  return <span>Locale: {locale}</span>
}

function TestHarness() {
  return (
    <div>
      <LanguageSwitcher />
      <LocaleEcho />
    </div>
  )
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    currentLocale = "es"
    replaceSpy.mockReset()
    replaceSpy.mockImplementation((_path, options) => {
      if (options?.locale) {
        currentLocale = options.locale
      }
    })
  })

  it("shows available locales and highlights the current locale", () => {
    render(<LanguageSwitcher />)

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveAttribute("data-active", "true")
    expect(buttons[1]).not.toHaveAttribute("data-active", "true")
  })

  it("switches from es to en by updating the URL locale", () => {
    render(<LanguageSwitcher />)

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[1])

    expect(replaceSpy).toHaveBeenCalledWith(pathname, { locale: "en" })
  })

  it("updates page content when the locale changes", () => {
    const { rerender } = render(<TestHarness />)

    expect(screen.getByText("Locale: es")).toBeInTheDocument()

    const buttons = screen.getAllByRole("button")
    fireEvent.click(buttons[1])

    rerender(<TestHarness />)

    expect(screen.getByText("Locale: en")).toBeInTheDocument()
  })
})
