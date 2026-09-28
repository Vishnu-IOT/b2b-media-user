import React, { useState } from "react";
import "./articlebody.css";

/**
 * BBC-style article body: paragraphs, with the SECOND image placed as a figure
 * roughly halfway through the copy. Renders nothing extra when image2 is missing
 * (or fails to load), so the article simply reads as text.
 *
 * Props: paragraphs (string[]), image2 (absolute URL | null), alt, caption, variant
 */
export default function ArticleBody({ paragraphs = [], image2, alt = "", caption, variant = "story" }) {
  const [broken, setBroken] = useState(false);
  const showFigure = Boolean(image2) && !broken;
  const at = paragraphs.length ? Math.max(1, Math.ceil(paragraphs.length / 2)) : 0;

  const figure = showFigure && (
    <figure className={`abody__figure abody__figure--${variant}`} key="figure">
      <img src={image2} alt={alt} loading="lazy" onError={() => setBroken(true)} />
      {caption && <figcaption className="abody__caption">{caption}</figcaption>}
    </figure>
  );

  const out = [];
  paragraphs.forEach((p, i) => {
    out.push(<p key={`p${i}`}>{p}</p>);
    if (i + 1 === at) out.push(figure);
  });
  if (!paragraphs.length) out.push(figure);

  return <div className={`abody abody--${variant}`}>{out}</div>;
}
