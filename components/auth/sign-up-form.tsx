"use client"

import { useActionState, useEffect, useRef, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Link, useRouter } from "@/lib/i18n/navigation"
import { SignUpSchema, type SignUpValues } from "@/lib/validation/auth"
import { signUpAction, type SignUpState } from "@/app/[locale]/auth/actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const initialState: SignUpState = {}

export function SignUpForm({ className }: { className?: string }) {
  const t = useTranslations("auth.signup")
  const tLogin = useTranslations("auth.login")
  const router = useRouter()
  const rootErrorRef = useRef<HTMLParagraphElement | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState(signUpAction, initialState)

  const {
    register,
    trigger,
    formState: { errors },
    setFocus,
  } = useForm<SignUpValues>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
    resolver: zodResolver(SignUpSchema),
  })

  // Redirect to success page on successful sign-up
  useEffect(() => {
    if (state.success) {
      router.push("/auth/sign-up-success")
    }
  }, [state.success, router])

  // Focus first field with error
  useEffect(() => {
    if (errors.email) {
      setFocus("email")
    } else if (errors.password) {
      setFocus("password")
    } else if (errors.confirmPassword) {
      setFocus("confirmPassword")
    }
  }, [errors, setFocus])

  // Focus root error when server returns error
  useEffect(() => {
    if (state.error) {
      rootErrorRef.current?.focus()
    }
  }, [state.error])

  // Merge server-side field errors with client errors
  const emailError = errors.email?.message ?? state.fieldErrors?.email
  const passwordError = errors.password?.message ?? state.fieldErrors?.password
  const confirmPasswordError = errors.confirmPassword?.message ?? state.fieldErrors?.confirmPassword
  const rootError = state.error ? t(`error.${state.error}`) : null

  // Handle form submission with client-side validation first
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      // Validate client-side first
      const isValid = await trigger()
      if (!isValid) {
        e.preventDefault()
        return
      }
      // If valid, let the form submit to the server action
    },
    [trigger]
  )

  const inputClass =
    "bg-[hsl(var(--input))] border-[hsl(var(--border))] rounded-[14px] px-[14px] py-[12px] text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[hsl(var(--ring))] focus-visible:outline-offset-2"

  const submitClass =
    "rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold shadow-[0_6px_12px_rgba(2,0,68,.12)] hover:translate-y-[-1px] hover:shadow-[0_10px_18px_rgba(2,0,68,.18)] transition-transform"

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className="flex flex-col gap-3.5">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]"
            >
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
              <p id="email-error" className="text-sm text-red-500">
                {emailError}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]"
            >
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
              <p id="password-error" className="text-sm text-red-500">
                {passwordError}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]"
            >
              {t("repeat")}
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
              <p id="confirm-password-error" className="text-sm text-red-500">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {rootError && (
            <p
              ref={rootErrorRef}
              className="text-sm text-red-500"
              role="alert"
              tabIndex={-1}
            >
              {rootError}
            </p>
          )}

          <div className="grid justify-items-center gap-2 mt-2">
            <Button
              type="submit"
              className={cn("w-full justify-center", submitClass)}
              style={{ width: "calc((100% - 10px) / 2)" }}
              disabled={isPending}
            >
              {isPending ? t("submitting") : t("submit")}
            </Button>
          </div>

          <div className="h-px w-full bg-[hsl(var(--border))]" aria-hidden="true" />

          <div className="flex items-center gap-2 my-1" aria-hidden="true">
            <Separator className="flex-1" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">
              {tLogin("orContinueWith")}
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="h-px w-full bg-[hsl(var(--border))]" aria-hidden="true" />

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center bg-white border-[hsl(var(--border))] shadow-none font-semibold text-[hsl(var(--foreground))] rounded-full"
              disabled
              aria-disabled="true"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="#EA4335"
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              {tLogin("oauth.google")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center bg-white border-[hsl(var(--border))] shadow-none font-semibold text-[hsl(var(--foreground))] rounded-full"
              disabled
              aria-disabled="true"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="#1877F2"
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
              {tLogin("oauth.facebook")}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          {t("haveAccount")}{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[hsl(var(--primary))] hover:underline"
          >
            {t("loginLink")}
          </Link>
        </div>
      </form>
    </div>
  )
}
