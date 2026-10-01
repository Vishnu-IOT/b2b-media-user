import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { questionsApi } from "../../api/endpoints";
import QuestionCard from "./QuestionCard";
import { useLanguage } from "../../context/LanguageContext";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./qa.css";

export function QuestionsFeed({ limit, category }) {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => questionsApi.list({ limit: limit || 20, category }), [limit, category]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>{t("home.qa.empty")}</Empty>;
  return (
    <div className="qa-list">
      {items.map((q) => <QuestionCard q={q} key={q.id} />)}
    </div>
  );
}

export default function BusinessQAPreview() {
  const { t } = useLanguage();
  return (
    <section className="qa-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">{t("home.qa.eyebrow")}</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>{t("home.qa.heading")}</h2>
        </div>
        <Link to="/community" className="btn-link">{t("home.qa.join")}</Link>
      </div>
      <div className="container">
        <QuestionsFeed limit={3} />
      </div>
    </section>
  );
}
