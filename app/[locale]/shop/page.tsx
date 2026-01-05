import { getTranslations, setRequestLocale } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Mail } from "lucide-react"

type PageProps = { params: Promise<{ locale: string }> }

export default async function ShopPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("shop.placeholder")

  const features = [
    { key: "portableChargers", icon: "🔋" },
    { key: "wallChargers", icon: "🔌" },
    { key: "accessories", icon: "🎒" },
    { key: "tires", icon: "🛞" },
  ]

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 md:py-24">
      <section className="w-full max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.key} className="border-border/60">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <CardTitle className="text-lg">{t(`features.${feature.key}`)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {t(`features.${feature.key}`)} coming soon
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mx-auto mt-12 max-w-md border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              {t("title")}
            </CardTitle>
            <CardDescription>{t("emailLabel")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  aria-label={t("emailLabel")}
                  className="h-12"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                {t("submitButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
