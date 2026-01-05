/* global document, window */
(function () {
  var THEME_KEY = "cleannest:theme";
  var THEMES = { system: true, light: true, dark: true };

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) {}
  }

  function getThemePref() {
    var v = String(safeGet(THEME_KEY) || "system");
    return THEMES[v] ? v : "system";
  }

  function applyTheme(mode) {
    mode = String(mode || "system");
    if (!THEMES[mode]) mode = "system";
    var root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    root.setAttribute("data-theme-pref", mode);
    safeSet(THEME_KEY, mode);
  }

  function initTheme() {
    applyTheme(getThemePref());
  }

  function setupThemeUI() {
    var instances = Array.prototype.slice.call(document.querySelectorAll("[data-theme-ui]"));
    if (!instances.length) return;

    function closeAll() {
      instances.forEach(function (inst) {
        var btn = inst.querySelector("[data-theme-button]");
        var menu = inst.querySelector(".theme-menu");
        if (menu) menu.hidden = true;
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }

    function syncUI() {
      var pref = getThemePref();
      instances.forEach(function (inst) {
        var btn = inst.querySelector("[data-theme-button]");
        if (btn) btn.textContent = "Theme: " + pref.charAt(0).toUpperCase() + pref.slice(1);
        var opts = inst.querySelectorAll("[data-theme-set]");
        Array.prototype.forEach.call(opts, function (opt) {
          var val = opt.getAttribute("data-theme-set") || "system";
          opt.setAttribute("aria-checked", val === pref ? "true" : "false");
        });
      });
    }

    instances.forEach(function (inst) {
      var btn = inst.querySelector("[data-theme-button]");
      var menu = inst.querySelector(".theme-menu");
      if (!btn || !menu) return;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = !!menu.hidden;
        closeAll();
        menu.hidden = !willOpen;
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      var opts = inst.querySelectorAll("[data-theme-set]");
      Array.prototype.forEach.call(opts, function (opt) {
        opt.addEventListener("click", function (e) {
          e.preventDefault();
          var mode = opt.getAttribute("data-theme-set") || "system";
          applyTheme(mode);
          syncUI();
          closeAll();
        });
      });
    });

    document.addEventListener("click", function (e) {
      var clickedInside = instances.some(function (inst) {
        return inst.contains(e.target);
      });
      if (!clickedInside) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });

    syncUI();
  }

  initTheme();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeUI);
  } else {
    setupThemeUI();
  }

  window.CN_THEME = { applyTheme: applyTheme, getThemePref: getThemePref };
})();
