import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { businessApi } from "../api/endpoints";
import BusinessProfile from "../components/BusinessProfile/BusinessProfile";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { useLanguage } from "../context/LanguageContext";

export default function BusinessProfilePage() {
  const { idOrSlug } = useParams();
  const { t } = useLanguage();
  const {
    data: business,
    loading,
    error,
    refetch,
  } = useFetch(() => businessApi.getOne(idOrSlug), [idOrSlug]);

  if (loading)
    return (
      <div className="page-shell container" style={{ paddingTop: "calc(var(--header-h) + 24px)" }}>
        <Loading />
      </div>
    );

  if (error) {
    return (
      <div
        className="page-shell container"
        style={{ paddingTop: "calc(var(--header-h) + 24px)", paddingBottom: 100 }}
      >
        <h2 className="section-heading">{t("profile.notFound")}</h2>
        <ErrorMessage error={error} onRetry={refetch} />
        <Link
          to="/"
          className="btn btn-primary"
          style={{ marginTop: 20, display: "inline-flex" }}
        >
          {t("profile.backHome")}
        </Link>
      </div>
    );
  }

  return <BusinessProfile business={business} />;
}
