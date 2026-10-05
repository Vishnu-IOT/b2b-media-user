import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { resourceCategoriesApi, resourcesApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, youtubeEmbedUrl, toParagraphs } from "../utils/text";
import ShareButton from "../components/Share/ShareButton";

import { Loading, ErrorMessage, Empty } from "../components/common/StateMessage";
import ResourceCard from "../components/ResourceHub/ResourceCard";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";

import "../components/ResourceHub/resources.css";
import "../styles/article.css";

function ResourcesIndex() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // translates category names (cards translate themselves)
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySlug = searchParams.get("category");

  // Fetch categories dynamically from backend
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(() => resourceCategoriesApi.list(), []);

  const categories = useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : [];
  }, [categoriesData]);

  // Find currently selected category
  const selectedCategory = useMemo(() => {
    if (!categorySlug) return null;

    return categories.find(
      (category) => category.slug === categorySlug
    );
  }, [categories, categorySlug]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resources based on selected category
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = categorySlug
      ? {
          category: categorySlug,
          limit: 24,
        }
      : {
          limit: 24,
        };

    resourcesApi
      .list(params)
      .then((res) => {
        const resources = Array.isArray(res?.items)
          ? res.items
          : [];

        resources.sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt) -
            new Date(a.publishedAt || a.createdAt)
        );

        setItems(resources);
      })
      .catch((err) => {
        setError(err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categorySlug]);

  const handleCategoryChange = (slug) => {
    if (slug) {
      setSearchParams({
        category: slug,
      });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div
      className={`page-shell container${pending ? " is-translating" : ""}`}
      style={{
        paddingTop: "calc(var(--header-h) + 28px)",
        paddingBottom: 90,
      }}
    >
      <p className="eyebrow">{t("resources.eyebrow")}</p>

      <h1
        className="section-heading"
        style={{
          fontSize: "clamp(30px, 3.6vw, 46px)",
          marginBottom: 24,
        }}
      >
        {selectedCategory ? selectedCategory.name : t("resources.title")}
      </h1>

      {/* Dynamic Categories */}
      {categoriesLoading ? (
        <div className="resources-chips">
          <span>{t("resources.loadingCategories")}</span>
        </div>
      ) : categoriesError ? (
        <ErrorMessage error={categoriesError} />
      ) : (
        <div className="resources-chips">
          {/* All */}
          <button
            className={!categorySlug ? "is-active" : ""}
            onClick={() => handleCategoryChange(null)}
          >
            {t("resources.all")}
          </button>

          {/* Backend Categories */}
          {categories.map((category) => (
            <button
              key={category.id || category.slug}
              className={
                categorySlug === category.slug
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                handleCategoryChange(category.slug)
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && <Loading />}

      {/* Error */}
      {error && <ErrorMessage error={error} />}

      {/* Empty */}
      {!loading && !error && items.length === 0 && (
        <Empty>
          {selectedCategory
            ? t("resources.emptyCategory").replace("{name}", selectedCategory.name)
            : t("resources.empty")}
        </Empty>
      )}

      {/* Resource Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="resources-grid">
          {items.map((resource) => (
            <ResourceCard
              resource={resource}
              key={resource.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcePostDetail({ idOrSlug }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this article's own translator
  const {
    data: post,
    loading,
    error,
    refetch,
  } = useFetch(
    () => resourcesApi.getOne(idOrSlug),
    [idOrSlug]
  );

  if (loading) {
    return (
      <div
        className="page-shell container"
        style={{ paddingTop: "calc(var(--header-h) + 24px)" }}
      >
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="page-shell container"
        style={{ paddingTop: "calc(var(--header-h) + 24px)" }}
      >
        <ErrorMessage
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!post) return null;

  const paragraphs = toParagraphs(post.content);

  return (
    <article className={`page-shell article${pending ? " is-translating" : ""}`}>
      <div className="container article__head">
        <p className="eyebrow">
          {post.category?.name}
        </p>

        <h1 className="article__headline">
          {tr(post.title)}
        </h1>

        {post.summary && (
          <p className="article__dek">
            {tr(post.summary)}
          </p>
        )}

        <ShareButton
          block
          title={tr(post.title)}
          text={tr(post.summary || excerpt(post.content, 160))}
          images={[fileUrl(post.coverImage), fileUrl(post.coverImage2)]}
        />
      </div>

      {post.coverImage && (
        <div className="article__hero-image">
          <img
            src={fileUrl(post.coverImage)}
            alt={tr(post.title)}
          />
        </div>
      )}

      <div className="container article__body">
        {/* YouTube / External Video */}
        {post.videoUrl &&
        /^https?:\/\//i.test(post.videoUrl) ? (
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              background: "#000",
              marginBottom: 30,
            }}
          >
            <iframe
              src={
                youtubeEmbedUrl(post.videoUrl) ||
                post.videoUrl
              }
              title={tr(post.title)}
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        ) : post.videoUrl ? (
          <video
            src={fileUrl(post.videoUrl)}
            controls
            style={{
              width: "100%",
              background: "#000",
              marginBottom: 30,
            }}
          />
        ) : null}

        {/* Article Content */}
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index}>{tr(paragraph)}</p>
          ))
        ) : (
          <p>{tr(post.content)}</p>
        )}

        {/* Attachment */}
        {post.filePath && (
          <p>
            <a
              className="btn btn-outline"
              href={fileUrl(post.filePath)}
              target="_blank"
              rel="noreferrer"
            >
              {t("resources.downloadAttachment")}
            </a>
          </p>
        )}

        {/* Back */}
        <div className="article__footer-actions">
          <Link
            to="/resources"
            className="btn-link"
          >
            {t("resources.back")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ResourcesPage() {
  const { idOrSlug } = useParams();

  return idOrSlug ? (
    <ResourcePostDetail idOrSlug={idOrSlug} />
  ) : (
    <ResourcesIndex />
  );
}