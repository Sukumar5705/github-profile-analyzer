import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  analyzeProfile,
  getProfile,
  getAnalysisProgress,
} from "@/api/github"

import type {
  AnalyzeProfileResponse,
  SingleProfileResponse,
} from "@/types/api"

import type { AnalysisProgress } from "@/api/github"

/**
 * Central query-key factory.
 *
 * Keeping query keys in one place avoids subtle cache bugs
 * caused by slightly different key strings.
 */
export const profileKeys = {
  all: ["github-profiles"] as const,

  detail: (username: string) =>
    [
      ...profileKeys.all,
      username.toLowerCase(),
    ] as const,
}

/**
 * Fetch an already analyzed profile.
 *
 * Used by DashboardPage.
 */
export function useProfile(
  username: string
) {
  return useQuery<
    SingleProfileResponse,
    Error
  >({
    queryKey:
      profileKeys.detail(username),

    queryFn: () =>
      getProfile(username),

    enabled:
      username.trim().length > 0,

    staleTime:
      2000 * 60 * 5,

    retry: 1,
  })
}

/**
 * Run a fresh GitHub analysis.
 *
 * Primarily used by the AnalyzingPage (loading screen) flow.
 * retry is false intentionally — a failed analysis should not automatically
 * re-trigger an expensive pipeline; the user must click Retry explicitly.
 */
export function useAnalyzeProfile() {
  const queryClient =
    useQueryClient()

  return useMutation<
    AnalyzeProfileResponse,
    Error,
    string
  >({
    mutationFn: (
      username: string
    ) =>
      analyzeProfile(username),

    retry: false, // no automatic retries — analysis is expensive and user-triggered

    onSuccess: (
      _data,
      username
    ) => {
      /*
       * The POST response and GET response are not currently
       * identical, so we invalidate rather than placing the
       * POST response directly into the GET cache.
       *
       * DashboardPage will then fetch the normalized persisted
       * representation.
       */
      queryClient.invalidateQueries({
        queryKey:
          profileKeys.detail(username),
      })
    },
  })
}

/**
 * Poll the backend's live pipeline stage while an analysis is in flight.
 *
 * `enabled` should be tied to the analyze mutation's `isPending` — polling
 * starts right when the POST fires and stops as soon as it settles
 * (success or error), regardless of whether a particular poll caught the
 * `done` flag first.
 */
export function useAnalysisProgress(
  username: string,
  enabled: boolean
) {
  return useQuery<AnalysisProgress, Error>({
    queryKey: ["analysis-progress", username.toLowerCase()],
    queryFn: () => getAnalysisProgress(username),
    enabled: enabled && username.trim().length > 0,
    staleTime: 0,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.done ? false : 1200,
  })
}