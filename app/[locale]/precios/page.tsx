import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const TIERS = ["starter", "growth"] as const;

export default function PricingPage() {
  const t = useTranslations("Pricing");

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {TIERS.map((tier) => {
          const features = t.raw(`tiers.${tier}.features`) as string[];

          return (
            <article
              key={tier}
              className="flex h-full flex-col justify-between rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {t(`tiers.${tier}.name`)}
                </h2>
                <p className="text-xl font-medium text-zinc-800 dark:text-zinc-200">
                  {t(`tiers.${tier}.price`)}
                </p>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-200" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
        >
          ← {t("back")}
        </Link>
      </footer>
    </section>
  );
}
