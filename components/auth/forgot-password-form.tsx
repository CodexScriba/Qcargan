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
import { Link } from "@/i18n/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface ForgotValues { email: string }

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  embedded?: boolean
  variant?: 'default' | 'reference'
}

export function ForgotPasswordForm({
  className,
  embedded = false,
  variant = 'default',
  ...props
}: Props) {
  const t = useTranslations()
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ForgotValues>({ defaultValues: { email: "" } })

  const onSubmit = async ({ email }: ForgotValues) => {
    const supabase = createClient()
    clearErrors()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      setSuccess(true)
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

  const FormBody = (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label
            htmlFor="email"
            className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}
          >
            <span aria-hidden="true">📧</span> {t("auth.forgot.email")}
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
        </div>
        {errors.root?.message && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <Button type="submit" className={cn('w-full', submitClass)} disabled={isSubmitting}>
          {isSubmitting ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        {t("auth.signup.haveAccount")} {" "}
        <Link
          href="/auth/login"
          className={cn(isRef ? "font-semibold text-[hsl(var(--brand))] hover:underline" : "underline underline-offset-4")}
        >
          {t("auth.signup.loginLink")}
        </Link>
      </div>
    </form>
  )

  if (embedded) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {success ? (
          <div className="rounded-[14px] bg-[hsl(var(--secondary))] p-4">
            <h2 className="text-[clamp(18px,2.4vw,22px)] font-[700] mb-1">
              {t("auth.forgot.successTitle")}
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">{t("auth.forgot.successDescription")}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t("auth.forgot.successBody")}</p>
          </div>
        ) : (
          FormBody
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("auth.forgot.successTitle")}</CardTitle>
            <CardDescription>{t("auth.forgot.successDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("auth.forgot.successBody")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("auth.forgot.title")}</CardTitle>
            <CardDescription>{t("auth.forgot.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {FormBody}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
