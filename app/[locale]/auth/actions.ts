"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  ForgotPasswordSchema,
  LoginSchema,
  SignUpSchema,
  UpdatePasswordSchema,
} from "@/lib/validation/auth"
import { getPostHogServer } from "@/lib/posthog/server"

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

  const posthog = getPostHogServer()
  if (posthog) {
    try {
      posthog.capture({
        distinctId: result.data.email,
        event: "user logged in",
        properties: {
          source: "server",
          app: "web",
          router: "app",
        },
      })
    } catch {
      // Best-effort analytics should not affect auth flow
    } finally {
      try {
        await posthog.shutdown()
      } catch {
        // Ignore flush errors for best-effort analytics
      }
    }
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

  const posthog = getPostHogServer()
  if (posthog) {
    try {
      posthog.capture({
        distinctId: result.data.email,
        event: "user signed up",
        properties: {
          source: "server",
          app: "web",
          router: "app",
        },
      })
    } catch {
      // Best-effort analytics should not affect auth flow
    } finally {
      try {
        await posthog.shutdown()
      } catch {
        // Ignore flush errors for best-effort analytics
      }
    }
  }

  // Return success flag - the client will handle redirect to success page
  return { success: true }
}

export type ForgotPasswordState = {
  error?: string
  fieldErrors?: {
    email?: string
  }
  success?: boolean
}

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const rawData = {
    email: formData.get("email"),
  }

  const result = ForgotPasswordSchema.safeParse(rawData)

  if (!result.success) {
    const fieldErrors: ForgotPasswordState["fieldErrors"] = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors
      if (field) {
        fieldErrors[field] = issue.message
      }
    }
    return { fieldErrors }
  }

  const supabase = await createClient()
  const emailRedirectTo = `${getSiteUrl()}/auth/callback?next=/auth/update-password`
  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: emailRedirectTo,
    }
  )

  if (error) {
    return { error: "resetFailed" }
  }

  return { success: true }
}

export type UpdatePasswordState = {
  error?: string
  fieldErrors?: {
    password?: string
    confirmPassword?: string
  }
  success?: boolean
}

export async function updatePasswordAction(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const result = UpdatePasswordSchema.safeParse(rawData)

  if (!result.success) {
    const fieldErrors: UpdatePasswordState["fieldErrors"] = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof typeof fieldErrors
      if (field) {
        fieldErrors[field] = issue.message
      }
    }
    return { fieldErrors }
  }

  const supabase = await createClient()
  const { data, error: userError } = await supabase.auth.getUser()

  if (userError || !data?.user) {
    return { error: "sessionMissing" }
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  })

  if (error) {
    return { error: "updateFailed" }
  }

  return { success: true }
}
