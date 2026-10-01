import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { productsApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import Carousel from "../common/Carousel";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { FeaturedTitle } from "./YsTitles";

/* Products as square cards in a swipeable row (Featured Series on yourstory.com). */
export default function FeaturedSeries() {
  const { data, loading, error, refetch } = useFetch(() => productsApi.list({ limit: 8 }), []);
  const items = (data && data.items) || [];
  if (!loading && !error && !items.length) return null;

  return (
    <section className="ys-section ys-featured">
      <div className="container">
        <FeaturedTitle>New Launches</FeaturedTitle>
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && (
          <Carousel className="ys-featured__row">
            {items.map((p) => (
              <Link to={`/products/${p.slug}`} className="ys-square" key={p.id}>
                <div className="ys-square__image">
                  {p.image ? (
                    <img src={fileUrl(p.image)} alt={p.name} loading="lazy" />
                  ) : (
                    <div className="ys-square__placeholder">{p.business.companyName.charAt(0)}</div>
                  )}
                </div>
                <span className="eyebrow">{p.business.companyName}</span>
                <h3>{p.name}</h3>
              </Link>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
