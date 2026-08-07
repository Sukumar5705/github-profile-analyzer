import { useMutation } from "@tanstack/react-query"
import { analyzeProfile } from "../api/github"

/**
 * Wraps POST /api/github/analyze/:username as a mutation (not a query)
 * because it's a deliberate, user-triggered action with side effects
 * (writes to DB), not idle background data fetching.
 */
export function useAnalyzeProfile() {
  return useMutation({
    mutationFn: (username: string) => analyzeProfile(username),
  })
}
