import { Navbar } from "@/components/layout/navbar/Navbar";
import HomePage from "./[locale]/page";
import { getMessages } from "@/i18n";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function IndexPage() {
  const locale = routing.defaultLocale;

  setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HomePage />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
