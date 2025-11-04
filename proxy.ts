import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  if (supabaseResponse.headers.has("location")) {
    return supabaseResponse;
  }

  const i18nResponse = handleI18nRouting(request);

  supabaseResponse.headers.forEach((value, key) => {
    if (key.startsWith("x-middleware")) {
      i18nResponse.headers.set(key, value);
    }
  });

  supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
    i18nResponse.cookies.set(name, value, options);
  });

  return i18nResponse;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
