import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./welcome.css";

const COLORS = ["#ED1C24", "#F5A524", "#FFFFFF", "#6CC069", "#C7A6FF", "#FF8C8B"];

// Deterministic "random" so the burst looks the same on every render.
const rnd = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Full-screen celebration shown once the OTP is verified and the account exists.
 * It points the user to their inbox, where the dashboard link for posting stories is sent.
 */
export default function WelcomeScreen({ name, email }) {
  const first = (name || "").trim().split(" ")[0] || "there";
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => {
        const angle = rnd(i, 1) * Math.PI * 2;
        const dist = 160 + rnd(i, 2) * 360;
        return {
          dx: Math.round(Math.cos(angle) * dist),
          dy: Math.round(Math.sin(angle) * dist * 0.8 - 80),
          rot: Math.round(rnd(i, 3) * 720 - 360),
          size: 6 + Math.round(rnd(i, 4) * 8),
          delay: Math.round(rnd(i, 5) * 250),
          color: COLORS[i % COLORS.length],
          round: i % 3 === 0,
        };
      }),
    []
  );

  return (
    <section className="welcome" role="status" aria-live="polite">
      <div className="welcome__bg" aria-hidden="true">
        <i className="welcome__orb welcome__orb--a" />
        <i className="welcome__orb welcome__orb--b" />
      </div>

      <div className="welcome__inner">
        <div className="welcome__stage" aria-hidden="true">
          <div className="welcome__confetti">
            {pieces.map((p, i) => (
              <span
                key={i}
                style={{
                  "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--rot": `${p.rot}deg`,
                  width: p.size, height: p.round ? p.size : p.size * 0.5,
                  background: p.color, borderRadius: p.round ? "50%" : 1,
                  animationDelay: `${600 + p.delay}ms`,
                }}
              />
            ))}
          </div>
          <svg className="welcome__envelope" viewBox="0 0 160 130" fill="none">
            <rect className="welcome__letter" x="28" y="30" width="104" height="70" rx="3" fill="#fff" />
            <path className="welcome__lines" d="M42 52h76M42 66h76M42 80h48" stroke="#E4E4E4" strokeWidth="4" strokeLinecap="round" />
            <path className="welcome__back" d="M10 52L80 4l70 48v68a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V52z" fill="#ED1C24" />
            <path className="welcome__front" d="M10 58l70 48 70-48v62a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V58z" fill="#C41F1E" />
            <path className="welcome__flap" d="M10 52L80 4l70 48-70 48L10 52z" fill="#FF4A4F" />
          </svg>
        </div>

        <p className="welcome__kicker welcome__rise" style={{ "--d": "0.9s" }}>
          <span aria-hidden="true">✓</span> Email verified
        </p>
        <h1 className="welcome__title welcome__rise" style={{ "--d": "1.05s" }}>
          Welcome to Vartha, <em>{first}</em>!
        </h1>
        <p className="welcome__sub welcome__rise" style={{ "--d": "1.2s" }}>
          Your account is ready. <strong>Please check your email</strong> to visit your dashboard, where you can
          post your story and share your business with the whole community.
        </p>
        {email && (
          <p className="welcome__to welcome__rise" style={{ "--d": "1.3s" }}>
            Sent to <strong>{email}</strong>
          </p>
        )}

        <ol className="welcome__steps">
          {[
            ["Check your inbox", "Look for our email. If you can't see it, check your spam folder."],
            ["Open your dashboard", "Use the link in the email to set up your business profile."],
            ["Post your first story", "Tell the community how your business started and where it's going."],
          ].map(([title, text], i) => (
            <li key={title} className="welcome__rise" style={{ "--d": `${1.45 + i * 0.15}s` }}>
              <span className="welcome__num">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>

        <div className="welcome__cta welcome__rise" style={{ "--d": "1.95s" }}>
          <Link to="/stories" className="btn btn-accent">Explore stories</Link>
          <Link to="/account" className="btn welcome__ghost">Go to my account</Link>
        </div>
      </div>
    </section>
  );
}
