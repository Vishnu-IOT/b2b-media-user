import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import InfoHero from "./InfoHero";
import { useCountUp, usePointerGlow, useReveal } from "./useInfoEffects";
import { ABOUT } from "./aboutContent";
import { INFO_PAGES_LANG } from "./siteInfo";
import "./info.css";

function Stat({ value, label }) {
  const ref = useRef(null);
  const n = useCountUp(ref, value);
  return (
    <div className="ip-stat ip-reveal" ref={ref}>
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}

function CoverCard({ item, i, tr }) {
  const ref = useRef(null);
  usePointerGlow(ref);
  return (
    <Link ref={ref} to={item.to} className="ip-card ip-reveal" style={{ "--d": `${(i % 3) * 80}ms` }}>
      <span className="ip-card__n">{String(i + 1).padStart(2, "0")}</span>
      <h3>{tr(item.title)}</h3>
      <p>{tr(item.text)}</p>
      <span className="ip-card__go" aria-hidden="true">→</span>
    </Link>
  );
}

export default function AboutPage() {
  const { t: tCtx, tEn, lang } = useLanguage();
  const english = INFO_PAGES_LANG === "en"; // always English unless INFO_PAGES_LANG is "follow" (siteInfo.js)
  const t = english ? tEn : tCtx;
  const tr = (x) => x; // text is hand-written in both languages (see aboutContent.js)
  const rootRef = useRef(null);
  useReveal(rootRef, []);
  const A = (english ? ABOUT.en : ABOUT[lang]) || ABOUT.en;

  useEffect(() => {
    document.title = `${t("info.aboutUs")} · Vartha`;
  });

  const tickerItems = [...A.ticker, ...A.ticker];

  return (
    <div ref={rootRef} className="ip-page">
      <InfoHero eyebrow={tr(A.eyebrow)} title={tr(A.title)} lead={tr(A.lead)} scrollCue>
        <div className="ip-hero__actions">
          <Link to="/stories" className="ip-btn ip-btn--solid">{t("info.readStories")}</Link>
          <Link to="/register" className="ip-btn ip-btn--ghost-light">{tr(A.ctaPrimary)}</Link>
        </div>
      </InfoHero>

      <div className="ip-ticker" aria-hidden="true">
        <div className="ip-ticker__track">
          {tickerItems.map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </div>

      <section className="ip-mission container">
        <p className="ip-eyebrow ip-reveal">{tr(A.mission.eyebrow)}</p>
        <h2 className="ip-mission__text ip-reveal">{tr(A.mission.text)}</h2>
        <p className="ip-mission__body ip-reveal">{tr(A.mission.body)}</p>
      </section>

      <section className="ip-stats">
        <div className="container ip-stats__row">
          {A.stats.map((s, i) => (
            <Stat key={i} value={s.value} label={tr(s.label)} />
          ))}
        </div>
      </section>

      <section className="ip-section container">
        <p className="ip-eyebrow ip-reveal">{tr(A.coverEyebrow)}</p>
        <h2 className="ip-h2 ip-reveal">{tr(A.coverTitle)}</h2>
        <div className="ip-cards">
          {A.cover.map((c, i) => (
            <CoverCard key={c.to} item={c} i={i} tr={tr} />
          ))}
        </div>
      </section>

      <section className="ip-dark">
        <div className="container">
          <p className="ip-eyebrow ip-eyebrow--light ip-reveal">{tr(A.valuesEyebrow)}</p>
          <h2 className="ip-h2 ip-h2--light ip-reveal">{tr(A.valuesTitle)}</h2>
          <div className="ip-values">
            {A.values.map((v, i) => (
              <div key={i} className="ip-value ip-reveal" style={{ "--d": `${i * 90}ms` }}>
                <span className="ip-value__mark" aria-hidden="true" />
                <h3>{tr(v.title)}</h3>
                <p>{tr(v.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ip-section container">
        <p className="ip-eyebrow ip-reveal">{tr(A.journeyEyebrow)}</p>
        <h2 className="ip-h2 ip-reveal">{tr(A.journeyTitle)}</h2>
        <ol className="ip-journey">
          {A.journey.map((s, i) => (
            <li key={i} className="ip-step ip-reveal" style={{ "--d": `${i * 110}ms` }}>
              <span className="ip-step__dot">{i + 1}</span>
              <h3>{tr(s.title)}</h3>
              <p>{tr(s.text)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ip-cta">
        <div className="container ip-cta__inner ip-reveal">
          <div>
            <h2>{tr(A.ctaTitle)}</h2>
            <p>{tr(A.ctaText)}</p>
          </div>
          <div className="ip-cta__actions">
            <Link to="/register" className="ip-btn ip-btn--solid">{tr(A.ctaPrimary)}</Link>
            {/* <Link to="/businesses" className="ip-btn ip-btn--ghost-light">{tr(A.ctaSecondary)}</Link> */}
          </div>
        </div>
        <div className="container ip-cta__legal">
          <Link to="/privacy">{t("info.readPrivacy")}</Link>
          <Link to="/terms">{t("info.readTerms")}</Link>
        </div>
      </section>
    </div>
  );
}
