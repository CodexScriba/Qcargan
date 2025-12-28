import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, test } from "vitest"

describe("Next.js env loading", () => {
  test("loads .env.local into process.env", () => {
    const require = createRequire(import.meta.url)
    const { loadEnvConfig } = require("@next/env") as {
      loadEnvConfig: (dir: string, dev: boolean) => unknown
    }

    const dir = mkdtempSync(join(tmpdir(), "qcargan-env-"))

    const prior: Record<string, string | undefined> = {
      NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY:
        process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY"],
      SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"],
    }

    try {
      writeFileSync(
        join(dir, ".env.test.local"),
        [
          "NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co",
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=example_public_key",
          "SUPABASE_SERVICE_ROLE_KEY=example_service_role_key",
          "",
        ].join("\n"),
        "utf8",
      )

      loadEnvConfig(dir, true)

      expect(process.env["NEXT_PUBLIC_SUPABASE_URL"]).toBe(
        "https://example.supabase.co",
      )
      expect(process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY"]).toBe(
        "example_public_key",
      )
      expect(process.env["SUPABASE_SERVICE_ROLE_KEY"]).toBe(
        "example_service_role_key",
      )
    } finally {
      rmSync(dir, { recursive: true, force: true })
      for (const [key, value] of Object.entries(prior)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
    }
  })
})
