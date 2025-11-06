import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

const locales = ["es", "en"] as const;

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
  "/vehicles": "/vehicles",
  "/vehicles/sedan": "/vehicles/sedan",
  "/vehicles/suv": "/vehicles/suv",
  "/vehicles/city": "/vehicles/city",
  "/vehicles/pickups": "/vehicles/pickups",
  "/vehicles/newest": "/vehicles/newest",
  "/vehicles/best-value": "/vehicles/best-value",
  "/vehicles/top-rated": "/vehicles/top-rated",
  "/used-cars/waitlist": "/used-cars/waitlist",
  "/services": "/services",
  "/services/financing": "/services/financing",
  "/services/electricians": "/services/electricians",
  "/services/workshops": "/services/workshops",
  "/services/detailing": "/services/detailing",
  "/services/insurance": "/services/insurance",
  "/shop": "/shop",
  "/shop/portable-chargers": "/shop/portable-chargers",
  "/shop/wall-chargers": "/shop/wall-chargers",
  "/shop/accessories": "/shop/accessories",
  "/shop/tires": "/shop/tires",
};

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
