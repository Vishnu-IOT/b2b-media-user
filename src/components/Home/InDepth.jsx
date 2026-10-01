import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { strategiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { InDepthTitle } from "./YsTitles";

/* Strategies: text list, centred feature over the giant title, and a promo tile. */
export default function InDepth() {
  const { data, loading, error, refetch } = useFetch(() => strategiesApi.list({ limit: 8 }), []);
  const all = (data && data.items) || [];
  const pool = all.length > 5 ? all.slice(3) : all;
  if (!loading && !error && !pool.length) return null;

  const feature = pool[0];
  const list = pool.slice(1, 4);

  return (
    <section className="ys-section ys-depth">
      <div className="container">
        <hr className="ys-rule" />
        <InDepthTitle />
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && feature && (
          <div className="ys-depth__grid">
            <div className="ys-depth__list">
              {list.map((s) => (
                <Link to={`/strategies/${s.id}`} className="ys-text-item" key={s.id}>
                  <span className="eyebrow">{s.business.industry || "In Depth"}</span>
                  <h3>{s.title}</h3>
                  <span className="ys-author">{s.business.companyName}</span>
                </Link>
              ))}
            </div>

            <Link to={`/strategies/${feature.id}`} className="ys-feature ys-feature--overlap">
              <div className="ys-feature__image">
                {feature.coverImage ? (
                  <img src={fileUrl(feature.coverImage)} alt={feature.title} loading="lazy" />
                ) : (
                  <div className="ys-card__placeholder">{feature.business.companyName.charAt(0)}</div>
                )}
              </div>
              <span className="eyebrow">{feature.business.industry || "In Depth"}</span>
              <h3>{feature.title}</h3>
              <span className="ys-author">{feature.business.companyName}</span>
            </Link>

            <aside className="ys-promo">
              <span className="ys-promo__kicker">Vartha Network</span>
              <h3>Put your business in front of the whole network</h3>
              <p>Publish your story, launch products and answer buyer enquiries.</p>
              <Link to="/register" className="btn btn-accent">Join the Network</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
