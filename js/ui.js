/* global window, document */
(function () {
  function $(id) { return document.getElementById(id); }

  function toast(msg, kind = "info") {
    // Lightweight toast: reuses existing UI area if present
    let el = $("cnToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cnToast";
      el.style.position = "fixed";
      el.style.left = "12px";
      el.style.bottom = "12px";
      el.style.zIndex = "9999";
      el.style.maxWidth = "520px";
      el.style.padding = "10px 12px";
      el.style.borderRadius = "10px";
      el.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";
      el.style.background = "rgba(20,20,20,.92)";
      el.style.color = "white";
      el.style.fontSize = "14px";
      el.style.lineHeight = "1.35";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    if (kind === "error") el.style.background = "rgba(140, 20, 20, .92)";
    if (kind === "ok") el.style.background = "rgba(20, 120, 60, .92)";
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = "0"; }, 3200);
  }

  window.CN_UI = { $, toast };
})();
