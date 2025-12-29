import { describe, expect, test } from "vitest"
import fs from "fs"
import path from "path"

function loadMessages(locale: string) {
  const filePath = path.join(process.cwd(), "messages", `${locale}.json`)
  const raw = fs.readFileSync(filePath, "utf8")
  return JSON.parse(raw) as Record<string, unknown>
}

function collectPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return [prefix]
  }

  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) {
    return [prefix]
  }

  return entries.flatMap(([key, child]) =>
    collectPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe("messages json", () => {
  test("parses without errors", () => {
    expect(() => loadMessages("en")).not.toThrow()
    expect(() => loadMessages("es")).not.toThrow()
  })

  test("en and es have matching keys", () => {
    const en = loadMessages("en")
    const es = loadMessages("es")

    const enPaths = collectPaths(en).sort()
    const esPaths = collectPaths(es).sort()

    expect(esPaths).toEqual(enPaths)
  })
})
