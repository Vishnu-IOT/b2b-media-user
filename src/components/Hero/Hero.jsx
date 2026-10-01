import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { storiesApi, strategiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt } from "../../utils/text";
import { Loading, ErrorMessage } from "../common/StateMessage";
import NewsletterForm from "../Newsletter/NewsletterForm";
import { TopPicksTitle, PlaybookTitle } from "../Home/YsTitles";
import "./hero.css";

function Thumb({ src, label }) {
  return src ? (
    <img src={fileUrl(src)} alt="" loading="lazy" />
  ) : (
    <span className="ys-thumb-fallback">{label}</span>
  );
}

/* Top of the home page: Top Picks headlines, lead story, The Playbook column and newsletter card. */
export default function Hero() {
  const stories = useFetch(() => storiesApi.list({ limit: 5 }), []);
  const strategies = useFetch(() => strategiesApi.list({ limit: 3 }), []);

  if (stories.loading)
    return (
      <section className="ys-hero">
        <div className="container">
          <Loading label="Loading the latest stories…" />
        </div>
      </section>
    );
  if (stories.error)
    return (
      <section className="ys-hero container">
        <ErrorMessage error={stories.error} onRetry={stories.refetch} />
      </section>
    );

  const items = (stories.data && stories.data.items) || [];
  const playbook = (strategies.data && strategies.data.items) || [];

  if (!items.length) {
    return (
      <section className="ys-hero">
        <div className="container hero__empty">
          <p className="eyebrow">Business Stories</p>
          <h1 className="ys-lead__headline">No stories published yet.</h1>
          <p className="ys-lead__dek">Once a business shares its story, it will feature here.</p>
        </div>
      </section>
    );
  }

  const [lead, ...picks] = items;

  return (
    <section className="ys-hero">
      <div className="container">
        {picks.length > 0 && (
          <div className="top-picks">
            <TopPicksTitle />
            <div className="top-picks__list">
              {picks.slice(0, 4).map((s) => (
                <Link to={`/stories/${s.id}`} key={s.id} className="top-picks__item">
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="ys-hero__grid">
          <Link to={`/stories/${lead.id}`} className="ys-lead">
            <div className="ys-lead__image">
              {lead.coverImage ? (
                <img src={fileUrl(lead.coverImage)} alt={lead.business.companyName} />
              ) : (
                <div className="ys-lead__placeholder">{lead.business.companyName.charAt(0)}</div>
              )}
            </div>
            <span className="eyebrow">{lead.business.industry || "News"}</span>
            <h1 className="ys-lead__headline">{lead.title}</h1>
            <p className="ys-lead__dek">{excerpt(lead.content, 190)}</p>
            <span className="ys-author">{lead.business.companyName}</span>
          </Link>

          <aside className="ys-side">
            {playbook.length > 0 && (
              <>
                <PlaybookTitle />
                <div className="ys-side__list">
                  {playbook.map((s) => (
                    <Link to={`/strategies/${s.id}`} key={s.id} className="ys-side__item">
                      <div className="ys-side__text">
                        <h3>{s.title}</h3>
                        <span className="ys-author">{s.business.companyName}</span>
                      </div>
                      <div className="ys-side__thumb">
                        <Thumb src={s.coverImage} label={s.business.companyName.charAt(0)} />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="ys-signup">
              <div className="ys-signup__head">
                <h3>Sign Up For Vartha Newsletter</h3>
                <svg viewBox="0 0 60 56" aria-hidden="true" className="ys-signup__art">
                  <path d="M8 40l14-10 8 12 14-18 8 10M6 50h48M18 10l22-4 4 20-22 4z" stroke="#111" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12l20-3 3 16-20 3z" fill="#ED1C24" opacity=".85" />
                </svg>
              </div>
              <NewsletterForm variant="card" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
