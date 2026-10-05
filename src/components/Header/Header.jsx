import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { businessApi, resourceCategoriesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import NewsletterForm from "../Newsletter/NewsletterForm";
import "./header.css";

const MEGA = {
  Business: {
    description: "mega.business.desc",
    items: [
      { key: "stories", label: "Business Stories", to: "/stories" },
      { key: "achievements", label: "Achievements", to: "/achievements" },
      { key: "strategies", label: "Strategies", to: "/strategies" },
      { key: "products", label: "New Products", to: "/products" },
      { key: "enquiries", label: "Supplier Enquiries", to: "/enquiries" },
      { key: "videos", label: "Business Videos", to: "/videos" },
    ],
  },
  Community: {
    description: "mega.community.desc",
    items: [{ key: "qa", label: "Business Q&A", to: "/community" }],
  },
  Resources: {
    description: "mega.resources.desc",
    items: [], // filled dynamically from the real resource categories — see Header component
  },
  Newsletter: {
    description: "mega.newsletter.desc",
    isForm: true,
  },
};

const TOP_LEVEL = ["Business", "Community", "Resources", "Newsletter"];

const MEGA_IMAGES = {
  Business: "/images/mega-menu/business1.jpg",
  Community: "/images/mega-menu/community1.avif",
  Resources: "/images/mega-menu/resources1.webp",
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const { tEn: t, lang, toggleLang } = useLanguage(); // navbar text is always English (t = tEn)
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [resourceCategories, setResourceCategories] = useState([]);
  const closeTimer = useRef(null);
  // Resource categories come from the API, so their names/descriptions go through this translator.
  const { tr, pending: catPending } = useSectionTranslator("en"); // category names also stay English
  // Register them on every render (not only when the menu is open) so translation starts as soon as
  // the categories load and the dropdown never opens with untranslated text.
  resourceCategories.forEach((c) => {
    if (c.description) tr(c.description);
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    businessApi
      .list({ limit: 1 })
      .then((res) => setFeatured(res.items[0]))
      .catch(() => {});
    resourceCategoriesApi
      .list()
      .then(setResourceCategories)
      .catch(() => {});
  }, []);

  const openNow = (label) => {
    clearTimeout(closeTimer.current);
    setOpenPanel(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenPanel(null), 160);
  };

  return (
    <>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""} ${openPanel ? "has-panel-open" : ""}`}
        onMouseLeave={scheduleClose}
      >
        {/* Brand row: menu, centred wordmark, account + search (collapses on scroll) */}
        <div className="site-header__brandrow container">
          <button
            className={`site-header__burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>

          <Link
            to="/"
            className="site-header__logo"
            onClick={() => {
              setMenuOpen(false);
              setOpenPanel(null);
            }}
          >
            <span className="site-header__logo-text">VARTHA</span>
          </Link>

          <div className="site-header__actions">
            <button
              className="site-header__text-link site-header__lang-toggle"
              onClick={toggleLang}
              aria-label="Switch language"
              title={lang === "ta" ? "Switch to English" : "தமிழுக்கு மாறவும்"}
            >
              {lang === "ta" ? "EN" : "தமிழ்"}
            </button>
            {user ? (
              <>
                <Link to="/account" className="site-header__signin">
                  {t("nav.myAccount")}
                </Link>
                <button className="site-header__signin site-header-logout" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="site-header__signin">
                  {t("nav.login")}
                </Link>
                <Link to="/register" className="site-header__join">
                  {t("nav.join")}
                </Link>
              </>
            )}
            <Link to="/search" className="site-header__search" aria-label={t("search.label")}>
              <SearchIcon />
            </Link>
          </div>
        </div>

        {/* Navigation row with hairlines (stays visible when scrolled) */}
        <div className="site-header__navrow">
          <div className="container site-header__navrow-inner">
            <button
              className={`site-header__burger site-header__burger--compact ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>

            <nav className="site-header__nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "site-header__link" + (isActive ? " is-active" : "")
                }
              >
                {t("nav.home")}
              </NavLink>
              {TOP_LEVEL.map((label) => (
                <button
                  key={label}
                  className={`site-header__link site-header__link--btn ${openPanel === label ? "is-active" : ""}`}
                  onMouseEnter={() => openNow(label)}
                  onClick={() => setOpenPanel(openPanel === label ? null : label)}
                >
                  {t(`nav.${label.toLowerCase()}`)} <span className="site-header__caret">▾</span>
                </button>
              ))}
            </nav>

            <button
              className="site-header__text-link site-header__lang-toggle site-header__search-mini"
              onClick={toggleLang}
              aria-label="Switch language"
              title={lang === "ta" ? "Switch to English" : "தமிழுக்கு மாறவும்"}
            >
              {lang === "ta" ? "EN" : "தமிழ்"}
            </button>

            <Link to="/search" className="site-header__search-mini" aria-label={t("search.label")}>
              <SearchIcon />
            </Link>
          </div>
        </div>

        {/* Fullscreen mega panel */}
        {openPanel && (
          <div className="mega-panel" onMouseEnter={() => openNow(openPanel)}>
            <div className="container mega-panel__inner">
              <div className="mega-panel__main">
                <p className="mega-panel__eyebrow">{t(`nav.${openPanel.toLowerCase()}`)}</p>

                <p className="mega-panel__desc">
                  {t(MEGA[openPanel].description)}
                </p>

                {MEGA[openPanel].isForm ? (
                  <div className="mega-panel__form">
                    <NewsletterForm variant="dropdown" english />
                  </div>
                ) : (
                  <>
                    <div className="mega-panel__grid">
                      {(openPanel === "Resources"
                        ? resourceCategories.map((c) => ({
                            key: undefined,
                            isCat: true,
                            id: c.slug,
                            label: c.name,
                            to: `/resources?category=${c.slug}`,
                            desc: c.description
                              ? tr(c.description)
                              : t("menu.resources.countPublished").replace("{n}", c.postCount),
                          }))
                        : MEGA[openPanel].items
                      ).map((it) => (
                        <Link
                          key={it.id || it.label}
                          to={it.to}
                          className={`mega-panel__item${it.isCat && catPending ? " is-translating" : ""}`}
                          onClick={() => setOpenPanel(null)}
                        >
                          <span className="mega-panel__item-title">
                            {it.key ? t(`menu.${it.key}.label`) : it.label}
                          </span>

                          <span className="mega-panel__item-desc">
                            {it.key ? t(`menu.${it.key}.desc`) : it.desc}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {openPanel === "Resources" && (
                      <Link
                        to="/resources"
                        className="btn-link mega-panel__secondary"
                        onClick={() => setOpenPanel(null)}
                      >
                        {t("nav.viewAllResources")}
                      </Link>
                    )}

                    {MEGA[openPanel].secondaryLink && (
                      <Link
                        to={MEGA[openPanel].secondaryLink.to}
                        className="btn-link mega-panel__secondary"
                        onClick={() => setOpenPanel(null)}
                      >
                        {MEGA[openPanel].secondaryLink.label} →
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Mega Menu Cover Image */}
              <div className="mega-panel__cover">
                {MEGA_IMAGES[openPanel] ? (
                  <img src={MEGA_IMAGES[openPanel]} alt={`${openPanel}`} />
                ) : (
                  <div className="mega-panel__cover-visual" aria-hidden="true">
                    <span>✉</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        <div className={`mobile-nav ${menuOpen ? "is-open" : ""}`}>
          <NavLink
            to="/"
            className="mobile-nav__link"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.home")}
          </NavLink>
          {TOP_LEVEL.map((label) => {
            const expanded = mobileExpanded === label;
            return (
              <div key={label} className="mobile-nav__group">
                <button
                  className="mobile-nav__link mobile-nav__link--toggle"
                  onClick={() => setMobileExpanded(expanded ? null : label)}
                >
                  {t(`nav.${label.toLowerCase()}`)} <span>{expanded ? "−" : "+"}</span>
                </button>
                {expanded && (
                  <div className="mobile-nav__submenu">
                    {MEGA[label].isForm ? (
                      <div className="mobile-nav__submenu-form">
                        <NewsletterForm variant="dropdown" english />
                      </div>
                    ) : (
                      (label === "Resources"
                        ? resourceCategories.map((c) => ({
                            isCat: true,
                            id: c.slug,
                            label: c.name,
                            to: `/resources?category=${c.slug}`,
                          }))
                        : MEGA[label].items
                      ).map((it) => (
                        <Link
                          key={it.id || it.label}
                          to={it.to}
                          className={it.isCat && catPending ? "is-translating" : undefined}
                          onClick={() => setMenuOpen(false)}
                        >
                          {it.key ? t(`menu.${it.key}.label`) : it.label}
                        </Link>
                      ))
                    )}
                    {label === "Resources" && (
                      <Link to="/resources" onClick={() => setMenuOpen(false)}>
                        {t("nav.viewAllResources")}
                      </Link>
                    )}
                    {MEGA[label].secondaryLink && (
                      <Link
                        to={MEGA[label].secondaryLink.to}
                        onClick={() => setMenuOpen(false)}
                      >
                        {MEGA[label].secondaryLink.label}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <button
            className="mobile-nav__link mobile-nav__link--toggle"
            onClick={toggleLang}
          >
            {lang === "ta" ? "English" : "தமிழ்"}
          </button>
          {user ? (
            <>
              <Link
                to="/account"
                className="mobile-nav__link"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.myAccount")}
              </Link>
              <button
                className="btn btn-outline mobile-nav__join"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="mobile-nav__link"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="btn btn-accent mobile-nav__join"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.joinNetwork")}
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
