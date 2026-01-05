(() => {
  "use strict";

  // Shared lightbox for portal + sessions pages (no build step, no deps).
  if (window.CNLightbox) return;

  const LightboxState = { isOpen: false, index: 0, items: [] };

  function ensureLightbox() {
    let lb = document.getElementById("lightbox");
    if (lb) return lb;

    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <div class="lightbox__top">
          <div class="lightbox__title" id="lbTitle">Photo</div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="lightbox__close" type="button" id="lbPrev" title="Previous (←)">←</button>
            <button class="lightbox__close" type="button" id="lbNext" title="Next (→)">→</button>
            <button class="lightbox__close" type="button" id="lbClose" title="Close (Esc)">✕</button>
          </div>
        </div>
        <div class="lightbox__body">
          <img class="lightbox__img" id="lbImg" alt="Full size photo" />
        </div>
      </div>
    `;
    document.body.appendChild(lb);

    const close = () => {
      lb.classList.remove("is-open");
      LightboxState.isOpen = false;
      LightboxState.items = [];
      LightboxState.index = 0;
    };

    lb.querySelector("#lbClose").addEventListener("click", close);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    lb.querySelector("#lbPrev").addEventListener("click", () => step(-1));
    lb.querySelector("#lbNext").addEventListener("click", () => step(+1));

    document.addEventListener("keydown", (e) => {
      if (!LightboxState.isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(+1);
    });

    return lb;
  }

  function renderAtIndex() {
    const lb = ensureLightbox();
    const img = lb.querySelector("#lbImg");
    const t = lb.querySelector("#lbTitle");
    const item = LightboxState.items[LightboxState.index];
    if (!item) return;

    img.src = item.src;
    t.textContent = item.title || "Photo";
  }

  function open(items, startIndex = 0) {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return;

    LightboxState.items = list;
    LightboxState.index = Math.max(0, Math.min(startIndex, list.length - 1));
    LightboxState.isOpen = true;

    const lb = ensureLightbox();
    lb.classList.add("is-open");
    renderAtIndex();
  }

  function step(dir) {
    if (!LightboxState.isOpen) return;
    const n = LightboxState.items.length;
    if (n <= 1) return;
    LightboxState.index = (LightboxState.index + dir + n) % n;
    renderAtIndex();
  }

  function buildTitleFromImg(img) {
    const explicit = img.getAttribute("data-title");
    if (explicit) return explicit;

    const label = (img.getAttribute("data-label") || "").trim();
    const date = (img.getAttribute("data-date") || "").trim();
    const kind = (img.getAttribute("data-kind") || "").trim();

    const parts = [];
    if (label) parts.push(label);
    if (date) parts.push(date);

    const base = parts.join(" • ");
    if (base) return base;
    if (kind) return kind === "reference" ? "Reference photo" : "Work photo";
    return "Photo";
  }

  function bindDelegationOnce() {
    if (document.documentElement.dataset.cnLightboxBound === "1") return;
    document.documentElement.dataset.cnLightboxBound = "1";

    document.addEventListener("click", (e) => {
      const img = e.target.closest('img[data-action="open-photo"]');
      if (!img) return;

      const gallery = img.closest(".gallery");
      if (!gallery) return;

      const imgs = Array.from(gallery.querySelectorAll('img[data-action="open-photo"]'));
      const items = imgs.map((el) => ({
        src: el.getAttribute("data-src") || el.src,
        title: buildTitleFromImg(el),
      }));

      open(items, Math.max(0, imgs.indexOf(img)));
    });
  }

  window.CNLightbox = { open, step, bind: bindDelegationOnce };
  bindDelegationOnce();
})();
