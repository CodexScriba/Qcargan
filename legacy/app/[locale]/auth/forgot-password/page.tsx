import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations('auth.forgot')
  return (
    <div className="flex flex-1 w-full items-center justify-center px-6 py-10 md:px-10">
      <div className="w-full max-w-md">
        <div data-slot="card" className="overflow-visible p-0">
          {/* Accent bar at top */}
          <div className="h-1 w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand))]" aria-hidden="true" />

          <div className="px-8 py-10 flex flex-col justify-center">
            <header className="mb-8 text-center space-y-3">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--primary)/0.1)] text-3xl">
                  🔑
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--title-blue))]">
                {t('title')}
              </h1>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {t('description')}
              </p>
            </header>

            <ForgotPasswordForm
              embedded
              variant="reference"
              className="mx-auto w-full max-w-sm text-center [&_label]:justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
