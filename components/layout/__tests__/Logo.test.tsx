// @vitest-environment jsdom

import { render, screen, cleanup } from "@testing-library/react"
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"

import { Logo } from "@/components/layout/Logo"

let resolvedTheme = "light"

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme }),
}))

vi.mock("next/image", () => ({
  default: ({ src, alt, priority, ...props }: any) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe("Logo", () => {
  beforeEach(() => {
    resolvedTheme = "light"
  })

  afterEach(() => {
    cleanup()
  })

  it("renders the light logo when resolvedTheme is light", async () => {
    render(<Logo />)

    const image = await screen.findByAltText("Qcargan logo")
    expect(image).toHaveAttribute("src", "/images/logo/logo-light.png")
    expect(image).toHaveAttribute("height", "40")
    expect(image).toHaveAttribute("width", "40")
  })

  it("renders the dark logo when resolvedTheme is dark", async () => {
    resolvedTheme = "dark"
    render(<Logo />)

    const image = await screen.findByAltText("Qcargan logo")
    expect(image).toHaveAttribute("src", "/images/logo/logo-dark.jpg")
  })

  it("keeps the responsive text visibility classes", async () => {
    render(<Logo />)

    const text = await screen.findByText("Qcargan")
    expect(text).toHaveClass("hidden")
    expect(text).toHaveClass("md:inline")
  })
})
