/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;
  const roleTag = $("roleTag");
  const userTag = $("userTag");
  const subLine = $("subLine");
  const root = $("sessionsRoot");
  const logoutBtn = $("logoutBtn");
  const backBtn = $("backBtn");

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name) || "";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function fmtDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
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
    if (!list.length) {
      container.innerHTML = '<div class="small-note">No checklist items.</div>';
      return;
    }
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

  function renderGallery(container, items, label) {
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
      if (label) img.setAttribute("data-label", label);
      shot.appendChild(img);

      const date = document.createElement("div");
      date.className = "date";
      date.textContent = fmtPhotoDate(item.media && item.media.created_at) || "";
      shot.appendChild(date);

      gallery.appendChild(shot);
    });
    container.appendChild(gallery);
  }

  function renderSessions(property, tasks, checklistsByTask, photosByTask, staffMap) {
    if (!root) return;
    root.innerHTML = "";

    if (!tasks.length) {
      root.innerHTML = '<div class="empty-state"><div class="empty-state__msg">No completed sessions yet.</div></div>';
      return;
    }

    const stack = document.createElement("div");
    stack.className = "session-stack";

    tasks.forEach((task) => {
      const card = document.createElement("div");
      card.className = "session-card";

      const head = document.createElement("div");
      head.className = "session-head";
      const title = document.createElement("div");
      title.className = "session-title";
      const label = task.label ? task.label.name : "Cleaning";
      title.textContent = `${label} - ${task.day_date || ""}`;
      const badge = document.createElement("span");
      badge.className = "session-badge done";
      const doneLabel = task.completed_at ? fmtDate(task.completed_at) : (task.day_date || "");
      badge.textContent = doneLabel ? `DONE - ${doneLabel}` : "DONE";
      head.appendChild(title);
      head.appendChild(badge);
      card.appendChild(head);

      const meta = document.createElement("div");
      meta.className = "small-note";
      const staffName = task.assigned_user_id ? (staffMap.get(task.assigned_user_id) || "Staff") : "Unassigned";
      const parts = [
        fmtTimeRange(task.start_at, task.end_at, task.duration_minutes),
        staffName
      ];
      if (task.notes) parts.push(task.notes);
      meta.textContent = parts.filter(Boolean).join(" | ");
      if (meta.textContent) card.appendChild(meta);

      const divider1 = document.createElement("div");
      divider1.className = "divider";
      card.appendChild(divider1);

      const checklistLabel = document.createElement("div");
      checklistLabel.className = "label";
      checklistLabel.textContent = "Checklist";
      card.appendChild(checklistLabel);
      const checklistWrap = document.createElement("div");
      renderChecklist(checklistWrap, checklistsByTask.get(task.id) || []);
      card.appendChild(checklistWrap);

      const divider2 = document.createElement("div");
      divider2.className = "divider";
      card.appendChild(divider2);

      const photosLabel = document.createElement("div");
      photosLabel.className = "label";
      photosLabel.textContent = "Work photos";
      card.appendChild(photosLabel);
      const photosWrap = document.createElement("div");
      renderGallery(photosWrap, photosByTask.get(task.id) || [], label);
      card.appendChild(photosWrap);

      stack.appendChild(card);
    });

    root.appendChild(stack);
  }

  async function loadProperty(propertyId) {
    const { data, error } = await CN.sb
      .from("properties")
      .select("id, address")
      .eq("id", propertyId)
      .single();
    if (error) throw error;
    return data;
  }

  async function loadTasks(propertyId) {
    let query = CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, assigned_user_id, completed_at, label:task_labels(name)")
      .eq("property_id", propertyId)
      .eq("status", "done")
      .order("day_date", { ascending: false })
      .order("start_at", { ascending: false });
    if (profile && profile.role === "staff") {
      query = query.eq("assigned_user_id", profile.id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async function loadStaffMap(tasks) {
    const ids = Array.from(new Set((tasks || []).map((t) => t.assigned_user_id).filter(Boolean)));
    const map = new Map();
    if (!ids.length) return map;
    if (!profile || profile.role !== "admin") {
      if (profile && profile.id && ids.includes(profile.id)) {
        map.set(profile.id, profile.name || "Staff");
      }
      return map;
    }
    const { data, error } = await CN.sb
      .from("profiles")
      .select("id, name, email")
      .in("id", ids);
    if (error) throw error;
    (data || []).forEach((row) => {
      map.set(row.id, row.name || row.email || "Staff");
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

  async function loadWorkPhotos(taskIds) {
    const map = new Map();
    const ids = Array.isArray(taskIds) ? taskIds.filter(Boolean) : [];
    if (!ids.length) return map;
    const { data, error } = await CN.sb
      .from("media_links")
      .select("id, task_id, tag, created_at, media:media(id, path, mime_type, created_at)")
      .in("task_id", ids)
      .neq("tag", "reference")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const withUrls = await attachSignedUrls(data || []);
    withUrls.forEach((item) => {
      if (!map.has(item.task_id)) map.set(item.task_id, []);
      map.get(item.task_id).push(item);
    });
    return map;
  }

  let profile;
  try {
    profile = await CN.getProfile();
  } catch (e) {
    toast(e.message || String(e), "error");
    return;
  }

  if (!profile || !profile.role) {
    toast("Access denied.", "error");
    window.location.href = "login.html";
    return;
  }

  if (roleTag) roleTag.textContent = String(profile.role || "").toUpperCase();
  if (userTag) userTag.textContent = profile.name || "User";

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => CN.signOut().catch((e) => toast(e.message || String(e), "error")));
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      try {
        if (window.history.length > 1) window.history.back();
        else if (profile.role === "admin") window.location.href = "admin.html";
        else if (profile.role === "staff") window.location.href = "staff.html";
        else window.location.href = "client.html";
      } catch {
        window.location.href = "admin.html";
      }
    });
  }

  const propertyId = (qs("propertyId") || qs("propId")).trim();
  if (!propertyId) {
    if (subLine) subLine.textContent = "Missing property ID.";
    if (root) root.innerHTML = '<div class="empty-state"><div class="empty-state__msg">Missing propertyId in URL.</div></div>';
    return;
  }

  try {
    if (subLine) subLine.textContent = "Loading sessions...";
    const property = await loadProperty(propertyId);
    const tasks = await loadTasks(propertyId);
    const [staffMap, checklistsByTask, photosByTask] = await Promise.all([
      loadStaffMap(tasks),
      loadChecklists(tasks.map((t) => t.id)),
      loadWorkPhotos(tasks.map((t) => t.id))
    ]);

    if (subLine) {
      const addr = property && property.address ? property.address : "Property";
      const count = tasks.length;
      subLine.textContent = `${addr} - ${count} completed session${count === 1 ? "" : "s"}.`;
    }

    renderSessions(property, tasks, checklistsByTask, photosByTask, staffMap);
  } catch (e) {
    if (subLine) subLine.textContent = "Unable to load sessions.";
    if (root) root.innerHTML = `<div class="empty-state"><div class="empty-state__msg">${e.message || String(e)}</div></div>`;
  }
})();
