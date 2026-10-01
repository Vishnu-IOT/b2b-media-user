import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { excerpt, formatDate } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./products.css";

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  const upcoming =
    product.launchDate && new Date(product.launchDate) > new Date();
  return (
    <Link
      to={`/products/${product.slug}`}
      className={`product-card${pending ? " is-translating" : ""}`}
    >
      <div className="product-card__image">
        {product.image ? (
          <img src={fileUrl(product.image)} alt={tr(product.name)} />
        ) : (
          <div className="product-card__image--placeholder">
            {product.business.companyName.charAt(0)}
          </div>
        )}
        <span className="tag product-card__category">
          {upcoming ? t("products.upcoming") : t("products.newLaunch")}
        </span>
      </div>
      <div className="product-card__body">
        <p className="product-card__company">
          {product.business.companyName} · {tr(product.business.location)}
        </p>
        <h4>{tr(product.name)}</h4>
        {product.description && (
          <p className="product-card__desc">
            {tr(excerpt(product.description, 150))}
          </p>
        )}
        <div className="product-card__foot">
          <span className="product-card__date">
            {upcoming ? t("products.launching") : t("products.launched")}{" "}
            {formatDate(product.launchDate, lang)}
          </span>
          <span className="btn-link">{t("products.readMore")}</span>
        </div>
      </div>
    </Link>
  );
}
