import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { enquiriesApi } from "../../api/endpoints";
import EnquiryCard from "./EnquiryCard";
import { useLanguage } from "../../context/LanguageContext";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./enquiries.css";

export function EnquiriesFeed({ limit }) {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => enquiriesApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>{t("home.enquiries.empty")}</Empty>;
  return (
    <div className="enquiry-list">
      {items.map((e) => <EnquiryCard enquiry={e} key={e.id} />)}
    </div>
  );
}

export default function EnquiriesPreview() {
  const { t } = useLanguage();
  return (
    <section className="enquiries-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">{t("menu.enquiries.label")}</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>{t("home.enquiries.heading")}</h2>
          <p className="section-sub">{t("home.enquiries.sub")}</p>
        </div>
        <Link to="/enquiries" className="btn-link">{t("home.enquiries.viewAll")}</Link>
      </div>
      <div className="container">
        <EnquiriesFeed limit={3} />
      </div>
    </section>
  );
}
