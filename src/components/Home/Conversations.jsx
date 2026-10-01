import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useSectionTranslator from "../../hooks/useSectionTranslator";
import { useLanguage } from "../../context/LanguageContext";
import { videosApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { Loading, ErrorMessage } from "../common/StateMessage";
import { ConversationsTitle } from "./YsTitles";

function youtubeThumb(watchUrl) {
  try {
    const id = new URL(watchUrl).searchParams.get("v");
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

/* Videos: one big slide (text left, video right) with square prev/next buttons. */
export default function Conversations() {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this section's own translator
  const { data, loading, error, refetch } = useFetch(() => videosApi.list({ limit: 6 }), []);
  const [index, setIndex] = useState(0);
  const items = (data && data.items) || [];

  if (!loading && !error && !items.length) return null;

  const v = items[Math.min(index, Math.max(items.length - 1, 0))];
  const thumb = v
    ? v.thumbnail
      ? fileUrl(v.thumbnail)
      : v.type === "YOUTUBE" && v.youtubeUrl
      ? youtubeThumb(v.youtubeUrl)
      : null
    : null;

  return (
    <section className={`ys-section ys-conv${pending ? " is-translating" : ""}`}>
      <div className="container">
        <ConversationsTitle />
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && v && (
          <>
            <div className="ys-conv__slide" key={v.id}>
              <div className="ys-conv__text">
                <span className="eyebrow">{v.business.companyName}</span>
                <h3>{tr(v.title)}</h3>
                <p>{tr(v.description || v.title)}</p>
                <Link to={`/videos/${v.id}`} className="ys-conv__more">
                  {t("home.viewHighlights")} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <Link to={`/videos/${v.id}`} className="ys-conv__media" aria-label={tr(v.title)}>
                {thumb ? (
                  <img src={thumb} alt={tr(v.title)} />
                ) : (
                  <div className="ys-conv__placeholder">{v.business.companyName.charAt(0)}</div>
                )}
                <span className="ys-conv__play" aria-hidden="true">▶</span>
              </Link>
            </div>
            <div className="ys-arrows">
              <button type="button" className="ys-arrow" aria-label={t("home.prevVideo")} disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>‹</button>
              <button type="button" className="ys-arrow ys-arrow--dark" aria-label={t("home.nextVideo")} disabled={index >= items.length - 1} onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}>›</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
