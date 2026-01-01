import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { hasLocale } from "next-intl"

import { routing } from "@/lib/i18n/routing"
import { getPathname } from "@/lib/i18n/navigation"
import { hasEnvVars } from "@/lib/utils"

const LOCALE_COOKIE_KEYS = ["NEXT_LOCALE", "locale", "preferred_locale"]

function detectLocale(request: NextRequest) {
  for (const key of LOCALE_COOKIE_KEYS) {
    const value = request.cookies.get(key)?.value
    if (value && hasLocale(routing.locales, value)) {
      return value
    }
  }

  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(",")
      .map((entry) => entry.split(";")[0]?.trim())
      .filter(Boolean)

    for (const candidate of candidates) {
      const normalized = candidate.toLowerCase()
      const exactMatch = routing.locales.find(
        (locale) => locale.toLowerCase() === normalized
      )
      if (exactMatch) {
        return exactMatch
      }

      const base = normalized.split("-")[0]
      if (base && hasLocale(routing.locales, base)) {
        return base
      }
    }
  }

  return routing.defaultLocale
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const hasError = request.nextUrl.searchParams.has("error")
  const locale = detectLocale(request)
  const origin = request.nextUrl.origin
  const dashboardUrl = new URL(`/${locale}/dashboard`, origin)
  const loginPath = getPathname({ locale, href: "/auth/login" })
  const loginUrl = new URL(loginPath, origin)

  if (!code || hasError || !hasEnvVars) {
    return NextResponse.redirect(loginUrl)
  }

  let redirectUrl = dashboardUrl
  let response = NextResponse.redirect(redirectUrl)

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
          response = NextResponse.redirect(redirectUrl)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    redirectUrl = loginUrl
    response = NextResponse.redirect(redirectUrl)
  }

  return response
}
