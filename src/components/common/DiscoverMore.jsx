import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { useLanguage } from "../../context/LanguageContext";
import { storiesApi, strategiesApi, productsApi, resourcesApi } from "../../api/endpoints";
import "./discover.css";

function Column({ title, to, fetcher, label, href }) {
  const { data } = useFetch(fetcher, []);
  const { tr } = useSectionTranslator(); // one translator per column
  const items = (data && data.items) || [];
  if (!items.length) return null;
  return (
    <div className="discover__col">
      <h3><Link to={to}>{title}</Link></h3>
      <ul>
        {items.slice(0, 4).map((it) => (
          <li key={it.id}>
            <Link to={href(it)}>{tr(label(it))}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Link directory at the foot of the home page, like "Discover More" on yourstory.com. */
export default function DiscoverMore() {
  const { t } = useLanguage();
  return (
    <section className="discover">
      <div className="container">
        <div className="section-head-row">
          <h2 className="section-heading" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>{t("home.discover")}</h2>
        </div>
        <div className="discover__grid">
          <Column title={t("menu.stories.label")} to="/stories" fetcher={() => storiesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/stories/${i.id}`} />
          <Column title={t("menu.strategies.label")} to="/strategies" fetcher={() => strategiesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/strategies/${i.id}`} />
          <Column title={t("menu.products.label")} to="/products" fetcher={() => productsApi.list({ limit: 4 })} label={(i) => i.name} href={(i) => `/products/${i.slug}`} />
          <Column title={t("footer.resources")} to="/resources" fetcher={() => resourcesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/resources/${i.slug}`} />
        </div>
      </div>
    </section>
  );
}
