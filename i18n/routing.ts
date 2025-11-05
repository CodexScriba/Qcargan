import { createNavigation, type Pathnames } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

const locales = ["en", "es"] as const;

const pathnames = {
  "/": "/",
  "/protected": {
    en: "/protected",
    es: "/protegido",
  },
  "/protected/profile": {
    en: "/protected/profile",
    es: "/protegido/perfil",
  },
  "/protected/storage-demo": {
    en: "/protected/storage-demo",
    es: "/protegido/almacenamiento",
  },
  "/auth/login": {
    en: "/auth/login",
    es: "/auth/ingresar",
  },
  "/auth/sign-up": {
    en: "/auth/sign-up",
    es: "/auth/registrar",
  },
  "/auth/forgot-password": {
    en: "/auth/forgot-password",
    es: "/auth/recuperar",
  },
  "/auth/update-password": {
    en: "/auth/update-password",
    es: "/auth/actualizar-clave",
  },
  "/auth/sign-up-success": "/auth/sign-up-success",
  "/auth/error": "/auth/error",
  "/test": {
    en: "/test",
    es: "/prueba",
  },
  "/precios": {
    en: "/prices",
    es: "/precios",
  },
} satisfies Pathnames<typeof locales>;

export const routing = defineRouting({
  locales,
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type PathnameKey = keyof typeof pathnames;

const localePathSet = new Set<string>();

routing.locales.forEach((locale) => {
  (Object.keys(pathnames) as Array<PathnameKey>).forEach((href) => {
    const localizedPath = getPathname({ locale, href });

    localePathSet.add(localizedPath);

    if (locale === routing.defaultLocale) {
      const prefixedPath =
        localizedPath === "/"
          ? `/${locale}`
          : `/${locale}${localizedPath}`;

      localePathSet.add(prefixedPath);
    }
  });
});

export const publicLocalePaths = localePathSet;
