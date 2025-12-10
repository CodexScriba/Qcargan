"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

type ThemeValue = (typeof OPTIONS)[number]["value"];

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const activeTheme: ThemeValue = useMemo(() => {
    if (theme === "dark" || theme === "light") {
      return theme;
    }

    if (resolvedTheme === "dark") {
      return "dark";
    }

    return "light";
  }, [resolvedTheme, theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 shadow-[0_6px_20px_-15px_rgba(15,23,42,0.4)] backdrop-blur supports-[backdrop-filter]:bg-muted/20">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = activeTheme === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            aria-current={isActive ? "true" : undefined}
            data-active={isActive}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
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
            <Icon
              strokeWidth={1.4}
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isActive
                  ? "text-white drop-shadow-[0_6px_12px_rgba(15,23,42,0.35)] dark:text-primary-foreground"
                  : "text-muted-foreground/60 group-hover:text-foreground/90"
              )}
            />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export { ThemeSwitcher };
