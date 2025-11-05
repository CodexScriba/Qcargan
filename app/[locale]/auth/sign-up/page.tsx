import { SignUpForm } from "@/components/auth/sign-up-form";
import { Card } from "@/components/ui/card";
import Image from 'next/image'
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations('auth.signup')
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-6xl overflow-hidden card-surface rounded-[22px] transition-transform duration-200 hover:-translate-y-1 p-0">
        <div className="grid md:grid-cols-2 h-full">
          <div className="px-7 py-6 flex flex-col justify-center min-h-[560px]">
            <header className="mb-4">
              <h1 className="mb-1 text-[clamp(22px,3vw,32px)] font-[800] tracking-tight text-[hsl(var(--dark-blue))]">
                <span aria-hidden="true">✨</span> {t('title')}
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('description')}</p>
            </header>
            <SignUpForm embedded variant="reference" />
          </div>
          <div className="relative hidden md:block overflow-hidden">
            <div className="absolute inset-0">
              <Image
                alt="EV charging station hero"
                src="https://chargemod.com/uploads/blogs/blog1729869798uBKwuD9Bd6.jpg"
                fill
                unoptimized
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
  );
}
