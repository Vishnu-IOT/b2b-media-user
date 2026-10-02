import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { resourceCategoriesApi } from "../../api/endpoints";
import NewsletterForm from "../Newsletter/NewsletterForm";
import "./footer.css";

const MAX_CATEGORIES = 6;

export default function Footer() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // footer's own translator (category names only)
  // Resource categories come from the API (same endpoint as the Resources page), not a hard-coded list.
  const { data: categoriesData } = useFetch(() => resourceCategoriesApi.list(), []);
  const categories = (Array.isArray(categoriesData) ? categoriesData : (categoriesData && categoriesData.items) || [])
    .filter((c) => c && c.slug && c.name)
    .slice(0, MAX_CATEGORIES);

  // Static text comes from /i18n/*.json via t(). Only the category names are API content,
  // so only those go through this section's translator, tr().
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <div className="site-header__logo">
            <span className="site-header__logo-mark">V</span>
            <span className="site-header__logo-text">Vartha</span>
          </div>
          <p>{t("footer.tagline")}</p>
        </div>

        <div className="site-footer__col">
          <h4>{t("footer.explore")}</h4>
          <Link to="/stories">{t("menu.stories.label")}</Link>
          <Link to="/achievements">{t("menu.achievements.label")}</Link>
          <Link to="/strategies">{t("menu.strategies.label")}</Link>
          <Link to="/products">{t("menu.products.label")}</Link>
          <Link to="/videos">{t("menu.videos.label")}</Link>
        </div>

        <div className="site-footer__col">
          <h4>{t("footer.resources")}</h4>
          {categories.map((c) => (
            <Link key={c.slug} to={`/resources?category=${encodeURIComponent(c.slug)}`} className={`site-footer__cat${pending ? " is-translating" : ""}`}>
              {tr(c.name)}
            </Link>
          ))}
          <Link to="/resources" className="site-footer__all">
            {t("footer.allResources")}
          </Link>
        </div>

        <div className="site-footer__col">
          <h4>{t("footer.community")}</h4>
          <Link to="/community">{t("menu.qa.label")}</Link>
          <Link to="/enquiries">{t("menu.enquiries.label")}</Link>
          <Link to="/register">{t("nav.joinNetwork")}</Link>
        </div>

        <div className="site-footer__col site-footer__col--newsletter">
          <NewsletterForm variant="footer" />
        </div>
      </div>
      <div className="divider" />
      <div className="container site-footer__bottom">
        <p>{t("footer.rights")}</p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
