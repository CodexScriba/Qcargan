import { describe, expect, it } from 'vitest'

import {
  ForgotPasswordSchema,
  LoginSchema,
  SignUpSchema,
  UpdatePasswordSchema
} from '../auth'

describe('LoginSchema', () => {
  it('accepts valid data and normalizes email', () => {
    const result = LoginSchema.safeParse({
      email: ' TEST@Example.Com ',
      password: '123456'
    })

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.email).toBe('test@example.com')
  })

  it('rejects invalid email', () => {
    const result = LoginSchema.safeParse({
      email: 'not-an-email',
      password: '123456'
    })

    expect(result.success).toBe(false)
  })

  it('rejects whitespace-only email', () => {
    const result = LoginSchema.safeParse({
      email: '   ',
      password: '123456'
    })

    expect(result.success).toBe(false)
  })

  it('accepts password at the 6 character boundary', () => {
    const result = LoginSchema.safeParse({
      email: 'test@example.com',
      password: '123456'
    })

    expect(result.success).toBe(true)
  })
})

describe('SignUpSchema', () => {
  it('rejects password mismatch', () => {
    const result = SignUpSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: 'abcdef'
    })

    expect(result.success).toBe(false)
  })

  it('rejects empty confirmPassword with valid password', () => {
    const result = SignUpSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: ''
    })

    expect(result.success).toBe(false)
  })
})

describe('ForgotPasswordSchema', () => {
  it('accepts valid email and normalizes it', () => {
    const result = ForgotPasswordSchema.safeParse({
      email: ' TEST@Example.Com '
    })

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.email).toBe('test@example.com')
  })
})

describe('UpdatePasswordSchema', () => {
  it('rejects password mismatch', () => {
    const result = UpdatePasswordSchema.safeParse({
      password: '123456',
      confirmPassword: 'abcdef'
    })

    expect(result.success).toBe(false)
  })
})

