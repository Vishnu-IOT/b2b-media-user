import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { questionsApi } from "../../api/endpoints";
import { useLanguage } from "../../context/LanguageContext";
import "./qa.css";

export default function AskQuestionForm({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="qa-ask-cta">
        <p>{t("community.askCta")}</p>
        <button className="btn btn-accent" onClick={() => navigate("/login", { state: { from: "/community" } })}>
          {t("community.loginToAsk")}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="qa-ask-cta">
        <p>{t("community.askCta")}</p>
        <button className="btn btn-accent" onClick={() => setOpen(true)}>{t("community.askButton")}</button>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await questionsApi.create(form);
      setForm({ title: "", description: "", category: "" });
      setOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="qa-ask-form" onSubmit={submit}>
      {error && <div className="auth-form__error">{error}</div>}
      <input required placeholder={t("community.phQuestion")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea required placeholder={t("community.phContext")} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder={t("community.phCategory")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <div className="qa-ask-form__actions">
        <button type="button" className="btn-link" onClick={() => setOpen(false)}>{t("community.cancel")}</button>
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? t("community.posting") : t("community.postQuestion")}</button>
      </div>
    </form>
  );
}
