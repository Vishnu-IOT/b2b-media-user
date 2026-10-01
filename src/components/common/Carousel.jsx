import React, { useCallback, useEffect, useRef, useState } from "react";
import "./carousel.css";

/**
 * Horizontal swipe row with prev/next arrows (as on yourstory.com).
 * Pure presentation: wraps whatever cards it is given, no data logic.
 */
export default function Carousel({ children, className = "" }) {
  const rowRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, children]);

  const scrollBy = (dir) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="carousel">
      <button
        type="button"
        className="carousel__btn carousel__btn--prev"
        aria-label="Previous"
        disabled={edge.start}
        onClick={() => scrollBy(-1)}
      >
        ‹
      </button>
      <div ref={rowRef} className={`scroll-row ${className}`} onScroll={update}>
        {children}
      </div>
      <button
        type="button"
        className="carousel__btn carousel__btn--next"
        aria-label="Next"
        disabled={edge.end}
        onClick={() => scrollBy(1)}
      >
        ›
      </button>
    </div>
  );
}
