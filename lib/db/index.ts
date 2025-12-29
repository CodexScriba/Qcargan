import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

const resolvedConnectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL

if (!resolvedConnectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set')
}

const globalForDb = globalThis as unknown as {
  pool?: Pool
}

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: resolvedConnectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
}

export const db = drizzle({ client: pool, schema })
export { pool }
