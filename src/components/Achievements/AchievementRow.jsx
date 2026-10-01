import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { formatDate } from "../../utils/text";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./achievements.css";

export default function AchievementRow({ achievement }) {
  const { t, lang } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each row translates its own API text
  const thumbs = [achievement.image, achievement.image2].filter(Boolean);
  return (
    <Link to={`/achievements/${achievement.id}`} className={`achv-row${pending ? " is-translating" : ""}`}>
      {thumbs.length ? (
        <div className={`achv-row__media achv-row__media--${thumbs.length}`}>
          {thumbs.map((src, i) => (
            <img className="achv-row__image" key={i} src={fileUrl(src)} alt={tr(achievement.title)} loading="lazy" />
          ))}
        </div>
      ) : (
        <div className="achv-row__image achv-row__image--placeholder">{achievement.business.companyName.charAt(0)}</div>
      )}
      <div className="achv-row__body">
        <span className="achv-row__company">{achievement.business.companyName}</span>
        <h4>{tr(achievement.title)}</h4>
        {achievement.description && <p>{tr(achievement.description)}</p>}
        <div className="achv-row__meta">
          {achievement.awardedBy && <span>{t("achievements.awardedByPrefix")} {achievement.awardedBy}</span>}
          {achievement.awardDate && <span>{formatDate(achievement.awardDate, lang)}</span>}
        </div>
      </div>
    </Link>
  );
}
