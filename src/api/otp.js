/**
 * ===================================================================
 *  OTP VERIFICATION API  —  THE ONLY FILE YOU NEED TO EDIT
 * ===================================================================
 *  Registration now works in two steps:
 *    1. sendOtp()   -> asks your API to send a code to the user's email
 *    2. verifyOtp() -> asks your API to check the code the user typed
 *  The account is created (authApi.register) ONLY after verifyOtp succeeds.
 *
 *  When your OTP API is ready, update the lines marked  <-- UPDATE  below.
 *  Nothing else in the app needs to change.
 * ===================================================================
 */
import axios from "axios";
import { API_BASE } from "./client";

export const OTP_CONFIG = {
  length: 6,            // number of digits in the code
  resendSeconds: 30,    // wait time before "Resend code" is enabled
  expiryMinutes: 10,    // shown to the user as "code expires in ..."

  // <-- UPDATE 1: endpoints. A path like "/auth/send-otp" is added to your API base URL
  //     (REACT_APP_API_URL). A full URL such as "https://otp.example.com/verify" also works.
  sendUrl: "/auth/send-otp",
  verifyUrl: "/auth/verify-otp",

  // <-- UPDATE 2: extra headers if your OTP API needs them (API key, etc.). Otherwise leave {}.
  headers: {},

  // <-- UPDATE 3: request bodies. Rename the fields to match your API.
  buildSendPayload: ({ email, name }) => ({ email, name }),
  buildVerifyPayload: ({ email, otp }) => ({ email, otp }),

  // <-- UPDATE 4: how to read YOUR API's verify response (`body` is the raw JSON).
  //     Return true when the code was accepted. Non-2xx responses are always treated as failure.
  isVerified: (body) => !(body && (body.success === false || body.verified === false)),

  // <-- UPDATE 5 (optional): if your API returns a proof-of-verification token, return it here
  //     and it is sent to /auth/register as `registerTokenField`, so your backend can double-check
  //     that the email was really verified. Return undefined if there is no token.
  readVerificationToken: (body) => {
    const d = (body && body.data) || body || {};
    return d.verificationToken || d.token || undefined;
  },
  registerTokenField: "otpToken",

  // <-- UPDATE 6 (optional): pick the message to show from an error response.
  readErrorMessage: (body) => body && (body.message || body.error),
};

/* ------------------------------------------------------------------ */
/*  Development mock: lets you try the screens before the API exists.  */
/*  Active ONLY in `npm start` (never in a production build).          */
/*  Set REACT_APP_OTP_MOCK=false in .env to test the real API locally. */
/* ------------------------------------------------------------------ */
export const OTP_MOCK =
  process.env.NODE_ENV !== "production" && process.env.REACT_APP_OTP_MOCK !== "false";
export const MOCK_CODE = "123456";

const http = axios.create({ baseURL: API_BASE });

function toError(err) {
  const body = err && err.response && err.response.data;
  return Object.assign(
    fail(OTP_CONFIG.readErrorMessage(body) || "Could not reach the verification service. Please try again."),
    { status: err && err.response && err.response.status }
  );
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (message) => Object.assign(new Error(message), { message });

export async function sendOtp({ email, name }) {
  if (OTP_MOCK) {
    await wait(700);
    // eslint-disable-next-line no-console
    console.info(`[OTP mock] code for ${email}: ${MOCK_CODE}`);
    return;
  }
  try {
    await http.post(OTP_CONFIG.sendUrl, OTP_CONFIG.buildSendPayload({ email, name }), {
      headers: OTP_CONFIG.headers,
    });
  } catch (err) {
    throw toError(err);
  }
}

/** Resolves to { token } when the code is valid; rejects with { message } otherwise. */
export async function verifyOtp({ email, otp }) {
  if (OTP_MOCK) {
    await wait(700);
    if (otp !== MOCK_CODE) throw fail("That code isn't right. Please check and try again.");
    return { token: undefined };
  }
  let res;
  try {
    res = await http.post(OTP_CONFIG.verifyUrl, OTP_CONFIG.buildVerifyPayload({ email, otp }), {
      headers: OTP_CONFIG.headers,
    });
  } catch (err) {
    throw toError(err);
  }
  if (!OTP_CONFIG.isVerified(res.data)) {
    throw fail(OTP_CONFIG.readErrorMessage(res.data) || "That code isn't right. Please try again.");
  }
  return { token: OTP_CONFIG.readVerificationToken(res.data) };
}
