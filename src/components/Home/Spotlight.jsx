import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { achievementsApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt } from "../../utils/text";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { SpotlightTitle } from "./YsTitles";

/* Achievements: vertical title on a grey band with four image cards. */
export default function Spotlight() {
  const { data, loading, error, refetch } = useFetch(() => achievementsApi.list({ limit: 4 }), []);
  const items = (data && data.items) || [];
  if (!loading && !error && !items.length) return null;

  return (
    <section className="ys-spot">
      <div className="container ys-spot__inner">
        <SpotlightTitle />
        <div className="ys-spot__body">
          {loading && <Loading />}
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          {!loading && !error && (
            <div className="ys-spot__grid">
              {items.map((a) => (
                <Link to={`/achievements/${a.id}`} className="ys-card" key={a.id}>
                  <div className="ys-card__image">
                    {a.image ? (
                      <img src={fileUrl(a.image)} alt={a.title} loading="lazy" />
                    ) : (
                      <div className="ys-card__placeholder">{a.business.companyName.charAt(0)}</div>
                    )}
                  </div>
                  <span className="eyebrow">{a.business.industry || "Achievement"}</span>
                  <h3>{a.title}</h3>
                  <p>{excerpt(a.description, 110)}</p>
                  <span className="ys-author">{a.business.companyName}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
