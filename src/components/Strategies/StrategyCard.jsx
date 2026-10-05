import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { excerpt, readingTime } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./strategies.css";

export default function StrategyCard({ strategy }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  return (
    <Link to={`/strategies/${strategy.id}`} className={`strategy-card${pending ? " is-translating" : ""}`}>
      <div className="strategy-card__image">
        {strategy.coverImage ? (
          <img src={fileUrl(strategy.coverImage)} alt={tr(strategy.title)} />
        ) : (
          <div className="strategy-card__image--placeholder">{strategy.business.companyName.charAt(0)}</div>
        )}
      </div>
      <div className="strategy-card__body">
        <span className="tag">{strategy.business.industry}</span>
        <h4>{tr(strategy.title)}</h4>
        <p>{tr(excerpt(strategy.content, 110))}</p>
        <span className="strategy-card__meta">{strategy.business.companyName} · {readingTime(strategy.content, t)}</span>
      </div>
    </Link>
  );
}
