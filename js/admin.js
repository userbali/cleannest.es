/* global CN, CN_UI */

(async function () {
  const { $, toast } = CN_UI;
  let profile;
  let tenantId;
  let userId;

  const MODULE_DEFS = [
    { key: "properties", label: "Properties" },
    { key: "timeline", label: "Timeline" },
    { key: "planner", label: "Planner" },
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
    billingContacts: [],
    propertyStaff: [],
    taskLabels: [],
    tasksCache: [],
    activityTypes: [],
    modules: {},
    invoices: [],
    selectedInvoiceId: null,
    invoiceIssuerText: "",
    selectedPropertyId: null,
    pendingBillingContactPropertyId: null,
    activityEditing: null,
    activeTab: "properties",
    timeline: {
      month: "",
      metric: "jobs",
      selectedDate: null,
      selectedPropertyId: null,
      staffTouched: false,
      activities: []
    },
      planner: {
        month: "",
        scrollLeft: null,
        hasUserScrolled: false
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

    let plannerPickContext = null;

  const taskDetail = {
    modal: null,
    title: null,
    meta: null,
    checklist: null,
    checklistHint: null,
    setupList: null,
    setupHint: null,
    rescheduleCard: null,
    rescheduleDate: null,
    rescheduleTime: null,
    rescheduleDuration: null,
    rescheduleTbd: null,
    rescheduleSave: null,
    rescheduleCancel: null,
    rescheduleBtn: null,
    deleteBtn: null,
    refGallery: null,
    workGallery: null,
    refUploadBtn: null,
    workUploadBtn: null,
    refInput: null,
    workInput: null,
    doneBtn: null,
    cancelBtn: null,
    reopenBtn: null,
    emailBtn: null,
    invoiceBtn: null,
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
    adminTabPlanner: $("adminTabPlanner"),
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
      plannerMonth: $("plannerMonth"),
      plannerJumpToday: $("plannerJumpToday"),
      plannerScrollLeft: $("plannerScrollLeft"),
      plannerScrollRight: $("plannerScrollRight"),
      plannerTimeline: $("plannerTimeline"),
      plannerGrid: $("plannerGrid"),
      plannerScroll: $("plannerScroll"),
      plannerPickModal: $("plannerPickModal"),
      plannerPickList: $("plannerPickList"),
      plannerPickHint: $("plannerPickHint"),
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
    invoiceSettingsSave: $("invoiceSettingsSave"),
    invoiceProperty: $("invoiceProperty"),
    invoiceBillingContact: $("invoiceBillingContact"),
    invoiceBillingNewBtn: $("invoiceBillingNewBtn"),
    billingContactModal: $("billingContactModal"),
    billingContactName: $("billingContactName"),
    billingContactEmail: $("billingContactEmail"),
    billingContactPhone: $("billingContactPhone"),
    billingContactTaxId: $("billingContactTaxId"),
    billingContactCountry: $("billingContactCountry"),
    billingContactAddress: $("billingContactAddress"),
    billingContactSave: $("billingContactSave")
  };

    function detachActivityModals() {
      [els.activityTypeModal, els.activityModal].forEach((modal) => {
        if (!modal) return;
        const parent = modal.parentElement;
        if (parent && parent.id === "adminTabActivities") {
          document.body.appendChild(modal);
        }
      });
    }

    function detachTimelineModal() {
      if (!els.timelineAddModal) return;
      const parent = els.timelineAddModal.parentElement;
      if (parent && parent.id === "adminTabTimeline") {
        document.body.appendChild(els.timelineAddModal);
      }
    }

    function detachPlannerPickModal() {
      if (!els.plannerPickModal) return;
      const parent = els.plannerPickModal.parentElement;
      if (parent && parent.id === "adminTabPlanner") {
        document.body.appendChild(els.plannerPickModal);
      }
    }

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

  function toTimeInputValue(value) {
    if (value == null || value === "") return "";
    const numeric = typeof value === "number"
      ? value
      : (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)) ? Number(value) : null);
    if (Number.isFinite(numeric)) {
      const safe = clampNumber(numeric, 0, 24 * 60 - 1);
      const h = String(Math.floor(safe / 60)).padStart(2, "0");
      const m = String(Math.floor(safe % 60)).padStart(2, "0");
      return `${h}:${m}`;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
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

  const SETUP_LABEL_PREFIX = "SETUP::";
  function isSetupLabel(label) {
    return String(label || "").startsWith(SETUP_LABEL_PREFIX);
  }
  function stripSetupLabel(label) {
    const raw = String(label || "");
    return isSetupLabel(raw) ? raw.slice(SETUP_LABEL_PREFIX.length) : raw;
  }
  function buildSetupLabel(label) {
    return `${SETUP_LABEL_PREFIX}${label}`;
  }

  function applyActivityColor(el, color) {
    if (!el) return;
    const normalized = normalizeHexColor(color);
    if (!normalized) return;
    el.classList.add("has-activity-color");
    el.style.setProperty("--activity-color", normalized);
  }

  function formatDurationLabel(minutes) {
    const total = Math.max(0, Math.round(Number(minutes) || 0));
    const days = Math.floor(total / (24 * 60));
    const rem = total % (24 * 60);
    const hours = Math.floor(rem / 60);
    const mins = rem % 60;
    if (!days && !hours && mins) return `${mins} min`;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (mins) parts.push(`${mins}m`);
    return parts.length ? parts.join(" ") : "0m";
  }

  function ensureDurationOption(selectEl, minutes) {
    if (!selectEl) return;
    const value = String(Math.max(0, Math.round(Number(minutes) || 0)));
    if (!value) return;
    const existing = Array.from(selectEl.options || []).find((opt) => opt.value === value);
    if (!existing) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = formatDurationLabel(value);
      selectEl.appendChild(opt);
    }
    selectEl.value = value;
  }

  function getTaskDurationMinutes(task) {
    const raw = Number(task && task.duration_minutes);
    if (Number.isFinite(raw) && raw > 0) return raw;
    if (task && task.start_at && task.end_at) {
      const start = new Date(task.start_at);
      const end = new Date(task.end_at);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        const diff = Math.round((end.getTime() - start.getTime()) / 60000);
        if (diff > 0) return diff;
      }
    }
    return 120;
  }

  function getPlannerScroller() {
    if (els.plannerScroll) {
      const sw = Number(els.plannerScroll.scrollWidth || 0);
      const cw = Number(els.plannerScroll.clientWidth || 0);
      if (sw > cw + 1) return els.plannerScroll;
    }
    if (els.plannerTimeline) {
      const sw = Number(els.plannerTimeline.scrollWidth || 0);
      const cw = Number(els.plannerTimeline.clientWidth || 0);
      if (sw > cw + 1) return els.plannerTimeline;
    }
    return els.plannerScroll || els.plannerTimeline || null;
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

  function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function minutesFromIso(ts) {
    if (!ts) return null;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return null;
    return d.getHours() * 60 + d.getMinutes();
  }

  function fmtDateTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return `${toDateInputValue(d)} ${d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })}`;
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
      .select("id, day_date, status, duration_minutes, start_at, end_at, completed_at, notes, price, add_ons, invoice_id, completion_email_sent_at, assigned_user_id, property_id, label_id, property:properties(address)")
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
      const setupItem = isSetupLabel(item.label);
      if (setupItem) row.classList.add("is-setup");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(item.done);
      const label = document.createElement("label");
      label.textContent = stripSetupLabel(item.label) || "Checklist item";
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
    closeTaskRescheduleCard();
  }

  function closeTaskRescheduleCard() {
    if (taskDetail.rescheduleCard) taskDetail.rescheduleCard.setAttribute("hidden", "");
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
              <div class="card" id="taskRescheduleCard" hidden>
                <div class="row" style="justify-content:space-between; align-items:center;">
                  <h3 style="margin:0;">Reschedule</h3>
                  <span class="small-note">Update date & time</span>
                </div>
                <div class="row-2" style="margin-top:10px;">
                  <div>
                    <div class="label">Date</div>
                    <input class="input" id="taskRescheduleDate" type="date"/>
                  </div>
                  <div>
                    <div class="label">Start time</div>
                    <input class="input" id="taskRescheduleTime" type="time" value="09:00"/>
                  </div>
                </div>
                <div style="margin-top:10px;">
                  <div class="label">Duration</div>
                  <select class="input" id="taskRescheduleDuration">
                    <option value="60">1h</option>
                    <option value="90">1h 30m</option>
                    <option selected="" value="120">2h</option>
                    <option value="180">3h</option>
                    <option value="240">4h</option>
                  </select>
                </div>
                <div style="margin-top:10px;">
                  <label class="chip-check">
                    <input id="taskRescheduleTbd" type="checkbox"/>
                    <span>Time TBD (save without time)</span>
                  </label>
                </div>
                <div class="row" style="justify-content:flex-end; gap:8px; margin-top:12px;">
                  <button class="btn btn-primary" id="taskRescheduleSave" type="button">Save</button>
                  <button class="btn" id="taskRescheduleCancel" type="button">Close</button>
                </div>
              </div>
              <div class="card">
                <div class="row" style="justify-content:space-between; align-items:center;">
                  <h3 style="margin:0;">Checklist</h3>
                  <span class="small-note" id="taskChecklistHint"></span>
                </div>
                <div class="checklist" id="taskChecklistList"></div>
              </div>
              <div class="card">
                <div class="row" style="justify-content:space-between; align-items:center;">
                  <h3 style="margin:0;">Setup</h3>
                  <span class="small-note" id="taskSetupHint"></span>
                </div>
                <div class="checklist" id="taskSetupList"></div>
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
              <button class="btn" id="taskDoneBtn" type="button">Done</button>
              <button class="btn" id="taskEmailBtn" type="button">Send email</button>
              <button class="btn" id="taskInvoiceBtn" type="button">Create invoice</button>
              <button class="btn" id="taskRescheduleBtn" type="button">Reschedule</button>
              <button class="btn" id="taskCancelBtn" type="button">Cancel</button>
              <button class="btn" id="taskReopenBtn" type="button">Reopen</button>
              <button class="btn btn-danger" id="taskDeleteBtn" type="button">Delete</button>
            </div>
          </div>
        </div>
      `;
        document.body.appendChild(modal);
      } else if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }

      taskDetail.modal = modal;
      taskDetail.title = modal.querySelector("#taskDetailTitle");
      taskDetail.meta = modal.querySelector("#taskDetailMeta");
      taskDetail.checklist = modal.querySelector("#taskChecklistList");
      taskDetail.checklistHint = modal.querySelector("#taskChecklistHint");
      taskDetail.setupList = modal.querySelector("#taskSetupList");
      taskDetail.setupHint = modal.querySelector("#taskSetupHint");
      taskDetail.refGallery = modal.querySelector("#taskRefGallery");
    taskDetail.workGallery = modal.querySelector("#taskWorkGallery");
    taskDetail.refUploadBtn = modal.querySelector("#taskRefUpload");
    taskDetail.workUploadBtn = modal.querySelector("#taskWorkUpload");
    taskDetail.doneBtn = modal.querySelector("#taskDoneBtn");
    taskDetail.emailBtn = modal.querySelector("#taskEmailBtn");
    taskDetail.invoiceBtn = modal.querySelector("#taskInvoiceBtn");
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
    taskDetail.rescheduleCard = modal.querySelector("#taskRescheduleCard");
    taskDetail.rescheduleDate = modal.querySelector("#taskRescheduleDate");
    taskDetail.rescheduleTime = modal.querySelector("#taskRescheduleTime");
    taskDetail.rescheduleDuration = modal.querySelector("#taskRescheduleDuration");
    taskDetail.rescheduleTbd = modal.querySelector("#taskRescheduleTbd");
    taskDetail.rescheduleSave = modal.querySelector("#taskRescheduleSave");
    taskDetail.rescheduleCancel = modal.querySelector("#taskRescheduleCancel");
    taskDetail.rescheduleBtn = modal.querySelector("#taskRescheduleBtn");
    taskDetail.deleteBtn = modal.querySelector("#taskDeleteBtn");

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

    if (taskDetail.doneBtn) {
      taskDetail.doneBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        attemptCompleteTask(task).catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.emailBtn) {
      taskDetail.emailBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        sendTaskCompletionEmail(task).catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.invoiceBtn) {
      taskDetail.invoiceBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        createInvoiceForTask(task).catch((e) => toast(e.message || String(e), "error"));
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
    if (taskDetail.rescheduleBtn) {
      taskDetail.rescheduleBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        const day = task.day_date || (task.start_at ? toDateInputValue(new Date(task.start_at)) : toDateInputValue(new Date()));
        if (taskDetail.rescheduleDate) taskDetail.rescheduleDate.value = day;
        const duration = getTaskDurationMinutes(task);
        ensureDurationOption(taskDetail.rescheduleDuration, duration);
        const minutes = minutesFromIso(task.start_at);
        const hasTime = Number.isFinite(minutes);
        if (taskDetail.rescheduleTime) {
          taskDetail.rescheduleTime.value = hasTime ? toTimeInputValue(minutes) : "09:00";
        }
        if (taskDetail.rescheduleTbd && taskDetail.rescheduleTime) {
          taskDetail.rescheduleTbd.checked = !hasTime;
          taskDetail.rescheduleTime.disabled = !hasTime;
        }
        if (taskDetail.rescheduleCard) taskDetail.rescheduleCard.removeAttribute("hidden");
      });
    }
    if (taskDetail.rescheduleCancel) {
      taskDetail.rescheduleCancel.addEventListener("click", () => {
        closeTaskRescheduleCard();
      });
    }
    if (taskDetail.rescheduleTbd && taskDetail.rescheduleTime) {
      taskDetail.rescheduleTbd.addEventListener("change", () => {
        taskDetail.rescheduleTime.disabled = taskDetail.rescheduleTbd.checked;
      });
    }
    if (taskDetail.rescheduleSave) {
      taskDetail.rescheduleSave.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        const day = taskDetail.rescheduleDate ? taskDetail.rescheduleDate.value : "";
        if (!day) {
          toast("Date is required.", "error");
          return;
        }
        const durationRaw = taskDetail.rescheduleDuration ? Number(taskDetail.rescheduleDuration.value || 0) : 0;
        const duration = Number.isFinite(durationRaw) && durationRaw > 0 ? Math.round(durationRaw) : null;
        const tbd = taskDetail.rescheduleTbd ? taskDetail.rescheduleTbd.checked : false;
        const time = taskDetail.rescheduleTime ? taskDetail.rescheduleTime.value : "";
        if (!tbd && !time) {
          toast("Select a start time or enable Time TBD.", "error");
          return;
        }
        const patch = {
          day_date: day,
          duration_minutes: duration
        };
        if (tbd) {
          patch.start_at = null;
          patch.end_at = null;
        } else {
          const start = new Date(`${day}T${time}:00`);
          patch.start_at = start.toISOString();
          if (duration) {
            const end = new Date(start.getTime() + duration * 60000);
            patch.end_at = end.toISOString();
          } else {
            patch.end_at = null;
          }
        }
        updateTask(task.id, patch)
          .then(async () => {
            closeTaskRescheduleCard();
            await refreshTaskViews();
            await openTaskDetail(task.id);
          })
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }
    if (taskDetail.deleteBtn) {
      taskDetail.deleteBtn.addEventListener("click", () => {
        const task = taskDetail.currentTask;
        if (!task) return;
        if (!window.confirm("Delete this booking? This cannot be undone.")) return;
        CN.sb.from("tasks").delete().eq("id", task.id)
          .then(async ({ error }) => {
            if (error) throw error;
            toast("Booking deleted.", "ok");
            closeTaskDetailModal();
            await refreshTaskViews();
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
    if (!taskDetail.doneBtn || !taskDetail.cancelBtn || !taskDetail.reopenBtn) return;
    const isDone = task.status === "done";
    const isCanceled = task.status === "canceled";
    taskDetail.doneBtn.style.display = isCanceled ? "none" : "";
    taskDetail.cancelBtn.style.display = isDone || isCanceled ? "none" : "";
    taskDetail.reopenBtn.style.display = isDone || isCanceled ? "" : "none";
    if (taskDetail.rescheduleBtn) {
      taskDetail.rescheduleBtn.style.display = isDone || isCanceled ? "none" : "";
    }
    if (taskDetail.deleteBtn) {
      taskDetail.deleteBtn.style.display = "";
    }
    taskDetail.doneBtn.disabled = isDone;
    taskDetail.doneBtn.classList.toggle("is-success", isDone);
    taskDetail.doneBtn.textContent = isDone ? "Completed" : "Done";
    if (taskDetail.emailBtn) {
      const sent = Boolean(task.completion_email_sent_at);
      taskDetail.emailBtn.style.display = isDone ? "" : "none";
      taskDetail.emailBtn.disabled = sent;
      taskDetail.emailBtn.classList.toggle("is-success", sent);
      taskDetail.emailBtn.textContent = sent ? "Email sent" : "Send email";
    }
    if (taskDetail.invoiceBtn) {
      const hasInvoice = Boolean(task.invoice_id);
      taskDetail.invoiceBtn.style.display = isDone ? "" : "none";
      taskDetail.invoiceBtn.classList.toggle("is-success", hasInvoice);
      taskDetail.invoiceBtn.textContent = hasInvoice ? "Open invoice" : "Create invoice";
    }
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
    closeTaskRescheduleCard();

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
      const setupItems = checklistItems.filter((item) => isSetupLabel(item.label));
      const normalItems = checklistItems.filter((item) => !isSetupLabel(item.label));

      const updateChecklistHints = () => {
        const normalCounts = normalItems.reduce((acc, row) => {
          if (row.done) acc.done += 1;
          acc.total += 1;
          return acc;
        }, { done: 0, total: 0 });
        const setupCounts = setupItems.reduce((acc, row) => {
          if (row.done) acc.done += 1;
          acc.total += 1;
          return acc;
        }, { done: 0, total: 0 });
        if (detail.checklistHint) {
          detail.checklistHint.textContent = normalCounts.total
            ? `${normalCounts.done}/${normalCounts.total} done`
            : "No checklist items yet.";
        }
        if (detail.setupHint) {
          detail.setupHint.textContent = setupCounts.total
            ? `${setupCounts.done}/${setupCounts.total} done`
            : "No setup items yet.";
        }
      };

      const handleChecklistToggle = async (item, done, labelEl, inputEl) => {
        try {
          await updateTaskChecklistItem(item.id, done);
          item.done = done;
          if (labelEl) labelEl.classList.toggle("done", done);
          updateChecklistHints();
        } catch (e) {
          if (inputEl) inputEl.checked = !done;
          toast(e.message || String(e), "error");
        }
      };

      renderTaskChecklist(detail.checklist, normalItems, handleChecklistToggle);
      renderTaskChecklist(detail.setupList, setupItems, handleChecklistToggle);
      updateChecklistHints();

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

  async function sendTaskCompletionEmail(task) {
    if (!task || !task.id) return null;
    if (task.status !== "done") {
      toast("Complete the task before sending the email.", "error");
      return null;
    }
    try {
      const payload = await callAdminFunction("task-completed", {
        task_id: task.id,
        mode: "email"
      });
      if (payload && payload.email_sent) {
        toast("Completion email sent.", "ok");
      } else if (payload && payload.email_skipped) {
        toast("Completion email already sent.", "ok");
      }
      await refreshTaskViews();
      await openTaskDetail(task.id);
      return payload || null;
    } catch (e) {
      toast(`Email failed: ${e.message || String(e)}`, "error");
      return null;
    }
  }

  async function createInvoiceForTask(task) {
    if (!task || !task.id) return null;
    if (task.status !== "done") {
      toast("Complete the task before creating the invoice.", "error");
      return null;
    }
    if (task.invoice_id) {
      await openInvoiceFromTimeline(task.invoice_id);
      return task.invoice_id;
    }
    try {
      const payload = await callAdminFunction("task-completed", {
        task_id: task.id,
        mode: "invoice"
      });
      if (payload && payload.invoice_id) {
        toast("Invoice created.", "ok");
        await refreshInvoices();
        await refreshTaskViews();
        await refreshTimeline();
        await openInvoiceFromTimeline(payload.invoice_id);
      }
      await openTaskDetail(task.id);
      return payload || null;
    } catch (e) {
      toast(`Invoice failed: ${e.message || String(e)}`, "error");
      return null;
    }
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

  function getBillingContactById(id) {
    return state.billingContacts.find((c) => c.id === id);
  }

  function formatBillingContactLabel(contact) {
    if (!contact) return "";
    return [contact.name, contact.email].filter(Boolean).join(" · ");
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

  async function loadBillingContacts() {
    const { data, error } = await CN.sb
      .from("billing_contacts")
      .select("id, name, email, phone, tax_id, country, address")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });
    if (error) throw error;
    state.billingContacts = data || [];
  }

  async function loadProperties() {
    const { data, error } = await CN.sb
      .from("properties")
      .select("*, owner:profiles(id, name, email, phone)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    state.properties = data || [];
  }

  function populateBillingContactSelect(selectEl, selectedId) {
    if (!selectEl) return;
    const current = selectedId || "";
    selectEl.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = state.billingContacts.length ? "Select billing contact" : "No billing contacts yet";
    selectEl.appendChild(placeholder);
    state.billingContacts.forEach((contact) => {
      const opt = document.createElement("option");
      opt.value = contact.id;
      opt.textContent = formatBillingContactLabel(contact) || contact.name || "Billing contact";
      selectEl.appendChild(opt);
    });
    selectEl.value = current;
  }

  function populateInvoicePropertySelect() {
    if (!els.invoiceProperty) return;
    const current = els.invoiceProperty.value || "";
    els.invoiceProperty.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select property (optional)";
    els.invoiceProperty.appendChild(placeholder);
    state.properties.forEach((prop) => {
      const opt = document.createElement("option");
      opt.value = prop.id;
      opt.textContent = prop.address || "Property";
      els.invoiceProperty.appendChild(opt);
    });
    els.invoiceProperty.value = current;
  }

  function populateInvoiceBillingContactSelect(selectedId) {
    if (!els.invoiceBillingContact) return;
    const current = selectedId || els.invoiceBillingContact.value || "";
    els.invoiceBillingContact.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = state.billingContacts.length ? "Select billing contact" : "No billing contacts yet";
    els.invoiceBillingContact.appendChild(placeholder);
    state.billingContacts.forEach((contact) => {
      const opt = document.createElement("option");
      opt.value = contact.id;
      opt.textContent = formatBillingContactLabel(contact) || contact.name || "Billing contact";
      els.invoiceBillingContact.appendChild(opt);
    });
    els.invoiceBillingContact.value = current;
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

  async function seedMissingTaskLabels() {
    if (state.taskLabels.length) return;
    const { error } = await CN.sb
      .from("task_labels")
      .upsert(
        { tenant_id: tenantId, name: "Cleaning", color: "#59a14f" },
        { onConflict: "tenant_id,name" }
      );
    if (error) throw error;
    await loadTaskLabels();
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
    await loadBillingContacts();
    await loadProperties();
    await loadPropertyStaff();
    await loadTaskLabels();
    try {
      await seedMissingTaskLabels();
    } catch (e) {
      toast("Default labels could not be created. Add a task label manually.", "error");
    }
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
    populateInvoicePropertySelect();
    populateInvoiceBillingContactSelect();
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
      prop.city,
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
        col.className = "cx-prop-row__col";
        const main = document.createElement("div");
        main.className = "cx-prop-row__main";
        const city = document.createElement("div");
        city.className = "cx-prop-row__city";
        city.textContent = prop.city || "—";
        const addr = document.createElement("div");
        addr.className = "cx-prop-row__addr";
        addr.textContent = prop.address || "Property";
        const sub = document.createElement("div");
        sub.className = "cx-prop-row__sub";
        const lastStr = stats.lastDone.get(prop.id);
        const lastLabel = lastStr ? `Last cleaned: ${lastStr}` : "";
        const billingNote = prop.billing_contact_id ? "" : "Billing contact missing";
        sub.textContent = [prop.notes, lastLabel, billingNote].filter(Boolean).join(" | ");
        main.appendChild(city);
        main.appendChild(addr);
        col.appendChild(main);
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
    const cityRaw = prompt("City");
    const city = cityRaw ? cityRaw.trim() : "";
    if (!city) {
      toast("City is required.", "error");
      return;
    }
    const addressRaw = prompt("Property address");
    const address = addressRaw ? addressRaw.trim() : "";
    if (!address) {
      toast("Address is required.", "error");
      return;
    }
    const notes = prompt("Notes (optional)") || "";
    const { error } = await CN.sb.from("properties").insert({
      tenant_id: tenantId,
      owner_user_id: client.id,
      city,
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
    populateInvoicePropertySelect();
    renderClientsList();
  }

  function openBillingContactModal(propertyId) {
    state.pendingBillingContactPropertyId = propertyId || null;
    if (els.billingContactName) els.billingContactName.value = "";
    if (els.billingContactEmail) els.billingContactEmail.value = "";
    if (els.billingContactPhone) els.billingContactPhone.value = "";
    if (els.billingContactTaxId) els.billingContactTaxId.value = "";
    if (els.billingContactCountry) els.billingContactCountry.value = "";
    if (els.billingContactAddress) els.billingContactAddress.value = "";
    if (els.billingContactModal) els.billingContactModal.removeAttribute("hidden");
  }

  function closeBillingContactModal() {
    if (els.billingContactModal) els.billingContactModal.setAttribute("hidden", "");
    state.pendingBillingContactPropertyId = null;
  }

  async function saveBillingContact() {
    const name = els.billingContactName ? els.billingContactName.value.trim() : "";
    if (!name) {
      toast("Name is required.", "error");
      return;
    }
    const email = els.billingContactEmail ? els.billingContactEmail.value.trim() : "";
    if (!email) {
      toast("Email is required.", "error");
      return;
    }
    const payload = {
      tenant_id: tenantId,
      name,
      email,
      phone: els.billingContactPhone ? els.billingContactPhone.value.trim() || null : null,
      tax_id: els.billingContactTaxId ? els.billingContactTaxId.value.trim() || null : null,
      country: els.billingContactCountry ? els.billingContactCountry.value.trim() || null : null,
      address: els.billingContactAddress ? els.billingContactAddress.value.trim() || null : null
    };
    const { data, error } = await CN.sb.from("billing_contacts").insert(payload).select("id").single();
    if (error) throw error;
    await loadBillingContacts();
    const newId = data ? data.id : null;
    const pendingPropertyId = state.pendingBillingContactPropertyId;
    state.pendingBillingContactPropertyId = null;
    if (pendingPropertyId && newId) {
      const { error: propError } = await CN.sb
        .from("properties")
        .update({ billing_contact_id: newId })
        .eq("id", pendingPropertyId);
      if (propError) throw propError;
      const row = state.properties.find((p) => p.id === pendingPropertyId);
      if (row) row.billing_contact_id = newId;
      renderClientsList();
      if (state.selectedPropertyId === pendingPropertyId) {
        await renderPropertyDetail(row || getPropertyById(pendingPropertyId));
      }
    }
    populateInvoicePropertySelect();
    populateInvoiceBillingContactSelect(newId);
    if (!pendingPropertyId && newId && els.invoiceBillingContact) {
      els.invoiceBillingContact.value = newId;
      els.invoiceBillingContact.disabled = false;
      const contact = getBillingContactById(newId);
      if (contact) fillInvoiceCustomerFromContact(contact);
    }
    toast("Billing contact saved.", "ok");
    closeBillingContactModal();
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
      const headRow = document.createElement("div");
      headRow.className = "cx-preview__row";
      const headLeft = document.createElement("div");
        const titleRow = document.createElement("div");
        titleRow.style.display = "flex";
        titleRow.style.alignItems = "center";
        titleRow.style.gap = "8px";
        const title = document.createElement("div");
        title.className = "cx-preview__title";
        title.textContent = property.address || "Property";
        titleRow.appendChild(title);
      const sub = document.createElement("div");
      sub.className = "cx-preview__sub";
      sub.textContent = [
        owner ? owner.name : "Client",
        owner ? owner.email : "",
        owner ? owner.phone : ""
      ].filter(Boolean).join(" | ");
        headLeft.appendChild(titleRow);
        headLeft.appendChild(sub);
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-xs";
        editBtn.textContent = "Edit";
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-danger btn-xs";
        deleteBtn.textContent = "Delete";
        titleRow.appendChild(editBtn);
        headRow.appendChild(headLeft);
        headRow.appendChild(deleteBtn);
        head.appendChild(headRow);
        preview.appendChild(head);

      const editPanel = document.createElement("div");
      editPanel.className = "cx-preview__edit";
      editPanel.hidden = true;
      const editForm = document.createElement("div");
      editForm.className = "row-2";
      const cityWrap = document.createElement("div");
      const cityLabel = document.createElement("div");
      cityLabel.className = "label";
      cityLabel.textContent = "City";
      const cityInput = document.createElement("input");
      cityInput.className = "input";
      cityInput.placeholder = "City";
      cityInput.value = property.city || "";
      cityWrap.appendChild(cityLabel);
      cityWrap.appendChild(cityInput);
      const addrWrap = document.createElement("div");
      const addrLabel = document.createElement("div");
      addrLabel.className = "label";
      addrLabel.textContent = "Address";
      const addrInput = document.createElement("input");
      addrInput.className = "input";
      addrInput.placeholder = "Address";
      addrInput.value = property.address || "";
      addrWrap.appendChild(addrLabel);
      addrWrap.appendChild(addrInput);
      editForm.appendChild(cityWrap);
      editForm.appendChild(addrWrap);
      const editActions = document.createElement("div");
      editActions.className = "row";
      editActions.style.justifyContent = "flex-end";
      editActions.style.gap = "8px";
      const editCancel = document.createElement("button");
      editCancel.type = "button";
      editCancel.className = "btn";
      editCancel.textContent = "Cancel";
      const editSave = document.createElement("button");
      editSave.type = "button";
      editSave.className = "btn btn-primary";
      editSave.textContent = "Save";
      editActions.appendChild(editCancel);
      editActions.appendChild(editSave);
      editPanel.appendChild(editForm);
      editPanel.appendChild(editActions);
      preview.appendChild(editPanel);

      editBtn.addEventListener("click", () => {
        editPanel.hidden = !editPanel.hidden;
        if (!editPanel.hidden) {
          cityInput.value = property.city || "";
          addrInput.value = property.address || "";
        }
      });
      editCancel.addEventListener("click", () => {
        editPanel.hidden = true;
      });
        editSave.addEventListener("click", async () => {
        const nextCity = cityInput.value.trim();
        const nextAddress = addrInput.value.trim();
        if (!nextCity) {
          toast("City is required.", "error");
          return;
        }
        if (!nextAddress) {
          toast("Address is required.", "error");
          return;
        }
        try {
          const { error } = await CN.sb
            .from("properties")
            .update({ city: nextCity, address: nextAddress })
            .eq("id", property.id);
          if (error) throw error;
          const row = state.properties.find((p) => p.id === property.id);
          if (row) {
            row.city = nextCity;
            row.address = nextAddress;
          }
          property.city = nextCity;
          property.address = nextAddress;
          toast("Property updated.", "ok");
          editPanel.hidden = true;
          renderClientsList();
          await renderPropertyDetail(property);
        } catch (e) {
          toast(e.message || String(e), "error");
        }
      });
        [cityInput, addrInput].forEach((input) => {
          input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") editSave.click();
            if (ev.key === "Escape") editCancel.click();
          });
        });

        deleteBtn.addEventListener("click", async () => {
          const ok = window.confirm("Delete this property? This cannot be undone.");
          if (!ok) return;
          try {
            const { error } = await CN.sb.from("properties").delete().eq("id", property.id);
            if (error) throw error;
            toast("Property deleted.", "ok");
            state.properties = state.properties.filter((p) => p.id !== property.id);
            state.selectedPropertyId = null;
            renderClientsList();
            renderPropertyDetail(null);
          } catch (e) {
            const msg = e.message || String(e);
            if (/foreign key|constraint/i.test(msg)) {
              toast("Cannot delete: this property has related tasks or invoices. Remove those first.", "error");
              return;
            }
            toast(msg, "error");
          }
        });

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

    const billingRow = document.createElement("div");
    billingRow.className = "row";
    billingRow.style.alignItems = "center";
    billingRow.style.justifyContent = "space-between";
    billingRow.style.gap = "10px";
    billingRow.style.marginTop = "10px";
    const billingLabel = document.createElement("div");
    billingLabel.innerHTML = "<strong>Billing contact</strong>";
    const billingControls = document.createElement("div");
    billingControls.style.display = "flex";
    billingControls.style.gap = "8px";
    billingControls.style.flexWrap = "wrap";
    const billingSelect = document.createElement("select");
    billingSelect.className = "input";
    billingSelect.style.minWidth = "220px";
    populateBillingContactSelect(billingSelect, property.billing_contact_id);
    billingSelect.disabled = !state.billingContacts.length;
    const billingNewBtn = document.createElement("button");
    billingNewBtn.type = "button";
    billingNewBtn.className = "btn";
    billingNewBtn.textContent = "New contact";
    billingNewBtn.addEventListener("click", () => openBillingContactModal(property.id));
    billingControls.appendChild(billingSelect);
    billingControls.appendChild(billingNewBtn);
    billingRow.appendChild(billingLabel);
    billingRow.appendChild(billingControls);
    assetsCard.appendChild(billingRow);

    const billingMeta = document.createElement("div");
    billingMeta.className = "small-note";
    billingMeta.style.marginTop = "6px";
    const selectedBilling = property.billing_contact_id ? getBillingContactById(property.billing_contact_id) : null;
    if (!selectedBilling) {
      billingMeta.textContent = "Billing contact required.";
    } else {
      const detailParts = [];
      if (selectedBilling.email) detailParts.push(selectedBilling.email);
      if (selectedBilling.phone) detailParts.push(selectedBilling.phone);
      if (selectedBilling.tax_id) detailParts.push(`Tax ID: ${selectedBilling.tax_id}`);
      if (selectedBilling.country) detailParts.push(selectedBilling.country);
      if (selectedBilling.address) detailParts.push(selectedBilling.address);
      billingMeta.textContent = detailParts.length ? detailParts.join(" | ") : (selectedBilling.name || "Billing contact selected.");
    }
    assetsCard.appendChild(billingMeta);

    let currentBillingId = property.billing_contact_id || "";
    billingSelect.addEventListener("change", async () => {
      const nextId = billingSelect.value || "";
      if (!nextId) {
        toast("Billing contact is required.", "error");
        billingSelect.value = currentBillingId;
        return;
      }
      try {
        const { error } = await CN.sb
          .from("properties")
          .update({ billing_contact_id: nextId })
          .eq("id", property.id);
        if (error) throw error;
        currentBillingId = nextId;
        property.billing_contact_id = nextId;
        const row = state.properties.find((p) => p.id === property.id);
        if (row) row.billing_contact_id = nextId;
        toast("Billing contact saved.", "ok");
        renderClientsList();
        await renderPropertyDetail(property);
      } catch (e) {
        toast(e.message || String(e), "error");
        billingSelect.value = currentBillingId;
      }
    });

      const assetsGrid = document.createElement("div");
      assetsGrid.className = "row-2";
      assetsGrid.style.marginTop = "10px";
      assetsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";

      const setupTemplateItems = checklistItems.filter((item) => isSetupLabel(item.label));
      const checklistTemplateItems = checklistItems.filter((item) => !isSetupLabel(item.label));

      const checklistCol = document.createElement("div");
      const checklistTitle = document.createElement("div");
      checklistTitle.innerHTML = `<strong>Checklist template</strong>`;
      checklistCol.appendChild(checklistTitle);
      const checklistList = document.createElement("div");
      checklistList.className = "checklist";
      if (checklistError) {
        checklistList.innerHTML = `<div class="small-note">${checklistError.message || String(checklistError)}</div>`;
      } else if (!checklistTemplateItems.length) {
        checklistList.innerHTML = '<div class="small-note">No checklist items yet.</div>';
      } else {
        checklistTemplateItems.forEach((item) => {
          const row = document.createElement("div");
          row.className = "check-item";
          const label = document.createElement("label");
          label.textContent = stripSetupLabel(item.label) || "Checklist item";
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
        const maxSort = checklistTemplateItems.reduce((max, row) => {
          const val = Number.isFinite(row.sort_order) ? row.sort_order : max;
          return Math.max(max, val);
        }, -1);
        const nextSort = Number.isFinite(maxSort) ? maxSort + 1 : checklistTemplateItems.length;
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

      const setupCol = document.createElement("div");
      const setupTitle = document.createElement("div");
      setupTitle.innerHTML = `<strong>Setup template</strong>`;
      setupCol.appendChild(setupTitle);
      const setupList = document.createElement("div");
      setupList.className = "checklist";
      if (checklistError) {
        setupList.innerHTML = `<div class="small-note">${checklistError.message || String(checklistError)}</div>`;
      } else if (!setupTemplateItems.length) {
        setupList.innerHTML = '<div class="small-note">No setup items yet.</div>';
      } else {
        setupTemplateItems.forEach((item) => {
          const row = document.createElement("div");
          row.className = "check-item";
          const label = document.createElement("label");
          label.textContent = stripSetupLabel(item.label) || "Setup item";
          label.style.flex = "1";
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "btn btn-danger";
          removeBtn.textContent = "Remove";
          removeBtn.addEventListener("click", async () => {
            if (!window.confirm("Remove this setup item?")) return;
            try {
              await deletePropertyChecklistItem(item.id);
              toast("Setup item removed.", "ok");
              await renderPropertyDetail(property);
            } catch (e) {
              toast(e.message || String(e), "error");
            }
          });
          row.appendChild(label);
          row.appendChild(removeBtn);
          setupList.appendChild(row);
        });
      }
      setupCol.appendChild(setupList);

      const setupAddRow = document.createElement("div");
      setupAddRow.className = "row";
      setupAddRow.classList.add("checklist-add");
      setupAddRow.style.marginTop = "10px";
      const setupInput = document.createElement("input");
      setupInput.className = "input";
      setupInput.placeholder = "Add setup item";
      const setupAddBtn = document.createElement("button");
      setupAddBtn.type = "button";
      setupAddBtn.className = "btn btn-primary";
      setupAddBtn.textContent = "Add";
      setupAddBtn.addEventListener("click", async () => {
        const label = setupInput.value.trim();
        if (!label) return;
        const maxSort = setupTemplateItems.reduce((max, row) => {
          const val = Number.isFinite(row.sort_order) ? row.sort_order : max;
          return Math.max(max, val);
        }, -1);
        const nextSort = Number.isFinite(maxSort) ? maxSort + 1 : setupTemplateItems.length;
        try {
          await addPropertyChecklistItem(property.id, buildSetupLabel(label), nextSort);
          toast("Setup item added.", "ok");
          await renderPropertyDetail(property);
        } catch (e) {
          toast(e.message || String(e), "error");
        }
      });
      setupInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") setupAddBtn.click();
      });
      setupAddRow.appendChild(setupInput);
      setupAddRow.appendChild(setupAddBtn);
      setupCol.appendChild(setupAddRow);
      assetsGrid.appendChild(setupCol);

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

    function wirePlannerControls() {
        if (els.plannerMonth) {
          els.plannerMonth.addEventListener("change", () => {
            state.planner.month = els.plannerMonth.value || "";
            state.planner.scrollLeft = null;
            state.planner.hasUserScrolled = false;
            refreshPlannerTimeline().catch((e) => toast(e.message || String(e), "error"));
          });
        }
        if (els.plannerJumpToday) {
          els.plannerJumpToday.addEventListener("click", () => {
            const today = new Date();
            const monthValue = toMonthInputValue(today);
            if (els.plannerMonth) {
              els.plannerMonth.value = monthValue;
            }
            state.planner.month = monthValue;
            state.planner.scrollLeft = null;
            state.planner.hasUserScrolled = false;
            refreshPlannerTimeline().catch((e) => toast(e.message || String(e), "error"));
          });
        }
        if (els.plannerScrollLeft) {
          els.plannerScrollLeft.addEventListener("click", () => {
            const scroller = getPlannerScroller();
            if (!scroller) return;
            const delta = -Math.max(240, scroller.clientWidth * 0.8);
            scroller.scrollLeft += delta;
            state.planner.hasUserScrolled = true;
            state.planner.scrollLeft = scroller.scrollLeft;
          });
        }
        if (els.plannerScrollRight) {
          els.plannerScrollRight.addEventListener("click", () => {
            const scroller = getPlannerScroller();
            if (!scroller) return;
            const delta = Math.max(240, scroller.clientWidth * 0.8);
            scroller.scrollLeft += delta;
            state.planner.hasUserScrolled = true;
            state.planner.scrollLeft = scroller.scrollLeft;
          });
        }
        if (els.plannerScroll || els.plannerTimeline) {
          if (els.plannerScroll) els.plannerScroll.style.overflowX = "auto";
          if (els.plannerTimeline) els.plannerTimeline.style.overflowX = "auto";
          const wheelHandler = (ev) => {
            if (!els.plannerTimeline) return;
            const target = ev.target && ev.target.nodeType === 1 ? ev.target : ev.target && ev.target.parentElement;
            if (!target || !target.closest) return;
            if (!target.closest("#plannerTimeline")) return;
            const scroller = getPlannerScroller();
            if (!scroller) return;
            const delta = Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
            if (!delta) return;
            const before = scroller.scrollLeft;
            scroller.scrollLeft = before + delta;
            if (scroller.scrollLeft === before) return;
            state.planner.scrollLeft = scroller.scrollLeft;
            state.planner.hasUserScrolled = true;
            ev.preventDefault();
          };
          document.addEventListener("wheel", wheelHandler, { passive: false, capture: true });
          const syncScrollState = () => {
            const scroller = getPlannerScroller();
            if (!scroller) return;
            state.planner.scrollLeft = scroller.scrollLeft;
            state.planner.hasUserScrolled = true;
          };
          if (els.plannerScroll) els.plannerScroll.addEventListener("scroll", syncScrollState);
          if (els.plannerTimeline) els.plannerTimeline.addEventListener("scroll", syncScrollState);
          const keyHandler = (ev) => {
            const scroller = getPlannerScroller();
            if (!scroller) return;
            if (ev.key === "ArrowRight") {
              scroller.scrollBy({ left: 200, behavior: "smooth" });
              ev.preventDefault();
            }
            if (ev.key === "ArrowLeft") {
              scroller.scrollBy({ left: -200, behavior: "smooth" });
              ev.preventDefault();
            }
          };
          if (els.plannerScroll) els.plannerScroll.addEventListener("keydown", keyHandler);
          if (els.plannerTimeline) els.plannerTimeline.addEventListener("keydown", keyHandler);

          let dragState = null;
          const dragHost = els.plannerScroll || els.plannerTimeline;
          const onDragMove = (ev) => {
            if (!dragState) return;
            const dx = ev.clientX - dragState.startX;
            const scroller = getPlannerScroller();
            if (!scroller) return;
            scroller.scrollLeft = dragState.startScroll - dx;
          };
          const onDragUp = () => {
            if (!dragState) return;
            dragState = null;
            if (dragHost) dragHost.classList.remove("is-dragging");
            document.removeEventListener("mousemove", onDragMove);
            document.removeEventListener("mouseup", onDragUp);
            window.removeEventListener("blur", onDragUp);
          };
          if (dragHost) dragHost.addEventListener("mousedown", (ev) => {
            if (ev.button !== 0 && ev.button !== 1) return;
            const target = ev.target && ev.target.nodeType === 1 ? ev.target : ev.target.parentElement;
            if (!target || !target.closest) return;
            if (ev.button === 0 && !ev.shiftKey && !ev.altKey) {
              if (target.closest(".hz-item")) return;
              if (target.closest(".hz-row-track")) return;
              if (!target.closest(".hz-head") && !target.closest(".hz-days") && !target.closest(".hz-hours")
                && !target.closest(".hz-col--city") && !target.closest(".hz-col--addr")) {
                return;
              }
            }
            const scroller = getPlannerScroller();
            if (!scroller) return;
            dragState = {
              startX: ev.clientX,
              startScroll: scroller.scrollLeft
            };
            dragHost.classList.add("is-dragging");
            document.addEventListener("mousemove", onDragMove);
            document.addEventListener("mouseup", onDragUp);
            window.addEventListener("blur", onDragUp);
            ev.preventDefault();
          });
        }

        if (els.plannerPickModal) {
          els.plannerPickModal.addEventListener("click", (ev) => {
            if (ev.target && ev.target.dataset && ev.target.dataset.action === "planner-pick-cancel") {
              closePlannerPickModal();
            }
          });
        }
        if (els.plannerPickList) {
          els.plannerPickList.addEventListener("click", (ev) => {
            const target = ev.target && ev.target.nodeType === 1 ? ev.target : ev.target.parentElement;
            if (!target || !target.closest) return;
            const btn = target.closest("button[data-pick-kind]");
            if (!btn) return;
            const ctx = plannerPickContext;
            closePlannerPickModal();
            if (!ctx) return;
            const kind = btn.dataset.pickKind || "booking";
            const typeId = btn.dataset.pickTypeId || "";
            if (kind === "booking") {
              prefillTimelineAdd(ctx.day, ctx.propertyId, ctx.startMinutes, ctx.durationMinutes);
            } else {
              openActivityModalPrefill(ctx.day, ctx.propertyId, ctx.startMinutes, ctx.durationMinutes, typeId || "custom");
            }
          });
        }
      }

  async function loadTimelineTasks(startDate, endDate) {
    const { data, error } = await CN.sb
      .from("tasks")
      .select("id, day_date, status, duration_minutes, start_at, end_at, completed_at, invoice_id, notes, assigned_user_id, property_id, label_id, property:properties(address)")
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

    const PLANNER_BLOCK_HOURS = 4;
    const PLANNER_SLOT_WIDTH = 48;
    const PLANNER_HOUR_WIDTH = PLANNER_SLOT_WIDTH / PLANNER_BLOCK_HOURS;
    const PLANNER_STEP_MINUTES = 30;
    const PLANNER_RANGE_BUFFER_DAYS = 10;

  async function refreshPlannerTimeline() {
    if (!els.plannerGrid) return;
    const today = new Date();
    const selectedMonth = state.planner.month || (els.plannerMonth ? els.plannerMonth.value : "");
    const monthDate = fromMonthInputValue(selectedMonth) || today;
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const normalizedMonth = toMonthInputValue(monthStart);

    if (els.plannerMonth && els.plannerMonth.value !== normalizedMonth) {
      els.plannerMonth.value = normalizedMonth;
    }
    state.planner.month = normalizedMonth;

      const rangeStart = addDays(monthStart, -PLANNER_RANGE_BUFFER_DAYS);
      const rangeEnd = addDays(monthEnd, PLANNER_RANGE_BUFFER_DAYS);
      const monthTasks = await loadTimelineTasks(rangeStart, rangeEnd);
      const monthActivities = await loadActivities(rangeStart, rangeEnd);
      const focusDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), Math.min(new Date().getDate(), monthEnd.getDate()));
      renderPlannerTimeline(rangeStart, rangeEnd, monthTasks, monthActivities, focusDate);
    }

      function renderPlannerTimeline(startDate, endDate, tasks, activities, focusDate) {
        if (!els.plannerGrid) return;
        const dayCount = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1);
        const dayList = [];
        for (let i = 0; i < dayCount; i += 1) {
          dayList.push(addDays(startDate, i));
        }
      const dayKeys = dayList.map((d) => toDateInputValue(d));
      const dayIndexByKey = new Map(dayKeys.map((key, idx) => [key, idx]));

      const hourWidth = PLANNER_HOUR_WIDTH;
      const slotWidth = PLANNER_SLOT_WIDTH;
      const dayWidth = hourWidth * 24;
      const totalWidth = dayWidth * dayList.length;
      const isNarrow = window.matchMedia("(max-width: 720px)").matches;
      const cityWidth = isNarrow ? 90 : 120;
      const addressWidth = isNarrow ? 160 : 220;
      const labelTotalWidth = cityWidth + addressWidth;

      els.plannerGrid.innerHTML = "";
      els.plannerGrid.style.setProperty("--hz-hour-width", `${hourWidth}px`);
      els.plannerGrid.style.setProperty("--hz-slot-width", `${slotWidth}px`);
      els.plannerGrid.style.setProperty("--hz-day-width", `${dayWidth}px`);
      els.plannerGrid.style.setProperty("--hz-total-width", `${totalWidth}px`);
      els.plannerGrid.style.setProperty("--hz-city-width", `${cityWidth}px`);
      els.plannerGrid.style.setProperty("--hz-address-width", `${addressWidth}px`);
      els.plannerGrid.style.width = `${labelTotalWidth + totalWidth}px`;

      const props = [...state.properties].sort((a, b) => {
        return String(a.address || "").localeCompare(String(b.address || ""));
      });

      const rows = props.map((prop) => ({
        id: prop.id,
        label: prop.address || "Property",
        city: prop.city || "",
        property: prop
      }));

    const cityCol = document.createElement("div");
    cityCol.className = "hz-col hz-col--city";
    const addrCol = document.createElement("div");
    addrCol.className = "hz-col hz-col--addr";
    const cityHead = document.createElement("div");
    cityHead.className = "hz-head-cell";
    cityHead.textContent = "City";
    const addrHead = document.createElement("div");
    addrHead.className = "hz-head-cell";
    addrHead.textContent = "Address";
    cityCol.appendChild(cityHead);
    addrCol.appendChild(addrHead);
    rows.forEach((row) => {
      const cityLabel = document.createElement("div");
      cityLabel.className = "hz-row-label";
      const addrLabel = document.createElement("div");
      addrLabel.className = "hz-row-label";
        cityLabel.textContent = row.city || "-";
        addrLabel.textContent = row.label;
        cityCol.appendChild(cityLabel);
        addrCol.appendChild(addrLabel);
      });

    const timeCol = document.createElement("div");
    timeCol.className = "hz-col hz-col--time";
    timeCol.style.width = `${totalWidth}px`;

    const head = document.createElement("div");
    head.className = "hz-head";
    const daysRow = document.createElement("div");
    daysRow.className = "hz-days";
    daysRow.style.width = `${totalWidth}px`;
    dayList.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = "hz-day";
      cell.textContent = fmtDateLabel(day);
      daysRow.appendChild(cell);
    });

    const hoursRow = document.createElement("div");
    hoursRow.className = "hz-hours";
    hoursRow.style.width = `${totalWidth}px`;
    for (let d = 0; d < dayList.length; d += 1) {
      for (let h = 0; h < 24; h += PLANNER_BLOCK_HOURS) {
        const hour = document.createElement("div");
        hour.className = "hz-hour";
        hour.textContent = String(h).padStart(2, "0");
        hoursRow.appendChild(hour);
      }
    }

    head.appendChild(daysRow);
    head.appendChild(hoursRow);
    timeCol.appendChild(head);

    const body = document.createElement("div");
    body.className = "hz-body";

    const rowTracks = new Map();
    rows.forEach((row) => {
      const rowWrap = document.createElement("div");
      rowWrap.className = "hz-row";
      const track = document.createElement("div");
      track.className = "hz-row-track";
      track.dataset.propertyId = row.id;
      track.style.width = `${totalWidth}px`;
      rowWrap.appendChild(track);
      body.appendChild(rowWrap);
        rowTracks.set(row.id, track);
        attachPlannerDrag(track, dayList, dayWidth, hourWidth, row.id);
      });

      timeCol.appendChild(body);
      els.plannerGrid.appendChild(cityCol);
      els.plannerGrid.appendChild(addrCol);
      els.plannerGrid.appendChild(timeCol);

      const headHeight = head.offsetHeight || 0;
      if (headHeight) {
        cityHead.style.height = `${headHeight}px`;
        addrHead.style.height = `${headHeight}px`;
      }

    const taskById = new Map((tasks || []).map((task) => [task.id, task]));
    const activityById = new Map((activities || []).map((activity) => [activity.id, activity]));

    const renderItem = (item, kind) => {
      const dayKey = item.day_date || (item.start_at ? toDateInputValue(new Date(item.start_at)) : "");
      const dayIndex = dayIndexByKey.get(dayKey);
      if (dayIndex == null) return;
      const duration = Number(item.duration_minutes || 0) || 60;
      let minutes = minutesFromIso(item.start_at);
      let isTbd = false;
      if (minutes == null) {
        minutes = 9 * 60;
        isTbd = true;
      }
      minutes = clampNumber(minutes, 0, 24 * 60 - 1);
      const left = dayIndex * dayWidth + (minutes / 60) * hourWidth;
      const width = Math.max((duration / 60) * hourWidth, 18);

        const rowId = item.property_id;
        const track = rowTracks.get(rowId);
        if (!track) return;

      const pill = document.createElement("div");
      pill.className = "hz-item";
      pill.style.left = `${left}px`;
      pill.style.width = `${width}px`;
      if (item.status === "done") pill.classList.add("is-done");
      if (item.status === "canceled") pill.classList.add("is-cancelled");
      if (isTbd) pill.classList.add("is-tbd");

      if (kind === "activity") {
        applyActivityColor(pill, getActivityColor(item));
      }

      const label = kind === "activity"
        ? (item.type_name_snapshot || "Activity")
        : (getLabelById(item.label_id) || {}).name || "Task";
      pill.textContent = `${fmtTimeRange(item.start_at, item.end_at, item.duration_minutes)} â€¢ ${label}`;
      pill.title = pill.textContent;

      pill.dataset.kind = kind;
      pill.dataset.id = item.id;
      pill.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (kind === "activity") {
          openActivityModal(item);
        } else {
          openTaskDetail(item.id).catch((e) => toast(e.message || String(e), "error"));
        }
      });

      track.appendChild(pill);
    };

    (tasks || []).forEach((task) => renderItem(task, "task"));
    (activities || []).forEach((activity) => renderItem(activity, "activity"));

      rowTracks.forEach((track) => {
        track.addEventListener("click", (ev) => {
          const target = ev.target && ev.target.nodeType === 1 ? ev.target : ev.target.parentElement;
          if (!target) return;
          const pill = target.closest ? target.closest(".hz-item") : null;
          if (!pill) return;
          const kind = pill.dataset.kind;
          const id = pill.dataset.id;
          if (kind === "activity") {
            const activity = activityById.get(id);
            if (activity) openActivityModal(activity);
          } else {
            openTaskDetail(id).catch((e) => toast(e.message || String(e), "error"));
          }
        });
      });

      if (els.plannerScroll || els.plannerTimeline) {
        requestAnimationFrame(() => {
          const scroller = getPlannerScroller();
          if (!scroller) return;
          let target = state.planner.scrollLeft;
          if (!state.planner.hasUserScrolled || target == null) {
            const today = new Date();
            const todayKey = toDateInputValue(today);
            const focusKey = toDateInputValue(focusDate || today);
            let idx = dayIndexByKey.get(todayKey);
            if (idx == null) idx = dayIndexByKey.get(focusKey);
            if (idx == null) idx = 0;
            target = idx * dayWidth;
          }
          const maxScroll = Math.max(0, els.plannerGrid.scrollWidth - scroller.clientWidth);
          target = clampNumber(Number(target || 0), 0, maxScroll);
          scroller.scrollLeft = target;
          state.planner.scrollLeft = target;
        });
      }
    }

    function formatPlannerPickHint(day, startMinutes, durationMinutes) {
      const base = new Date(day);
      base.setHours(0, 0, 0, 0);
      const startDate = new Date(base.getTime() + startMinutes * 60000);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      const startLabel = fmtDateLabel(startDate);
      const endLabel = fmtDateLabel(endDate);
      const startTime = toTimeInputValue(startMinutes);
      const endTime = toTimeInputValue((startMinutes + durationMinutes) % (24 * 60));
      if (startLabel === endLabel) {
        return `${startLabel} • ${startTime}–${endTime}`;
      }
      return `${startLabel} ${startTime} → ${endLabel} ${endTime}`;
    }

    function buildPlannerPickButton({ label, meta, kind, typeId, color }) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "planner-pick-item";
      btn.dataset.pickKind = kind;
      if (typeId) btn.dataset.pickTypeId = typeId;

      const row = document.createElement("div");
      row.className = "planner-pick-item__row";
      if (color) {
        const swatch = document.createElement("span");
        swatch.className = "planner-pick-item__swatch";
        swatch.style.background = color;
        row.appendChild(swatch);
      }
      const title = document.createElement("span");
      title.className = "planner-pick-item__title";
      title.textContent = label;
      row.appendChild(title);
      btn.appendChild(row);

      if (meta) {
        const metaEl = document.createElement("div");
        metaEl.className = "planner-pick-item__meta";
        metaEl.textContent = meta;
        btn.appendChild(metaEl);
      }
      return btn;
    }

    function openPlannerPickModal(day, propertyId, startMinutes, durationMinutes) {
      if (!els.plannerPickModal || !els.plannerPickList) {
        prefillTimelineAdd(day, propertyId || null, startMinutes, durationMinutes);
        return;
      }
      plannerPickContext = { day, propertyId, startMinutes, durationMinutes };
      if (els.plannerPickHint) {
        els.plannerPickHint.textContent = formatPlannerPickHint(day, startMinutes, durationMinutes);
      }
      const list = els.plannerPickList;
      list.innerHTML = "";
      list.appendChild(buildPlannerPickButton({
        label: "Default cleaning",
        meta: "One-click cleaning task",
        kind: "booking"
      }));

      const types = state.activityTypes.filter((type) => !type.is_archived);
      types.forEach((type) => {
        const meta = type.default_duration_minutes
          ? `${type.default_duration_minutes} min default`
          : "Activity";
        list.appendChild(buildPlannerPickButton({
          label: type.name || "Activity",
          meta,
          kind: "activity",
          typeId: type.id,
          color: type.color || ""
        }));
      });

      list.appendChild(buildPlannerPickButton({
        label: "Custom activity",
        meta: "Pick details manually",
        kind: "activity",
        typeId: "custom"
      }));

      els.plannerPickModal.removeAttribute("hidden");
    }

    function closePlannerPickModal() {
      if (els.plannerPickModal) els.plannerPickModal.setAttribute("hidden", "");
      plannerPickContext = null;
    }

    function prefillTimelineAdd(day, propertyId, startMinutes, durationMinutes) {
      openTimelineAddModal(day, propertyId || null);
      if (els.timelineAddTime) els.timelineAddTime.value = toTimeInputValue(startMinutes);
      if (els.timelineAddTbd) els.timelineAddTbd.checked = false;
      ensureDurationOption(els.timelineAddDuration, durationMinutes);
    }

    function applyActivityTypeSelection(typeId) {
      if (!els.activityTypeSelect) return;
      const value = typeId || "custom";
      els.activityTypeSelect.value = value;
      if (els.activityCustomName) {
        if (value === "custom") {
          els.activityCustomName.style.display = "block";
          els.activityCustomName.value = "";
        } else {
          els.activityCustomName.style.display = "none";
          els.activityCustomName.value = "";
        }
      }
      if (value !== "custom") {
        const type = state.activityTypes.find((t) => t.id === value);
        if (type && els.activityDuration) {
          els.activityDuration.value = String(type.default_duration_minutes || 30);
        }
      }
    }

    function openActivityModalPrefill(day, propertyId, startMinutes, durationMinutes, typeId) {
      openActivityModal();
      applyActivityTypeSelection(typeId || "custom");
      if (els.activityDate) els.activityDate.value = toDateInputValue(day);
      if (els.activityTimeFrom) els.activityTimeFrom.value = toTimeInputValue(startMinutes);
      ensureDurationOption(els.activityDuration, durationMinutes);
      if (els.activityProperty) els.activityProperty.value = propertyId || "";
    }

    function attachPlannerDrag(track, dayList, dayWidth, hourWidth, propertyId) {
      if (!track) return;
      const step = PLANNER_STEP_MINUTES;
    let dragState = null;

    const getX = (ev) => {
      const rect = track.getBoundingClientRect();
      const scroller = getPlannerScroller();
      const scrollLeft = scroller ? scroller.scrollLeft : 0;
      return ev.clientX - rect.left + scrollLeft;
    };

    const onMove = (ev) => {
      if (!dragState) return;
      const x = clampNumber(getX(ev), 0, dragState.maxWidth);
      const start = Math.min(dragState.startX, x);
      const end = Math.max(dragState.startX, x);
      dragState.selection.style.left = `${start}px`;
      dragState.selection.style.width = `${Math.max(end - start, 8)}px`;
    };

    const onUp = (ev) => {
      if (!dragState) return;
      const x = clampNumber(getX(ev), 0, dragState.maxWidth);
      const start = Math.min(dragState.startX, x);
      let end = Math.max(dragState.startX, x);
        const startDayIndex = Math.floor(start / dayWidth);
        const endDayIndex = Math.floor((end - 1) / dayWidth);
        const day = dayList[startDayIndex];
        const dayStart = startDayIndex * dayWidth;
        const startMinutesRaw = ((start - dayStart) / hourWidth) * 60;
        const endMinutesRaw = ((end - dayStart) / hourWidth) * 60;
        let startMinutes = Math.round(startMinutesRaw / step) * step;
        let endMinutes = Math.round(endMinutesRaw / step) * step;
        if (endMinutes <= startMinutes) endMinutes = startMinutes + 60;
        const maxMinutes = dayList.length * 24 * 60;
        startMinutes = clampNumber(startMinutes, 0, maxMinutes - 1);
        endMinutes = clampNumber(endMinutes, startMinutes + 30, maxMinutes);

        const duration = endMinutes - startMinutes;
        openPlannerPickModal(day, propertyId || null, startMinutes, duration);

      dragState.selection.remove();
      dragState = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    track.addEventListener("mousedown", (ev) => {
      if (ev.button !== 0) return;
      const target = ev.target && ev.target.nodeType === 1 ? ev.target : ev.target.parentElement;
      if (target && target.closest && target.closest(".hz-item")) return;
      ev.preventDefault();
      const startX = clampNumber(getX(ev), 0, track.scrollWidth);
      const selection = document.createElement("div");
      selection.className = "hz-selection";
      selection.style.left = `${startX}px`;
      selection.style.width = "8px";
      track.appendChild(selection);
      dragState = {
        startX,
        selection,
        maxWidth: track.scrollWidth
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  async function openInvoiceFromTimeline(invoiceId) {
    if (!invoiceId) return;
    state.selectedInvoiceId = invoiceId;
    setActiveTab("invoices");
    await refreshInvoices();
    selectInvoice(invoiceId);
    if (els.invoicePreview) {
      els.invoicePreview.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
            const timeRow = document.createElement("div");
            timeRow.className = "timeline-booking__time-row";
            const time = document.createElement("span");
            time.className = "timeline-booking__time";
            time.textContent = fmtTimeRange(task.start_at, task.end_at, task.duration_minutes);
            timeRow.appendChild(time);
            const addr = document.createElement("div");
            addr.className = "timeline-booking__addr";
            addr.textContent = (task.property && task.property.address) || (getPropertyById(task.property_id) || {}).address || "Property";
            const meta = document.createElement("div");
            meta.className = "timeline-booking__meta";
            const label = getLabelById(task.label_id);
            const staffName = task.assigned_user_id ? getStaffName(task.assigned_user_id) : "Unassigned";
            const metaParts = [label ? label.name : "Task", staffName];
            if (task.notes) metaParts.push(task.notes);
            if (task.status === "done") {
              const completed = fmtDateTime(task.completed_at);
              if (completed) metaParts.push(`Completed: ${completed}`);
            }
            meta.textContent = metaParts.filter(Boolean).join(" | ");
            main.appendChild(timeRow);
            main.appendChild(addr);
            main.appendChild(meta);

            const actions = document.createElement("div");
            actions.className = "timeline-booking__actions";
            let status = null;
            if (task.status === "done") {
              status = document.createElement("div");
              status.className = "timeline-booking__status";
              const badge = document.createElement("span");
              badge.className = "badge completed";
              badge.textContent = "Completed";
              status.appendChild(badge);
            }
            const detailBtn = document.createElement("button");
            detailBtn.className = "btn";
            detailBtn.type = "button";
            detailBtn.textContent = "Details";
            detailBtn.addEventListener("click", () => {
              openTaskDetail(task).catch((e) => toast(e.message || String(e), "error"));
            });
            actions.appendChild(detailBtn);
            if (task.invoice_id) {
              const invoiceBtn = document.createElement("button");
              invoiceBtn.className = "btn";
              invoiceBtn.type = "button";
              invoiceBtn.textContent = "Invoice";
              invoiceBtn.addEventListener("click", () => {
                openInvoiceFromTimeline(task.invoice_id).catch((e) => {
                  toast(e.message || String(e), "error");
                });
              });
              actions.appendChild(invoiceBtn);
            }

            booking.appendChild(main);
            if (status) booking.appendChild(status);
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
          const timeRow = document.createElement("div");
          timeRow.className = "timeline-booking__time-row";
          const time = document.createElement("span");
          time.className = "timeline-booking__time";
          time.textContent = fmtTimeRange(activity.start_at, null, activity.duration_minutes);
          timeRow.appendChild(time);
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
          main.appendChild(timeRow);
          main.appendChild(addr);
          main.appendChild(meta);

          booking.appendChild(main);
          if (activity.status === "done") {
            const status = document.createElement("div");
            status.className = "timeline-booking__status";
            const badge = document.createElement("span");
            badge.className = "badge completed";
            badge.textContent = "Completed";
            status.appendChild(badge);
            booking.appendChild(status);
          }
          const actions = document.createElement("div");
          actions.className = "timeline-booking__actions";
          const detailBtn = document.createElement("button");
          detailBtn.className = "btn";
          detailBtn.type = "button";
          detailBtn.textContent = "Details";
          detailBtn.addEventListener("click", () => {
            openActivityModal(activity);
          });
          actions.appendChild(detailBtn);
          const doneBtn = document.createElement("button");
          doneBtn.className = "btn";
          doneBtn.type = "button";
          doneBtn.textContent = "Done";
          doneBtn.disabled = activity.status === "done";
          doneBtn.addEventListener("click", async () => {
            if (activity.status === "done") return;
            try {
              await updateActivity(activity.id, { status: "done", completed_at: new Date().toISOString() });
              await refreshTimeline();
              await refreshActivities();
            } catch (e) {
              toast(e.message || String(e), "error");
            }
          });
          const cancelBtn = document.createElement("button");
          cancelBtn.className = "btn btn-danger";
          cancelBtn.type = "button";
          cancelBtn.textContent = "Cancel";
          cancelBtn.addEventListener("click", async () => {
            try {
              const ok = window.confirm("Delete this activity?");
              if (!ok) return;
              const { error } = await CN.sb.from("activities").delete().eq("id", activity.id);
              if (error) throw error;
              toast("Activity deleted.", "ok");
              await refreshTimeline();
              await refreshActivities();
            } catch (e) {
              toast(e.message || String(e), "error");
            }
          });
          actions.appendChild(doneBtn);
          actions.appendChild(cancelBtn);
          booking.appendChild(actions);
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
      if (!propertyId) {
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

  function fillInvoiceCustomerFromContact(contact) {
    if (!contact) return;
    if (els.invoiceCustomerName) els.invoiceCustomerName.value = contact.name || "";
    if (els.invoiceCustomerEmail) els.invoiceCustomerEmail.value = contact.email || "";
    if (els.invoiceCustomerTaxId) els.invoiceCustomerTaxId.value = contact.tax_id || "";
    if (els.invoiceCustomerCountry) els.invoiceCustomerCountry.value = contact.country || "";
    if (els.invoiceCustomerAddress) els.invoiceCustomerAddress.value = contact.address || "";
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
    if (els.invoiceProperty) els.invoiceProperty.value = "";
    if (els.invoiceBillingContact) {
      els.invoiceBillingContact.value = "";
      els.invoiceBillingContact.disabled = false;
    }
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
    if (els.invoiceProperty) {
      populateInvoicePropertySelect();
      els.invoiceProperty.addEventListener("change", () => {
        const propertyId = els.invoiceProperty.value || "";
        if (!propertyId) {
          if (els.invoiceBillingContact) {
            els.invoiceBillingContact.disabled = false;
          }
          return;
        }
        const prop = getPropertyById(propertyId);
        const contact = prop && prop.billing_contact_id ? getBillingContactById(prop.billing_contact_id) : null;
        if (!contact) {
          toast("Billing contact is required for this property.", "error");
          els.invoiceProperty.value = "";
          if (els.invoiceBillingContact) {
            els.invoiceBillingContact.disabled = false;
          }
          return;
        }
        populateInvoiceBillingContactSelect(contact.id);
        if (els.invoiceBillingContact) {
          els.invoiceBillingContact.value = contact.id;
          els.invoiceBillingContact.disabled = true;
        }
        fillInvoiceCustomerFromContact(contact);
      });
    }
    if (els.invoiceBillingContact) {
      populateInvoiceBillingContactSelect();
      els.invoiceBillingContact.addEventListener("change", () => {
        const contactId = els.invoiceBillingContact.value || "";
        if (!contactId) return;
        const contact = getBillingContactById(contactId);
        if (!contact) return;
        if (els.invoiceProperty) {
          els.invoiceProperty.value = "";
        }
        els.invoiceBillingContact.disabled = false;
        fillInvoiceCustomerFromContact(contact);
      });
    }
    if (els.invoiceBillingNewBtn) {
      els.invoiceBillingNewBtn.addEventListener("click", () => openBillingContactModal(null));
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

  function wireBillingContactControls() {
    if (els.billingContactModal) {
      els.billingContactModal.addEventListener("click", (ev) => {
        if (ev.target && ev.target.dataset && ev.target.dataset.action === "billing-contact-cancel") {
          closeBillingContactModal();
        }
      });
    }
    if (els.billingContactSave) {
      els.billingContactSave.addEventListener("click", () => {
        saveBillingContact()
          .catch((e) => toast(e.message || String(e), "error"));
      });
    }
  }

  async function getNextInvoiceNumber(issueDate) {
    const { data, error } = await CN.sb.rpc("next_invoice_number", {
      p_tenant_id: tenantId,
      p_issue_date: issueDate,
      p_owner_user_id: userId
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
    const propertyId = els.invoiceProperty ? (els.invoiceProperty.value || null) : null;
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
    if (propertyId) {
      const prop = getPropertyById(propertyId);
      if (!prop || !prop.billing_contact_id) {
        toast("Billing contact is required for this property.", "error");
        return;
      }
    }

    const invoiceTotal = items.reduce((sum, item) => sum + (Number(item.line_total) || 0), 0);
    const customerAddressPayload = packInvoiceCustomerAddress(customerAddress, customerTaxId, customerCountry);
    const invoiceNumber = await getNextInvoiceNumber(issueDate);
    const { data: invoice, error } = await CN.sb.from("invoices").insert({
      tenant_id: tenantId,
      owner_user_id: userId,
      property_id: propertyId || null,
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
    const byDay = groupBy(activities, (a) => a.day_date);
    const sortedDays = Array.from(byDay.keys()).sort();
    els.activitiesPanel.innerHTML = "";

    const typeCard = document.createElement("div");
    typeCard.className = "card";
    typeCard.style.marginBottom = "12px";
    const typeHead = document.createElement("div");
    typeHead.className = "card-h";
    typeHead.textContent = "Activity types";
    const typeBody = document.createElement("div");
    typeBody.className = "card-b";
    if (!state.activityTypes.length) {
      typeBody.innerHTML = '<div class="section-sub" style="margin:0;">No activity types yet.</div>';
    } else {
      state.activityTypes.forEach((type) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.gap = "12px";
        row.style.padding = "8px 0";
        row.style.borderBottom = "1px solid rgba(255,255,255,.06)";

        const info = document.createElement("div");
        const name = document.createElement("div");
        name.style.fontWeight = "700";
        name.textContent = type.name || "Type";
        if (type.color) {
          const swatch = document.createElement("span");
          swatch.style.display = "inline-block";
          swatch.style.width = "10px";
          swatch.style.height = "10px";
          swatch.style.borderRadius = "50%";
          swatch.style.marginRight = "8px";
          swatch.style.verticalAlign = "middle";
          swatch.style.background = type.color;
          name.prepend(swatch);
        }
        const sub = document.createElement("div");
        sub.className = "small-note";
        sub.textContent = `Default: ${type.default_duration_minutes || 30} min`;
        info.appendChild(name);
        info.appendChild(sub);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger";
        delBtn.type = "button";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", async () => {
          const ok = window.confirm("Archive this activity type? Existing activities keep their name.");
          if (!ok) return;
          try {
            const { error } = await CN.sb.from("activity_types").update({ is_archived: true }).eq("id", type.id);
            if (error) throw error;
            await loadActivityTypes();
            populateActivityTypeSelect();
            renderActivities(activities);
            toast("Activity type archived.", "ok");
          } catch (e) {
            toast(e.message || String(e), "error");
          }
        });

        row.appendChild(info);
        row.appendChild(delBtn);
        typeBody.appendChild(row);
      });
    }
    typeCard.appendChild(typeHead);
    typeCard.appendChild(typeBody);
    els.activitiesPanel.appendChild(typeCard);

    if (!activities.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = '<div class="empty-state__msg">No activities for this month.</div>';
      els.activitiesPanel.appendChild(empty);
      return;
    }

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
      none.textContent = "Select property";
      els.activityProperty.appendChild(none);
      state.properties.forEach((prop) => {
        const opt = document.createElement("option");
        opt.value = prop.id;
      opt.textContent = prop.address || "Property";
      els.activityProperty.appendChild(opt);
    });
  }

  function openActivityModal(activity) {
    if (!els.activityModal) return;
    populateActivityTypeSelect();
    populateActivityStaffSelect();
    populateActivityPropertySelect();
    state.activityEditing = activity || null;
    if (state.activityEditing) {
      if (els.activityModalTitle) els.activityModalTitle.textContent = "Activity details";
      if (els.activityModalHint) els.activityModalHint.textContent = "Update activity details";
      if (els.activitySave) els.activitySave.textContent = "Update";
      let selectedTypeId = activity.type_id || "custom";
      if (selectedTypeId !== "custom" && !state.activityTypes.find((t) => t.id === selectedTypeId)) {
        selectedTypeId = "custom";
      }
      if (els.activityTypeSelect) els.activityTypeSelect.value = selectedTypeId;
      if (els.activityCustomName) {
        if (selectedTypeId === "custom") {
          els.activityCustomName.style.display = "block";
          els.activityCustomName.value = activity.type_name_snapshot || "";
        } else {
          els.activityCustomName.style.display = "none";
          els.activityCustomName.value = "";
        }
      }
      if (els.activityDate) {
        els.activityDate.value = activity.day_date || toDateInputValue(new Date());
      }
      if (els.activityTimeFrom) {
        els.activityTimeFrom.value = activity.start_at ? toTimeInputValue(activity.start_at) : "09:00";
      }
      if (els.activityDuration) {
        els.activityDuration.value = String(activity.duration_minutes || 30);
      }
      if (els.activityStaff) {
        els.activityStaff.value = activity.assigned_user_id || "";
      }
      if (els.activityProperty) {
        els.activityProperty.value = activity.property_id || "";
      }
      if (els.activityNotes) {
        els.activityNotes.value = activity.notes || "";
      }
    } else {
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
      if (els.activitySave) els.activitySave.textContent = "Save";
    }
    els.activityModal.removeAttribute("hidden");
  }

  function closeActivityModal() {
    if (els.activityModal) els.activityModal.setAttribute("hidden", "");
    state.activityEditing = null;
    if (els.activitySave) els.activitySave.textContent = "Save";
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
      if (!propId) {
        toast("Property is required.", "error");
        return;
      }
      const color = normalizeHexColor(typeColor);
      const time = els.activityTimeFrom ? els.activityTimeFrom.value : "";
      const editing = state.activityEditing;
    if (editing) {
      const patch = {
        type_id: typeId === "custom" ? null : typeId,
        type_name_snapshot: typeName,
        day_date: day,
        duration_minutes: duration,
        assigned_user_id: staffId || null,
        property_id: propId || null,
        notes: notes || null
      };
      if (color) {
        patch.color = color;
      } else {
        patch.color = null;
      }
      if (time) {
        const start = new Date(`${day}T${time}:00`);
        patch.start_at = start.toISOString();
      } else {
        patch.start_at = null;
      }
      const { error } = await CN.sb.from("activities").update(patch).eq("id", editing.id);
      if (error) throw error;
      toast("Activity updated.", "ok");
      closeActivityModal();
      await refreshActivities();
      await refreshTimeline();
      return;
    }

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
      planner: els.adminTabPlanner,
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
    if (tabKey === "planner") {
      refreshPlannerTimeline().catch((e) => toast(e.message || String(e), "error"));
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
        planner: els.adminTabPlanner,
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

      detachActivityModals();
      detachTimelineModal();
      detachPlannerPickModal();

    wireTabs();
    wireAdminTools();
    wireTimelineControls();
    wirePlannerControls();
    wireScheduleControls();
    wireActivitiesControls();
    wireInvoiceControls();
    wireBillingContactControls();

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
    await refreshPlannerTimeline().catch(() => {});
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
