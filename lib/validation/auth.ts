import { z } from 'zod'

// Login schema: email + password only
// - email: required, valid email, lowercased
// - password: min length 6
export const LoginSchema = z.object({
  identifier: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(6)
})

export type LoginValues = z.infer<typeof LoginSchema>

// mapIdentifier no longer needed; keep a no-op for compatibility if imported elsewhere
export function mapIdentifier(value: string) {
  const email = value.trim().toLowerCase()
  return { kind: 'email' as const, normalized: email, email }
}
