import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vartha_lang";
const LanguageContext = createContext(null);

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
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ta") return saved;
    } catch {
      /* storage unavailable */
    }
    return "ta"; // Tamil is the default/primary language
  });
  const [dictionaries, setDictionaries] = useState({ en: {}, ta: {} });
  const [loaded, setLoaded] = useState(false);

  // Fetch both JSON dictionaries once, at runtime, from /public/i18n/*.json
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/i18n/en.json").then((r) => r.json()),
      fetch("/i18n/ta.json").then((r) => r.json()),
    ])
      .then(([en, ta]) => {
        if (!cancelled) {
          setDictionaries({ en, ta });
          setLoaded(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load static UI translations:", err);
        if (!cancelled) setLoaded(true); // fall through to key-as-fallback rather than block the UI
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "ta" ? "ta" : "en");
  }, [lang]);

  const value = useMemo(() => {
    const switchLanguage = (newLang) => {
      if (newLang !== "en" && newLang !== "ta") return;
      setLang(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        /* storage unavailable */
      }
    };
    const dict = dictionaries[lang] || dictionaries.ta || {};
    const fallback = dictionaries.ta || {};
    const t = (key) => (dict[key] !== undefined ? dict[key] : fallback[key] !== undefined ? fallback[key] : key);
    const toggleLang = () => switchLanguage(lang === "ta" ? "en" : "ta");
    return { lang, switchLanguage, toggleLang, t, loaded };
  }, [lang, dictionaries, loaded]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}
