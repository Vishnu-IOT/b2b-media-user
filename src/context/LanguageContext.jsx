import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vartha_lang";
const CACHE_KEY = "vartha_i18n_cache_v1";
const LanguageContext = createContext(null);

// The last dictionaries we downloaded. Reading them synchronously means a page refresh paints
// real text on the very first render instead of showing raw keys (e.g. "nav.home") while the
// JSON files are still downloading.
function readCachedDictionaries() {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (c && c.en && c.ta) return c;
  } catch {
    /* no cache, or storage unavailable */
  }
  return null;
}

/**
 * Two kinds of text, handled separately:
 *
 *  1. STATIC UI text (nav, footer, section titles, buttons, labels) lives in
 *     /public/i18n/en.json and /public/i18n/ta.json and is read with t("some.key").
 *     It is never machine-translated.
 *
 *  2. DYNAMIC text that comes back from the API (story titles, descriptions, categories...)
 *     is translated section by section with useSectionTranslator() — each section owns its
 *     own translator and only translates the strings it displays.
 *
 * There is no page-wide Google Translate widget any more, so switching language is instant:
 * no cookie, no page reload.
 */
export function LanguageProvider({ children }) {
  // Always start in Tamil on every page load/refresh (the choice is not saved).
  const [lang, setLang] = useState("ta");
  // Start from the cached copy when there is one (instant), otherwise empty until the download ends.
  const [dictionaries, setDictionaries] = useState(() => readCachedDictionaries() || { en: {}, ta: {} });
  const [loaded, setLoaded] = useState(() => readCachedDictionaries() !== null);

  // Always fetch the JSON files from /public/i18n/*.json, then refresh the cache. With a cache this
  // runs silently in the background (so edits to the JSON show up on the next load); without one
  // the app waits for it, see the gate below.
  useEffect(() => {
    let cancelled = false;
    const base = process.env.PUBLIC_URL || "";
    const opts = { cache: readCachedDictionaries() ? "no-cache" : "default" };
    Promise.all([
      fetch(`${base}/i18n/en.json`, opts).then((r) => r.json()),
      fetch(`${base}/i18n/ta.json`, opts).then((r) => r.json()),
    ])
      .then(([en, ta]) => {
        if (cancelled) return;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ en, ta }));
        } catch {
          /* storage full or unavailable: the app still works, it just re-downloads next time */
        }
        setDictionaries((prev) => (JSON.stringify(prev) === JSON.stringify({ en, ta }) ? prev : { en, ta }));
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load static UI translations:", err);
        if (!cancelled) setLoaded(true); // offline on a first visit: show the app (with keys) rather than a spinner forever
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "ta" ? "ta" : "en");
  }, [lang]);

  const value = useMemo(() => {
    const switchLanguage = (newLang) => {
      if (newLang !== "en" && newLang !== "ta") return;
      setLang(newLang); // lasts only until the next refresh
    };
    const dict = dictionaries[lang] || dictionaries.ta || {};
    const fallback = dictionaries.ta || {};
    const t = (key) => (dict[key] !== undefined ? dict[key] : fallback[key] !== undefined ? fallback[key] : key);
    const toggleLang = () => switchLanguage(lang === "ta" ? "en" : "ta");
    return { lang, switchLanguage, toggleLang, t, loaded };
  }, [lang, dictionaries, loaded]);

  // First visit only (no cached copy yet): show a plain spinner for a moment instead of an app full of
  // raw keys. Every later visit has the cache, so this is skipped and the page paints with real text.
  if (!loaded) {
    return (
      <div role="status" aria-label="Loading" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="i18n-boot-spinner" />
        <style>{`.i18n-boot-spinner{width:34px;height:34px;border:3px solid #e4e4e4;border-top-color:#111;border-radius:50%;animation:i18nboot .8s linear infinite}@keyframes i18nboot{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}
