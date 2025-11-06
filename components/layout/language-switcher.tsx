"use client";

import { cn } from "@/lib/utils";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const locales = [
  { code: 'es', name: 'ES', flag: '🇪🇸', fullName: 'Español' },
  { code: 'en', name: 'EN', flag: '🇺🇸', fullName: 'English' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 shadow-[0_6px_20px_-15px_rgba(15,23,42,0.4)] backdrop-blur supports-[backdrop-filter]:bg-muted/20">
      {locales.map(({ code, name, flag, fullName }) => {
        const isActive = locale === code;

        return (
          <button
            key={code}
            type="button"
            aria-pressed={isActive}
            aria-current={isActive ? "true" : undefined}
            data-active={isActive}
            aria-label={`Switch to ${fullName}`}
            title={fullName}
            onClick={() => handleLanguageChange(code)}
            className={cn(
              "group relative flex items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:-translate-y-[1px] sm:px-3 sm:text-xs",
              isActive
                ? "bg-[hsl(var(--primary))] text-white shadow-[0_22px_40px_-25px_rgba(59,130,246,0.85)] ring-1 ring-primary/70 dark:bg-primary dark:text-primary-foreground dark:shadow-[0_18px_36px_-22px_rgba(148,163,184,0.55)]"
                : "text-muted-foreground/70 hover:bg-background/70 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-primary/30 to-transparent opacity-0 transition-opacity duration-300",
                isActive && "opacity-60"
              )}
            />
            <span className="text-base leading-none">{flag}</span>
            <span className="hidden sm:inline">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
