import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const resolvedConnectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL

if (!resolvedConnectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set')
}

const globalForDb = globalThis as unknown as {
  conn?: postgres.Sql
}

const client = globalForDb.conn ?? postgres(resolvedConnectionString, { max: 1 })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = client
}

export const db = drizzle(client, { schema })
export { client }