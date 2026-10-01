import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import NewsletterForm from "./NewsletterForm";
import "./newsletter.css";

/* Full-width sign-up strip shown between home sections. */
export default function NewsletterBand() {
  const { t } = useLanguage();
  return (
    <section className="newsletter-band">
      <div className="container newsletter-band__inner">
        <div className="newsletter-band__copy">
          <span className="newsletter-band__icon" aria-hidden="true">✉</span>
          <div>
            <h3>{t("newsletter.heading")}</h3>
            <p>{t("newsletter.blurb")}</p>
          </div>
        </div>
        <NewsletterForm variant="band" />
      </div>
    </section>
  );
}
