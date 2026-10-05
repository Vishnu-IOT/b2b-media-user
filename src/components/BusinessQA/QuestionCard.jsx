import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./qa.css";

export default function QuestionCard({ q }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  return (
    <Link to={`/community/${q.id}`} className={`qa-card${pending ? " is-translating" : ""}`}>
      <div className="qa-card__body">
        <div className="qa-card__meta">
          {q.category && <span className="tag">{q.category}</span>}
          <span>{formatDate(q.createdAt, lang)}</span>
        </div>
        <h4>{tr(q.title)}</h4>
        <p>{tr(q.description)}</p>
        <div className="qa-card__foot">
          <span>{t("card.askedBy")} {q.user.name}</span>
          <span>{q.answerCount} {q.answerCount === 1 ? t("card.answer") : t("card.answers")}</span>
        </div>
      </div>
    </Link>
  );
}
