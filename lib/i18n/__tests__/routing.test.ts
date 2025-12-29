// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { getPathname } from "../navigation"

// Mock next-intl/navigation
vi.mock("next-intl/navigation", () => ({
  createNavigation: (routing: any) => {
    const { pathnames, defaultLocale, localePrefix } = routing
    return {
      getPathname: ({ locale, href }: { locale: string, href: string }) => {
        const pathEntry = pathnames[href]
        if (!pathEntry) return href // simplistic fallback
        
        let localizedPath = ""
        if (typeof pathEntry === "string") {
          localizedPath = pathEntry
        } else {
          localizedPath = pathEntry[locale] || href
        }

        // Handle prefixing simplistic logic for test
        if (localePrefix === "as-needed" && locale !== defaultLocale) {
            return `/${locale}${localizedPath === "/" ? "" : localizedPath}`
        }
        return localizedPath
      }
    }
  }
}))

describe("Routing Pathnames", () => {
  it("returns correct Spanish path for login", () => {
    const path = getPathname({ locale: "es", href: "/auth/login" })
    expect(path).toBe("/auth/ingresar")
  })

  it("returns correct English path for login", () => {
    const path = getPathname({ locale: "en", href: "/auth/login" })
    expect(path).toBe("/en/auth/login")
  })

  it("returns correct Spanish path for vehicles", () => {
    const path = getPathname({ locale: "es", href: "/vehicles" })
    expect(path).toBe("/vehiculos")
  })

  it("returns correct English path for vehicles", () => {
    const path = getPathname({ locale: "en", href: "/vehicles" })
    expect(path).toBe("/en/vehicles")
  })

  it("handles shared paths correctly", () => {
    const path = getPathname({ locale: "es", href: "/shop" })
    expect(path).toBe("/shop")
  })

  it("handles shared paths with english prefix", () => {
    const path = getPathname({ locale: "en", href: "/shop" })
    expect(path).toBe("/en/shop")
  })
})
