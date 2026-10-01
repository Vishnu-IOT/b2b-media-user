import React from "react";

/* Big display section titles, drawn to match the artwork headings on yourstory.com. */

export function TopPicksTitle() {
  return (
    <h2 className="ys-title ys-title--picks" aria-label="Top Picks">
      <span>Top</span>
      <svg className="ys-title__star" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M40 4l4.5 12.5 13-6-5.5 13.5L66 27l-14 4.5 8 11.5-13.5-3-1.5 14L38 44 27 55l2.5-14.5L14 42l11-9-14-8 15-1-4-14 13 6z" fill="#ED1C24" transform="translate(-6 -2) scale(.95)" />
        <path d="M2 62C8 46 16 34 28 28M8 62C14 50 20 42 30 36" stroke="#ED1C24" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span>Picks</span>
    </h2>
  );
}

export function PlaybookTitle() {
  return (
    <h2 className="ys-title ys-title--desk" aria-label="The Playbook">
      <span>The</span>
      <span className="ys-title__underlined">Playbook</span>
    </h2>
  );
}

export function ConversationsTitle() {
  return (
    <h2 className="ys-title ys-title--center ys-title--conv" aria-label="Conversations">
      <span aria-hidden="true">Conversat</span>
      <svg className="ys-title__mic" viewBox="0 0 40 90" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <rect x="8" y="2" width="24" height="34" rx="12" fill="#ED1C24" />
        <path d="M14 9v20M20 7v24M26 9v20" stroke="#fff" strokeWidth="1.6" opacity=".7" />
        <path d="M20 36v30" stroke="#ED1C24" strokeWidth="7" strokeLinecap="round" />
        <path d="M6 84c0-9 28-9 28 0" stroke="#ED1C24" strokeWidth="7" fill="none" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true">ons</span>
    </h2>
  );
}

export function FeaturedTitle({ children = "Featured Series" }) {
  return (
    <h2 className="ys-title ys-title--featured" aria-label={children}>
      <span>{children}</span>
      <svg className="ys-title__arrow" viewBox="0 0 70 60" aria-hidden="true">
        <path d="M4 14c18-12 46-8 54 18" stroke="#ED1C24" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M50 26l9 8 6-11" stroke="#ED1C24" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </h2>
  );
}

export function SpotlightTitle() {
  return (
    <h2 className="ys-title ys-title--spot" aria-label="Spotlight">
      <span aria-hidden="true">Sp</span>
      <span className="ys-title__o" aria-hidden="true" />
      <span aria-hidden="true">tlight</span>
    </h2>
  );
}

export function BusinessFirstTitle() {
  return (
    <h2 className="ys-title ys-title--center ys-title--first" aria-label="Business First">
      <span>Business</span>
      <span className="ys-title__first">First</span>
    </h2>
  );
}

export function InDepthTitle() {
  return (
    <h2 className="ys-title ys-title--center ys-title--depth" aria-label="In-Depth">
      In-Depth
    </h2>
  );
}
