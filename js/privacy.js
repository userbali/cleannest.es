(() => {
  "use strict";

  const STORAGE_KEY = "cn:privacy:ok";
  const banner = document.getElementById("gdprBanner");
  if (!banner) return;

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }

  function setConsent() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  function showBanner() {
    banner.hidden = false;
    banner.classList.add("is-visible");
  }

  function hideBanner() {
    banner.classList.remove("is-visible");
    banner.hidden = true;
  }

  const acceptBtn = document.getElementById("gdprAccept");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      setConsent();
      hideBanner();
    });
  }

  if (!hasConsent()) showBanner();
})();
