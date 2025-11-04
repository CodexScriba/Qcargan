import { createNavigation, Pathnames } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

const locales = ["es", "en"] as const;

const pathnames = {
  "/": "/",
  "/precios": {
    es: "/precios",
    en: "/precies",
  },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
