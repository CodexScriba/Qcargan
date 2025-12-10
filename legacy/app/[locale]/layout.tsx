import { Navbar } from "@/components/layout/navbar/Navbar";
import { getMessages, type Locale } from "@/i18n";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const awaitedParams = await params;
  const locale = awaitedParams.locale as Locale;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex min-h-[calc(100svh-var(--navbar-height,0px))] flex-1 flex-col">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
