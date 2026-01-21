/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;
  let profile;

  try {
    profile = await CN.getProfile();
  } catch (e) {
    toast(e.message || String(e), "error");
    return;
  }

  if (profile.role !== "client") {
    toast("Access denied (client only).", "error");
    window.location.href = "login.html";
    return;
  }

  const roleTag = $("roleTag");
  if (roleTag) roleTag.textContent = "CLIENT";
  const userTag = $("userTag");
  if (userTag) userTag.textContent = profile.name || "Client";
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => CN.signOut().catch((e) => toast(e.message || String(e), "error")));

  const viewToggle = $("clientViewToggle");
  const upcomingWrap = $("clientUpcomingWrap");
  const historyWrap = $("clientHistoryWrap");
  const upcomingEl = $("clientUpcoming");
  const historyEl = $("clientHistory");

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toDateInputValue(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function fmtTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function fmtTimeRange(startAt, endAt, durationMinutes) {
    if (!startAt) return "Time TBD";
    const startLabel = fmtTime(startAt);
    if (endAt) return `${startLabel} - ${fmtTime(endAt)}`;
    if (durationMinutes) {
      const d = new Date(startAt);
      d.setMinutes(d.getMinutes() + Number(durationMinutes || 0));
      return `${startLabel} - ${fmtTime(d.toISOString())}`;
    }
    return startLabel;
  }

  function getDisplayDate(task, options) {
    if (options && options.useCompletedAt && task && task.completed_at) {
      const d = new Date(task.completed_at);
      if (!Number.isNaN(d.getTime())) return toDateInputValue(d);
    }
    return task && task.day_date ? task.day_date : "";
  }

  function formatCompletedStamp(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${toDateInputValue(d)} ${time}`;
  }

  function statusBadge(status) {
    if (status === "in_progress") return { label: "In progress", className: "in_progress" };
    if (status === "done") return { label: "Completed", className: "completed" };
    if (status === "canceled") return { label: "Cancelled", className: "cancelled" };
    return { label: "Scheduled", className: "scheduled" };
  }

  function getMediaBucket() {
    const cfg = window.CN_CONFIG || {};
    const bucket = String(cfg.SUPABASE_MEDIA_BUCKET || "media").trim();
    return bucket || "media";
  }

  async function attachSignedUrls(items) {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return [];
    const bucket = getMediaBucket();
    const paths = list.map((item) => item.media && item.media.path).filter(Boolean);
    if (!paths.length) return list;
    const { data, error } = await CN.sb.storage.from(bucket).createSignedUrls(paths, 3600);
    if (error) throw error;
    const urlMap = new Map();
    (data || []).forEach((row) => {
      if (row && row.path) urlMap.set(row.path, row.signedUrl || "");
    });
    return list.map((item) => ({
      ...item,
      signedUrl: item.media && item.media.path ? (urlMap.get(item.media.path) || "") : ""
    }));
  }

  function fmtPhotoDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function renderChecklist(container, items) {
    if (!container) return;
    container.innerHTML = "";
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return;
    const box = document.createElement("div");
    box.className = "checklist";
    list.forEach((item) => {
      const row = document.createElement("div");
      row.className = "check-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.disabled = true;
      input.checked = Boolean(item.done);
      const label = document.createElement("label");
      label.textContent = item.label || "Checklist item";
      if (item.done) label.classList.add("done");
      row.appendChild(input);
      row.appendChild(label);
      box.appendChild(row);
    });
    container.appendChild(box);
  }

  function renderGallery(container, items) {
    if (!container) return;
    container.innerHTML = "";
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      container.innerHTML = '<div class="small-note">No photos yet.</div>';
      return;
    }
    const gallery = document.createElement("div");
    gallery.className = "gallery";
    list.forEach((item) => {
      const shot = document.createElement("div");
      shot.className = "shot";
      const img = document.createElement("img");
      img.src = item.signedUrl || "";
      img.alt = item.tag === "reference" ? "Reference photo" : "Work photo";
      img.setAttribute("data-action", "open-photo");
      if (item.signedUrl) img.setAttribute("data-src", item.signedUrl);
      img.setAttribute("data-date", fmtPhotoDate(item.media && item.media.created_at) || "");
      img.setAttribute("data-kind", item.tag || "other");
      shot.appendChild(img);

      const date = document.createElement("div");
      date.className = "date";
      date.textContent = fmtPhotoDate(item.media && item.media.created_at) || "";
      shot.appendChild(date);

      gallery.appendChild(shot);
    });
    container.appendChild(gallery);
  }

  async function loadTaskPhotos(taskIds) {
    const ids = Array.isArray(taskIds) ? taskIds.filter(Boolean) : [];
    if (!ids.length) return new Map();
    const { data, error } = await CN.sb
      .from("media_links")
      .select("id, task_id, tag, created_at, media:media(id, path, mime_type, created_at)")
      .in("task_id", ids)
      .neq("tag", "reference")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const withUrls = await attachSignedUrls(data || []);
    const map = new Map();
    withUrls.forEach((item) => {
      if (!map.has(item.task_id)) map.set(item.task_id, []);
      map.get(item.task_id).push(item);
    });
    return map;
  }

  async function loadChecklists(taskIds) {
    const map = new Map();
    const ids = Array.isArray(taskIds) ? taskIds.filter(Boolean) : [];
    if (!ids.length) return map;
    const { data, error } = await CN.sb
      .from("task_checklist_items")
      .select("task_id, label, done, sort_order, created_at")
      .in("task_id", ids)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    (data || []).forEach((row) => {
      if (!map.has(row.task_id)) map.set(row.task_id, []);
      map.get(row.task_id).push(row);
    });
    return map;
  }

  async function loadUpcoming() {
    const today = toDateInputValue(new Date());
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, property:properties(address), label:task_labels(name)")
      .gte("day_date", today)
      .neq("status", "done")
      .neq("status", "canceled")
      .order("day_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function loadHistory() {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, completed_at, notes, property:properties(address), label:task_labels(name)")
      .eq("status", "done")
      .order("completed_at", { ascending: false, nullsFirst: false })
      .order("day_date", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  }

  function renderList(container, tasks, emptyMessage, options) {
    if (!container) return;
    container.innerHTML = "";
    if (!tasks.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__msg">${emptyMessage}</div></div>`;
      return;
    }
    const photosByTask = options && options.photosByTask ? options.photosByTask : null;
    const showPhotos = Boolean(options && options.showPhotos);
    const checklistsByTask = options && options.checklistsByTask ? options.checklistsByTask : null;
    const showChecklist = Boolean(options && options.showChecklist);
    const list = document.createElement("div");
    list.className = "booking-list";
    tasks.forEach((task) => {
      const card = document.createElement("div");
      card.className = "booking-card";

      const top = document.createElement("div");
      top.className = "booking-top";
      const when = document.createElement("div");
      when.className = "booking-when";
      const dateEl = document.createElement("div");
      dateEl.className = "booking-date";
      dateEl.textContent = getDisplayDate(task, options);
      const timeEl = document.createElement("div");
      timeEl.className = "small-muted";
      timeEl.textContent = fmtTimeRange(task.start_at, task.end_at, task.duration_minutes);
      when.appendChild(dateEl);
      when.appendChild(timeEl);

      const main = document.createElement("div");
      main.className = "booking-main";
      const title = document.createElement("div");
      title.className = "booking-title";
      title.textContent = task.label ? task.label.name : "Cleaning";
      const sub = document.createElement("div");
      sub.className = "small-muted";
      sub.textContent = task.property ? task.property.address : "Property";
      main.appendChild(title);
      main.appendChild(sub);

      const status = document.createElement("div");
      status.className = "booking-status";
      const badge = statusBadge(task.status);
      const badgeEl = document.createElement("span");
      badgeEl.className = `badge ${badge.className}`;
      badgeEl.textContent = badge.label;
      status.appendChild(badgeEl);
      if (task.status === "done") {
        const stamp = formatCompletedStamp(task.completed_at);
        if (stamp) {
          const stampEl = document.createElement("div");
          stampEl.className = "small-muted";
          stampEl.textContent = `Completed: ${stamp}`;
          status.appendChild(stampEl);
        }
      }

      top.appendChild(when);
      top.appendChild(main);
      top.appendChild(status);
      card.appendChild(top);

      if (task.notes) {
        const details = document.createElement("div");
        details.className = "booking-details";
        const notes = document.createElement("div");
        notes.className = "booking-notes";
        notes.textContent = task.notes;
        details.appendChild(notes);
        card.appendChild(details);
      }

      if (showChecklist && checklistsByTask) {
        const checklistItems = checklistsByTask.get(task.id) || [];
        if (checklistItems.length) {
          const checklistLabel = document.createElement("div");
          checklistLabel.className = "label";
          checklistLabel.textContent = "Checklist";
          card.appendChild(checklistLabel);
          const checklistWrap = document.createElement("div");
          renderChecklist(checklistWrap, checklistItems);
          card.appendChild(checklistWrap);
        }
      }

      if (showPhotos && photosByTask) {
        const photos = photosByTask.get(task.id) || [];
        if (photos.length) {
          const galleryWrap = document.createElement("div");
          renderGallery(galleryWrap, photos);
          card.appendChild(galleryWrap);
        }
      }

      list.appendChild(card);
    });
    container.appendChild(list);
  }

  async function refresh() {
    try {
      const [upcoming, history] = await Promise.all([loadUpcoming(), loadHistory()]);
      const photoIds = new Set();
      const checklistIds = new Set();
      history.forEach((task) => photoIds.add(task.id));
      upcoming.forEach((task) => {
        if (task.status === "in_progress") photoIds.add(task.id);
        checklistIds.add(task.id);
      });
      history.forEach((task) => checklistIds.add(task.id));
      const photosByTask = await loadTaskPhotos(Array.from(photoIds));
      const checklistsByTask = await loadChecklists(Array.from(checklistIds));
      renderList(upcomingEl, upcoming, "No upcoming cleanings.", { photosByTask, showPhotos: true, checklistsByTask, showChecklist: true });
      renderList(historyEl, history, "No history yet.", { photosByTask, showPhotos: true, checklistsByTask, showChecklist: true, useCompletedAt: true });
    } catch (e) {
      toast(e.message || String(e), "error");
    }
  }

  if (viewToggle) {
    viewToggle.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        viewToggle.querySelectorAll("[data-view]").forEach((el) => {
          el.classList.toggle("is-active", el.getAttribute("data-view") === view);
        });
        if (upcomingWrap && historyWrap) {
          upcomingWrap.style.display = view === "upcoming" ? "block" : "none";
          historyWrap.style.display = view === "history" ? "block" : "none";
        }
      });
    });
  }

  refresh();
})();
