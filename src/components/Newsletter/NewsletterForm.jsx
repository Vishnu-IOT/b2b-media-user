import React, { useState } from "react";
import { newsletterApi } from "../../api/endpoints";
import { useLanguage } from "../../context/LanguageContext";
import "./newsletter.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * variant="navbar"  -> compact inline pill (input + icon button), used in the header
 * variant="footer"  -> full block with heading, blurb, input + button, used in the footer
 */
export default function NewsletterForm({ variant = "footer" }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setErrorMsg(t("newsletter.invalidEmail"));
      return;
    }
    setStatus("sending");
    try {
      const res = await newsletterApi.subscribe(email);
      // The API answers { email, alreadySubscribed } in the same single step: no OTP, no second screen.
      setOkMsg(res && res.alreadySubscribed ? t("newsletter.already") : t("newsletter.success"));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(t("newsletter.error"));
    }
  };

  if (variant === "navbar") {
    return (
      <form className="newsletter newsletter--navbar" onSubmit={submit}>
        {status === "success" ? (
          <span className="newsletter__ok">{okMsg}</span>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="newsletter__input"
              aria-label={t("newsletter.placeholder")}
            />
            <button type="submit" className="newsletter__btn" disabled={status === "sending"}>
              {status === "sending" ? t("newsletter.sending") : t("newsletter.button")}
            </button>
          </>
        )}
        {status === "error" && <span className="newsletter__err">{errorMsg}</span>}
      </form>
    );
  }

  if (variant === "band" || variant === "card") {
    return (
      <div className={`newsletter newsletter--${variant}`}>
        {status === "success" ? (
          <p className="newsletter__ok">{okMsg}</p>
        ) : (
          <form onSubmit={submit} className="newsletter__row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="newsletter__input"
              aria-label={t("newsletter.placeholder")}
            />
            <button type="submit" className={`btn ${variant === "card" ? "btn-primary" : "btn-accent"}`} disabled={status === "sending"}>
              {status === "sending" ? t("newsletter.sending") : t("newsletter.button")}
            </button>
          </form>
        )}
        {status === "error" && <p className="newsletter__err">{errorMsg}</p>}
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className="newsletter newsletter--dropdown">
        <h4>{t("newsletter.heading")}</h4>
        <p>{t("newsletter.blurb")}</p>
        {status === "success" ? (
          <p className="newsletter__ok">{okMsg}</p>
        ) : (
          <form onSubmit={submit} className="newsletter__row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="newsletter__input"
              aria-label={t("newsletter.placeholder")}
              autoFocus
            />
            <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
              {status === "sending" ? t("newsletter.sending") : t("newsletter.button")}
            </button>
          </form>
        )}
        {status === "error" && <p className="newsletter__err">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className="newsletter newsletter--footer">
      <h4>{t("newsletter.heading")}</h4>
      <p>{t("newsletter.blurb")}</p>
      <form onSubmit={submit} className="newsletter__row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          className="newsletter__input"
          aria-label={t("newsletter.placeholder")}
        />
        <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
          {status === "sending" ? t("newsletter.sending") : t("newsletter.button")}
        </button>
      </form>
      {status === "success" && <p className="newsletter__ok">{okMsg}</p>}
      {status === "error" && <p className="newsletter__err">{errorMsg}</p>}
    </div>
  );
}
