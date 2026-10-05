import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getCached, isSettled, needsTranslation, nextRetryIn, translateMany } from "../i18n/translator";

/**
 * Gives ONE section its own translator for the text that came back from the API.
 *
 *   const { tr, pending } = useSectionTranslator();
 *   <h3>{tr(story.title)}</h3>
 *
 * - `tr(text)` returns the translation if we have it, otherwise the original text (so nothing
 *   ever disappears while a translation is loading).
 * - Every call to `tr` during a render registers that string with THIS section; after the render
 *   the section requests only the strings it actually shows, then re-renders itself — other
 *   sections are not touched.
 * - `pending` is true while this section is waiting on translations. The section is HIDDEN while
 *   pending (see `.is-translating` in styles/variables.css), so the visitor never sees the original
 *   (English) text flip into Tamil — the content appears only once it is translated.
 * - If the translation service fails for a string, the section keeps the original text and the
 *   string is retried automatically a few times (see i18n/translator.js).
 *
 * Do NOT pass static UI text through `tr` — that belongs in /public/i18n/*.json via `t()`.
 * Do not pass names (company names, people) either; they should stay as written.
 */
const HIDE_LIMIT_MS = 6000; // longest a section stays hidden while waiting for its translation

export default function useSectionTranslator(forceLang) {
  // forceLang: pass "en" for parts of the page (navbar, footer) that must stay English in every language.
  const { lang: ctxLang } = useLanguage();
  const lang = forceLang || ctxLang;
  const [, setVersion] = useState(0);
  const [pending, setPending] = useState(false);
  const [timedOut, setTimedOut] = useState(false); // translation is taking too long: stop hiding the text
  const hideTimer = useRef(null);
  const wanted = useRef(new Set()); // strings shown by the CURRENT render
  const awaiting = useRef(new Set()); // "lang|text" keys this section already asked for
  const mounted = useRef(true);
  const retryTimer = useRef(null);

  // Reset on every render: the set then holds exactly what this render displays.
  wanted.current = new Set();

  const tr = (text) => {
    if (typeof text !== "string" || !text) return text;
    if (!needsTranslation(text, lang)) return text;
    wanted.current.add(text);
    const hit = getCached(text, lang);
    return hit === null ? text : hit;
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(retryTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  // No dependency array on purpose: the set of strings changes with the data, and the work is a
  // cheap filter that does nothing once everything is settled. It cannot loop: strings already
  // requested are skipped, and settled strings are never requested again.
  // useLayoutEffect (not useEffect) so "pending" is switched on BEFORE the browser paints. That way the
  // untranslated text is never visible for even one frame: the section stays hidden until it is translated.
  useLayoutEffect(() => {
    const missing = [...wanted.current].filter((text) => !isSettled(text, lang));
    if (!missing.length) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
      setPending(false);
      setTimedOut(false);
      return;
    }
    setPending(true);
    if (!hideTimer.current) {
      // Safety net: if the translation service is down, show the original text after a few seconds
      // instead of leaving the section blank forever.
      hideTimer.current = setTimeout(() => {
        hideTimer.current = null;
        if (mounted.current) setTimedOut(true);
      }, HIDE_LIMIT_MS);
    }

    const fresh = missing.filter((text) => !awaiting.current.has(`${lang}|${text}`));
    if (!fresh.length) return; // already on its way — the earlier request will re-render us

    fresh.forEach((text) => awaiting.current.add(`${lang}|${text}`));
    translateMany(fresh, lang).then(() => {
      fresh.forEach((text) => awaiting.current.delete(`${lang}|${text}`));
      if (!mounted.current) return;
      setVersion((v) => v + 1); // re-render so tr() picks up what was just translated
      const retryIn = nextRetryIn(fresh, lang); // something failed: try again after a short wait
      if (retryIn !== null) {
        clearTimeout(retryTimer.current);
        retryTimer.current = setTimeout(() => {
          if (mounted.current) setVersion((v) => v + 1);
        }, retryIn + 50);
      }
    });
  });

  return { tr, pending: pending && !timedOut };
}
