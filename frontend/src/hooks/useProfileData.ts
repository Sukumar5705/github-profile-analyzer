import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  analyzeProfile,
  getProfile,
} from "@/api/github"

import type {
  AnalyzeProfileResponse,
  SingleProfileResponse,
} from "@/types/api"

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
 * Primarily used by the Landing Page search flow.
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