import { getTranslations, setRequestLocale } from "next-intl/server"
import { AlertTriangle } from "lucide-react"

import { Link } from "@/lib/i18n/navigation"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AuthErrorPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("auth.error")

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 items-center justify-center px-4 py-24 sm:px-6 lg:px-12">
        <section className="card-container w-full max-w-2xl">
          <div
            className="flex flex-col items-center gap-6 p-8 text-center sm:p-12"
            data-slot="card"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--secondary)/0.55)] text-[hsl(var(--title-blue))]">
              <AlertTriangle className="size-7" />
            </div>
            <div className="space-y-3">
              <div
                className="mx-auto h-[3px] w-16 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))]"
                aria-hidden="true"
              />
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[hsl(var(--title-blue))] sm:text-4xl">
                {t("title")}
              </h1>
              <p className="max-w-xl text-pretty text-[hsl(var(--muted-foreground))]">
                {t("description")}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/auth/login"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
              >
                {t("ctaLogin")}
              </Link>
              <Link
                href="/"
                className="card-hover inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--dark-blue))] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t("ctaHome")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
