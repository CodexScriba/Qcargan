// @vitest-environment jsdom

import React from "react"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import { useTheme } from "next-themes"
import { describe, expect, it, beforeEach, afterEach } from "vitest"

import { ThemeProvider } from "@/components/ThemeProvider"

function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div>
      <button type="button" onClick={() => setTheme("light")}>
        light
      </button>
      <button type="button" onClick={() => setTheme("dark")}>
        dark
      </button>
    </div>
  )
}

describe("ThemeProvider", () => {
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

  it("renders children without error", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>child</div>
      </ThemeProvider>
    )

    expect(screen.getByText("child")).toBeInTheDocument()
  })

  it("toggles theme via class and updates CSS variables", async () => {
    const style = document.createElement("style")
    style.dataset.testTheme = "true"
    style.textContent = `
      :root { --test-color: white; }
      .dark { --test-color: black; }
    `
    document.head.appendChild(style)

    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeToggle />
      </ThemeProvider>
    )

    const initialValue = getComputedStyle(document.documentElement)
      .getPropertyValue("--test-color")
      .trim()

    fireEvent.click(screen.getByRole("button", { name: "dark" }))

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark")
    })

    const updatedValue = getComputedStyle(document.documentElement)
      .getPropertyValue("--test-color")
      .trim()

    expect(initialValue).toBe("white")
    expect(updatedValue).toBe("black")
  })

  it("persists theme in localStorage", async () => {
    const { unmount } = render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: "dark" }))

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("dark")
    })

    unmount()

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark")
    })
  })
})
