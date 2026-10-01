import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { useLanguage } from "../../context/LanguageContext";
import { resourcesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { Loading, ErrorMessage } from "../common/StateMessage";

function Img({ src, label, cls }) {
  return src ? <img src={fileUrl(src)} alt="" loading="lazy" /> : <div className={cls}>{label}</div>;
}

/* Resources: image rows on the left, a centred feature, and one large text card on the right. */
export default function ResourcesBlock() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this section's own translator
  const { data, loading, error, refetch } = useFetch(() => resourcesApi.list({ limit: 5 }), []);
  const items = (data && data.items) || [];
  if (!loading && !error && !items.length) return null;

  const rows = items.slice(0, 3);
  const feature = items[3] || items[0];
  const side = items[4] || items[1];

  return (
    <section className={`ys-section ys-res${pending ? " is-translating" : ""}`}>
      <div className="container">
        <div className="ys-plain-head">
          <h2>{t("home.resourcesTitle")}</h2>
          <Link to="/resources" className="ys-more">{t("home.exploreResources")}</Link>
        </div>
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && (
          <div className="ys-res__grid">
            <div className="ys-res__rows">
              {rows.map((r) => (
                <Link to={`/resources/${r.slug}`} className="ys-row" key={r.id}>
                  <div className="ys-row__thumb">
                    <Img src={r.coverImage} label={r.category?.name?.charAt(0)} cls="ys-thumb-fallback" />
                  </div>
                  <div>
                    <span className="ys-row__cat">{r.category?.name ? tr(r.category.name) : t("home.fallback.resource")}</span>
                    <h3>{tr(r.title)}</h3>
                    <span className="ys-author">{t("home.teamVartha")}</span>
                  </div>
                </Link>
              ))}
            </div>

            {feature && (
              <Link to={`/resources/${feature.slug}`} className="ys-feature ys-feature--framed">
                <div className="ys-feature__image">
                  <Img src={feature.coverImage} label={feature.category?.name?.charAt(0)} cls="ys-card__placeholder" />
                </div>
                <span className="eyebrow">{feature.category?.name ? tr(feature.category.name) : t("home.fallback.resource")}</span>
                <h3>{tr(feature.title)}</h3>
              </Link>
            )}

            {side && (
              <Link to={`/resources/${side.slug}`} className="ys-tall">
                <span className="eyebrow">{side.category?.name ? tr(side.category.name) : t("home.fallback.resource")}</span>
                <h3>{tr(side.title)}</h3>
                <span className="ys-author">{t("home.teamVartha")}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
