export type Locale = "en" | "es";

export const defaultLocale: Locale = "es";

export async function getMessages(locale: Locale = defaultLocale) {
  switch (locale) {
    case "en":
      return (await import("./messages/en.json")).default;
    case "es":
      return (await import("./messages/es.json")).default;
    default:
      return (await import("./messages/en.json")).default;
  }
}
