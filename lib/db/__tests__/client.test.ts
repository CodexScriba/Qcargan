// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock environment variables
process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db'

// Mock postgres module
const mockSql = (() => {}) as any
mockSql.options = { parsers: {} }
mockSql.end = vi.fn()

const postgresMock = vi.fn(() => mockSql)
vi.mock('postgres', () => ({
  default: postgresMock
}))

// Mock drizzle-orm/postgres-js
vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: vi.fn(() => ({ query: {} }))
}))

describe('Database Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('initializes postgres client with correct url and options', async () => {
    // Re-import to trigger initialization
    await import('../index')
    
    expect(postgresMock).toHaveBeenCalledWith(
      'postgres://user:pass@localhost:5432/db',
      expect.objectContaining({ max: 1 })
    )
  })

  it('exports db instance', async () => {
    const { db } = await import('../index')
    expect(db).toBeDefined()
  })
})
