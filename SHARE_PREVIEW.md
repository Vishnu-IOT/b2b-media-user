# Share button — how previews work

`src/components/Share/ShareButton.jsx` is used on every detail page (stories, strategies,
achievements, products, enquiries, videos, resources, community Q&A).

## What is shared
- **Title** — the post title (in the language currently selected on the site)
- **Link** — the page URL, which opens that exact post
- **Image** — the post's cover image
  - Phones/browsers with the native share sheet: the image is attached together with the title + link
  - Other apps/desktop menu: WhatsApp, Facebook, X, LinkedIn, Telegram, Email, Copy link (title + link)

## Rich link cards (image shown automatically when a link is pasted)
WhatsApp, Facebook, LinkedIn, Telegram, etc. read `og:title` / `og:image` from the raw HTML
of the link and do NOT run JavaScript. This is a Create-React-App site, so the raw HTML is the
same for every URL. To get a per-post card, serve the og tags for crawler requests.

Example for the Express backend (answer bots only, normal visitors still get the React app):

```js
const BOTS = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|TelegramBot|Slackbot|Discordbot/i;

app.get(["/stories/:id", "/strategies/:id", "/achievements/:id"], async (req, res, next) => {
  if (!BOTS.test(req.get("user-agent") || "")) return next();
  const post = await /* load the post by req.params.id */;
  const img = `${process.env.API_ORIGIN}${post.coverImage}`;
  res.send(`<!doctype html><html><head>
    <meta charset="utf-8"><title>${post.title}</title>
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.summary || ""}">
    <meta property="og:image" content="${img}">
    <meta property="og:url" content="https://YOUR-DOMAIN${req.originalUrl}">
    <meta name="twitter:card" content="summary_large_image">
  </head><body></body></html>`);
});
```
(Escape the values in real code.)  Image tip: use a full https URL, ideally 1200x630.

## Native share with image
The image is fetched with CORS to attach it to the share sheet. If your uploads
are served by Express, make sure `cors()` also applies to `/uploads` — otherwise the
share still works, just without the attached image.

## Troubleshooting: "my post has an image but the share has none"
1. **Which image is used** — the button tries `coverImage` first, then `coverImage2`
   (`image` / `image2` for achievements and products). The first one that loads is shared.
2. **Open the browser console** (phone: Chrome remote debugging) and click Share. If you see
   `[ShareButton] could not attach image: ... Failed to fetch`, the uploads folder is not
   sending CORS headers. Fix in the Express backend:
   ```js
   const cors = require("cors");
   // if you use helmet:
   // app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
   app.use("/uploads", cors(), express.static(path.join(__dirname, "uploads")));
   ```
   (If the frontend and `/uploads` are on different domains this is required.)
3. **Desktop menu (WhatsApp / Facebook / X ...)** can only send text + link. Their cards get
   the image from the link's og:image tag — see the section above.
4. WebP/AVIF images are converted to JPEG automatically before attaching.

## Image SIZE matters (why only some posts lose the image)
- **Native share (phones):** the button now resizes every image to max 1200px and compresses it to
  JPEG (~350 KB or less) before attaching, so big uploads work too. If the image is still being
  prepared when you tap Share, the button shows "Preparing…" and waits (up to 10s). On iOS Safari
  it may ask for one more tap ("Ready — tap again") — the second tap shares instantly.
- **Link previews (WhatsApp / Facebook / Telegram):** these read `og:image` from your server and
  ignore images that are too heavy (WhatsApp skips roughly anything above ~300 KB; Facebook wants
  <8 MB, ideally 1200x630). The browser cannot shrink these — the SERVER must serve a small copy.
  Add a resize route with `sharp` (`npm i sharp`) in the Express backend and point `og:image` at it:

```js
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// GET /og-image?src=/uploads/images/abc.jpg  ->  1200x630 JPEG, small file
app.get("/og-image", async (req, res) => {
  try {
    const src = String(req.query.src || "");
    if (!src.startsWith("/uploads/") || src.includes("..")) return res.sendStatus(400); // local uploads only
    const file = path.join(__dirname, src);
    if (!fs.existsSync(file)) return res.sendStatus(404);
    const buf = await sharp(file)
      .rotate()
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    res.set({ "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=604800" });
    res.send(buf);
  } catch (e) {
    res.sendStatus(500);
  }
});
```
Then in the crawler HTML from the section above use:

```js
const img = `${process.env.API_ORIGIN}/og-image?src=${post.coverImage || post.coverImage2}`;
```
