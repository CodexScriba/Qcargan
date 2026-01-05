import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowRight, Battery, Gauge, Zap } from "lucide-react"

import { Link } from "@/lib/i18n/navigation"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Home")

  return (
    <main className="relative flex min-h-[calc(100vh-var(--navbar-height))] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute inset-0 bg-linear-to-tr from-brand/40 to-primary/40 blur-[100px] dark:from-brand/20 dark:to-primary/20" />
      </div>

      <div className="card-container relative grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-12">
        {/* Content Side */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:col-span-7 lg:py-24 xl:px-16">
          <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
                <Zap className="h-4 w-4 fill-current" />
                {t("heroBadge")}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              {t("heroTitleStart")} <br className="hidden lg:block" />
              <span className="gradient-primary-brand-text">
                {t("heroTitleEnd")}
              </span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:max-w-xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/auth/sign-up"
                className="btn-primary group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full px-10 text-lg font-semibold shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)]"
              >
                {t("cta.signup")}
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative hidden min-h-[500px] w-full lg:col-span-5 lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand/5" />
          <Image
            src="/images/hero-ev.jpg"
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:bg-gradient-to-l" />

          {/* Floating Glass Cards */}
          <div className="absolute bottom-12 left-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-brand">
                <Battery className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/60">
                  {t("stats.rangeLabel")}
                </p>
                <p className="text-lg font-bold text-white">
                  {t("stats.rangeValue")}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute right-8 top-12 animate-in fade-in slide-in-from-top-8 duration-1000 delay-500">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Gauge className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-white/60">
                  {t("stats.accelerationLabel")}
                </p>
                <p className="text-lg font-bold text-white">
                  {t("stats.accelerationValue")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
