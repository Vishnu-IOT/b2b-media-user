/**
 * Machine translation for DYNAMIC content only (text that comes back from the API).
 *
 * Static UI text (section titles, buttons, nav...) never goes through here — it comes from
 * /public/i18n/en.json and ta.json via `t()` in LanguageContext.
 *
 * Providers (picked automatically):
 *  1. REACT_APP_TRANSLATE_URL set  -> POST { target, texts: [...] } to your own backend, which
 *     should answer { translations: [...] } or { data: { translations: [...] } } in the same order.
 *     RECOMMENDED for production: keeps keys/quotas on the server and is not rate-limited per visitor.
 *  2. Otherwise                    -> Google's public "gtx" endpoint, one request per string.
 *     Works without a key but it is an unofficial endpoint: it can be throttled or change.
 *
 * Results are cached in memory and in localStorage, so a string is translated once per browser.
 * Failures never throw — the caller simply keeps showing the original text.
 *
 * Reliability notes (why this file looks the way it does):
 *  - Every string is requested, cached and failed INDIVIDUALLY. One bad request can no longer
 *    poison a whole batch of strings (that used to leave whole sections stuck in one language).
 *  - A failed string is retried a few times with a growing delay instead of being given up on for
 *    the whole session (the public endpoint throttles bursts, so the first attempt can fail).
 *  - All sections share one request queue, so a page with many cards cannot flood the endpoint.
 */

const BACKEND_URL = process.env.REACT_APP_TRANSLATE_URL || "";
const LS_KEY = "vartha_tr_cache_v2";
const LS_OLD_KEYS = ["vartha_tr_cache_v1"];
const LS_MAX_CHARS = 1500000; // total characters kept in localStorage (newest win)
const MAX_CONCURRENT = 6; // simultaneous requests across the whole page
const MAX_CHUNK = 1200; // characters per gtx request (GET url length)
const BACKEND_BATCH = 40; // strings per POST to your own backend
const MAX_TRIES = 3; // attempts per string before we stop trying this session
const RETRY_MS = 4000; // base delay before a retry (multiplied by the number of failures)

const TAMIL_RE = /[\u0B80-\u0BFF]/g;
const LATIN_RE = /[A-Za-z]/g;

const cache = new Map(); // "ta|Hello" -> "வணக்கம்"
const failed = new Map(); // key -> { at: timestamp, tries: number }
const inflight = new Map(); // key -> Promise<void>
let hydrated = false;
let saveTimer = null;
let warned = false;

const keyOf = (text, target) => `${target}|${text}`;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    LS_OLD_KEYS.forEach((k) => localStorage.removeItem(k));
    const raw = localStorage.getItem(LS_KEY);
    if (raw) Object.entries(JSON.parse(raw)).forEach(([k, v]) => typeof v === "string" && v && cache.set(k, v));
  } catch {
    /* storage unavailable or corrupt — start empty */
  }
}

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      // Keep the newest entries (Map keeps insertion order) until the size budget is used.
      const kept = [];
      let chars = 0;
      const all = [...cache.entries()];
      for (let i = all.length - 1; i >= 0; i -= 1) {
        chars += all[i][0].length + all[i][1].length;
        if (chars > LS_MAX_CHARS) break;
        kept.push(all[i]);
      }
      localStorage.setItem(LS_KEY, JSON.stringify(Object.fromEntries(kept.reverse())));
    } catch {
      /* quota exceeded / private mode — in-memory cache still works */
    }
  }, 400);
}

/** Does this text need translating into `target` ("en" | "ta")? Skips text already in that language. */
export function needsTranslation(text, target) {
  if (!text || typeof text !== "string") return false;
  const tamil = (text.match(TAMIL_RE) || []).length;
  const latin = (text.match(LATIN_RE) || []).length;
  if (target === "ta") return latin > 0 && latin >= tamil;
  return tamil > 0 && tamil >= latin;
}

/** Cached translation, or null if we do not have one yet. */
export function getCached(text, target) {
  hydrate();
  const hit = cache.get(keyOf(text, target));
  return hit === undefined ? null : hit;
}

/**
 * True when there is nothing more to request right now: the string is translated, or it failed
 * recently (wait for the retry delay), or it has used up all its attempts this session.
 */
export function isSettled(text, target) {
  hydrate();
  const k = keyOf(text, target);
  if (cache.has(k)) return true;
  const f = failed.get(k);
  if (!f) return false;
  if (f.tries >= MAX_TRIES) return true;
  return Date.now() - f.at < RETRY_MS * f.tries;
}

/** Milliseconds until the earliest failed string in `texts` may be retried, or null if none will be. */
export function nextRetryIn(texts, target) {
  let best = null;
  texts.forEach((text) => {
    const f = failed.get(keyOf(text, target));
    if (!f || f.tries >= MAX_TRIES || cache.has(keyOf(text, target))) return;
    const wait = Math.max(0, f.at + RETRY_MS * f.tries - Date.now());
    if (best === null || wait < best) best = wait;
  });
  return best;
}

function markFailed(text, target, err) {
  const k = keyOf(text, target);
  const prev = failed.get(k);
  failed.set(k, { at: Date.now(), tries: (prev ? prev.tries : 0) + 1 });
  if (!warned && typeof console !== "undefined") {
    warned = true; // one message is enough; the rest would only spam the console
    console.warn("Translation request failed; showing original text and retrying.", err);
  }
}

function store(text, target, result) {
  if (typeof result !== "string" || !result.trim()) throw new Error("empty translation");
  const k = keyOf(text, target);
  cache.set(k, result);
  failed.delete(k);
}

function splitChunks(text) {
  if (text.length <= MAX_CHUNK) return [text];
  const parts = text.split(/(?<=[.!?।\n])\s+/);
  const chunks = [];
  let current = "";
  parts.forEach((p) => {
    if ((current + " " + p).length > MAX_CHUNK && current) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? `${current} ${p}` : p;
    }
  });
  if (current) chunks.push(current);
  return chunks.flatMap((c) => (c.length > MAX_CHUNK ? c.match(new RegExp(`.{1,${MAX_CHUNK}}`, "gs")) : [c]));
}

async function gtx(text, target) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t" +
    `&tl=${encodeURIComponent(target)}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const json = await res.json();
  return ((json && json[0]) || []).map((seg) => (seg && seg[0]) || "").join("");
}

async function viaGoogleOne(text, target) {
  const pieces = await Promise.all(splitChunks(text).map((c) => gtx(c, target)));
  return pieces.join(" ");
}

async function viaBackend(texts, target) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, texts }),
  });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const json = await res.json();
  const list = (json && json.translations) || (json && json.data && json.data.translations);
  if (!Array.isArray(list) || list.length !== texts.length) throw new Error("bad translate response");
  return list;
}

/* One shared queue so a busy page cannot fire dozens of requests at once. */
let active = 0;
const waiting = [];
function limited(fn) {
  return new Promise((resolve) => {
    const run = async () => {
      active += 1;
      try {
        resolve(await fn());
      } finally {
        active -= 1;
        if (waiting.length) waiting.shift()();
      }
    };
    if (active < MAX_CONCURRENT) run();
    else waiting.push(run);
  });
}

/**
 * Translates every string that is not cached yet. Resolves when each one has either been
 * translated or has failed this round; never rejects. Safe to call from many sections at once —
 * identical strings share one request.
 */
export function translateMany(texts, target) {
  hydrate();
  const unique = [...new Set(texts)].filter((t) => needsTranslation(t, target) && !isSettled(t, target));
  if (!unique.length) return Promise.resolve();

  const waits = [];
  const fresh = [];
  unique.forEach((t) => {
    const k = keyOf(t, target);
    if (inflight.has(k)) waits.push(inflight.get(k));
    else fresh.push(t);
  });

  if (BACKEND_URL) {
    for (let i = 0; i < fresh.length; i += BACKEND_BATCH) {
      const group = fresh.slice(i, i + BACKEND_BATCH);
      const p = limited(async () => {
        try {
          const results = await viaBackend(group, target);
          group.forEach((t, j) => {
            try {
              store(t, target, results[j]);
            } catch (err) {
              markFailed(t, target, err);
            }
          });
        } catch (err) {
          group.forEach((t) => markFailed(t, target, err));
        } finally {
          group.forEach((t) => inflight.delete(keyOf(t, target)));
          scheduleSave();
        }
      });
      group.forEach((t) => inflight.set(keyOf(t, target), p));
      waits.push(p);
    }
  } else {
    fresh.forEach((t) => {
      const p = limited(async () => {
        try {
          store(t, target, await viaGoogleOne(t, target));
        } catch (err) {
          markFailed(t, target, err);
        } finally {
          inflight.delete(keyOf(t, target));
          scheduleSave();
        }
      });
      inflight.set(keyOf(t, target), p);
      waits.push(p);
    });
  }

  return Promise.all(waits).then(() => undefined);
}
