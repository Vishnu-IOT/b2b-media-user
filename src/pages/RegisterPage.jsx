import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpStep from "../components/Auth/OtpStep";
import WelcomeScreen from "../components/Auth/WelcomeScreen";
import "../components/Auth/AuthForm.css";
import "../components/Auth/RegisterOtp.css";

const formatError = (err) =>
  err && err.errors ? err.errors.map((x) => x.message).join(", ") : (err && err.message) || "Something went wrong.";

function strength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  return score; // 0..4
}
const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Good", "Strong"];

/**
 * Signup is two API calls:
 *   POST /auth/register    -> creates an unverified account, emails an OTP, returns { email } (no token)
 *   POST /auth/verify-otp  -> returns { user, token }; only now is the user logged in
 * `verifyEmail` (set by /verify-email) jumps straight to the OTP screen for an already-registered,
 * not-yet-verified email, e.g. when login answered 403.
 */
export function RegisterFlow({ verifyEmail }) {
  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(verifyEmail ? "otp" : "details"); // details -> otp -> done
  const [form, setForm] = useState({ name: "", email: verifyEmail || "", password: "" });
  const [pendingEmail, setPendingEmail] = useState(verifyEmail || "");
  const [doneName, setDoneName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Step 1: create the (unverified) account and send the code. Nobody is logged in yet.
  const onDetails = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await register(form.name.trim(), form.email.trim(), form.password);
      setPendingEmail((res && res.email) || form.email.trim());
      setStep("otp");
    } catch (err) {
      setError(formatError(err)); // 409 "account already exists" and 422 validation errors land here
    } finally {
      setBusy(false);
    }
  };

  // Step 2: the token is stored inside verifyOtp, only after the API accepts the code.
  const onVerify = async (otp) => {
    const user = await verifyOtp(pendingEmail, otp); // throws { message, status } -> shown under the boxes
    setDoneName((user && user.name) || form.name.trim());
    setStep("done"); // the welcome screen stays until the user chooses where to go next
  };

  const score = strength(form.password);

  if (step === "done") return <WelcomeScreen name={doneName} email={pendingEmail} />;

  return (
    <div className="page-shell reg-page">
      <div className="container reg-shell">
        <aside className="reg-aside">
          <span className="reg-aside__kicker">Join the Network</span>
          <h1>Your business, in front of the whole community.</h1>
          <ul className="reg-aside__list">
            <li><span aria-hidden="true">✓</span> Ask questions and get answers from local business owners</li>
            <li><span aria-hidden="true">✓</span> Follow stories, launches and supplier enquiries</li>
            <li><span aria-hidden="true">✓</span> Free to join, verified by a one-time code</li>
          </ul>
        </aside>

        <section className="reg-card">
          {!verifyEmail && (
            <ol className="reg-steps" aria-label="Registration progress">
              <li className={step === "details" ? "is-current" : "is-done"}>
                <span className="reg-steps__dot">{step === "details" ? "1" : "✓"}</span> Your details
              </li>
              <li className="reg-steps__bar" aria-hidden="true"><i className={step === "otp" ? "is-full" : ""} /></li>
              <li className={step === "otp" ? "is-current" : ""}>
                <span className="reg-steps__dot">2</span> Verify email
              </li>
            </ol>
          )}

          {step === "details" && (
            <div className="reg-pane" key="details">
              <h2>Create your account</h2>
              <p className="reg-sub">We'll email you a code to confirm it's really you.</p>
              {error && <div className="auth-form__error" role="alert">{error}</div>}
              <form className="reg-form" onSubmit={onDetails}>
                <label>
                  <span>Full name</span>
                  <input required autoComplete="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label>
                  <span>Email</span>
                  <input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label>
                  <span>Password</span>
                  <div className="reg-pw">
                    <input
                      required
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="button" className="reg-pw__toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {form.password && (
                    <div className="reg-meter" aria-live="polite">
                      <div className="reg-meter__bars">
                        {[1, 2, 3, 4].map((n) => (
                          <i key={n} className={score >= n ? `on on--${score}` : ""} />
                        ))}
                      </div>
                      <small>{STRENGTH_LABEL[score]}</small>
                    </div>
                  )}
                </label>
                <button className="btn btn-accent reg-submit" disabled={busy} type="submit">
                  {busy ? (
                    <>
                      <span className="otp-spinner" aria-hidden="true" /> Sending code…
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
              <p className="auth-page__switch">Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          )}

          {step === "otp" && (
            <div className="reg-pane" key="otp">
              <OtpStep
                email={pendingEmail}
                onVerify={onVerify}
                onResend={() => resendOtp(pendingEmail)}
                initialSeconds={verifyEmail ? 0 : 30}
                intro={verifyEmail ? "Your email isn't verified yet. Enter the code we sent you, or request a new one." : undefined}
                changeLabel={verifyEmail ? "Back to log in" : "Change email"}
                onChangeEmail={() => {
                  if (verifyEmail) {
                    navigate("/login");
                    return;
                  }
                  setError(null);
                  setStep("details");
                }}
              />
            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterFlow />;
}

/** /verify-email: reached from login when the account exists but the email isn't verified. */
export function VerifyEmailPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const email = (location.state && location.state.email) || params.get("email");
  if (!email) return <Navigate to="/login" replace />;
  return <RegisterFlow verifyEmail={email} />;
}
