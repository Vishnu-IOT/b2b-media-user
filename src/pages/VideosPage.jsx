import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { videosApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, youtubeEmbedUrl } from "../utils/text";
import ShareButton from "../components/Share/ShareButton";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { useLanguage } from "../context/LanguageContext";
import useSectionTranslator from "../hooks/useSectionTranslator";
import { VideosGrid } from "../components/Videos/Videos";
import "../styles/article.css";

function VideoDetail({ id }) {
  const { t } = useLanguage();
  const { tr, pending } = useSectionTranslator(); // this page's own translator
  const { data: video, loading, error, refetch } = useFetch(() => videosApi.getOne(id), [id]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!video) return null;

  const embed = video.type === "YOUTUBE" ? youtubeEmbedUrl(video.youtubeUrl) : null;
  // Share preview image: uploaded thumbnail, else the YouTube thumbnail
  const ytId = embed ? embed.split("/embed/")[1] : null;
  const shareImage = video.thumbnail
    ? fileUrl(video.thumbnail)
    : ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : "";

  return (
    <article className={`page-shell article${pending ? " is-translating" : ""}`}>
      <div className="container article__head">
        <p className="eyebrow">{t("videos.eyebrowDetail")} · {video.business.industry}</p>
        <h1 className="article__headline">{tr(video.title)}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{video.business.companyName.charAt(0)}</div>
          <div><p className="article__author-name">{video.business.companyName}</p></div>
          <ShareButton
            title={tr(video.title)}
            text={video.description ? tr(excerpt(video.description, 160)) : ""}
            image={shareImage}
          />
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, margin: "0 auto 34px" }}>
        {embed ? (
          <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
            <iframe
              src={embed}
              title={tr(video.title)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        ) : video.videoPath ? (
          <video src={fileUrl(video.videoPath)} controls style={{ width: "100%", background: "#000" }} />
        ) : (
          <p className="section-sub">{t("videos.unavailable")}</p>
        )}
      </div>

      <div className="container article__body">
        {video.description && <p>{tr(video.description)}</p>}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${video.business.slug}`} className="btn btn-outline">
            View {video.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function VideosIndex() {
  const { t } = useLanguage();
  return (
    <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 28px)", paddingBottom: 90 }}>
      <p className="eyebrow">{t("videos.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>{t("videos.title")}</h1>
      <VideosGrid />
    </div>
  );
}

export default function VideosPage() {
  const { id } = useParams();
  return id ? <VideoDetail id={id} /> : <VideosIndex />;
}
