# Backend sync — what changed in the frontend

## 1. Registration is OTP-gated
| Step | Call | Frontend behaviour |
|------|------|--------------------|
| Sign up | `POST /auth/register {name,email,password}` -> `{email}` | No token stored. Shows the OTP screen. 409 / 422 messages appear on the form. |
| Verify | `POST /auth/verify-otp {email,otp}` -> `{user,token}` | Token is stored **only here**, then redirect to `/account`. 400 / 404 / 409 messages appear under the code boxes (409 adds a "Log in" link). |
| Resend | `POST /auth/resend-otp {email}` | "Resend code" link (30 s cool-down after sending). |
| Login | `POST /auth/login` | A 403 containing "verify" redirects to `/verify-email` (email pre-filled, resend available at once). |

Files: `src/api/endpoints.js` (authApi), `src/context/AuthContext.jsx` (register / verifyOtp / resendOtp),
`src/pages/RegisterPage.jsx` (RegisterFlow + VerifyEmailPage), `src/components/Auth/OtpStep.jsx`, `OtpInput.jsx`, `LoginPage.jsx`.

## 2. Newsletter
Single step, no OTP. The API's `alreadySubscribed` flag shows "You're already subscribed".
Unsubscribe page: `/unsubscribe?token=...` and `/newsletter/unsubscribe?token=...` (calls the API once on load).
**Make the link in your unsubscribe email point at one of those two paths on the frontend domain.**

## 3. Two images
Dashboard forms send `coverImage` + `coverImage2` (stories, strategies) and `image` + `image2` (achievements, products).
Editing shows the saved image; leaving the picker empty keeps it. Detail pages and the achievements rows render both.

## 4. Business language
Dashboard -> Business Profile has a Language dropdown (en / ta), saved with `PUT /business/me { language }`.
On load, `business.language` is applied to the interface once per browser session (see `DashboardPage.jsx`).
NOTE: `/dashboard` is a new protected route (linked from Account for BUSINESS_ADMIN) because the dashboard page was not routed before.

## 5. Translation (per section, both directions)
The page-wide Google Translate widget is gone. There are now two separate systems:
- **Static UI text** (nav, footer, section titles such as Top Picks / Conversations / In-Depth, buttons, labels) comes from
  `public/i18n/en.json` + `ta.json` via `t("key")`. It is never machine-translated. Add new static text there (both files).
- **API text** (story/strategy/achievement/product titles, excerpts, industries, resource categories, enquiry and question text)
  is translated by the section that shows it: `const { tr, pending } = useSectionTranslator();` then `{tr(item.title)}`.
  Each section has its own translator and only translates the strings it renders. Text already in the target language is skipped,
  so content written in either language ends up correct. Company/person names are not passed through `tr`.
- Switching language is instant (no cookie, no reload). Results are cached in memory + localStorage (`vartha_tr_cache_v1`).
- Provider: by default Google's public `gtx` endpoint (no key, unofficial, can be throttled). For production set
  `REACT_APP_TRANSLATE_URL` to a backend route that accepts `POST { target: "ta"|"en", texts: [...] }` and returns
  `{ translations: [...] }` (or `{ data: { translations: [...] } }`) in the same order. Files: `src/i18n/translator.js`,
  `src/hooks/useSectionTranslator.js`.
- Sections converted: ALL content pages and cards — Home sections, Footer categories, Stories / Strategies / Achievements /
  Products / Videos / Enquiries / Resources (index + detail pages, related strips, article bodies), Community Q&A (cards + question
  detail), Business directory cards and Business profile tabs. Article/long text is translated per paragraph by `ArticleBody`.
  Not translated on purpose: company/person names, the Search page (results must match what the visitor typed), and the
  Account/Dashboard/Login/Register screens (those are the user's own data and forms).
- Retry behaviour: each string is requested/cached/failed on its own. If the public endpoint throttles a request, only that string
  keeps its original text and it is retried automatically (up to 3 attempts, growing delay) — it no longer stays untranslated
  for the whole session. localStorage cache key is now `vartha_tr_cache_v2` (old v1 cache is cleared on first load).
- Dates follow the language (`formatDate(date, lang)` -> en-IN / ta-IN) and "min read" comes from `common.minRead`.
- New static keys for these pages were added to BOTH `en.json` and `ta.json` (videos.*, products.*, enquiries.*, community.*,
  resources.*, directory.*, profile.*). Keep the two files in sync when adding more.

## 6. Search page
`/search?q=...` (header search icon). Queries stories, strategies, achievements, products, businesses, enquiries, videos,
resources and community questions in parallel, sending `q` to each endpoint AND re-checking every word on the client,
so it works whether or not an endpoint filters by `q`. Only the first 30 items per type are fetched per search.
`/businesses` is also registered now (the header icon used to point at it and showed "Not Found").
File: `src/pages/SearchPage.jsx`, styles in `src/styles/search-page.css`.

## 7. Welcome screen after signup
After OTP verification the user is logged in and shown `components/Auth/WelcomeScreen.jsx`: it asks them to check their
email to visit their dashboard and post stories. It stays until they pick "Explore stories" or "Go to my account".
The text assumes your backend sends that dashboard email on verification.
