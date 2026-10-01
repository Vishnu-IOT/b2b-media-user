import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { useLanguage } from "../../context/LanguageContext";
import { strategiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { InDepthTitle } from "./YsTitles";

/* Strategies: text list, centred feature over the giant title, and a promo tile. */
export default function InDepth() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this section's own translator
  const { data, loading, error, refetch } = useFetch(() => strategiesApi.list({ limit: 8 }), []);
  const all = (data && data.items) || [];
  const pool = all.length > 5 ? all.slice(3) : all;
  if (!loading && !error && !pool.length) return null;

  const feature = pool[0];
  const list = pool.slice(1, 4);

  return (
    <section className={`ys-section ys-depth${pending ? " is-translating" : ""}`}>
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
                  <span className="eyebrow">{s.business.industry ? tr(s.business.industry) : t("home.fallback.inDepth")}</span>
                  <h3>{tr(s.title)}</h3>
                  <span className="ys-author">{s.business.companyName}</span>
                </Link>
              ))}
            </div>

            <Link to={`/strategies/${feature.id}`} className="ys-feature ys-feature--overlap">
              <div className="ys-feature__image">
                {feature.coverImage ? (
                  <img src={fileUrl(feature.coverImage)} alt={tr(feature.title)} loading="lazy" />
                ) : (
                  <div className="ys-card__placeholder">{feature.business.companyName.charAt(0)}</div>
                )}
              </div>
              <span className="eyebrow">{feature.business.industry ? tr(feature.business.industry) : t("home.fallback.inDepth")}</span>
              <h3>{tr(feature.title)}</h3>
              <span className="ys-author">{feature.business.companyName}</span>
            </Link>

            <aside className="ys-promo">
              <span className="ys-promo__kicker">{t("home.promo.kicker")}</span>
              <h3>{t("home.promo.title")}</h3>
              <p>{t("home.promo.body")}</p>
              <Link to="/register" className="btn btn-accent">{t("nav.joinNetwork")}</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
