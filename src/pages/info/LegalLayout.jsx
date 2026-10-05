import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import InfoHero from "./InfoHero";
import { useReveal, useScrollProgress, useScrollSpy } from "./useInfoEffects";
import { CONTACT_EMAIL, LAST_UPDATED, INFO_PAGES_LANG } from "./siteInfo";
import "./info.css";

const OTHERS = {
  privacy: { to: "/terms", labelKey: "info.readTerms" },
  terms: { to: "/privacy", labelKey: "info.readPrivacy" },
};

/** Shared layout for the Privacy Policy and Terms pages: hero, summary, sticky contents list, sections. */
export default function LegalLayout({ kind, docs }) {
  const { t: tCtx, tEn, lang } = useLanguage();
  // Hand-written text, shown instantly (no machine translation). The pages stay English in every language
  // unless INFO_PAGES_LANG (siteInfo.js) is set to "follow".
  const english = INFO_PAGES_LANG === "en";
  const t = english ? tEn : tCtx;
  const doc = (english ? docs.en : docs[lang]) || docs.en;
  const tr = (x) => x;
  const rootRef = useRef(null);
  const progress = useScrollProgress();
  const ids = useMemo(() => doc.sections.map((s) => s.id), [doc]);
  const [active, setActive] = useScrollSpy(ids);
  useReveal(rootRef, [kind]);

  useEffect(() => {
    document.title = `${tr(doc.title)} · Vartha`;
  });

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const words = doc.sections.reduce((n, s) => n + s.body.reduce((m, b) => m + (typeof b === "string" ? b.split(" ").length : b.list ? b.list.join(" ").split(" ").length : 0), 0), 0);
  const minutes = Math.max(1, Math.round(words / 200));
  const other = OTHERS[kind];

  return (
    <div ref={rootRef} className="ip-page">
      <div className="ip-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>

      <InfoHero eyebrow={t(kind === "privacy" ? "info.privacyEyebrow" : "info.termsEyebrow")} title={tr(doc.title)} lead={tr(doc.lead)} compact>
        <div className="ip-hero__chips">
          <span className="ip-chip">{t("info.updated")}: {LAST_UPDATED}</span>
          <span className="ip-chip">{minutes} {t("info.minRead")}</span>
        </div>
      </InfoHero>

      <div className="container ip-legal">
        <section className="ip-summary ip-reveal" aria-label={t("info.inShort")}>
          <h2>{t("info.inShort")}</h2>
          <ul>
            {doc.summary.map((s, i) => (
              <li key={i} className="ip-reveal" style={{ "--d": `${i * 90}ms` }}>
                <span className="ip-summary__tick" aria-hidden="true">✓</span>
                <span>{tr(s)}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="ip-legal__grid">
          <nav className="ip-toc" aria-label={t("info.contents")}>
            <p className="ip-toc__title">{t("info.contents")}</p>
            <ol>
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={go(s.id)} className={active === s.id ? "is-active" : undefined} aria-current={active === s.id ? "true" : undefined}>
                    <span className="ip-toc__n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ip-toc__t">{tr(s.title)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="ip-doc">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="ip-sec ip-reveal">
                <h2>
                  <span className="ip-sec__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {tr(s.title)}
                </h2>
                {s.body.map((b, j) => {
                  if (typeof b === "string") return <p key={j}>{tr(b)}</p>;
                  if (b.list) return <ul key={j} className="ip-list">{b.list.map((li, k) => <li key={k}>{tr(li)}</li>)}</ul>;
                  if (b.contact)
                    return (
                      <div key={j} className="ip-contact">
                        <span className="ip-contact__label">{t("info.emailUs")}</span>
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                      </div>
                    );
                  return null;
                })}
              </section>
            ))}

            <div className="ip-next ip-reveal">
              <div>
                <p className="ip-next__label">{t("info.alsoRead")}</p>
                <Link to={other.to} className="ip-next__link">{t(other.labelKey)} →</Link>
              </div>
              <Link to="/about" className="ip-btn ip-btn--ghost">{t("info.aboutUs")}</Link>
            </div>
          </article>
        </div>
      </div>

      <button type="button" className={`ip-top${progress > 0.12 ? " is-on" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t("info.backToTop")}>
        ↑
      </button>
    </div>
  );
}
