"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Link } from "@/lib/i18n/navigation"
import { cn } from "@/lib/utils"

const logoSources = {
  dark: "/images/logo/logo-dark.jpg",
  light: "/images/logo/logo-light.png",
}

export function Logo({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="h-10 w-10 rounded-full bg-muted/50 animate-pulse" />
        <div className="hidden h-4 w-24 rounded-full bg-muted/40 animate-pulse md:block" />
      </div>
    )
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <Image
        src={logoSources[theme]}
        alt="Qcargan logo"
        height={40}
        width={40}
        className="rounded-full transition group-hover:opacity-80"
        priority
      />
      <span className="hidden text-base font-semibold text-foreground md:inline">
        Qcargan
      </span>
    </Link>
  )
}
