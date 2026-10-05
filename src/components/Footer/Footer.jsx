import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { resourceCategoriesApi } from "../../api/endpoints";
import NewsletterForm from "../Newsletter/NewsletterForm";
import "./footer.css";

const MAX_CATEGORIES = 6;

// TODO: put your real social profile links here.
const SOCIAL = [
  { id: "x", label: "X", url: "https://x.com" },
  { id: "facebook", label: "Facebook", url: "https://facebook.com" },
  { id: "instagram", label: "Instagram", url: "https://instagram.com" },
  { id: "youtube", label: "YouTube", url: "https://youtube.com" },
];

// TODO: these three pages do not exist yet; create the routes or change the paths.
const LEGAL = [
  { key: "footer.about", to: "/about" },
  { key: "footer.privacy", to: "/privacy" },
  { key: "footer.terms", to: "/terms" },
];

const SocialIcon = ({ id }) => {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true };
  if (id === "x")
    return <svg {...common} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  if (id === "facebook")
    return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>;
  if (id === "instagram")
    return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>;
  return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="4" /><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" /></svg>;
};

export default function Footer() {
  const { tEn: t } = useLanguage(); // footer text is always English
  const { tr, pending } = useSectionTranslator("en"); // category names (API content) also stay English
  // Resource categories come from the API (same endpoint as the Resources page), not a hard-coded list.
  const { data: categoriesData } = useFetch(() => resourceCategoriesApi.list(), []);
  const categories = (Array.isArray(categoriesData) ? categoriesData : (categoriesData && categoriesData.items) || [])
    .filter((c) => c && c.slug && c.name)
    .slice(0, MAX_CATEGORIES);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__rule" />

        <div className="site-footer__main">
          <div className="site-footer__cols">
            <div className="site-footer__col">
              <h4>{t("footer.explore")}</h4>
              <Link to="/stories">{t("menu.stories.label")}</Link>
              <Link to="/achievements">{t("menu.achievements.label")}</Link>
              <Link to="/strategies">{t("menu.strategies.label")}</Link>
              <Link to="/products">{t("menu.products.label")}</Link>
              <Link to="/videos">{t("menu.videos.label")}</Link>
            </div>

            <div className="site-footer__col">
              <h4>{t("footer.hub")}</h4>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/resources?category=${encodeURIComponent(c.slug)}`}
                  className={pending ? "is-translating" : undefined}
                >
                  {c.name}
                </Link>
              ))}
              <Link to="/resources">{t("footer.allResources")}</Link>
            </div>

            <div className="site-footer__col">
              <h4>{t("footer.community")}</h4>
              <Link to="/community">{t("menu.qa.label")}</Link>
              <Link to="/enquiries">{t("menu.enquiries.label")}</Link>
            </div>

            <div className="site-footer__col">
              <h4>{t("footer.discover")}</h4>
              {/* <Link to="/businesses">{t("footer.browseBusinesses")}</Link> */}
              <Link to="/search">{t("footer.search")}</Link>
              <Link to="/register">{t("nav.joinNetwork")}</Link>
            </div>
          </div>

          <aside className="site-footer__buzz">
            <NewsletterForm variant="footer" english />

            {/* <Link to="/#newsletter" className="site-footer__advertise">
              <span>{t("footer.advertise")}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" /><path d="M8 7h9v9" />
              </svg>
            </Link> */}

            <div className="site-footer__follow">
              <h4>{t("footer.follow")}</h4>
              <div className="site-footer__social">
                {SOCIAL.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <SocialIcon id={s.id} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="site-footer__brandrow">
          <Link to="/" className="site-footer__wordmark" aria-label="Vartha">VARTHA</Link>
          <nav className="site-footer__legal" aria-label="Footer">
            {LEGAL.map((l) => (
              <Link key={l.key} to={l.to}>{t(l.key)}</Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__rule site-footer__rule--bottom" />
        <p className="site-footer__copy">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
