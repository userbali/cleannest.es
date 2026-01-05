/* global window, document */

(function () {
  // Supabase client from CDN (loaded in HTML)
  const { createClient } = window.supabase;

  function readConfig() {
    const cfg = window.CN_CONFIG || {};
    const url = (cfg.SUPABASE_URL || "").trim();
    const key = (cfg.SUPABASE_ANON_KEY || "").trim();

    if (!url || !key || url.toUpperCase().includes("YOUR_PROJECT") || key.toUpperCase().includes("YOUR_SUPABASE")) {
      // Fail loudly: without a valid config, supabase-js will make requests to a placeholder URL and you'll see "Failed to fetch".
      throw new Error("Supabase config missing. Edit config.js with your SUPABASE_URL and SUPABASE_ANON_KEY, then hard refresh.");
    }
    return { url, key };
  }

  // Lazily create the client the first time we need it.
  let _sb = null;
  function sb() {
    if (_sb) return _sb;
    const { url, key } = readConfig();
    _sb = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return _sb;
  }

  async function getSession() {
    const { data, error } = await sb().auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function requireSession() {
    const s = await getSession();
    if (!s) {
      window.location.href = "login.html";
      throw new Error("Auth session missing. Please sign in again.");
    }
    return s;
  }

  async function getProfile() {
    await requireSession();
    const { data, error } = await sb().from("profiles").select("id, tenant_id, role, name, is_active").eq("id", (await sb().auth.getUser()).data.user.id).single();
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { error } = await sb().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return true;
  }

  async function signOut() {
    await sb().auth.signOut();
    window.location.href = "login.html";
  }

  function fmtDate(d) {
    // YYYY-MM-DD in local time
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  window.CN = {
    // expose a getter so other modules always get the initialized client
    get sb() { return sb(); },
    getSession,
    requireSession,
    getProfile,
    signIn,
    signOut,
    fmtDate,
  };
})();
