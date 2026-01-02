"use client"

import { useState } from "react"
import { ArrowRight, LogIn, Menu } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "@/lib/i18n/navigation"
import { NavLinks } from "./NavLinks"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations("nav")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("navigate")}
          className="transition-all duration-300 hover:-translate-y-[1px]"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40"
      >
        <SheetHeader>
          <SheetTitle className="text-lg">{t("navigate")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col">
          <NavLinks orientation="vertical" onNavigate={() => setOpen(false)} />
          <div className="mt-auto flex flex-col gap-3 p-4">
            <Button asChild variant="outline" className="gap-2">
              <Link href={"/auth/login" as any} onClick={() => setOpen(false)}>
                <LogIn className="h-4 w-4" />
                {t("login")}
              </Link>
            </Button>
            <Button asChild className="gap-2 shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)]">
              <Link href={"/auth/sign-up" as any} onClick={() => setOpen(false)}>
                {t("signUp")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
