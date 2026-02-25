(() => {
  "use strict";

  const STORAGE_KEY = "cn:lang:admin";
  const INDEX_LANG_KEY = "cn:lang:index";
  const SUPPORTED = ["en", "hu"];

  const HU = {
    "meta.title": "Clean-Nest - Admin",
    "header.theme": "Tema",
    "header.system": "Rendszer",
    "header.light": "Vilagos",
    "header.dark": "Sotet",
    "header.back": "\u2190 Vissza",
    "header.logout": "Kijelentkezes",
    "portal.title": "Ugyfel portal",
    "portal.sub": "Referencia celok, ellenorzo listak es foto frissitesek.",
    "portal.admin_tools": "Admin eszkozok",
    "portal.admin_tools_hint": "Ugyfelek es munkatarsak kezelese (igeny szerint nyithato)",
    "tabs.properties": "Ingatlanok",
    "tabs.timeline": "Idovonal",
    "tabs.planner": "Tervezo",
    "tabs.schedule": "Beosztas",
    "tabs.worklog": "Munkanaplo",
    "tabs.expenses": "Kiadasok",
    "tabs.finance": "Penzugyi riport",
    "tabs.activities": "Tevekenysegek",
    "tabs.invoices": "Szamlak",
    "tabs.modules": "Modulok",
    "properties.heading": "Ugyfelek es ingatlanok",
    "properties.sub": "Kereses -> ingatlan kivalasztasa -> utemezes/szerkesztes/session.",
    "properties.search_placeholder": "Kereses tulaj, telefon, cim, jegyzet...",
    "properties.sort_due": "Rendezes: esedekes (regebben takaritva)",
    "properties.sort_recent": "Rendezes: friss (ujabban takaritva)",
    "properties.sort_az": "Rendezes: A-Z",
    "timeline.heading": "Idovonal",
    "timeline.sub": "A kivalasztott honap takaritasai. Kattints egy napra az ugrashoz.",
    "timeline.this_month": "Ez a honap",
    "timeline.export_csv": "CSV",
    "timeline.print": "Nyomtatas",
    "planner.heading": "Tervezo",
    "planner.sub": "Huzz vegig egy soron uj foglalashoz. Kattints a foglalasra a reszletekhez.",
    "planner.select_activity": "Tevekenyseg valasztasa",
    "schedule.heading": "Beosztas",
    "schedule.sub": "Minden tervezett takaritas. Inatlankartyarol is letrehozhato.",
    "schedule.reset": "Visszaallitas",
    "schedule.staff_all": "Munkatars: Osszes",
    "schedule.empty_month": "Erre a honapra nincs foglalas.",
    "worklog.heading": "Munkanaplo",
    "worklog.sub": "Elvegzett takaritasok, extrak es tevekenysegek ingatlanonkent.",
    "expenses.heading": "Kiadasok",
    "expenses.sub": "Havi koltsegek rogzitese es hozzarendelese ingatlanhoz.",
    "expenses.new": "+ Kiadas hozzaadasa",
    "expenses.export_csv": "CSV",
    "finance.heading": "Penzugyi riport",
    "finance.sub": "Havi bevetel, kiadas es nyereseg attekintes.",
    "finance.reset": "Visszaallitas",
    "activities.heading": "Tevekenysegek",
    "activities.sub": "Egyedi tevekenysegtipusok es idovonal tevekenysegek kezelese.",
    "activities.new_type": "+ Uj tipus",
    "activities.new": "+ Uj tevekenyseg",
    "modules.heading": "Modulok",
    "modules.sub": "Valaszd ki, mely workspace tabok latszodjanak ennel a tenantnal.",
    "status.all": "Allapot: Osszes",
    "status.in_progress": "Folyamatban",
    "status.completed": "Teljesitve",
    "status.cancelled": "Torolve",
    "status.scheduled": "Utemezve",
    "table.date": "Datum",
    "table.time": "Ido",
    "table.property": "Ingatlan",
    "table.staff": "Munkatars",
    "table.status": "Allapot",
    "table.actions": "Muveletek",
    "table.label": "Cimke",
    "table.notes": "Jegyzet",
    "task.done": "Kesz",
    "task.cancel": "Megse",
    "task.reopen": "Ujranyitas",
    "task.completed": "Teljesitve",
    "task.completed_toast": "Feladat teljesitve.",
    "task.email_sent": "Email elkuldve",
    "task.send_email": "Email kuldese",
    "task.open_invoice": "Szamla megnyitasa",
    "task.create_invoice": "Szamla keszitese",
    "task.title_fallback": "Feladat",
    "task.property_fallback": "Ingatlan",
    "task.progress_done": "{done}/{total} kesz",
    "task.no_checklist_items": "Meg nincs checklist tetel.",
    "task.no_setup_items": "Meg nincs setup tetel.",
    "common.details": "Reszletek",
    "common.delete": "Torles",
    "common.save": "Mentes",
    "common.update": "Frissites",
    "common.required": "Kotelezo",
    "common.unassigned": "Nincs kiosztva",
    "common.staff": "Munkatars",
    "common.owner": "Tulaj",
    "common.client": "Ugyfel",
    "common.property": "Ingatlan",
    "common.task": "Feladat",
    "common.activity": "Tevekenyseg",
    "common.not_set": "Nincs beallitva",
    "common.select_property_optional": "Ingatlan valasztasa (opcionalis)",
    "timeline.jobs_count": "{count} munka",
    "timeline.activities_count": "{count} tevekenyseg",
    "timeline.zero_jobs": "0 munka",
    "timeline.empty_day": "meg nincs foglalas vagy tevekenyseg.",
    "timeline.add_booking": "Foglalas hozzaadasa",
    "timeline.add_booking_title": "Foglalas hozzaadasa - {date}",
    "timeline.completed_at": "Teljesitve: {at}",
    "timeline.invoice": "Szamla",
    "timeline.all_owners": "Osszes tulaj",
    "timeline.booking_default": "Foglalas (alapertelmezett)",
    "timeline.me_admin": "En (Admin)",
    "timeline.activity_hint": "Tevekenyseg: {name}",
    "timeline.label_hint": "Cimke: {name} (kesobb szerkesztheto)",
    "timeline.select_property": "Ingatlan valasztasa",
    "timeline.error_select_date": "Valassz datumot.",
    "timeline.error_select_property": "Valassz ingatlant.",
    "timeline.error_select_activity_type": "Valassz tevekenysegtipust.",
    "timeline.error_no_task_label": "Nincs elerheto feladat cimke. Elobb adj hozza egyet.",
    "timeline.warning_booking_created_checklist_failed": "A foglalas letrejott, de a checklist sablon alkalmazasa nem sikerult.",
    "timeline.booking_created": "Foglalas letrehozva.",
    "calendar.sun_short": "V",
    "calendar.mon_short": "H",
    "calendar.tue_short": "K",
    "calendar.wed_short": "Sze",
    "calendar.thu_short": "Cs",
    "calendar.fri_short": "P",
    "calendar.sat_short": "Szo",
    "activities.types": "Tevekenyseg tipusok",
    "activities.no_types": "Meg nincs tevekenyseg tipus.",
    "activities.type_fallback": "Tipus",
    "activities.default_duration": "Alap: {minutes} perc",
    "activities.type_created": "Tevekenyseg tipus letrehozva.",
    "activities.type_archived": "Tevekenyseg tipus archivalt.",
    "activities.empty_month": "Erre a honapra nincs tevekenyseg.",
    "activities.start": "Inditas",
    "activities.custom": "Egyedi",
    "activities.details_title": "Tevekenyseg reszletei",
    "activities.details_hint": "Tevekenyseg adatok frissitese",
    "activities.new_title": "Uj tevekenyseg",
    "activities.new_hint": "Egyedi tevekenyseg utemezese",
    "activities.error_custom_name_required": "Az egyedi nev kotelezo.",
    "activities.error_date_required": "A datum kotelezo.",
    "activities.error_valid_price": "Adj meg ervenyes arat.",
    "activities.error_property_required": "Ingatlan kivalasztasa kotelezo.",
    "activities.created": "Tevekenyseg letrehozva.",
    "activities.updated": "Tevekenyseg frissitve.",
    "activities.deleted": "Tevekenyseg torolve.",
    "activities.confirm_delete": "Toroljuk ezt a tevekenyseget?",
    "activities.confirm_archive_type": "Archivoljuk ezt a tevekenysegtipust? A meglevo tevekenysegek neve megmarad.",
    "activities.error_load_types": "A tevekenysegtipusok nem tolthetok be. Ellenorizd a jogosultsagokat.",
    "modules.always_enabled": "A Modulok tab mindig engedelyezett.",
    "modules.updated": "Modul frissitve.",
    "modules.required_label": "{name} (kotelezo)",
    "admin.select_client": "Ugyfel kivalasztasa",
    "admin.select_staff_member": "Munkatars kivalasztasa",
    "admin.error_required_name_email_password": "Nev, email es jelszo kotelezo.",
    "admin.creating_user": "Felhasznalo letrehozasa...",
    "admin.user_created": "Felhasznalo letrehozva.",
    "admin.error_select_user": "Eloszor valassz felhasznalot.",
    "admin.confirm_remove_user": "A felhasznalohoz tartozo adatok is torlodnek. Folytatod?",
    "admin.removing_user": "Felhasznalo torlese...",
    "admin.user_removed": "Felhasznalo torolve.",
    "admin.preparing_export": "Export elokeszitese...",
    "admin.exported_at": "Exportalva: {time}",
    "admin.export_complete": "Export kesz."
  };

  const STATIC_TEXT_BINDINGS = [
    ["#logoutBtn", "header.logout", "Logout"],
    ["#portalBackBtn", "header.back", "\u2190 Back"],
    ["[data-theme-button]", "header.theme", "Theme"],
    ["[data-theme-set='system']", "header.system", "System"],
    ["[data-theme-set='light']", "header.light", "Light"],
    ["[data-theme-set='dark']", "header.dark", "Dark"],
    [".portal-top > div:first-child > .section-title", "portal.title", "Customer Portal"],
    [".portal-top > div:first-child > .section-sub", "portal.sub", "Reference targets, checklists and photo updates."],
    ["#adminToolsBtn", "portal.admin_tools", "Admin tools"],
    [".portal-admin-bar .small-note", "portal.admin_tools_hint", "Add/remove clients & staff (opens on demand)"],
    ["#adminTabProperties .portal-admin-head h3", "properties.heading", "Clients & properties"],
    ["#adminTabProperties .portal-admin-head .section-sub", "properties.sub", "Search -> select a property -> schedule/edit/session."],
    ["#adminTabTimeline .portal-admin-head h3", "timeline.heading", "Timeline"],
    ["#adminTabTimeline .portal-admin-head .section-sub", "timeline.sub", "Review cleanings for the selected month. Click a day to jump to it."],
    ["#timelineExportCsv", "timeline.export_csv", "CSV"],
    ["#timelinePrint", "timeline.print", "Print"],
    ["#timelineJumpToday", "timeline.this_month", "This month"],
    ["#adminTabPlanner .portal-admin-head h3", "planner.heading", "Planner"],
    ["#adminTabPlanner .portal-admin-head .section-sub", "planner.sub", "Drag across a row to create a booking. Click a booking for details."],
    ["#plannerJumpToday", "timeline.this_month", "This month"],
    ["#plannerPickModal strong", "planner.select_activity", "Select activity"],
    ["#adminTabSchedule .portal-admin-head h3", "schedule.heading", "Schedule"],
    ["#adminTabSchedule .portal-admin-head .section-sub", "schedule.sub", "All planned cleanings. Create from a property card (Schedule)."],
    ["#scheduleResetFilters", "schedule.reset", "Reset"],
    ["#scheduleExportCsv", "timeline.export_csv", "CSV"],
    ["#schedulePrint", "timeline.print", "Print"],
    ["#adminTabWorklog .portal-admin-head h3", "worklog.heading", "Work log"],
    ["#adminTabWorklog .portal-admin-head .section-sub", "worklog.sub", "Completed cleanings, extras, and activities by property."],
    ["#worklogExportCsv", "timeline.export_csv", "CSV"],
    ["#adminTabExpenses .portal-admin-head h3", "expenses.heading", "Expenses"],
    ["#adminTabExpenses .portal-admin-head .section-sub", "expenses.sub", "Track monthly costs and assign them to properties."],
    ["#expenseNewBtn", "expenses.new", "+ Add expense"],
    ["#expensesExportCsv", "expenses.export_csv", "CSV"],
    ["#expenseSaveBtn", "common.save", "Save"],
    ["#expenseCancelBtn", "task.cancel", "Cancel"],
    ["#adminTabFinance .portal-admin-head h3", "finance.heading", "Financial report"],
    ["#adminTabFinance .portal-admin-head .section-sub", "finance.sub", "Monthly revenue, expenses and margin overview."],
    ["#financeResetFilters", "finance.reset", "Reset"],
    ["#financeExportCsv", "timeline.export_csv", "CSV"],
    ["#adminTabActivities .portal-admin-head h3", "activities.heading", "Activities"],
    ["#adminTabActivities .portal-admin-head .section-sub", "activities.sub", "Manage custom activity types and timeline activities."],
    ["#activityTypeNewBtn", "activities.new_type", "+ New type"],
    ["#activityNewBtn", "activities.new", "+ New activity"],
    ["#adminTabModules .portal-admin-head h3", "modules.heading", "Modules"],
    ["#adminTabModules .portal-admin-head .section-sub", "modules.sub", "Choose which workspace tabs are visible for this tenant. Everything stays available in the background and can be enabled later."],
    ["#timelineAddSave", "timeline.add_booking", "Add booking"],
    ["#activitySave", "common.save", "Save"],
    ["#billingContactSave", "common.save", "Save"]
  ];

  const STATIC_PLACEHOLDER_BINDINGS = [
    ["#adminSearch", "properties.search_placeholder", "Search owner, phone, address, notes..."]
  ];

  const LITERAL_PAIRS = [
    ["Cancel", "Megse"],
    ["Close", "Bezaras"],
    ["Save", "Mentes"],
    ["Delete", "Torles"],
    ["Details", "Reszletek"],
    ["Done", "Kesz"],
    ["Reopen", "Ujranyitas"],
    ["Start", "Inditas"],
    ["Invoice", "Szamla"],
    ["Required", "Kotelezo"],
    ["Property", "Ingatlan"],
    ["Task", "Feladat"],
    ["Activity", "Tevekenyseg"],
    ["Owner", "Tulaj"],
    ["Staff", "Munkatars"],
    ["Client", "Ugyfel"],
    ["Unassigned", "Nincs kiosztva"],
    ["Scheduled", "Utemezve"],
    ["In progress", "Folyamatban"],
    ["Completed", "Teljesitve"],
    ["Cancelled", "Torolve"],
    ["Add booking", "Foglalas hozzaadasa"],
    ["All owners", "Osszes tulaj"],
    ["Select property", "Ingatlan valasztasa"],
    ["Booking (default)", "Foglalas (alapertelmezett)"],
    ["Me (Admin)", "En (Admin)"],
    ["This month", "Ez a honap"],
    ["Print", "Nyomtatas"],
    ["No bookings for this month.", "Erre a honapra nincs foglalas."],
    ["No activities for this month.", "Erre a honapra nincs tevekenyseg."],
    ["No activity types yet.", "Meg nincs tevekenyseg tipus."],
    ["No checklist items yet.", "Meg nincs checklist tetel."],
    ["No setup items yet.", "Meg nincs setup tetel."],
    ["Select a date.", "Valassz datumot."],
    ["Select a property.", "Valassz ingatlant."],
    ["Select an activity type.", "Valassz tevekenysegtipust."],
    ["Activity created.", "Tevekenyseg letrehozva."],
    ["Activity deleted.", "Tevekenyseg torolve."],
    ["Booking created.", "Foglalas letrehozva."],
    ["Task completed.", "Feladat teljesitve."],
    ["Module updated.", "Modul frissitve."],
    ["Select a client", "Ugyfel kivalasztasa"],
    ["Select a staff member", "Munkatars kivalasztasa"]
  ];

  let currentLang = "en";
  let observer = null;
  let queued = false;

  function normalizeLang(raw) {
    const lang = String(raw || "").trim().toLowerCase();
    return SUPPORTED.includes(lang) ? lang : "";
  }

  function readInitialLang() {
    const adminLang = normalizeLang(localStorage.getItem(STORAGE_KEY));
    if (adminLang) return adminLang;
    const indexLang = normalizeLang(localStorage.getItem(INDEX_LANG_KEY));
    if (indexLang === "hu") return "hu";
    const docLang = normalizeLang(document.documentElement.lang);
    if (docLang === "hu") return "hu";
    return "en";
  }

  function t(key, fallback, vars) {
    let out = currentLang === "hu" && HU[key] ? HU[key] : (fallback || key || "");
    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach((name) => {
        out = out.replace(new RegExp(`\\{${name}\\}`, "g"), String(vars[name]));
      });
    }
    return out;
  }

  function applyTabLabels() {
    const tabs = [
      ["properties", "tabs.properties", "Properties"],
      ["timeline", "tabs.timeline", "Timeline"],
      ["planner", "tabs.planner", "Planner"],
      ["schedule", "tabs.schedule", "Schedule"],
      ["worklog", "tabs.worklog", "Work log"],
      ["expenses", "tabs.expenses", "Expenses"],
      ["finance", "tabs.finance", "Financial report"],
      ["activities", "tabs.activities", "Activities"],
      ["invoices", "tabs.invoices", "Invoices"],
      ["modules", "tabs.modules", "Modules"]
    ];
    tabs.forEach(([tab, key, fallback]) => {
      const btn = document.querySelector(`[data-action=\"admin-tab\"][data-tab=\"${tab}\"]`);
      if (btn) btn.textContent = t(key, fallback);
    });
  }

  function applyStaticText() {
    document.title = t("meta.title", "Clean-Nest - Admin");
    STATIC_TEXT_BINDINGS.forEach(([selector, key, fallback]) => {
      const el = document.querySelector(selector);
      if (!el) return;
      el.textContent = t(key, fallback);
    });
    STATIC_PLACEHOLDER_BINDINGS.forEach(([selector, key, fallback]) => {
      const el = document.querySelector(selector);
      if (!el || !el.hasAttribute("placeholder")) return;
      el.setAttribute("placeholder", t(key, fallback));
    });
    const due = document.querySelector("#adminSort option[value='due']");
    if (due) due.textContent = t("properties.sort_due", "Sort: Due (oldest cleaned)");
    const recent = document.querySelector("#adminSort option[value='recent']");
    if (recent) recent.textContent = t("properties.sort_recent", "Sort: Recent (newest cleaned)");
    const az = document.querySelector("#adminSort option[value='az']");
    if (az) az.textContent = t("properties.sort_az", "Sort: A-Z");
    const statAll = document.querySelector("#scheduleStatus option[value='all']");
    if (statAll) statAll.textContent = t("status.all", "Status: All");
    const statSched = document.querySelector("#scheduleStatus option[value='scheduled']");
    if (statSched) statSched.textContent = t("status.scheduled", "Scheduled");
    const statProg = document.querySelector("#scheduleStatus option[value='in_progress']");
    if (statProg) statProg.textContent = t("status.in_progress", "In progress");
    const statDone = document.querySelector("#scheduleStatus option[value='completed']");
    if (statDone) statDone.textContent = t("status.completed", "Completed");
    const statCancel = document.querySelector("#scheduleStatus option[value='cancelled']");
    if (statCancel) statCancel.textContent = t("status.cancelled", "Cancelled");
    const staffAll = document.querySelector("#scheduleStaff option[value='']");
    if (staffAll) staffAll.textContent = t("schedule.staff_all", "Staff: All");
    const unassigned = document.querySelector("#scheduleUnassignedOnly + span");
    if (unassigned) unassigned.textContent = t("common.unassigned", "Unassigned");
    applyTabLabels();
  }

  function swapLiteral(text) {
    if (typeof text !== "string") return text;
    let out = text;
    LITERAL_PAIRS.forEach(([en, hu]) => {
      const target = currentLang === "hu" ? hu : en;
      if (out === en || out === hu) {
        out = target;
        return;
      }
      if (out.endsWith(en)) {
        const prefix = out.slice(0, -en.length);
        if (/^[\s\W]+$/u.test(prefix)) {
          out = prefix + target;
        }
        return;
      }
      if (out.endsWith(hu)) {
        const prefix = out.slice(0, -hu.length);
        if (/^[\s\W]+$/u.test(prefix)) {
          out = prefix + target;
        }
      }
    });
    const jobsEn = out.match(/^(\d+)\s+jobs?$/i);
    const jobsHu = out.match(/^(\d+)\s+munka$/i);
    if (jobsEn || jobsHu) {
      const count = (jobsEn || jobsHu)[1];
      return currentLang === "hu" ? `${count} munka` : `${count} jobs`;
    }
    const actsEn = out.match(/^(\d+)\s+activities$/i);
    const actsHu = out.match(/^(\d+)\s+tevekenyseg$/i);
    if (actsEn || actsHu) {
      const count = (actsEn || actsHu)[1];
      return currentLang === "hu" ? `${count} tevekenyseg` : `${count} activities`;
    }
    const doneEn = out.match(/^(\d+)\/(\d+)\s+done$/i);
    const doneHu = out.match(/^(\d+)\/(\d+)\s+kesz$/i);
    if (doneEn || doneHu) {
      const m = doneEn || doneHu;
      return currentLang === "hu" ? `${m[1]}/${m[2]} kesz` : `${m[1]}/${m[2]} done`;
    }
    const addEn = out.match(/^Add booking - (.+)$/);
    const addHu = out.match(/^Foglalas hozzaadasa - (.+)$/);
    if (addEn || addHu) {
      const d = (addEn || addHu)[1];
      return currentLang === "hu" ? `Foglalas hozzaadasa - ${d}` : `Add booking - ${d}`;
    }
    return out;
  }

  function shouldSkip(el) {
    if (!el) return true;
    if (el.closest && el.closest("#adminLangSwitch")) return true;
    const tag = el.tagName;
    return tag === "SCRIPT" || tag === "STYLE";
  }

  function applyTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const parent = node.parentElement;
    if (!parent || shouldSkip(parent)) return;
    const after = swapLiteral(node.nodeValue);
    if (after !== node.nodeValue) node.nodeValue = after;
  }

  function applyAttrs(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE || shouldSkip(el)) return;
    ["placeholder", "title", "aria-label"].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      const before = el.getAttribute(attr) || "";
      const after = swapLiteral(before);
      if (after !== before) el.setAttribute(attr, after);
    });
  }

  function applyLiterals(root) {
    const scope = root && root.nodeType ? root : document.body;
    if (!scope) return;
    if (scope.nodeType === Node.TEXT_NODE) {
      applyTextNode(scope);
      return;
    }
    if (scope.nodeType === Node.ELEMENT_NODE) applyAttrs(scope);
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    let text = walker.nextNode();
    while (text) {
      applyTextNode(text);
      text = walker.nextNode();
    }
    if (scope.querySelectorAll) {
      scope.querySelectorAll("[placeholder],[title],[aria-label]").forEach(applyAttrs);
    }
  }

  function updateSwitchUi() {
    const btns = Array.from(document.querySelectorAll("#adminLangSwitch .lang-btn[data-lang]"));
    btns.forEach((btn) => {
      const lang = normalizeLang(btn.getAttribute("data-lang"));
      const active = lang === currentLang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyAll() {
    document.documentElement.lang = currentLang;
    updateSwitchUi();
    applyStaticText();
    applyLiterals(document.body);
  }

  function queueApply() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyLiterals(document.body);
    });
  }

  function ensureObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver(() => queueApply());
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
    });
  }

  function setLang(lang, opts = {}) {
    const next = normalizeLang(lang) || "en";
    currentLang = next;
    localStorage.setItem(STORAGE_KEY, next);
    applyAll();
    if (!opts.silent) {
      window.dispatchEvent(new CustomEvent("cn:admin-lang", { detail: { lang: next } }));
    }
  }

  function getLang() {
    return currentLang;
  }

  function initSwitch() {
    const wrap = document.getElementById("adminLangSwitch");
    if (!wrap) return;
    wrap.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = normalizeLang(btn.getAttribute("data-lang"));
        if (!lang || lang === currentLang) return;
        setLang(lang);
      });
    });
  }

  function init() {
    currentLang = readInitialLang();
    window.CN_ADMIN_I18N = { getLang, setLang, t, apply: applyAll };
    initSwitch();
    ensureObserver();
    setLang(currentLang, { silent: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
