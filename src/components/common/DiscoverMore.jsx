import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { storiesApi, strategiesApi, productsApi, resourcesApi } from "../../api/endpoints";
import "./discover.css";

function Column({ title, to, fetcher, label, href }) {
  const { data } = useFetch(fetcher, []);
  const items = (data && data.items) || [];
  if (!items.length) return null;
  return (
    <div className="discover__col">
      <h3><Link to={to}>{title}</Link></h3>
      <ul>
        {items.slice(0, 4).map((it) => (
          <li key={it.id}>
            <Link to={href(it)}>{label(it)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Link directory at the foot of the home page, like "Discover More" on yourstory.com. */
export default function DiscoverMore() {
  return (
    <section className="discover">
      <div className="container">
        <div className="section-head-row">
          <h2 className="section-heading" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>Discover more</h2>
        </div>
        <div className="discover__grid">
          <Column title="Business Stories" to="/stories" fetcher={() => storiesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/stories/${i.id}`} />
          <Column title="Strategies" to="/strategies" fetcher={() => strategiesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/strategies/${i.id}`} />
          <Column title="New Products" to="/products" fetcher={() => productsApi.list({ limit: 4 })} label={(i) => i.name} href={(i) => `/products/${i.slug}`} />
          <Column title="Resources" to="/resources" fetcher={() => resourcesApi.list({ limit: 4 })} label={(i) => i.title} href={(i) => `/resources/${i.slug}`} />
        </div>
      </div>
    </section>
  );
}
