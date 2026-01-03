"use client"

import { useActionState, useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Lock, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Link } from "@/lib/i18n/navigation"
import { UpdatePasswordSchema, type UpdatePasswordValues } from "@/lib/validation/auth"
import {
  updatePasswordAction,
  type UpdatePasswordState,
} from "@/app/[locale]/auth/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: UpdatePasswordState = {}

type UpdatePasswordFormProps = {
  hasSession: boolean
  className?: string
}

export function UpdatePasswordForm({ hasSession, className }: UpdatePasswordFormProps) {
  const t = useTranslations("auth.update")
  const tLogin = useTranslations("auth.login")
  const rootErrorRef = useRef<HTMLParagraphElement | null>(null)

  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    initialState
  )

  const {
    register,
    trigger,
    formState: { errors },
    setFocus,
  } = useForm<UpdatePasswordValues>({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
    resolver: zodResolver(UpdatePasswordSchema),
  })

  useEffect(() => {
    if (errors.password) {
      setFocus("password")
    } else if (errors.confirmPassword) {
      setFocus("confirmPassword")
    }
  }, [errors, setFocus])

  useEffect(() => {
    if (state.error) {
      rootErrorRef.current?.focus()
    }
  }, [state.error])

  const passwordError = errors.password?.message ?? state.fieldErrors?.password
  const confirmPasswordError =
    errors.confirmPassword?.message ?? state.fieldErrors?.confirmPassword
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

  if (!hasSession) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-title-blue">
            <Lock className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-title-blue">
            {t("sessionMissingTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("sessionMissingDescription")}
          </p>
        </div>
        <Link
          href="/auth/forgot-password"
          className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
        >
          {t("sessionMissingCta")}
        </Link>
      </div>
    )
  }

  if (state.success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} aria-live="polite">
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60 text-title-blue">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-title-blue">
            {t("successTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("successDescription")}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
        >
          {tLogin("submit")}
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
              htmlFor="password"
              className="flex items-center gap-2 text-[14px] font-bold text-foreground"
            >
              <Lock className="size-4 text-muted-foreground" />
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              className={inputClass}
              {...register("password")}
            />
            {passwordError && (
              <p id="password-error" className="text-[14px] text-red-500">
                {passwordError}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-[14px] font-bold text-foreground"
            >
              <ShieldCheck className="size-4 text-muted-foreground" />
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              aria-invalid={!!confirmPasswordError}
              aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
              className={inputClass}
              {...register("confirmPassword")}
            />
            {confirmPasswordError && (
              <p id="confirm-password-error" className="text-[14px] text-red-500">
                {confirmPasswordError}
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
                <Lock className="size-4" />
              )}
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
