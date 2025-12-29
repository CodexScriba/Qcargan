import { getTranslations, setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Home")

  return (
    <div className="flex min-h-[calc(100vh-(--spacing(16)))] flex-col items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("heroDescription")}
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Locale: {locale}
          </span>
        </div>
      </div>
    </div>
  )
}
