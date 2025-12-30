import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("auth.login")

  return (
    <div className="flex flex-1 w-full items-center justify-center px-6 py-10 md:px-10">
      <Card className="w-full max-w-6xl overflow-hidden border border-[#e5e7eb] rounded-[22px] shadow-[0_10px_25px_rgba(2,0,68,.08),_0_2px_6px_rgba(2,0,68,.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(2,0,68,.12),_0_4px_10px_rgba(2,0,68,.08)] p-0 !bg-[hsl(var(--card))]">
        <div className="grid md:grid-cols-2 h-full">
          <div className="px-7 py-6 flex flex-col justify-center min-h-[560px]">
            <header className="mb-4">
              <h1 className="mb-1 text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-[hsl(var(--dark-blue))]">
                {t("welcome")}
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {t("subtitle")}
              </p>
            </header>
            <LoginForm />
          </div>
          <div className="relative hidden md:block overflow-hidden">
            <div className="absolute inset-0">
              <Image
                alt="EV charging station hero"
                src="/images/auth/login-hero.png"
                fill
                className="object-cover object-center rounded-[22px]"
                priority
                sizes="(max-width: 768px) 0vw, 50vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.65)_0%,rgba(0,0,0,.28)_25%,rgba(0,0,0,0)_55%)] rounded-[22px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
