import { createClient } from "@supabase/supabase-js";
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

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing env var SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");

  const bucketId = "vehicle-images";
  const policyName = "Public Access";

  try {
    // Verify state via SQL (works without table ownership).
    const bucketRows = await sql<{ id: string; name: string; public: boolean }[]>`
      select id, name, public
      from storage.buckets
      where id = ${bucketId}
      limit 1
    `;

    const bucket = bucketRows[0] ?? null;

    const rlsRows = await sql<{ relrowsecurity: boolean }[]>`
      select c.relrowsecurity
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'storage' and c.relname = 'objects' and c.relkind = 'r'
      limit 1
    `;
    const storageObjectsRlsEnabled = rlsRows[0]?.relrowsecurity ?? null;

    const policyRows = await sql<{ policyname: string }[]>`
      select policyname
      from pg_policies
      where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = ${policyName}
      limit 1
    `;
    const hasPublicReadPolicy = policyRows.length > 0;

    // Optionally attempt bucket creation/update if a service role key is provided.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let bucketEnsuredVia: string | null = null;
    if ((!bucket || bucket.public !== true) && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) throw listError;

      const exists = (buckets ?? []).some((b) => b.name === bucketId);
      if (!exists) {
        const { error } = await supabase.storage.createBucket(bucketId, { public: true });
        if (error) throw error;
      } else {
        const { error } = await supabase.storage.updateBucket(bucketId, { public: true });
        if (error) throw error;
      }
      bucketEnsuredVia = "supabase.storage.{createBucket,updateBucket} (service role)";
    }

    // Print minimal, non-secret output suitable for task evidence.
    console.log(
      JSON.stringify(
        {
          ok: true,
          bucket: bucketId,
          bucketRow: bucket,
          storageObjectsRlsEnabled,
          hasPublicReadPolicy: { expectedName: policyName, present: hasPublicReadPolicy },
          bucketEnsuredVia,
          nextSteps:
            !bucket
              ? [
                  "Create the bucket in the Supabase dashboard (Storage) OR set SUPABASE_SERVICE_ROLE_KEY and re-run.",
                ]
              : [],
        },
        null,
        2
      )
    );

    if (!bucket) throw new Error(`Bucket '${bucketId}' is missing.`);
    if (bucket.public !== true) throw new Error(`Bucket '${bucketId}' is not public.`);
    if (storageObjectsRlsEnabled !== true)
      throw new Error("RLS is not enabled on storage.objects (must be enabled for policies).");
    if (!hasPublicReadPolicy)
      throw new Error(`Missing storage.objects SELECT policy named '${policyName}'.`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

await main();
