import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OtpInput from "./OtpInput";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const EXPIRY_MINUTES = 10;

function maskEmail(email) {
  const [user = "", domain = ""] = email.split("@");
  const shown = user.slice(0, Math.min(2, user.length));
  return `${shown}${"•".repeat(Math.max(2, user.length - shown.length))}@${domain}`;
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * OTP entry screen.
 *  - onVerify(code): resolve when accepted, throw { message, status } when not
 *  - onResend():     ask the API to send a fresh code
 *  - initialSeconds: resend cool-down (use 0 to allow resending immediately)
 *  - intro:          optional notice shown above the code boxes
 */
export default function OtpStep({ email, onVerify, onResend, onChangeEmail, initialSeconds = RESEND_SECONDS, intro, changeLabel = "Change email" }) {
  const length = OTP_LENGTH;
  const resendSeconds = RESEND_SECONDS;
  const expiryMinutes = EXPIRY_MINUTES;
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [errorStatus, setErrorStatus] = useState(null);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const submit = useCallback(
    async (value) => {
      if (busy || value.length !== length) return;
      setBusy(true);
      setError(null);
      setErrorStatus(null);
      setNotice(null);
      try {
        await onVerify(value);
      } catch (err) {
        setError((err && err.message) || "Verification failed. Please try again.");
        setErrorStatus(err && err.status);
        setShake(true);
        setCode("");
        setTimeout(() => setShake(false), 500);
      } finally {
        setBusy(false);
      }
    },
    [busy, length, onVerify]
  );

  // Verify automatically as soon as the last digit is entered.
  useEffect(() => {
    if (code.length === length) submit(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const resend = async () => {
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      await onResend();
      setCode("");
      setSeconds(resendSeconds);
      setNotice("A new code is on its way.");
    } catch (err) {
      setError((err && err.message) || "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-step">
      <div className="otp-step__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="10" width="38" height="28" rx="2" />
          <path d="M6 12l18 15L42 12" />
        </svg>
      </div>
      <h2 className="otp-step__title">Verify your email</h2>
      {intro && <p className="otp-step__intro">{intro}</p>}
      <p className="otp-step__sub">
        We sent a {length}-digit code to <strong>{maskEmail(email)}</strong>.
        <br />It expires in {expiryMinutes} minutes.
      </p>

      <div className={shake ? "otp-shake" : ""}>
        <OtpInput length={length} value={code} onChange={setCode} disabled={busy} invalid={!!error} />
      </div>

      <div className="otp-step__status" aria-live="polite">
        {error && (
          <p className="otp-step__error">
            {error}
            {errorStatus === 409 && (
              <>
                {" "}
                <Link to="/login" className="otp-link">Log in</Link>
              </>
            )}
          </p>
        )}
        {!error && notice && <p className="otp-step__notice">{notice}</p>}
      </div>

      <button
        type="button"
        className="btn btn-accent otp-step__verify"
        disabled={busy || code.length !== length}
        onClick={() => submit(code)}
      >
        {busy ? (
          <>
            <span className="otp-spinner" aria-hidden="true" /> Verifying…
          </>
        ) : (
          "Verify & Create Account"
        )}
      </button>

      <div className="otp-step__resend">
        {seconds > 0 ? (
          <span>
            Resend code in <strong>{mmss(seconds)}</strong>
          </span>
        ) : (
          <button type="button" className="otp-link" onClick={resend} disabled={resending || busy}>
            {resending ? "Sending…" : "Didn't get it? Resend code"}
          </button>
        )}
        <span className="otp-step__dot" aria-hidden="true">·</span>
        <button type="button" className="otp-link otp-link--muted" onClick={onChangeEmail} disabled={busy}>
          {changeLabel}
        </button>
      </div>

    </div>
  );
}
