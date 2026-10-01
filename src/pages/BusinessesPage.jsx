import React from "react";
import { BusinessDirectoryFull } from "../components/BusinessDirectory/BusinessDirectory";
import { useLanguage } from "../context/LanguageContext";

export default function BusinessesPage() {
  const { t } = useLanguage();
  return (
    <div className="page-shell container">
      <div style={{ paddingTop: "calc(var(--header-h) + 28px)" }}>
        <p className="eyebrow">{t("directory.eyebrow")}</p>
        <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>{t("directory.title")}</h1>
        <p className="section-sub">{t("directory.sub")}</p>
      </div>
      <BusinessDirectoryFull />
    </div>
  );
}
