import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  businessApi, storiesApi, strategiesApi, achievementsApi, productsApi,
  enquiriesApi, videosApi, resourcesApi, questionsApi,
} from "../api/endpoints";
import { fileUrl } from "../api/client";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";
import "../styles/search-page.css";

const LIMIT = 30; // items fetched per content type
const PAGE = 10; // results shown at a time (each shown result translates its own text)

/**
 * One entry per searchable content type. `text` lists every field that can match;
 * `snippet` lists the fields used to build the preview line under the title.
 */
const SOURCES = [
  { key: "stories", label: "Stories", list: (p) => storiesApi.list(p),
    title: (i) => i.title, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.title, i.content, i.business && i.business.companyName, i.business && i.business.industry],
    snippet: (i) => [i.content], href: (i) => `/stories/${i.id}`, image: (i) => i.coverImage },
  { key: "strategies", label: "Strategies", list: (p) => strategiesApi.list(p),
    title: (i) => i.title, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.title, i.content, i.business && i.business.companyName],
    snippet: (i) => [i.content], href: (i) => `/strategies/${i.id}`, image: (i) => i.coverImage },
  { key: "achievements", label: "Achievements", list: (p) => achievementsApi.list(p),
    title: (i) => i.title, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.title, i.description, i.awardedBy, i.business && i.business.companyName],
    snippet: (i) => [i.description], href: (i) => `/achievements/${i.id}`, image: (i) => i.image },
  { key: "products", label: "Products", list: (p) => productsApi.list(p),
    title: (i) => i.name, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.name, i.description, i.category, i.business && i.business.companyName],
    snippet: (i) => [i.description], href: (i) => `/products/${i.slug}`, image: (i) => i.image },
  { key: "businesses", label: "Businesses", nameTitle: true, subTr: true, list: (p) => businessApi.list(p),
    title: (i) => i.companyName, sub: (i) => [i.industry, i.location].filter(Boolean).join(" · "),
    text: (i) => [i.companyName, i.industry, i.location, i.description, i.tagline],
    snippet: (i) => [i.description, i.tagline], href: (i) => `/businesses/${i.slug}`, image: (i) => i.coverImage || i.logo },
  { key: "enquiries", label: "Enquiries", list: (p) => enquiriesApi.list(p),
    title: (i) => i.title, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.title, i.description, i.category, i.location, i.business && i.business.companyName],
    snippet: (i) => [i.description], href: (i) => `/enquiries/${i.id}`, image: () => null },
  { key: "videos", label: "Videos", list: (p) => videosApi.list(p),
    title: (i) => i.title, sub: (i) => i.business && i.business.companyName,
    text: (i) => [i.title, i.description, i.business && i.business.companyName],
    snippet: (i) => [i.description], href: (i) => `/videos/${i.id}`, image: (i) => i.thumbnail },
  { key: "resources", label: "Resources", subTr: true, list: (p) => resourcesApi.list(p),
    title: (i) => i.title, sub: (i) => i.category && i.category.name,
    text: (i) => [i.title, i.summary, i.content, i.category && i.category.name],
    snippet: (i) => [i.summary, i.content], href: (i) => `/resources/${i.slug}`, image: (i) => i.coverImage },
  { key: "community", label: "Community", subTr: true, list: (p) => questionsApi.list(p),
    title: (i) => i.title, sub: (i) => i.category,
    text: (i) => [i.title, i.description, i.category],
    snippet: (i) => [i.description], href: (i) => `/community/${i.id}`, image: () => null },
];

const SUGGESTIONS = [
  { key: "stories", to: "/stories" }, { key: "products", to: "/products" },
  // { key: "businesses", to: "/businesses" }, { key: "enquiries", to: "/enquiries" },
  { key: "videos", to: "/videos" }, { key: "resources", to: "/resources" },
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clean = (v) => (v == null ? "" : String(v).replace(/\s+/g, " ").trim());

function toWords(q) {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

// The API gets the query (`q`) AND we check every word on the client, so results are
// correct whether or not an endpoint filters by `q` itself.
function matches(src, item, words) {
  const hay = src.text(item).map(clean).join(" ").toLowerCase();
  return words.every((w) => hay.includes(w));
}

function snippetFor(parts, words) {
  for (const raw of parts) {
    const text = clean(raw);
    if (!text) continue;
    const low = text.toLowerCase();
    const hits = words.map((w) => low.indexOf(w)).filter((i) => i >= 0).sort((a, b) => a - b);
    if (hits.length) {
      const start = Math.max(0, hits[0] - 60);
      return (start > 0 ? "…" : "") + text.slice(start, start + 170) + (text.length > start + 170 ? "…" : "");
    }
  }
  const first = parts.map(clean).find(Boolean) || "";
  return first.length > 170 ? first.slice(0, 170) + "…" : first;
}

function Highlight({ text, words }) {
  if (!text) return null;
  if (!words.length) return text;
  const re = new RegExp(`(${words.map(escapeRe).join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? <mark key={i}>{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

/**
 * One search result. Each row has its own translator (like every other card), so the title /
 * snippet / category come from the API and are translated here; company names are left as written.
 * The row stays hidden until its Tamil text is ready, so English never flashes first.
 */
function ResultRow({ r, words }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator();
  return (
    <li>
      <Link to={r.href} className={`search-result${pending ? " is-translating" : ""}`}>
        <div className="search-result__thumb">
          {r.image ? <img src={fileUrl(r.image)} alt="" loading="lazy" /> : <span>{(r.title || "?").charAt(0)}</span>}
        </div>
        <div className="search-result__body">
          <span className="eyebrow">{t(`search.type.${r.type}`)}</span>
          <h3><Highlight text={r.nameTitle ? r.title : tr(r.title)} words={words} /></h3>
          {r.snippet && <p><Highlight text={tr(r.snippet)} words={words} /></p>}
          {r.sub && <span className="search-result__sub">{r.subTr ? tr(r.sub) : r.sub}</span>}
        </div>
      </Link>
    </li>
  );
}

export default function SearchPage() {
  const { t } = useLanguage();
  const [shown, setShown] = useState(PAGE);
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const [input, setInput] = useState(urlQuery);
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState({ status: urlQuery ? "loading" : "idle", results: [], failed: 0 });
  const requestId = useRef(0);
  const inputRef = useRef(null);

  // Keep the box in sync when the URL changes (back/forward, header link).
  useEffect(() => setInput(urlQuery), [urlQuery]);

  // Typing updates the URL after a short pause (so each keystroke doesn't hit the API).
  useEffect(() => {
    const t = setTimeout(() => {
      const next = input.trim();
      if (next !== urlQuery.trim()) setParams(next ? { q: next } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const q = urlQuery.trim();
    const words = toWords(q);
    if (!words.length) {
      setState({ status: "idle", results: [], failed: 0 });
      return;
    }
    const id = ++requestId.current;
    setState((s) => ({ ...s, status: "loading" }));
    setFilter("all");
    setShown(PAGE);
    Promise.allSettled(SOURCES.map((src) => src.list({ q, limit: LIMIT }))).then((settled) => {
      if (id !== requestId.current) return; // a newer search has started
      let failed = 0;
      const results = [];
      settled.forEach((r, idx) => {
        const src = SOURCES[idx];
        if (r.status !== "fulfilled") {
          failed++;
          return;
        }
        const items = (r.value && r.value.items) || (Array.isArray(r.value) ? r.value : []);
        items.filter((it) => matches(src, it, words)).forEach((it) =>
          results.push({
            type: src.key, label: src.label, id: `${src.key}-${it.id}`,
            nameTitle: !!src.nameTitle, subTr: false, // company names, categories and other labels always stay English
            title: clean(src.title(it)), sub: clean(src.sub(it)),
            snippet: snippetFor(src.snippet(it), words), href: src.href(it),
            image: src.image(it),
          })
        );
      });
      setState({ status: failed === SOURCES.length ? "error" : "done", results, failed });
    });
  }, [urlQuery]);

  const words = useMemo(() => toWords(urlQuery.trim()), [urlQuery]);
  const counts = useMemo(() => {
    const c = {};
    state.results.forEach((r) => (c[r.type] = (c[r.type] || 0) + 1));
    return c;
  }, [state.results]);
  const filtered = filter === "all" ? state.results : state.results.filter((r) => r.type === filter);
  const visible = filtered.slice(0, shown);
  // "{n} results for {q}" — the query is bold, and the sentence order is up to the language file.
  const countLine = () => {
    const n = state.results.length;
    const tpl = t(n === 0 ? "search.count.none" : n === 1 ? "search.count.one" : "search.count.many");
    const [before, after = ""] = tpl.split("{q}");
    return (
      <>
        {before.replace("{n}", n)}<strong>“{urlQuery.trim()}”</strong>{after.replace("{n}", n)}
      </>
    );
  };
  const submit = (e) => {
    e.preventDefault();
    const next = input.trim();
    setParams(next ? { q: next } : {}, { replace: true });
  };

  return (
    <div className="page-shell search-page">
      <div className="container search-page__inner">
        <form className="search-box" onSubmit={submit} role="search">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.label")}
          />
          {input && (
            <button type="button" className="search-box__clear" onClick={() => { setInput(""); setParams({}, { replace: true }); inputRef.current && inputRef.current.focus(); }} aria-label={t("search.clear")}>
              ✕
            </button>
          )}
          <button type="submit" className="btn btn-primary search-box__go">{t("search.button")}</button>
        </form>

        {state.status === "idle" && (
          <div className="search-hint">
            <h1>{t("search.hintTitle")}</h1>
            <p>{t("search.hintText")}</p>
            <div className="search-hint__chips">
              {SUGGESTIONS.map((s) => <Link key={s.to} to={s.to}>{t(`search.type.${s.key}`)}</Link>)}
            </div>
          </div>
        )}

        {state.status === "loading" && (
          <div className="search-loading" role="status" aria-live="polite">
            <span className="sr-only">{t("search.searching")}</span>
            {[0, 1, 2, 3].map((i) => (
              <div className="search-skel" key={i} aria-hidden="true">
                <div className="skeleton search-skel__img" />
                <div className="search-skel__text">
                  <div className="skeleton skeleton--line skeleton--short" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line skeleton--mid" />
                </div>
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="search-empty">
            <h2>{t("search.errorTitle")}</h2>
            <p>{t("search.errorText")}</p>
            <button className="btn btn-outline" onClick={() => setParams({ q: urlQuery.trim() })}>{t("search.tryAgain")}</button>
          </div>
        )}

        {state.status === "done" && (
          <>
            <p className="search-count" aria-live="polite">
              {countLine()}
            </p>

            {state.results.length > 0 && (
              <div className="search-filters" role="tablist" aria-label={t("search.filterBy")}>
                <button role="tab" aria-selected={filter === "all"} className={filter === "all" ? "is-active" : ""} onClick={() => { setFilter("all"); setShown(PAGE); }}>
                  {t("search.all")} <span>{state.results.length}</span>
                </button>
                {SOURCES.filter((s) => counts[s.key]).map((s) => (
                  <button key={s.key} role="tab" aria-selected={filter === s.key} className={filter === s.key ? "is-active" : ""} onClick={() => { setFilter(s.key); setShown(PAGE); }}>
                    {t(`search.type.${s.key}`)} <span>{counts[s.key]}</span>
                  </button>
                ))}
              </div>
            )}

            {state.results.length === 0 && (
              <div className="search-empty">
                <h2>{t("search.emptyTitle").replace("{q}", urlQuery.trim())}</h2>
                <p>{t("search.emptyText")}</p>
                <div className="search-hint__chips">
                  {SUGGESTIONS.map((s) => <Link key={s.to} to={s.to}>{t(`search.type.${s.key}`)}</Link>)}
                </div>
              </div>
            )}

            <ul className="search-results">
              {visible.map((r) => <ResultRow key={r.id} r={r} words={words} />)}
            </ul>

            {filtered.length > shown && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setShown((n) => n + PAGE)}>{t("search.showMore")}</button>
              </div>
            )}

            {state.failed > 0 && state.results.length > 0 && (
              <p className="search-note">{t("search.partialNote")}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
