import { getTranslations, setRequestLocale } from "next-intl/server"
import { ShieldCheck } from "lucide-react"

import { Card } from "@/components/ui/card"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { AuthImage } from "@/components/auth/auth-image"
import { createClient } from "@/lib/supabase/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function UpdatePasswordPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("auth.update")

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const hasSession = Boolean(data?.user)

  return (
    <div className="flex flex-1 w-full items-start justify-center px-6 pt-24 pb-10 md:px-10">
      <Card className="w-full max-w-[1380px] overflow-hidden border border-border rounded-[26px] shadow-[0_10px_25px_rgba(2,0,68,.08),0_2px_6px_rgba(2,0,68,.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(2,0,68,.12),0_4px_10px_rgba(2,0,68,.08)] p-0 bg-card!">
        <div className="grid md:grid-cols-2 h-full">
          <div className="px-10 py-10 flex flex-col justify-center min-h-[672px]">
            <header className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-6" />
                </div>
                <h1 className="text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-[hsl(var(--dark-blue))]">
                  {t("title")}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground ml-[52px]">
                {t("description")}
              </p>
            </header>
            <UpdatePasswordForm hasSession={hasSession} />
          </div>
          <div className="relative hidden md:block overflow-hidden">
            <AuthImage />
          </div>
        </div>
      </Card>
    </div>
  )
}
