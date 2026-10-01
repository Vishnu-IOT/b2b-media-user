import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { questionsApi, answersApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { formatDate, normalizeText } from "../utils/text";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";
import "../components/BusinessQA/qa.css";

function AnswerForm({ questionId, onPosted }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <p className="section-sub">
        <button className="btn-link" onClick={() => navigate("/login", { state: { from: `/community/${questionId}` } })}>
          {t("community.loginBtn")}
        </button>{" "}{t("community.loginToAnswerRest")}
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await answersApi.create({ questionId: Number(questionId), answer: text });
      setText("");
      onPosted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="answer-form" onSubmit={submit}>
      {error && <div className="auth-form__error">{error}</div>}
      <textarea required rows={3} placeholder={t("community.shareAnswer")} value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? t("community.posting") : t("community.postAnswer")}</button>
      </div>
    </form>
  );
}

export default function QuestionDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this page's own translator (question + answers)
  const { data: question, loading, error, refetch } = useFetch(() => questionsApi.getOne(id), [id]);

  if (loading) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!question) return null;

  const answers = question.answers || [];

  return (
    <div className={`page-shell container${pending ? " is-translating" : ""}`} style={{ paddingTop: "calc(var(--header-h) + 52px)", paddingBottom: 90, maxWidth: 760 }}>
      <Link to="/community" className="btn-link" style={{ marginBottom: 26, display: "inline-block" }}>{t("community.back")}</Link>
      <div className="qa-card__meta">
        {question.category && <span className="tag">{tr(question.category)}</span>}
        <span>{formatDate(question.createdAt, lang)}</span>
      </div>
      <h1 className="section-heading" style={{ fontSize: "clamp(26px,3.4vw,38px)", margin: "14px 0" }}>{tr(question.title)}</h1>
      <p style={{ color: "var(--color-ink-soft)", lineHeight: 1.7, marginBottom: 10, whiteSpace: "pre-line" }}>{tr(normalizeText(question.description))}</p>
      <p className="section-sub" style={{ marginBottom: 30 }}>{t("card.askedBy")} {question.user.name}</p>

      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 10 }}>
        {answers.length} {answers.length === 1 ? t("card.answer") : t("card.answers")}
      </h3>
      <div>
        {answers.map((a) => (
          <div className="answer-item" key={a.id}>
            <p className="answer-item__meta">{a.user.name} · {formatDate(a.createdAt, lang)}</p>
            <p>{tr(normalizeText(a.answer))}</p>
          </div>
        ))}
        {answers.length === 0 && <p className="section-sub">{t("community.noAnswers")}</p>}
      </div>

      <AnswerForm questionId={id} onPosted={refetch} />
    </div>
  );
}
