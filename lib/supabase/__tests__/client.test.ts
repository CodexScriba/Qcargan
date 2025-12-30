import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock createBrowserClient
const createBrowserClientMock = vi.fn()
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: any[]) => createBrowserClientMock(...args)
}))

describe('Supabase Browser Client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    createBrowserClientMock.mockClear()
  })

  it('creates client with correct env vars', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    const { createClient } = await import('../client')
    createClient()

    expect(createBrowserClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key'
    )
  })

  it('prefers PUBLISHABLE_OR_ANON_KEY over ANON_KEY', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY = 'publishable-key'

    const { createClient } = await import('../client')
    createClient()

    expect(createBrowserClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'publishable-key'
    )
  })
})
