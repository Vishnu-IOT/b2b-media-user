import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import "./videos.css";

export default function VideoCard({ video }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // each card translates its own API text
  const thumb = video.thumbnail
    ? fileUrl(video.thumbnail)
    : video.type === "YOUTUBE" && video.youtubeUrl
    ? youtubeThumb(video.youtubeUrl)
    : null;

  return (
    <Link to={`/videos/${video.id}`} className={`video-card${pending ? " is-translating" : ""}`}>
      <div className="video-card__thumb">
        {thumb ? <img src={thumb} alt={tr(video.title)} /> : <div className="video-card__thumb--placeholder">{video.business.companyName.charAt(0)}</div>}
        <span className="video-card__play">▶</span>
      </div>
      <div className="video-card__body">
        <span className="tag">{video.type === "YOUTUBE" ? t("videos.typeYoutube") : t("videos.typeUploaded")}</span>
        <h4>{tr(video.title)}</h4>
        <p>{video.business.companyName}</p>
      </div>
    </Link>
  );
}

function youtubeThumb(watchUrl) {
  try {
    const id = new URL(watchUrl).searchParams.get("v");
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}
