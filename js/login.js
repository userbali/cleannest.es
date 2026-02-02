/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;

  // Wire logout if present
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = () => CN.signOut().catch(e => toast(e.message || String(e), "error"));

  // Login form
  const form = document.querySelector("form") || $("loginForm");
  const emailEl = document.querySelector('input[type="email"]');
  const passEl = document.querySelector('input[type="password"]');
  const btn = document.querySelector('button[type="submit"]');

  if (!emailEl || !passEl) {
    toast("Login page markup changed: email/password inputs not found.", "error");
    return;
  }

  async function redirectByRole() {
    const p = await CN.getProfile();
    if (p.role === "admin") window.location.href = "admin.html";
    else if (p.role === "staff") window.location.href = "staff.html";
    else window.location.href = "client.html";
  }

  // If already logged in, redirect
  try {
    const session = await CN.getSession();
    if (session) await redirectByRole();
  } catch (e) {}

  async function onSubmit(ev) {
    ev.preventDefault();
    btn && (btn.disabled = true);

    try {
      await CN.signIn(emailEl.value.trim(), passEl.value);
      await redirectByRole();
    } catch (e) {
      toast(e.message || String(e), "error");
    } finally {
      btn && (btn.disabled = false);
    }
  }

  if (form) form.onsubmit = onSubmit;

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", onSubmit);

  const toggleBtn = document.getElementById("toggleLoginPassword");
  if (toggleBtn) {
    const target = document.getElementById("loginPassword") || passEl;
    if (target) {
      toggleBtn.addEventListener("click", () => {
        const isHidden = target.type === "password";
        target.type = isHidden ? "text" : "password";
        toggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
        toggleBtn.title = isHidden ? "Hide password" : "Show password";
        toggleBtn.textContent = isHidden ? "Hide" : "Show";
      });
    }
  }
// Optional: Tenant bootstrap (first ever admin after signup)
  // Add a hidden dev helper: if URL has ?bootstrap=1 it will create a tenant+profile for the current auth user.
  // This requires you to sign up first (Supabase Auth) and then open /login.html?bootstrap=1
  const url = new URL(window.location.href);
  if (url.searchParams.get("bootstrap") === "1") {
    try {
      const session = await CN.requireSession();
      const slug = prompt("Tenant slug (unique)", "demo-tenant");
      const name = prompt("Tenant name", "Demo Tenant");
      const adminName = prompt("Admin display name", "Admin");
      if (!slug || !name) return;
      const { data, error } = await CN.sb.rpc("create_tenant_and_admin", { p_slug: slug, p_name: name, p_admin_name: adminName || "Admin" });
      if (error) throw error;
      toast("Tenant created. Reloading…", "ok");
      setTimeout(() => redirectByRole(), 500);
    } catch (e) {
      toast("Bootstrap failed: " + (e.message || String(e)), "error");
    }
  }
})();
