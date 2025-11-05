"use client";

import { Link, getPathname, usePathname } from "@/i18n/routing";
import type { PathnameKey } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type NavigationKey = "Navigation.home" | "Navigation.pricing";

const NAV_ITEMS: Array<{ href: PathnameKey; labelKey: NavigationKey }> = [
  { href: "/", labelKey: "Navigation.home" },
  { href: "/precios", labelKey: "Navigation.pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          QueCargan
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {NAV_ITEMS.map(({ href, labelKey }) => {
            const localizedPath = getPathname({ locale, href });

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition hover:text-zinc-900 dark:hover:text-zinc-100",
                  pathname === localizedPath && "text-zinc-900 dark:text-zinc-100",
                )}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
