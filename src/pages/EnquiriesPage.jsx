import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { enquiriesApi } from "../api/endpoints";
import { formatDate, normalizeText } from "../utils/text";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";
import { EnquiriesFeed } from "../components/Enquiries/Enquiries";
import "../styles/article.css";

function EnquiryDetail({ id }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this page's own translator
  const { data: enquiry, loading, error, refetch } = useFetch(() => enquiriesApi.getOne(id), [id]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!enquiry) return null;

  return (
    <article className={`page-shell article${pending ? " is-translating" : ""}`}>
      <div className="container article__head">
        <p className="eyebrow">{t("enquiries.eyebrowDetail")} {enquiry.category ? `· ${tr(enquiry.category)}` : ""}</p>
        <h1 className="article__headline">{tr(enquiry.title)}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{enquiry.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{enquiry.business.companyName}</p>
            <p className="article__author-meta">{tr(enquiry.location) || t("enquiries.locationNotSpecified")} · {t("enquiries.posted")} {formatDate(enquiry.createdAt, lang)}</p>
          </div>
        </div>
      </div>
      <div className="container article__body">
        <p>{tr(normalizeText(enquiry.description))}</p>
        {enquiry.contactInfo && (
          <blockquote className="article__pullquote" style={{ fontSize: 18 }}>
            {t("enquiries.contact")}: {enquiry.contactInfo}
          </blockquote>
        )}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${enquiry.business.slug}`} className="btn btn-outline">
            View {enquiry.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function EnquiriesIndex() {
  const { t } = useLanguage();
  return (
    <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 28px)", paddingBottom: 90 }}>
      <p className="eyebrow">{t("enquiries.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 12 }}>{t("home.enquiries.heading")}</h1>
      <p className="section-sub" style={{ marginBottom: 30 }}>
        {t("enquiries.sub")}
      </p>
      <EnquiriesFeed />
    </div>
  );
}

export default function EnquiriesPage() {
  const { id } = useParams();
  return id ? <EnquiryDetail id={id} /> : <EnquiriesIndex />;
}
