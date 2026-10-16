import axios from "axios"

/**
 * Single Axios instance for the whole app.
 *
 * Why one instance instead of calling axios.get(...) directly everywhere:
 * - baseURL lives in one place (env-driven, no hardcoded hosts in feature code)
 * - response/error normalization happens once, not per call site
 * - easy to add auth headers later without touching every API function
 *
 * TIMEOUT STRATEGY
 * ────────────────
 * The global default is 15 s — enough for lightweight GET endpoints.
 * The profile-analysis POST is deliberately issued with `timeout: 0`
 * (no client-side limit) because it runs a multi-step pipeline:
 *   GitHub fetch → repo enrichment → Gemini AI → DB persist.
 * That can legitimately take 30–120 s for large profiles.
 * Removing the fixed 20 s limit prevents premature cancellation on the
 * client side.  Any server-side / hosting-platform limit is separate and
 * must be configured in the backend or infrastructure layer.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  timeout: 15000, // default for lightweight GETs; overridden per-request where needed
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Backend always wraps responses as { success, message?, data }.
 * Unwrap here so feature code works with `data` directly instead of
 * reaching into `.data.data` everywhere.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Unexpected network error"
    return Promise.reject(new Error(message))
  }
)
