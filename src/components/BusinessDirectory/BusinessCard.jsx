import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./directory.css";

export default function BusinessCard({ business }) {
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text (company name stays as written)
  return (
    <Link to={`/businesses/${business.slug}`} className={`business-card${pending ? " is-translating" : ""}`}>
      <div className="business-card__image">
        {business.coverImage ? (
          <img src={fileUrl(business.coverImage)} alt={business.companyName} />
        ) : (
          <div className="business-card__image--placeholder">{business.companyName.charAt(0)}</div>
        )}
      </div>
      <div className="business-card__body">
        <div className="business-card__meta">
          {business.industry && <span className="tag">{business.industry}</span>}
          <span className="business-card__location">{business.location}</span>
        </div>
        <h4>{business.companyName}</h4>
        {business.description && <p>{tr(business.description)}</p>}
      </div>
    </Link>
  );
}
