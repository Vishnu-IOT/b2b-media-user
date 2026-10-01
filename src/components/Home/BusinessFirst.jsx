import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { useLanguage } from "../../context/LanguageContext";
import { storiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt } from "../../utils/text";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { BusinessFirstTitle } from "./YsTitles";

function Img({ src, alt, label, cls }) {
  return src ? (
    <img src={fileUrl(src)} alt={alt} loading="lazy" />
  ) : (
    <div className={cls}>{label}</div>
  );
}

/* Stories in three columns: two image cards, a centred feature, and a Just In rail. */
export default function BusinessFirst() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this section's own translator
  const { data, loading, error, refetch } = useFetch(
    () => storiesApi.list({ limit: 13 }),
    [],
  );
  const all = (data && data.items) || [];
  // Hero already shows the newest five, so continue from there when there is enough content.
  const pool = all.length > 8 ? all.slice(5) : all;
  if (!loading && !error && !pool.length) return null;

  const feature = pool[0];
  const left = pool.slice(1, 4);
  const justIn = pool.slice(3, 8);

  return (
    <section
      className={`ys-section ys-first${pending ? " is-translating" : ""}`}
    >
      <div className="container">
        <BusinessFirstTitle />
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && feature && (
          <>
            <div className="ys-first__grid">
              {/* <div className="ys-first__left">
                {left.map((s) => (
                  <Link
                    to={`/stories/${s.id}`}
                    className="ys-card ys-card--plain"
                    key={s.id}
                  >
                    <div className="ys-card__image">
                      <Img
                        src={s.coverImage}
                        alt={s.business.companyName}
                        label={s.business.companyName.charAt(0)}
                        cls="ys-card__placeholder"
                      />
                    </div>
                    <span className="eyebrow">{tr(s.business.industry)}</span>
                    <h3>{tr(s.title)}</h3>
                    <span className="ys-author">{s.business.companyName}</span>
                  </Link>
                ))}
              </div> */}

              <Link
                to={`/stories/${feature.id}`}
                className="ys-feature ys-news-features"
              >
                <div className="ys-feature__image">
                  <Img
                    src={feature.coverImage}
                    alt={feature.business.companyName}
                    label={feature.business.companyName.charAt(0)}
                    cls="ys-card__placeholder"
                  />
                </div>
                <div className="ys-feature__description">
                  <span className="eyebrow">
                    {tr(feature.business.industry)}
                  </span>
                  <h3>{tr(feature.title)}</h3>
                  <p>{tr(excerpt(feature.content, 250))}</p>
                  <span className="ys-author">
                    {feature.business.companyName}
                  </span>
                </div>
              </Link>

              {/* <aside className="ys-justin">
                <h3 className="ys-justin__title">
                  <span>{t("home.justIn")}</span>
                </h3>
                {justIn.map((s) => (
                  <Link
                    to={`/stories/${s.id}`}
                    className="ys-justin__item"
                    key={s.id}
                  >
                    <div className="ys-justin__thumb">
                      <Img
                        src={s.coverImage}
                        alt=""
                        label={s.business.companyName.charAt(0)}
                        cls="ys-thumb-fallback"
                      />
                    </div>
                    <div>
                      <h4>{tr(s.title)}</h4>
                      <span className="ys-author">
                        {s.business.companyName}
                      </span>
                    </div>
                  </Link>
                ))}
              </aside> */}
            </div>

            <div className="ys-first__left">
              {left.map((s) => (
                <Link
                  to={`/stories/${s.id}`}
                  className="ys-card ys-card--plain"
                  key={s.id}
                >
                  <div className="ys-card__image">
                    <Img
                      src={s.coverImage}
                      alt={s.business.companyName}
                      label={s.business.companyName.charAt(0)}
                      cls="ys-card__placeholder"
                    />
                  </div>
                  <span className="eyebrow">{tr(s.business.industry)}</span>
                  <h3>{tr(s.title)}</h3>
                  <span className="ys-author">{s.business.companyName}</span>
                </Link>
              ))}
            </div>
            <div className="ys-first__cta">
              <Link to="/stories" className="btn btn-outline">
                {t("home.exploreStories")}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
