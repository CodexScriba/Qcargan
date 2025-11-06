// REFERENCE ONLY - From old quecargan project
// This script shows patterns for auth.users → profiles sync
// Adapt as needed for new project

import 'dotenv/config'

import * as schema from '../drizzle/schema'
import { createDatabase } from '../lib/db/client'
import { slugify } from './utils/identifiers'

type Profile = typeof schema.profiles.$inferSelect

type AuthUserRow = {
  id: string
  email: string | null
  raw_user_meta_data: Record<string, unknown> | null
}

const { db, sql } = createDatabase()

function extractMetaValue<T>(meta: Record<string, unknown> | null | undefined, key: string): T | undefined {
  if (!meta) return undefined
  const value = meta[key]
  return value === undefined || value === null ? undefined : (value as T)
}

function deriveBaseUsername(user: AuthUserRow): string {
  const meta = user.raw_user_meta_data ?? {}
  const metaUsername = extractMetaValue<string>(meta, 'username') ?? extractMetaValue<string>(meta, 'preferred_username')
  const email = user.email ?? extractMetaValue<string>(meta, 'email')
  const base =
    metaUsername ??
    (typeof email === 'string' && email.includes('@') ? email.split('@')[0] : undefined) ??
    user.id.replace(/-/g, '').slice(0, 12)

  const slug = slugify(base)
  return slug.length > 1 ? slug : `user-${user.id.slice(0, 8)}`
}

function deriveDisplayName(user: AuthUserRow, fallbackUsername: string): string | null {
  const meta = user.raw_user_meta_data ?? {}
  const name =
    extractMetaValue<string>(meta, 'full_name') ??
    extractMetaValue<string>(meta, 'name') ??
    extractMetaValue<string>(meta, 'display_name')

  if (name && name.trim().length > 0) {
    return name.trim()
  }

  if (user.email) {
    return user.email.split('@')[0]
  }

  return fallbackUsername ?? null
}

async function loadAuthUsers(): Promise<AuthUserRow[]> {
  const rows = await sql<AuthUserRow[]>`
    select id, email, raw_user_meta_data
    from auth.users
  `
  return rows
}

async function loadExistingProfiles(): Promise<Profile[]> {
  return db.select().from(schema.profiles)
}

function ensureUniqueUsername(
  desired: string,
  userId: string,
  existingMap: Map<string, string>,
  claimedMap: Map<string, string>
): string {
  let candidate = desired
  let suffix = 1

  const markClaimed = (value: string) => {
    existingMap.set(value, userId)
    claimedMap.set(value, userId)
  }

  while (true) {
    const owner = existingMap.get(candidate)
    const claimedBy = claimedMap.get(candidate)

    if (!owner || owner === userId || claimedBy === userId) {
      markClaimed(candidate)
      return candidate
    }

    candidate = `${desired}-${suffix++}`
  }
}

async function upsertProfile(
  user: AuthUserRow,
  username: string,
  displayName: string | null,
  existingById: Map<string, Profile>
) {
  const now = new Date().toISOString()
  const existing = existingById.get(user.id)

  await db
    .insert(schema.profiles)
    .values({
      id: user.id,
      username,
      displayName,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    })
    .onConflictDoUpdate({
      target: schema.profiles.id,
      set: {
        username,
        displayName,
        updatedAt: now
      }
    })
}

async function main() {
  const users = await loadAuthUsers()
  if (users.length === 0) {
    console.log('No auth users found; nothing to migrate.')
    return
  }

  const existingProfiles = await loadExistingProfiles()
  const usernameOwners = new Map<string, string>()
  const claimedUsernames = new Map<string, string>()
  const existingById = new Map(existingProfiles.map((profile) => [profile.id, profile]))

  existingProfiles.forEach((profile) => {
    usernameOwners.set(profile.username, profile.id)
  })

  for (const user of users) {
    const desired = deriveBaseUsername(user)
    const username = ensureUniqueUsername(desired, user.id, usernameOwners, claimedUsernames)
    const displayName = deriveDisplayName(user, username)
    await upsertProfile(user, username, displayName, existingById)
    console.log(`Ensured profile for ${user.id} (${username})`)
  }

  const validIds = new Set(users.map((user) => user.id))
  const orphanProfiles = existingProfiles.filter((profile) => !validIds.has(profile.id))
  if (orphanProfiles.length > 0) {
    console.warn(
      `Detected ${orphanProfiles.length} profile(s) without a matching auth user. Review manually if cleanup is required.`
    )
  }

  console.log(`Profiles migration complete. Processed ${users.length} auth user(s).`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await sql.end({ timeout: 5 })
  })
