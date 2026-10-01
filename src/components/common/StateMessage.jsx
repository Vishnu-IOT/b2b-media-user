import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./state.css";

/* Skeleton placeholders keep the layout steady while data loads. */
export function Loading({ label }) {
  const { t } = useLanguage();
  return (
    <div className="state-msg state-msg--loading" role="status" aria-live="polite">
      <span className="sr-only">{label || t("common.loading")}</span>
      <div className="skeleton-row" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton skeleton--img" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--mid" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorMessage({ error, onRetry }) {
  const { t } = useLanguage();
  const message = (error && error.message) || t("common.error");
  return (
    <div className="state-msg state-msg--error">
      <p>{message}</p>
      {onRetry && <button className="btn btn-outline" onClick={onRetry}>{t("common.retry")}</button>}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="state-msg state-msg--empty">{children}</div>;
}
