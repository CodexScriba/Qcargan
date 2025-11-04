import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../../drizzle/schema'

const resolvedConnectionString = (() => {
  const value = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!value) {
    throw new Error('Set DIRECT_URL or DATABASE_URL before using the database client')
  }
  return value
})()

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>
type PostgresClient = ReturnType<typeof postgres>
type SqlConfig = NonNullable<Parameters<typeof postgres>[1]>

const DEFAULT_SQL_CONFIG: SqlConfig = {
  prepare: false,
  max: 1
}

export function createSqlClient(connectionString: string, overrides: Partial<SqlConfig> = {}): PostgresClient {
  return postgres(connectionString, { ...DEFAULT_SQL_CONFIG, ...overrides })
}

export function createDrizzleClient(sqlClient: PostgresClient): DrizzleClient {
  return drizzle(sqlClient, { schema })
}

export function createDatabase(
  connectionString: string = resolvedConnectionString,
  overrides: Partial<SqlConfig> = {}
): { db: DrizzleClient; sql: PostgresClient } {
  const sqlClient = createSqlClient(connectionString, overrides)
  const drizzleClient = createDrizzleClient(sqlClient)
  return { db: drizzleClient, sql: sqlClient }
}

export type QueryTimerMeta = Record<string, unknown>
export type QueryTimerStop = (meta?: QueryTimerMeta) => void

export function startQueryTimer(label: string): QueryTimerStop {
  const start = process.hrtime.bigint()

  return (meta: QueryTimerMeta = {}) => {
    if (process.env.NODE_ENV === 'test') return
    const durationNs = Number(process.hrtime.bigint() - start)
    const durationMs = durationNs / 1_000_000
    const payload = {
      label,
      durationMs: Math.round(durationMs * 100) / 100,
      ...meta
    }
    console.log('[db.timing]', payload)
  }
}

const globalForDb = globalThis as unknown as {
  drizzle?: DrizzleClient
  sql?: PostgresClient
}

const sqlClient = globalForDb.sql ?? createSqlClient(resolvedConnectionString)
const drizzleClient = (globalForDb.drizzle ?? createDrizzleClient(sqlClient)) as DrizzleClient

export const databaseUrl = resolvedConnectionString
export const sqlConfig = Object.freeze({ ...DEFAULT_SQL_CONFIG })
export const db = drizzleClient
export const sql = sqlClient

if (process.env.NODE_ENV !== 'production') {
  globalForDb.drizzle = db
  globalForDb.sql = sql
}
