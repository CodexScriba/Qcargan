import { hasLocale } from "next-intl"

import { routing } from "@/lib/i18n/routing"

export type Locale = (typeof routing.locales)[number]
export const defaultLocale = routing.defaultLocale

export async function getMessages(locale: Locale | string) {
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : defaultLocale

  try {
    return (await import(`./messages/${resolvedLocale}.json`)).default
  } catch (error) {
    if (resolvedLocale !== defaultLocale) {
      return (await import(`./messages/${defaultLocale}.json`)).default
    }

    throw error
  }
}
