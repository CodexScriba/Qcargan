import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Expose Supabase env availability for middleware shortcuts.
export const hasEnvVars =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
