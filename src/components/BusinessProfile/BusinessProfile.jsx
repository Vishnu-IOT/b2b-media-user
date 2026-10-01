import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { excerpt, formatDate, normalizeText } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./profile.css";

// Tab ids stay in English (they are only state keys); the visible label comes from profile.tab.<id>.
const TABS = ["About", "Stories", "Strategies", "Achievements", "Products", "Enquiries", "Videos"];

export default function BusinessProfile({ business }) {
  const { t, lang } = useLanguage();
  // This profile's own translator: description, story, item titles/excerpts, industry and location.
  // Company name, website, phone and email are shown exactly as written.
  const { tr, pending } = useSectionTranslator();
  const [tab, setTab] = useState("About");
  const counts = {
    Stories: business.stories?.length || 0,
    Strategies: business.strategies?.length || 0,
    Achievements: business.achievements?.length || 0,
    Products: business.products?.length || 0,
    Enquiries: business.enquiries?.length || 0,
    Videos: business.videos?.length || 0,
  };

  return (
    <div className={`profile${pending ? " is-translating" : ""}`}>
      <div className="profile-hero" style={{ background: business.coverImage ? undefined : "var(--color-ink)" }}>
        {business.coverImage && <img src={fileUrl(business.coverImage)} alt={business.companyName} />}
        <div className="profile-hero__overlay">
          <div className="container profile-hero__content">
            {business.logo && <img className="profile-hero__logo" src={fileUrl(business.logo)} alt={`${business.companyName} logo`} />}
            <div>
              <h1>{business.companyName}</h1>
              <p>{tr(business.industry)}{business.location ? ` · ${tr(business.location)}` : ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-body">
        <div className="profile-tabs">
          {TABS.map((id) => (
            <button key={id} className={`profile-tab ${tab === id ? "is-active" : ""}`} onClick={() => setTab(id)}>
              {t(`profile.tab.${id.toLowerCase()}`)}{counts[id] ? ` (${counts[id]})` : ""}
            </button>
          ))}
        </div>

        <div className="profile-content">
          {tab === "About" && (
            <div className="profile-about">
              {business.description && <p className="profile-tagline">{tr(business.description)}</p>}
              {business.story && (
                <>
                  <h4 className="profile-subhead">{t("profile.ourStory")}</h4>
                  <p className="profile-story-text">{tr(normalizeText(business.story))}</p>
                </>
              )}
              <div className="profile-facts">
                {business.website && <div><span>{t("profile.website")}</span><a href={business.website} target="_blank" rel="noreferrer"><strong>{business.website}</strong></a></div>}
                {business.phone && <div><span>{t("profile.phone")}</span><strong>{business.phone}</strong></div>}
                {business.email && <div><span>{t("profile.email")}</span><strong>{business.email}</strong></div>}
              </div>
            </div>
          )}

          {tab === "Stories" && (
            <ListTab items={business.stories} empty={t("stories.empty")} render={(s) => (
              <Link to={`/stories/${s.id}`} key={s.id} className="profile-item">
                <h4>{tr(s.title)}</h4>
                <p>{tr(excerpt(s.content, 140))}</p>
              </Link>
            )} />
          )}

          {tab === "Strategies" && (
            <ListTab items={business.strategies} empty={t("strategies.empty")} render={(s) => (
              <Link to={`/strategies/${s.id}`} key={s.id} className="profile-item">
                <h4>{tr(s.title)}</h4>
                <p>{tr(excerpt(s.content, 140))}</p>
              </Link>
            )} />
          )}

          {tab === "Achievements" && (
            <ListTab items={business.achievements} empty={t("achievements.empty")} render={(a) => (
              <div key={a.id} className="profile-item">
                <h4>{tr(a.title)}</h4>
                {a.description && <p>{tr(a.description)}</p>}
                <span className="profile-item__meta">{a.awardedBy}{a.awardDate ? ` · ${formatDate(a.awardDate, lang)}` : ""}</span>
              </div>
            )} />
          )}

          {tab === "Products" && (
            <ListTab items={business.products} empty={t("products.empty")} render={(p) => (
              <Link to={`/products/${p.slug}`} key={p.id} className="profile-item">
                <h4>{tr(p.name)}</h4>
                {p.description && <p>{tr(p.description)}</p>}
                <span className="profile-item__meta">{t("profile.launch")} {formatDate(p.launchDate, lang)}</span>
              </Link>
            )} />
          )}

          {tab === "Enquiries" && (
            <ListTab items={business.enquiries} empty={t("home.enquiries.empty")} render={(e) => (
              <Link to={`/enquiries/${e.id}`} key={e.id} className="profile-item">
                <h4>{tr(e.title)}</h4>
                <p>{tr(e.description)}</p>
                <span className="profile-item__meta">{tr(e.category)}{e.location ? ` · ${tr(e.location)}` : ""}</span>
              </Link>
            )} />
          )}

          {tab === "Videos" && (
            <ListTab items={business.videos} empty={t("videos.empty")} render={(v) => (
              <Link to={`/videos/${v.id}`} key={v.id} className="profile-item">
                <h4>{tr(v.title)}</h4>
                {v.description && <p>{tr(v.description)}</p>}
              </Link>
            )} />
          )}
        </div>
      </div>
    </div>
  );
}

function ListTab({ items, empty, render }) {
  if (!items || !items.length) return <p className="section-sub">{empty}</p>;
  return <div className="profile-list">{items.map(render)}</div>;
}
