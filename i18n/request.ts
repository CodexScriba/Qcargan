import { defaultLocale, getMessages, type Locale } from "@/i18n"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const localeCandidate = await requestLocale

  const resolvedLocale: Locale = routing.locales.includes(localeCandidate as Locale)
    ? (localeCandidate as Locale)
    : defaultLocale

  return {
    locale: resolvedLocale,
    messages: await getMessages(resolvedLocale),
  }
})
