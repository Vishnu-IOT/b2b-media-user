import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { videosApi } from "../../api/endpoints";
import { useLanguage } from "../../context/LanguageContext";
import VideoCard from "./VideoCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./videos.css";

export function VideosGrid({ limit }) {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => videosApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>{t("videos.empty")}</Empty>;
  return (
    <div className="videos-grid">
      {items.map((v) => <VideoCard video={v} key={v.id} />)}
    </div>
  );
}

export default function VideosPreview() {
  const { data, loading, error, refetch } = useFetch(() => videosApi.list({ limit: 4 }), []);
  const items = (data && data.items) || [];
  const [lead, ...side] = items;
  return (
    <section className="videos-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Business Videos</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>Watch the Business</h2>
        </div>
        <Link to="/videos" className="btn-link">Browse all videos →</Link>
      </div>
      <div className="container">
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !items.length && <Empty>No videos published yet.</Empty>}
        {!loading && !error && lead && (
          <div className="videos-showcase">
            <div className="videos-lead"><VideoCard video={lead} /></div>
            {side.length > 0 && (
              <div className="videos-side">
                {side.map((v) => <VideoCard video={v} key={v.id} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
