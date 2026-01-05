import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

type PageProps = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Home.hero")

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 md:py-24">
      <section
        className="card-container w-full max-w-6xl rounded-3xl p-8 md:p-12"
        aria-labelledby="home-hero-title"
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1
              id="home-hero-title"
              className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl"
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex justify-center md:justify-start">
              <Button
                asChild
                className="btn-primary inline-flex h-12 rounded-full px-7 text-base font-semibold"
              >
                <Link href="/auth/sign-up" aria-label={t("ctaAriaLabel")}>
                  {t("cta")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden min-h-[440px] overflow-hidden rounded-3xl border border-border/60 md:block">
            <Image
              alt={t("imageAlt")}
              src="/images/hero-ev.png"
              fill
              priority
              sizes="(max-width: 768px) 0vw, 50vw"
              className="object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.28),transparent_55%),linear-gradient(to_top,rgba(0,0,0,.55)_0%,rgba(0,0,0,.08)_50%,rgba(0,0,0,0)_78%)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
