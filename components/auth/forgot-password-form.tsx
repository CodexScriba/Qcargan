"use client"

import { useActionState, useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Mail, MailCheck, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/lib/i18n/navigation"
import { ForgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation/auth"
import {
  forgotPasswordAction,
  type ForgotPasswordState,
} from "@/app/[locale]/auth/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ForgotPasswordState = {}

export function ForgotPasswordForm({ className }: { className?: string }) {
  const t = useTranslations("auth.forgot")
  const tLogin = useTranslations("auth.login")
  const rootErrorRef = useRef<HTMLParagraphElement | null>(null)

  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  )

  const {
    register,
    trigger,
    formState: { errors },
    setFocus,
  } = useForm<ForgotPasswordValues>({
    defaultValues: { email: "" },
    mode: "onSubmit",
    resolver: zodResolver(ForgotPasswordSchema),
  })

  useEffect(() => {
    if (errors.email) {
      setFocus("email")
    }
  }, [errors, setFocus])

  useEffect(() => {
    if (state.error) {
      rootErrorRef.current?.focus()
    }
  }, [state.error])

  const emailError = errors.email?.message ?? state.fieldErrors?.email
  const rootError = state.error ? t(`error.${state.error}`) : null

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const isValid = await trigger()
      if (!isValid) {
        e.preventDefault()
      }
    },
    [trigger]
  )

  const inputClass =
    "bg-input border-border rounded-[14px] px-[14px] py-[12px] text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"

  const submitClass =
    "rounded-full bg-primary text-primary-foreground font-bold shadow-[0_6px_12px_rgba(2,0,68,.12)] hover:translate-y-[-1px] hover:shadow-[0_10px_18px_rgba(2,0,68,.18)] transition-transform"

  if (state.success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} aria-live="polite">
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-title-blue">
            <MailCheck className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-title-blue">
            {t("successTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("successDescription")}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("successBody")}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t("backToLogin")}
        </Link>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <form action={formAction} onSubmit={handleFormSubmit} noValidate>
        <div className="flex flex-col gap-3.5">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-[14px] font-bold text-foreground"
            >
              <Mail className="size-4 text-muted-foreground" />
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              className={inputClass}
              {...register("email")}
            />
            {emailError && (
              <p id="email-error" className="text-[14px] text-red-500">
                {emailError}
              </p>
            )}
          </div>

          {rootError && (
            <p
              ref={rootErrorRef}
              className="text-[14px] text-red-500"
              role="alert"
              tabIndex={-1}
            >
              {rootError}
            </p>
          )}

          <div className="grid gap-2 mt-2">
            <Button
              type="submit"
              className={cn("w-full justify-center gap-2", submitClass)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>

          <div className="mt-4 text-center text-[14px] text-slate-600">
            {t("remembered")} {" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              {tLogin("submit")}
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
