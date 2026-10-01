import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import useFetch from "../../hooks/useFetch";
import { resourceCategoriesApi } from "../../api/endpoints";
import NewsletterForm from "../Newsletter/NewsletterForm";
import "./footer.css";

const MAX_CATEGORIES = 6;

export default function Footer() {
  const { t } = useLanguage();
  // Resource categories come from the API (same endpoint as the Resources page), not a hard-coded list.
  const { data: categoriesData } = useFetch(() => resourceCategoriesApi.list(), []);
  const categories = (Array.isArray(categoriesData) ? categoriesData : (categoriesData && categoriesData.items) || [])
    .filter((c) => c && c.slug && c.name)
    .slice(0, MAX_CATEGORIES);

  // Static text is already in the right language (from /i18n/*.json), so it is marked `notranslate`.
  // The category names are dynamic API content and are deliberately left translatable so the
  // Google widget turns them into Tamil (or back into English) with the rest of the page content.
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand notranslate">
          <div className="site-header__logo">
            <span className="site-header__logo-mark">V</span>
            <span className="site-header__logo-text notranslate">Vartha</span>
          </div>
          <p>{t("footer.tagline")}</p>
        </div>

        <div className="site-footer__col notranslate">
          <h4>{t("footer.explore")}</h4>
          <Link to="/stories">{t("menu.stories.label")}</Link>
          <Link to="/achievements">{t("menu.achievements.label")}</Link>
          <Link to="/strategies">{t("menu.strategies.label")}</Link>
          <Link to="/products">{t("menu.products.label")}</Link>
          <Link to="/videos">{t("menu.videos.label")}</Link>
        </div>

        <div className="site-footer__col">
          <h4 className="notranslate">{t("footer.resources")}</h4>
          {categories.map((c) => (
            <Link key={c.slug} to={`/resources?category=${encodeURIComponent(c.slug)}`} className="site-footer__cat">
              {c.name}
            </Link>
          ))}
          <Link to="/resources" className="site-footer__all notranslate">
            {t("footer.allResources")}
          </Link>
        </div>

        <div className="site-footer__col notranslate">
          <h4>{t("footer.community")}</h4>
          <Link to="/community">{t("menu.qa.label")}</Link>
          <Link to="/enquiries">{t("menu.enquiries.label")}</Link>
          <Link to="/register">{t("nav.joinNetwork")}</Link>
        </div>

        <div className="site-footer__col site-footer__col--newsletter notranslate">
          <NewsletterForm variant="footer" />
        </div>
      </div>
      <div className="divider" />
      <div className="container site-footer__bottom notranslate">
        <p>{t("footer.rights")}</p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
