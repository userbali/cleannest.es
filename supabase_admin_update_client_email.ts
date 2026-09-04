import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return jsonResponse({ error: "Missing Supabase environment." }, 500);
    }

    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!jwt) {
      return jsonResponse({ error: "Unauthorized." }, 401);
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(jwt);
    if (authError || !authData.user) {
      return jsonResponse({ error: "Unauthorized." }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: caller, error: callerError } = await adminClient
      .from("profiles")
      .select("id, tenant_id, role, is_active")
      .eq("id", authData.user.id)
      .maybeSingle();
    if (callerError || !caller || !caller.is_active || caller.role !== "admin") {
      return jsonResponse({ error: "Forbidden." }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const targetUserId = body && body.user_id ? String(body.user_id).trim() : "";
    const nextEmail = body && body.email ? String(body.email).trim().toLowerCase() : "";
    if (!isUuid(targetUserId)) {
      return jsonResponse({ error: "A valid user_id is required." }, 400);
    }
    if (!isValidEmail(nextEmail)) {
      return jsonResponse({ error: "A valid email is required." }, 400);
    }

    const { data: target, error: targetError } = await adminClient
      .from("profiles")
      .select("id, tenant_id, role, email")
      .eq("id", targetUserId)
      .eq("tenant_id", caller.tenant_id)
      .eq("role", "client")
      .maybeSingle();
    if (targetError) {
      return jsonResponse({ error: targetError.message || "Failed to load the client." }, 500);
    }
    if (!target) {
      return jsonResponse({ error: "Client not found in this tenant." }, 404);
    }

    const { data: targetAuthData, error: targetAuthError } = await adminClient.auth.admin.getUserById(target.id);
    if (targetAuthError || !targetAuthData.user) {
      return jsonResponse({ error: targetAuthError?.message || "Client login account not found." }, 404);
    }

    const previousProfileEmail = String(target.email || "").trim();
    const previousAuthEmail = String(targetAuthData.user.email || "").trim();
    const profileAlreadyMatches = previousProfileEmail.toLowerCase() === nextEmail;
    const authAlreadyMatches = previousAuthEmail.toLowerCase() === nextEmail;
    if (profileAlreadyMatches && authAlreadyMatches) {
      return jsonResponse({ ok: true, changed: false, user_id: target.id, email: nextEmail });
    }

    let authChanged = false;
    if (!authAlreadyMatches) {
      const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(target.id, {
        email: nextEmail,
        email_confirm: true
      });
      if (updateAuthError) {
        const message = updateAuthError.message || "Failed to update the client login email.";
        const conflict = /already|registered|exists|duplicate/i.test(message);
        return jsonResponse({ error: message }, conflict ? 409 : 500);
      }
      authChanged = true;
    }

    if (!profileAlreadyMatches) {
      const { data: updatedProfile, error: updateProfileError } = await adminClient
        .from("profiles")
        .update({ email: nextEmail })
        .eq("id", target.id)
        .eq("tenant_id", caller.tenant_id)
        .eq("role", "client")
        .select("id, email")
        .maybeSingle();

      if (updateProfileError || !updatedProfile) {
        let rollbackError = null;
        if (authChanged && previousAuthEmail) {
          const rollbackResult = await adminClient.auth.admin.updateUserById(target.id, {
            email: previousAuthEmail,
            email_confirm: true
          });
          rollbackError = rollbackResult.error;
        }
        if (rollbackError) {
          console.error("Client email profile update and Auth rollback failed", {
            userId: target.id,
            updateProfileError,
            rollbackError
          });
          return jsonResponse({
            error: "The profile update failed and the login email could not be restored. Contact support before retrying."
          }, 500);
        }
        return jsonResponse({
          error: updateProfileError?.message || "Failed to update the client profile email."
        }, 500);
      }
    }

    return jsonResponse({
      ok: true,
      changed: true,
      user_id: target.id,
      email: nextEmail
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: message }, 500);
  }
});
