# Vartha — Business Media & Knowledge Platform (Frontend)

A React frontend for a local business-media and knowledge-sharing platform, wired to
a real Node/Express + MySQL backend (`b2b-media-backend`). No mock data — everything
you see is fetched from the API.

## Scope

Only the areas the backend actually supports:

- **Business Stories** — growth journeys and company background
- **Achievements** — awards, certifications, milestones
- **Strategies** — marketing/growth approaches and lessons
- **New Products** — launches and upcoming products
- **Supplier Enquiries** — requirements businesses are looking to fill
- **Business Videos** — YouTube or uploaded videos
- **Business Q&A** — ask/answer, Reddit/Quora-style
- **Resources** — posts grouped by category (Marketing & Sales, GST & Tax, MSME, Startup)
- **Business Directory & Profiles**

No booking, checkout, payments, or marketplace features — content only.

## Running it

1. Start the backend first (see its own README): migrate + seed the MySQL database,
   then `npm run dev` (defaults to `http://localhost:5000`).
2. In this project, copy `.env.example` to `.env` and point `REACT_APP_API_URL` at
   your backend's `/api` base URL if it isn't the default.
3. `npm install && npm start` — runs at `http://localhost:3000`.

## Project structure

```
src/
├── api/            client.js (axios + JWT + response unwrapping), endpoints.js (every real API call)
├── context/        AuthContext (login/register/logout/me)
├── hooks/          useFetch (generic API-call state hook)
├── components/     One folder per feature, matching the backend content types
│   ├── Header/             Fullscreen mega-nav (Business / Community / Resources)
│   ├── Hero/                Featured Business Story
│   ├── BusinessStory/       Latest Stories editorial feed
│   ├── Achievements/        Compact-row achievements feed
│   ├── Strategies/          Strategy cards
│   ├── ProductShowcase/     Product cards
│   ├── Enquiries/           Supplier enquiry cards
│   ├── Videos/              Video cards + YouTube/upload embedding
│   ├── BusinessQA/          Question feed + Ask form
│   ├── ResourceHub/         Resource cards
│   ├── BusinessDirectory/   Filterable directory + cards
│   ├── BusinessProfile/     Tabbed editorial company profile
│   ├── Auth/                Login/register form styling + ProtectedRoute
│   ├── Dashboard/           Business profile setup + generic content manager
│   └── common/               StateMessage (Loading/Error/Empty)
├── pages/          Route-level pages (index + detail for each content type)
├── styles/         Design tokens (variables.css), article.css, responsive.css
└── utils/          text.js (excerpt/date/reading-time/YouTube helpers), resourceBuckets.js
```

## Auth & Account

Content creation/moderation is handled by a separate admin app — this frontend is
user-facing only. Logging in or registering here gets you a simple `/account` page
(name, email, account type) and lets you participate in Business Q&A (ask/answer).

## Resource category buckets

The backend ships 9 real resource categories (Marketing, Sales, Business Strategy,
GST, Tax, MSME, Startup, Finance, Government Schemes). The nav's 4 requested groups
(Marketing & Sales, GST & Tax, MSME Benefits, Startup & Local Business) are a
**frontend-only grouping** of those real categories — see `src/utils/resourceBuckets.js`.
The Resources page also lets you filter by any single real category.

## Notes

- File uploads (logos, cover images, videos, thumbnails) are sent as `multipart/form-data`
  automatically whenever a payload contains a `File` — see `toFormData()` in `api/endpoints.js`.
- `fileUrl()` in `api/client.js` resolves any path the API returns (e.g. `/uploads/images/x.jpg`)
  against the backend's origin.
