import postgres from "postgres";

async function loadDotEnv(dotEnvPath = ".env.local"): Promise<void> {
  const candidates = [dotEnvPath, ".env"];

  for (const candidate of candidates) {
    try {
      const file = Bun.file(candidate);
      if (!file.exists()) continue;
      const raw = await file.text();

      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq < 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
      }

      return;
    } catch {
      // ignore .env parsing errors; fall back to process.env
    }
  }
}

async function main() {
  await loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Missing env var DATABASE_URL");

  const sql = postgres(databaseUrl, { prepare: false });

  try {
    const rows = await sql<{
      schema_name: string;
      table_name: string;
      rls_enabled: boolean;
    }[]>`
      select n.nspname as schema_name,
             c.relname as table_name,
             c.relrowsecurity as rls_enabled
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where c.relkind = 'r'
        and n.nspname = 'public'
        and c.relrowsecurity = false
      order by n.nspname, c.relname
    `;

    if (rows.length > 0) {
      console.error(
        JSON.stringify(
          { ok: false, message: "RLS is disabled on one or more public tables.", tables: rows },
          null,
          2
        )
      );
      process.exitCode = 1;
      return;
    }

    console.log(JSON.stringify({ ok: true, message: "All public tables have RLS enabled." }, null, 2));
  } finally {
    await sql.end({ timeout: 5 });
  }
}

await main();
