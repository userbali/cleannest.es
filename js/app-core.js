/* global window, document */

(function () {
  // Supabase client from CDN (loaded in HTML)
  const { createClient } = window.supabase;
  const configuredTimeZone = String((window.CN_CONFIG || {}).BUSINESS_TIME_ZONE || "Atlantic/Canary").trim();
  const BUSINESS_TIME_ZONE = configuredTimeZone || "Atlantic/Canary";

  const zonedPartsFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  function asDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    if (value == null) return new Date();
    return new Date(value);
  }

  function zonedParts(value) {
    const date = asDate(value);
    if (Number.isNaN(date.getTime())) return null;
    const parts = {};
    zonedPartsFormatter.formatToParts(date).forEach((part) => {
      if (part.type !== "literal") parts[part.type] = Number(part.value);
    });
    return {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: parts.hour,
      minute: parts.minute,
      second: parts.second
    };
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(value) {
    const parts = zonedParts(value);
    if (!parts) return "";
    return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
  }

  function timeKey(value) {
    const parts = zonedParts(value);
    if (!parts) return "";
    return `${pad2(parts.hour)}:${pad2(parts.minute)}`;
  }

  function dateTimeKey(value) {
    const date = asDate(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${dateKey(date)} ${timeKey(date)}`;
  }

  function monthKey(value) {
    const parts = zonedParts(value);
    if (!parts) return "";
    return `${parts.year}-${pad2(parts.month)}`;
  }

  function calendarDate(value) {
    const parts = zonedParts(value);
    if (!parts) return null;
    // Midday keeps this Date stable when it is used as a date-only calendar value.
    return new Date(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0);
  }

  function formatDate(value, locale = "en-US", options = {}) {
    const date = asDate(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
      timeZone: BUSINESS_TIME_ZONE
    }).format(date);
  }

  function formatTime(value, locale = "en-GB", options = {}) {
    const date = asDate(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      ...options,
      timeZone: BUSINESS_TIME_ZONE
    }).format(date);
  }

  function offsetMillisecondsAt(value) {
    const date = asDate(value);
    const parts = zonedParts(date);
    if (!parts) return NaN;
    const representedAsUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    const instantAtWholeSecond = Math.floor(date.getTime() / 1000) * 1000;
    return representedAsUtc - instantAtWholeSecond;
  }

  function parseDateKey(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw new RangeError("Date must use YYYY-MM-DD format.");
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const check = new Date(Date.UTC(year, month - 1, day));
    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
      throw new RangeError("Invalid calendar date.");
    }
    return { year, month, day };
  }

  function parseTimeKey(value) {
    const match = String(value || "").match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) throw new RangeError("Time must use HH:MM format.");
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] || 0);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
      throw new RangeError("Invalid clock time.");
    }
    return { hour, minute, second };
  }

  function fromWallTime(dayValue, timeValue = "00:00") {
    const day = parseDateKey(dayValue);
    const time = parseTimeKey(timeValue);
    const wallClockAsUtc = Date.UTC(day.year, day.month - 1, day.day, time.hour, time.minute, time.second);
    let candidateMs = wallClockAsUtc;

    // Resolve the IANA-zone offset at this instant, including daylight saving time.
    for (let i = 0; i < 4; i += 1) {
      const offset = offsetMillisecondsAt(new Date(candidateMs));
      if (!Number.isFinite(offset)) throw new RangeError("Could not resolve the configured time zone.");
      const adjusted = wallClockAsUtc - offset;
      if (adjusted === candidateMs) break;
      candidateMs = adjusted;
    }

    const result = new Date(candidateMs);
    const actual = zonedParts(result);
    const matches = actual
      && actual.year === day.year
      && actual.month === day.month
      && actual.day === day.day
      && actual.hour === time.hour
      && actual.minute === time.minute
      && actual.second === time.second;
    if (!matches) {
      throw new RangeError(`The selected local time does not exist in ${BUSINESS_TIME_ZONE}.`);
    }
    return result;
  }

  function toIso(dayValue, timeValue = "00:00") {
    return fromWallTime(dayValue, timeValue).toISOString();
  }

  function addWallMinutesIso(dayValue, timeValue, minutes) {
    const day = parseDateKey(dayValue);
    const time = parseTimeKey(timeValue);
    const wallClock = new Date(Date.UTC(day.year, day.month - 1, day.day, time.hour, time.minute, time.second));
    wallClock.setUTCMinutes(wallClock.getUTCMinutes() + Number(minutes || 0));
    const endDay = `${wallClock.getUTCFullYear()}-${pad2(wallClock.getUTCMonth() + 1)}-${pad2(wallClock.getUTCDate())}`;
    const endTime = `${pad2(wallClock.getUTCHours())}:${pad2(wallClock.getUTCMinutes())}:${pad2(wallClock.getUTCSeconds())}`;
    try {
      return toIso(endDay, endTime);
    } catch {
      // A wall-clock end can fall in the skipped hour when daylight saving starts.
      const start = fromWallTime(dayValue, timeValue);
      start.setTime(start.getTime() + Number(minutes || 0) * 60000);
      return start.toISOString();
    }
  }

  function addWallMinutesFromInstantIso(value, minutes) {
    const parts = zonedParts(value);
    if (!parts) return "";
    const day = `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
    const clock = `${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}`;
    try {
      return addWallMinutesIso(day, clock, minutes);
    } catch {
      // If the wall-clock end falls inside a daylight-saving gap, preserve elapsed duration.
      const date = asDate(value);
      date.setTime(date.getTime() + Number(minutes || 0) * 60000);
      return date.toISOString();
    }
  }

  const time = {
    zone: BUSINESS_TIME_ZONE,
    parts: zonedParts,
    dateKey,
    timeKey,
    dateTimeKey,
    monthKey,
    todayKey: () => dateKey(new Date()),
    calendarDate,
    formatDate,
    formatTime,
    fromWallTime,
    toIso,
    addWallMinutesIso,
    addWallMinutesFromInstantIso
  };

  function readConfig() {
    const cfg = window.CN_CONFIG || {};
    const url = (cfg.SUPABASE_URL || "").trim();
    const key = (cfg.SUPABASE_ANON_KEY || "").trim();

    if (!url || !key || url.toUpperCase().includes("YOUR_PROJECT") || key.toUpperCase().includes("YOUR_SUPABASE")) {
      // Fail loudly: without a valid config, supabase-js will make requests to a placeholder URL and you'll see "Failed to fetch".
      throw new Error("Supabase config missing. Edit config.js with your SUPABASE_URL and SUPABASE_ANON_KEY, then hard refresh.");
    }
    return { url, key };
  }

  // Lazily create the client the first time we need it.
  let _sb = null;
  function sb() {
    if (_sb) return _sb;
    const { url, key } = readConfig();
    _sb = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return _sb;
  }

  async function getSession() {
    const { data, error } = await sb().auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function requireSession() {
    const s = await getSession();
    if (!s) {
      const page = window.location.pathname.split("/").pop() || "";
      const returnTo = `${page}${window.location.search || ""}`;
      const loginUrl = page && page !== "login.html"
        ? `login.html?next=${encodeURIComponent(returnTo)}`
        : "login.html";
      window.location.href = loginUrl;
      throw new Error("Auth session missing. Please sign in again.");
    }
    return s;
  }

  async function getProfile() {
    await requireSession();
    const { data, error } = await sb().from("profiles").select("id, tenant_id, role, name, is_active").eq("id", (await sb().auth.getUser()).data.user.id).single();
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { error } = await sb().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return true;
  }

  async function signOut() {
    await sb().auth.signOut();
    window.location.href = "login.html";
  }

  function fmtDate(d) {
    return dateKey(d);
  }

  window.CN = {
    // expose a getter so other modules always get the initialized client
    get sb() { return sb(); },
    getSession,
    requireSession,
    getProfile,
    signIn,
    signOut,
    fmtDate,
    time,
  };
})();
