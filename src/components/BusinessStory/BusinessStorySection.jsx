import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { storiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt, formatDate } from "../../utils/text";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./stories.css";

export default function BusinessStorySection() {
  const { data, loading, error, refetch } = useFetch(() => storiesApi.list({ limit: 10 }), []);
  const items = (data && data.items) || [];
  // The hero already shows the newest stories: this feed picks up after them.
  const rest = items.slice(1);
  const cards = rest.slice(0, 4);
  const justIn = rest.slice(4, 9);

  return (
    <section className="stories-section">
      <div className="container">
        <div className="section-head-row">
          <div>
            <p className="eyebrow">Business Media</p>
            <h2 className="section-heading" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>Latest Business Stories</h2>
          </div>
          <Link to="/stories" className="btn-link">View all stories →</Link>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !cards.length && <Empty>No further stories yet. Check back soon.</Empty>}

        {!loading && !error && cards.length > 0 && (
          <div className={`stories-layout ${justIn.length ? "" : "stories-layout--single"}`}>
            <div className="stories-cards">
              {cards.map((s) => (
                <Link to={`/stories/${s.id}`} className="story-card" key={s.id}>
                  <div className="story-card__image">
                    {s.coverImage ? (
                      <img src={fileUrl(s.coverImage)} alt={s.business.companyName} loading="lazy" />
                    ) : (
                      <div className="story-card__placeholder">{s.business.companyName.charAt(0)}</div>
                    )}
                  </div>
                  <span className="tag">{s.business.industry}</span>
                  <h3>{s.title}</h3>
                  <p>{excerpt(s.content, 110)}</p>
                  <span className="story-card__meta">{s.business.companyName} · {formatDate(s.publishedAt || s.createdAt)}</span>
                </Link>
              ))}
            </div>

            {justIn.length > 0 && (
              <aside className="just-in">
                <h3 className="just-in__title"><span className="just-in__dot" aria-hidden="true" />Just In</h3>
                {justIn.map((s) => (
                  <Link to={`/stories/${s.id}`} className="just-in__item" key={s.id}>
                    <div className="just-in__thumb">
                      {s.coverImage ? (
                        <img src={fileUrl(s.coverImage)} alt={s.business.companyName} loading="lazy" />
                      ) : (
                        <span>{s.business.companyName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4>{s.title}</h4>
                      <span className="just-in__meta">{s.business.companyName}</span>
                    </div>
                  </Link>
                ))}
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
