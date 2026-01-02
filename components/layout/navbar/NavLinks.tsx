"use client"

import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

type NavLinkVariant = "full" | "condensed"

type NavLinksProps = {
  variant?: NavLinkVariant
  orientation?: "horizontal" | "vertical"
  size?: "default" | "sm"
  className?: string
  onNavigate?: () => void
}

const fullNavLinks = [
  { key: "home", href: "/" },
  { key: "pricing", href: "/precios" },
  { key: "newCars", href: "/vehicles" },
  { key: "usedCars", href: "/used-cars/waitlist" },
  { key: "services", href: "/services" },
  { key: "shop", href: "/shop" },
]

const condensedNavLinks = [
  { key: "home", href: "/" },
  { key: "newCars", href: "/vehicles" },
  { key: "services", href: "/services" },
  { key: "shop", href: "/shop" },
]

export function NavLinks({
  variant = "full",
  orientation = "horizontal",
  size = "default",
  className,
  onNavigate,
}: NavLinksProps) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const links = variant === "condensed" ? condensedNavLinks : fullNavLinks

  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-2"
          : "flex flex-col divide-y divide-border/60",
        className
      )}
    >
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(`${link.href}/`))

        return (
          <Link
            key={link.href}
            href={link.href as any}
            onClick={onNavigate}
            className={cn(
              "group relative inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 hover:-translate-y-[1px]",
              orientation === "horizontal"
                ? "px-3 py-2"
                : "px-4 py-3 text-left",
              size === "sm" ? "text-[11px] uppercase tracking-[0.18em]" : "text-sm",
              isActive
                ? "bg-[hsl(var(--primary))] text-white shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)]"
                : "text-muted-foreground/80 hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span className="relative z-10">{t(link.key)}</span>
            <span
              className={cn(
                "absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-primary/30 to-transparent opacity-0 transition-opacity duration-300",
                isActive && "opacity-60"
              )}
            />
          </Link>
        )
      })}
    </div>
  )
}
