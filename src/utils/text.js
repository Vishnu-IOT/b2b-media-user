/** Strips simple HTML tags and truncates to `length` characters at a word boundary. */
export function excerpt(raw, length = 160) {
  if (!raw) return "";
  const text = raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
}

/** `lang` is optional ("en" | "ta"): pass it so month names follow the selected language. */
export function formatDate(value, lang) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** `t` is optional: pass LanguageContext's t() so the "min read" label follows the selected language. */
export function readingTime(raw, t) {
  const words = raw ? raw.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length : 0;
  const minutes = raw ? Math.max(1, Math.round(words / 200)) : 1;
  return `${minutes} ${t ? t("common.minRead") : "min read"}`;
}

/** Converts a canonical YouTube watch URL into an embeddable iframe URL. */
export function youtubeEmbedUrl(watchUrl) {
  try {
    const u = new URL(watchUrl);
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

/** Normalises API text so line breaks survive: CRLF -> LF, and literal "\n" sequences -> real newlines. */
export function normalizeText(raw) {
  if (!raw) return "";
  let t = String(raw).replace(/\r\n?/g, "\n");
  if (!t.includes("\n") && t.includes("\\n")) t = t.replace(/\\r\\n|\\n/g, "\n");
  return t.trim();
}

/** Splits text into paragraphs on blank lines. Single newlines inside a paragraph are kept
 *  (rendered as line breaks via CSS white-space: pre-line). */
export function toParagraphs(raw) {
  return normalizeText(raw).split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
}
