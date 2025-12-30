// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

const getAllMock = vi.fn()
const setMock = vi.fn()
const createServerClientMock = vi.fn()

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve({
    getAll: getAllMock,
    set: setMock
  }))
}))

vi.mock('@supabase/ssr', () => ({
  createServerClient: (...args: any[]) => {
    createServerClientMock(...args)
    return { auth: { getUser: vi.fn() } }
  }
}))

describe('Supabase Server Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAllMock.mockReturnValue([])
  })

  it('creates client with cookies', async () => {
    const { createClient } = await import('../server')
    await createClient()

    expect(createServerClientMock).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function)
        })
      })
    )
  })

  it('cookies.getAll calls cookieStore.getAll', async () => {
    const { createClient } = await import('../server')
    await createClient()
    
    const cookiesConfig = createServerClientMock.mock.calls[0][2].cookies
    cookiesConfig.getAll()
    expect(getAllMock).toHaveBeenCalled()
  })

  it('cookies.setAll calls cookieStore.set', async () => {
    const { createClient } = await import('../server')
    await createClient()
    
    const cookiesConfig = createServerClientMock.mock.calls[0][2].cookies
    cookiesConfig.setAll([
      { name: 'test', value: 'value', options: { path: '/' } }
    ])
    
    expect(setMock).toHaveBeenCalledWith('test', 'value', { path: '/' })
  })

  it('cookies.setAll catches errors (for Server Components)', async () => {
    const { createClient } = await import('../server')
    await createClient()
    
    setMock.mockImplementationOnce(() => {
      throw new Error('Server Component Error')
    })
    
    const cookiesConfig = createServerClientMock.mock.calls[0][2].cookies
    
    expect(() => {
      cookiesConfig.setAll([
        { name: 'test', value: 'value', options: {} }
      ])
    }).not.toThrow()
  })
})
