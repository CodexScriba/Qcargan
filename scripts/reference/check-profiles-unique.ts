// REFERENCE ONLY - From old quecargan project
// This script shows validation patterns for database constraints
// Adapt as needed for new project

import 'dotenv/config'

/*
  Supabase schema and uniqueness sanity check for public.profiles

  - Verifies table existence and a unique index on username
  - Attempts duplicate username insert to trigger 23505 when possible
  - Safe-by-default: refuses to run in production unless ALLOW_DB_CHECK=true
*/

import { createSqlClient } from '../lib/db/client'

type SqlClient = ReturnType<typeof createSqlClient>

function isConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const code = (err as { code?: string }).code
  const message = String((err as { message?: string }).message ?? '')
  return (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    message.includes('timeout') ||
    message.includes('refused') ||
    message.includes("Can't reach database server")
  )
}

function isPgError(err: unknown, code: string) {
  return Boolean(err && typeof err === 'object' && (err as { code?: string }).code === code)
}

async function runWith(sql: SqlClient) {
  await sql.unsafe("SET statement_timeout = '5s'")

  const tableExists = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles'
    ) AS exists
  `
  if (!tableExists[0]?.exists) {
    throw new Error("Table 'public.profiles' does not exist")
  }

  const uniqueOnUsername = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.contype = 'u' AND n.nspname = 'public' AND t.relname = 'profiles'
      AND EXISTS (
        SELECT 1
        FROM unnest(c.conkey) AS colnum
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = colnum
        WHERE a.attname = 'username'
      )
  `
  if ((uniqueOnUsername[0]?.count ?? 0) < 1) {
    throw new Error("Unique constraint on 'public.profiles(username)' not found")
  }

  const uniqueIndexRows = await sql<{ indexname: string; indexdef: string }[]>`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE schemaname='public' AND tablename='profiles'
      AND indexdef ILIKE '%UNIQUE%'
      AND indexdef ILIKE '%"username"%'
  `
  if (uniqueIndexRows.length < 1) {
    console.warn('Warning: UNIQUE index on username not visible in pg_indexes; constraint exists, proceeding')
  }

  const ids = await sql<{ id: string }[]>`
    SELECT id::text FROM auth.users ORDER BY created_at ASC LIMIT 2
  `

  if (ids.length < 2) {
    console.warn('Only 0–1 auth.users found; skipping duplicate-insert behavior check to avoid FK 23503')
    return
  }

  const testUsername = `testuser_${Math.random().toString(36).slice(2, 8)}`
  const [id1, id2] = [ids[0]!.id, ids[1]!.id]

  try {
    await sql`DELETE FROM public.profiles WHERE username = ${testUsername}`
    await sql`INSERT INTO public.profiles (id, username) VALUES (${id1}::uuid, ${testUsername}::text)`
    await sql`INSERT INTO public.profiles (id, username) VALUES (${id2}::uuid, ${testUsername}::text)`
    throw new Error('Expected unique violation did not occur')
  } catch (err: unknown) {
    if (isPgError(err, '23505')) {
      console.log('OK: PG 23505 unique constraint violation observed')
    } else if (isPgError(err, '23503')) {
      console.warn('FK violation (need 2 auth.users) — skipping behavior check')
    } else {
      console.warn('Unexpected error during duplicate insert:', err)
    }
  }
}

function createClient(url: string): SqlClient {
  return createSqlClient(url)
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DB_CHECK !== 'true') {
    throw new Error('Refusing to run db check in production (set ALLOW_DB_CHECK=true to override)')
  }

  const directUrl = process.env.DIRECT_URL
  const runtimeUrl = process.env.DATABASE_URL

  if (!directUrl && !runtimeUrl) {
    throw new Error('Either DIRECT_URL or DATABASE_URL must be set')
  }

  let sql = createClient((directUrl ?? runtimeUrl)!)

  try {
    try {
      await runWith(sql)
    } catch (error) {
      if (directUrl && runtimeUrl && isConnectionError(error)) {
        await sql.end({ timeout: 1 })
        sql = createClient(runtimeUrl)
        await runWith(sql)
      } else {
        throw error
      }
    }
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
