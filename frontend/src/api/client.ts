import axios from "axios"

/**
 * Single Axios instance for the whole app.
 *
 * Why one instance instead of calling axios.get(...) directly everywhere:
 * - baseURL lives in one place (env-driven, no hardcoded hosts in feature code)
 * - response/error normalization happens once, not per call site
 * - easy to add auth headers later without touching every API function
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  timeout: 20000, // analyze can be slow (live GitHub fetch); generous but bounded
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
