import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const RETENTION_DAYS = 30;
const MAX_ITEMS_PER_RUN = 500;
const STORAGE_DELETE_BATCH_SIZE = 100;

type ExpiredWorkPhoto = {
  media_id: string;
  path: string;
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Missing required Supabase environment variables.");
    return jsonResponse({ error: "Server configuration error." }, 500);
  }

  const cleanupToken = req.headers.get("x-cleanup-token") || "";
  if (!cleanupToken) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tokenIsValid, error: tokenError } = await supabase.rpc(
    "verify_work_photo_cleanup_token",
    { p_token: cleanupToken },
  );

  if (tokenError) {
    console.error("Cleanup token validation failed:", tokenError.message);
    return jsonResponse({ error: "Token validation failed." }, 500);
  }
  if (!tokenIsValid) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const body = await req.json().catch(() => ({})) as { execute?: unknown };
  const execute = body && body.execute === true;

  const { data, error: candidateError } = await supabase.rpc(
    "list_expired_work_photos",
    {
      p_retention_days: RETENTION_DAYS,
      p_limit: MAX_ITEMS_PER_RUN,
    },
  );

  if (candidateError) {
    console.error("Failed to list expired work photos:", candidateError.message);
    return jsonResponse({ error: "Failed to list expired work photos." }, 500);
  }

  const candidates = (Array.isArray(data) ? data : []) as ExpiredWorkPhoto[];

  if (!execute) {
    return jsonResponse({
      ok: true,
      dry_run: true,
      retention_days: RETENTION_DAYS,
      eligible_photos: candidates.length,
      batch_limit_reached: candidates.length === MAX_ITEMS_PER_RUN,
    });
  }

  let storageDeleted = 0;
  let databaseDeleted = 0;
  const errors: string[] = [];

  for (const batch of chunk(candidates, STORAGE_DELETE_BATCH_SIZE)) {
    const paths = batch.map((item) => item.path);
    const mediaIds = batch.map((item) => item.media_id);

    const { error: storageError } = await supabase.storage
      .from("media")
      .remove(paths);

    if (storageError) {
      console.error("Storage deletion failed:", storageError.message);
      errors.push(`Storage batch failed: ${storageError.message}`);
      continue;
    }

    storageDeleted += batch.length;

    const { data: deletedRows, error: databaseError } = await supabase.rpc(
      "delete_expired_work_photo_records",
      {
        p_media_ids: mediaIds,
        p_retention_days: RETENTION_DAYS,
      },
    );

    if (databaseError) {
      console.error("Database cleanup failed:", databaseError.message);
      errors.push(`Database batch failed: ${databaseError.message}`);
      continue;
    }

    databaseDeleted += Array.isArray(deletedRows) ? deletedRows.length : 0;
  }

  const ok = errors.length === 0 && databaseDeleted === storageDeleted;

  return jsonResponse({
    ok,
    dry_run: false,
    retention_days: RETENTION_DAYS,
    eligible_photos: candidates.length,
    storage_objects_deleted: storageDeleted,
    database_records_deleted: databaseDeleted,
    batch_limit_reached: candidates.length === MAX_ITEMS_PER_RUN,
    errors,
  }, ok ? 200 : 500);
});
