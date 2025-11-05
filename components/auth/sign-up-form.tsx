"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useRouter } from "@/i18n/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"

interface SignUpValues {
  email: string
  displayName: string
  password: string
  repeatPassword: string
}

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  embedded?: boolean
  variant?: 'default' | 'reference'
}

export function SignUpForm({
  className,
  embedded = false,
  variant = 'default',
  ...props
}: Props) {
  const router = useRouter()
  const t = useTranslations()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SignUpValues>({
    defaultValues: { email: "", displayName: "", password: "", repeatPassword: "" },
    mode: "onSubmit",
  })

  const submitDisabled = useMemo(() => {
    return isSubmitting
  }, [isSubmitting])

  const onSubmit = async ({ email, displayName, password, repeatPassword }: SignUpValues) => {
    if (password !== repeatPassword) {
      setError("repeatPassword", { type: "validate", message: t("auth.signup.passwordsMismatch") })
      return
    }
    const supabase = createClient()
    clearErrors()
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          data: { display_name: displayName }
        },
      })
      if (error) throw error
      // Attempt to persist display name for the authenticated user profile (if session exists)
      try {
        await fetch('/api/profile/display-name', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ displayName })
        })
      } catch {
        // Non-fatal; handled after email confirmation/login
      }
      router.push("/auth/sign-up-success")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("common.error.unknown")
      setError("root", { type: "server", message })
    }
  }
  const isRef = variant === 'reference'
  const inputClass = isRef
    ? 'bg-[hsl(var(--input))] border-[hsl(var(--border))] rounded-[14px] px-[14px] py-[12px] text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] focus-visible:outline-offset-2'
    : undefined
  const submitClass = isRef
    ? 'rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold shadow-[0_6px_12px_rgba(2,0,68,.12)] hover:translate-y-[-1px] hover:shadow-[0_10px_18px_rgba(2,0,68,.18)] transition-transform'
    : 'w-full'

  const FormContent = (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}>
            <span aria-hidden="true">📧</span> {t("auth.signup.email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            aria-invalid={!!errors.email}
            className={inputClass}
            {...register("email", {
              required: true,
              pattern: /[^@\s]+@[^@\s]+\.[^@\s]+/,
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{t("auth.signup.email")}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="display-name" className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}>
            <span aria-hidden="true">🏷️</span> {t("auth.signup.displayName", { default: 'Display name' })}
          </Label>
          <Input
            id="display-name"
            type="text"
            inputMode="text"
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck={false}
            className={inputClass}
            {...register('displayName', { required: true })}
          />
          <p className="text-xs text-[hsl(var(--muted-foreground))]" aria-live="polite">
            {t('auth.signup.displayNameHelp', { default: 'This will appear on your profile' })}
          </p>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}>
              <span aria-hidden="true">🔐</span> {t("auth.signup.password")}
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            className={inputClass}
            {...register("password", { required: true, minLength: 6 })}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="repeat-password" className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}>
              <span aria-hidden="true">🔁</span> {t("auth.signup.repeat")}
            </Label>
          </div>
          <Input
            id="repeat-password"
            type="password"
            aria-invalid={!!errors.repeatPassword}
            className={inputClass}
            {...register("repeatPassword", {
              required: true,
              validate: (val) => val === watch("password") || t("auth.signup.passwordsMismatch"),
            })}
          />
        </div>
        {errors.root?.message && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <div className={cn(isRef && 'grid justify-items-center gap-2 mt-1')}>
          <Button type="submit" className={cn('w-full justify-center', submitClass)} style={isRef ? { width: 'calc((100% - 10px) / 2)' } : undefined} disabled={submitDisabled}>
            {isSubmitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </Button>
        </div>
        <div className="h-px w-full bg-[hsl(var(--border))]" aria-hidden="true" />
        <div className="flex items-center gap-2 my-1" aria-hidden="true">
          <Separator className="flex-1" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {t("auth.login.orContinueWith")}
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center bg-white border-[hsl(var(--border))] shadow-none font-semibold text-[hsl(var(--foreground))] rounded-full"
            disabled
            aria-disabled="true"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="#EA4335" className="mr-2" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            {t("auth.login.oauth.google")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center bg-white border-[hsl(var(--border))] shadow-none font-semibold text-[hsl(var(--foreground))] rounded-full"
            disabled
            aria-disabled="true"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" className="mr-2" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
            </svg>
            {t("auth.login.oauth.facebook")}
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-slate-600">
        <span aria-hidden="true" className="mr-1">✨</span>
        {t("auth.signup.haveAccount")} {" "}
        <Link href="/auth/login" className="font-semibold text-[hsl(var(--brand))] hover:underline">
          {t("auth.signup.loginLink")}
        </Link>
      </div>
    </form>
  )

  if (embedded) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {FormContent}
      </div>
    )}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.signup.title")}</CardTitle>
          <CardDescription>{t("auth.signup.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {FormContent}
        </CardContent>
      </Card>
    </div>
  )
}
