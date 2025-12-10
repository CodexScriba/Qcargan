import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function HomePage({ params }: PageProps) {
  const awaitedParams = await params;
  const { locale } = awaitedParams;

  const t = await getTranslations({ locale, namespace: "Home" });
  const navigation = await getTranslations({ locale, namespace: "Navigation" });

  const highlights = [
    {
      title: t("highlights.visibility.title"),
      description: t("highlights.visibility.description"),
      index: "01",
    },
    {
      title: t("highlights.automation.title"),
      description: t("highlights.automation.description"),
      index: "02",
    },
    {
      title: t("highlights.insights.title"),
      description: t("highlights.insights.description"),
      index: "03",
    },
  ];

  const stats = [
    {
      value: t("stats.reliability.value"),
      label: t("stats.reliability.label"),
    },
    {
      value: t("stats.savings.value"),
      label: t("stats.savings.label"),
    },
    {
      value: t("stats.time.value"),
      label: t("stats.time.label"),
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-4 pb-24 pt-20 sm:px-6 lg:px-12">
        <section className="card-container overflow-hidden">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsl(var(--secondary)/0.55)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[hsl(var(--secondary-foreground))]">
                {t("heroBadge")}
              </span>
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-5xl lg:text-6xl">
                  {t("heroTitle")}
                </h1>
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">
                  {t("heroDescription")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="mailto:hola@quecargan.com"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
                >
                  {t("ctaDeploy")}
                </a>
                <Link
                  href={"/precios" as any}
                  className="card-hover inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--dark-blue))] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {t("ctaPricing")}
                </Link>
                <a
                  href="https://docs.quecargan.com"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[hsl(var(--muted-foreground))] underline underline-offset-4 transition hover:text-[hsl(var(--accent))]"
                >
                  {t("ctaDocs")}
                </a>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div
                data-slot="card"
                className="card-hover flex flex-col gap-4 p-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[hsl(var(--muted-foreground))]">
                    {navigation("home")}
                  </span>
                  <h2 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                    {t("heroBadge")}
                  </h2>
                  <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {t("sectionInsightsDescription")}
                  </p>
                </div>
                <div className="grid gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-baseline justify-between rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))] px-4 py-3 text-[hsl(var(--surface-foreground))]"
                    >
                      <span className="text-lg font-semibold text-[hsl(var(--title-blue))]">
                        {stat.value}
                      </span>
                      <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={`card-${stat.label}`}
                    data-slot="card"
                    className="card-hover flex flex-col gap-1 p-4"
                  >
                    <span className="text-3xl font-semibold text-[hsl(var(--title-blue))]">
                      {stat.value}
                    </span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card-container space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-4xl">
              {t("sectionInsightsTitle")}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
              {t("sectionInsightsDescription")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight.index}
                data-slot="card"
                className="card-hover flex h-full flex-col gap-4 p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--glass-border))] bg-[hsl(var(--accent)/0.1)] text-sm font-semibold text-[hsl(var(--accent-foreground))]">
                  {highlight.index}
                </span>
                <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
                  {highlight.title}
                </h3>
                <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="card-container overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--accent)/0.18),transparent_55%),radial-gradient(circle_at_15%_85%,hsl(var(--brand)/0.15),transparent_60%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-semibold text-[hsl(var(--title-blue))] sm:text-4xl">
                {t("ctaBannerTitle")}
              </h2>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
                {t("ctaBannerDescription")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:hola@quecargan.com"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                {t("ctaDeploy")}
              </a>
              <Link
                href={"/precios" as any}
                className="card-hover inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--dark-blue))] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("ctaPricing")}
              </Link>
              <a
                href="https://docs.quecargan.com"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[hsl(var(--muted-foreground))] underline underline-offset-4 transition hover:text-[hsl(var(--accent))]"
              >
                {t("ctaDocs")}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
