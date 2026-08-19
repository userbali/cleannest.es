/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;

  // Wire logout if present
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = () => CN.signOut().catch(e => toast(e.message || String(e), "error"));

  const loginCard = $("loginCard");
  const requestResetCard = $("requestResetCard");
  const passwordResetCard = $("passwordResetCard");
  const forgotPasswordBtn = $("forgotPasswordBtn");
  const backToLoginBtn = $("backToLoginBtn");
  const sendResetBtn = $("sendResetBtn");
  const saveNewPasswordBtn = $("saveNewPasswordBtn");
  const resetEmailEl = $("resetEmail");
  const newPasswordEl = $("newPassword");
  const newPasswordConfirmEl = $("newPasswordConfirm");
  const resetPasswordError = $("resetPasswordError");
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  let recoveryMode = hashParams.get("type") === "recovery" || queryParams.get("type") === "recovery";

  function showPanel(panel) {
    if (loginCard) loginCard.hidden = panel !== "login";
    if (requestResetCard) requestResetCard.hidden = panel !== "request";
    if (passwordResetCard) passwordResetCard.hidden = panel !== "password";
  }

  function setResetError(message) {
    if (!resetPasswordError) return;
    resetPasswordError.textContent = message || "";
    resetPasswordError.style.display = message ? "block" : "none";
  }

  function getResetRedirectUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  function getSafeNextPath(role) {
    const raw = String(queryParams.get("next") || "").trim();
    if (!raw || raw.startsWith("/") || raw.includes("\\") || raw.includes("://")) return "";
    let parsed;
    try {
      parsed = new URL(raw, "https://cleannest.local/");
    } catch (e) {
      return "";
    }
    const page = parsed.pathname.replace(/^\/+/, "");
    const allowedPage = role === "admin"
      ? "admin.html"
      : role === "staff"
        ? "staff.html"
        : "client.html";
    if (page !== allowedPage) return "";
    return `${page}${parsed.search}${parsed.hash}`;
  }

  CN.sb.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      recoveryMode = true;
      showPanel("password");
    }
  });

  if (hashParams.get("error")) {
    const description = hashParams.get("error_description") || "Password reset link is invalid or has expired.";
    toast(description.replace(/\+/g, " "), "error");
    showPanel("request");
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (recoveryMode) {
    showPanel("password");
  } else {
    showPanel("login");
  }

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
    const nextPath = getSafeNextPath(p.role);
    if (nextPath) {
      window.location.href = nextPath;
    } else if (p.role === "admin") {
      window.location.href = "admin.html";
    } else if (p.role === "staff") {
      window.location.href = "staff.html";
    } else {
      window.location.href = "client.html";
    }
  }

  // If already logged in, redirect
  try {
    const session = await CN.getSession();
    if (session && !recoveryMode) await redirectByRole();
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

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", () => {
      if (resetEmailEl && emailEl) resetEmailEl.value = emailEl.value.trim();
      showPanel("request");
    });
  }

  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => showPanel("login"));
  }

  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", async () => {
      const email = resetEmailEl ? resetEmailEl.value.trim() : "";
      if (!email) {
        toast("Please enter your email address.", "error");
        return;
      }
      sendResetBtn.disabled = true;
      try {
        const { error } = await CN.sb.auth.resetPasswordForEmail(email, {
          redirectTo: getResetRedirectUrl()
        });
        if (error) throw error;
        toast("Password reset link sent. Please check your email.", "ok");
        showPanel("login");
      } catch (e) {
        toast(e.message || String(e), "error");
      } finally {
        sendResetBtn.disabled = false;
      }
    });
  }

  if (saveNewPasswordBtn) {
    saveNewPasswordBtn.addEventListener("click", async () => {
      const password = newPasswordEl ? newPasswordEl.value : "";
      const confirm = newPasswordConfirmEl ? newPasswordConfirmEl.value : "";
      setResetError("");
      if (password.length < 8) {
        setResetError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        setResetError("Passwords do not match.");
        return;
      }
      saveNewPasswordBtn.disabled = true;
      try {
        const { error } = await CN.sb.auth.updateUser({ password });
        if (error) throw error;
        toast("Password updated. Please sign in with your new password.", "ok");
        await CN.sb.auth.signOut();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 700);
      } catch (e) {
        setResetError(e.message || String(e));
      } finally {
        saveNewPasswordBtn.disabled = false;
      }
    });
  }

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
