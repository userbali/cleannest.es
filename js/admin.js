/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;
  let profile;
  let tenantId;
  let userId;

  const MODULE_DEFS = [
    { key: "properties", label: "Properties" },
    { key: "timeline", label: "Timeline" },
    { key: "schedule", label: "Schedule" },
    { key: "activities", label: "Activities" },
    { key: "invoices", label: "Invoices" },
    { key: "modules", label: "Modules" }
  ];

  const STATUS_SCHEDULED = ["planned", "assigned", "offered"];

  const state = {
    clients: [],
    staff: [],
    properties: [],
    propertyStaff: [],
    taskLabels: [],
    tasksCache: [],
    activityTypes: [],
    modules: {},
    invoices: [],
    selectedInvoiceId: null,
    invoiceIssuerText: "",
    selectedPropertyId: null,
    activeTab: "properties",
    timeline: {
      month: "",
      metric: "jobs",
      selectedDate: null,
      selectedPropertyId: null,
      staffTouched: false,
      activities: []
    },
    schedule: {
      month: "",
      status: "all",
      staffId: "",
      unassignedOnly: false
    },
    activities: {
      month: ""
    }
  };

  const taskDetail = {
    modal: null,
    title: null,
    meta: null,
    checklist: null,
    checklistHint: null,
    refGallery: null,
    workGallery: null,
    refUploadBtn: null,
    workUploadBtn: null,
    refInput: null,
    workInput: null,
    startBtn: null,
    doneBtn: null,
    cancelBtn: null,
    reopenBtn: null,
    priceInput: null,
    priceSaveBtn: null,
    priceMeta: null,
    addOnList: null,
    addOnLabel: null,
    addOnAmount: null,
    addOnAddBtn: null,
    addOnTotal: null,
    currentTask: null
  };

  const els = {
    roleTag: $("roleTag"),
    userTag: $("userTag"),
    logoutBtn: $("logoutBtn"),
    adminTabs: $("adminTabs"),
    adminTabProperties: $("adminTabProperties"),
    adminTabTimeline: $("adminTabTimeline"),
    adminTabSchedule: $("adminTabSchedule"),
    adminTabActivities: $("adminTabActivities"),
    adminTabInvoices: $("adminTabInvoices"),
    adminTabModules: $("adminTabModules"),
    adminSearch: $("adminSearch"),
    filterActiveSession: $("filterActiveSession"),
    filterNeedsAttention: $("filterNeedsAttention"),
    adminSort: $("adminSort"),
    adminClientsList: $("adminClientsList"),
    adminPropDetail: $("adminPropDetail"),
    timelineMonthLabel: $("timelineMonthLabel"),
    timelineMonth: $("timelineMonth"),
    timelineExportCsv: $("timelineExportCsv"),
    timelinePrint: $("timelinePrint"),
    timelineJumpToday: $("timelineJumpToday"),
    timelineHeatmap: $("timelineHeatmap"),
    timelineDays: $("timelineDays"),
    timelineAddModal: $("timelineAddModal"),
    timelineAddOwner: $("timelineAddOwner"),
    timelineAddProperty: $("timelineAddProperty"),
    timelineAddSearch: $("timelineAddSearch"),
    timelineAddActivityType: $("timelineAddActivityType"),
    timelineAddStaff: $("timelineAddStaff"),
    timelineAddTime: $("timelineAddTime"),
    timelineAddDuration: $("timelineAddDuration"),
    timelineAddTbd: $("timelineAddTbd"),
    timelineAddNotes: $("timelineAddNotes"),
    timelineAddSave: $("timelineAddSave"),
    timelineAddHint: $("timelineAddHint"),
    timelineAddTitle: $("timelineAddTitle"),
    scheduleMonth: $("scheduleMonth"),
    scheduleStatus: $("scheduleStatus"),
    scheduleStaff: $("scheduleStaff"),
    scheduleUnassignedOnly: $("scheduleUnassignedOnly"),
    scheduleResetFilters: $("scheduleResetFilters"),
    scheduleExportCsv: $("scheduleExportCsv"),
    schedulePrint: $("schedulePrint"),
    scheduleList: $("scheduleList"),
    activitiesMonth: $("activitiesMonth"),
    activityNewBtn: $("activityNewBtn"),
    activityTypeNewBtn: $("activityTypeNewBtn"),
    activitiesPanel: $("activitiesPanel"),
    activityTypeModal: $("activityTypeModal"),
    activityTypeName: $("activityTypeName"),
    activityTypeDefaultDuration: $("activityTypeDefaultDuration"),
    activityTypeSave: $("activityTypeSave"),
    activityModal: $("activityModal"),
    activityModalTitle: $("activityModalTitle"),
    activityModalHint: $("activityModalHint"),
    activityTypeSelect: $("activityTypeSelect"),
    activityCustomName: $("activityCustomName"),
    activityDate: $("activityDate"),
    activityTimeFrom: $("activityTimeFrom"),
    activityDuration: $("activityDuration"),
    activityStaff: $("activityStaff"),
    activityProperty: $("activityProperty"),
    activityNotes: $("activityNotes"),
    activityTypeColorPalette: $("activityTypeColorPalette"),
    activitySave: $("activitySave"),
    modulesList: $("modulesList"),
    adminToolsBtn: $("adminToolsBtn"),
    adminToolsDrawer: $("adminToolsDrawer"),
    adminAlert: $("adminAlert"),
    addClientName: $("addClientName"),
    addClientPhone: $("addClientPhone"),
    addClientEmail: $("addClientEmail"),
    addClientPassword: $("addClientPassword"),
    addClientBtn: $("addClientBtn"),
    removeClientSelect: $("removeClientSelect"),
    addStaffName: $("addStaffName"),
    addStaffEmail: $("addStaffEmail"),
    addStaffPassword: $("addStaffPassword"),
    addStaffBtn: $("addStaffBtn"),
    removeClientBtn: $("removeClientBtn"),
    removeStaffSelect: $("removeStaffSelect"),
    removeStaffBtn: $("removeStaffBtn"),
    exportBackupBtn: $("exportBackupBtn"),
    importBackupBtn: $("importBackupBtn"),
    importBackupFile: $("importBackupFile"),
    backupHint: $("backupHint"),
    storageRefreshBtn: $("storageRefreshBtn"),
    storageCleanupBtn: $("storageCleanupBtn"),
    storageFill: $("storageFill"),
    storageText: $("storageText"),
    auditDownloadCsv: $("auditDownloadCsv"),
    auditDownloadJson: $("auditDownloadJson"),
    auditLogHint: $("auditLogHint"),
    invoiceIssueDate: $("invoiceIssueDate"),
    invoiceNumber: $("invoiceNumber"),
    invoiceCustomerName: $("invoiceCustomerName"),
    invoiceCustomerEmail: $("invoiceCustomerEmail"),
    invoiceCustomerTaxId: $("invoiceCustomerTaxId"),
    invoiceCustomerCountry: $("invoiceCustomerCountry"),
    invoiceCustomerAddress: $("invoiceCustomerAddress"),
    invoiceTotal: $("invoiceTotal"),
    invoiceItems: $("invoiceItems"),
    invoiceAddItemBtn: $("invoiceAddItemBtn"),
    invoiceSaveBtn: $("invoiceSaveBtn"),
    invoiceClearBtn: $("invoiceClearBtn"),
    invoiceList: $("invoiceList"),
    invoicePreview: $("invoicePreview"),
    invoicePrintArea: $("invoicePrintArea"),
    invoiceSettingsBtn: $("invoiceSettingsBtn"),
    invoiceSettingsModal: $("invoiceSettingsModal"),
    invoiceIssuerText: $("invoiceIssuerText"),
    invoiceSettingsSave: $("invoiceSettingsSave")
  };

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function getSupabaseConfig() {
    const cfg = window.CN_CONFIG || {};
    const url = (cfg.SUPABASE_URL || "").trim();
    const key = (cfg.SUPABASE_ANON_KEY || "").trim();
    if (!url || !key) {
      throw new Error("Supabase config missing. Check config.js.");
    }
    return { url, key };
  }

  function toDateInputValue(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function toMonthInputValue(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }

  function fromMonthInputValue(value) {
    if (!value) return null;
    const [y, m] = value.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }

  function normalizeHexColor(value) {
    if (!value) return "";
    let val = String(value).trim();
    if (!val) return "";
    if (!val.startsWith("#")) val = `#${val}`;
    if (/^#[0-9a-f]{3}$/i.test(val)) {
      val = `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
    }
    if (!/^#[0-9a-f]{6}$/i.test(val)) return "";
    return val.toLowerCase();
  }

  function applyActivityColor(el, color) {
    if (!el) return;
    const normalized = normalizeHexColor(color);
    if (!normalized) return;
    el.classList.add("has-activity-color");
    el.style.setProperty("--activity-color", normalized);
  }

  function getSelectedPaletteColor(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function resetPaletteSelection(name) {
    const inputs = document.querySelectorAll(`input[name="${name}"]`);
    if (!inputs.length) return;
    inputs.forEach((input, idx) => {
      input.checked = idx === 0;
    });
  }

  function getActivityColor(activity) {
    if (activity && activity.color) return activity.color;
    if (activity && activity.type_id) {
      const type = state.activityTypes.find((t) => t.id === activity.type_id);
      return type && type.color ? type.color : "";
    }
    return "";
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function isSameDay(a, b) {
    return toDateInputValue(a) === toDateInputValue(b);
  }

  function fmtDateLabel(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  }

  function fmtMonthLabel(date) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  }

  function fmtTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
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

  function parseAmount(value) {
    if (value == null) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    const num = Number(raw.replace(",", "."));
    if (!Number.isFinite(num)) return null;
    return num;
  }

  function formatAmount(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0.00";
    return num.toFixed(2);
  }

  function normalizeAddOns(list) {
    return (Array.isArray(list) ? list : []).map((row) => {
      const label = String(row && row.label ? row.label : "").trim();
      const amount = parseAmount(row && row.amount != null ? row.amount : "");
      if (!label) return null;
      return { label, amount: Number.isFinite(amount) ? amount : 0 };
    }).filter(Boolean);
  }

  function sumAddOns(list) {
    return (Array.isArray(list) ? list : []).reduce((total, row) => {
      const val = Number(row && row.amount);
      return total + (Number.isFinite(val) ? val : 0);
    }, 0);
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

  function buildReferencePath(propertyId, file) {
    return `${tenantId}/properties/${propertyId}/reference/${newId()}${fileExt(file)}`;
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

  async function addPropertyChecklistItem(propertyId, label, sortOrder) {
    const { error } = await CN.sb.from("property_checklist_items").insert({
      tenant_id: tenantId,
      property_id: propertyId,
      label,
      sort_order: sortOrder
    });
    if (error) throw error;
  }

  async function deletePropertyChecklistItem(itemId) {
    const { error } = await CN.sb
      .from("property_checklist_items")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
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
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, price, add_ons, assigned_user_id, property_id, label_id, property:properties(address)")
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

  function renderGallery(container, items, options) {
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

      if (options && options.canDelete && typeof options.onDelete === "function") {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "photo-del";
        del.textContent = "Delete";
        del.addEventListener("click", (ev) => {
          ev.stopPropagation();
          options.onDelete(item);
        });
        shot.appendChild(del);
      }
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

  async function deleteMediaItem(item) {
    if (!item || !item.media) return;
    const bucket = getMediaBucket();
    const path = item.media.path;
    if (path) {
      const { error: storageError } = await CN.sb.storage.from(bucket).remove([path]);
      if (storageError) throw storageError;
    }
    const { error } = await CN.sb.from("media").delete().eq("id", item.media.id);
    if (error) throw error;
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

  function renderTaskAddOns(addOns) {
    if (!taskDetail.addOnList) return;
    const list = Array.isArray(addOns) ? addOns : [];
    taskDetail.addOnList.innerHTML = "";
    if (!list.length) {
      taskDetail.addOnList.innerHTML = '<div class="small-note">No extras added.</div>';
      return;
    }
    list.forEach((addon, idx) => {
      const row = document.createElement("div");
      row.className = "cn-addon-row";
      const info = document.createElement("div");
      const label = document.createElement("strong");
      label.textContent = addon.label || "Extra";
      const amount = document.createElement("span");
      amount.className = "small-note";
      amount.textContent = `+${formatAmount(addon.amount)} EUR`;
      info.appendChild(label);
      info.appendChild(document.createTextNode(" "));
      info.appendChild(amount);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-danger";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        const updated = normalizeAddOns(task.add_ons);
        if (idx < 0 || idx >= updated.length) return;
        updated.splice(idx, 1);
        updateTask(task.id, { add_ons: updated })
          .then(() => {
            task.add_ons = updated;
            renderTaskPricing(task, getPropertyById(task.property_id), { keepPriceInput: true });
            toast("Extra removed.", "ok");
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });

      row.appendChild(info);
      row.appendChild(removeBtn);
      taskDetail.addOnList.appendChild(row);
    });
  }

  function renderTaskPricing(task, property, options) {
    if (!task) return;
    const keepInput = options && options.keepPriceInput;
    const propPrice = parseAmount(property && property.price);
    const taskPrice = parseAmount(task.price);
    const basePrice = Number.isFinite(taskPrice) ? taskPrice : (Number.isFinite(propPrice) ? propPrice : null);

    if (taskDetail.priceInput && !keepInput) {
      taskDetail.priceInput.value = basePrice != null ? formatAmount(basePrice) : "";
    }

    const addOns = normalizeAddOns(task.add_ons);
    task.add_ons = addOns;
    renderTaskAddOns(addOns);

    if (taskDetail.priceMeta) {
      if (Number.isFinite(taskPrice)) {
        taskDetail.priceMeta.textContent = `Saved price: ${formatAmount(taskPrice)} EUR.`;
      } else if (Number.isFinite(propPrice)) {
        taskDetail.priceMeta.textContent = `Property price: ${formatAmount(propPrice)} EUR (save to snapshot).`;
      } else {
        taskDetail.priceMeta.textContent = "No property price set.";
      }
    }

    if (taskDetail.addOnTotal) {
      const extras = sumAddOns(addOns);
      const parts = [`Extras total: ${formatAmount(extras)} EUR`];
      if (Number.isFinite(basePrice)) {
        parts.push(`Booking total: ${formatAmount(basePrice + extras)} EUR`);
      }
      taskDetail.addOnTotal.textContent = parts.join(" | ");
    }
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
                <h3 style="margin:0;">Pricing</h3>
                <span class="small-note" id="taskPriceMeta"></span>
              </div>
              <div style="margin-top:8px;">
                <div class="label">Base price (per cleaning)</div>
                <div class="row" style="gap:8px; align-items:center; flex-wrap:wrap;">
                  <input class="input" id="taskPriceInput" type="number" step="0.01" min="0" placeholder="0.00"/>
                  <button class="btn btn-primary" id="taskPriceSave" type="button">Save price</button>
                </div>
                <div class="label" style="margin-top:12px;">Extra services (optional)</div>
                <div id="taskAddOnsList" class="cn-addon-list"></div>
                <div class="row-2" style="margin-top:8px;">
                  <input class="input" id="taskAddOnLabel" placeholder="e.g. Deep clean"/>
                  <input class="input" id="taskAddOnAmount" type="number" step="0.01" placeholder="20.00"/>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; flex-wrap:wrap;">
                  <button class="btn" id="taskAddOnAdd" type="button">+ Add extra</button>
                  <div class="small-note" id="taskAddOnTotal"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="row" style="justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Reference photos</h3>
                <button class="btn btn-ref" id="taskRefUpload" type="button">Upload reference</button>
              </div>
              <div id="taskRefGallery"></div>
            </div>
            <div class="card">
              <div class="row" style="justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">Work photos</h3>
                <button class="btn btn-ref" id="taskWorkUpload" type="button">Upload work photo</button>
              </div>
              <div class="small-note" style="margin-top:6px;">At least one work photo is required to complete.</div>
              <div id="taskWorkGallery"></div>
            </div>
            <div class="row" style="justify-content:flex-end; gap:8px; margin-top:12px;">
              <button class="btn" id="taskStartBtn" type="button">Start</button>
              <button class="btn" id="taskDoneBtn" type="button">Done</button>
              <button class="btn" id="taskCancelBtn" type="button">Cancel</button>
              <button class="btn" id="taskReopenBtn" type="button">Reopen</button>
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
    taskDetail.refUploadBtn = modal.querySelector("#taskRefUpload");
    taskDetail.workUploadBtn = modal.querySelector("#taskWorkUpload");
    taskDetail.startBtn = modal.querySelector("#taskStartBtn");
    taskDetail.doneBtn = modal.querySelector("#taskDoneBtn");
    taskDetail.cancelBtn = modal.querySelector("#taskCancelBtn");
    taskDetail.reopenBtn = modal.querySelector("#taskReopenBtn");
    taskDetail.priceInput = modal.querySelector("#taskPriceInput");
    taskDetail.priceSaveBtn = modal.querySelector("#taskPriceSave");
    taskDetail.priceMeta = modal.querySelector("#taskPriceMeta");
    taskDetail.addOnList = modal.querySelector("#taskAddOnsList");
    taskDetail.addOnLabel = modal.querySelector("#taskAddOnLabel");
    taskDetail.addOnAmount = modal.querySelector("#taskAddOnAmount");
    taskDetail.addOnAddBtn = modal.querySelector("#taskAddOnAdd");
    taskDetail.addOnTotal = modal.querySelector("#taskAddOnTotal");

    taskDetail.refInput = document.createElement("input");
    taskDetail.refInput.type = "file";
    taskDetail.refInput.accept = "image/*";
    taskDetail.refInput.multiple = true;
    taskDetail.refInput.className = "file-hidden";
    modal.appendChild(taskDetail.refInput);

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

    if (taskDetail.refUploadBtn) {
      taskDetail.refUploadBtn.addEventListener("click", () => {
        if (taskDetail.refInput) taskDetail.refInput.click();
      });
    }
    if (taskDetail.workUploadBtn) {
      taskDetail.workUploadBtn.addEventListener("click", () => {
        if (taskDetail.workInput) taskDetail.workInput.click();
      });
    }
    if (taskDetail.refInput) {
      taskDetail.refInput.addEventListener("change", () => {
        const files = Array.from(taskDetail.refInput.files || []);
        taskDetail.refInput.value = "";
        if (!files.length) return;
        handleReferenceUpload(files).catch((e) => toast(e.message || String(e), "error"));
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
        updateTask(task.id, { status: "in_progress", started_at: new Date().toISOString() })
          .then(async () => {
            await refreshTaskViews();
            await openTaskDetail(task.id);
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.doneBtn) {
      taskDetail.doneBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        attemptCompleteTask(task).catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.cancelBtn) {
      taskDetail.cancelBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        updateTask(task.id, { status: "canceled" })
          .then(async () => {
            await refreshTaskViews();
            await openTaskDetail(task.id);
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.reopenBtn) {
      taskDetail.reopenBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        updateTask(task.id, { status: "planned", started_at: null, completed_at: null })
          .then(async () => {
            await refreshTaskViews();
            await openTaskDetail(task.id);
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (taskDetail.priceSaveBtn) {
      taskDetail.priceSaveBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        const raw = taskDetail.priceInput ? taskDetail.priceInput.value.trim() : "";
        let nextPrice = null;
        if (raw) {
          const parsed = parseAmount(raw);
          if (!Number.isFinite(parsed) || parsed < 0) {
            toast("Enter a valid price.", "error");
            return;
          }
          nextPrice = parsed;
        }
        updateTask(task.id, { price: nextPrice })
          .then(() => {
            task.price = nextPrice;
            renderTaskPricing(task, getPropertyById(task.property_id), { keepPriceInput: false });
            toast("Price saved.", "ok");
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (taskDetail.priceInput) {
      taskDetail.priceInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && taskDetail.priceSaveBtn) {
          taskDetail.priceSaveBtn.click();
        }
      });
    }

    if (taskDetail.addOnAddBtn) {
      taskDetail.addOnAddBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        const label = (taskDetail.addOnLabel ? taskDetail.addOnLabel.value : "").trim();
        const amountRaw = (taskDetail.addOnAmount ? taskDetail.addOnAmount.value : "").trim();
        if (!label) {
          toast("Enter an extra service name.", "error");
          return;
        }
        const parsed = parseAmount(amountRaw);
        if (!Number.isFinite(parsed) || parsed < 0) {
          toast("Enter a valid amount.", "error");
          return;
        }
        const list = normalizeAddOns(task.add_ons);
        list.push({ label, amount: parsed });
        updateTask(task.id, { add_ons: list })
          .then(() => {
            task.add_ons = list;
            if (taskDetail.addOnLabel) taskDetail.addOnLabel.value = "";
            if (taskDetail.addOnAmount) taskDetail.addOnAmount.value = "";
            renderTaskPricing(task, getPropertyById(task.property_id), { keepPriceInput: true });
            toast("Extra added.", "ok");
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (taskDetail.addOnLabel) {
      taskDetail.addOnLabel.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && taskDetail.addOnAddBtn) {
          taskDetail.addOnAddBtn.click();
        }
      });
    }
    if (taskDetail.addOnAmount) {
      taskDetail.addOnAmount.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && taskDetail.addOnAddBtn) {
          taskDetail.addOnAddBtn.click();
        }
      });
    }

    return taskDetail;
  }

  function updateTaskDetailActions(task) {
    if (!taskDetail.startBtn || !taskDetail.doneBtn || !taskDetail.cancelBtn || !taskDetail.reopenBtn) return;
    const closed = task.status === "done" || task.status === "canceled";
    taskDetail.startBtn.style.display = closed ? "none" : "";
    taskDetail.doneBtn.style.display = closed ? "none" : "";
    taskDetail.cancelBtn.style.display = closed ? "none" : "";
    taskDetail.reopenBtn.style.display = closed ? "" : "none";
  }

  async function handleReferenceUpload(files) {
    const task = taskDetail.currentTask;
    if (!task || !task.property_id) return;
    for (const file of files) {
      await uploadMediaAndLink({
        file,
        path: buildReferencePath(task.property_id, file),
        propertyId: task.property_id,
        tag: "reference"
      });
    }
    await openTaskDetail(task.id);
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

    const prop = getPropertyById(task.property_id) || task.property;
    const label = getLabelById(task.label_id);
    if (detail.title) {
      detail.title.textContent = `${label ? label.name : "Task"} • ${prop ? prop.address : "Property"}`;
    }
    if (detail.meta) {
      detail.meta.textContent = [
        task.day_date,
        fmtTimeRange(task.start_at, task.end_at, task.duration_minutes),
        task.assigned_user_id ? getStaffName(task.assigned_user_id) : "Unassigned"
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

    if (taskDetail.addOnLabel) taskDetail.addOnLabel.value = "";
    if (taskDetail.addOnAmount) taskDetail.addOnAmount.value = "";
    renderTaskPricing(task, prop);

    const [refRaw, workRaw] = await Promise.all([
      loadMediaLinks({ propertyId: task.property_id, tag: "reference" }),
      loadMediaLinks({ taskId: task.id })
    ]);
    const refItems = await attachSignedUrls(refRaw);
    const workItems = await attachSignedUrls(workRaw);

    renderGallery(detail.refGallery, refItems, {
      canDelete: true,
      onDelete: async (item) => {
        if (!window.confirm("Delete this photo?")) return;
        try {
          await deleteMediaItem(item);
          await openTaskDetail(task.id);
        } catch (e) {
          toast(e.message || String(e), "error");
        }
      }
    });
    renderGallery(detail.workGallery, workItems, {
      canDelete: true,
      onDelete: async (item) => {
        if (!window.confirm("Delete this photo?")) return;
        try {
          await deleteMediaItem(item);
          await openTaskDetail(task.id);
        } catch (e) {
          toast(e.message || String(e), "error");
        }
      }
    });

    updateTaskDetailActions(task);
    detail.modal.removeAttribute("hidden");
  }

  async function canCompleteTask(task) {
    if (!task) return { ok: false, reason: "Task not found." };
    await ensureTaskChecklist(task.id, task.property_id);
    const checklist = await loadTaskChecklistItems(task.id);
    const remaining = checklist.filter((item) => !item.done).length;
    if (remaining) {
      return { ok: false, reason: `Checklist incomplete (${remaining} items).` };
    }
    const workMedia = await loadMediaLinks({ taskId: task.id });
    if (!workMedia.length) {
      return { ok: false, reason: "Add at least one work photo before completing." };
    }
    return { ok: true };
  }

  async function attemptCompleteTask(task) {
    const check = await canCompleteTask(task);
    if (!check.ok) {
      toast(check.reason, "error");
      await openTaskDetail(task);
      return false;
    }
    await updateTask(task.id, { status: "done", completed_at: new Date().toISOString() });
    toast("Task completed.", "ok");
    await refreshTaskViews();
    if (taskDetail.modal && !taskDetail.modal.hasAttribute("hidden")) {
      await openTaskDetail(task.id);
    }
    return true;
  }

  function statusBadge(status) {
    if (status === "in_progress") return { label: "In progress", className: "in_progress" };
    if (status === "done") return { label: "Completed", className: "completed" };
    if (status === "canceled") return { label: "Cancelled", className: "cancelled" };
    return { label: "Scheduled", className: "scheduled" };
  }

  function setActiveToggle(container, attr, value) {
    if (!container) return;
    container.querySelectorAll("[data-" + attr + "]").forEach((btn) => {
      const isActive = btn.getAttribute("data-" + attr) === String(value);
      btn.classList.toggle("is-active", isActive);
    });
  }

  function csvEscape(value) {
    const s = value == null ? "" : String(value);
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, "\"\"")}"`;
    }
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

  function groupBy(list, keyFn) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyFn(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }

  function getStaffName(id) {
    const staff = state.staff.find((s) => s.id === id);
    return staff ? staff.name || "Staff" : "Unassigned";
  }

  function getPropertyById(id) {
    return state.properties.find((p) => p.id === id);
  }

  function getLabelById(id) {
    return state.taskLabels.find((l) => l.id === id);
  }

  function findDefaultLabelId() {
    const cleaning = state.taskLabels.find((l) => (l.name || "").toLowerCase() === "cleaning");
    return cleaning ? cleaning.id : (state.taskLabels[0] ? state.taskLabels[0].id : null);
  }

  async function requireAdminProfile() {
    profile = await CN.getProfile();
    if (!profile || profile.role !== "admin") {
      toast("Access denied (admin only).", "error");
      window.location.href = "login.html";
      throw new Error("Access denied");
    }
    tenantId = profile.tenant_id;
    userId = profile.id;
  }

  async function loadProfiles() {
    const { data, error } = await CN.sb
      .from("profiles")
      .select("id, name, email, phone, role, is_active")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });
    if (error) throw error;
    const list = data || [];
    state.clients = list.filter((p) => p.role === "client");
    state.staff = list.filter((p) => p.role === "staff");
  }

  async function loadProperties() {
    const { data, error } = await CN.sb
      .from("properties")
      .select("id, owner_user_id, address, ownership_type, price, notes, created_at, owner:profiles(id, name, email, phone)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    state.properties = data || [];
  }

  async function loadPropertyStaff() {
    const { data, error } = await CN.sb
      .from("property_staff")
      .select("property_id, staff_user_id")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    state.propertyStaff = data || [];
  }

  async function loadTaskLabels() {
    const { data, error } = await CN.sb
      .from("task_labels")
      .select("id, name")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });
    if (error) throw error;
    state.taskLabels = data || [];
  }

  async function loadModules() {
    const { data, error } = await CN.sb
      .from("tenant_modules")
      .select("module_key, is_enabled")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    const modules = {};
    (data || []).forEach((row) => {
      modules[row.module_key] = row.is_enabled;
    });
    state.modules = modules;
  }

  async function seedMissingModules() {
    const missing = MODULE_DEFS.filter((mod) => !(mod.key in state.modules));
    if (!missing.length) return;
    const rows = missing.map((mod) => ({
      tenant_id: tenantId,
      module_key: mod.key,
      is_enabled: true
    }));
    const { error } = await CN.sb.from("tenant_modules").insert(rows);
    if (error) throw error;
    await loadModules();
  }

  async function loadTasksCache() {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, property_id, assigned_user_id")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    state.tasksCache = data || [];
  }

  async function loadActivityTypes() {
    const { data, error } = await CN.sb
      .from("activity_types")
      .select("id, name, default_duration_minutes, is_archived, color")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });
    if (error) throw error;
    state.activityTypes = (data || []).filter((t) => !t.is_archived);
  }

  async function refreshBaseData() {
    await loadProfiles();
    await loadProperties();
    await loadPropertyStaff();
    await loadTaskLabels();
    try {
      await loadModules();
      await seedMissingModules();
    } catch (e) {
      state.modules = {};
      toast("Modules could not load. Check permissions.", "error");
    }
    state.modules.modules = true;
    await loadTasksCache();
    try {
      await loadActivityTypes();
    } catch (e) {
      state.activityTypes = [];
      toast("Activity types could not load. Check permissions.", "error");
    }
  }

  function buildPropertyStats() {
    const staffCount = new Map();
    state.propertyStaff.forEach((row) => {
      staffCount.set(row.property_id, (staffCount.get(row.property_id) || 0) + 1);
    });

    const lastDone = new Map();
    const active = new Set();
    state.tasksCache.forEach((task) => {
      if (task.status === "done") {
        const prev = lastDone.get(task.property_id);
        if (!prev || task.day_date > prev) lastDone.set(task.property_id, task.day_date);
      }
      if (task.status === "in_progress") active.add(task.property_id);
    });

    const needsAttention = new Set();
    const now = new Date();
    const staleMs = 14 * 24 * 60 * 60 * 1000;
    state.properties.forEach((prop) => {
      const lastStr = lastDone.get(prop.id);
      const lastDate = lastStr ? new Date(lastStr + "T00:00:00") : null;
      const noStaff = (staffCount.get(prop.id) || 0) === 0;
      const stale = !lastDate || (now - lastDate) > staleMs;
      if (active.has(prop.id) || noStaff || stale) {
        needsAttention.add(prop.id);
      }
    });

    return { staffCount, lastDone, active, needsAttention };
  }

  function clientMatchesQuery(client, query) {
    if (!query) return true;
    const hay = [
      client?.name,
      client?.email,
      client?.phone
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function propertyMatchesSearch(prop, client, query) {
    if (!query) return true;
    const hay = [
      prop.address,
      prop.notes,
      client?.name,
      client?.email,
      client?.phone
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function sortProperties(props, stats) {
    const mode = els.adminSort ? els.adminSort.value : "due";
    if (mode === "az") {
      return props.sort((a, b) => (a.address || "").localeCompare(b.address || ""));
    }
    if (mode === "recent") {
      return props.sort((a, b) => {
        const aDate = stats.lastDone.get(a.id) || "0000-00-00";
        const bDate = stats.lastDone.get(b.id) || "0000-00-00";
        return bDate.localeCompare(aDate);
      });
    }
    return props.sort((a, b) => {
      const aDate = stats.lastDone.get(a.id) || "0000-00-00";
      const bDate = stats.lastDone.get(b.id) || "0000-00-00";
      return aDate.localeCompare(bDate);
    });
  }

  function renderClientsList() {
    if (!els.adminClientsList) return;
    const stats = buildPropertyStats();
    const query = (els.adminSearch ? els.adminSearch.value : "").trim().toLowerCase();
    const onlyActive = els.filterActiveSession ? els.filterActiveSession.checked : false;
    const onlyAttention = els.filterNeedsAttention ? els.filterNeedsAttention.checked : false;

    const propsByClient = new Map();
    state.clients.forEach((client) => {
      propsByClient.set(client.id, []);
    });

    state.properties.forEach((prop) => {
      const client = state.clients.find((c) => c.id === prop.owner_user_id);
      if (!client) return;
      if (onlyActive && !stats.active.has(prop.id)) return;
      if (onlyAttention && !stats.needsAttention.has(prop.id)) return;
      if (query && !propertyMatchesSearch(prop, client, query)) return;
      propsByClient.get(client.id).push(prop);
    });

    const clients = state.clients.filter((client) => {
      const props = propsByClient.get(client.id) || [];
      const clientMatch = clientMatchesQuery(client, query);
      if (onlyActive || onlyAttention) {
        return props.length > 0;
      }
      if (query) {
        return props.length > 0 || clientMatch;
      }
      return true;
    });
    els.adminClientsList.innerHTML = "";

    if (!clients.length) {
      els.adminClientsList.innerHTML = '<div class="cx-placeholder"><div class="cx-placeholder__title">No matches</div><div class="cx-placeholder__sub">Try adjusting your search or filters.</div></div>';
      return;
    }

    clients.forEach((client) => {
      const details = document.createElement("details");
      details.className = "cx-client";
      if (state.selectedPropertyId && (propsByClient.get(client.id) || []).some((p) => p.id === state.selectedPropertyId)) {
        details.open = true;
      }

      const summary = document.createElement("summary");
      const left = document.createElement("div");
      const name = document.createElement("div");
      name.className = "cx-client__name";
      name.textContent = client.name || "Client";
      const meta = document.createElement("div");
      meta.className = "cx-client__meta";
      meta.textContent = [client.email, client.phone].filter(Boolean).join(" | ");
      left.appendChild(name);
      left.appendChild(meta);
      const count = document.createElement("div");
      count.className = "cx-client__count";
      count.textContent = `${(propsByClient.get(client.id) || []).length} properties`;
      summary.appendChild(left);
      summary.appendChild(count);
      details.appendChild(summary);

      const propsWrap = document.createElement("div");
      propsWrap.className = "cx-client__props";
      const props = sortProperties(propsByClient.get(client.id) || [], stats);
      if (!props.length) {
        const empty = document.createElement("div");
        empty.className = "small-note";
        empty.style.padding = "8px 12px";
        empty.textContent = "No properties yet.";
        propsWrap.appendChild(empty);
      }
      props.forEach((prop) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cx-prop-row";
        if (prop.id === state.selectedPropertyId) btn.classList.add("is-selected");
        btn.dataset.propId = prop.id;

        const col = document.createElement("div");
        const addr = document.createElement("div");
        addr.className = "cx-prop-row__addr";
        addr.textContent = prop.address || "Property";
        const sub = document.createElement("div");
        sub.className = "cx-prop-row__sub";
        const lastStr = stats.lastDone.get(prop.id);
        const lastLabel = lastStr ? `Last cleaned: ${lastStr}` : "";
        sub.textContent = [prop.notes, lastLabel].filter(Boolean).join(" | ");
        col.appendChild(addr);
        col.appendChild(sub);

        btn.appendChild(col);
        btn.addEventListener("click", () => {
          state.selectedPropertyId = prop.id;
          renderClientsList();
          renderPropertyDetail(prop);
        });
        propsWrap.appendChild(btn);
      });

      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "cx-prop-row";
      addBtn.textContent = "+ Add property";
      addBtn.addEventListener("click", () => addPropertyForClient(client));
      propsWrap.appendChild(addBtn);

      details.appendChild(propsWrap);
      els.adminClientsList.appendChild(details);
    });
  }

  async function addPropertyForClient(client) {
    const address = prompt("Property address");
    if (!address) return;
    const notes = prompt("Notes (optional)") || "";
    const { error } = await CN.sb.from("properties").insert({
      tenant_id: tenantId,
      owner_user_id: client.id,
      address,
      notes,
      ownership_type: "client_owned"
    });
    if (error) {
      toast(error.message || String(error), "error");
      return;
    }
    toast("Property created.", "ok");
    await loadProperties();
    await loadTasksCache();
    renderClientsList();
  }

  async function loadPropertyTasks(propertyId) {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, notes, label:task_labels(name)")
      .eq("property_id", propertyId)
      .order("day_date", { ascending: false })
      .limit(5);
    if (error) throw error;
    return data || [];
  }

  async function togglePropertyStaff(propertyId, staffId, checked) {
    if (checked) {
      const { error } = await CN.sb.from("property_staff").insert({
        tenant_id: tenantId,
        property_id: propertyId,
        staff_user_id: staffId
      });
      if (error) throw error;
    } else {
      const { error } = await CN.sb
        .from("property_staff")
        .delete()
        .eq("property_id", propertyId)
        .eq("staff_user_id", staffId);
      if (error) throw error;
    }
    await loadPropertyStaff();
  }

  async function renderPropertyDetail(property) {
    if (!els.adminPropDetail) return;
    if (!property) {
      els.adminPropDetail.innerHTML = '<div class="cx-placeholder"><div class="cx-placeholder__title">Select a property</div><div class="cx-placeholder__sub">Pick a client on the left to see details.</div></div>';
      return;
    }

    const owner = property.owner || state.clients.find((c) => c.id === property.owner_user_id);
    let checklistItems = [];
    let checklistError = null;
    let referenceItems = [];
    let referenceError = null;

    try {
      checklistItems = await loadPropertyChecklistItems(property.id);
    } catch (e) {
      checklistError = e;
    }

    try {
      referenceItems = await loadMediaLinks({ propertyId: property.id, tag: "reference" });
      referenceItems = await attachSignedUrls(referenceItems);
    } catch (e) {
      referenceError = e;
    }

    const wrapper = document.createElement("div");
    const detailBar = document.createElement("div");
    detailBar.className = "cx-detailbar";
    const closeBtn = document.createElement("button");
    closeBtn.className = "cx-close-chip";
    closeBtn.type = "button";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      state.selectedPropertyId = null;
      renderClientsList();
      renderPropertyDetail(null);
    });
    detailBar.appendChild(closeBtn);
    wrapper.appendChild(detailBar);

    const preview = document.createElement("div");
    preview.className = "cx-preview";
    const head = document.createElement("div");
    head.className = "cx-preview__head";
    const title = document.createElement("div");
    title.className = "cx-preview__title";
    title.textContent = property.address || "Property";
    const sub = document.createElement("div");
    sub.className = "cx-preview__sub";
    sub.textContent = [
      owner ? owner.name : "Client",
      owner ? owner.email : "",
      owner ? owner.phone : ""
    ].filter(Boolean).join(" | ");
    head.appendChild(title);
    head.appendChild(sub);
    preview.appendChild(head);

    const list = document.createElement("div");
    list.className = "cx-preview__list";
    const rawNotes = (property.notes || "").trim();
    const notesText = rawNotes;

    const pricingInline = document.createElement("div");
    pricingInline.className = "pricing-inline";
    const pricingLabel = document.createElement("span");
    pricingLabel.className = "pricing-inline__label";
    pricingLabel.textContent = "Price";
    const priceInput = document.createElement("input");
    priceInput.className = "input pricing-inline__input";
    priceInput.type = "number";
    priceInput.step = "0.01";
    priceInput.min = "0";
    priceInput.placeholder = "0.00";
    priceInput.value = property.price != null ? String(property.price) : "";
    const priceSave = document.createElement("button");
    priceSave.type = "button";
    priceSave.className = "btn btn-primary pricing-inline__btn";
    priceSave.textContent = "Save";
    priceSave.addEventListener("click", async () => {
      const raw = priceInput.value.trim();
      let nextPrice = null;
      if (raw) {
        const parsed = parseAmount(raw);
        if (!Number.isFinite(parsed) || parsed < 0) {
          toast("Enter a valid price.", "error");
          return;
        }
        nextPrice = parsed;
      }
      try {
        const { error } = await CN.sb
          .from("properties")
          .update({ price: nextPrice })
          .eq("id", property.id);
        if (error) throw error;
        property.price = nextPrice;
        toast("Price saved.", "ok");
      } catch (e) {
        toast(e.message || String(e), "error");
      }
    });
    priceInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") priceSave.click();
    });
    pricingInline.appendChild(pricingLabel);
    pricingInline.appendChild(priceInput);
    pricingInline.appendChild(priceSave);

    const assetsCard = document.createElement("div");
    assetsCard.className = "card";
    const assetsHead = document.createElement("div");
    assetsHead.className = "row";
    assetsHead.style.display = "flex";
    assetsHead.style.justifyContent = "space-between";
    assetsHead.style.alignItems = "center";
    const notesTitle = document.createElement("h3");
    notesTitle.style.margin = "0";
    notesTitle.textContent = "Notes";
    assetsHead.appendChild(notesTitle);
    assetsHead.appendChild(pricingInline);
    assetsCard.appendChild(assetsHead);

    const notesBody = document.createElement("div");
    notesBody.className = "small-note";
    notesBody.style.marginTop = "6px";
    const placeholderNote = "No notes yet.";
    const lowerNotes = notesText.toLowerCase();
    const showPlaceholder = !notesText
      || lowerNotes === "nincs note"
      || lowerNotes === "no notes"
      || lowerNotes === "no notes yet";
    notesBody.textContent = showPlaceholder ? placeholderNote : notesText;
    assetsCard.appendChild(notesBody);

    const assetsGrid = document.createElement("div");
    assetsGrid.className = "row-2";
    assetsGrid.style.marginTop = "10px";

    const checklistCol = document.createElement("div");
    const checklistTitle = document.createElement("div");
    checklistTitle.innerHTML = `<strong>Checklist template</strong>`;
    checklistCol.appendChild(checklistTitle);
    const checklistList = document.createElement("div");
    checklistList.className = "checklist";
    if (checklistError) {
      checklistList.innerHTML = `<div class="small-note">${checklistError.message || String(checklistError)}</div>`;
    } else if (!checklistItems.length) {
      checklistList.innerHTML = '<div class="small-note">No checklist items yet.</div>';
    } else {
      checklistItems.forEach((item) => {
        const row = document.createElement("div");
        row.className = "check-item";
        const label = document.createElement("label");
        label.textContent = item.label || "Checklist item";
        label.style.flex = "1";
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn btn-danger";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", async () => {
          if (!window.confirm("Remove this checklist item?")) return;
          try {
            await deletePropertyChecklistItem(item.id);
            toast("Checklist item removed.", "ok");
            await renderPropertyDetail(property);
          } catch (e) {
            toast(e.message || String(e), "error");
          }
        });
        row.appendChild(label);
        row.appendChild(removeBtn);
        checklistList.appendChild(row);
      });
    }
    checklistCol.appendChild(checklistList);

    const checklistAddRow = document.createElement("div");
    checklistAddRow.className = "row";
    checklistAddRow.classList.add("checklist-add");
    checklistAddRow.style.marginTop = "10px";
    const checklistInput = document.createElement("input");
    checklistInput.className = "input";
    checklistInput.placeholder = "Add checklist item";
    const checklistAddBtn = document.createElement("button");
    checklistAddBtn.type = "button";
    checklistAddBtn.className = "btn btn-primary";
    checklistAddBtn.textContent = "Add";
    checklistAddBtn.addEventListener("click", async () => {
      const label = checklistInput.value.trim();
      if (!label) return;
      const maxSort = checklistItems.reduce((max, row) => {
        const val = Number.isFinite(row.sort_order) ? row.sort_order : max;
        return Math.max(max, val);
      }, -1);
      const nextSort = Number.isFinite(maxSort) ? maxSort + 1 : checklistItems.length;
      try {
        await addPropertyChecklistItem(property.id, label, nextSort);
        toast("Checklist item added.", "ok");
        await renderPropertyDetail(property);
      } catch (e) {
        toast(e.message || String(e), "error");
      }
    });
    checklistInput.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") checklistAddBtn.click();
    });
    checklistAddRow.appendChild(checklistInput);
    checklistAddRow.appendChild(checklistAddBtn);
    checklistCol.appendChild(checklistAddRow);
    assetsGrid.appendChild(checklistCol);

    const referenceCol = document.createElement("div");
    const referenceHead = document.createElement("div");
    referenceHead.className = "row";
    referenceHead.style.justifyContent = "space-between";
    referenceHead.style.alignItems = "center";
    const referenceTitle = document.createElement("h3");
    referenceTitle.style.margin = "0";
    referenceTitle.textContent = "Reference photos";
    const referenceUpload = document.createElement("button");
    referenceUpload.type = "button";
    referenceUpload.className = "btn btn-ref";
    referenceUpload.textContent = "Upload reference";
    const referenceInput = document.createElement("input");
    referenceInput.type = "file";
    referenceInput.accept = "image/*";
    referenceInput.multiple = true;
    referenceInput.className = "file-hidden";
    referenceUpload.addEventListener("click", () => referenceInput.click());
    referenceInput.addEventListener("change", async () => {
      const files = Array.from(referenceInput.files || []);
      referenceInput.value = "";
      if (!files.length) return;
      try {
        for (const file of files) {
          await uploadMediaAndLink({
            file,
            path: buildReferencePath(property.id, file),
            propertyId: property.id,
            tag: "reference"
          });
        }
        toast("Reference photos uploaded.", "ok");
        await renderPropertyDetail(property);
      } catch (e) {
        toast(e.message || String(e), "error");
      }
    });
    referenceHead.appendChild(referenceTitle);
    referenceHead.appendChild(referenceUpload);
    referenceCol.appendChild(referenceHead);
    referenceCol.appendChild(referenceInput);
    const referenceGallery = document.createElement("div");
    referenceCol.appendChild(referenceGallery);
    if (referenceError) {
      referenceGallery.innerHTML = `<div class="small-note">${referenceError.message || String(referenceError)}</div>`;
    } else {
      renderGallery(referenceGallery, referenceItems, {
        canDelete: true,
        onDelete: async (item) => {
          if (!window.confirm("Delete this photo?")) return;
          try {
            await deleteMediaItem(item);
            await renderPropertyDetail(property);
          } catch (e) {
            toast(e.message || String(e), "error");
          }
        }
      });
    }
    assetsGrid.appendChild(referenceCol);
    assetsCard.appendChild(assetsGrid);
    list.appendChild(assetsCard);

    const historyCard = document.createElement("div");
    historyCard.className = "card";
    const historyHead = document.createElement("div");
    historyHead.className = "row";
    historyHead.style.justifyContent = "space-between";
    historyHead.style.alignItems = "center";
    const historyTitle = document.createElement("h3");
    historyTitle.style.margin = "0";
    historyTitle.textContent = "Recent cleanings";
    const historyBtn = document.createElement("button");
    historyBtn.type = "button";
    historyBtn.className = "btn";
    historyBtn.textContent = "Session history";
    historyBtn.addEventListener("click", () => {
      window.location.href = `sessions.html?propertyId=${encodeURIComponent(property.id)}`;
    });
    historyHead.appendChild(historyTitle);
    historyHead.appendChild(historyBtn);
    historyCard.appendChild(historyHead);
    const historyList = document.createElement("div");
    historyList.className = "booking-history-list";
    historyList.style.marginTop = "10px";
    try {
      const tasks = await loadPropertyTasks(property.id);
      if (!tasks.length) {
        historyList.innerHTML = '<div class="small-note">No tasks yet.</div>';
      } else {
        tasks.forEach((task) => {
          const row = document.createElement("div");
          row.className = "booking-history-row";
          const info = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = task.label ? task.label.name : "Task";
          const meta = document.createElement("div");
          meta.className = "small-note";
          meta.textContent = `${task.day_date} - ${task.status}`;
          info.appendChild(title);
          info.appendChild(meta);
          if (task.notes) {
            const notes = document.createElement("div");
            notes.className = "small-note";
            notes.textContent = task.notes;
            info.appendChild(notes);
          }
          const actions = document.createElement("div");
          actions.className = "row-actions";
          const openBtn = document.createElement("button");
          openBtn.type = "button";
          openBtn.className = "btn";
          openBtn.textContent = "Details";
          openBtn.addEventListener("click", () => {
            openTaskDetail(task.id).catch((e) => toast(e.message || String(e), "error"));
          });
          actions.appendChild(openBtn);
          row.appendChild(info);
          row.appendChild(actions);
          historyList.appendChild(row);
        });
      }
    } catch (e) {
      historyList.innerHTML = `<div class="small-note">${e.message || String(e)}</div>`;
    }
    historyCard.appendChild(historyList);
    list.appendChild(historyCard);

    preview.appendChild(list);
    wrapper.appendChild(preview);
    els.adminPropDetail.innerHTML = "";
    els.adminPropDetail.appendChild(wrapper);

  }

  function wireTimelineControls() {
    if (els.timelineMonth) {
      els.timelineMonth.addEventListener("change", () => {
        state.timeline.month = els.timelineMonth.value || "";
        refreshTimeline().catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (els.timelineExportCsv) {
      els.timelineExportCsv.addEventListener("click", () => exportTimelineCsv());
    }

    if (els.timelinePrint) {
      els.timelinePrint.addEventListener("click", () => window.print());
    }

    if (els.timelineJumpToday) {
      els.timelineJumpToday.addEventListener("click", () => {
        const today = new Date();
        const monthValue = toMonthInputValue(today);
        if (els.timelineMonth) {
          els.timelineMonth.value = monthValue;
        }
        state.timeline.month = monthValue;
        refreshTimeline().catch((e) => toast(e.message || String(e), "error"));
      });
    }

    if (els.timelineAddModal) {
      els.timelineAddModal.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "timeline-add-cancel") {
          closeTimelineAddModal();
        }
      });
    }

    if (els.timelineAddOwner) {
      els.timelineAddOwner.addEventListener("change", () => {
        renderTimelinePropResults(els.timelineAddSearch ? els.timelineAddSearch.value : "");
      });
    }

    if (els.timelineAddProperty) {
      els.timelineAddProperty.addEventListener("change", () => {
        state.timeline.selectedPropertyId = els.timelineAddProperty.value || null;
      });
    }

    if (els.timelineAddSearch) {
      els.timelineAddSearch.addEventListener("input", () => {
        renderTimelinePropResults(els.timelineAddSearch.value || "");
      });
    }

    if (els.timelineAddActivityType) {
      els.timelineAddActivityType.addEventListener("change", () => {
        updateTimelineAddMode();
      });
    }

    if (els.timelineAddStaff) {
      els.timelineAddStaff.addEventListener("change", () => {
        state.timeline.staffTouched = true;
      });
    }

    if (els.timelineAddSave) {
      els.timelineAddSave.addEventListener("click", () => {
        saveTimelineBooking().catch((e) => toast(e.message || String(e), "error"));
      });
    }
  }

  async function loadTimelineTasks(startDate, endDate) {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, notes, assigned_user_id, property_id, label_id, property:properties(address)")
      .eq("tenant_id", tenantId)
      .gte("day_date", toDateInputValue(startDate))
      .lte("day_date", toDateInputValue(endDate))
      .order("day_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function refreshTimeline() {
    if (!els.timelineDays) return;
    const today = new Date();
    const selectedMonth = state.timeline.month || (els.timelineMonth ? els.timelineMonth.value : "");
    const monthDate = fromMonthInputValue(selectedMonth) || today;
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const normalizedMonth = toMonthInputValue(monthStart);

    if (els.timelineMonth && els.timelineMonth.value !== normalizedMonth) {
      els.timelineMonth.value = normalizedMonth;
    }
    state.timeline.month = normalizedMonth;

    const monthTasks = await loadTimelineTasks(monthStart, monthEnd);
    const monthActivities = await loadActivities(monthStart, monthEnd);

    state.timeline.tasks = monthTasks;
    state.timeline.monthTasks = monthTasks;
    state.timeline.activities = monthActivities;
    state.timeline.startDate = monthStart;
    state.timeline.endDate = monthEnd;

    renderTimeline(monthTasks, monthTasks, monthActivities, monthStart, monthEnd);
  }

  function renderTimeline(tasks, monthTasks, activities, startDate, endDate) {
    if (!els.timelineDays || !els.timelineHeatmap) return;
    if (els.timelineMonthLabel) {
      els.timelineMonthLabel.textContent = fmtMonthLabel(startDate);
    }

    const tasksByDay = groupBy(tasks, (t) => t.day_date);
    const activitiesByDay = groupBy(activities || [], (a) => a.day_date);
    const dayCount = endDate.getDate();
    const dayList = [];
    for (let i = 0; i < dayCount; i += 1) {
      dayList.push(addDays(startDate, i));
    }

    els.timelineDays.innerHTML = "";
    dayList.forEach((day) => {
      const key = toDateInputValue(day);
      const dayTasks = tasksByDay.get(key) || [];
      const dayActivities = activitiesByDay.get(key) || [];
      const dayCard = document.createElement("div");
      dayCard.className = "timeline-day";
      dayCard.dataset.date = key;
      dayCard.id = `timeline-day-${key}`;
      const head = document.createElement("div");
      head.className = "timeline-day__head";

      const title = document.createElement("div");
      title.className = "timeline-day__title";
      const titleStrong = document.createElement("strong");
      titleStrong.textContent = fmtDateLabel(day);
      const titleSub = document.createElement("p");
      titleSub.className = "small-note";
      const taskMinutes = dayTasks.reduce((sum, t) => sum + (t.duration_minutes || 0), 0);
      const activityMinutes = dayActivities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0);
      const totalHours = (taskMinutes + activityMinutes) / 60;
      const summaryParts = [];
      const isEmptyDay = !dayTasks.length && !dayActivities.length;
      if (dayTasks.length) summaryParts.push(`${dayTasks.length} job${dayTasks.length === 1 ? "" : "s"}`);
      if (dayActivities.length) summaryParts.push(`${dayActivities.length} activit${dayActivities.length === 1 ? "y" : "ies"}`);
      if (isEmptyDay) summaryParts.push("0 jobs");
      summaryParts.push(`${totalHours.toFixed(1)}h`);
      if (isEmptyDay) summaryParts.push("no bookings or activities yet.");
      titleSub.textContent = summaryParts.join(", ");
      title.appendChild(titleStrong);
      title.appendChild(titleSub);

      const headActions = document.createElement("div");
      const addBtn = document.createElement("button");
      addBtn.className = "btn";
      addBtn.type = "button";
      addBtn.textContent = "Add booking";
      addBtn.addEventListener("click", () => openTimelineAddModal(day));
      headActions.appendChild(addBtn);

      head.appendChild(title);
      head.appendChild(headActions);
      dayCard.appendChild(head);

      const dayItems = [];
      dayTasks.forEach((task) => dayItems.push({ kind: "task", start: task.start_at, item: task }));
      dayActivities.forEach((activity) => dayItems.push({ kind: "activity", start: activity.start_at, item: activity }));
      dayItems.sort((a, b) => {
        const aTime = a.start ? new Date(a.start).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.start ? new Date(b.start).getTime() : Number.POSITIVE_INFINITY;
        if (aTime !== bTime) return aTime - bTime;
        if (a.kind !== b.kind) return a.kind === "task" ? -1 : 1;
        return 0;
      });
      if (dayItems.length) {
        const body = document.createElement("div");
        body.className = "timeline-day__body";
        dayItems.forEach((row) => {
          if (row.kind === "task") {
            const task = row.item;
            const booking = document.createElement("div");
            booking.className = "timeline-booking";
            if (task.status === "done") booking.classList.add("is-done");
            if (task.status === "canceled") booking.classList.add("is-cancelled");
            if (isSameDay(day, new Date())) booking.classList.add("is-focus");

            const main = document.createElement("div");
            main.className = "timeline-booking__main";
            const time = document.createElement("div");
            time.className = "timeline-booking__time";
            time.textContent = fmtTimeRange(task.start_at, task.end_at, task.duration_minutes);
            const addr = document.createElement("div");
            addr.className = "timeline-booking__addr";
            addr.textContent = (task.property && task.property.address) || (getPropertyById(task.property_id) || {}).address || "Property";
            const meta = document.createElement("div");
            meta.className = "timeline-booking__meta";
            const label = getLabelById(task.label_id);
            const staffName = task.assigned_user_id ? getStaffName(task.assigned_user_id) : "Unassigned";
            meta.textContent = [label ? label.name : "Task", staffName, task.notes].filter(Boolean).join(" | ");
            main.appendChild(time);
            main.appendChild(addr);
            main.appendChild(meta);

            const actions = document.createElement("div");
            actions.className = "timeline-booking__actions";
            const detailBtn = document.createElement("button");
            detailBtn.className = "btn";
            detailBtn.type = "button";
            detailBtn.textContent = "Details";
            detailBtn.addEventListener("click", () => {
              openTaskDetail(task).catch((e) => toast(e.message || String(e), "error"));
            });
            actions.appendChild(detailBtn);

            booking.appendChild(main);
            booking.appendChild(actions);
            body.appendChild(booking);
            return;
          }

          const activity = row.item;
          const booking = document.createElement("div");
          booking.className = "timeline-booking";
          if (activity.status === "done") booking.classList.add("is-done");
          if (activity.status === "canceled") booking.classList.add("is-cancelled");
          if (isSameDay(day, new Date())) booking.classList.add("is-focus");
          applyActivityColor(booking, getActivityColor(activity));

          const main = document.createElement("div");
          main.className = "timeline-booking__main";
          const time = document.createElement("div");
          time.className = "timeline-booking__time";
          time.textContent = fmtTimeRange(activity.start_at, null, activity.duration_minutes);
        const addr = document.createElement("div");
        addr.className = "timeline-booking__addr";
        const prop = activity.property_id ? getPropertyById(activity.property_id) : null;
        const typeName = activity.type_name_snapshot || "Activity";
        addr.textContent = prop ? prop.address : typeName;
        const meta = document.createElement("div");
        meta.className = "timeline-booking__meta";
        const staffName = activity.assigned_user_id ? getStaffName(activity.assigned_user_id) : "Unassigned";
        const metaParts = [];
        if (prop) metaParts.push(typeName);
        metaParts.push(staffName);
        if (activity.notes) metaParts.push(activity.notes);
        meta.textContent = metaParts.filter(Boolean).join(" | ");
          main.appendChild(time);
          main.appendChild(addr);
          main.appendChild(meta);

          booking.appendChild(main);
          body.appendChild(booking);
        });
        dayCard.appendChild(body);
      }

      els.timelineDays.appendChild(dayCard);
    });

    renderTimelineHeatmap(monthTasks, activities, startDate);
  }

  function scrollTimelineToDate(dateStr) {
    if (!els.timelineDays || !dateStr) return;
    const target = els.timelineDays.querySelector(`[data-date="${dateStr}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderTimelineHeatmap(monthTasks, monthActivities, focusDate) {
    if (!els.timelineHeatmap) return;
    const monthStart = startOfMonth(focusDate);
    const monthEnd = endOfMonth(focusDate);
    const startOffset = monthStart.getDay();
    const gridStart = addDays(monthStart, -startOffset);
    const monthTasksByDay = groupBy(monthTasks, (t) => t.day_date);
    const monthActivitiesByDay = groupBy(monthActivities || [], (a) => a.day_date);

    const values = [];
    for (let i = 0; i < 42; i += 1) {
      const day = addDays(gridStart, i);
      const key = toDateInputValue(day);
      const dayTasks = monthTasksByDay.get(key) || [];
      const dayActivities = monthActivitiesByDay.get(key) || [];
      const val = state.timeline.metric === "hours"
        ? (dayTasks.reduce((sum, t) => sum + (t.duration_minutes || 0), 0)
          + dayActivities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0)) / 60
        : dayTasks.length + dayActivities.length;
      values.push(val);
    }
    const maxVal = Math.max(...values, 0);

    els.timelineHeatmap.innerHTML = "";
    const dow = document.createElement("div");
    dow.className = "timeline-heatmap__dow";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((label) => {
      const el = document.createElement("div");
      el.className = "hm-dow";
      el.textContent = label;
      dow.appendChild(el);
    });
    els.timelineHeatmap.appendChild(dow);

    const grid = document.createElement("div");
    grid.className = "timeline-heatmap__grid";

    for (let i = 0; i < 42; i += 1) {
      const day = addDays(gridStart, i);
      const key = toDateInputValue(day);
      const dayTasks = monthTasksByDay.get(key) || [];
      const dayActivities = monthActivitiesByDay.get(key) || [];
      const val = state.timeline.metric === "hours"
        ? (dayTasks.reduce((sum, t) => sum + (t.duration_minutes || 0), 0)
          + dayActivities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0)) / 60
        : dayTasks.length + dayActivities.length;
      let level = 0;
      if (val > 0) level = 1;
      if (val > 1) level = 2;
      if (val > 2) level = 3;
      if (val > 3) level = 4;
      if (maxVal > 6 && val >= maxVal * 0.75) level = 4;

      const cell = document.createElement("div");
      cell.className = `hm-day hm-lvl-${level}`;
      if (day < monthStart || day > monthEnd) cell.classList.add("is-out");
      cell.dataset.date = key;
      cell.innerHTML = `<div class="hm-day__num">${day.getDate()}</div><div class="hm-day__cnt">${state.timeline.metric === "hours" ? val.toFixed(1) + "h" : val + " jobs"}</div>`;
      if (!(day < monthStart || day > monthEnd)) {
        cell.addEventListener("click", () => {
          scrollTimelineToDate(key);
        });
      }
      grid.appendChild(cell);
    }

    els.timelineHeatmap.appendChild(grid);
  }

  function getTimelineOwners() {
    const ownerIds = new Set();
    state.properties.forEach((prop) => {
      if (prop.owner_user_id) ownerIds.add(prop.owner_user_id);
    });
    return state.clients.filter((client) => ownerIds.has(client.id));
  }

  function populateTimelineOwnerSelect(selectedOwnerId) {
    if (!els.timelineAddOwner) return;
    const current = selectedOwnerId || els.timelineAddOwner.value || "";
    const owners = getTimelineOwners().slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    els.timelineAddOwner.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "";
    allOpt.textContent = "All owners";
    els.timelineAddOwner.appendChild(allOpt);
    owners.forEach((owner) => {
      const opt = document.createElement("option");
      opt.value = owner.id;
      opt.textContent = owner.name || owner.email || "Owner";
      els.timelineAddOwner.appendChild(opt);
    });
    els.timelineAddOwner.value = current;
  }

  function populateTimelineActivityTypeSelect() {
    if (!els.timelineAddActivityType) return;
    const current = els.timelineAddActivityType.value || "";
    els.timelineAddActivityType.innerHTML = "";
    const bookingOpt = document.createElement("option");
    bookingOpt.value = "";
    bookingOpt.textContent = "Booking (default)";
    els.timelineAddActivityType.appendChild(bookingOpt);
    state.activityTypes.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type.id;
      opt.textContent = type.name;
      els.timelineAddActivityType.appendChild(opt);
    });
    els.timelineAddActivityType.value = current;
  }

  function populateTimelineStaffSelect() {
    if (!els.timelineAddStaff) return;
    const current = els.timelineAddStaff.value || "";
    els.timelineAddStaff.innerHTML = "";
    const noneOpt = document.createElement("option");
    noneOpt.value = "";
    noneOpt.textContent = "Staff";
    els.timelineAddStaff.appendChild(noneOpt);
    const meOpt = document.createElement("option");
    meOpt.value = userId;
    meOpt.textContent = "Me (Admin)";
    els.timelineAddStaff.appendChild(meOpt);
    state.staff.forEach((staff) => {
      const opt = document.createElement("option");
      opt.value = staff.id;
      opt.textContent = staff.name || staff.email || "Staff";
      els.timelineAddStaff.appendChild(opt);
    });
    els.timelineAddStaff.value = current;
  }

  function updateTimelineAddMode() {
    const activityTypeId = els.timelineAddActivityType ? els.timelineAddActivityType.value : "";
    const isActivity = Boolean(activityTypeId);
    if (els.timelineAddStaff) {
      if (!state.timeline.staffTouched) {
        els.timelineAddStaff.value = isActivity ? userId : "";
      }
    }
    if (els.timelineAddHint) {
      if (isActivity) {
        const type = state.activityTypes.find((t) => t.id === activityTypeId);
        els.timelineAddHint.textContent = `Activity: ${type ? type.name : "Activity"}`;
      } else {
        const label = getLabelById(findDefaultLabelId());
        els.timelineAddHint.textContent = `Label: ${label ? label.name : "Not set"} (can be edited later)`;
      }
    }
    if (els.timelineAddDuration && isActivity) {
      const type = state.activityTypes.find((t) => t.id === activityTypeId);
      if (type && Number.isFinite(Number(type.default_duration_minutes))) {
        els.timelineAddDuration.value = String(type.default_duration_minutes);
      }
    }
  }

  function openTimelineAddModal(date, preselectedPropertyId) {
    if (!els.timelineAddModal) return;
    state.timeline.selectedDate = date;
    state.timeline.selectedPropertyId = preselectedPropertyId || null;
    state.timeline.staffTouched = false;
    if (els.timelineAddTitle) {
      els.timelineAddTitle.textContent = `Add booking - ${fmtDateLabel(date)}`;
    }
    if (els.timelineAddSearch) els.timelineAddSearch.value = "";
    if (els.timelineAddNotes) els.timelineAddNotes.value = "";
    if (els.timelineAddTbd) els.timelineAddTbd.checked = false;
    if (els.timelineAddTime) els.timelineAddTime.value = "09:00";
    if (els.timelineAddDuration) els.timelineAddDuration.value = "120";
    if (els.timelineAddStaff) els.timelineAddStaff.value = "";
    populateTimelineOwnerSelect();
    populateTimelineActivityTypeSelect();
    populateTimelineStaffSelect();
    if (preselectedPropertyId && els.timelineAddProperty) {
      const prop = getPropertyById(preselectedPropertyId);
      if (prop && els.timelineAddOwner) {
        els.timelineAddOwner.value = prop.owner_user_id || "";
      }
    }
    renderTimelinePropResults("");
    if (els.timelineAddProperty && preselectedPropertyId) {
      els.timelineAddProperty.value = preselectedPropertyId;
      state.timeline.selectedPropertyId = preselectedPropertyId;
    }
    if (els.timelineAddActivityType) els.timelineAddActivityType.value = "";
    updateTimelineAddMode();
    els.timelineAddModal.removeAttribute("hidden");
  }

  function closeTimelineAddModal() {
    if (els.timelineAddModal) els.timelineAddModal.setAttribute("hidden", "");
  }

  function renderTimelinePropResults(filterText) {
    if (!els.timelineAddProperty) return;
    const query = (filterText || "").trim().toLowerCase();
    const ownerId = els.timelineAddOwner ? els.timelineAddOwner.value : "";
    const selectedId = els.timelineAddProperty.value || state.timeline.selectedPropertyId || "";
    const results = state.properties.filter((prop) => {
      if (ownerId && prop.owner_user_id !== ownerId) return false;
      const owner = state.clients.find((c) => c.id === prop.owner_user_id);
      const hay = [prop.address, owner ? owner.name : "", owner ? owner.email : "", owner ? owner.phone : ""].join(" ").toLowerCase();
      return !query || hay.includes(query);
    });
    els.timelineAddProperty.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select property";
    els.timelineAddProperty.appendChild(placeholder);
    results.forEach((prop) => {
      const owner = state.clients.find((c) => c.id === prop.owner_user_id);
      const opt = document.createElement("option");
      opt.value = prop.id;
      opt.textContent = `${prop.address || "Property"}${owner ? ` — ${owner.name || owner.email || "Owner"}` : ""}`;
      els.timelineAddProperty.appendChild(opt);
    });
    if (selectedId && results.some((prop) => prop.id === selectedId)) {
      els.timelineAddProperty.value = selectedId;
      state.timeline.selectedPropertyId = selectedId;
    } else {
      els.timelineAddProperty.value = "";
      state.timeline.selectedPropertyId = null;
    }
  }

  async function saveTimelineBooking() {
    const day = state.timeline.selectedDate;
    const activityTypeId = els.timelineAddActivityType ? els.timelineAddActivityType.value : "";
    const isActivity = Boolean(activityTypeId);
    const propertyId = els.timelineAddProperty ? (els.timelineAddProperty.value || null) : state.timeline.selectedPropertyId;
    if (!day) {
      toast("Select a date.", "error");
      return;
    }
    if (!isActivity && !propertyId) {
      toast("Select a property.", "error");
      return;
    }
    const labelId = findDefaultLabelId();
    const duration = els.timelineAddDuration ? Number(els.timelineAddDuration.value || 0) : null;
    const notes = els.timelineAddNotes ? els.timelineAddNotes.value.trim() : "";
    const tbd = els.timelineAddTbd ? els.timelineAddTbd.checked : false;
    if (isActivity) {
      const type = state.activityTypes.find((t) => t.id === activityTypeId);
      if (!type) {
        toast("Select an activity type.", "error");
        return;
      }
      const staffId = els.timelineAddStaff ? els.timelineAddStaff.value : "";
      const payload = {
        tenant_id: tenantId,
        type_id: type.id,
        type_name_snapshot: type.name,
        day_date: toDateInputValue(day),
        duration_minutes: duration || type.default_duration_minutes || null,
        status: "planned",
        assigned_user_id: staffId || userId,
        property_id: propertyId || null,
        notes: notes || null,
        created_by_user_id: userId
      };
      if (type.color) payload.color = type.color;
      if (!tbd && els.timelineAddTime) {
        const time = els.timelineAddTime.value || "09:00";
        const start = new Date(`${toDateInputValue(day)}T${time}:00`);
        payload.start_at = start.toISOString();
      }
      const { error: activityError } = await CN.sb.from("activities").insert(payload);
      if (activityError) throw activityError;
      toast("Activity created.", "ok");
      closeTimelineAddModal();
      await refreshTimeline().catch(() => {});
      return;
    }
    if (!labelId) {
      toast("No task labels available. Add a label first.", "error");
      return;
    }
    const payload = {
      tenant_id: tenantId,
      property_id: propertyId,
      label_id: labelId,
      day_date: toDateInputValue(day),
      duration_minutes: duration || null,
      status: "planned",
      created_by_user_id: userId,
      notes: notes || null
    };
    const staffId = els.timelineAddStaff ? els.timelineAddStaff.value : "";
    if (staffId) payload.assigned_user_id = staffId;
    const prop = getPropertyById(propertyId);
    const propPrice = parseAmount(prop && prop.price);
    if (Number.isFinite(propPrice)) {
      payload.price = propPrice;
    }
    if (!tbd && els.timelineAddTime) {
      const time = els.timelineAddTime.value || "09:00";
      const start = new Date(`${toDateInputValue(day)}T${time}:00`);
      payload.start_at = start.toISOString();
      if (duration) {
        const end = new Date(start.getTime() + duration * 60000);
        payload.end_at = end.toISOString();
      }
    }
    const { data, error } = await CN.sb.from("tasks").insert(payload).select("id, property_id").single();
    if (error) throw error;
    if (data) {
      await ensureTaskChecklist(data.id, data.property_id);
    }
    toast("Booking created.", "ok");
    closeTimelineAddModal();
    await refreshTaskViews();
  }

  function exportTimelineCsv() {
    const tasks = state.timeline.tasks || [];
    const rows = tasks.map((task) => {
      const prop = getPropertyById(task.property_id);
      const label = getLabelById(task.label_id);
      return [
        task.day_date,
        fmtTimeRange(task.start_at, task.end_at, task.duration_minutes),
        prop ? prop.address : "",
        label ? label.name : "",
        task.status,
        task.notes || ""
      ];
    });
    downloadCsv("timeline.csv", ["Date", "Time", "Property", "Label", "Status", "Notes"], rows);
  }

  function populateScheduleStaffOptions() {
    if (!els.scheduleStaff) return;
    els.scheduleStaff.innerHTML = '<option value="">Staff: All</option>';
    state.staff.forEach((staff) => {
      const opt = document.createElement("option");
      opt.value = staff.id;
      opt.textContent = staff.name || staff.email || "Staff";
      els.scheduleStaff.appendChild(opt);
    });
  }

  function wireScheduleControls() {
    if (els.scheduleMonth && !els.scheduleMonth.value) {
      els.scheduleMonth.value = toMonthInputValue(new Date());
    }
    if (els.scheduleMonth) {
      els.scheduleMonth.addEventListener("change", () => refreshSchedule().catch((e) => toast(e.message || String(e), "error")));
    }
    if (els.scheduleStatus) {
      els.scheduleStatus.addEventListener("change", () => refreshSchedule().catch((e) => toast(e.message || String(e), "error")));
    }
    if (els.scheduleStaff) {
      els.scheduleStaff.addEventListener("change", () => refreshSchedule().catch((e) => toast(e.message || String(e), "error")));
    }
    if (els.scheduleUnassignedOnly) {
      els.scheduleUnassignedOnly.addEventListener("change", () => refreshSchedule().catch((e) => toast(e.message || String(e), "error")));
    }
    if (els.scheduleResetFilters) {
      els.scheduleResetFilters.addEventListener("click", () => {
        if (els.scheduleStatus) els.scheduleStatus.value = "all";
        if (els.scheduleStaff) els.scheduleStaff.value = "";
        if (els.scheduleUnassignedOnly) els.scheduleUnassignedOnly.checked = false;
        refreshSchedule().catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (els.scheduleExportCsv) {
      els.scheduleExportCsv.addEventListener("click", exportScheduleCsv);
    }
    if (els.schedulePrint) {
      els.schedulePrint.addEventListener("click", () => window.print());
    }
  }

  function formatCurrency(value) {
    return `EUR ${formatAmount(value)}`;
  }

  async function loadInvoiceSettings() {
    const { data, error } = await CN.sb
      .from("tenant_settings")
      .select("billing_text")
      .eq("tenant_id", tenantId);
    if (error) throw error;
    const row = data && data[0];
    state.invoiceIssuerText = row && row.billing_text ? String(row.billing_text) : "";
  }

  function openInvoiceSettingsModal() {
    if (!els.invoiceSettingsModal) return;
    if (els.invoiceIssuerText) els.invoiceIssuerText.value = state.invoiceIssuerText || "";
    els.invoiceSettingsModal.removeAttribute("hidden");
  }

  function closeInvoiceSettingsModal() {
    if (els.invoiceSettingsModal) els.invoiceSettingsModal.setAttribute("hidden", "");
  }

  async function saveInvoiceSettings() {
    const text = els.invoiceIssuerText ? els.invoiceIssuerText.value.trim() : "";
    const { error } = await CN.sb.from("tenant_settings").upsert({
      tenant_id: tenantId,
      billing_text: text,
      updated_at: new Date().toISOString()
    }, { onConflict: "tenant_id" });
    if (error) throw error;
    state.invoiceIssuerText = text;
  }

  function parseInvoiceCustomerMeta(rawAddress) {
    const meta = { address: "", taxId: "", country: "" };
    if (!rawAddress) return meta;
    if (typeof rawAddress !== "string") {
      meta.address = String(rawAddress);
      return meta;
    }
    const trimmed = rawAddress.trim();
    if (!trimmed) return meta;
    if (!trimmed.startsWith("{")) {
      meta.address = rawAddress;
      return meta;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        const hasMeta = Object.prototype.hasOwnProperty.call(parsed, "address")
          || Object.prototype.hasOwnProperty.call(parsed, "tax_id")
          || Object.prototype.hasOwnProperty.call(parsed, "taxId")
          || Object.prototype.hasOwnProperty.call(parsed, "country");
        if (hasMeta) {
          if (typeof parsed.address === "string") meta.address = parsed.address;
          if (typeof parsed.tax_id === "string") meta.taxId = parsed.tax_id;
          if (typeof parsed.taxId === "string") meta.taxId = parsed.taxId;
          if (typeof parsed.country === "string") meta.country = parsed.country;
          return meta;
        }
      }
    } catch (e) {
      // fall through
    }
    meta.address = rawAddress;
    return meta;
  }

  function packInvoiceCustomerAddress(address, taxId, country) {
    const safeAddress = address || "";
    const safeTaxId = taxId || "";
    const safeCountry = country || "";
    if (!safeTaxId && !safeCountry) {
      return safeAddress || null;
    }
    return JSON.stringify({
      address: safeAddress,
      tax_id: safeTaxId,
      country: safeCountry
    });
  }

  function getInvoiceCustomerFields(invoice) {
    const meta = parseInvoiceCustomerMeta(invoice ? invoice.customer_address : "");
    return {
      name: invoice && invoice.customer_name ? invoice.customer_name : "",
      email: invoice && invoice.customer_email ? invoice.customer_email : "",
      address: meta.address || "",
      taxId: meta.taxId || "",
      country: meta.country || ""
    };
  }

  function getInvoiceItemRows() {
    if (!els.invoiceItems) return [];
    return Array.from(els.invoiceItems.querySelectorAll(".invoice-item-row"));
  }

  function addInvoiceItemRow(item = {}) {
    if (!els.invoiceItems) return;
    const row = document.createElement("div");
    row.className = "invoice-item-row";

    const service = document.createElement("input");
    service.className = "input invoice-item-service";
    service.placeholder = "Service / Concepto";
    service.value = item.label || "";

    const qty = document.createElement("input");
    qty.className = "input invoice-item-qty";
    qty.type = "number";
    qty.min = "1";
    qty.step = "1";
    qty.placeholder = "Qty / Cantidad";
    qty.value = item.qty != null ? String(item.qty) : "1";

    const unit = document.createElement("input");
    unit.className = "input invoice-item-unit";
    unit.type = "number";
    unit.min = "0";
    unit.step = "0.01";
    unit.placeholder = "Unit price / Precio unitario";
    if (item.unit_price != null) unit.value = String(item.unit_price);

    const total = document.createElement("input");
    total.className = "input invoice-item-total";
    total.type = "text";
    total.disabled = true;
    total.placeholder = "Total / Base imponible";

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn invoice-item-remove";
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      const rows = getInvoiceItemRows();
      if (rows.length <= 1) {
        service.value = "";
        qty.value = "1";
        unit.value = "";
        total.value = "";
      } else {
        row.remove();
      }
      updateInvoiceTotal();
    });

    qty.addEventListener("input", updateInvoiceTotal);
    unit.addEventListener("input", updateInvoiceTotal);

    row.appendChild(service);
    row.appendChild(qty);
    row.appendChild(unit);
    row.appendChild(total);
    row.appendChild(removeBtn);
    els.invoiceItems.appendChild(row);
    updateInvoiceTotal();
  }

  function resetInvoiceItems() {
    if (!els.invoiceItems) return;
    els.invoiceItems.innerHTML = "";
    addInvoiceItemRow();
  }

  function collectInvoiceItems() {
    const rows = getInvoiceItemRows();
    const items = [];
    let hasPartial = false;
    rows.forEach((row) => {
      const service = (row.querySelector(".invoice-item-service") || {}).value || "";
      const qtyRaw = (row.querySelector(".invoice-item-qty") || {}).value || "";
      const unitRaw = (row.querySelector(".invoice-item-unit") || {}).value || "";
      const hasAny = service.trim() || qtyRaw.trim() || unitRaw.trim();
      if (!hasAny) return;

      const qtyParsed = parseAmount(qtyRaw);
      const qty = Number.isFinite(qtyParsed) ? qtyParsed : 1;
      const unit = parseAmount(unitRaw);
      if (!service.trim() || !Number.isFinite(unit) || unit <= 0 || !Number.isFinite(qty) || qty <= 0) {
        hasPartial = true;
        return;
      }
      items.push({
        label: service.trim(),
        qty,
        unit_price: unit,
        line_total: qty * unit
      });
    });
    if (hasPartial) {
      throw new Error("Please complete all item fields.");
    }
    return items;
  }

  function updateInvoiceTotal() {
    if (!els.invoiceTotal || !els.invoiceItems) return;
    let totalSum = 0;
    getInvoiceItemRows().forEach((row) => {
      const qtyInput = row.querySelector(".invoice-item-qty");
      const unitInput = row.querySelector(".invoice-item-unit");
      const totalInput = row.querySelector(".invoice-item-total");
      const qtyRaw = qtyInput ? qtyInput.value : "";
      const unitRaw = unitInput ? unitInput.value : "";
      const qtyParsed = parseAmount(qtyRaw);
      const qty = Number.isFinite(qtyParsed) ? qtyParsed : 1;
      const unitPrice = parseAmount(unitRaw);
      const lineTotal = Number.isFinite(unitPrice) && Number.isFinite(qty) && qty > 0 && unitPrice > 0
        ? qty * unitPrice
        : null;
      if (totalInput) totalInput.value = lineTotal != null ? formatAmount(lineTotal) : "";
      if (lineTotal != null && Number.isFinite(lineTotal)) totalSum += lineTotal;
    });
    els.invoiceTotal.value = totalSum ? formatAmount(totalSum) : "";
  }

  function clearInvoiceForm() {
    if (els.invoiceIssueDate) els.invoiceIssueDate.value = toDateInputValue(new Date());
    if (els.invoiceNumber) els.invoiceNumber.value = "Auto";
    if (els.invoiceCustomerName) els.invoiceCustomerName.value = "";
    if (els.invoiceCustomerEmail) els.invoiceCustomerEmail.value = "";
    if (els.invoiceCustomerTaxId) els.invoiceCustomerTaxId.value = "";
    if (els.invoiceCustomerCountry) els.invoiceCustomerCountry.value = "";
    if (els.invoiceCustomerAddress) els.invoiceCustomerAddress.value = "";
    if (els.invoiceTotal) els.invoiceTotal.value = "";
    resetInvoiceItems();
  }

  function wireInvoiceControls() {
    if (els.invoiceIssueDate && !els.invoiceIssueDate.value) {
      els.invoiceIssueDate.value = toDateInputValue(new Date());
    }
    if (els.invoiceSaveBtn) {
      els.invoiceSaveBtn.addEventListener("click", () => {
        createInvoice().catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (els.invoiceClearBtn) {
      els.invoiceClearBtn.addEventListener("click", clearInvoiceForm);
    }
    if (els.invoiceAddItemBtn) {
      els.invoiceAddItemBtn.addEventListener("click", () => {
        addInvoiceItemRow();
        const rows = getInvoiceItemRows();
        const lastRow = rows[rows.length - 1];
        const serviceInput = lastRow ? lastRow.querySelector(".invoice-item-service") : null;
        if (serviceInput) serviceInput.focus();
      });
    }
    if (els.invoiceSettingsBtn) {
      els.invoiceSettingsBtn.addEventListener("click", openInvoiceSettingsModal);
    }
    if (els.invoiceSettingsModal) {
      els.invoiceSettingsModal.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "invoice-settings-cancel") {
          closeInvoiceSettingsModal();
        }
      });
    }
    if (els.invoiceSettingsSave) {
      els.invoiceSettingsSave.addEventListener("click", () => {
        saveInvoiceSettings()
          .then(() => {
            toast("Invoice settings saved.", "ok");
            closeInvoiceSettingsModal();
            const invoice = state.invoices.find((inv) => inv.id === state.selectedInvoiceId);
            renderInvoicePreview(invoice || null);
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }
  }

  async function getNextInvoiceNumber(issueDate) {
    const { data, error } = await CN.sb.rpc("next_invoice_number", {
      p_tenant_id: tenantId,
      p_issue_date: issueDate
    });
    if (error) throw error;
    return data;
  }

  async function loadInvoices() {
    const { data, error } = await CN.sb
      .from("invoices")
      .select("id, invoice_number, issue_date, total, currency, customer_name, customer_email, customer_address, invoice_items(id, label, qty, unit_price, line_total, notes)")
      .eq("tenant_id", tenantId)
      .order("issue_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function buildInvoiceContent(invoice) {
    const doc = document.createElement("div");
    doc.className = "invoice-doc";

    const header = document.createElement("div");
    header.className = "invoice-doc__header";

    const logoWrap = document.createElement("div");
    logoWrap.className = "invoice-doc__logo";
    const logo = document.createElement("img");
    logo.alt = "Clean-Nest logo";
    logo.src = "pics/logo.png";
    const logoText = document.createElement("div");
    logoText.className = "invoice-doc__logo-text";
    logoText.textContent = "Clean-Nest";
    logoWrap.appendChild(logo);
    logoWrap.appendChild(logoText);

    const title = document.createElement("div");
    title.className = "invoice-doc__header-title";
    title.textContent = "FACTURA";

    const number = document.createElement("div");
    number.className = "invoice-doc__header-number";
    const numberValue = document.createElement("div");
    numberValue.className = "invoice-doc__header-number-value";
    numberValue.textContent = invoice.invoice_number || "";
    const numberMeta = document.createElement("div");
    numberMeta.className = "invoice-doc__header-number-meta";
    const issueDate = document.createElement("div");
    issueDate.textContent = `Issue date: ${invoice.issue_date || ""}`;
    const currency = document.createElement("div");
    currency.textContent = `Currency: ${invoice.currency || "EUR"}`;
    numberMeta.appendChild(issueDate);
    numberMeta.appendChild(currency);
    number.appendChild(numberValue);
    number.appendChild(numberMeta);

    header.appendChild(logoWrap);
    header.appendChild(title);
    header.appendChild(number);
    doc.appendChild(header);

    const issuerText = (state.invoiceIssuerText || "").trim();
    if (issuerText) {
      const issuerBlock = document.createElement("div");
      issuerBlock.className = "invoice-doc__block";
      const issuerLabel = document.createElement("div");
      issuerLabel.className = "label";
      issuerLabel.textContent = "Issuer";
      const issuerBody = document.createElement("div");
      issuerBody.className = "invoice-doc__text";
      issuerBody.textContent = issuerText;
      issuerBlock.appendChild(issuerLabel);
      issuerBlock.appendChild(issuerBody);
      doc.appendChild(issuerBlock);
    }

    const customerBlock = document.createElement("div");
    customerBlock.className = "invoice-doc__block";
    const customerLabel = document.createElement("div");
    customerLabel.className = "label";
    customerLabel.textContent = "Customer";
    const customerSubLabel = document.createElement("div");
    customerSubLabel.className = "invoice-doc__sub-label";
    customerSubLabel.textContent = "Cliente (destinatario)";
    const customer = getInvoiceCustomerFields(invoice);
    customerBlock.appendChild(customerLabel);
    customerBlock.appendChild(customerSubLabel);

    const customerFields = document.createElement("div");
    customerFields.className = "invoice-doc__fields";

    const appendCustomerField = (labelText, subLabelText, valueText) => {
      const field = document.createElement("div");
      field.className = "invoice-doc__field";
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = labelText;
      field.appendChild(label);
      if (subLabelText) {
        const subLabel = document.createElement("div");
        subLabel.className = "invoice-doc__sub-label";
        subLabel.textContent = subLabelText;
        field.appendChild(subLabel);
      }
      const value = document.createElement("div");
      value.className = "invoice-doc__field-value";
      value.textContent = valueText || "";
      field.appendChild(value);
      customerFields.appendChild(field);
    };

    appendCustomerField("Name / Company", "Nombre y apellidos / Razon social:", customer.name);
    appendCustomerField("TAX ID/NIE/NIF/CIF:", "", customer.taxId);
    appendCustomerField("Address/Domicilio:", "", customer.address);
    appendCustomerField("Country/Pais:", "", customer.country);

    customerBlock.appendChild(customerFields);
    doc.appendChild(customerBlock);

    const table = document.createElement("div");
    table.className = "invoice-doc__table";
    const head = document.createElement("div");
    head.className = "invoice-doc__row head";
    ["Service / Concepto", "Qty / Cantidad", "Unit price / Precio unitario", "Total / Base imponible"].forEach((label) => {
      const cell = document.createElement("div");
      cell.textContent = label;
      head.appendChild(cell);
    });
    table.appendChild(head);

    const items = Array.isArray(invoice.invoice_items) ? invoice.invoice_items.slice() : [];
    if (!items.length) {
      items.push({
        label: "",
        qty: 1,
        unit_price: null,
        line_total: invoice.total
      });
    }
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "invoice-doc__row";
      const service = document.createElement("div");
      service.textContent = item && item.label ? item.label : "";
      const qty = document.createElement("div");
      qty.textContent = item && item.qty != null ? String(item.qty) : "1";
      const unit = document.createElement("div");
      unit.textContent = item && item.unit_price != null ? formatCurrency(item.unit_price) : "";
      const line = document.createElement("div");
      const lineTotal = item && item.line_total != null ? item.line_total : null;
      line.textContent = lineTotal != null ? formatCurrency(lineTotal) : "";
      row.appendChild(service);
      row.appendChild(qty);
      row.appendChild(unit);
      row.appendChild(line);
      table.appendChild(row);
    });
    doc.appendChild(table);

    const total = document.createElement("div");
    total.className = "invoice-doc__total";
    const totalValue = Number.isFinite(Number(invoice.total))
      ? Number(invoice.total)
      : items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
    total.textContent = `Total: ${formatCurrency(totalValue || 0)}`;
    doc.appendChild(total);

    const note = document.createElement("div");
    note.className = "invoice-doc__note";
    note.textContent = "EXENTO DE IGIC POR FRANQUICIA FISCAL";
    doc.appendChild(note);

    return doc;
  }

  function renderInvoicePreview(invoice) {
    if (!els.invoicePreview) return;
    if (!invoice) {
      els.invoicePreview.style.display = "none";
      els.invoicePreview.innerHTML = "";
      if (els.invoicePrintArea) els.invoicePrintArea.innerHTML = "";
      return;
    }
    els.invoicePreview.style.display = "block";
    els.invoicePreview.innerHTML = "";

    const head = document.createElement("div");
    head.className = "invoice-preview__head";
    const left = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = invoice.invoice_number || "Invoice";
    const meta = document.createElement("div");
    meta.className = "small-note";
    meta.textContent = invoice.issue_date || "";
    left.appendChild(title);
    left.appendChild(meta);
    head.appendChild(left);

    const actions = document.createElement("div");
    actions.className = "invoice-preview__actions";
    const printBtn = document.createElement("button");
    printBtn.className = "btn";
    printBtn.type = "button";
    printBtn.textContent = "Print";
    printBtn.addEventListener("click", () => {
      printInvoice(invoice);
    });
    const emailBtn = document.createElement("button");
    emailBtn.className = "btn";
    emailBtn.type = "button";
    emailBtn.textContent = "Email";
    emailBtn.addEventListener("click", () => {
      emailInvoice(invoice);
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteInvoice(invoice).catch((e) => toast(e.message || String(e), "error"));
    });
    actions.appendChild(printBtn);
    actions.appendChild(emailBtn);
    actions.appendChild(deleteBtn);
    head.appendChild(actions);
    els.invoicePreview.appendChild(head);
    els.invoicePreview.appendChild(buildInvoiceContent(invoice));
  }

  function renderInvoicePrintArea(invoice) {
    if (!els.invoicePrintArea) return;
    els.invoicePrintArea.innerHTML = "";
    els.invoicePrintArea.appendChild(buildInvoiceContent(invoice));
  }

  function printInvoice(invoice) {
    if (!els.invoicePrintArea) return;
    renderInvoicePrintArea(invoice);

    const originalTitle = document.title;
    const originalParent = els.invoicePrintArea.parentNode;
    const originalNext = els.invoicePrintArea.nextSibling;

    const cleanup = () => {
      document.body.classList.remove("is-printing-invoice");
      document.title = originalTitle;
      if (originalParent) {
        if (originalNext && originalNext.parentNode === originalParent) {
          originalParent.insertBefore(els.invoicePrintArea, originalNext);
        } else {
          originalParent.appendChild(els.invoicePrintArea);
        }
      }
      window.removeEventListener("afterprint", cleanup);
    };

    document.body.classList.add("is-printing-invoice");
    document.title = "";
    document.body.appendChild(els.invoicePrintArea);
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  function renderInvoiceList() {
    if (!els.invoiceList) return;
    els.invoiceList.innerHTML = "";
    if (!state.invoices.length) {
      els.invoiceList.innerHTML = '<div class="empty-state"><div class="empty-state__msg">No invoices yet.</div></div>';
      return;
    }
    state.invoices.forEach((invoice) => {
      const row = document.createElement("div");
      row.className = "invoice-list-row";
      if (state.selectedInvoiceId === invoice.id) row.classList.add("is-active");

      const main = document.createElement("div");
      main.className = "invoice-list-row__main";
      const title = document.createElement("div");
      title.className = "invoice-list-row__title";
      title.textContent = invoice.invoice_number || "Invoice";
      const meta = document.createElement("div");
      meta.className = "invoice-list-row__meta";
      meta.textContent = [invoice.customer_name, invoice.issue_date].filter(Boolean).join(" • ");
      main.appendChild(title);
      main.appendChild(meta);

      const total = document.createElement("div");
      total.className = "invoice-list-row__total";
      total.textContent = formatCurrency(invoice.total || 0);

      row.appendChild(main);
      row.appendChild(total);
      row.addEventListener("click", () => {
        selectInvoice(invoice.id);
      });
      els.invoiceList.appendChild(row);
    });
  }

  function selectInvoice(id) {
    state.selectedInvoiceId = id;
    const invoice = state.invoices.find((inv) => inv.id === id);
    renderInvoicePreview(invoice || null);
    renderInvoiceList();
  }

  async function refreshInvoices() {
    try {
      state.invoices = await loadInvoices();
      renderInvoiceList();
      if (state.selectedInvoiceId) {
        const invoice = state.invoices.find((inv) => inv.id === state.selectedInvoiceId);
        renderInvoicePreview(invoice || null);
      } else if (state.invoices[0]) {
        selectInvoice(state.invoices[0].id);
      }
    } catch (e) {
      if (els.invoiceList) {
        els.invoiceList.innerHTML = `<div class="empty-state"><div class="empty-state__msg">${e.message || String(e)}</div></div>`;
      }
    }
  }

  function buildInvoiceEmailBody(invoice) {
    const items = Array.isArray(invoice.invoice_items) ? invoice.invoice_items : [];
    const lines = [];
    lines.push(`Invoice ${invoice.invoice_number || ""}`);
    lines.push(`Issue date: ${invoice.issue_date || ""}`);
    lines.push("");
    lines.push("Customer:");
    const customer = getInvoiceCustomerFields(invoice);
    lines.push(`Name / company nombre y apellidos / razon social: ${customer.name}`);
    lines.push(`TAX ID/NIE/NIF/CIF: ${customer.taxId}`);
    lines.push(`Address/Domicilio: ${customer.address}`);
    lines.push(`Country/Pais: ${customer.country}`);
    if (customer.email) lines.push(`Email: ${customer.email}`);
    lines.push("");
    lines.push("Service:");
    if (items.length) {
      items.forEach((item) => {
        lines.push(`${item.label} | Qty: ${item.qty} | Unit price: ${formatCurrency(item.unit_price)} | Line total: ${formatCurrency(item.line_total)}`);
      });
    }
    lines.push("");
    lines.push(`Total: ${formatCurrency(invoice.total || 0)}`);
    return lines.join("\n");
  }

  function emailInvoice(invoice) {
    const email = invoice.customer_email || "";
    if (!email) {
      toast("Customer email is missing.", "error");
      return;
    }
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_number || ""}`);
    const body = encodeURIComponent(buildInvoiceEmailBody(invoice));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  async function deleteInvoice(invoice) {
    if (!invoice || !invoice.id) return;
    const ok = window.confirm("Delete this invoice? This cannot be undone.");
    if (!ok) return;
    const { error } = await CN.sb.from("invoices").delete().eq("id", invoice.id);
    if (error) throw error;
    state.selectedInvoiceId = null;
    toast("Invoice deleted.", "ok");
    await refreshInvoices();
  }

  async function createInvoice() {
    const issueDate = els.invoiceIssueDate ? (els.invoiceIssueDate.value || toDateInputValue(new Date())) : toDateInputValue(new Date());
    const customerName = els.invoiceCustomerName ? els.invoiceCustomerName.value.trim() : "";
    const customerEmail = els.invoiceCustomerEmail ? els.invoiceCustomerEmail.value.trim() : "";
    const customerTaxId = els.invoiceCustomerTaxId ? els.invoiceCustomerTaxId.value.trim() : "";
    const customerCountry = els.invoiceCustomerCountry ? els.invoiceCustomerCountry.value.trim() : "";
    const customerAddress = els.invoiceCustomerAddress ? els.invoiceCustomerAddress.value.trim() : "";
    let items = [];
    try {
      items = collectInvoiceItems();
    } catch (e) {
      toast(e.message || String(e), "error");
      return;
    }

    if (!customerName) {
      toast("Customer name is required.", "error");
      return;
    }
    if (!items.length) {
      toast("Add at least one item.", "error");
      return;
    }

    const invoiceTotal = items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
    const customerAddressPayload = packInvoiceCustomerAddress(customerAddress, customerTaxId, customerCountry);
    const invoiceNumber = await getNextInvoiceNumber(issueDate);
    const { data: invoice, error } = await CN.sb.from("invoices").insert({
      tenant_id: tenantId,
      owner_user_id: userId,
      property_id: null,
      status: "draft",
      issue_date: issueDate,
      total: invoiceTotal,
      currency: "EUR",
      invoice_number: invoiceNumber,
      customer_name: customerName,
      customer_email: customerEmail || null,
      customer_address: customerAddressPayload
    }).select("id").single();
    if (error) throw error;

    const itemsPayload = items.map((item) => ({
      tenant_id: tenantId,
      invoice_id: invoice.id,
      label: item.label,
      qty: item.qty,
      unit_price: item.unit_price,
      line_total: item.line_total
    }));
    const { error: itemError } = await CN.sb.from("invoice_items").insert(itemsPayload);
    if (itemError) throw itemError;

    toast("Invoice saved.", "ok");
    clearInvoiceForm();
    await refreshInvoices();
    selectInvoice(invoice.id);
  }

  async function refreshTaskViews() {
    await loadTasksCache();
    renderClientsList();
    await refreshTimeline();
    await refreshSchedule();
  }

  async function updateTask(id, patch) {
    const { error } = await CN.sb.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
  }

  async function assignTask(id, staffId) {
    const patch = { assigned_user_id: staffId || null };
    await updateTask(id, patch);
  }

  async function loadScheduleTasks(startDate, endDate) {
    return loadTimelineTasks(startDate, endDate);
  }

  async function refreshSchedule() {
    if (!els.scheduleList || !els.scheduleMonth) return;
    const monthDate = fromMonthInputValue(els.scheduleMonth.value) || new Date();
    const startDate = startOfMonth(monthDate);
    const endDate = endOfMonth(monthDate);
    const tasks = await loadScheduleTasks(startDate, endDate);

    let filtered = tasks.slice();
    const statusFilter = els.scheduleStatus ? els.scheduleStatus.value : "all";
    if (statusFilter === "scheduled") {
      filtered = filtered.filter((t) => STATUS_SCHEDULED.includes(t.status));
    } else if (statusFilter === "in_progress") {
      filtered = filtered.filter((t) => t.status === "in_progress");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((t) => t.status === "done");
    } else if (statusFilter === "cancelled") {
      filtered = filtered.filter((t) => t.status === "canceled");
    }

    if (els.scheduleStaff && els.scheduleStaff.value) {
      filtered = filtered.filter((t) => t.assigned_user_id === els.scheduleStaff.value);
    }
    if (els.scheduleUnassignedOnly && els.scheduleUnassignedOnly.checked) {
      filtered = filtered.filter((t) => !t.assigned_user_id);
    }

    state.schedule.tasks = filtered;
    renderSchedule(filtered);
  }

  function renderSchedule(tasks) {
    if (!els.scheduleList) return;
    if (!tasks.length) {
      els.scheduleList.innerHTML = '<div class="empty-state"><div class="empty-state__msg">No bookings for this month.</div></div>';
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");
    table.className = "data-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Property</th>
        <th>Staff</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");

    tasks.forEach((task) => {
      const row = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = task.day_date;

      const timeCell = document.createElement("td");
      timeCell.textContent = fmtTimeRange(task.start_at, task.end_at, task.duration_minutes);

      const propCell = document.createElement("td");
      const label = getLabelById(task.label_id);
      const propAddr = (task.property && task.property.address) || (getPropertyById(task.property_id) || {}).address || "Property";
      propCell.innerHTML = `<strong>${propAddr}</strong><div class="small-muted">${label ? label.name : ""}</div>`;

      const staffCell = document.createElement("td");
      const staffSelect = document.createElement("select");
      staffSelect.className = "input";
      const optNone = document.createElement("option");
      optNone.value = "";
      optNone.textContent = "Unassigned";
      staffSelect.appendChild(optNone);
      state.staff.forEach((staff) => {
        const opt = document.createElement("option");
        opt.value = staff.id;
        opt.textContent = staff.name || staff.email || "Staff";
        staffSelect.appendChild(opt);
      });
      staffSelect.value = task.assigned_user_id || "";
      staffSelect.addEventListener("change", () => {
        assignTask(task.id, staffSelect.value)
          .then(refreshTaskViews)
          .catch((e) => toast(e.message || String(e), "error"));
      });
      staffCell.appendChild(staffSelect);

      const statusCell = document.createElement("td");
      const badge = statusBadge(task.status);
      const badgeEl = document.createElement("span");
      badgeEl.className = `badge ${badge.className}`;
      badgeEl.textContent = badge.label;
      statusCell.appendChild(badgeEl);

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "row-actions";
      const detailBtn = document.createElement("button");
      detailBtn.className = "btn";
      detailBtn.type = "button";
      detailBtn.textContent = "Details";
      detailBtn.addEventListener("click", () => {
        openTaskDetail(task).catch((e) => toast(e.message || String(e), "error"));
      });
      actions.appendChild(detailBtn);
      actionsCell.appendChild(actions);

      row.appendChild(dateCell);
      row.appendChild(timeCell);
      row.appendChild(propCell);
      row.appendChild(staffCell);
      row.appendChild(statusCell);
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    els.scheduleList.innerHTML = "";
    els.scheduleList.appendChild(wrap);
  }

  function exportScheduleCsv() {
    const tasks = state.schedule.tasks || [];
    const rows = tasks.map((task) => {
      const prop = getPropertyById(task.property_id);
      const label = getLabelById(task.label_id);
      return [
        task.day_date,
        fmtTimeRange(task.start_at, task.end_at, task.duration_minutes),
        prop ? prop.address : "",
        label ? label.name : "",
        task.assigned_user_id ? getStaffName(task.assigned_user_id) : "Unassigned",
        task.status
      ];
    });
    downloadCsv("schedule.csv", ["Date", "Time", "Property", "Label", "Staff", "Status"], rows);
  }

  function wireActivitiesControls() {
    if (els.activitiesMonth && !els.activitiesMonth.value) {
      els.activitiesMonth.value = toMonthInputValue(new Date());
    }
    if (els.activitiesMonth) {
      els.activitiesMonth.addEventListener("change", () => refreshActivities().catch((e) => toast(e.message || String(e), "error")));
    }
    if (els.activityTypeNewBtn) {
      els.activityTypeNewBtn.addEventListener("click", () => openActivityTypeModal());
    }
    if (els.activityNewBtn) {
      els.activityNewBtn.addEventListener("click", () => openActivityModal());
    }
    if (els.activityTypeModal) {
      els.activityTypeModal.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "activitytype-cancel") {
          closeActivityTypeModal();
        }
      });
    }
    if (els.activityModal) {
      els.activityModal.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "activity-cancel") {
          closeActivityModal();
        }
      });
    }
    if (els.activityTypeSave) {
      els.activityTypeSave.addEventListener("click", () => {
        saveActivityType().catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (els.activitySave) {
      els.activitySave.addEventListener("click", () => {
        saveActivity().catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (els.activityTypeSelect) {
      els.activityTypeSelect.addEventListener("change", () => {
        const val = els.activityTypeSelect.value;
        if (val === "custom") {
          if (els.activityCustomName) els.activityCustomName.style.display = "block";
        } else {
          if (els.activityCustomName) els.activityCustomName.style.display = "none";
          const type = state.activityTypes.find((t) => t.id === val);
          if (type && els.activityDuration) {
            els.activityDuration.value = String(type.default_duration_minutes || 30);
          }
        }
      });
    }
  }

  async function loadActivities(startDate, endDate) {
    const { data, error } = await CN.sb
      .from("activities")
      .select("*")
      .eq("tenant_id", tenantId)
      .gte("day_date", toDateInputValue(startDate))
      .lte("day_date", toDateInputValue(endDate))
      .order("day_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function refreshActivities() {
    if (!els.activitiesPanel || !els.activitiesMonth) return;
    try {
      const monthDate = fromMonthInputValue(els.activitiesMonth.value) || new Date();
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      const activities = await loadActivities(startDate, endDate);
      renderActivities(activities);
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      els.activitiesPanel.innerHTML = `<div class="empty-state"><div class="empty-state__msg">${msg}</div></div>`;
    }
  }

  function renderActivities(activities) {
    if (!els.activitiesPanel) return;
    if (!activities.length) {
      els.activitiesPanel.innerHTML = '<div class="empty-state"><div class="empty-state__msg">No activities for this month.</div></div>';
      return;
    }
    const byDay = groupBy(activities, (a) => a.day_date);
    const sortedDays = Array.from(byDay.keys()).sort();
    els.activitiesPanel.innerHTML = "";

    sortedDays.forEach((dayKey) => {
      const dayDate = new Date(dayKey + "T00:00:00");
      const dayCard = document.createElement("div");
      dayCard.className = "timeline-day";
      const head = document.createElement("div");
      head.className = "timeline-day__head";
      const title = document.createElement("div");
      title.className = "timeline-day__title";
      const titleStrong = document.createElement("strong");
      titleStrong.textContent = fmtDateLabel(dayDate);
      const titleSub = document.createElement("p");
      titleSub.className = "small-note";
      titleSub.textContent = `${byDay.get(dayKey).length} activities`;
      title.appendChild(titleStrong);
      title.appendChild(titleSub);
      head.appendChild(title);
      dayCard.appendChild(head);

      const body = document.createElement("div");
      body.className = "timeline-day__body";
      byDay.get(dayKey).forEach((activity) => {
        const booking = document.createElement("div");
        booking.className = "timeline-booking";
        if (activity.status === "done") booking.classList.add("is-done");
        if (activity.status === "canceled") booking.classList.add("is-cancelled");
        applyActivityColor(booking, getActivityColor(activity));

        const main = document.createElement("div");
        main.className = "timeline-booking__main";
        const time = document.createElement("div");
        time.className = "timeline-booking__time";
        time.textContent = fmtTimeRange(activity.start_at, null, activity.duration_minutes);
        const addr = document.createElement("div");
        addr.className = "timeline-booking__addr";
        const prop = activity.property_id ? getPropertyById(activity.property_id) : null;
        const typeName = activity.type_name_snapshot || "Activity";
        addr.textContent = prop ? prop.address : typeName;
        const meta = document.createElement("div");
        meta.className = "timeline-booking__meta";
        const staffName = activity.assigned_user_id ? getStaffName(activity.assigned_user_id) : "Unassigned";
        const metaParts = [];
        if (prop) metaParts.push(typeName);
        metaParts.push(staffName);
        if (activity.notes) metaParts.push(activity.notes);
        meta.textContent = metaParts.filter(Boolean).join(" | ");
        main.appendChild(time);
        main.appendChild(addr);
        main.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "timeline-booking__actions";
        if (activity.status !== "done" && activity.status !== "canceled") {
          const startBtn = document.createElement("button");
          startBtn.className = "btn";
          startBtn.type = "button";
          startBtn.textContent = "Start";
          startBtn.addEventListener("click", () => {
            updateActivity(activity.id, { status: "in_progress", started_at: new Date().toISOString() })
              .then(refreshActivities)
              .catch((e) => toast(e.message || String(e), "error"));
          });
          const doneBtn = document.createElement("button");
          doneBtn.className = "btn";
          doneBtn.type = "button";
          doneBtn.textContent = "Done";
          doneBtn.addEventListener("click", () => {
            updateActivity(activity.id, { status: "done", completed_at: new Date().toISOString() })
              .then(refreshActivities)
              .catch((e) => toast(e.message || String(e), "error"));
          });
          const cancelBtn = document.createElement("button");
          cancelBtn.className = "btn";
          cancelBtn.type = "button";
          cancelBtn.textContent = "Cancel";
          cancelBtn.addEventListener("click", () => {
            updateActivity(activity.id, { status: "canceled" })
              .then(refreshActivities)
              .catch((e) => toast(e.message || String(e), "error"));
          });
          actions.appendChild(startBtn);
          actions.appendChild(doneBtn);
          actions.appendChild(cancelBtn);
        } else {
          const reopen = document.createElement("button");
          reopen.className = "btn";
          reopen.type = "button";
          reopen.textContent = "Reopen";
          reopen.addEventListener("click", () => {
            updateActivity(activity.id, { status: "planned", started_at: null, completed_at: null })
              .then(refreshActivities)
              .catch((e) => toast(e.message || String(e), "error"));
          });
          actions.appendChild(reopen);
        }

        booking.appendChild(main);
        booking.appendChild(actions);
        body.appendChild(booking);
      });

      dayCard.appendChild(body);
      els.activitiesPanel.appendChild(dayCard);
    });
  }

  function openActivityTypeModal() {
    if (!els.activityTypeModal) return;
    if (els.activityTypeName) els.activityTypeName.value = "";
    if (els.activityTypeDefaultDuration) els.activityTypeDefaultDuration.value = "30";
    resetPaletteSelection("activityTypeColor");
    els.activityTypeModal.removeAttribute("hidden");
  }

  function closeActivityTypeModal() {
    if (els.activityTypeModal) els.activityTypeModal.setAttribute("hidden", "");
  }

  async function saveActivityType() {
    const name = els.activityTypeName ? els.activityTypeName.value.trim() : "";
    if (!name) {
      toast("Type name is required.", "error");
      return;
    }
    const duration = els.activityTypeDefaultDuration ? Number(els.activityTypeDefaultDuration.value || 30) : 30;
    const color = normalizeHexColor(getSelectedPaletteColor("activityTypeColor"));
    const { error } = await CN.sb.from("activity_types").insert({
      tenant_id: tenantId,
      name,
      default_duration_minutes: duration,
      color: color || null,
      is_archived: false,
      created_by_user_id: userId
    });
    if (error) throw error;
    toast("Activity type created.", "ok");
    closeActivityTypeModal();
    await loadActivityTypes();
    populateActivityTypeSelect();
  }

  function populateActivityTypeSelect() {
    if (!els.activityTypeSelect) return;
    els.activityTypeSelect.innerHTML = "";
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "Custom";
    els.activityTypeSelect.appendChild(custom);
    state.activityTypes.forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type.id;
      opt.textContent = type.name;
      els.activityTypeSelect.appendChild(opt);
    });
  }

  function populateActivityStaffSelect() {
    if (!els.activityStaff) return;
    els.activityStaff.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "Unassigned";
    els.activityStaff.appendChild(none);
    state.staff.forEach((staff) => {
      const opt = document.createElement("option");
      opt.value = staff.id;
      opt.textContent = staff.name || staff.email || "Staff";
      els.activityStaff.appendChild(opt);
    });
  }

  function populateActivityPropertySelect() {
    if (!els.activityProperty) return;
    els.activityProperty.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "No property";
    els.activityProperty.appendChild(none);
    state.properties.forEach((prop) => {
      const opt = document.createElement("option");
      opt.value = prop.id;
      opt.textContent = prop.address || "Property";
      els.activityProperty.appendChild(opt);
    });
  }

  function openActivityModal() {
    if (!els.activityModal) return;
    populateActivityTypeSelect();
    populateActivityStaffSelect();
    populateActivityPropertySelect();
    if (els.activityCustomName) {
      els.activityCustomName.value = "";
      els.activityCustomName.style.display = "none";
    }
    if (els.activityDate) els.activityDate.value = toDateInputValue(new Date());
    if (els.activityTimeFrom) els.activityTimeFrom.value = "09:00";
    if (els.activityDuration) els.activityDuration.value = "30";
    if (els.activityNotes) els.activityNotes.value = "";
    if (els.activityModalTitle) els.activityModalTitle.textContent = "New activity";
    if (els.activityModalHint) els.activityModalHint.textContent = "Schedule something custom";
    if (els.activityTypeSelect) els.activityTypeSelect.value = "custom";
    if (els.activityCustomName) els.activityCustomName.style.display = "block";
    els.activityModal.removeAttribute("hidden");
  }

  function closeActivityModal() {
    if (els.activityModal) els.activityModal.setAttribute("hidden", "");
  }

  async function saveActivity() {
    const typeId = els.activityTypeSelect ? els.activityTypeSelect.value : "custom";
    let typeName = "";
    let typeColor = "";
    if (typeId === "custom") {
      typeName = els.activityCustomName ? els.activityCustomName.value.trim() : "";
      if (!typeName) {
        toast("Custom name is required.", "error");
        return;
      }
    } else {
      const type = state.activityTypes.find((t) => t.id === typeId);
      typeName = type ? type.name : "";
      typeColor = type ? type.color || "" : "";
    }

    const day = els.activityDate ? els.activityDate.value : "";
    if (!day) {
      toast("Date is required.", "error");
      return;
    }
    const duration = els.activityDuration ? Number(els.activityDuration.value || 30) : 30;
    const staffId = els.activityStaff ? els.activityStaff.value : "";
    const propId = els.activityProperty ? els.activityProperty.value : "";
    const notes = els.activityNotes ? els.activityNotes.value.trim() : "";
    const color = normalizeHexColor(typeColor);
    const time = els.activityTimeFrom ? els.activityTimeFrom.value : "";
    const payload = {
      tenant_id: tenantId,
      type_id: typeId === "custom" ? null : typeId,
      type_name_snapshot: typeName,
      day_date: day,
      duration_minutes: duration,
      status: "planned",
      assigned_user_id: staffId || null,
      property_id: propId || null,
      notes: notes || null,
      created_by_user_id: userId
    };
    if (color) {
      payload.color = color;
    }
    if (time) {
      const start = new Date(`${day}T${time}:00`);
      payload.start_at = start.toISOString();
    }
    const { error } = await CN.sb.from("activities").insert(payload);
    if (error) throw error;
    toast("Activity created.", "ok");
    closeActivityModal();
    await refreshActivities();
  }

  async function updateActivity(id, patch) {
    const { error } = await CN.sb.from("activities").update(patch).eq("id", id);
    if (error) throw error;
  }

  function setActiveTab(tabKey) {
    state.activeTab = tabKey;
    if (els.adminTabs) {
      els.adminTabs.querySelectorAll('[data-action="admin-tab"]').forEach((btn) => {
        btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tabKey);
      });
    }
    const tabs = {
      properties: els.adminTabProperties,
      timeline: els.adminTabTimeline,
      schedule: els.adminTabSchedule,
      activities: els.adminTabActivities,
      invoices: els.adminTabInvoices,
      modules: els.adminTabModules
    };
    Object.keys(tabs).forEach((key) => {
      if (!tabs[key]) return;
      tabs[key].style.display = key === tabKey ? "block" : "none";
    });
    if (tabKey === "modules") {
      renderModulesList();
    }
    if (tabKey === "activities") {
      refreshActivities().catch((e) => toast(e.message || String(e), "error"));
    }
    if (tabKey === "timeline") {
      refreshTimeline().catch((e) => toast(e.message || String(e), "error"));
    }
    if (tabKey === "invoices") {
      refreshInvoices().catch((e) => toast(e.message || String(e), "error"));
    }
  }

  function wireTabs() {
    if (!els.adminTabs) return;
    els.adminTabs.querySelectorAll('[data-action="admin-tab"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveTab(btn.getAttribute("data-tab"));
      });
    });
  }

  function applyModuleVisibility() {
    if (!els.adminTabs) return;
    const buttons = Array.from(els.adminTabs.querySelectorAll('[data-action="admin-tab"]'));
    buttons.forEach((btn) => {
      const key = btn.getAttribute("data-tab");
      const enabled = state.modules[key] !== false;
      btn.style.display = enabled ? "" : "none";
      const section = {
        properties: els.adminTabProperties,
        timeline: els.adminTabTimeline,
        schedule: els.adminTabSchedule,
        activities: els.adminTabActivities,
        invoices: els.adminTabInvoices,
        modules: els.adminTabModules
      }[key];
      if (section) {
        section.style.display = enabled && state.activeTab === key ? "block" : "none";
      }
    });

    if (state.modules[state.activeTab] === false) {
      const firstEnabled = MODULE_DEFS.find((m) => state.modules[m.key] !== false);
      if (firstEnabled) setActiveTab(firstEnabled.key);
    }
  }

  async function updateModule(key, enabled) {
    if (key === "modules") {
      toast("Modules tab is always enabled.", "error");
      return;
    }
    const { error } = await CN.sb.from("tenant_modules").upsert({
      tenant_id: tenantId,
      module_key: key,
      is_enabled: enabled
    }, { onConflict: "tenant_id,module_key" });
    if (error) throw error;
    state.modules[key] = enabled;
    applyModuleVisibility();
  }

  function renderModulesList() {
    if (!els.modulesList) return;
    els.modulesList.innerHTML = "";
    MODULE_DEFS.forEach((mod) => {
      const row = document.createElement("label");
      row.className = "pe-staff-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      const isLocked = mod.key === "modules";
      input.checked = isLocked ? true : state.modules[mod.key] !== false;
      if (isLocked) {
        input.disabled = true;
        input.title = "Required";
      } else {
        input.addEventListener("change", (ev) => {
          updateModule(mod.key, ev.target.checked)
            .then(() => toast("Module updated.", "ok"))
            .catch((e) => toast(e.message || String(e), "error"));
        });
      }
      const label = document.createElement("div");
      label.textContent = isLocked ? `${mod.label} (required)` : mod.label;
      row.appendChild(input);
      row.appendChild(label);
      els.modulesList.appendChild(row);
    });
  }

  function setAdminAlert(message, kind) {
    if (!els.adminAlert) return;
    els.adminAlert.textContent = message;
    els.adminAlert.classList.remove("ok", "error");
    els.adminAlert.classList.add(kind === "ok" ? "ok" : "error");
    els.adminAlert.style.display = "block";
    clearTimeout(setAdminAlert._t);
    setAdminAlert._t = setTimeout(() => {
      if (els.adminAlert) els.adminAlert.style.display = "none";
    }, 3500);
  }

  function renderAdminToolSelects() {
    if (els.removeClientSelect) {
      els.removeClientSelect.innerHTML = '<option value="">Select a client</option>';
      state.clients.forEach((client) => {
        const opt = document.createElement("option");
        opt.value = client.id;
        opt.textContent = client.name || client.email || "Client";
        els.removeClientSelect.appendChild(opt);
      });
    }
    if (els.removeStaffSelect) {
      els.removeStaffSelect.innerHTML = '<option value="">Select a staff member</option>';
      state.staff.forEach((staff) => {
        const opt = document.createElement("option");
        opt.value = staff.id;
        opt.textContent = staff.name || staff.email || "Staff";
        els.removeStaffSelect.appendChild(opt);
      });
    }
  }

  async function callAdminFunction(name, body) {
    const { data: sessionData, error: sessionError } = await CN.sb.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error("No active session. Please sign in again.");
    }
    const accessToken = sessionData.session.access_token;
    const { url, key } = getSupabaseConfig();
    const res = await fetch(`${url}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: key
      },
      body: JSON.stringify(body || {})
    });
    const text = await res.text();
    if (!res.ok) {
      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed.error || text || "Function error");
      } catch {
        throw new Error(text || "Function error");
      }
    }
    return text ? JSON.parse(text) : {};
  }

  async function handleAddUser(role) {
    const isClient = role === "client";
    const nameEl = isClient ? els.addClientName : els.addStaffName;
    const emailEl = isClient ? els.addClientEmail : els.addStaffEmail;
    const phoneEl = isClient ? els.addClientPhone : null;
    const passEl = isClient ? els.addClientPassword : els.addStaffPassword;
    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const phone = phoneEl ? phoneEl.value.trim() : "";
    const password = passEl ? passEl.value.trim() : "";
    if (!name || !email || !password) {
      setAdminAlert("Name, email, and password are required.", "error");
      return;
    }
    try {
      setAdminAlert("Creating user...", "ok");
      await callAdminFunction("admin-create-user", {
        role,
        name,
        email,
        phone,
        password
      });
      if (nameEl) nameEl.value = "";
      if (emailEl) emailEl.value = "";
      if (phoneEl) phoneEl.value = "";
      if (passEl) passEl.value = "";
      await refreshBaseData();
      renderClientsList();
      renderAdminToolSelects();
      populateScheduleStaffOptions();
      setAdminAlert("User created.", "ok");
    } catch (e) {
      setAdminAlert(e.message || String(e), "error");
    }
  }

  async function handleRemoveUser(role) {
    const select = role === "client" ? els.removeClientSelect : els.removeStaffSelect;
    const userId = select ? select.value : "";
    if (!userId) {
      setAdminAlert("Select a user first.", "error");
      return;
    }
    if (!window.confirm("This will remove the user and related data. Continue?")) return;
    try {
      setAdminAlert("Removing user...", "ok");
      await callAdminFunction("admin-delete-user", { user_id: userId });
      await refreshBaseData();
      renderClientsList();
      renderAdminToolSelects();
      populateScheduleStaffOptions();
      setAdminAlert("User removed.", "ok");
    } catch (e) {
      setAdminAlert(e.message || String(e), "error");
    }
  }

  async function handleExportBackup() {
    try {
      setAdminAlert("Preparing export...", "ok");
      const data = await callAdminFunction("admin-export-json", {});
      const fileName = `backup-${data.tenant_slug || data.tenant_id || "tenant"}-${toDateInputValue(new Date())}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      if (els.backupHint) els.backupHint.textContent = "Exported " + new Date().toLocaleString();
      setAdminAlert("Export complete.", "ok");
    } catch (e) {
      setAdminAlert(e.message || String(e), "error");
    }
  }

  function wireAdminTools() {
    if (els.adminToolsBtn && els.adminToolsDrawer) {
      els.adminToolsBtn.addEventListener("click", () => {
        els.adminToolsDrawer.setAttribute("aria-hidden", "false");
        els.adminToolsDrawer.classList.add("is-open");
      });
    }
    if (els.adminToolsDrawer) {
      els.adminToolsDrawer.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "close-admin-tools") {
          els.adminToolsDrawer.classList.remove("is-open");
          els.adminToolsDrawer.setAttribute("aria-hidden", "true");
        }
      });
    }

    if (els.addClientBtn) {
      els.addClientBtn.addEventListener("click", () => handleAddUser("client"));
    }
    if (els.addStaffBtn) {
      els.addStaffBtn.addEventListener("click", () => handleAddUser("staff"));
    }
    if (els.removeClientBtn) {
      els.removeClientBtn.addEventListener("click", () => handleRemoveUser("client"));
    }
    if (els.removeStaffBtn) {
      els.removeStaffBtn.addEventListener("click", () => handleRemoveUser("staff"));
    }
    if (els.exportBackupBtn) {
      els.exportBackupBtn.addEventListener("click", handleExportBackup);
    }

    const notReady = () => toast("This action is not wired yet.", "error");
    [
      els.importBackupBtn,
      els.storageRefreshBtn,
      els.storageCleanupBtn,
      els.auditDownloadCsv,
      els.auditDownloadJson
    ].forEach((btn) => {
      if (btn) btn.addEventListener("click", notReady);
    });
  }

  async function init() {
    try {
      await requireAdminProfile();
    } catch (e) {
      return;
    }

    if (els.roleTag) els.roleTag.textContent = "ADMIN";
    if (els.userTag) els.userTag.textContent = profile.name || "Admin";
    if (els.logoutBtn) {
      els.logoutBtn.addEventListener("click", () => CN.signOut().catch((e) => toast(e.message || String(e), "error")));
    }

    wireTabs();
    wireAdminTools();
    wireTimelineControls();
    wireScheduleControls();
    wireActivitiesControls();
    wireInvoiceControls();

    if (els.adminSearch) els.adminSearch.addEventListener("input", renderClientsList);
    if (els.filterActiveSession) els.filterActiveSession.addEventListener("change", renderClientsList);
    if (els.filterNeedsAttention) els.filterNeedsAttention.addEventListener("change", renderClientsList);
    if (els.adminSort) els.adminSort.addEventListener("change", renderClientsList);
    if (els.timelineAddTbd && els.timelineAddTime) {
      els.timelineAddTbd.addEventListener("change", () => {
        els.timelineAddTime.disabled = els.timelineAddTbd.checked;
      });
    }

    let baseDataError = null;
    try {
      await refreshBaseData();
    } catch (e) {
      baseDataError = e;
      console.error("Base data load failed:", e);
      toast(e.message || String(e), "error");
    }

    try {
      await loadInvoiceSettings();
    } catch (e) {
      state.invoiceIssuerText = "";
      toast(e.message || String(e), "error");
    }

    populateScheduleStaffOptions();
    populateActivityTypeSelect();
    renderAdminToolSelects();

    renderClientsList();
    renderPropertyDetail(null);
    clearInvoiceForm();
    renderModulesList();
    await refreshInvoices();

    const firstEnabled = MODULE_DEFS.find((m) => state.modules[m.key] !== false);
    setActiveTab(firstEnabled ? firstEnabled.key : "properties");
    applyModuleVisibility();

    await refreshTimeline().catch(() => {});
    await refreshSchedule().catch(() => {});
    await refreshActivities().catch(() => {});

    if (baseDataError && els.activitiesPanel) {
      const msg = baseDataError.message || String(baseDataError);
      if (!els.activitiesPanel.textContent.trim()) {
        els.activitiesPanel.innerHTML = `<div class="empty-state"><div class="empty-state__msg">${msg}</div></div>`;
      }
    }
  }

  init();
})();
