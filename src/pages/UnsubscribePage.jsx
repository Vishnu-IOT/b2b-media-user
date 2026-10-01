import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { newsletterApi } from "../api/endpoints";
import "../components/Newsletter/unsubscribe.css";

/**
 * One-shot confirmation page. The link in the newsletter email carries ?token=...,
 * and GET /api/newsletter/unsubscribe?token=... is called once when the page opens.
 */
export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState(token ? "working" : "missing"); // working | done | error | missing
  const [message, setMessage] = useState("");
  const called = useRef(false); // guards against React StrictMode's double effect in development

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true;
    newsletterApi
      .unsubscribe(token)
      .then(() => setState("done"))
      .catch((err) => {
        setMessage((err && err.message) || "This unsubscribe link is invalid or has expired.");
        setState("error");
      });
  }, [token]);

  return (
    <div className="page-shell unsub">
      <div className="unsub__card" role="status" aria-live="polite">
        {state === "working" && (
          <>
            <span className="unsub__spinner" aria-hidden="true" />
            <h1>Updating your subscription…</h1>
          </>
        )}
        {state === "done" && (
          <>
            <svg className="unsub__icon unsub__icon--ok" viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r="36" />
              <path d="M24 41l11 11 21-24" />
            </svg>
            <h1>You've been unsubscribed</h1>
            <p>You won't receive the Vartha newsletter any more. You can subscribe again any time from the footer of the site.</p>
            <Link to="/" className="btn btn-primary">Back to Vartha</Link>
          </>
        )}
        {(state === "error" || state === "missing") && (
          <>
            <svg className="unsub__icon unsub__icon--err" viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r="36" />
              <path d="M40 22v24M40 57v2" />
            </svg>
            <h1>We couldn't unsubscribe you</h1>
            <p>{state === "missing" ? "This link is missing its unsubscribe token. Please use the link from the email." : message}</p>
            <Link to="/" className="btn btn-outline">Back to Vartha</Link>
          </>
        )}
      </div>
    </div>
  );
}
