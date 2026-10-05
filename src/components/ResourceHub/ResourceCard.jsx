import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./resources.css";

export default function ResourceCard({ resource }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  const kind = resource.videoUrl ? t("resources.kindVideo") : resource.filePath ? t("resources.kindDocument") : t("resources.kindArticle");
  return (
    <Link to={`/resources/${resource.slug}`} className={`resource-card${pending ? " is-translating" : ""}`}>
      <div className="resource-card__image">
        {resource.coverImage ? (
          <img src={fileUrl(resource.coverImage)} alt={tr(resource.title)} />
        ) : (
          <div className="resource-card__image--placeholder">{resource.category?.name?.charAt(0)}</div>
        )}
        <span className="tag resource-card__type">{kind}</span>
      </div>
      <div className="resource-card__body">
        <span className="resource-card__category">{resource.category?.name}</span>
        <h4>{tr(resource.title)}</h4>
        {resource.summary && <p>{tr(resource.summary)}</p>}
      </div>
    </Link>
  );
}
