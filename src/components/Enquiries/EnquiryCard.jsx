import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./enquiries.css";

export default function EnquiryCard({ enquiry }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  return (
    <div className={`enquiry-card${pending ? " is-translating" : ""}`}>
      <div className="enquiry-card__top">
        {enquiry.category && <span className="tag">{tr(enquiry.category)}</span>}
        <span className="enquiry-card__date">{formatDate(enquiry.createdAt, lang)}</span>
      </div>
      <h4>{tr(enquiry.title)}</h4>
      <p className="enquiry-card__company">{t("card.sharedBy")} {enquiry.business.companyName}</p>
      <p className="enquiry-card__desc">{tr(enquiry.description)}</p>
      <div className="enquiry-card__facts">
        <div><span>{t("card.location")}</span><strong>{enquiry.location ? tr(enquiry.location) : t("card.notSpecified")}</strong></div>
      </div>
      <Link to={`/enquiries/${enquiry.id}`} className="btn btn-outline">{t("card.viewDetails")}</Link>
    </div>
  );
}
