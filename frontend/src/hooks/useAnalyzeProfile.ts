/**
 * Kept only so existing imports don't break — this now just re-exports
 * the canonical implementation from useProfileData.ts, which invalidates
 * the GET /profiles/:username cache on success. The old version here used
 * to duplicate useMutation WITHOUT that invalidation, which is why
 * AnalyzingPage could navigate to /dashboard/:username and still render
 * stale (or no) data: DashboardPage reads from the GET query cache, and
 * nothing was telling it to refetch.
 *
 * Don't reintroduce a second implementation here — always import
 * useAnalyzeProfile from "./useProfileData".
 */
export { useAnalyzeProfile } from "./useProfileData"
