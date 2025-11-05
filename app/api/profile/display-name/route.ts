import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db, schema, startQueryTimer } from '@/lib/db'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { displayName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const displayName = String(body?.displayName ?? '').trim()
  if (!displayName) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const stopProfileLookup = startQueryTimer('api.profile-display-name.profile-check')
  let profiles: Array<{ username: string | null }> = []
  try {
    profiles = await db
      .select({ username: schema.profiles.username })
      .from(schema.profiles)
      .where(eq(schema.profiles.id, user.id))
      .limit(1)
  } finally {
    stopProfileLookup({ rowCount: profiles.length })
  }

  const username = profiles[0]?.username ?? (typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : null)
  if (!username) {
    return NextResponse.json({ error: 'username_required' }, { status: 409 })
  }

  const stopUpsertTimer = startQueryTimer('api.profile-display-name.upsert')
  try {
    await db
      .insert(schema.profiles)
      .values({ id: user.id, username, displayName })
      .onConflictDoUpdate({
        target: schema.profiles.id,
        set: { displayName }
      })
  } finally {
    stopUpsertTimer()
  }

  const { error: metaErr } = await supabase.auth.updateUser({ data: { display_name: displayName } })
  if (metaErr) {
    // Non-fatal; metadata might fail if session lacks scope
    return NextResponse.json({ ok: true, warning: 'metadata_update_failed' })
  }
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const stopLookupTimer = startQueryTimer('api.profile-display-name.fetch')
  let rows: Array<{ displayName: string | null }> = []
  try {
    rows = await db
      .select({ displayName: schema.profiles.displayName })
      .from(schema.profiles)
      .where(eq(schema.profiles.id, user.id))
      .limit(1)
  } finally {
    stopLookupTimer({ rowCount: rows.length })
  }

  return NextResponse.json({ displayName: rows[0]?.displayName ?? null })
}
