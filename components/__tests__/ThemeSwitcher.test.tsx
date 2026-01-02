// @vitest-environment jsdom

import React from "react"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import { describe, expect, it, beforeEach, afterEach } from "vitest"

import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"

function renderWithThemeProvider() {
  return render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSwitcher />
    </ThemeProvider>
  )
}

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
    document.head.querySelectorAll("style[data-test-theme]").forEach((node) => {
      node.remove()
    })
  })

  afterEach(() => {
    cleanup()
    document.body.innerHTML = ""
  })

  it("toggles theme on click", async () => {
    renderWithThemeProvider()

    const toggle = await screen.findByRole("button", {
      name: "Switch to dark mode",
    })

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark")
    })

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument()
  })

  it("persists theme on refresh", async () => {
    const { unmount } = renderWithThemeProvider()

    const toggle = await screen.findByRole("button", {
      name: "Switch to dark mode",
    })

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark")
    })

    unmount()

    renderWithThemeProvider()

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark")
    })

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument()
  })
})
