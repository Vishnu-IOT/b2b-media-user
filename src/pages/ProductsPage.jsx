import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { productsApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, formatDate, toParagraphs } from "../utils/text";
import ArticleBody from "../components/common/ArticleBody";
import ShareButton from "../components/Share/ShareButton";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";
import { Loading, ErrorMessage, Empty } from "../components/common/StateMessage";
import ProductCard from "../components/ProductShowcase/ProductCard";
import "../styles/article.css";

function ProductDetail({ slug }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this article's own translator
  const { data: product, loading, error, refetch } = useFetch(() => productsApi.getOne(slug), [slug]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!product) return null;

  const upcoming = product.launchDate && new Date(product.launchDate) > new Date();

  return (
    <article className={`page-shell article${pending ? " is-translating" : ""}`}>
      <div className="container article__head">
        <p className="eyebrow">{upcoming ? t("products.upcomingProduct") : t("products.newLaunch")} · {product.business.industry}</p>
        <h1 className="article__headline">{tr(product.name)}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{product.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{product.business.companyName}</p>
            <p className="article__author-meta">{upcoming ? t("products.launching") : t("products.launched")} {formatDate(product.launchDate, lang)}</p>
          </div>
          <ShareButton
            title={tr(product.name)}
            text={product.description ? tr(excerpt(product.description, 160)) : ""}
            images={[fileUrl(product.image), fileUrl(product.image2)]}
          />
        </div>
      </div>
      {product.image && (
        <div className="article__hero-image"><img src={fileUrl(product.image)} alt={tr(product.name)} /></div>
      )}
      <div className="container article__body">
        <ArticleBody
          paragraphs={toParagraphs(product.description)}
          image2={fileUrl(product.image2)}
          alt={tr(product.name)}
          caption={product.business.companyName}
          variant="product"
        />
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${product.business.slug}`} className="btn btn-outline">
            View {product.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function ProductsIndex() {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => productsApi.list({ limit: 24 }), []);
  const items = (data && data.items) || [];
  return (
    <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 28px)", paddingBottom: 90 }}>
      <p className="eyebrow">{t("products.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>{t("products.title")}</h1>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && !items.length && <Empty>{t("products.empty")}</Empty>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {items.map((p) => <ProductCard product={p} key={p.id} />)}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { slug } = useParams();
  return slug ? <ProductDetail slug={slug} /> : <ProductsIndex />;
}
