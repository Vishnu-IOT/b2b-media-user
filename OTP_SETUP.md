# OTP verification — where to plug in your API

Registration is now two steps: **details → OTP → account created**.
`/auth/register` is called only after the OTP API accepts the code.

## The one file to edit
`src/api/otp.js` — look for the lines marked `<-- UPDATE`:

| # | What | Default |
|---|------|---------|
| 1 | `sendUrl` / `verifyUrl` (path or full URL) | `/auth/send-otp`, `/auth/verify-otp` |
| 2 | `headers` (API key etc.) | `{}` |
| 3 | `buildSendPayload` / `buildVerifyPayload` (field names) | `{ email, name }` / `{ email, otp }` |
| 4 | `isVerified(body)` (how to read your success response) | success unless `success:false` / `verified:false` |
| 5 | `readVerificationToken(body)` (optional proof token, forwarded to `/auth/register` as `otpToken`) | reads `verificationToken` or `token` |
| 6 | `readErrorMessage(body)` (message shown under the boxes) | `body.message` or `body.error` |

Also adjustable there: `length` (digits), `resendSeconds`, `expiryMinutes`.

## Testing before the API exists
`npm start` runs a **dev-only mock** (code `123456`, shown on screen). It is never active in a production build.
To test your real API locally, add `REACT_APP_OTP_MOCK=false` to `.env` and restart.

## Important: enforce it on the backend too
A frontend gate can be bypassed by calling `/auth/register` directly. Make the backend refuse to register
an email unless it was verified — e.g. require the token from step 5 (or check a "verified" flag for that email).

## Files added / changed
- `src/api/otp.js` (new) — OTP API + config
- `src/components/Auth/OtpInput.jsx`, `OtpStep.jsx`, `RegisterOtp.css` (new)
- `src/pages/RegisterPage.jsx` — two-step flow and new layout
- `src/context/AuthContext.jsx` — `register()` accepts an optional 4th `extra` argument
