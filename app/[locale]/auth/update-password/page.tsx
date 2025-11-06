import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations('auth.update')
  return (
    <div className="flex flex-1 w-full items-center justify-center px-6 py-10 md:px-10">
      <Card className="w-full max-w-md overflow-hidden border border-[#e5e7eb] rounded-[22px] shadow-[0_10px_25px_rgba(2,0,68,.08),_0_2px_6px_rgba(2,0,68,.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(2,0,68,.12),_0_4px_10px_rgba(2,0,68,.08)] p-0">
        {/* Teal accent line on card border */}
        <div className="h-[3px] w-full bg-[hsl(var(--brand))]" aria-hidden="true" />
        <div className="px-6 py-5 flex flex-col justify-center min-h-[360px]">
          <header className="mb-4 text-center">
            <h1 className="mb-1 text-[clamp(22px,3vw,32px)] font-[800] tracking-tight text-[hsl(var(--dark-blue))]">
              <span aria-hidden="true">🔐</span> {t('title')}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t('description')}</p>
          </header>
          <UpdatePasswordForm embedded variant="reference" />
        </div>
      </Card>
    </div>
  );
}
