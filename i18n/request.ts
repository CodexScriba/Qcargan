import { defaultLocale, getMessages, type Locale } from "@/i18n";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale: Locale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  if (!routing.locales.includes(resolvedLocale)) {
    throw new Error(`Unsupported locale: ${resolvedLocale}`);
  }

  return {
    locale: resolvedLocale,
    messages: await getMessages(resolvedLocale),
  };
});
