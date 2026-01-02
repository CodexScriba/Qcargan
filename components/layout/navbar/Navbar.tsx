"use client"

import { useLayoutEffect, useRef } from "react"
import { ArrowRight, LogIn } from "lucide-react"
import { useTranslations } from "next-intl"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

import { Logo } from "./Logo"
import { MobileMenu } from "./MobileMenu"
import { NavLinks } from "./NavLinks"

export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null)
  const t = useTranslations("nav")

  useLayoutEffect(() => {
    if (typeof window === "undefined") return
    const element = headerRef.current
    if (!element) return

    const update = () => {
      const { height } = element.getBoundingClientRect()
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${Math.round(height)}px`
      )
    }

    update()

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update)
      observer.observe(element)
    }

    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      observer?.disconnect()
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-muted/40 text-foreground shadow-[0_6px_20px_-15px_rgba(15,23,42,0.4)] backdrop-blur supports-[backdrop-filter]:bg-muted/20"
    >
      <div className="hidden lg:block">
        <nav className="flex h-20 w-full items-center gap-6 px-6">
          <Logo />
          <div className="flex flex-1 justify-center">
            <NavLinks />
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button asChild variant="ghost" className="gap-2 transition-all duration-300 hover:-translate-y-[1px]">
              <Link href={"/auth/login" as any}>
                <LogIn className="h-4 w-4" />
                {t("login")}
              </Link>
            </Button>
            <Button asChild className="gap-2 shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)]">
              <Link href={"/auth/sign-up" as any}>
                {t("signUp")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      <div className="hidden md:block lg:hidden">
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <NavLinks variant="condensed" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 transition-all duration-300 hover:-translate-y-[1px]"
            >
              <Link href={"/auth/login" as any}>
                <LogIn className="h-4 w-4" />
                {t("login")}
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2 shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)]">
              <Link href={"/auth/sign-up" as any}>
                {t("join")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      <div className="block md:hidden">
        <nav className="flex h-14 w-full items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}
