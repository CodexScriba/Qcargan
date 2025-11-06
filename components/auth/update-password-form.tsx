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
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

interface UpdateValues { password: string }

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  embedded?: boolean
  variant?: 'default' | 'reference'
}

export function UpdatePasswordForm({
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
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<UpdateValues>({ defaultValues: { password: "" } })

  const onSubmit = async ({ password }: UpdateValues) => {
    const supabase = createClient()
    clearErrors()
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push("/protected")
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
            htmlFor="password"
            className={cn(isRef && 'flex items-center gap-2 text-[13px] font-bold text-[hsl(var(--foreground))]')}
          >
            <span aria-hidden="true">🔐</span> {t("auth.update.password")}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="New password"
            aria-invalid={!!errors.password}
            className={inputClass}
            {...register("password", { required: true, minLength: 6 })}
          />
        </div>
        {errors.root?.message && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <Button type="submit" className={cn('w-full', submitClass)} disabled={isSubmitting}>
          {isSubmitting ? t("auth.update.submitting") : t("auth.update.submit")}
        </Button>
      </div>
    </form>
  )

  if (embedded) {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {FormBody}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("auth.update.title")}</CardTitle>
          <CardDescription>{t("auth.update.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {FormBody}
        </CardContent>
      </Card>
    </div>
  );
}
