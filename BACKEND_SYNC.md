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

## 5. Translation (both directions)
See the comment in `public/index.html`. The Google widget is told the page is written in the OPPOSITE language of the target:
Tamil view = cookie `/en/ta` (English -> Tamil), English view = cookie `/ta/en` (Tamil -> English).
Footer resource categories now come from `GET /resource-categories` and are translatable.

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
