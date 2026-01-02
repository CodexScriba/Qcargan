import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { routing, type Locale, type PathnameKey } from "@/lib/i18n/routing"
import { hasEnvVars } from "@/lib/utils"

const PROTECTED_PATH_PREFIXES = [
  "/protected",
  "/protegido",
  "/dashboard",
  "/admin",
]

function getLocaleFromPathname(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/")
  if (maybeLocale && routing.locales.includes(maybeLocale as Locale)) {
    return {
      locale: maybeLocale as Locale,
      hasPrefix: true,
      normalizedPath: `/${rest.join("/")}` || "/",
    }
  }

  return {
    locale: routing.defaultLocale,
    hasPrefix: false,
    normalizedPath: pathname || "/",
  }
}

function isProtectedPath(normalizedPath: string) {
  if (normalizedPath.startsWith("/auth")) {
    return false
  }

  return PROTECTED_PATH_PREFIXES.some(
    (prefix) =>
      normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  )
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  if (!hasEnvVars) {
    return response
  }

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  await supabase.auth.getClaims()

  const { normalizedPath, locale, hasPrefix } = getLocaleFromPathname(
    request.nextUrl.pathname,
  )
  if (isProtectedPath(normalizedPath)) {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      const loginPathname = routing.pathnames["/auth/login" as PathnameKey]
      const localizedLoginPath =
        typeof loginPathname === "string"
          ? loginPathname
          : loginPathname[locale]
      const needsPrefix = hasPrefix || locale !== routing.defaultLocale
      const loginPath = `${needsPrefix ? `/${locale}` : ""}${localizedLoginPath}`
      const loginUrl = new URL(loginPath, request.nextUrl.origin)
      const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`

      loginUrl.searchParams.set("redirectTo", redirectTo)

      const redirectResponse = NextResponse.redirect(loginUrl)
      response.cookies.getAll().forEach(({ name, value, ...options }) => {
        redirectResponse.cookies.set(name, value, options)
      })

      return redirectResponse
    }
  }

  return response
}
