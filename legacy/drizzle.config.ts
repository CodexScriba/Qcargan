import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? (() => {
    throw new Error('DIRECT_URL or DATABASE_URL must be set to run Drizzle commands')
  })()

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: connectionString
  }
})
