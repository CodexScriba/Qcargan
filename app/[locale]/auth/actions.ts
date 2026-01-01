"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LoginSchema, SignUpSchema } from "@/lib/validation/auth"

function getSiteUrl(): string {
  // Use configured SITE_URL first (most reliable)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  // Vercel provides VERCEL_URL in production/preview
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Fallback for local development
  return "http://localhost:3000"
}

export type LoginState = {
  error?: string
  fieldErrors?: {
    email?: string
    password?: string
  }
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = LoginSchema.safeParse(rawData)

  if (!result.success) {
    const fieldErrors: LoginState["fieldErrors"] = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors
      if (field) {
        fieldErrors[field] = issue.message
      }
    }
    return { fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    // Return generic error to avoid leaking whether email exists
    return { error: "invalidCredentials" }
  }

  // redirect() throws NEXT_REDIRECT, this return is unreachable but satisfies TypeScript
  redirect("/dashboard")
  return {}
}

export type SignUpState = {
  error?: string
  fieldErrors?: {
    email?: string
    password?: string
    confirmPassword?: string
  }
  success?: boolean
}

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const result = SignUpSchema.safeParse(rawData)

  if (!result.success) {
    const fieldErrors: SignUpState["fieldErrors"] = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors
      if (field) {
        fieldErrors[field] = issue.message
      }
    }
    return { fieldErrors }
  }

  const supabase = await createClient()

  // Use configured site URL for email redirect (avoids untrusted header injection)
  const emailRedirectTo = `${getSiteUrl()}/auth/callback`

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo,
    },
  })

  if (error) {
    // Return generic error to avoid account enumeration
    return { error: "signUpFailed" }
  }

  // Return success flag - the client will handle redirect to success page
  return { success: true }
}
