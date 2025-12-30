import { z } from 'zod'

const EmailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email()
  .transform((value) => value.toLowerCase())

const PasswordSchema = z.string().min(6)

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema
})

export type LoginValues = z.infer<typeof LoginSchema>

export const SignUpSchema = LoginSchema.extend({
  confirmPassword: z.string()
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export type SignUpValues = z.infer<typeof SignUpSchema>

export const ForgotPasswordSchema = z.object({
  email: EmailSchema
})

export type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>

export const UpdatePasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string()
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type UpdatePasswordValues = z.infer<typeof UpdatePasswordSchema>

