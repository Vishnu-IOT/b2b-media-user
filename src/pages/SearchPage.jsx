import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  businessApi, storiesApi, strategiesApi, achievementsApi, productsApi,
  enquiriesApi, videosApi, resourcesApi, questionsApi,
} from "../api/endpoints";
import { fileUrl } from "../api/client";
import "../styles/search-page.css";

const LIMIT = 30; // items fetched per content type

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
  { key: "businesses", label: "Businesses", list: (p) => businessApi.list(p),
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
  { key: "resources", label: "Resources", list: (p) => resourcesApi.list(p),
    title: (i) => i.title, sub: (i) => i.category && i.category.name,
    text: (i) => [i.title, i.summary, i.content, i.category && i.category.name],
    snippet: (i) => [i.summary, i.content], href: (i) => `/resources/${i.slug}`, image: (i) => i.coverImage },
  { key: "community", label: "Community", list: (p) => questionsApi.list(p),
    title: (i) => i.title, sub: (i) => i.category,
    text: (i) => [i.title, i.description, i.category],
    snippet: (i) => [i.description], href: (i) => `/community/${i.id}`, image: () => null },
];

const SUGGESTIONS = [
  { label: "Stories", to: "/stories" }, { label: "Products", to: "/products" },
  { label: "Businesses", to: "/businesses" }, { label: "Enquiries", to: "/enquiries" },
  { label: "Videos", to: "/videos" }, { label: "Resources", to: "/resources" },
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

export default function SearchPage() {
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
  const visible = filter === "all" ? state.results : state.results.filter((r) => r.type === filter);
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
            placeholder="Search stories, products, businesses, enquiries…"
            aria-label="Search"
          />
          {input && (
            <button type="button" className="search-box__clear" onClick={() => { setInput(""); setParams({}, { replace: true }); inputRef.current && inputRef.current.focus(); }} aria-label="Clear search">
              ✕
            </button>
          )}
          <button type="submit" className="btn btn-primary search-box__go">Search</button>
        </form>

        {state.status === "idle" && (
          <div className="search-hint">
            <h1>What are you looking for?</h1>
            <p>Search across stories, products, businesses, supplier enquiries, videos, resources and community questions.</p>
            <div className="search-hint__chips">
              {SUGGESTIONS.map((s) => <Link key={s.to} to={s.to}>{s.label}</Link>)}
            </div>
          </div>
        )}

        {state.status === "loading" && (
          <div className="search-loading" role="status" aria-live="polite">
            <span className="sr-only">Searching…</span>
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
            <h2>We couldn't run your search</h2>
            <p>Please check your connection and try again.</p>
            <button className="btn btn-outline" onClick={() => setParams({ q: urlQuery.trim() })}>Try again</button>
          </div>
        )}

        {state.status === "done" && (
          <>
            <p className="search-count" aria-live="polite">
              {state.results.length === 0
                ? "No results"
                : `${state.results.length} result${state.results.length === 1 ? "" : "s"}`} for <strong>“{urlQuery.trim()}”</strong>
            </p>

            {state.results.length > 0 && (
              <div className="search-filters" role="tablist" aria-label="Filter by type">
                <button role="tab" aria-selected={filter === "all"} className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>
                  All <span>{state.results.length}</span>
                </button>
                {SOURCES.filter((s) => counts[s.key]).map((s) => (
                  <button key={s.key} role="tab" aria-selected={filter === s.key} className={filter === s.key ? "is-active" : ""} onClick={() => setFilter(s.key)}>
                    {s.label} <span>{counts[s.key]}</span>
                  </button>
                ))}
              </div>
            )}

            {state.results.length === 0 && (
              <div className="search-empty">
                <h2>Nothing matched “{urlQuery.trim()}”</h2>
                <p>Try a shorter or different word, check the spelling, or browse a section instead.</p>
                <div className="search-hint__chips">
                  {SUGGESTIONS.map((s) => <Link key={s.to} to={s.to}>{s.label}</Link>)}
                </div>
              </div>
            )}

            <ul className="search-results">
              {visible.map((r) => (
                <li key={r.id}>
                  <Link to={r.href} className="search-result">
                    <div className="search-result__thumb">
                      {r.image ? <img src={fileUrl(r.image)} alt="" loading="lazy" /> : <span>{(r.title || "?").charAt(0)}</span>}
                    </div>
                    <div className="search-result__body">
                      <span className="eyebrow">{r.label}</span>
                      <h3><Highlight text={r.title} words={words} /></h3>
                      {r.snippet && <p><Highlight text={r.snippet} words={words} /></p>}
                      {r.sub && <span className="search-result__sub">{r.sub}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {state.failed > 0 && state.results.length > 0 && (
              <p className="search-note">Some sections couldn't be searched just now, so a few results may be missing.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
