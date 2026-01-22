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

  if (!["staff", "admin"].includes(profile.role)) {
    toast("Access denied (staff only).", "error");
    window.location.href = "login.html";
    return;
  }

  const tenantId = profile.tenant_id;
  const userId = profile.id;

  const roleTag = $("roleTag");
  if (roleTag) roleTag.textContent = profile.role.toUpperCase();
  const userTag = $("userTag");
  if (userTag) userTag.textContent = profile.name || "Staff";
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => CN.signOut().catch((e) => toast(e.message || String(e), "error")));

  const state = {
    rangeDays: 1,
    items: []
  };

  const taskDetail = {
    modal: null,
    title: null,
    meta: null,
    checklist: null,
    checklistHint: null,
    refGallery: null,
    workGallery: null,
    workUploadBtn: null,
    workInput: null,
    startBtn: null,
    doneBtn: null,
    currentTask: null
  };

  const rangeToggle = $("staffRangeToggle");
  const exportBtn = $("staffExportCsv");
  const listEl = $("staffBookings") || document.body;

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toDateInputValue(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function fmtDateLabel(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
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

  function newId() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    } catch {}
    return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function fileExt(file) {
    const name = (file && file.name) ? String(file.name) : "";
    const m = name.match(/\.([a-z0-9]+)$/i);
    if (m) return `.${m[1].toLowerCase()}`;
    const type = (file && file.type) ? String(file.type) : "";
    if (type.includes("jpeg")) return ".jpg";
    if (type.includes("png")) return ".png";
    if (type.includes("webp")) return ".webp";
    return ".bin";
  }

  function buildWorkPath(taskId, file) {
    return `${tenantId}/tasks/${taskId}/work/${newId()}${fileExt(file)}`;
  }

  async function loadPropertyChecklistItems(propertyId) {
    const { data, error } = await CN.sb
      .from("property_checklist_items")
      .select("id, label, sort_order, is_active")
      .eq("property_id", propertyId)
      .eq("tenant_id", tenantId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []).filter((row) => row.is_active);
  }

  async function loadTaskChecklistItems(taskId) {
    const { data, error } = await CN.sb
      .from("task_checklist_items")
      .select("id, label, done, sort_order")
      .eq("task_id", taskId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function ensureTaskChecklist(taskId, propertyId) {
    const { data, error } = await CN.sb
      .from("task_checklist_items")
      .select("id")
      .eq("task_id", taskId)
      .limit(1);
    if (error) throw error;
    if (data && data.length) return;

    const templates = await loadPropertyChecklistItems(propertyId);
    if (!templates.length) return;

    const rows = templates.map((item, index) => ({
      tenant_id: tenantId,
      task_id: taskId,
      label: item.label,
      sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index
    }));
    const { error: insertError } = await CN.sb.from("task_checklist_items").insert(rows);
    if (insertError) throw insertError;
  }

  async function updateTaskChecklistItem(itemId, done) {
    const { error } = await CN.sb
      .from("task_checklist_items")
      .update({ done })
      .eq("id", itemId);
    if (error) throw error;
  }

  async function loadTaskDetail(taskId) {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, assigned_user_id, property_id, label_id, property:properties(address), label:task_labels(name)")
      .eq("id", taskId)
      .single();
    if (error) throw error;
    return data;
  }

  async function loadMediaLinks({ propertyId, taskId, tag } = {}) {
    let query = CN.sb
      .from("media_links")
      .select("id, tag, created_at, media:media(id, path, mime_type, created_at)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (propertyId) query = query.eq("property_id", propertyId);
    if (taskId) query = query.eq("task_id", taskId);
    if (tag) query = query.eq("tag", tag);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
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

  async function uploadMediaAndLink({ file, path, propertyId, taskId, tag }) {
    const bucket = getMediaBucket();
    const mimeType = file.type || "application/octet-stream";
    const { error: uploadError } = await CN.sb.storage.from(bucket).upload(path, file, { contentType: mimeType });
    if (uploadError) throw uploadError;

    const { data: mediaRow, error: mediaError } = await CN.sb
      .from("media")
      .insert({
        tenant_id: tenantId,
        uploader_user_id: userId,
        path,
        mime_type: mimeType
      })
      .select("id, path, mime_type, created_at")
      .single();
    if (mediaError) throw mediaError;

    const linkRow = {
      tenant_id: tenantId,
      media_id: mediaRow.id,
      tag: tag || "other"
    };
    if (propertyId) linkRow.property_id = propertyId;
    if (taskId) linkRow.task_id = taskId;

    const { data: linkData, error: linkError } = await CN.sb
      .from("media_links")
      .insert(linkRow)
      .select("id, tag, created_at")
      .single();
    if (linkError) throw linkError;

    return { ...linkData, media: mediaRow };
  }

  function renderTaskChecklist(container, items, onToggle) {
    if (!container) return { done: 0, total: 0 };
    container.innerHTML = "";
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      container.innerHTML = '<div class="small-note">No checklist items yet.</div>';
      return { done: 0, total: 0 };
    }
    let doneCount = 0;
    list.forEach((item) => {
      const row = document.createElement("div");
      row.className = "check-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(item.done);
      const label = document.createElement("label");
      label.textContent = item.label || "Checklist item";
      if (item.done) {
        doneCount += 1;
        label.classList.add("done");
      }
      input.addEventListener("change", () => {
        if (typeof onToggle === "function") {
          onToggle(item, input.checked, label, input);
        }
      });
      row.appendChild(input);
      row.appendChild(label);
      container.appendChild(row);
    });
    return { done: doneCount, total: list.length };
  }

  function closeTaskDetailModal() {
    if (taskDetail.modal) taskDetail.modal.setAttribute("hidden", "");
  }

  function ensureTaskDetailModal() {
    if (taskDetail.modal) return taskDetail;
    let modal = document.getElementById("taskDetailModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "cn-modal";
      modal.id = "taskDetailModal";
      modal.setAttribute("hidden", "");
      modal.innerHTML = `
        <div class="cn-modal__overlay" data-action="task-detail-close"></div>
        <div class="cn-modal__panel" role="dialog" aria-modal="true">
          <div class="cn-modal__head">
            <div>
              <strong id="taskDetailTitle">Task</strong>
              <div class="small-note" id="taskDetailMeta"></div>
            </div>
            <button class="btn" data-action="task-detail-close" type="button">Close</button>
          </div>
          <div class="form" style="margin-top:10px;">
            <div class="card">
              <div class="row" style="justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Checklist</h3>
                <span class="small-note" id="taskChecklistHint"></span>
              </div>
              <div class="checklist" id="taskChecklistList"></div>
            </div>
            <div class="card">
              <div class="row" style="justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Reference photos</h3>
              </div>
              <div id="taskRefGallery"></div>
            </div>
            <div class="card">
              <div class="row" style="justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Work photos</h3>
                <button class="btn btn-ref" id="taskWorkUpload" type="button">Upload work photo</button>
              </div>
              <div class="small-note" style="margin-top:6px;">Upload work photos from the job.</div>
              <div id="taskWorkGallery"></div>
            </div>
            <div class="row" style="justify-content:flex-end; gap:8px; margin-top:12px;">
              <button class="btn" id="taskStartBtn" type="button">Start</button>
              <button class="btn" id="taskDoneBtn" type="button">Done</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    taskDetail.modal = modal;
    taskDetail.title = modal.querySelector("#taskDetailTitle");
    taskDetail.meta = modal.querySelector("#taskDetailMeta");
    taskDetail.checklist = modal.querySelector("#taskChecklistList");
    taskDetail.checklistHint = modal.querySelector("#taskChecklistHint");
    taskDetail.refGallery = modal.querySelector("#taskRefGallery");
    taskDetail.workGallery = modal.querySelector("#taskWorkGallery");
    taskDetail.workUploadBtn = modal.querySelector("#taskWorkUpload");
    taskDetail.startBtn = modal.querySelector("#taskStartBtn");
    taskDetail.doneBtn = modal.querySelector("#taskDoneBtn");

    taskDetail.workInput = document.createElement("input");
    taskDetail.workInput.type = "file";
    taskDetail.workInput.accept = "image/*";
    taskDetail.workInput.multiple = true;
    taskDetail.workInput.className = "file-hidden";
    modal.appendChild(taskDetail.workInput);

    modal.addEventListener("click", (ev) => {
      if (ev.target && ev.target.dataset && ev.target.dataset.action === "task-detail-close") {
        closeTaskDetailModal();
      }
    });

    if (taskDetail.workUploadBtn) {
      taskDetail.workUploadBtn.addEventListener("click", () => {
        if (taskDetail.workInput) taskDetail.workInput.click();
      });
    }
    if (taskDetail.workInput) {
      taskDetail.workInput.addEventListener("change", () => {
        const files = Array.from(taskDetail.workInput.files || []);
        taskDetail.workInput.value = "";
        if (!files.length) return;
        handleWorkUpload(files).catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (taskDetail.startBtn) {
      taskDetail.startBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        startTask(task).catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.doneBtn) {
      taskDetail.doneBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        completeTask(task).catch((e) => toast(e.message || String(e), "error"));
      });
    }

    return taskDetail;
  }

  function updateTaskDetailActions(task) {
    if (!taskDetail.startBtn || !taskDetail.doneBtn) return;
    const closed = task.status === "done" || task.status === "canceled";
    taskDetail.startBtn.style.display = closed ? "none" : "";
    taskDetail.doneBtn.style.display = closed ? "none" : "";
  }

  async function staffStartTask(taskId) {
    const { error } = await CN.sb.rpc("staff_start_task", { p_task_id: taskId });
    if (error) throw error;
  }

  async function staffCompleteTask(taskId) {
    const { error } = await CN.sb.rpc("staff_complete_task", { p_task_id: taskId });
    if (error) throw error;
  }

  async function startTask(item) {
    await staffStartTask(item.id);
    toast("Started.", "ok");
    await refresh();
    if (taskDetail.modal && !taskDetail.modal.hasAttribute("hidden")) {
      await openTaskDetail(item.id);
    }
  }

  async function completeTask(item) {
    await staffCompleteTask(item.id);
    toast("Completed.", "ok");
    await refresh();
    const workflow = await triggerTaskCompletionWorkflow(item.id);
    if (workflow && workflow.email_sent) {
      toast("Completion email sent.", "ok");
    }
    if (taskDetail.modal && !taskDetail.modal.hasAttribute("hidden")) {
      await openTaskDetail(item.id);
    }
  }

  async function triggerTaskCompletionWorkflow(taskId) {
    if (!taskId || !CN.sb || !CN.sb.functions) return null;
    try {
      const { data, error } = await CN.sb.functions.invoke("task-completed", {
        body: { task_id: taskId }
      });
      if (error) throw error;
      return data || null;
    } catch (e) {
      toast(`Automation failed: ${e.message || String(e)}`, "error");
      return null;
    }
  }

  async function handleWorkUpload(files) {
    const task = taskDetail.currentTask;
    if (!task) return;
    for (const file of files) {
      await uploadMediaAndLink({
        file,
        path: buildWorkPath(task.id, file),
        propertyId: task.property_id,
        taskId: task.id,
        tag: "after"
      });
    }
    await openTaskDetail(task.id);
  }

  async function openTaskDetail(taskOrId) {
    const detail = ensureTaskDetailModal();
    if (!taskOrId) return;
    const task = typeof taskOrId === "string"
      ? await loadTaskDetail(taskOrId)
      : await loadTaskDetail(taskOrId.id);

    detail.currentTask = task;

    if (detail.title) {
      detail.title.textContent = task.label ? task.label.name : "Task";
    }
    if (detail.meta) {
      detail.meta.textContent = [
        task.day_date,
        fmtTimeRange(task.start_at, task.end_at, task.duration_minutes),
        task.property ? task.property.address : "Property"
      ].filter(Boolean).join(" | ");
    }

    await ensureTaskChecklist(task.id, task.property_id);
    const checklistItems = await loadTaskChecklistItems(task.id);
    const checklistStats = renderTaskChecklist(detail.checklist, checklistItems, async (item, done, labelEl, inputEl) => {
      try {
        await updateTaskChecklistItem(item.id, done);
        item.done = done;
        if (labelEl) labelEl.classList.toggle("done", done);
        const counts = checklistItems.reduce((acc, row) => {
          if (row.done) acc.done += 1;
          acc.total += 1;
          return acc;
        }, { done: 0, total: 0 });
        if (detail.checklistHint) {
          detail.checklistHint.textContent = counts.total ? `${counts.done}/${counts.total} done` : "No checklist items yet.";
        }
      } catch (e) {
        if (inputEl) inputEl.checked = !done;
        toast(e.message || String(e), "error");
      }
    });
    if (detail.checklistHint) {
      detail.checklistHint.textContent = checklistStats.total ? `${checklistStats.done}/${checklistStats.total} done` : "No checklist items yet.";
    }

    const [refRaw, workRaw] = await Promise.all([
      loadMediaLinks({ propertyId: task.property_id, tag: "reference" }),
      loadMediaLinks({ taskId: task.id })
    ]);
    const refItems = await attachSignedUrls(refRaw);
    const workItems = await attachSignedUrls(workRaw);
    renderGallery(detail.refGallery, refItems);
    renderGallery(detail.workGallery, workItems);

    updateTaskDetailActions(task);
    detail.modal.removeAttribute("hidden");
  }

  function statusBadge(status) {
    if (status === "in_progress") return { label: "In progress", className: "in_progress" };
    if (status === "done") return { label: "Completed", className: "completed" };
    if (status === "canceled") return { label: "Cancelled", className: "cancelled" };
    return { label: "Scheduled", className: "scheduled" };
  }

  function csvEscape(value) {
    const s = value == null ? "" : String(value);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
    return s;
  }

  function downloadCsv(filename, headers, rows) {
    const lines = [headers.map(csvEscape).join(",")];
    rows.forEach((row) => {
      lines.push(row.map(csvEscape).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function loadTasks(startDate, endDate) {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, property_id, label_id, property:properties(address), label:task_labels(name)")
      .eq("assigned_user_id", profile.id)
      .gte("day_date", toDateInputValue(startDate))
      .lte("day_date", toDateInputValue(endDate))
      .order("day_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function loadActivities(startDate, endDate) {
    const { data, error } = await CN.sb
      .from("activities")
      .select("id, day_date, status, duration_minutes, start_at, notes, type_name_snapshot, property:properties(address)")
      .eq("assigned_user_id", profile.id)
      .gte("day_date", toDateInputValue(startDate))
      .lte("day_date", toDateInputValue(endDate))
      .order("day_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  function normalizeItems(tasks, activities) {
    const items = [];
    tasks.forEach((task) => {
      items.push({
        kind: "task",
        id: task.id,
        property_id: task.property_id,
        label_id: task.label_id,
        day_date: task.day_date,
        start_at: task.start_at,
        end_at: task.end_at,
        duration_minutes: task.duration_minutes,
        status: task.status,
        title: task.label ? task.label.name : "Task",
        subtitle: task.property ? task.property.address : "Property",
        notes: task.notes || ""
      });
    });
    activities.forEach((activity) => {
      items.push({
        kind: "activity",
        id: activity.id,
        day_date: activity.day_date,
        start_at: activity.start_at,
        end_at: null,
        duration_minutes: activity.duration_minutes,
        status: activity.status,
        title: activity.type_name_snapshot || "Activity",
        subtitle: activity.property ? activity.property.address : "No property",
        notes: activity.notes || ""
      });
    });
    items.sort((a, b) => {
      if (a.day_date !== b.day_date) return a.day_date.localeCompare(b.day_date);
      const at = a.start_at || "";
      const bt = b.start_at || "";
      return at.localeCompare(bt);
    });
    return items;
  }

  function render(items) {
    if (!listEl) return;
    listEl.innerHTML = "";
    if (!items.length) {
      listEl.innerHTML = '<div class="empty-state"><div class="empty-state__msg">No assigned items in this range.</div></div>';
      return;
    }
    const list = document.createElement("div");
    list.className = "booking-list";

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "booking-card";

      const top = document.createElement("div");
      top.className = "booking-top";
      const when = document.createElement("div");
      when.className = "booking-when";
      const dateEl = document.createElement("div");
      dateEl.className = "booking-date";
      dateEl.textContent = item.day_date;
      const timeEl = document.createElement("div");
      timeEl.className = "small-muted";
      timeEl.textContent = fmtTimeRange(item.start_at, item.end_at, item.duration_minutes);
      when.appendChild(dateEl);
      when.appendChild(timeEl);

      const main = document.createElement("div");
      main.className = "booking-main";
      const title = document.createElement("div");
      title.className = "booking-title";
      title.textContent = item.title;
      const sub = document.createElement("div");
      sub.className = "small-muted";
      sub.textContent = item.subtitle;
      main.appendChild(title);
      main.appendChild(sub);

      const status = document.createElement("div");
      status.className = "booking-status";
      const badge = statusBadge(item.status);
      const badgeEl = document.createElement("span");
      badgeEl.className = `badge ${badge.className}`;
      badgeEl.textContent = badge.label;
      status.appendChild(badgeEl);

      top.appendChild(when);
      top.appendChild(main);
      top.appendChild(status);
      card.appendChild(top);

      if (item.notes) {
        const details = document.createElement("div");
        details.className = "booking-details";
        const notes = document.createElement("div");
        notes.className = "booking-notes";
        notes.textContent = item.notes;
        details.appendChild(notes);
        card.appendChild(details);
      }

      const actions = document.createElement("div");
      actions.className = "booking-actions";
      if (item.kind === "task") {
        const detailBtn = document.createElement("button");
        detailBtn.className = "btn";
        detailBtn.type = "button";
        detailBtn.textContent = "Details";
        detailBtn.addEventListener("click", () => {
          openTaskDetail(item).catch((e) => toast(e.message || String(e), "error"));
        });
        actions.appendChild(detailBtn);
      }
      if (item.kind === "task" && item.status !== "done" && item.status !== "canceled") {
        const startBtn = document.createElement("button");
        startBtn.className = "btn";
        startBtn.type = "button";
        startBtn.textContent = "Start";
        startBtn.addEventListener("click", () => startTask(item).catch((e) => toast(e.message || String(e), "error")));
        const doneBtn = document.createElement("button");
        doneBtn.className = "btn";
        doneBtn.type = "button";
        doneBtn.textContent = "Done";
        doneBtn.addEventListener("click", () => completeTask(item).catch((e) => toast(e.message || String(e), "error")));
        actions.appendChild(startBtn);
        actions.appendChild(doneBtn);
      }
      if (actions.children.length) {
        card.appendChild(actions);
      }
      list.appendChild(card);
    });

    listEl.appendChild(list);
  }

  async function refresh() {
    const startDate = new Date();
    const endDate = addDays(startDate, state.rangeDays - 1);
    try {
      const [tasks, activities] = await Promise.all([
        loadTasks(startDate, endDate),
        loadActivities(startDate, endDate)
      ]);
      state.items = normalizeItems(tasks, activities);
      render(state.items);
    } catch (e) {
      toast(e.message || String(e), "error");
    }
  }

  if (rangeToggle) {
    rangeToggle.querySelectorAll("[data-range]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const range = Number(btn.getAttribute("data-range"));
        state.rangeDays = range;
        rangeToggle.querySelectorAll("[data-range]").forEach((el) => {
          el.classList.toggle("is-active", el.getAttribute("data-range") === String(range));
        });
        refresh();
      });
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = state.items.map((item) => ([
        item.day_date,
        fmtTimeRange(item.start_at, item.end_at, item.duration_minutes),
        item.kind,
        item.title,
        item.subtitle,
        item.status
      ]));
      downloadCsv("staff-timeline.csv", ["Date", "Time", "Type", "Title", "Location", "Status"], rows);
    });
  }

  refresh();
})();
