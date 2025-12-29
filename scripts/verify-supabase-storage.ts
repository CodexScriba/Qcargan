// Import Supabase client for storage operations and postgres for direct database queries
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

// Load environment variables from .env files into process.env
// Tries .env.local first, then falls back to .env
async function loadDotEnv(dotEnvPath = ".env.local"): Promise<void> {
  const candidates = [dotEnvPath, ".env"];

  for (const candidate of candidates) {
    try {
      const file = Bun.file(candidate);
      if (!file.exists()) continue;
      const raw = await file.text();

      // Parse each line: skip empty lines and comments, extract key=value pairs
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq < 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        // Remove quotes from values if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        // Only set if not already defined in process.env
        if (!(key in process.env)) process.env[key] = value;
      }

      return;
    } catch {
      // ignore .env parsing errors; fall back to process.env
    }
  }
}

// Main function: verifies Supabase storage bucket configuration
async function main() {
  // Load environment variables from .env files
  await loadDotEnv();

  // Get database URL and create postgres client for direct SQL queries
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Missing env var DATABASE_URL");

  const sql = postgres(databaseUrl, { prepare: false });

  // Get Supabase URL (try both service and public env vars)
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing env var SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");

  // Define the storage bucket and policy name to verify
  const bucketId = "vehicle-images";
  const policyName = "Public Access";

  try {
    // Verify bucket state via SQL queries (works without table ownership)
    // Query 1: Check if the vehicle-images bucket exists and is public
    const bucketRows = await sql<{ id: string; name: string; public: boolean }[]>`
      select id, name, public
      from storage.buckets
      where id = ${bucketId}
      limit 1
    `;

    const bucket = bucketRows[0] ?? null;

    // Query 2: Check if Row Level Security (RLS) is enabled on storage.objects table
    const rlsRows = await sql<{ relrowsecurity: boolean }[]>`
      select c.relrowsecurity
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'storage' and c.relname = 'objects' and c.relkind = 'r'
      limit 1
    `;
    const storageObjectsRlsEnabled = rlsRows[0]?.relrowsecurity ?? null;

    // Query 3: Check if the public read policy exists for storage.objects
    const policyRows = await sql<{ policyname: string }[]>`
      select policyname
      from pg_policies
      where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = ${policyName}
      limit 1
    `;
    const hasPublicReadPolicy = policyRows.length > 0;

    // Optionally attempt bucket creation/update if a service role key is provided
    // This allows the script to auto-fix missing or non-public buckets
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let bucketEnsuredVia: string | null = null;
    if ((!bucket || bucket.public !== true) && serviceRoleKey) {
      // Create Supabase client with service role key (bypasses RLS)
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      // List all existing buckets to check if our bucket already exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) throw listError;

      const exists = (buckets ?? []).some((b) => b.name === bucketId);
      if (!exists) {
        // Create new public bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket(bucketId, { public: true });
        if (error) throw error;
      } else {
        // Update existing bucket to be public if it exists but isn't public
        const { error } = await supabase.storage.updateBucket(bucketId, { public: true });
        if (error) throw error;
      }
      bucketEnsuredVia = "supabase.storage.{createBucket,updateBucket} (service role)";
    }

    // Print verification results as JSON (minimal, non-secret output suitable for task evidence)
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

    // Validate all required storage configurations and throw errors if any are missing
    if (!bucket) throw new Error(`Bucket '${bucketId}' is missing.`);
    if (bucket.public !== true) throw new Error(`Bucket '${bucketId}' is not public.`);
    if (storageObjectsRlsEnabled !== true)
      throw new Error("RLS is not enabled on storage.objects (must be enabled for policies).");
    if (!hasPublicReadPolicy)
      throw new Error(`Missing storage.objects SELECT policy named '${policyName}'.`);
  } finally {
    // Ensure database connection is closed even if errors occur
    await sql.end({ timeout: 5 });
  }
}

// Execute the main function
await main();
