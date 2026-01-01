import { setRequestLocale } from "next-intl/server"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-[calc(100vh-(--spacing(16)))] flex-col items-center justify-center p-8 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Placeholder content. Replace this with your dashboard layout.
        </p>
        <span className="text-xs text-muted-foreground">
          Locale: {locale}
        </span>
      </div>
    </div>
  )
}
