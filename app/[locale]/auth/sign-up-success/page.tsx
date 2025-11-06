import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("auth.signUpSuccess");

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 items-center justify-center px-4 py-24 sm:px-6 lg:px-12">
        <section className="card-container w-full max-w-2xl">
          <div
            className="flex flex-col items-center gap-8 p-8 text-center sm:p-12"
            data-slot="card"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--secondary)/0.55)] text-3xl">
              <span aria-hidden="true">🎉</span>
              <span className="sr-only">{t("title")}</span>
            </div>
            <div className="space-y-4">
              <div
                className="mx-auto h-[3px] w-16 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))]"
                aria-hidden="true"
              />
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-4xl">
                {t("title")}
              </h1>
              <p className="max-w-xl text-pretty text-[hsl(var(--muted-foreground))]">
                {t("subtitle")}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface))] px-6 py-5 text-center text-[hsl(var(--surface-foreground))] sm:px-8 sm:py-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--surface-foreground))]">
                <span aria-hidden="true">📧</span>
                <span>{t("confirmation")}</span>
              </div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                {t("tipsTitle")}
              </p>
              <p className="text-sm leading-relaxed text-[hsl(var(--surface-foreground))]">
                {t("tips")}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href={"/auth/login" as any}
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                {t("ctaLogin")}
              </Link>
              <Link
                href={"/" as any}
                className="card-hover inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--dark-blue))] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("ctaHome")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
