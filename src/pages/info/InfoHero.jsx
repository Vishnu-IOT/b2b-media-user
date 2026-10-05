import React, { useRef } from "react";
import { usePointerGlow } from "./useInfoEffects";

/** Dark, animated hero shared by the About, Privacy and Terms pages. */
export default function InfoHero({ eyebrow, title, lead, compact = false, children, scrollCue = false }) {
  const ref = useRef(null);
  usePointerGlow(ref);
  // Split the title into words so each one can rise in with a small delay.
  const words = String(title).split(" ");
  return (
    <header ref={ref} className={`ip-hero${compact ? " ip-hero--compact" : ""}`}>
      <div className="ip-hero__bg" aria-hidden="true">
        <span className="ip-hero__orb ip-hero__orb--a" />
        <span className="ip-hero__orb ip-hero__orb--b" />
        <span className="ip-hero__grid" />
        <span className="ip-hero__spot" />
      </div>
      <div className="container ip-hero__inner">
        {eyebrow && <p className="ip-hero__eyebrow">{eyebrow}</p>}
        <h1 className="ip-hero__title" aria-label={title}>
          {words.map((w, i) => (
            <span className="ip-word" key={i} style={{ "--i": i }} aria-hidden="true">
              <span>{w}&nbsp;</span>
            </span>
          ))}
        </h1>
        {lead && <p className="ip-hero__lead">{lead}</p>}
        {children}
      </div>
      {scrollCue && (
        <span className="ip-hero__cue" aria-hidden="true">
          <span />
        </span>
      )}
    </header>
  );
}
