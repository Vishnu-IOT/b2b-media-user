import React from "react";
import LegalLayout from "./LegalLayout";
import { PRIVACY } from "./legalContent";

export default function PrivacyPage() {
  return <LegalLayout kind="privacy" docs={PRIVACY} />;
}
