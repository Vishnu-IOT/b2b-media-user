import React from "react";
import LegalLayout from "./LegalLayout";
import { TERMS } from "./legalContent";

export default function TermsPage() {
  return <LegalLayout kind="terms" docs={TERMS} />;
}
