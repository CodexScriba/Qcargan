import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Home");
  const navigation = useTranslations("Navigation");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <main className="flex w-full max-w-4xl flex-col gap-16 rounded-3xl bg-white/60 p-12 shadow-lg backdrop-blur dark:bg-zinc-900/50">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            Qcargan
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            {t("heroDescription")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/precios"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("ctaPricing")}
          </Link>
          <a
            href="mailto:hola@quecargan.com"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
          >
            {t("ctaDeploy")}
          </a>
          <a
            href="https://docs.quecargan.com"
            className="inline-flex items-center justify-center rounded-full border border-transparent px-8 py-3 text-sm font-semibold text-zinc-600 underline underline-offset-4 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            {t("ctaDocs")}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <span>{navigation("home")}</span>
          <Link
            href="/precios"
            locale="en"
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {navigation("pricing")} (EN)
          </Link>
        </div>
      </main>
    </div>
  );
}
