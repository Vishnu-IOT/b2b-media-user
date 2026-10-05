import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./share.css";

/**
 * Self-contained Share button.
 *
 * Props:
 *   title  (string)  post title that is shared (pass the displayed/translated title)
 *   text   (string)  optional short description
 *   image  (string)  optional ABSOLUTE image URL (use fileUrl(...) before passing)
 *   images (string[]) optional list of ABSOLUTE image URLs in priority order, e.g.
 *                    [coverImage, coverImage2]. The FIRST one that exists/loads is used,
 *                    so a post that only has its second image still shares an image.
 *   path   (string)  optional path to share; defaults to the current page URL
 *   block  (boolean) true = sits on its own row (left aligned) instead of the right side of a byline
 *
 * What it does:
 *   1. Phones / supported browsers: opens the native share sheet with title + link,
 *      and attaches the post image when the browser allows sharing files.
 *   2. Everywhere else: opens a small menu (WhatsApp, Facebook, X, LinkedIn,
 *      Telegram, Email, Copy link) — every option carries the title and the link.
 *   3. While the post is on screen it also updates the page's <title>/og:/twitter:
 *      meta tags (restored on leave) for crawlers that run JavaScript.
 */

const META_KEYS = [
  ["property", "og:title"],
  ["property", "og:description"],
  ["property", "og:image"],
  ["property", "og:url"],
  ["property", "og:type"],
  ["name", "twitter:card"],
  ["name", "twitter:title"],
  ["name", "twitter:description"],
  ["name", "twitter:image"],
];

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function absoluteUrl(path) {
  if (!path) return window.location.href;
  if (/^https?:\/\//i.test(path)) return path;
  return `${window.location.origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

// How many images to attach to the native share sheet (1 = first available only, 2 = both).
const MAX_SHARE_IMAGES = 1;
const MAX_SIDE = 1200;        // longest side in px after resizing
const TARGET_BYTES = 350 * 1024; // keep the shared file small (big files are dropped by apps / slow to share)
const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45];

// EVERY image is resized + re-encoded as JPEG, whatever its original size or format.
// Huge photos (several MB / 4000px+) and WebP/AVIF are the usual reasons a share ends up with no image.
async function toShareableBlob(blob) {
  try {
    const bmp = await createImageBitmap(blob);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    if (bmp.close) bmp.close();
    let out = null;
    for (let i = 0; i < QUALITIES.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      out = await new Promise((res) => canvas.toBlob(res, "image/jpeg", QUALITIES[i]));
      if (out && out.size <= TARGET_BYTES) break;
    }
    return out || blob;
  } catch {
    return blob; // browser can't decode it: send the original and let the OS try
  }
}

// Tries each candidate URL in order and returns up to MAX_SHARE_IMAGES shareable File objects.
async function loadShareFiles(urls) {
  const files = [];
  for (let i = 0; i < urls.length && files.length < MAX_SHARE_IMAGES; i += 1) {
    try {
      const res = await fetch(urls[i], { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.blob();
      if (!raw.type.startsWith("image/")) throw new Error("not an image");
      const blob = await toShareableBlob(raw);
      const ext = blob.type === "image/png" ? "png" : "jpg";
      const file = new File([blob], `share-${files.length + 1}.${ext}`, { type: blob.type });
      if (navigator.canShare && !navigator.canShare({ files: [file] })) throw new Error("file not shareable");
      files.push(file);
    } catch (err) {
      // Most common cause: the uploads route is missing CORS headers. See SHARE_PREVIEW.md.
      // eslint-disable-next-line no-console
      console.warn("[ShareButton] could not attach image:", urls[i], err && err.message);
    }
  }
  return files;
}

const Icon = {
  share: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.27-1.38A9.92 9.92 0 1 0 12.04 2zm0 18.1c-1.5 0-2.97-.4-4.25-1.17l-.3-.18-3.13.82.84-3.05-.2-.31a8.1 8.1 0 1 1 7.04 3.89zm4.45-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.45-3.3H13.5V8.4c0-.95.27-1.6 1.63-1.6h1.74V3.85A23 23 0 0 0 14.33 3.7c-2.5 0-4.2 1.52-4.2 4.32v2.48H7.3v3.3h2.83V22h3.37z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.16-8.18L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.5H3V9.75zm6.5 0h3.83v1.57h.05c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.79 2.66 4.79 6.12v5.88h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.1 2.7 11.5c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.1.9.8.9.5 0 .8-.2 1.1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.9 5.6c.3-1.3-.5-1.9-1-1.5zM8.6 13.9l9.5-6c.5-.3.9-.1.5.2l-7.8 7.1-.3 3.3-1.9-4.6z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" />
    </svg>
  ),
};

export default function ShareButton({ title = "", text = "", image = "", images = [], path = "", block = false }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preparing, setPreparing] = useState(false); // image still being downloaded/compressed
  const [readyHint, setReadyHint] = useState(false); // image finished AFTER the tap -> ask for one more tap
  const wrapRef = useRef(null);
  const filesPromiseRef = useRef(null); // pre-fetched image file(s), so the share click stays instant

  // First available image wins: image, then images[0], images[1]...
  const candidatesKey = [image, ...(images || [])].filter(Boolean).join("|");
  const candidates = candidatesKey ? Array.from(new Set(candidatesKey.split("|"))) : [];
  const primaryImage = candidates[0] || "";

  const url = absoluteUrl(path);
  const description = text || title;

  // Keep the page's preview meta tags in sync with the post being viewed.
  useEffect(() => {
    if (!title) return undefined;
    const prevTitle = document.title;
    const prev = META_KEYS.map(([attr, key]) => {
      const el = document.head.querySelector(`meta[${attr}="${key}"]`);
      return { attr, key, existed: Boolean(el), content: el ? el.getAttribute("content") : "" };
    });

    document.title = title;
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "article");
    setMeta("name", "twitter:card", primaryImage ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (primaryImage) {
      setMeta("property", "og:image", primaryImage);
      setMeta("name", "twitter:image", primaryImage);
    }

    return () => {
      document.title = prevTitle;
      prev.forEach(({ attr, key, existed, content }) => {
        const el = document.head.querySelector(`meta[${attr}="${key}"]`);
        if (!el) return;
        if (existed) el.setAttribute("content", content);
        else el.remove();
      });
    };
  }, [title, description, primaryImage, url]);

  // Pre-fetch the image(s) so they can be attached to the native share sheet.
  // Falls through the candidate list, and converts WebP/AVIF to JPEG when needed.
  useEffect(() => {
    filesPromiseRef.current = null;
    if (!candidates.length || !navigator.canShare) return undefined;
    filesPromiseRef.current = loadShareFiles(candidates);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidatesKey]);

  // Close the menu on outside click / Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* nothing else to try */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const onShareClick = async () => {
    setReadyHint(false);
    if (navigator.share) {
      // If the image is still downloading, wait for it (up to 10s) instead of sharing without it.
      let files = [];
      let waited = false;
      if (filesPromiseRef.current) {
        const slot = { done: false };
        filesPromiseRef.current.then(() => { slot.done = true; });
        await Promise.resolve(); // let an already-resolved promise flag itself
        waited = !slot.done;
        if (waited) setPreparing(true);
        files = await Promise.race([
          filesPromiseRef.current,
          new Promise((res) => setTimeout(() => res([]), 10000)),
        ]);
        if (waited) setPreparing(false);
      }
      // With an image attached, put the link inside the text too — several apps drop `url` when files are present.
      const data = files.length
        ? { title, text: `${title}\n\n${url}`, files }
        : { title, text: description === title ? "" : description, url };
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // user closed the sheet
        if (err && err.name === "NotAllowedError" && waited && files.length) {
          // Some browsers (iOS Safari) cancel the share if the image took long to prepare.
          // The image is ready now, so the next tap shares instantly.
          setReadyHint(true);
          return;
        }
        // any other failure: fall through to the menu
      }
    }
    setOpen((v) => !v);
  };

  const enc = encodeURIComponent;
  const targets = [
    { key: "whatsapp", label: "WhatsApp", icon: Icon.whatsapp, href: `https://wa.me/?text=${enc(`${title}\n${url}`)}` },
    { key: "facebook", label: "Facebook", icon: Icon.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(title)}` },
    { key: "x", label: "X", icon: Icon.x, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { key: "linkedin", label: "LinkedIn", icon: Icon.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { key: "telegram", label: "Telegram", icon: Icon.telegram, href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}` },
    { key: "mail", label: t("share.email"), icon: Icon.mail, href: `mailto:?subject=${enc(title)}&body=${enc(`${title}\n\n${url}`)}` },
  ];

  return (
    <div className={`sh-wrap${block ? " sh-wrap--block" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className={`sh-btn${preparing || readyHint ? " sh-btn--note" : ""}`}
        onClick={onShareClick}
        aria-busy={preparing}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("share.label")}
      >
        {Icon.share}
        <span>{preparing ? t("share.preparing") : readyHint ? t("share.tapAgain") : t("share.label")}</span>
      </button>

      {open && (
        <div className="sh-menu" role="menu">
          {targets.map((s) => (
            <a
              key={s.key}
              className="sh-item"
              role="menuitem"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              {s.icon}
              <span>{s.label}</span>
            </a>
          ))}
          <button type="button" className="sh-item" role="menuitem" onClick={copyLink}>
            {copied ? Icon.check : Icon.link}
            <span>{copied ? t("share.copied") : t("share.copyLink")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
