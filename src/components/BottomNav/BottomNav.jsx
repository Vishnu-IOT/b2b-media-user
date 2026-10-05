import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./bottom-nav.css";

/**
 * Mobile-only bottom navigation (shown at <= 900px, the same breakpoint where the header
 * switches to its phone layout). Order: Business, Stories, [Home], Strategies, Products, Resources.
 * Labels reuse existing i18n keys, so they follow the Tamil/English switch automatically.
 */
const Icon = ({ children }) => (
  <svg
    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
  >
    {children}
  </svg>
);

const ITEMS = [
  {
    id: "stories", to: "/stories", labelKey: "search.type.stories",
    icon: <Icon><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /><path d="M9 8h6M9 12h6" /></Icon>,
  },
  {
    id: "strategies", to: "/strategies", labelKey: "search.type.strategies",
    icon: <Icon><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></Icon>,
  },
  {
    id: "home", to: "/", labelKey: "nav.home", end: true, center: true,
    icon: <Icon><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></Icon>,
  },
  {
    id: "products", to: "/products", labelKey: "search.type.products",
    icon: <Icon><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></Icon>,
  },
  {
    id: "resources", to: "/resources", labelKey: "nav.resources",
    icon: <Icon><path d="M5 4h10l4 4v12H5z" /><path d="M15 4v4h4" /><path d="M8 13h8M8 17h6" /></Icon>,
  },
];

export default function BottomNav() {
  const { tEn: t } = useLanguage(); // bottom bar is always English
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul className="bottom-nav__list">
        {ITEMS.map((it) => (
          <li key={it.id} className={`bottom-nav__cell${it.center ? " bottom-nav__cell--center" : ""}`}>
            <NavLink
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `bottom-nav__link${it.center ? " bottom-nav__link--center" : ""}${isActive ? " is-active" : ""}`
              }
            >
              <span className="bottom-nav__icon">{it.icon}</span>
              <span className="bottom-nav__label">{t(it.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
